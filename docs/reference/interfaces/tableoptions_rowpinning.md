---
id: TableOptions_RowPinning
title: TableOptions_RowPinning
---

# Interface: TableOptions\_RowPinning\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableRowPinning?

```ts
optional enableRowPinning: boolean | (row) => boolean;
```

Enables/disables row pinning for the table. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#enablerowpinning)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L25)

***

### keepPinnedRows?

```ts
optional keepPinnedRows: boolean;
```

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#keeppinnedrows)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)

#### Defined in

[features/row-pinning/RowPinning.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L31)

***

### onRowPinningChange?

```ts
optional onRowPinningChange: OnChangeFn<RowPinningState>;
```

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning#onrowpinningchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)

#### Defined in

[features/row-pinning/RowPinning.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.types.ts#L37)
