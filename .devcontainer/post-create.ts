/**
 * @file Secures and validates the Dev Container before installing workspace dependencies.
 */

import { spawnSync } from "node:child_process";
import {
  accessSync,
  chmodSync,
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  readFileSync,
  statSync,
} from "node:fs";

const workspace = "/workspace";
const claudeState = "/home/node/.claude";
const codexState = "/home/node/.codex";
const userConfig = "/home/node/.config";
const codexRuntime = `${codexState}/tmp`;
const codexConfig = `${codexState}/config.toml`;
const defaultCodexConfig = "/usr/local/share/devcontainer-workspace/codex-config.toml";
const worktreeSlug = process.env.DEVCONTAINER_WORKTREE_SLUG;

const fail = (message: string): never => {
  throw new Error(`Dev Container security check failed: ${message}`);
};

const mountInfoFor = (target: string): string | undefined => {
  const mountInfo = readFileSync("/proc/self/mountinfo", "utf8");
  return mountInfo
    .split("\n")
    .find((line) => line.split(" ")[4]?.replaceAll("\\040", " ") === target);
};

const assertMount = (target: string, expected: "read-only" | "tmpfs" | "writable"): void => {
  const line = mountInfoFor(target) ?? fail(`${target} is not a separate mount`);

  const separator = line.indexOf(" - ");
  const beforeSeparator = line.slice(0, separator).split(" ");
  const afterSeparator = line.slice(separator + 3).split(" ");

  if (expected === "read-only" && !beforeSeparator[5]?.split(",").includes("ro")) {
    fail(`${target} is not mounted read-only`);
  }

  if (expected === "writable" && !beforeSeparator[5]?.split(",").includes("rw")) {
    fail(`${target} is not mounted writable`);
  }

  if (expected === "tmpfs" && afterSeparator[0] !== "tmpfs") {
    fail(`${target} is not backed by tmpfs`);
  }
};

const assertOuterProcessBoundary = (): void => {
  const status = new Map(
    readFileSync("/proc/self/status", "utf8")
      .split("\n")
      .flatMap((line) => {
        const separator = line.indexOf(":");
        return separator === -1
          ? []
          : [[line.slice(0, separator), line.slice(separator + 1).trim()] as const];
      }),
  );

  if (status.get("NoNewPrivs") !== "1") {
    fail("no-new-privileges is not active");
  }
  for (const capabilitySet of ["CapEff", "CapBnd"] as const) {
    const value = status.get(capabilitySet);
    if (value === undefined || !/^0+$/.test(value)) {
      fail(`${capabilitySet} is not empty`);
    }
  }
  if (status.get("Seccomp") !== "2") {
    fail("the outer seccomp filter is not active");
  }
};

const assertBubblewrapSandbox = (): void => {
  const sandbox = spawnSync(
    "bwrap",
    [
      "--unshare-user",
      "--unshare-pid",
      "--unshare-net",
      "--ro-bind",
      "/",
      "/",
      "--proc",
      "/proc",
      "/usr/bin/true",
    ],
    { stdio: "inherit" },
  );
  if (sandbox.error !== undefined) {
    fail(`Bubblewrap sandbox could not start: ${sandbox.error.message}`);
  }
  if (sandbox.status !== 0) {
    fail("Bubblewrap sandbox could not create private user, mount, PID, and network namespaces");
  }
};

const runtimeUserId = process.getuid?.();
if (runtimeUserId === undefined) {
  fail("the runtime user ID is unavailable");
}
if (runtimeUserId === 0) {
  fail("the runtime user is root");
}
assertOuterProcessBoundary();
assertBubblewrapSandbox();

assertMount("/tmp", "tmpfs");
if ((statSync("/tmp").mode & 0o7777) !== 0o1777) {
  fail("/tmp does not have mode 01777");
}
try {
  accessSync("/tmp", constants.W_OK);
} catch {
  fail("/tmp is not writable by the runtime user");
}

for (const socket of ["/var/run/docker.sock", "/run/docker.sock", "/run/podman/podman.sock"]) {
  if (existsSync(socket)) {
    fail(`container-engine socket is visible at ${socket}`);
  }
}

for (const path of [claudeState, codexState, userConfig]) {
  if (!existsSync(path) || !statSync(path).isDirectory()) {
    fail(`state mount is missing at ${path}`);
  }
  chmodSync(path, 0o700);
  if ((statSync(path).mode & 0o777) !== 0o700) {
    fail(`state mount does not have mode 0700: ${path}`);
  }
}

