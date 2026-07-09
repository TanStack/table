---
id: Row_ColumnPinning
title: Row_ColumnPinning
---

# Interface: Row\_ColumnPinning\<TFeatures, TData\>

Defined in: [features/column-pinning/columnPinningFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L69)

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L76)

Gets visible row cells whose columns are not pinned start or end.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndVisibleCells()

```ts
getEndVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L84)

Gets visible row cells whose columns are pinned end.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartVisibleCells()

```ts
getStartVisibleCells: () => Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L80)

Gets visible row cells whose columns are pinned start.

#### Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
