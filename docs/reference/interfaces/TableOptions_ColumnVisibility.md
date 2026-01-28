---
id: TableOptions_ColumnVisibility
title: TableOptions_ColumnVisibility
---

# Interface: TableOptions\_ColumnVisibility

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L12)

## Properties

### enableHiding?

```ts
optional enableHiding: boolean;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L16)

Whether to enable column hiding. Defaults to `true`.

***

### onColumnVisibilityChange?

```ts
optional onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState>;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L20)

If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
