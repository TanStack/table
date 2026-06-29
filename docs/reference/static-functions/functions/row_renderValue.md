---
id: row_renderValue
title: row_renderValue
---

# Function: row\_renderValue()

```ts
function row_renderValue<TFeatures, TData>(row, columnId): any;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L88)

Returns a renderable row value for a column.

If the accessor value is nullish, the table's `renderFallbackValue` is used
instead.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

`any`

## Example

```ts
const value = row_renderValue(row, 'firstName')
```
