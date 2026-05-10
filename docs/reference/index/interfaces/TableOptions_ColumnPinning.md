---
id: TableOptions_ColumnPinning
title: TableOptions_ColumnPinning
---

# Interface: TableOptions\_ColumnPinning

Defined in: [features/column-pinning/columnPinningFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L19)

## Properties

### enableColumnPinning?

```ts
optional enableColumnPinning: boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L23)

Enables/disables column pinning for the table. Defaults to `true`.

***

### onColumnPinningChange?

```ts
optional onColumnPinningChange: OnChangeFn<ColumnPinningState>;
```

Defined in: [features/column-pinning/columnPinningFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L29)

Called with an updater when column pinning state changes. Pair this with
`state.columnPinning` when using external state; external atoms can own the
slice without this callback.
