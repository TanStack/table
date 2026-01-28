---
id: createFacetedRowModel
title: createFacetedRowModel
---

# Function: createFacetedRowModel()

```ts
function createFacetedRowModel<TFeatures, TData>(): (table, columnId) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/createFacetedRowModel.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedRowModel.ts#L13)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Returns

```ts
(table, columnId): () => RowModel<TFeatures, TData>;
```

### Parameters

#### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### columnId

`string`

### Returns

```ts
(): RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>
