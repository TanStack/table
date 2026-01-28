---
id: TableOptions_ColumnSizing
title: TableOptions_ColumnSizing
---

# Interface: TableOptions\_ColumnSizing

Defined in: [packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L10)

## Properties

### onColumnSizingChange?

```ts
optional onColumnSizingChange: OnChangeFn<ColumnSizingState>;
```

Defined in: [packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L14)

If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.
