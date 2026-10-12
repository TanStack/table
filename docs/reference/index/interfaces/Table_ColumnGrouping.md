---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:118](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L118)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### \_orderGroupedColumns

```ts
_orderGroupedColumns: (columns) => Column<TFeatures, TData, unknown>[];
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L128)

**`Internal`**

Moves grouped leaf columns as `groupedColumnMode` sets. Leaf column order
falls back to it when the column ordering feature is not registered.

#### Parameters

##### columns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

#### Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>[]

***

### resetGrouping

```ts
resetGrouping: (defaultState?) => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L136)

Resets `grouping` to `initialState.grouping`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setGrouping

```ts
setGrouping: (updater) => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L140)

Updates grouping state with a next ordered id array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`GroupingState`](../type-aliases/GroupingState.md)\>

#### Returns

`void`
