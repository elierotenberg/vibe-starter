# Local agent state

This directory is the persistent agent-state boundary for one clone. Runtime files are ignored by Git and excluded from Docker build contexts. The primary checkout and every linked worktree beneath `.worktrees/<slug>` intentionally share the same Claude and Codex authentication state.

Important limitations:

- State is plaintext on the WSL filesystem. Git ignore rules are not encryption or access control.
- All worktrees in this clone are one credential trust domain. Signing out or rotating a token affects all of them.
- `git clean -fdx` can delete ignored state. Recovery is to authenticate again; never copy tokens into source control or an automatic backup.
- Removing or moving the primary checkout breaks state mounts for linked worktrees.
- The container masks `/workspace/.agent-state`. Agent applications receive only their exact state subdirectory at their normal config path.

Place optional non-secret preference imports under `preferences/`. They are not loaded by default. Never place hooks, MCP servers, environment variables, tokens, provider settings, network rules, or executable commands there.
