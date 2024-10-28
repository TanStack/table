---
id: createGroupedRowModel
title: createGroupedRowModel
---

# Function: createGroupedRowModel()

```ts
function createGroupedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Returns

`Function`

### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

### Returns

`Function`

#### Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/column-grouping/createGroupedRowModel.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/createGroupedRowModel.ts#L18)
