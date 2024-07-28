---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

# Interface: Table\_ColumnPinning\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getCenterFlatHeaders()

```ts
getCenterFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all columns that are not pinned, including parent headers.

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterflatheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:114](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L114)

***

### getCenterFooterGroups()

```ts
getCenterFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the footer groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterfootergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:120](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L120)

***

### getCenterHeaderGroups()

```ts
getCenterHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the header groups for columns that are not pinned.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterheadergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:126](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L126)

***

### getCenterLeafColumns()

```ts
getCenterLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all center pinned (unpinned) leaf columns.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getcenterleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:132](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L132)

***

### getCenterLeafHeaders()

```ts
getCenterLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all columns that are not pinned, (not including parent headers).

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getcenterleafheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:138](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L138)

***

### getCenterVisibleLeafColumns()

```ts
getCenterVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

If column pinning, returns a flat array of leaf-node columns that are visible in the unpinned/center portion of the table.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getcentervisibleleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:144](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L144)

***

### getIsSomeColumnsPinned()

```ts
getIsSomeColumnsPinned: (position?) => boolean;
```

Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.

#### Parameters

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getissomecolumnspinned)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:150](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L150)

***

### getLeftFlatHeaders()

```ts
getLeftFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all left pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftflatheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:156](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L156)

***

### getLeftFooterGroups()

```ts
getLeftFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the footer groups for the left pinned columns.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftfootergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:162](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L162)

***

### getLeftHeaderGroups()

```ts
getLeftHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the header groups for the left pinned columns.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftheadergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:168](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L168)

***

### getLeftLeafColumns()

```ts
getLeftLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all left pinned leaf columns.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getleftleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:174](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L174)

***

### getLeftLeafHeaders()

```ts
getLeftLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all left pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getleftleafheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:180](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L180)

***

### getLeftVisibleLeafColumns()

```ts
getLeftVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

If column pinning, returns a flat array of leaf-node columns that are visible in the left portion of the table.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getleftvisibleleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:186](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L186)

***

### getRightFlatHeaders()

```ts
getRightFlatHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all right pinned columns in the table, including parent headers.

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightflatheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:192](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L192)

***

### getRightFooterGroups()

```ts
getRightFooterGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the footer groups for the right pinned columns.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightfootergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:198](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L198)

***

### getRightHeaderGroups()

```ts
getRightHeaderGroups: () => HeaderGroup<TFeatures, TData>[];
```

If pinning, returns the header groups for the right pinned columns.

#### Returns

[`HeaderGroup`](headergroup.md)\<`TFeatures`, `TData`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightheadergroups)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:204](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L204)

***

### getRightLeafColumns()

```ts
getRightLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns all right pinned leaf columns.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#getrightleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:210](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L210)

***

### getRightLeafHeaders()

```ts
getRightLeafHeaders: () => Header<TFeatures, TData, unknown>[];
```

If pinning, returns headers for all right pinned leaf columns in the table, (not including parent headers).

#### Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/headers#getrightleafheaders)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/headers)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:216](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L216)

***

### getRightVisibleLeafColumns()

```ts
getRightVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

If column pinning, returns a flat array of leaf-node columns that are visible in the right portion of the table.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getrightvisibleleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:222](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L222)

***

### resetColumnPinning()

```ts
resetColumnPinning: (defaultState?) => void;
```

Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#resetcolumnpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:228](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L228)

***

### setColumnPinning()

```ts
setColumnPinning: (updater) => void;
```

Sets or updates the `state.columnPinning` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnPinningState`](columnpinningstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#setcolumnpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:234](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L234)
