---
id: TableOptions_RowSelection
title: TableOptions_RowSelection
---

# Interface: TableOptions\_RowSelection\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableMultiRowSelection?

```ts
optional enableMultiRowSelection: boolean | (row) => boolean;
```

- Enables/disables multiple row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablemultirowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:22](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L22)

***

### enableRowSelection?

```ts
optional enableRowSelection: boolean | (row) => boolean;
```

- Enables/disables row selection for all rows in the table OR
- A function that given a row, returns whether to enable/disable row selection for that row

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:29](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L29)

***

### enableSubRowSelection?

```ts
optional enableSubRowSelection: boolean | (row) => boolean;
```

Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.
(Use in combination with expanding or grouping features)

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:36](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L36)

***

### onRowSelectionChange?

```ts
optional onRowSelectionChange: OnChangeFn<RowSelectionState>;
```

If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#onrowselectionchange)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/row-selection)

#### Defined in

[features/row-selection/RowSelection.types.ts:42](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.types.ts#L42)
