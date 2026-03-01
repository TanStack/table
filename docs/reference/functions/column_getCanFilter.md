---
id: column_getCanFilter
title: column_getCanFilter
---

# Function: column\_getCanFilter()

```ts
function column_getCanFilter<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L77)

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

`boolean`
