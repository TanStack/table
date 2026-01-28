---
id: Table_RowSelection
title: Table_RowSelection
---

# Interface: Table\_RowSelection\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L83)

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L90)

Returns the row model of all rows that are selected after filtering has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGroupedSelectedRowModel()

```ts
getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L94)

Returns the row model of all rows that are selected after grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getIsAllPageRowsSelected()

```ts
getIsAllPageRowsSelected: () => boolean;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L98)

Returns whether or not all rows on the current page are selected.

#### Returns

`boolean`

***

### getIsAllRowsSelected()

```ts
getIsAllRowsSelected: () => boolean;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L102)

Returns whether or not all rows in the table are selected.

#### Returns

`boolean`

***

### getIsSomePageRowsSelected()

```ts
getIsSomePageRowsSelected: () => boolean;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L106)

Returns whether or not any rows on the current page are selected.

#### Returns

`boolean`

***

### getIsSomeRowsSelected()

```ts
getIsSomeRowsSelected: () => boolean;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L110)

Returns whether or not any rows in the table are selected.

#### Returns

`boolean`

***

### getPreSelectedRowModel()

```ts
getPreSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L114)

Returns the core row model of all rows before row selection has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getSelectedRowModel()

```ts
getSelectedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L118)

Returns the row model of all rows that are selected.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getToggleAllPageRowsSelectedHandler()

```ts
getToggleAllPageRowsSelectedHandler: () => (event) => void;
```

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L122)

Returns a handler that can be used to toggle all rows on the current page.

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L126)

Returns a handler that can be used to toggle all rows in the table.

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L130)

Resets the **rowSelection** state to the `initialState.rowSelection`, or `true` can be passed to force a default blank state reset to `{}`.

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L134)

Sets or updates the `state.rowSelection` state.

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L138)

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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L142)

Selects/deselects all rows in the table.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
