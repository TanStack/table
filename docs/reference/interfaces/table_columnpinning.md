---
id: Table_ColumnPinning
title: Table_ColumnPinning
---

# Interface: Table\_ColumnPinning\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

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

[features/column-pinning/ColumnPinning.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L107)

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

[features/column-pinning/ColumnPinning.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L113)

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

[features/column-pinning/ColumnPinning.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L119)

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

[features/column-pinning/ColumnPinning.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L125)

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

[features/column-pinning/ColumnPinning.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L131)

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

[features/column-pinning/ColumnPinning.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L137)

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

[features/column-pinning/ColumnPinning.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L143)

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

[features/column-pinning/ColumnPinning.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L149)

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

[features/column-pinning/ColumnPinning.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L155)

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

[features/column-pinning/ColumnPinning.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L161)

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

[features/column-pinning/ColumnPinning.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L167)

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

[features/column-pinning/ColumnPinning.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L173)

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

[features/column-pinning/ColumnPinning.types.ts:179](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L179)

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

[features/column-pinning/ColumnPinning.types.ts:185](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L185)

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

[features/column-pinning/ColumnPinning.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L191)

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

[features/column-pinning/ColumnPinning.types.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L197)

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

[features/column-pinning/ColumnPinning.types.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L203)

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

[features/column-pinning/ColumnPinning.types.ts:209](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L209)

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

[features/column-pinning/ColumnPinning.types.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L215)

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

[features/column-pinning/ColumnPinning.types.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L221)

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

[features/column-pinning/ColumnPinning.types.ts:227](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L227)
