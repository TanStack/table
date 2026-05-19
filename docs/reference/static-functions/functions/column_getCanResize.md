---
id: column_getCanResize
title: column_getCanResize
---

# Function: column\_getCanResize()

```ts
function column_getCanResize<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L49)

Checks whether this column can start a resize interaction.

Both `columnDef.enableResizing` and table `enableColumnResizing` default to
`true`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const canResize = column_getCanResize(column)
```
