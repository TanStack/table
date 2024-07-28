---
id: UnionToIntersection
title: UnionToIntersection
---

# Type Alias: UnionToIntersection\<T\>

```ts
type UnionToIntersection<T>: T extends any ? (x) => any : never extends (x) => any ? R : never;
```

## Type Parameters

• **T**

## Defined in

[types/type-utils.ts:14](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/type-utils.ts#L14)
