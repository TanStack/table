---
id: UnionToIntersection
title: UnionToIntersection
---

# Type Alias: UnionToIntersection\<T\>

```ts
type UnionToIntersection<T> = T extends any ? (x) => any : never extends (x) => any ? R : never;
```

Defined in: [packages/table-core/src/types/type-utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L14)

## Type Parameters

### T

`T`
