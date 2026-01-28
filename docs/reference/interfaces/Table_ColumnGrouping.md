---
id: Table_ColumnGrouping
title: Table_ColumnGrouping
---

# Interface: Table\_ColumnGrouping\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L173)

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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L180)

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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L184)

Updates the grouping state of the table via an update function or value.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`GroupingState`](../type-aliases/GroupingState.md)\>

#### Returns

`void`
