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

Defined in: [features/row-pinning/rowPinningFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.types.ts#L33)

Called with an updater when row pinning state changes. Pair this with
`state.rowPinning` when using external state; external atoms can own the
slice without this callback.
