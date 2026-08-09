---
id: table_autoResetPageIndex
title: table_autoResetPageIndex
---

# Function: table\_autoResetPageIndex()

```ts
function table_autoResetPageIndex<TFeatures, TData>(table): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L45)

Resets the page index when a page-altering change should return to page 0.

The reset runs when `autoResetAll`, `autoResetPageIndex`, or the default
client-side pagination behavior allows it. Manual pagination opts out unless
the reset options explicitly opt back in.

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
table_autoResetPageIndex(table)
```
