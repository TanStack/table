---
id: TableOptions_ColumnPinning
title: TableOptions_ColumnPinning
---

# Interface: TableOptions\_ColumnPinning

Defined in: [features/column-pinning/columnPinningFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L26)

## Properties

### enableColumnPinning?

```ts
optional enableColumnPinning: boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L37)

Allows columns to be pinned into logical start and end regions.

In LTR languages/layouts, start usually corresponds to left and end to
right. In RTL languages/layouts, start usually corresponds to right and end
to left.

Defaults to `true`; column-level `enablePinning` can still opt individual
columns out.

***

### onColumnPinningChange?

```ts
optional onColumnPinningChange: OnChangeFn<ColumnPinningState>;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L43)

Called with an updater when column pinning state changes. Pair this with
`state.columnPinning` when using external state; external atoms can own the
slice without this callback.
