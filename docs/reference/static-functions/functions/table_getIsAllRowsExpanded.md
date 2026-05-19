---
id: table_getIsAllRowsExpanded
title: table_getIsAllRowsExpanded
---

# Function: table\_getIsAllRowsExpanded()

```ts
function table_getIsAllRowsExpanded<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L184)

Checks whether every row in the current row model is expanded.

The special expanded-all value `true` returns true immediately. Empty
expanded state returns false.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const allExpanded = table_getIsAllRowsExpanded(table)
```
