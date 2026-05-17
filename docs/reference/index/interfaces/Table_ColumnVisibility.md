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

Checks whether every leaf column is currently visible.

#### Returns

`boolean`

***

### getIsSomeColumnsVisible()

```ts
getIsSomeColumnsVisible: () => boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L41)

Checks whether at least one leaf column is currently visible.

#### Returns

`boolean`

***

### getToggleAllColumnsVisibilityHandler()

```ts
getToggleAllColumnsVisibilityHandler: () => (event) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L45)

Creates a checkbox-style handler that shows or hides all columns.

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L50)

Lists visible columns in flat table order, including parent columns that
have visible descendants.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### getVisibleLeafColumns()

```ts
getVisibleLeafColumns: () => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L54)

Lists visible leaf columns in the order used for row cells and headers.

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetColumnVisibility()

```ts
resetColumnVisibility: (defaultState?) => void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L60)

Resets `columnVisibility` to `initialState.columnVisibility`.

Pass `true` to ignore initial state and reset to `{}`.

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L64)

Updates column visibility state with a next map or updater function.

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

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L68)

Toggles the visibility of all columns.

#### Parameters

##### value?

`boolean`

#### Returns

`void`
