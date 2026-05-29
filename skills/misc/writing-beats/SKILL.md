---
name: writing-beats
description: Shape an article as a journey of beats, choose-your-own-adventure style. The user picks a starting beat from the raw material, you write only that beat, then offer options for where to pivot next, beat by beat, until the article reaches a natural end. Use when the user has raw material and wants to assemble it as a narrative rather than an argument.
---

<what-to-do>

The user has passed (or will pass) a markdown file of raw material, or will paste raw material directly into the chat. If they paste it inline, treat that as the pile — no file read needed.

If the user did not say where to save the article, ask once and remember the path.

Then run a beat-by-beat journey:

1. Write 2–3 candidate **starting beats**, drawn from the raw material. Each is a different entry point into the article. Show the user the beats before writing anything to the article file. For each candidate, preview where it might lead next — a glimpse a little way down the path. The user picks one.
2. Once the user picks a beat, write **only that beat** to the article file. Stop there.
3. Offer 2–3 candidate **next beats** — different directions the journey could pivot to from where the article now stands. For each candidate, preview where it might lead next.
4. Loop steps 2–3 until the article reaches a natural end.

</what-to-do>

<supporting-info>

## What is a beat

A beat is one move in the journey. It does one thing — sets a scene, lands a point, asks a question, drops an aside, twists the angle. Then it stops, leaving the reader at a place where the next beat can pivot.

A beat is sized by what it needs:

- A single sentence if that's all the move is ("And then nothing happened for three weeks.").
- A short paragraph if the move needs setup.
- Multiple paragraphs if the beat is a self-contained vignette, argument, or example.

If a "beat" needs five paragraphs and three subheadings, it's not a beat — it's two beats glued together. Split it.

## Writing one beat

Once a beat is picked, write _that beat only_ to the article file. Do not write the next beat.

Pull material from the raw pile to populate the beat. You can paraphrase, split, recombine, or quote. The pile is a quarry.

## Ending the journey

The article ends when the journey is complete — not when the pile is empty. Most piles will have leftover fragments that don't make it in. That is fine; that is the point of having more raw material than you need.

## Writing rhythm

- Append one beat at a time. Never write ahead.
- Re-read the article file from disk before every write (skip if raw material was inline). Preserve user edits absolutely.
- If the user edits a previous beat substantially, let it change what comes next.
- If the user says "rewrite that beat" or "go back and try a different beat 3", do it — edit in place, leave the rest alone.

</supporting-info>
