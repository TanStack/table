---
id: column_getFacetedMinMaxValues
title: column_getFacetedMinMaxValues
---

# Function: column\_getFacetedMinMaxValues()

```ts
function column_getFacetedMinMaxValues<TFeatures, TData, TValue>(column, table): () => [number, number] | undefined
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Function`

### Returns

[`number`, `number`] \| `undefined`

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:8](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L8)
