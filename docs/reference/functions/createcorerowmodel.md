---
id: createCoreRowModel
title: createCoreRowModel
---

# Function: createCoreRowModel()

```ts
function createCoreRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>
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

[core/row-models/createCoreRowModel.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/createCoreRowModel.ts#L10)
