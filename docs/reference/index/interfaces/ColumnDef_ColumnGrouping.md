---
id: ColumnDef_ColumnGrouping
title: ColumnDef_ColumnGrouping
---

# Interface: ColumnDef\_ColumnGrouping\<TFeatures, TData, TValue\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L123)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L131)

The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).

***

### aggregationFn?

```ts
optional aggregationFn: AggregationFnOption<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L137)

The resolved aggregation function for the column.

***

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L143)

Allows this column to be added to grouping state.

Defaults to `true`; table-level `enableGrouping` must also allow grouping.

***

### getGroupingValue()?

```ts
optional getGroupingValue: (originalRow, index, row) => any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L150)

Returns the value used to group rows for this column.

When omitted, grouping uses the value derived from this column's
`accessorKey` or `accessorFn`.

#### Parameters

##### originalRow

`TData`

##### index

`number`

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`any`
