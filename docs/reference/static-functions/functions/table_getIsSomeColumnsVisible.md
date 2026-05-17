---
id: table_getIsSomeColumnsVisible
title: table_getIsSomeColumnsVisible
---

# Function: table\_getIsSomeColumnsVisible()

```ts
function table_getIsSomeColumnsVisible<TFeatures, TData>(table): boolean;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:352](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L352)

Checks whether at least one leaf column is currently visible.

This is useful for tri-state "show all columns" controls.

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
const someVisible = table_getIsSomeColumnsVisible(table)
```
