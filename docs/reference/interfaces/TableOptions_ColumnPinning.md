---
id: TableOptions_ColumnPinning
title: TableOptions_ColumnPinning
---

# Interface: TableOptions\_ColumnPinning

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L19)

## Properties

### enableColumnPinning?

```ts
optional enableColumnPinning: boolean;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L23)

Enables/disables column pinning for the table. Defaults to `true`.

***

### onColumnPinningChange?

```ts
optional onColumnPinningChange: OnChangeFn<ColumnPinningState>;
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts#L27)

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.
