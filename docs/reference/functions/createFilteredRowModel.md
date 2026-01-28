---
id: createFilteredRowModel
title: createFilteredRowModel
---

# Function: createFilteredRowModel()

```ts
function createFilteredRowModel<TFeatures, TData>(filterFns): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-filtering/createFilteredRowModel.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/createFilteredRowModel.ts#L22)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### filterFns

`Record`\<keyof [`FilterFns`](../interfaces/FilterFns.md), [`FilterFn`](../interfaces/FilterFn.md)\<`TFeatures`, `TData`\>\>

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
