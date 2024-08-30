---
id: TableOptions_ColumnGrouping
title: TableOptions_ColumnGrouping
---

# Interface: TableOptions\_ColumnGrouping\<TFeatures, TData\>

## Extends

- `GroupingOptionsBase`.`ResolvedAggregationFns`\<`TFeatures`, `TData`\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### aggregationFns?

```ts
optional aggregationFns: Record<string, AggregationFn<TFeatures, TData>>;
```

#### Inherited from

`ResolvedAggregationFns.aggregationFns`

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:212](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L212)

***

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Enables/disables grouping for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#enablegrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Inherited from

`GroupingOptionsBase.enableGrouping`

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:186](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L186)

***

### groupedColumnMode?

```ts
optional groupedColumnMode: false | "reorder" | "remove";
```

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Inherited from

`GroupingOptionsBase.groupedColumnMode`

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:192](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L192)

***

### manualGrouping?

```ts
optional manualGrouping: boolean;
```

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Inherited from

`GroupingOptionsBase.manualGrouping`

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:198](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L198)

***

### onGroupingChange?

```ts
optional onGroupingChange: OnChangeFn<GroupingState>;
```

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Inherited from

`GroupingOptionsBase.onGroupingChange`

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:204](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L204)