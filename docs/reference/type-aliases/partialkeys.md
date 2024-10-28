---
id: PartialKeys
title: PartialKeys
---

# Type Alias: PartialKeys\<T, K\>

```ts
type PartialKeys<T, K>: Omit<T, K> & Partial<Pick<T, K>>;
```

## Type Parameters

• **T**

• **K** *extends* keyof `T`

## Defined in

[types/type-utils.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L9)
