# TypeScript safety

Preserve useful inference and make uncertainty explicit.

- Prefer `satisfies` for object and array literals that must conform to a known type.
- Avoid unchecked type assertions. Narrow or validate `unknown` values at trust boundaries.
- Prefer `unknown` over `any` for errors, parsed data, and external input.
- Do not use non-null assertions or casts to conceal a missing invariant.
- Keep runtime validation aligned with the TypeScript type it establishes.

Use an assertion only for a genuine compiler limitation, with a specific comment and explicit human approval when repository policy requires it.
