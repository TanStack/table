---
id: table_resetColumnOrder
title: table_resetColumnOrder
---

# Function: table\_resetColumnOrder()

```ts
function table_resetColumnOrder<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L123)

Resets `columnOrder` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.columnOrder` when it
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
table_resetColumnOrder(table)
table_resetColumnOrder(table, true)
```
