---
id: table_toggleAllRowsExpanded
title: table_toggleAllRowsExpanded
---

# Function: table\_toggleAllRowsExpanded()

```ts
function table_toggleAllRowsExpanded<TFeatures, TData>(table, expanded?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L75)

Toggles all rows expanded for the table.

This is the table-level convenience API used by UI controls that affect many columns or rows at once.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### expanded?

`boolean`

## Returns

`void`

## Example

```ts
table_toggleAllRowsExpanded(table)
```
