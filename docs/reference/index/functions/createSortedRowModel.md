---
id: createSortedRowModel
title: createSortedRowModel
---

# Function: createSortedRowModel()

```ts
function createSortedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/createSortedRowModel.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/createSortedRowModel.ts#L20)

Creates a memoized sorted row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

Register sorting functions with the `sortFns` slot on the `features` option:
`tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

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
