---
id: TableOptions_RowSelection
title: TableOptions_RowSelection
---

# Interface: TableOptions\_RowSelection\<TFeatures, TData\>

Defined in: [features/row-selection/rowSelectionFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L12)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableMultiRowSelection?

```ts
optional enableMultiRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L21)

Allows rows to be selected alongside other rows.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableRowSelection?

```ts
optional enableRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L27)

Allows rows to be selected.

Provide a predicate to decide per row. Defaults to `true`.

***

### enableSubRowSelection?

```ts
optional enableSubRowSelection: boolean | (row) => boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L34)

Controls whether selecting a parent row also selects its subRows.

Provide a predicate to decide per row. This is most useful with expanding or
grouping features and defaults to `true`.

***

### onRowSelectionChange?

```ts
optional onRowSelectionChange: OnChangeFn<RowSelectionState>;
```

Defined in: [features/row-selection/rowSelectionFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts#L40)

Called with an updater when row selection state changes. Pair this with
`state.rowSelection` when using external state; external atoms can own the
slice without this callback.
