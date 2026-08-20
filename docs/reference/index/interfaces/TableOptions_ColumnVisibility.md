---
id: TableOptions_ColumnVisibility
title: TableOptions_ColumnVisibility
---

# Interface: TableOptions\_ColumnVisibility

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L12)

## Properties

### enableHiding?

```ts
optional enableHiding: boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L16)

Whether to enable column hiding. Defaults to `true`.

***

### onColumnVisibilityChange?

```ts
optional onColumnVisibilityChange: OnChangeFn<ColumnVisibilityState>;
```

Defined in: [features/column-visibility/columnVisibilityFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts#L22)

Called with an updater when column visibility state changes. Pair this with
`state.columnVisibility` when using external state; external atoms can own
the slice without this callback.
