# Agents and security

## Trust boundary

Automatic approval protects resources outside the selected clone and host-level capabilities. Everything scoped to the clone remains trusted, including its development state and repository-scoped GitHub credential. Commit or back up important work before autonomous sessions.

The workspace runs as a non-root user under layered process restrictions and has no container-engine socket. Bubblewrap provides the inner command sandbox. Enforced security configuration is mounted read-only; project files and Git metadata remain writable for normal development.

Claude and Codex enforce workspace-only execution, deny credential paths, and limit child-command network access to approved development endpoints. Agent applications and read-only research retain their required provider egress. This boundary is not data-loss prevention: prompts and searches can transmit information supplied to them.

Startup fails when an enforced boundary does not validate. Do not bypass checks or broaden the network allowlist to make a task pass.

## Clone-local state

Ignored `.agent-state/` subdirectories are mounted at the agents' state paths and Git preference path. The workspace-visible `.agent-state/` path is masked. Claude and Codex history are disabled by default.

State is plaintext, shared by all worktrees in the clone, and can contain the repository-scoped GitHub credential. Deleting the primary checkout or running `git clean -fdx` can destroy it. Recover by authenticating again; never copy tokens automatically from another profile.

Use a fine-grained GitHub token limited to this repository with Contents read/write and no additional permissions. Protect the default branch and release tags against direct pushes, deletion, and force pushes. Token scope alone cannot enforce safe ref operations.

Codex runtime aliases use a separate Compose-project volume, so independent Codex sessions belong in separate worktree containers. The container replaces clone-local Codex defaults on each post-create run while preserving authentication.

## Host and maintenance

Do not mount host Claude, Codex, Git, GitHub CLI, SSH-agent, or GPG-agent state. These can contain credentials, executable hooks, providers, MCP servers, or settings that weaken the boundary. Configure Cursor as described in [`windows.md`](windows.md).

Rebuilding after changes to the Dockerfile, Compose files, seccomp profile, or managed agent policy is a trust event and requires review outside autonomous mode. Dependency lifecycle scripts remain disabled unless explicitly reviewed and allowlisted.

The seccomp profile is based on Moby's pinned default at commit [`f9bc03e`](https://github.com/moby/profiles/blob/f9bc03ec19b2dc4c091449b08e88f85c0caa9f0b/seccomp/default.json), with only the namespace and mount operations required by rootless Bubblewrap. Do not generate or download it during startup.
