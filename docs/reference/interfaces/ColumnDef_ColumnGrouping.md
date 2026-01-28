---
id: ColumnDef_ColumnGrouping
title: ColumnDef_ColumnGrouping
---

# Interface: ColumnDef\_ColumnGrouping\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L53)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### aggregatedCell?

```ts
optional aggregatedCell: ColumnDefTemplate<ReturnType<Cell<TFeatures, TData, TValue>["getContext"]>>;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:61](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L61)

The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).

***

### aggregationFn?

```ts
optional aggregationFn: AggregationFnOption<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L67)

The resolved aggregation function for the column.

***

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L71)

Enables/disables grouping for this column.

***

### getGroupingValue()?

```ts
optional getGroupingValue: (row) => any;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L75)

Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.

#### Parameters

##### row

`TData`

#### Returns

`any`
