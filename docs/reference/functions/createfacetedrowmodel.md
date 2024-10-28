---
id: createFacetedRowModel
title: createFacetedRowModel
---

# Function: createFacetedRowModel()

```ts
function createFacetedRowModel<TFeatures, TData>(): (table, columnId) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

### Returns

`Function`

#### Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/column-faceting/createFacetedRowModel.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedRowModel.ts#L13)
