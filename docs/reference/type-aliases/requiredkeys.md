---
id: RequiredKeys
title: RequiredKeys
---

# Type Alias: RequiredKeys\<T, K\>

```ts
type RequiredKeys<T, K>: Omit<T, K> & Required<Pick<T, K>>;
```

## Type Parameters

• **T**

• **K** *extends* keyof `T`

## Defined in

[types/type-utils.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L11)
