---
id: column_getAutoFilterFn
title: column_getAutoFilterFn
---

# Function: column\_getAutoFilterFn()

```ts
function column_getAutoFilterFn<TFeatures, TData, TValue>(column): 
  | FilterFn<TFeatures, TData>
  | undefined;
```

Defined in: [packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L15)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

  \| [`FilterFn`](../interfaces/FilterFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`
