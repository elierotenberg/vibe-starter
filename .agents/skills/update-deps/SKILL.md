---
name: update-deps
description: Update dependencies safely across a framework-neutral pnpm workspace and its locked Dev Container agent tools. Use for routine dependency maintenance, outdated packages, package-manager upgrades, agent CLI upgrades, security advisories, or lockfile refreshes.
---

# Update dependencies

Cover the pnpm workspace and `.devcontainer/tools`. Preserve exact versions, package ownership, supply-chain policy, and unrelated changes.

## Inspect

1. Read all relevant manifests and lockfiles.
2. Establish a baseline with `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm verify`, and, from `.devcontainer/tools`, `npm ci --ignore-scripts --dry-run --no-audit --no-fund`.
3. Inventory with `pnpm outdated -r`, `pnpm audit`, and, from `.devcontainer/tools`, `npm outdated` and `npm audit --package-lock-only --omit=dev --ignore-scripts`.
4. Include `packageManager` and agent CLIs in a full update. Treat Node and container images separately; Dependabot discovers image updates.

## Select

- Update compatible patch and minor releases together.
- Handle majors individually using authoritative migration guidance.
- Keep exact versions and dependency fields unchanged.
- Keep agent CLI release channels unchanged unless explicitly requested.
- Keep `@types/node` on the pinned Node major.
- Respect runtime, framework, peer, and shared-dependency compatibility.
- Record every deferred update and reason.

## Apply

- Edit each owning workspace manifest and run `pnpm install --ignore-scripts`.
- Update pnpm only through root `package.json#packageManager`, then regenerate the lockfile with the selected pnpm version.
- For agent CLIs, follow `host-maintenance`. Prepare but do not run an ignored script that verifies current versions and runs, from `.devcontainer/tools`, `npm install --package-lock-only --ignore-scripts --save-exact --no-audit --no-fund <selected exact packages>`, followed by the npm dry-run and audit commands above.
- Never delete lockfiles, modules, or stores to force resolution.
- Use narrow overrides only for verified transitive requirements. Do not hide peer, type, test, or build failures.
- Change patches, overrides, or release-age exclusions only after proving they remain necessary or removable.

## Verify and report

Re-run inventories, audits, lockfile validation, and `pnpm verify`. Inspect lockfile churn, registry sources, lifecycle scripts, peers, duplicates, and platform packages.

After agent CLI changes, require a Dev Container rebuild and confirm `claude --version`, `codex --version`, and `pnpm verify`; reported versions must match `.devcontainer/tools/package.json`.

Report updated and deferred dependencies with owner, old and new versions, semver class, reason, and material release notes. State pending host or rebuilt-container checks.

For a requested commit message, follow `prepare-commit` and [`COMMIT_MESSAGE.example.md`](COMMIT_MESSAGE.example.md). Include all updates and deferrals, group Security, Major, Minor, then Patch, alphabetize within groups, bold security rows, and link authoritative release notes.
