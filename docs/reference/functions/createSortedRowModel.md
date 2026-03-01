---
id: createSortedRowModel
title: createSortedRowModel
---

# Function: createSortedRowModel()

```ts
function createSortedRowModel<TFeatures, TData>(sortFns): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-sorting/createSortedRowModel.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/createSortedRowModel.ts#L12)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### sortFns

`Record`\<keyof [`SortFns`](../interfaces/SortFns.md), [`SortFn`](../interfaces/SortFn.md)\<`TFeatures`, `TData`\>\>

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
