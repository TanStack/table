---
id: RequiredKeys
title: RequiredKeys
---

# Type Alias: RequiredKeys\<T, K\>

```ts
type RequiredKeys<T, K> = Omit<T, K> & Required<Pick<T, K>>;
```

Defined in: [packages/table-core/src/types/type-utils.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L11)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
