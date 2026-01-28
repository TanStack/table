---
id: Table_ColumnVisibility
title: Table_ColumnVisibility
---

# Interface: Table\_ColumnVisibility\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L28)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getIsAllColumnsVisible()

```ts
getIsAllColumnsVisible: () => boolean;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L35)

Returns whether all columns are visible

#### Returns

`boolean`

***

### getIsSomeColumnsVisible()

```ts
getIsSomeColumnsVisible: () => boolean;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L39)

Returns whether any columns are visible

#### Returns

`boolean`

***

### getToggleAllColumnsVisibilityHandler()

```ts
getToggleAllColumnsVisibilityHandler: () => (event) => void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L43)

Returns a handler for toggling the visibility of all columns, meant to be bound to a `input[type=checkbox]` element.

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

### getVisibleFlatColumns()

```ts
getVisibleFlatColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L47)

Returns a flat array of columns that are visible, including parent columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleLeafColumns()

```ts
getVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L51)

Returns a flat array of leaf-node columns that are visible.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnVisibility()

```ts
resetColumnVisibility: (defaultState?) => void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L55)

Resets the column visibility state to the initial state. If `defaultState` is provided, the state will be reset to `{}`

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setColumnVisibility()

```ts
setColumnVisibility: (updater) => void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L59)

Sets or updates the `state.columnVisibility` state.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnVisibilityState`](../type-aliases/ColumnVisibilityState.md)\>

#### Returns

`void`

***

### toggleAllColumnsVisible()

```ts
toggleAllColumnsVisible: (value?) => void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L63)

Toggles the visibility of all columns.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
