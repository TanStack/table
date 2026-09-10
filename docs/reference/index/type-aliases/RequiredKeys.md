---
id: RequiredKeys
title: RequiredKeys
---

```ts
type RequiredKeys<T, K> = Omit<T, K> & Required<Pick<T, K>>;
```

Defined in: [types/type-utils.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L19)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
