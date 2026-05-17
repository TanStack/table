---
id: table_getIsSomeRowsExpanded
title: table_getIsSomeRowsExpanded
---

# Function: table\_getIsSomeRowsExpanded()

```ts
function table_getIsSomeRowsExpanded<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L165)

Checks whether any row is expanded.

The special expanded-all value `true` counts as some rows expanded.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const someExpanded = table_getIsSomeRowsExpanded(table)
```
