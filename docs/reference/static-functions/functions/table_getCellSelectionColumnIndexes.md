---
id: table_getCellSelectionColumnIndexes
title: table_getCellSelectionColumnIndexes
---

# Function: table\_getCellSelectionColumnIndexes()

```ts
function table_getCellSelectionColumnIndexes<TFeatures, TData>(table): Record<string, number>;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:197](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L197)

Builds a column id to render-order index map.

Registered by this feature so the lookup stays memoized even when
`columnOrderingFeature` is absent, since that feature's `getColumnIndexes`
static rebuilds all four maps on every call, which would make per-cell reads
O(columns).

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, `number`\>

## Example

```ts
const index = table_getCellSelectionColumnIndexes(table)[columnId]
```
