---
id: IsAny
title: IsAny
---

# Type Alias: IsAny\<T\>

```ts
type IsAny<T> = 0 extends 1 & T ? true : false;
```

Defined in: [types/TableFeatures.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L24)

Detects whether a type is `any`.

Several feature-map helpers need a separate `any` path so broad generic
usage still exposes all known feature APIs instead of narrowing to no keys.

## Type Parameters

### T

`T`
