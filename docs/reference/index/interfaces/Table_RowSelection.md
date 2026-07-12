---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L114)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L123)

**`Internal`**

The most recent row interacted with through the row selection handler.

***

### getFilteredSelectedRowModel()

```ts
getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L127)

Builds a selected-row model from rows after filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L131)

Builds a selected-row model from rows after grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L139)

Checks whether every selectable row on the current page is selected.

#### Returns

`boolean`

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L143)

Checks whether every selectable filtered row is selected.

#### Returns

`boolean`

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L147)

Checks whether the current page has a partial row selection.

#### Returns

`boolean`

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L151)

Checks whether filtered rows have a partial row selection.

#### Returns

`boolean`

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:155](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L155)

Returns the core row model of all rows before row selection has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSelectedRowIds()

```ts
getSelectedRowIds: () => string[];
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L135)

Returns the ids of all selected rows.

#### Returns

`string`[]

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:159](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L159)

Builds a selected-row model from the core row model.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L163)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:167](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L167)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L173)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L177)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L181)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L188)

Selects/deselects all rows in the table.

#### Parameters

##### value?

`boolean`

##### opts?

###### deselectAll?

`boolean`

#### Returns

`void`
