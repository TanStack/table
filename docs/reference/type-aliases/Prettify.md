---
id: Prettify
title: Prettify
---

# Type Alias: Prettify\<T\>

```ts
type Prettify<T> = { [K in keyof T]: T[K] } & unknown;
```

Defined in: [types/type-utils.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L82)

## Type Parameters

### T

`T`
