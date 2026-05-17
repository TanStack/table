---
id: column_getCanPin
title: column_getCanPin
---

# Function: column\_getCanPin()

```ts
function column_getCanPin<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L108)

Checks whether this column or any of its leaf columns can be pinned.

Column-level `enablePinning` and table `enableColumnPinning` both default to
`true`; at least one leaf column must allow pinning.

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
const canPin = column_getCanPin(column)
```
