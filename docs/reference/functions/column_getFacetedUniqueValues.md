---
id: column_getFacetedUniqueValues
title: column_getFacetedUniqueValues
---

# Function: column\_getFacetedUniqueValues()

```ts
function column_getFacetedUniqueValues<TFeatures, TData, TValue>(column, table): Map<any, number>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L35)

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

`Map`\<`any`, `number`\>
