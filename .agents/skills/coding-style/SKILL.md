---
name: coding-style
description: Apply framework-neutral TypeScript coding conventions when writing, modifying, refactoring, or reviewing source code. Use for type-safety decisions, Zod validation, naming, control flow, imports, exports, async code, and consistency with nearby implementations.
---

# Coding style

Follow nearby code unless it conflicts with these rules.

## Types

- Infer local types. Declare public or ambiguous contracts explicitly.
- Use `unknown` and narrow it. Avoid `any`, unchecked assertions, non-null assertions, and suppression directives.
- Derive related types with `Pick`, `Omit`, indexed access, or `z.infer` instead of duplicating contracts.
- Use `satisfies` when validating a literal while preserving its inferred type.
- Keep caught errors as `unknown` until narrowed.

## Runtime boundaries

- Validate untrusted input with Zod at environment, network, persistence, message, and third-party boundaries.
- Name a Zod schema in PascalCase for the represented value without a `Schema` or `Type` suffix.
- Export a schema and its inferred type under the same name when both are public.
- Do not re-parse an already validated value unless it changed or crossed a distinct contract boundary.

## Structure

- Prefer arrow functions. Use a function declaration only when its semantics require one.
- Prefer parameter objects when positional arguments are ambiguous, optional, or likely to evolve.
- Use early returns to reduce nesting.
- Keep side effects and evaluation order explicit; avoid dense expression chains.
- Prefer named exports unless a framework requires a default export.
- Factor general-purpose logic into focused modules instead of burying helpers in feature files. Create a shared package only for a stable contract used across packages.

## Documentation

- Comment durable rationale, invariants, ordering constraints, and surprising edge cases; do not narrate syntax or history.
- Document exported contracts only when types omit important behavior or constraints.
- Add JSDoc tags, examples, Zod `.describe()`, or `@file` only when a consumer or tool needs the additional information.

Run focused checks and `pnpm verify` after changes.
