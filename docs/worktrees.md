# Linked worktrees

Use this fixed layout:

```text
project/
├── .agent-state/
├── .git/
├── .worktrees/
│   └── feature-name/
└── ...primary checkout
```

The worktree name must be one safe path segment. Create it from the primary WSL checkout with relative Git links and an initial lock:

```text
git worktree add --relative-paths --lock .worktrees/feature-name -b feature-name
```

Open the linked directory in a separate editor window and select `.devcontainer/worktree/devcontainer.json`.

The container mounts only the selected worktree, its Git link, the required primary Git administration paths, and shared clone-local agent and GitHub state. It does not mount the primary checkout or sibling worktree contents.

Each checkout has its own Compose project, PostgreSQL volume, Codex runtime volume, network, `node_modules/`, and `.pnpm-store/`. Agent authentication, the repository-scoped GitHub credential, and Git metadata are shared across the clone. A worktree session can therefore affect shared refs, indexes, credentials, and agent state.

Run independent Codex sessions in separate worktree containers. Agents may perform the Git operations allowed by `AGENTS.md`; worktree creation and removal remain host operations.

Stop the linked container before removing its worktree. Remove the exact worktree explicitly and review the target before pruning. Do not automate worktree cleanup from lifecycle hooks, move the primary checkout while linked containers are active, or run `git clean -fdx`.
