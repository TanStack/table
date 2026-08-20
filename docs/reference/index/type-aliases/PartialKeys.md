---
id: PartialKeys
title: PartialKeys
---

# Type Alias: PartialKeys\<T, K\>

```ts
type PartialKeys<T, K> = Omit<T, K> & Partial<Pick<T, K>>;
```

Defined in: [types/type-utils.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L17)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
