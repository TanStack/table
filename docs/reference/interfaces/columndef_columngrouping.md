---
id: ColumnDef_ColumnGrouping
title: ColumnDef_ColumnGrouping
---

# Interface: ColumnDef\_ColumnGrouping\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### aggregatedCell?

```ts
optional aggregatedCell: ColumnDefTemplate<CellContext<TableFeatures, TData, TValue>>;
```

The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#aggregatedcell)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:55](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L55)

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

[features/column-grouping/ColumnGrouping.types.ts:63](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L63)

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

[features/column-grouping/ColumnGrouping.types.ts:69](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L69)

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

[features/column-grouping/ColumnGrouping.types.ts:75](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L75)
