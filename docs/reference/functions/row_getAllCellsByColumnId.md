---
id: row_getAllCellsByColumnId
title: row_getAllCellsByColumnId
---

# Function: row\_getAllCellsByColumnId()

```ts
function row_getAllCellsByColumnId<TFeatures, TData>(row): Record<string, Cell<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/rows/coreRowsFeature.utils.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L101)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>\>
