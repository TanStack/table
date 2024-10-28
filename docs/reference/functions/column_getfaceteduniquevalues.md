---
id: column_getFacetedUniqueValues
title: column_getFacetedUniqueValues
---

# Function: column\_getFacetedUniqueValues()

```ts
function column_getFacetedUniqueValues<TFeatures, TData, TValue>(column, table): () => Map<any, number>
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

`Map`\<`any`, `number`\>

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L35)
