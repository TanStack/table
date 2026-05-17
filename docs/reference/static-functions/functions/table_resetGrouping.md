---
id: table_resetGrouping
title: table_resetGrouping
---

# Function: table\_resetGrouping()

```ts
function table_resetGrouping<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:230](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L230)

Resets `grouping` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.grouping` when it
exists. Passing `true` ignores initial state and resets to `[]`.

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
table_resetGrouping(table)
table_resetGrouping(table, true)
```
