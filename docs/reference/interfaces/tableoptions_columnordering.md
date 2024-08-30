---
id: TableOptions_ColumnOrdering
title: TableOptions_ColumnOrdering
---

# Interface: TableOptions\_ColumnOrdering

## Properties

### onColumnOrderChange?

```ts
optional onColumnOrderChange: OnChangeFn<ColumnOrderState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnOrder` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-ordering#oncolumnorderchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-ordering)

#### Defined in

[features/column-ordering/ColumnOrdering.types.ts:18](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-ordering/ColumnOrdering.types.ts#L18)