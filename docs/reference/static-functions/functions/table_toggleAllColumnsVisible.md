---
id: table_toggleAllColumnsVisible
title: table_toggleAllColumnsVisible
---

# Function: table\_toggleAllColumnsVisible()

```ts
function table_toggleAllColumnsVisible<TFeatures, TData>(table, value?): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:272](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L272)

Toggles all columns visible for the table.

This is the table-level convenience API used by UI controls that affect many columns or rows at once.

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
