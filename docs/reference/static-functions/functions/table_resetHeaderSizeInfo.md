---
id: table_resetHeaderSizeInfo
title: table_resetHeaderSizeInfo
---

# Function: table\_resetHeaderSizeInfo()

```ts
function table_resetHeaderSizeInfo<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:303](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L303)

Resets `columnResizing` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.columnResizing` when
it exists. Passing `true` ignores initial state and resets to the no-drag
default state.

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
