---
id: TableOptions_All
title: TableOptions_All
---

# Type Alias: TableOptions\_All\<TFeatures, TData\>

```ts
type TableOptions_All<TFeatures, TData> = TableOptions_Core<TFeatures, TData> & Partial<TableOptions_ColumnFiltering<TFeatures, TData> & TableOptions_ColumnGrouping & TableOptions_ColumnOrdering & TableOptions_ColumnPinning & TableOptions_ColumnResizing & TableOptions_ColumnSizing & TableOptions_ColumnVisibility & TableOptions_GlobalFiltering<TFeatures, TData> & TableOptions_RowExpanding<TFeatures, TData> & TableOptions_RowPagination & TableOptions_RowPinning<TFeatures, TData> & TableOptions_RowSelection<TFeatures, TData> & TableOptions_RowSorting>;
```

Defined in: [types/TableOptions.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L122)

Internal broad option shape used where feature code may need to read options
from features that are not present in the current generic feature set.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
