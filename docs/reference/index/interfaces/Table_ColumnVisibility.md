---
id: Table_ColumnVisibility
title: Table_ColumnVisibility
---

# Interface: Table\_ColumnVisibility\<TFeatures, TData\>

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L30)

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L37)

Returns whether all columns are visible

#### Returns

`boolean`

***

### getIsSomeColumnsVisible()

```ts
getIsSomeColumnsVisible: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L41)

Returns whether any columns are visible

#### Returns

`boolean`

***

### getToggleAllColumnsVisibilityHandler()

```ts
getToggleAllColumnsVisibilityHandler: () => (event) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L45)

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L49)

Returns a flat array of columns that are visible, including parent columns.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleLeafColumns()

```ts
getVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L53)

Returns a flat array of leaf-node columns that are visible.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnVisibility()

```ts
resetColumnVisibility: (defaultState?) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L57)

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L61)

Sets column visibility state using a value or updater.

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:65](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L65)

Toggles the visibility of all columns.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
