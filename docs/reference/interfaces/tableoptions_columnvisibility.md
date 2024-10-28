---
id: TableOptions_ColumnVisibility
title: TableOptions_ColumnVisibility
---

# Interface: TableOptions\_ColumnVisibility

## Properties

### enableHiding?

```ts
optional enableHiding: boolean;
```

Whether to enable column hiding. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#enablehiding)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L18)

***

### onColumnVisibilityChange?

```ts
optional onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)

#### Defined in

[features/column-visibility/ColumnVisibility.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.types.ts#L24)
