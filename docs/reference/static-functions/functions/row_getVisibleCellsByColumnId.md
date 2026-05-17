---
id: row_getVisibleCellsByColumnId
title: row_getVisibleCellsByColumnId
---

# Function: row\_getVisibleCellsByColumnId()

```ts
function row_getVisibleCellsByColumnId<TFeatures, TData>(row): Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L191)

Builds a lookup map of this row's visible cells keyed by column id.

Hidden columns are omitted from the map.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Example

```ts
const visibleCellsById = row_getVisibleCellsByColumnId(row)
```
