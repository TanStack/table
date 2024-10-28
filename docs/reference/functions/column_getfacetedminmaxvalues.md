---
id: column_getFacetedMinMaxValues
title: column_getFacetedMinMaxValues
---

# Function: column\_getFacetedMinMaxValues()

```ts
function column_getFacetedMinMaxValues<TFeatures, TData, TValue>(column, table): () => [number, number] | undefined
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

[`number`, `number`] \| `undefined`

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L7)
