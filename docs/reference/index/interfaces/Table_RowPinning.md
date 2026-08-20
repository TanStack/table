---
id: Table_RowPinning
title: Table_RowPinning
---

# Interface: Table\_RowPinning\<TFeatures, TData\>

Defined in: [features/row-pinning/rowPinningFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L65)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getBottomRows()

```ts
getBottomRows: () => Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L72)

Gets rows pinned to the bottom region.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getCenterRows()

```ts
getCenterRows: () => Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L76)

Gets rows that are not pinned to the top or bottom region.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getIsSomeRowsPinned()

```ts
getIsSomeRowsPinned: (position?) => boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L80)

Checks whether any rows are pinned, optionally limited to one region.

#### Parameters

##### position?

[`RowPinningPosition`](../type-aliases/RowPinningPosition.md)

#### Returns

`boolean`

***

### getTopRows()

```ts
getTopRows: () => Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L84)

Gets rows pinned to the top region.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### resetRowPinning()

```ts
resetRowPinning: (defaultState?) => void;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L90)

Resets `rowPinning` to `initialState.rowPinning`.

Pass `true` to ignore initial state and reset to empty top/bottom arrays.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setRowPinning()

```ts
setRowPinning: (updater) => void;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L94)

Updates row pinning state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowPinningState`](RowPinningState.md)\>

#### Returns

`void`
