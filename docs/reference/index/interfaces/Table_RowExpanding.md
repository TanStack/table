---
id: Table_RowExpanding
title: Table_RowExpanding
---

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L72)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_expandRows

```ts
_expandRows: (rowModel) => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L82)

**`Internal`**

Lists expanded sub-rows inline below their parents. Row display order and
the paginated row model expand rows through it.

#### Parameters

##### rowModel

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### autoResetExpanded

```ts
autoResetExpanded: () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L91)

Resets expanded state after the table data or grouping changes.

Honors `autoResetAll`, `autoResetExpanded`, and `manualExpanding`. Called
by the row models; you rarely need to invoke it yourself.

#### Returns

`void`

***

### getCanSomeRowsExpand

```ts
getCanSomeRowsExpand: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L95)

Checks whether at least one row can be expanded.

#### Returns

`boolean`

***

### getExpandedDepth

```ts
getExpandedDepth: () => number;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L99)

Computes the deepest expanded row id depth.

#### Returns

`number`

***

### getIsAllRowsExpanded

```ts
getIsAllRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L103)

Checks whether all rows in the current row model are expanded.

#### Returns

`boolean`

***

### getIsSomeRowsExpanded

```ts
getIsSomeRowsExpanded: () => boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L107)

Checks whether any row is currently expanded.

#### Returns

`boolean`

***

### getToggleAllRowsExpandedHandler

```ts
getToggleAllRowsExpandedHandler: () => (event) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L111)

Creates a handler that toggles all rows expanded.

#### Returns

(`event`) => `void`

***

### resetExpanded

```ts
resetExpanded: (defaultState?) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L117)

Resets `expanded` to `initialState.expanded`.

Pass `true` to ignore initial state and reset to `{}`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setExpanded

```ts
setExpanded: (updater) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L121)

Updates expanded state with `true`, a row-id map, or an updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`ExpandedState`](../type-aliases/ExpandedState.md)\>

#### Returns

`void`

***

### toggleAllRowsExpanded

```ts
toggleAllRowsExpanded: (expanded?) => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L125)

Toggles the expanded state for all rows.

#### Parameters

##### expanded?

`boolean`

#### Returns

`void`
