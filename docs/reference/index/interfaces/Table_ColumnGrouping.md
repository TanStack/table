---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

# Interface: Table\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L175)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### resetGrouping()

```ts
resetGrouping: (defaultState?) => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:182](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L182)

Resets the **grouping** state to `initialState.grouping`, or `true` can be passed to force a default blank state reset to `[]`.

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:186](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L186)

Sets grouping state using a value or updater.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`GroupingState`](../type-aliases/GroupingState.md)\>

#### Returns

`void`
