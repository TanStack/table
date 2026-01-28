---
id: PartialKeys
title: PartialKeys
---

# Type Alias: PartialKeys\<T, K\>

```ts
type PartialKeys<T, K> = Omit<T, K> & Partial<Pick<T, K>>;
```

Defined in: [packages/table-core/src/types/type-utils.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L9)

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`
