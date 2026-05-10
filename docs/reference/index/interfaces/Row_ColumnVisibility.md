---
id: Row_ColumnVisibility
title: Row_ColumnVisibility
---

# Interface: Row\_ColumnVisibility\<TFeatures, TData\>

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L75)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAllVisibleCells()

```ts
getAllVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L82)

Returns all cells for the row whose columns are currently visible.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleCells()

```ts
getVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L86)

Returns an array of cells that account for column visibility for the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
