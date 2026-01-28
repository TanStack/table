---
id: table_setGrouping
title: table_setGrouping
---

# Function: table\_setGrouping()

```ts
function table_setGrouping<TFeatures, TData>(table, updater): void;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.utils.ts#L113)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`GroupingState`](../type-aliases/GroupingState.md)\>

## Returns

`void`
