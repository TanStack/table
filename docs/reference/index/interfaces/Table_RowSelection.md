---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L129)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_lastSelectedRowId

```ts
_lastSelectedRowId: string | null;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L138)

**`Internal`**

The most recent row interacted with through the row selection handler.

***

### getFilteredSelectedRowModel()

```ts
getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L142)

Builds a selected-row model from rows after filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L146)

Builds a selected-row model from rows after grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L155)

Checks whether every selectable row on the current page is selected.
Sub-rows whose ancestors block sub-row selection are ignored.

#### Returns

`boolean`

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L160)

Checks whether every selectable filtered row is selected.
Sub-rows whose ancestors block sub-row selection are ignored.

#### Returns

`boolean`

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L164)

Checks whether at least one selectable row on the current page is selected.

#### Returns

`boolean`

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L168)

Checks whether at least one row id is selected.

#### Returns

`boolean`

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L172)

Returns the core row model of all rows before row selection has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSelectedRowIds()

```ts
getSelectedRowIds: () => string[];
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L150)

Returns the ids of all selected rows.

#### Returns

`string`[]

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L176)

Builds a selected-row model from the core row model.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L180)

Creates a checkbox-style handler that toggles all current-page rows.

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`

***

### getToggleAllRowsSelectedHandler()

```ts
getToggleAllRowsSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L184)

Creates a checkbox-style handler that toggles all selectable rows.

#### Returns

```ts
(event): void;
```

##### Parameters

###### event

`unknown`

##### Returns

`void`

***

### resetRowSelection()

```ts
resetRowSelection: (defaultState?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:190](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L190)

Resets `rowSelection` to `initialState.rowSelection`.

Pass `true` to ignore initial state and reset to `{}`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setRowSelection()

```ts
setRowSelection: (updater) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L194)

Updates row selection state with a next map or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowSelectionState`](../type-aliases/RowSelectionState.md)\>

#### Returns

`void`

***

### toggleAllPageRowsSelected()

```ts
toggleAllPageRowsSelected: (value?, opts?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L198)

Selects/deselects all rows on the current page.

#### Parameters

##### value?

`boolean`

##### opts?

###### deselectAll?

`boolean`

#### Returns

`void`

***

### toggleAllRowsSelected()

```ts
toggleAllRowsSelected: (value?, opts?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L208)

Selects/deselects all rows in the table.

Deselecting keeps rows that cannot be selected in the selection map unless
`opts.deselectAll` is `true`.

#### Parameters

##### value?

`boolean`

##### opts?

###### deselectAll?

`boolean`

#### Returns

`void`
