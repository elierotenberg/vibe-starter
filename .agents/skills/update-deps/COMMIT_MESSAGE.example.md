chore(workspace): update dependencies

Keep maintained dependencies current and resolve known advisories.

Update compatible releases, preserve documented compatibility constraints, and
refresh the lockfile.

workspace:
  - Remove an obsolete dependency override or release-age exclusion.

apps/example:
  - Adapt an integration to an updated dependency API.

| package | dependency | semver | version | notes |
|---|---|---|---|---|
| **workspace** | **example-security-package** | **SECURITY** | [**1.2.3**](https://example.com/releases/1.2.3) | **Resolve the applicable advisory.** |
| example-app | example-minor-package | MINOR | [2.4.0](https://example.com/releases/2.4.0) | Describe material behavior or migration notes. |
| example-package | example-patch-package | PATCH | [3.1.2](https://example.com/releases/3.1.2) | |

Skipped updates:

| package | dependency | current | latest | why |
|---|---|---|---|---|
| example-app | example-major-package | 4.2.1 | 5.0.0 | Major migration is outside the requested scope. |
