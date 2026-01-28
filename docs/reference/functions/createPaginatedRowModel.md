---
id: createPaginatedRowModel
title: createPaginatedRowModel
---

# Function: createPaginatedRowModel()

```ts
function createPaginatedRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts#L10)

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
