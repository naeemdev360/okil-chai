---
name: descriptive-code-comments
description: Add concise, descriptive code comments where logic is non-obvious. Use when writing, refactoring, or reviewing code changes and when the user asks for better inline documentation.
---

# Descriptive Code Comments

## Goal
Write comments that explain intent and reasoning for non-obvious logic without adding noise.

## When To Comment
- Add comments before complex conditional logic, edge-case handling, protocol constraints, security-sensitive branches, and business-rule transformations.
- Add comments when the implementation choice is not immediately obvious from names and types.
- Add comments when future maintainers need context that is not present in code structure.

## When Not To Comment
- Do not comment trivial assignments, straightforward loops, or obvious framework boilerplate.
- Do not restate what the next line literally does.
- Do not add placeholder comments or TODOs without a linked task reference.

## Comment Style Rules
- Keep comments short and specific (1-2 lines in most cases).
- Prefer explaining **why** over **what**.
- Place comments directly above the relevant block.
- Keep wording factual and maintainable; avoid time-sensitive phrasing.
- Use ASCII unless the file already uses Unicode.

## Good Examples
```ts
// Preserve upstream error code when available so clients can map retries safely.
const errorCode = this.resolveErrorCode(error);
```

```ts
// Normalize to UTC string to keep audit logs stable across server regions.
const timestamp = new Date().toISOString();
```

## Bad Examples
```ts
// Set status code
const statusCode = response.statusCode;
```

```ts
// Loop through all users
for (const user of users) {
  // ...
}
```

## Review Pass Checklist
- [ ] Every added comment explains non-obvious intent or constraint.
- [ ] No comment duplicates code semantics.
- [ ] No stale or speculative comments were introduced.
- [ ] Complex blocks changed in this patch have enough context for maintainers.
