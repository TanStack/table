---
id: table_resetExpanded
title: table_resetExpanded
---

# Function: table\_resetExpanded()

```ts
function table_resetExpanded<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L104)

Resets `expanded` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.expanded` when it
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
table_resetExpanded(table)
table_resetExpanded(table, true)
```
