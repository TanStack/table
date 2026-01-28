---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

# Interface: Table\_ColumnPinning\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L78)

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

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L85)

If pinning, returns headers for all columns that are not pinned, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterFooterGroups()

```ts
getCenterFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L89)

If pinning, returns the footer groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterHeaderGroups()

```ts
getCenterHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L93)

If pinning, returns the header groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterLeafColumns()

```ts
getCenterLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L97)

Returns all center pinned (unpinned) leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterLeafHeaders()

```ts
getCenterLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L101)

If pinning, returns headers for all columns that are not pinned, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterVisibleLeafColumns()

```ts
getCenterVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L105)

If column pinning, returns a flat array of leaf-node columns that are visible in the unpinned/center portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getIsSomeColumnsPinned()

```ts
getIsSomeColumnsPinned: (position?) => boolean;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L109)

Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`boolean`

***

### getLeftFlatHeaders()

```ts
getLeftFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L113)

If pinning, returns headers for all left pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftFooterGroups()

```ts
getLeftFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L117)

If pinning, returns the footer groups for the left pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeftHeaderGroups()

```ts
getLeftHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L121)

If pinning, returns the header groups for the left pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeftLeafColumns()

```ts
getLeftLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L125)

Returns all left pinned leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftLeafHeaders()

```ts
getLeftLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L129)

If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftVisibleLeafColumns()

```ts
getLeftVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L133)

If column pinning, returns a flat array of leaf-node columns that are visible in the left portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getPinnedLeafColumns()

```ts
getPinnedLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L168)

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

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L173)

#### Parameters

##### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightFlatHeaders()

```ts
getRightFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L137)

If pinning, returns headers for all right pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightFooterGroups()

```ts
getRightFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L141)

If pinning, returns the footer groups for the right pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getRightHeaderGroups()

```ts
getRightHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:145](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L145)

If pinning, returns the header groups for the right pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getRightLeafColumns()

```ts
getRightLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L149)

Returns all right pinned leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightLeafHeaders()

```ts
getRightLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L153)

If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightVisibleLeafColumns()

```ts
getRightVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:157](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L157)

If column pinning, returns a flat array of leaf-node columns that are visible in the right portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnPinning()

```ts
resetColumnPinning: (defaultState?) => void;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L161)

Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.

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

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L165)

Sets or updates the `state.columnPinning` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnPinningState`](ColumnPinningState.md)\>

#### Returns

`void`
