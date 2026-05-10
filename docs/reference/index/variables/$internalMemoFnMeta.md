---
id: $internalMemoFnMeta
title: $internalMemoFnMeta
---

# Variable: $internalMemoFnMeta

```ts
const $internalMemoFnMeta: typeof $internalMemoFnMeta;
```

Defined in: [utils.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L115)

Symbol used to attach internal memo metadata to wrapped functions.

This is exported so diagnostics can recognize memoized functions without
depending on a string property name.
