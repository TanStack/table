---
id: table_autoResetExpanded
title: table_autoResetExpanded
---

# Function: table\_autoResetExpanded()

```ts
function table_autoResetExpanded<TFeatures, TData>(table): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L35)

Schedules an automatic reset for expanded.

The reset only runs when the related feature options allow automatic resets for the current table state change.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_autoResetExpanded(table)
```
