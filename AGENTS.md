# Agent guide

This repository is a framework-neutral TypeScript workspace. The root is a private pnpm workspace project; applications live in `apps/*`, reusable packages in `packages/*`, and Google Wireit owns the task graph.

## Normal workflow

- Use the root `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm verify` scripts. Each canonical package script must remain a thin `wireit` entry.
- Put commands and dependencies under the owning package's `package.json#wireit`. Register cross-package dependencies with Wireit's relative `<path>:<script>` syntax.
- Keep repository automation in erasable `.ts` files that run directly on the pinned Node version. Do not add `tsx`, `ts-node`, generated JavaScript, or shell orchestration.
- Run `pnpm verify` before claiming implementation work is complete.
- Never manually wrap Markdown prose; keep each paragraph on one source line so humans can edit it easily. Preserve deliberate line structure in code blocks and tables, and wrap commit messages when appropriate.
- Do not write comma-separated prose lists. If the individual items matter, use a Markdown list. Otherwise, name the shared concept.

## Working principles

- Read `.agents/memory/MEMORY.md` before repository-changing work. Apply every linked process and safety rule; read the linked craft rules relevant to the task.
- Treat the memory files as durable project policy, not enforcement. Keep them concise, framework-neutral, and consistent with this guide and the root-owned managed controls.
- When a task reveals a reusable project-wide rule, recurring pitfall, or durable decision that is not already documented, briefly offer to add or update the relevant `.agents/memory` file. Do not propose memory for task-specific details, temporary state, or information already clear from code or documentation.

## Safety boundary

- The current checkout is the only normal write scope. Treat its uncommitted files and development database as disposable.
- Never inspect, edit, copy, print, or clean `.agent-state`, `~/.claude`, `~/.claude.json`, `~/.codex`, authentication data, secret-bearing `.env` files, or host credentials.
- Normal Git work is allowed inside the selected checkout: inspect history, stage task-owned changes, create commits, fetch, create or switch task branches, update the current branch with a fast-forward-only pull, and push the current non-default branch with a plain push. Do not include unrelated user changes in a commit.
- Never force-push, delete remote branches or tags, push tags, change remotes, push directly to the default or another protected branch, bypass branch protection, or continue after a non-fast-forward push rejection. Opening or merging pull requests, publishing, releasing, deploying, and other external mutations still require explicit user direction.
- Never access a container-engine socket, elevate privileges, alter mounts, or use credentials outside the repository workflow the user requested.
- Do not weaken sandbox, managed policy, mount, CI, or credential controls to make a task pass. If an enforced sandbox is unavailable, stop.
- `.devcontainer/`, `compose.yaml`, `.claude/`, `.codex/`, `.github/workflows/`, and `CLAUDE.md` are security-sensitive and human-maintained.

The repository instructions explain intent; root-owned managed policy and OS sandboxes are the enforcement boundary.
