import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const INVOKE_MODEL = process.env.EVAL_MODEL ?? "claude-haiku-4-5-20251001";
const JUDGE_MODEL = process.env.JUDGE_MODEL ?? "claude-sonnet-4-6";

interface Criterion {
  criterion: string;
  passed: boolean;
  reason: string;
}

interface SkillResult {
  skill: string;
  criteria: Criterion[];
  passed: boolean;
  error?: string;
}

function findSkillPath(skillName: string): string {
  const pluginJson = JSON.parse(
    readFileSync(join(REPO_ROOT, ".claude-plugin/plugin.json"), "utf8")
  );
  const skillPath = (pluginJson.skills as string[]).find((p) =>
    p.endsWith(`/${skillName}`)
  );
  if (!skillPath) throw new Error(`"${skillName}" not found in plugin.json`);
  return skillPath;
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

async function evalSkill(client: Anthropic, skillName: string): Promise<SkillResult> {
  const skillPath = findSkillPath(skillName);
  const skillMd = readFileSync(join(REPO_ROOT, skillPath, "SKILL.md"), "utf8");
  const trigger = readFileSync(
    join(__dirname, "skills", skillName, "trigger.md"),
    "utf8"
  );
  const rubricRaw = readFileSync(
    join(__dirname, "skills", skillName, "rubric.md"),
    "utf8"
  );

  // Step 1: invoke the skill
  const skillResponse = await client.messages.create({
    model: INVOKE_MODEL,
    max_tokens: 2048,
    system: [{ type: "text", text: skillMd, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: trigger }],
  });

  const firstBlock = skillResponse.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    throw new Error(`invoke returned no text block (stop_reason: ${skillResponse.stop_reason})`);
  }
  const responseText = firstBlock.text;
  if (!responseText.trim()) {
    throw new Error("invoke returned an empty response");
  }

  // Step 2: judge against rubric (skillMd omitted — rubric encodes the scoring criteria)
  const judgeResponse = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: "You are a precise evaluator. Return ONLY valid JSON — no prose, no markdown fences.",
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Evaluate whether this agent response satisfies each rubric criterion.

<user_trigger>
${trigger}
</user_trigger>

<agent_response>
${responseText}
</agent_response>

<rubric>
${rubricRaw}
</rubric>

For each criterion in the rubric, return a JSON array:
[{"criterion": "<exact criterion text>", "passed": true|false, "reason": "<one sentence>"}]`,
      },
    ],
  });

  const judgeBlock = judgeResponse.content[0];
  if (!judgeBlock || judgeBlock.type !== "text") {
    throw new Error("judge returned no text block");
  }

  let criteria: Criterion[];
  try {
    criteria = JSON.parse(stripFences(judgeBlock.text.trim()));
  } catch {
    throw new Error(`judge returned unparseable JSON: ${judgeBlock.text.slice(0, 120)}`);
  }

  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("judge returned empty criteria array");
  }

  return {
    skill: skillName,
    criteria,
    passed: criteria.every((c) => c.passed),
  };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  // Instantiated after key guard so construction-time SDK errors surface cleanly
  const client = new Anthropic();

  const targetSkill = process.argv[2];
  const evalSkillsDir = join(__dirname, "skills");
  const skills = targetSkill
    ? [targetSkill]
    : readdirSync(evalSkillsDir).filter((d) =>
        existsSync(join(evalSkillsDir, d, "trigger.md"))
      );

  console.log(`invoke model : ${INVOKE_MODEL}`);
  console.log(`judge model  : ${JUDGE_MODEL}`);
  console.log(`skills       : ${skills.length}\n`);

  const results: SkillResult[] = [];

  for (const skill of skills) {
    process.stdout.write(`${skill.padEnd(40)}`);
    try {
      const result = await evalSkill(client, skill);
      results.push(result);
      console.log(result.passed ? "pass" : "FAIL");
      for (const c of result.criteria) {
        if (!c.passed) console.log(`  ✗ ${c.criterion}\n    ${c.reason}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      results.push({ skill, criteria: [], passed: false, error });
      console.log(`ERROR: ${error}`);
    }
  }

  const passed = results.filter((r) => r.passed).length;
  console.log(`\n${passed}/${results.length} passed`);
  process.exit(passed === results.length ? 0 : 1);
}

main();
