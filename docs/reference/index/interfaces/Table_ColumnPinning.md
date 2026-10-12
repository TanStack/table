---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

Defined in: [features/column-pinning/columnPinningFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L98)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_orderByColumnPinning

```ts
_orderByColumnPinning: <TItem>(items, getColumnId, getItemsByColumnId?) => TItem[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L114)

**`Internal`**

Orders items that each belong to a leaf column, such as visible leaf
columns or a row's visible cells: start-pinned items in pinning order, then
unpinned items in their given order, then end-pinned items in pinning
order. The core headers, row visible cells, and cell selection order
through it.

`getItemsByColumnId` can return an existing lookup of the same items. It
is only read when something is pinned.

#### Type Parameters

##### TItem

`TItem`

#### Parameters

##### items

`TItem`[]

##### getColumnId

(`item`) => `string`

##### getItemsByColumnId?

() => `Record`\<`string`, `TItem` \| `undefined`\>

#### Returns

`TItem`[]

***

### getCenterFlatHeaders

```ts
getCenterFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L123)

Builds flat center-region headers for columns that are not pinned,
including parent headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterFooterGroups

```ts
getCenterFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L127)

Builds footer groups for the center region of unpinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterHeaderGroups

```ts
getCenterHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L131)

Builds header groups for the center region of unpinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getCenterLeafColumns

```ts
getCenterLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L135)

Gets leaf columns that are not pinned start or end.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterLeafHeaders

```ts
getCenterLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L139)

Builds center-region leaf headers for columns that are not pinned.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getCenterVisibleLeafColumns

```ts
getCenterVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L143)

Lists visible leaf columns in the unpinned center region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndFlatHeaders

```ts
getEndFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L177)

Builds flat logical end-region headers for pinned columns, including parent
headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndFooterGroups

```ts
getEndFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L181)

Builds footer groups for logical end-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getEndHeaderGroups

```ts
getEndHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L185)

Builds header groups for logical end-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getEndLeafColumns

```ts
getEndLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L189)

Gets leaf columns pinned to the logical end region in pinning-state order.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndLeafHeaders

```ts
getEndLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:193](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L193)

Builds leaf headers for logical end-pinned columns.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getEndVisibleLeafColumns

```ts
getEndVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L197)

Lists visible leaf columns in the logical end pinned region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getIsSomeColumnsPinned

```ts
getIsSomeColumnsPinned: (position?) => boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L147)

Checks whether any columns are pinned, optionally limited to one side.

#### Parameters

##### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

#### Returns

`boolean`

***

### getPinnedLeafColumns

```ts
getPinnedLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L211)

Returns pinned leaf columns for the requested pinning region.

#### Parameters

##### position

  \| [`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)
  \| `"center"`

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getPinnedVisibleLeafColumns

```ts
getPinnedVisibleLeafColumns: (position) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L217)

Lists visible leaf columns for the requested pinning region.

#### Parameters

##### position

  \| [`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)
  \| `"center"`

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartFlatHeaders

```ts
getStartFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:152](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L152)

Builds flat logical start-region headers for pinned columns, including parent
headers.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartFooterGroups

```ts
getStartFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L156)

Builds footer groups for logical start-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getStartHeaderGroups

```ts
getStartHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L160)

Builds header groups for logical start-pinned columns.

#### Returns

[`HeaderGroup`](HeaderGroup.md)\<`TFeatures`, `TData`\>[]

***

### getStartLeafColumns

```ts
getStartLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L164)

Gets leaf columns pinned to the logical start region in pinning-state order.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartLeafHeaders

```ts
getStartLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L168)

Builds leaf headers for logical start-pinned columns.

#### Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getStartVisibleLeafColumns

```ts
getStartVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L172)

Lists visible leaf columns in the logical start pinned region.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnPinning

```ts
resetColumnPinning: (defaultState?) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L203)

Resets `columnPinning` to `initialState.columnPinning`.

Pass `true` to ignore initial state and reset to empty start/end arrays.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnPinning

```ts
setColumnPinning: (updater) => void;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L207)

Updates column pinning state with a next state or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnPinningState`](ColumnPinningState.md)\>

#### Returns

`void`
