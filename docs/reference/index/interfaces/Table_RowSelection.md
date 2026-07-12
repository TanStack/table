---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L117)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L126)

**`Internal`**

The most recent row interacted with through the row selection handler.

***

### getFilteredSelectedRowModel()

```ts
getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L130)

Builds a selected-row model from rows after filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L134)

Builds a selected-row model from rows after grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L142)

Checks whether every selectable row on the current page is selected.

#### Returns

`boolean`

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L146)

Checks whether every selectable filtered row is selected.

#### Returns

`boolean`

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L150)

Checks whether the current page has a partial row selection.

#### Returns

`boolean`

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:154](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L154)

Checks whether filtered rows have a partial row selection.

#### Returns

`boolean`

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L158)

Returns the core row model of all rows before row selection has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSelectedRowIds()

```ts
getSelectedRowIds: () => string[];
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L138)

Returns the ids of all selected rows.

#### Returns

`string`[]

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:162](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L162)

Builds a selected-row model from the core row model.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L166)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L170)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L176)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L180)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L184)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L191)

Selects/deselects all rows in the table.

#### Parameters

##### value?

`boolean`

##### opts?

###### deselectAll?

`boolean`

#### Returns

`void`
