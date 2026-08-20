---
id: createFilteredRowModel
title: createFilteredRowModel
---

# Function: createFilteredRowModel()

```ts
function createFilteredRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/createFilteredRowModel.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/createFilteredRowModel.ts#L32)

Creates a memoized filtered row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

Register the filter functions you use with the `filterFns` slot on the
`features` option:
`tableFeatures({ columnFilteringFeature, filteredRowModel: createFilteredRowModel(), filterFns: { includesString: filterFn_includesString } })`.
Importing individual `filterFn_*` functions keeps unused built-ins out of
your bundle; filter functions passed directly to the `filterFn` column
option need no registration at all.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Returns

```ts
(table): () => RowModel<TFeatures, TData>;
```

### Parameters

#### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

### Returns

```ts
(): RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>
