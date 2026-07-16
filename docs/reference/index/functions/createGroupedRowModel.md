---
id: createGroupedRowModel
title: createGroupedRowModel
---

# Function: createGroupedRowModel()

```ts
function createGroupedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/createGroupedRowModel.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/createGroupedRowModel.ts#L26)

Creates a memoized grouped row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

When rowAggregationFeature is also registered, grouped rows use its shared
executor for non-group values. Grouping remains useful without aggregation.

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
