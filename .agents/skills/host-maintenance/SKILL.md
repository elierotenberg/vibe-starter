---
name: host-maintenance
description: Prepare a human-executed WSL maintenance handoff when required work is blocked by protected repository paths, the managed sandbox, Dev Container lifecycle boundaries, or host-only configuration. Use when an agent must provide exact reviewable WSL commands or create a gitignored local script for the user instead of performing or bypassing a restricted operation.
---

# Host maintenance

Keep the enforced boundary intact. Verify the blocker with read-only inspection and minimize the required human action. Never propose weakening the sandbox, exposing a container-engine socket, broadening credentials, or making protected paths generally writable.

## Choose a handoff

- Provide up to three direct commands when their effects are obvious.
- For a multi-step operation, create an ignored `<purpose>.local.sh` in the repository root.
- For substantial protected-file changes, create an ignored `<purpose>.local.patch` and a script that runs `git apply --check` before `git apply`.
- Never execute the script or apply the patch.

## Write scripts

- Use `#!/usr/bin/env bash` and `set -euo pipefail`.
- Derive the repository root from the script location and verify repository sentinel files.
- Use linear code, explicit quoted paths, and one operation per step.
- Comment every mutation with its effect, risk, and recovery implications.
- Validate expected current state before mutation and fail clearly on drift.
- Avoid `eval`, dense pipelines, nested substitutions, opaque rewrites, unresolved globs, broad permission changes, recursive deletion, force Git operations, privilege escalation, and downloaded executable content.
- Never target `$HOME`, `~`, `/`, another repository, or user-specific absolute paths.
- Include no credentials, secrets, or secret-bearing output.
- Limit network and external state changes to what the user explicitly requested.
- End with focused verification that the user can return to the agent.

Do not set the executable bit. Tell the user to review the entire artifact and run it with `bash ./<purpose>.local.sh` from the repository root.

## Hand off and continue

State the blocking boundary, every file or external resource affected, network or privilege use, remaining risks, the review and execution commands, expected success output, and what output to return. State that the agent created but did not execute the artifact.

After execution, inspect the resulting state and run focused checks plus `pnpm verify`. Do not delete local handoff artifacts unless requested.
