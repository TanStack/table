---
id: TableOptions_ColumnPinning
title: TableOptions_ColumnPinning
---

# Interface: TableOptions\_ColumnPinning

## Properties

### enableColumnPinning?

```ts
optional enableColumnPinning: boolean;
```

Enables/disables column pinning for the table. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#enablecolumnpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L25)

***

### onColumnPinningChange?

```ts
optional onColumnPinningChange: OnChangeFn<ColumnPinningState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)

#### Defined in

[features/column-pinning/ColumnPinning.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.types.ts#L31)
