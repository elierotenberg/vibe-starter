# No silent fallbacks

Do not let missing or invalid required configuration pass through a guessed default, empty value, or swallowed error. Validate at the boundary and fail with an actionable message.

Defaults are appropriate only when they are part of the documented product contract. A fallback must not hide a broken invariant, permission failure, unavailable dependency, or malformed input.
