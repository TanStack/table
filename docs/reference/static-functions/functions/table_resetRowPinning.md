---
id: table_resetRowPinning
title: table_resetRowPinning
---

# Function: table\_resetRowPinning()

```ts
function table_resetRowPinning<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L66)

Resets `rowPinning` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.rowPinning` when it
exists. Passing `true` ignores initial state and resets to empty top/bottom
arrays.

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
