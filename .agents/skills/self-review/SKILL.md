---
name: self-review
description: Adversarially inspect and verify completed repository changes before handoff. Use after implementing or modifying code, configuration, tests, documentation, or infrastructure; before claiming work is complete; or when the user asks to review, check, or validate the agent's own changes.
---

# Self-review

Review the final filesystem state, not recollection or test output alone.

1. Read governing instructions and identify every changed, staged, and untracked file without mutating Git.
2. Read every relevant changed file in full, including generated artifacts.
3. Compare the result with the request and separate task changes from unrelated work.
4. Check scope, failure behavior, edge cases, concurrency, platform assumptions, trust boundaries, credentials, permissions, external effects, package ownership, types, tests, documentation, debug artifacts, and secrets.
5. Confirm tests cover observable behavior without weakened, skipped, or deleted assertions.
6. Run focused checks and `pnpm verify`. Do not bypass or weaken a failing check.
7. Re-read changed areas after fixes.

Report findings with file and line evidence. Fix findings when authorized; otherwise return them unresolved. If clean, state what was reviewed, checks passed or unavailable, and remaining manual validation. Never claim completion while required checks fail or relevant files remain unread.
