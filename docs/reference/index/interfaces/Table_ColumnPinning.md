---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

# Interface: Table\_ColumnPinning\<TFeatures, TData\>

Defined in: [features/column-pinning/columnPinningFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L80)

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L87)

If pinning, returns headers for all columns that are not pinned, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterFooterGroups()

```ts
getCenterFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L91)

If pinning, returns the footer groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterHeaderGroups()

```ts
getCenterHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L95)

If pinning, returns the header groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterLeafColumns()

```ts
getCenterLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L99)

Returns all center pinned (unpinned) leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterLeafHeaders()

```ts
getCenterLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L103)

If pinning, returns headers for all columns that are not pinned, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterVisibleLeafColumns()

```ts
getCenterVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L107)

If column pinning, returns a flat array of leaf-node columns that are visible in the unpinned/center portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getIsSomeColumnsPinned()

```ts
getIsSomeColumnsPinned: (position?) => boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L111)

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L115)

If pinning, returns headers for all left pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftFooterGroups()

```ts
getLeftFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L119)

If pinning, returns the footer groups for the left pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeftHeaderGroups()

```ts
getLeftHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L123)

If pinning, returns the header groups for the left pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getLeftLeafColumns()

```ts
getLeftLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L127)

Returns all left pinned leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftLeafHeaders()

```ts
getLeftLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L131)

If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getLeftVisibleLeafColumns()

```ts
getLeftVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L135)

If column pinning, returns a flat array of leaf-node columns that are visible in the left portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getPinnedLeafColumns()

```ts
getPinnedLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:171](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L171)

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L177)

Returns visible pinned leaf columns for the requested pinning region.

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L139)

If pinning, returns headers for all right pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightFooterGroups()

```ts
getRightFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L143)

If pinning, returns the footer groups for the right pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getRightHeaderGroups()

```ts
getRightHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L147)

If pinning, returns the header groups for the right pinned columns.

#### Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getRightLeafColumns()

```ts
getRightLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L151)

Returns all right pinned leaf columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightLeafHeaders()

```ts
getRightLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L155)

If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getRightVisibleLeafColumns()

```ts
getRightVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:159](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L159)

If column pinning, returns a flat array of leaf-node columns that are visible in the right portion of the table.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnPinning()

```ts
resetColumnPinning: (defaultState?) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L163)

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

Defined in: [features/column-pinning/columnPinningFeature.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L167)

Sets column pinning state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnPinningState`](ColumnPinningState.md)\>

#### Returns

`void`
