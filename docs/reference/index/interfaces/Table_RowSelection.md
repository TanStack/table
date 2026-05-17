---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L89)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getFilteredSelectedRowModel()

```ts
getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L96)

Builds a selected-row model from rows after filtering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L100)

Builds a selected-row model from rows after grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L104)

Checks whether every selectable row on the current page is selected.

#### Returns

`boolean`

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L108)

Checks whether every selectable filtered row is selected.

#### Returns

`boolean`

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L112)

Checks whether the current page has a partial row selection.

#### Returns

`boolean`

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:116](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L116)

Checks whether filtered rows have a partial row selection.

#### Returns

`boolean`

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L120)

Returns the core row model of all rows before row selection has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L124)

Builds a selected-row model from the core row model.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L128)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:132](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L132)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L138)

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

Defined in: [features/row-selection/rowSelectionFeature.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L142)

Updates row selection state with a next map or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowSelectionState`](../type-aliases/RowSelectionState.md)\>

#### Returns

`void`

***

### toggleAllPageRowsSelected()

```ts
toggleAllPageRowsSelected: (value?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L146)

Selects/deselects all rows on the current page.

#### Parameters

##### value?

`boolean`

#### Returns

`void`

***

### toggleAllRowsSelected()

```ts
toggleAllRowsSelected: (value?) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L150)

Selects/deselects all rows in the table.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
