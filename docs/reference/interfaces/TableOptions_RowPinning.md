---
id: TableOptions_RowPinning
title: TableOptions_RowPinning
---

# Interface: TableOptions\_RowPinning\<TFeatures, TData\>

Defined in: [features/row-pinning/rowPinningFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L16)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableRowPinning?

```ts
optional enableRowPinning: boolean | (row) => boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L23)

Enables/disables row pinning for the table. Defaults to `true`.

***

### keepPinnedRows?

```ts
optional keepPinnedRows: boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L27)

When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.

***

### onRowPinningChange?

```ts
optional onRowPinningChange: OnChangeFn<RowPinningState>;
```

Defined in: [features/row-pinning/rowPinningFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L31)

If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.
