---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

# Interface: Table\_ColumnGrouping\<_TFeatures, _TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L117)

## Type Parameters

### _TFeatures

`_TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### _TData

`_TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resetGrouping()

```ts
resetGrouping: (defaultState?) => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L126)

Resets `grouping` to `initialState.grouping`.

Pass `true` to ignore initial state and reset to `[]`.

#### Parameters

##### defaultState?

`boolean`

#### Returns

`void`

***

### setGrouping()

```ts
setGrouping: (updater) => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:130](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L130)

Updates grouping state with a next ordered id array or updater function.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`GroupingState`](../type-aliases/GroupingState.md)\>

#### Returns

`void`
