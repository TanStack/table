---
id: TableOptions_ColumnOrdering
title: TableOptions_ColumnOrdering
---

# Interface: TableOptions\_ColumnOrdering

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L11)

## Properties

### onColumnOrderChange?

```ts
optional onColumnOrderChange: OnChangeFn<ColumnOrderState>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L15)

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
