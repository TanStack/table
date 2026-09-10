---
id: createFacetedRowModel
title: createFacetedRowModel
---

# Function: createFacetedRowModel()

```ts
function createFacetedRowModel<TFeatures, TData>(): (table, columnId) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/createFacetedRowModel.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/createFacetedRowModel.ts#L18)

Creates a memoized faceted row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

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
