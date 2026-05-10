---
id: table_resetHeaderSizeInfo
title: table_resetHeaderSizeInfo
---

# Function: table\_resetHeaderSizeInfo()

```ts
function table_resetHeaderSizeInfo<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:296](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L296)

Resets the table's header size info state slice.

By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetHeaderSizeInfo(table)
table_resetHeaderSizeInfo(table, true)
```
