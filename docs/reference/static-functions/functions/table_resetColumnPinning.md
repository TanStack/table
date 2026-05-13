---
id: table_resetColumnPinning
title: table_resetColumnPinning
---

# Function: table\_resetColumnPinning()

```ts
function table_resetColumnPinning<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:294](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L294)

Resets the table's column pinning state slice.

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
table_resetColumnPinning(table)
table_resetColumnPinning(table, true)
```
