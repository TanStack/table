---
id: TableOptions_ColumnSizing
title: TableOptions_ColumnSizing
---

# Interface: TableOptions\_ColumnSizing

Defined in: [features/column-sizing/columnSizingFeature.types.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L10)

## Properties

### onColumnSizingChange?

```ts
optional onColumnSizingChange: OnChangeFn<ColumnSizingState>;
```

Defined in: [features/column-sizing/columnSizingFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts#L16)

Called with an updater when committed column sizing state changes. Pair
this with `state.columnSizing` when using external state; external atoms
can own the slice without this callback.
