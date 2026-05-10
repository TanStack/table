---
id: table_autoResetPageIndex
title: table_autoResetPageIndex
---

# Function: table\_autoResetPageIndex()

```ts
function table_autoResetPageIndex<TFeatures, TData>(table): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L37)

Schedules an automatic reset for page index.

The reset only runs when the related feature options allow automatic resets for the current table state change.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_autoResetPageIndex(table)
```
