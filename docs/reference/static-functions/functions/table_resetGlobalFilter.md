---
id: table_resetGlobalFilter
title: table_resetGlobalFilter
---

# Function: table\_resetGlobalFilter()

```ts
function table_resetGlobalFilter<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L108)

Resets `globalFilter` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.globalFilter`. Passing
`true` ignores initial state and resets to `undefined`.

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
table_resetGlobalFilter(table)
table_resetGlobalFilter(table, true)
```
