---
id: TableOptions_Columns
title: TableOptions_Columns
---

# Interface: TableOptions\_Columns\<TFeatures, TData, TValue\>

## Extended by

- [`TableOptions_Core`](tableoptions_core.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### columns

```ts
columns: ColumnDef<TFeatures, TData, TValue>[];
```

The array of column defs to use for the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#columns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:81](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L81)

***

### debugColumns?

```ts
optional debugColumns: boolean;
```

Set this option to `true` to output column debugging information to the console.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#debugcolumns)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:87](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L87)

***

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TFeatures, TData, TValue>>;
```

Default column options to use for all column defs supplied to the table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/columns/Columns.types.ts:93](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.types.ts#L93)
