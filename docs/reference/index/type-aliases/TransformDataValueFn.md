---
id: TransformDataValueFn
title: TransformDataValueFn
---

# Type Alias: TransformDataValueFn()

```ts
type TransformDataValueFn = (dataValue) => any;
```

Defined in: [types/type-utils.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/type-utils.ts#L15)

Normalizes a row's value before a filter or sort comparator sees it.

Attach as `resolveDataValue` on filter/sort functions built with
`constructFilterFn`/`constructSortFn` (e.g. to lowercase or strip diacritics).

## Parameters

### dataValue

`any`

## Returns

`any`
