---
id: Table_RowPinning
title: Table_RowPinning
---

# Interface: Table\_RowPinning\<TFeatures, TData\>

Defined in: [features/row-pinning/rowPinningFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L63)

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

Defined in: [features/row-pinning/rowPinningFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L70)

Returns all bottom pinned rows.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getCenterRows()

```ts
getCenterRows: () => Row<TFeatures, TData>[];
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L74)

Returns all rows that are not pinned to the top or bottom.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### getIsSomeRowsPinned()

```ts
getIsSomeRowsPinned: (position?) => boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L78)

Returns whether or not any rows are pinned. Optionally specify to only check for pinned rows in either the `top` or `bottom` position.

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

Defined in: [features/row-pinning/rowPinningFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L82)

Returns all top pinned rows.

#### Returns

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

***

### resetRowPinning()

```ts
resetRowPinning: (defaultState?) => void;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L86)

Resets the **rowPinning** state to `initialState.rowPinning`, or `true` can be passed to force a default blank state reset to `{ top: [], bottom: [], }`.

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

Defined in: [features/row-pinning/rowPinningFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L90)

Sets row pinning state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowPinningState`](RowPinningState.md)\>

#### Returns

`void`
