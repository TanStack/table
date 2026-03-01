---
id: column_getIsFiltered
title: column_getIsFiltered
---

# Function: column\_getIsFiltered()

```ts
function column_getIsFiltered<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L90)

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
