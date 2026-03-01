---
id: ColumnDef_ColumnFiltering
title: ColumnDef_ColumnFiltering
---

# Interface: ColumnDef\_ColumnFiltering\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L81)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### enableColumnFilter?

```ts
optional enableColumnFilter: boolean;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L88)

Enables/disables the **column** filter for this column.

***

### filterFn?

```ts
optional filterFn: FilterFnOption<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L92)

The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
