---
id: table_toggleAllRowsExpanded
title: table_toggleAllRowsExpanded
---

# Function: table\_toggleAllRowsExpanded()

```ts
function table_toggleAllRowsExpanded<TFeatures, TData>(table, expanded?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L81)

Expands or collapses every row.

Passing `true` stores the special expanded-all state. Passing `false` stores
an empty map. Omitting the value toggles based on whether all rows are
currently expanded.

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
