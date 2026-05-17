---
id: table_getIsAllColumnsVisible
title: table_getIsAllColumnsVisible
---

# Function: table\_getIsAllColumnsVisible()

```ts
function table_getIsAllColumnsVisible<TFeatures, TData>(table): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:330](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L330)

Checks whether every leaf column is currently visible.

Non-hideable columns are naturally visible because missing visibility entries
default to `true`.

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
const allVisible = table_getIsAllColumnsVisible(table)
```
