---
id: createCoreRowModel
title: createCoreRowModel
---

# Function: createCoreRowModel()

```ts
function createCoreRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/createCoreRowModel.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/createCoreRowModel.ts#L15)

Creates a memoized core row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

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
