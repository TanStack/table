---
id: Row_ColumnPinning
title: Row_ColumnPinning
---

# Interface: Row\_ColumnPinning\<TFeatures, TData\>

Defined in: [features/column-pinning/columnPinningFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L62)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getCenterVisibleCells()

```ts
getCenterVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L69)

Returns all center pinned (unpinned) leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftVisibleCells()

```ts
getLeftVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L73)

Returns all left pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightVisibleCells()

```ts
getRightVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L77)

Returns all right pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
