---
id: table_resetRowSelection
title: table_resetRowSelection
---

# Function: table\_resetRowSelection()

```ts
function table_resetRowSelection<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L59)

Resets `rowSelection` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.rowSelection` when it
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
table_resetRowSelection(table)
table_resetRowSelection(table, true)
```
