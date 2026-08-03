# Working principles

Read the process and safety rules for every task. Read craft rules when the task touches their subject. Repository-specific instructions and explicit user direction take precedence.

## Process and safety

- [Scope and authority](scope-and-authority.md) — act autonomously inside the requested, reversible repository scope; ask before expanding authority or causing external effects.
- [Honest assessment](honest-assessment.md) — verify claims, challenge assumptions, and change position when evidence changes.
- [No hidden workarounds](no-hidden-workarounds.md) — report blockers instead of routing around them or weakening constraints.
- [Never disable checks](never-disable-checks.md) — fix causes; do not suppress validation to obtain a green result.
- [No silent fallbacks](no-silent-fallbacks.md) — required inputs fail explicitly when absent or invalid.
- [Use current sources](use-current-sources.md) — verify unstable APIs, versions, and security behavior against authoritative sources.
- [Durable artifacts](durable-artifacts.md) — keep transient work local and record lasting decisions without leaking confidential provenance.

## Craft

- [Code comments](code-comments.md) — document durable constraints and rationale, not the diff.
- [Testing](testing.md) — test observable behavior with deterministic, independently owned state.
- [TypeScript safety](typescript-safety.md) — preserve inference, narrow unknown values, and avoid unchecked assertions.
- [Agent-neutral skills](agent-neutral-skills.md) — keep shared skills under `.agents/skills/`.
