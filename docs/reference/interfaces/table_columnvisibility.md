---
id: Table_ColumnVisibility
title: Table_ColumnVisibility
---

# Interface: Table\_ColumnVisibility\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getIsAllColumnsVisible()

```ts
getIsAllColumnsVisible: () => boolean;
```

Returns whether all columns are visible

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getisallcolumnsvisible)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L41)

***

### getIsSomeColumnsVisible()

```ts
getIsSomeColumnsVisible: () => boolean;
```

Returns whether any columns are visible

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getissomecolumnsvisible)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L47)

***

### getToggleAllColumnsVisibilityHandler()

```ts
getToggleAllColumnsVisibilityHandler: () => (event) => void;
```

Returns a handler for toggling the visibility of all columns, meant to be bound to a `input[type=checkbox]` element.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#gettoggleallcolumnsvisibilityhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L53)

***

### getVisibleFlatColumns()

```ts
getVisibleFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns a flat array of columns that are visible, including parent columns.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisibleflatcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L59)

***

### getVisibleLeafColumns()

```ts
getVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Returns a flat array of leaf-node columns that are visible.

#### Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#getvisibleleafcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L65)

***

### resetColumnVisibility()

```ts
resetColumnVisibility: (defaultState?) => void;
```

Resets the column visibility state to the initial state. If `defaultState` is provided, the state will be reset to `{}`

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#resetcolumnvisibility)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L71)

***

### setColumnVisibility()

```ts
setColumnVisibility: (updater) => void;
```

Sets or updates the `state.columnVisibility` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`ColumnVisibilityState`](../type-aliases/columnvisibilitystate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#setcolumnvisibility)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L77)

***

### toggleAllColumnsVisible()

```ts
toggleAllColumnsVisible: (value?) => void;
```

Toggles the visibility of all columns.

#### Parameters

• **value?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#toggleallcolumnsvisible)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L83)
