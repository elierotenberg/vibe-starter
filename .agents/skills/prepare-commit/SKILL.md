---
name: prepare-commit
description: Review current repository changes and draft self-contained commit message files without creating commits or mutating Git. Use when the user asks to prepare, draft, write, or review a commit message or asks how the current work should be split into commits.
---

# Prepare commit

Invoke the sibling `self-review` skill first. Stop on unresolved findings, failed required verification, or an incomplete view of the proposed change. This skill does not mutate Git.

## Boundaries

- Keep source, tests, generated output, and documentation together when they form one change.
- Split independently useful or independently reversible changes with different purposes.
- For a series, specify the order and exact files or hunks for each commit without altering the index.

## Message

Follow repository conventions or use:

```text
<type>(<scope>): <imperative summary>

<durable problem>

<solution>
```

Use `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `ci`, or `chore`. Use the owning package as scope or `workspace` for root and cross-workspace changes.

- Keep the subject imperative, specific, at most 72 characters, and without a trailing period.
- Add a body for non-trivial changes and wrap commit-message prose at 72 characters.
- Record breaking changes explicitly.
- Exclude file narration, diff summaries, AI attribution, chat history, temporary status, and unverifiable claims.

Write one draft to `COMMIT-MESSAGE.local.md` or a series to numbered `COMMIT-MESSAGE.local.NN.md` files. Confirm the files are ignored and show their complete contents. Do not stage, commit, or push as part of this skill.
