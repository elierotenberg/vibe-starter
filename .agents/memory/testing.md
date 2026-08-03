# Testing

Test observable behavior and important failure modes. Reproduce a defect before fixing it when practical, then prove the test fails for the original reason and passes after the fix.

- Never remove, skip, or weaken a failing assertion to obtain a green run.
- Keep tests deterministic and independent of live paid or production services.
- Give each test ownership of mutable state and cleanup so parallel execution is safe.
- Mock at explicit injected boundaries; prefer real deterministic local components elsewhere.
- Keep reusable setup and teardown in fixtures or named test support modules.
- Run narrow tests while iterating and the repository's canonical verification before handoff.
