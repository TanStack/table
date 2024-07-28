---
id: column_getFacetedUniqueValues
title: column_getFacetedUniqueValues
---

# Function: column\_getFacetedUniqueValues()

```ts
function column_getFacetedUniqueValues<TFeatures, TData, TValue>(column, table): () => Map<any, number>
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

`Map`\<`any`, `number`\>

## Defined in

[features/column-faceting/ColumnFaceting.utils.ts:36](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.utils.ts#L36)
