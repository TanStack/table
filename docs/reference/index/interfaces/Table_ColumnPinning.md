---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

# Interface: Table\_ColumnPinning\<TFeatures, TData\>

Defined in: [features/column-pinning/columnPinningFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L87)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getCenterFlatHeaders()

```ts
getCenterFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L95)

Builds flat center-region headers for columns that are not pinned,
including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterFooterGroups()

```ts
getCenterFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L99)

Builds footer groups for the center region of unpinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterHeaderGroups()

```ts
getCenterHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L103)

Builds header groups for the center region of unpinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterLeafColumns()

```ts
getCenterLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L107)

Gets leaf columns that are not pinned start or end.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterLeafHeaders()

```ts
getCenterLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L111)

Builds center-region leaf headers for columns that are not pinned.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterVisibleLeafColumns()

```ts
getCenterVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L115)

Lists visible leaf columns in the unpinned center region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndFlatHeaders()

```ts
getEndFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L149)

Builds flat end-region headers for pinned columns, including parent
headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndFooterGroups()

```ts
getEndFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L153)

Builds footer groups for end-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getEndHeaderGroups()

```ts
getEndHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:157](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L157)

Builds header groups for end-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getEndLeafColumns()

```ts
getEndLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L161)

Gets leaf columns pinned to the end region in pinning-state order.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndLeafHeaders()

```ts
getEndLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L165)

Builds leaf headers for end-pinned columns.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndVisibleLeafColumns()

```ts
getEndVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L169)

Lists visible leaf columns in the end pinned region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getIsSomeColumnsPinned()

```ts
getIsSomeColumnsPinned: (position?) => boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L119)

Checks whether any columns are pinned, optionally limited to one side.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`boolean`

***

### getPinnedLeafColumns()

```ts
getPinnedLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:183](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L183)

Returns pinned leaf columns for the requested pinning region.

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getPinnedVisibleLeafColumns()

```ts
getPinnedVisibleLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L189)

Lists visible leaf columns for the requested pinning region.

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartFlatHeaders()

```ts
getStartFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L124)

Builds flat start-region headers for pinned columns, including parent
headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartFooterGroups()

```ts
getStartFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L128)

Builds footer groups for start-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getStartHeaderGroups()

```ts
getStartHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L132)

Builds header groups for start-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getStartLeafColumns()

```ts
getStartLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L136)

Gets leaf columns pinned to the start region in pinning-state order.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartLeafHeaders()

```ts
getStartLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L140)

Builds leaf headers for start-pinned columns.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartVisibleLeafColumns()

```ts
getStartVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L144)

Lists visible leaf columns in the start pinned region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnPinning()

```ts
resetColumnPinning: (defaultState?) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L175)

Resets `columnPinning` to `initialState.columnPinning`.

Pass `true` to ignore initial state and reset to empty start/end arrays.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnPinning()

```ts
setColumnPinning: (updater) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:179](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L179)

Updates column pinning state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnPinningState`](ColumnPinningState.md)\>

#### Returns

`void`
