---
id: Row_ColumnPinning
title: Row_ColumnPinning
---

# Interface: Row\_ColumnPinning\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L60)

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

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L67)

Returns all center pinned (unpinned) leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftVisibleCells()

```ts
getLeftVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L71)

Returns all left pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightVisibleCells()

```ts
getRightVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L75)

Returns all right pinned leaf cells in the row.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
