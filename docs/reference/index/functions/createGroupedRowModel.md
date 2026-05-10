---
id: createGroupedRowModel
title: createGroupedRowModel
---

# Function: createGroupedRowModel()

```ts
function createGroupedRowModel<TFeatures, TData>(aggregationFns): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/createGroupedRowModel.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/createGroupedRowModel.ts#L27)

Creates a memoized grouped row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### aggregationFns

`Record`\<keyof [`AggregationFns`](../interfaces/AggregationFns.md), [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>\>

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
