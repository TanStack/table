---
id: table_toggleAllColumnsVisible
title: table_toggleAllColumnsVisible
---

# Function: table\_toggleAllColumnsVisible()

```ts
function table_toggleAllColumnsVisible<TFeatures, TData>(table, value?): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:303](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L303)

Shows or hides every hideable leaf column.

Columns that cannot hide stay visible when toggling all columns off.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### value?

`boolean`

## Returns

`void`

## Example

```ts
table_toggleAllColumnsVisible(table)
```
