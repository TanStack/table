---
id: TableOptions_ColumnGrouping
title: TableOptions_ColumnGrouping
---

# Interface: TableOptions\_ColumnGrouping

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:152](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L152)

## Properties

### enableGrouping?

```ts
optional enableGrouping: boolean;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L156)

Enables/disables grouping for the table.

***

### groupedColumnMode?

```ts
optional groupedColumnMode: false | "reorder" | "remove";
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L160)

Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.

***

### manualGrouping?

```ts
optional manualGrouping: boolean;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L164)

Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.

***

### onGroupingChange?

```ts
optional onGroupingChange: OnChangeFn<GroupingState>;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L168)

If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.
