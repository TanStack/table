---
id: Row_ColumnVisibility
title: Row_ColumnVisibility
---

# Interface: Row\_ColumnVisibility\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L73)

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

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L77)

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleCells()

```ts
getVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L81)

Returns an array of cells that account for column visibility for the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
