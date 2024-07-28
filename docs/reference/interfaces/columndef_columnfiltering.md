---
id: ColumnDef_ColumnFiltering
title: ColumnDef_ColumnFiltering
---

# Interface: ColumnDef\_ColumnFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### enableColumnFilter?

```ts
optional enableColumnFilter: boolean;
```

Enables/disables the **column** filter for this column.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilter)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:82](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L82)

***

### filterFn?

```ts
optional filterFn: FilterFnOption<TFeatures, TData>;
```

The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:88](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L88)
