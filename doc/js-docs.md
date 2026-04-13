# JSDoc conventions for this repository

Use JSDoc on **exported** functions, important constants, and public-facing types so IDEs and generated docs stay helpful. Keep comments short; prefer a **one-line summary** plus details only when behavior is non-obvious.

## Structure

1. **Summary** — First line is a full sentence, third person or imperative, ending with a period. Describe *what* the symbol does, not implementation trivia.
2. **Blank line** — After the summary if you add more sections.
3. **Additional paragraphs** — Edge cases, scope, or when *not* to use the API.
4. **Tags** — Use only what adds value. Common tags:

| Tag | When to use |
|-----|----------------|
| `@param name` | Every public parameter; note units or expected shape if unclear. |
| `@returns` | When the return value is not obvious from the name. |
| `@internal` | Not part of the public API; may change without notice. |
| `@example` | Non-trivial usage or when a tiny snippet removes ambiguity. |

## `@example` blocks

- Use **fenced TypeScript** with a language tag: ` ```ts `.
- Show the **smallest** snippet that clarifies intent (one or two calls is enough).
- Prefer realistic values over `foo` / `bar` when it helps (e.g. `"keydown"`, `"default"`).

Example:

```ts
/**
 * Computes whether a key event matches a shortcut rule.
 *
 * @param event - DOM keyboard event.
 * @param rule - Key/modifier constraints.
 * @returns True when the event should be handled by this rule.
 *
 * @example
 * ```ts
 * matchesKeyboardRule(event, { keys: "a", withModifiers: ["ctrl"] });
 * ```
 */
```

## Cross-references

- Use `{@link SymbolName}` for types or functions in the same package when it improves navigation in the IDE.
- Avoid linking to symbols that are not stable or not exported.

## Types (`.d.ts` / `type` aliases)

- Add a short summary and an `@example` only when the type is used by consumers and the fields alone are not self-explanatory.
- Do not duplicate field-level comments if the property name and type already document the intent.

## What to skip

- JSDoc on trivial one-line wrappers or private helpers unless behavior is subtle (then `@internal` + one line is enough).
- Restating TypeScript types in `@param` (repeat only constraints that are not in the type system).

## Tests

Behavior that matters for compatibility should be covered by **automated tests**; JSDoc should not duplicate long test matrices. Point to tests only in rare cases (e.g. “see `*.test.ts` for matrix of platforms”).
