---
id: IsAny
title: IsAny
---

# Type Alias: IsAny\<T\>

```ts
type IsAny<T> = 0 extends 1 & T ? true : false;
```

Defined in: [types/TableFeatures.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L14)

## Type Parameters

### T

`T`
