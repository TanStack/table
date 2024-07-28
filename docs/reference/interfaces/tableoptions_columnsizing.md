---
id: TableOptions_ColumnSizing
title: TableOptions_ColumnSizing
---

# Interface: TableOptions\_ColumnSizing

## Properties

### onColumnSizingChange?

```ts
optional onColumnSizingChange: OnChangeFn<ColumnSizingState>;
```

If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizingchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)

#### Defined in

[features/column-sizing/ColumnSizing.types.ts:16](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-sizing/ColumnSizing.types.ts#L16)
