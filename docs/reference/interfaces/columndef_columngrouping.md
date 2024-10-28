---
id: ColumnDef_ColumnGrouping
title: ColumnDef_ColumnGrouping
---

# Interface: ColumnDef\_ColumnGrouping\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### aggregatedCell?

```ts
optional aggregatedCell: ColumnDefTemplate<ReturnType<Cell<TFeatures, TData, TValue>["getContext"]>>;
```

The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregatedcell)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:63](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L63)

***

### aggregationFn?

```ts
optional aggregationFn: AggregationFnOption<TFeatures, TData>;
```

The resolved aggregation function for the column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregationfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L71)

***

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Enables/disables grouping for this column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L77)

***

### getGroupingValue()?

```ts
optional getGroupingValue: (row) => any;
```

Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.

#### Parameters

• **row**: `TData`

#### Returns

`any`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:83](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L83)
