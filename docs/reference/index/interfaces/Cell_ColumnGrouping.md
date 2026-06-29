---
id: Cell_ColumnGrouping
title: Cell_ColumnGrouping
---

# Interface: Cell\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L156)

## Properties

### getIsAggregated()

```ts
getIsAggregated: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L160)

Checks whether this cell should render an aggregated value.

#### Returns

`boolean`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L164)

Checks whether this cell represents the active grouping column.

#### Returns

`boolean`

***

### getIsPlaceholder()

```ts
getIsPlaceholder: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L168)

Checks whether this cell is hidden as a grouping placeholder.

#### Returns

`boolean`
