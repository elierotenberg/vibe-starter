# TypeScript project starter

A framework-neutral pnpm workspace for AI-assisted TypeScript development with a secured Dev Container, Docker Compose services, Google Wireit, Claude Code, Codex, and linked worktrees.

## Requirements

- Windows 11 with WSL 2 and Docker Desktop's WSL backend, or Linux.
- The checkout on a Linux filesystem, not `/mnt/c` or native NTFS.
- VS Code or Cursor with Dev Containers.

macOS is best effort.

## Start

Before enabling automatic approval in Cursor, apply the host credential settings in [`docs/windows.md`](docs/windows.md). Review `.devcontainer/`, `compose.yaml`, `.claude/`, `.codex/`, `AGENTS.md`, and CI before rebuilding a fork; container configuration is executable code.

Open the WSL checkout and choose **Dev Containers: Reopen in Container**. Startup validates the security boundary and performs a frozen pnpm install without dependency lifecycle scripts.

Inside the container:

```text
claude
codex
pnpm verify
```

Agent authentication persists under the ignored `.agent-state/` directory and is shared by worktrees in the clone. Host agent settings and credentials are not mounted.

Authenticate GitHub inside the container with a fine-grained token restricted to this repository and repository Contents read/write only. Protect the default branch and release tags because Contents write permits consequential ref operations.

```text
gh auth login --hostname github.com --git-protocol https --with-token
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Workspace

```text
apps/*       applications
packages/*   reusable packages
scripts/*    TypeScript repository automation
```

```text
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
```

Google Wireit owns the task graph. Participating packages expose thin `wireit` scripts and own their commands and dependencies.

The root `package.json#packageManager` is the only pnpm pin. Dev Container agent CLIs are pinned separately with their transitive dependencies in `.devcontainer/tools/package.json` and its npm lockfile. Dependabot checks both toolchains and the container image.

The container enables the native-preview TypeScript language service. Command-line type checking uses the workspace TypeScript version.

Use `.env-example` for public configuration names. Real `.env` files are ignored and inaccessible to managed agents.

## Security and agents

Automatic approval protects the host and unrelated credentials, not the selected checkout, its Git metadata, development data, feature branches, or repository-scoped GitHub credential. The workspace is non-root, has no container-engine socket or host credential mounts, restricts command egress, and mounts enforced agent, container, and CI configuration read-only. See [`docs/agents-and-security.md`](docs/agents-and-security.md).

Shared agent guidance lives in `.agents/`; Claude consumes the same skills through `.claude/skills`.

## Worktrees and services

Linked worktrees use the fixed layout and separate Dev Container definition documented in [`docs/worktrees.md`](docs/worktrees.md).

PostgreSQL is available at `postgres:5432` with development-only credentials, a health check, an internal network, and no host-published port. Applications can use `postgresql://postgres:postgres@postgres:5432/app`. Add auxiliary services to `compose.yaml` with pinned images, health checks, internal networking, and no production credentials or container-engine socket.
