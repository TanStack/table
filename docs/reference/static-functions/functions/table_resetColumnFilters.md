---
id: table_resetColumnFilters
title: table_resetColumnFilters
---

# Function: table\_resetColumnFilters()

```ts
function table_resetColumnFilters<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:295](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L295)

Resets `columnFilters` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.columnFilters` when it
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
table_resetColumnFilters(table)
table_resetColumnFilters(table, true)
```
