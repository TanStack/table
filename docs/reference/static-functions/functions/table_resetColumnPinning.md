---
id: table_resetColumnPinning
title: table_resetColumnPinning
---

# Function: table\_resetColumnPinning()

```ts
function table_resetColumnPinning<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:312](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L312)

Resets `columnPinning` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.columnPinning` when it
exists. Passing `true` ignores initial state and resets to empty left/right
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
table_resetColumnPinning(table)
table_resetColumnPinning(table, true)
```
