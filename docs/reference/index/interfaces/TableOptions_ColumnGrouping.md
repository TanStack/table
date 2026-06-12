---
id: TableOptions_ColumnGrouping
title: TableOptions_ColumnGrouping
---

# Interface: TableOptions\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L169)

## Properties

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L173)

Allows columns to be grouped for this table.

***

### groupedColumnMode?

```ts
optional groupedColumnMode: false | "reorder" | "remove";
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L177)

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

***

### manualGrouping?

```ts
optional manualGrouping: boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:181](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L181)

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

***

### onGroupingChange?

```ts
optional onGroupingChange: OnChangeFn<GroupingState>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L187)

Called with an updater when grouping state changes. Pair this with
`state.grouping` when using external state; external atoms can own the
slice without this callback.
