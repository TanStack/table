---
id: table_setExpanded
title: table_setExpanded
---

# Function: table\_setExpanded()

```ts
function table_setExpanded<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L27)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ExpandedState`](../type-aliases/ExpandedState.md)\>

## Returns

`void`
