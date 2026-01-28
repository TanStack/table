---
id: column_getFacetedMinMaxValues
title: column_getFacetedMinMaxValues
---

# Function: column\_getFacetedMinMaxValues()

```ts
function column_getFacetedMinMaxValues<TFeatures, TData, TValue>(column, table): [number, number] | undefined;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L7)

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

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

\[`number`, `number`\] \| `undefined`
