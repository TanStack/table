---
id: createGroupedRowModel
title: createGroupedRowModel
---

# Function: createGroupedRowModel()

```ts
function createGroupedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/createGroupedRowModel.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/createGroupedRowModel.ts#L30)

Creates a memoized grouped row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

Register the aggregation functions you use with the `aggregationFns` slot
on the `features` option:
`tableFeatures({ columnGroupingFeature, groupedRowModel: createGroupedRowModel(), aggregationFns: { sum: aggregationFn_sum } })`.
Importing individual `aggregationFn_*` functions keeps unused built-ins out
of your bundle; aggregation functions passed directly to the
`aggregationFn` column option need no registration at all.

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
