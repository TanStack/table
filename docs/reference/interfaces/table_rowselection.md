---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getFilteredSelectedRowModel()

```ts
getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model of all rows that are selected after filtering has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getfilteredselectedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:116](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L116)

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model of all rows that are selected after grouping has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getgroupedselectedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:122](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L122)

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Returns whether or not all rows on the current page are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getisallpagerowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:128](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L128)

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Returns whether or not all rows in the table are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getisallrowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:134](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L134)

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Returns whether or not any rows on the current page are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getissomepagerowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:140](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L140)

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Returns whether or not any rows in the table are selected.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getissomerowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:146](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L146)

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the core row model of all rows before row selection has been applied.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getpreselectedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:152](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L152)

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model of all rows that are selected.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#getselectedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:158](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L158)

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Returns a handler that can be used to toggle all rows on the current page.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#gettoggleallpagerowsselectedhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:164](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L164)

***

### getToggleAllRowsSelectedHandler()

```ts
getToggleAllRowsSelectedHandler: () => (event) => void;
```

Returns a handler that can be used to toggle all rows in the table.

#### Returns

`Function`

##### Parameters

• **event**: `unknown`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#gettoggleallrowsselectedhandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:170](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L170)

***

### resetRowSelection()

```ts
resetRowSelection: (defaultState?) => void;
```

Resets the **rowSelection** state to the `initialState.rowSelection`, or `true` can be passed to force a default blank state reset to `{}`.

#### Parameters

• **defaultState?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#resetrowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:176](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L176)

***

### setRowSelection()

```ts
setRowSelection: (updater) => void;
```

Sets or updates the `state.rowSelection` state.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`RowSelectionState`](../type-aliases/rowselectionstate.md)\>

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#setrowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:182](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L182)

***

### toggleAllPageRowsSelected()

```ts
toggleAllPageRowsSelected: (value?) => void;
```

Selects/deselects all rows on the current page.

#### Parameters

• **value?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#toggleallpagerowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:188](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L188)

***

### toggleAllRowsSelected()

```ts
toggleAllRowsSelected: (value?) => void;
```

Selects/deselects all rows in the table.

#### Parameters

• **value?**: `boolean`

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#toggleallrowsselected)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:194](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L194)
