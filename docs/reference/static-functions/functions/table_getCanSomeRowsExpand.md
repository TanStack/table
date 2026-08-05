---
id: table_getCanSomeRowsExpand
title: table_getCanSomeRowsExpand
---

# Function: table\_getCanSomeRowsExpand()

```ts
function table_getCanSomeRowsExpand<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L166)

Checks whether at least one pre-paginated row can expand.

Pagination is intentionally ignored so controls can reflect expandable rows
that may not be on the current page.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const canExpand = table_getCanSomeRowsExpand(table)
```
