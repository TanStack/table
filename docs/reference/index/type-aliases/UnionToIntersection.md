---
id: UnionToIntersection
title: UnionToIntersection
---

# Type Alias: UnionToIntersection\<T\>

```ts
type UnionToIntersection<T> = T extends any ? (x) => any : never extends (x) => any ? R : never;
```

Defined in: [types/type-utils.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L22)

## Type Parameters

### T

`T`
