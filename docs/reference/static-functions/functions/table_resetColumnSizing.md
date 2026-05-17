---
id: table_resetColumnSizing
title: table_resetColumnSizing
---

# Function: table\_resetColumnSizing()

```ts
function table_resetColumnSizing<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:277](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L277)

Resets `columnSizing` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.columnSizing` when it
exists. Passing `true` ignores initial state and resets to `{}`.

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
table_resetColumnSizing(table)
table_resetColumnSizing(table, true)
```
