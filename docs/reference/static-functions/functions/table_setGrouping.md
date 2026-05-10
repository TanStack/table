---
id: table_setGrouping
title: table_setGrouping
---

# Function: table\_setGrouping()

```ts
function table_setGrouping<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-grouping/columnGroupingFeature.utils.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L203)

Updates the table's grouping state slice.

The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.

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
table_setGrouping(table, (old) => old)
```