if (!existsSync(codexRuntime) || !statSync(codexRuntime).isDirectory()) {
  fail(`Codex runtime volume is missing at ${codexRuntime}`);
}
assertMount(codexRuntime, "writable");
const codexRuntimeStat = statSync(codexRuntime);
if (codexRuntimeStat.uid !== runtimeUserId) {
  fail(`Codex runtime volume is not owned by the runtime user: ${codexRuntime}`);
}
try {
  chmodSync(codexRuntime, 0o700);
} catch {
  fail(`Codex runtime volume permissions cannot be secured: ${codexRuntime}`);
}
if ((statSync(codexRuntime).mode & 0o777) !== 0o700) {
  fail(`Codex runtime volume does not have mode 0700: ${codexRuntime}`);
}
try {
  accessSync(codexRuntime, constants.R_OK | constants.W_OK | constants.X_OK);
} catch {
  fail(`Codex runtime volume is not accessible by the runtime user: ${codexRuntime}`);
}

assertMount(`${workspace}/.agent-state`, "tmpfs");
for (const path of [
  `${workspace}/.devcontainer`,
  `${workspace}/.claude`,
  `${workspace}/.codex`,
  `${workspace}/.github/workflows`,
  `${workspace}/CLAUDE.md`,
  `${workspace}/compose.yaml`,
]) {
  assertMount(path, "read-only");
}

const workspaceGit = lstatSync(`${workspace}/.git`);
if (workspaceGit.isFile()) {
  if (
    worktreeSlug === undefined ||
    worktreeSlug.length > 64 ||
    !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(worktreeSlug)
  ) {
    fail("the linked-worktree Compose project name is not a safe slug");
  }
  const expectedGitLink = `gitdir: ../../.git/worktrees/${worktreeSlug}\n`;
  if (readFileSync(`${workspace}/.git`, "utf8") !== expectedGitLink) {
    fail("the linked worktree does not use the expected relative Git link");
  }
  assertMount("/.git", "writable");
  assertMount(`/.worktrees/${worktreeSlug}`, "writable");
} else {
  if (!workspaceGit.isDirectory()) {
    fail("the workspace Git metadata mount is neither a directory nor a worktree link");
  }
  if (worktreeSlug !== undefined) {
    fail("the worktree profile was used for a primary checkout");
  }
}

try {
  accessSync(`${workspace}/.git`, constants.R_OK | constants.W_OK);
} catch {
  fail("Git metadata is not writable by the runtime user");
}

try {
  accessSync(`${workspace}/.agent-state`, constants.R_OK | constants.W_OK);
  fail("the workspace-visible .agent-state path is accessible");
} catch (error) {
  if (error instanceof Error && error.message.startsWith("Dev Container security check failed")) {
    throw error;
  }
}

for (const path of [
  workspace,
  `${workspace}/.agents`,
  `${workspace}/AGENTS.md`,
  `${workspace}/node_modules`,
  `${workspace}/.pnpm-store`,
]) {
  if (!existsSync(path)) {
    continue;
  }
  try {
    accessSync(path, constants.W_OK);
  } catch {
    fail(`checkout path is not writable: ${path}`);
  }
}

if (existsSync(codexConfig) && !lstatSync(codexConfig).isFile()) {
  fail(`${codexConfig} is not a regular file`);
}
if (
  !existsSync(codexConfig) ||
  readFileSync(codexConfig, "utf8") !== readFileSync(defaultCodexConfig, "utf8")
) {
  copyFileSync(defaultCodexConfig, codexConfig);
}
chmodSync(codexConfig, 0o600);

const gitCredentialHelper = spawnSync(
  "git",
  [
    "config",
    "--global",
    "--replace-all",
    "credential.https://github.com.helper",
    "!gh auth git-credential",
  ],
  { stdio: "inherit" },
);
if (gitCredentialHelper.error !== undefined || gitCredentialHelper.status !== 0) {
  fail("GitHub credential helper configuration failed");
}

const install = spawnSync("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], {
  cwd: workspace,
  env: { ...process.env, CI: "true" },
  stdio: "inherit",
});
if (install.status !== 0) {
  fail("frozen pnpm installation failed");
}
