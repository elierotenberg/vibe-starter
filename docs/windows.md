# Windows and WSL

Use Windows 11, Docker Desktop's WSL 2 backend, and a checkout inside the WSL Linux filesystem. Do not use `/mnt/c` or a native NTFS clone; the repository relies on Linux permissions and symbolic links.

Before enabling automatic approval, set these Cursor User settings and restart Cursor:

```json
{
  "dev.containers.copyGitConfig": false,
  "dev.containers.enableGPGAgentForwarding": false,
  "dev.containers.enableSSHAgentForwarding": false
}
```

Cursor applies credential forwarding before repository container checks can run. Authenticate GitHub inside the container instead.

Host shell startup must be silent for non-interactive editor subprocesses. If Cursor reports a stderr JSON error containing `Identity added`, stop an automatic `ssh-add` from printing during non-interactive startup.

Use a WSL Git version that supports `git worktree add --relative-paths`. The tracked `.claude/skills` path must remain a symbolic link; if an NTFS checkout converted it into a text file, clone again inside WSL.

If Bubblewrap cannot start, do not use `seccomp=unconfined` or add `SYS_ADMIN`. Inspect `/proc/sys/kernel/apparmor_restrict_unprivileged_userns` inside the container: `1` indicates that the Docker/WSL host needs a Bubblewrap-specific AppArmor exception; `0` or a missing file rules out that restriction.

If authentication disappears after `.agent-state/` was removed, authenticate again instead of restoring token files from an unreviewed backup.
