Skills are organized into bucket folders under `skills/`:

- `engineering/` — daily code work
- `productivity/` — daily non-code workflow tools
- `misc/` — kept around but rarely used
- `personal/` — tied to my own setup, not promoted
- `in-progress/` — drafts not yet ready to ship
- `deprecated/` — no longer used

Every skill in `engineering/`, `productivity/`, or `misc/` must have a reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`. Skills in `personal/`, `in-progress/`, and `deprecated/` must not appear in either.

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`.

`.claude-plugin/marketplace.json` lists this repo as an installable Claude Code marketplace. It is not subject to the skill-listing invariants above — it describes the plugin bundle, not individual skills.

`evals/` contains a TypeScript eval harness for testing skills against the Claude API. Run with `ANTHROPIC_API_KEY=sk-... npx tsx runner.ts [skill-name]` from inside `evals/`. Each skill has a `trigger.md` (input) and `rubric.md` (pass/fail criteria). When adding or removing a skill from `plugin.json`, add or remove the matching `evals/skills/<name>/` fixture.

When shipping a skill from `in-progress/`, also remove its entry from `skills/in-progress/README.md`.

`.out-of-scope/*.md` files are active triage knowledge read by `/triage` — do not delete them.

Parallel worktrees that both touch `README.md`, `skills/<bucket>/README.md`, or `plugin.json` will conflict on octopus merge — resolve by keeping all added entries.
