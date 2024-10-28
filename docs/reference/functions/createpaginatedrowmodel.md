---
id: createPaginatedRowModel
title: createPaginatedRowModel
---

# Function: createPaginatedRowModel()

```ts
function createPaginatedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Returns

`Function`

### Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

### Returns

`Function`

#### Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/row-pagination/createPaginatedRowModel.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts#L11)
