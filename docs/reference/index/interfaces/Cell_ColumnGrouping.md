---
id: Cell_ColumnGrouping
title: Cell_ColumnGrouping
---

# Interface: Cell\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L211)

## Properties

### getIsAggregated()

```ts
getIsAggregated: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:215](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L215)

Checks whether this cell should render an aggregated value.

#### Returns

`boolean`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:219](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L219)

Checks whether this cell represents the active grouping column.

#### Returns

`boolean`

***

### getIsPlaceholder()

```ts
getIsPlaceholder: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:223](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L223)

Checks whether this cell is hidden as a grouping placeholder.

#### Returns

`boolean`
