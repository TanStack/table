---
id: table_setExpanded
title: table_setExpanded
---

# Function: table\_setExpanded()

```ts
function table_setExpanded<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L62)

Routes an expanded-state updater through the table's expanded change handler.

The updater may be `true`, a row-id map, or a function of the previous
expanded state, matching the instance `table.setExpanded` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`ExpandedState`](../../index/type-aliases/ExpandedState.md)\>

## Returns

`void`

## Example

```ts
table_setExpanded(table, (old) => ({ ...old, [rowId]: true }))
```
