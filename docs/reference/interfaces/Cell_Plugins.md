---
id: Cell_Plugins
title: Cell_Plugins
---

# Interface: Cell\_Plugins\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/types/Cell.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Cell.ts#L10)

Use this interface as a target for declaration merging to add your own plugin properties.
Note: This will affect the types of all tables in your project.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)
