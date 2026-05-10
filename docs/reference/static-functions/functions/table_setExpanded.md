---
id: table_setExpanded
title: table_setExpanded
---

# Function: table\_setExpanded()

```ts
function table_setExpanded<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L58)

Updates the table's expanded state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ExpandedState`](../../index/type-aliases/ExpandedState.md)\>

## Returns

`void`

## Example

```ts
table_setExpanded(table, (old) => old)
```
