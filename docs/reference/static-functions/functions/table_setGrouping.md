---
id: table_setGrouping
title: table_setGrouping
---

# Function: table\_setGrouping()

```ts
function table_setGrouping<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L211)

Routes a grouping updater through the table's grouping change handler.

The updater may be a next `GroupingState` array or a function of the previous
grouping state, matching the instance `table.setGrouping` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`GroupingState`](../../index/type-aliases/GroupingState.md)\>

## Returns

`void`

## Example

```ts
table_setGrouping(table, (old) => [...old, 'status'])
```
