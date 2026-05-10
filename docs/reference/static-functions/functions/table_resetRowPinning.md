---
id: table_resetRowPinning
title: table_resetRowPinning
---

# Function: table\_resetRowPinning()

```ts
function table_resetRowPinning<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L62)

Resets the table's row pinning state slice.

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
table_resetRowPinning(table)
table_resetRowPinning(table, true)
```
