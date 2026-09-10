---
id: Row_ColumnVisibility
title: Row_ColumnVisibility
---

# Interface: Row\_ColumnVisibility\<TFeatures, TData\>

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L78)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getVisibleCells()

```ts
getVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L85)

Gets this row's cells for currently visible columns.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleCellsByColumnId()

```ts
getVisibleCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L89)

Maps this row's currently visible cells by column id.

#### Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>
