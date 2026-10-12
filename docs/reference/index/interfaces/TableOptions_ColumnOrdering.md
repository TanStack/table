---
id: TableOptions_ColumnOrdering
title: TableOptions_ColumnOrdering
---

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L31)

## Properties

### onColumnOrderChange?

```ts
optional onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
```

Defined in: [features/column-ordering/columnOrderingFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts#L37)

Called with an updater when column order state changes. Pair this with
`state.columnOrder` when using external state; external atoms can own the
slice without this callback.
