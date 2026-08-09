---
id: table_autoResetSorting
title: table_autoResetSorting
---

# Function: table\_autoResetSorting()

```ts
function table_autoResetSorting<TFeatures, TData>(table): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L88)

Resets sorting after the table data changes when explicitly enabled.

Unlike other auto-reset behaviors, sorting is preserved by default. An
explicit `autoResetAll` value takes precedence over `autoResetSorting`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_autoResetSorting(table)
```
