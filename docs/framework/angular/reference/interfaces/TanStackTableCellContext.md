---
id: TanStackTableCellContext
title: TanStackTableCellContext
---

# Interface: TanStackTableCellContext\<TFeatures, TData, TValue\>

Defined in: [helpers/cell.ts:11](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/cell.ts#L11)

DI context shape for a TanStack Table cell.

This exists to make the current `Cell` injectable by any nested component/directive
without having to pass it through inputs/props manually.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

## Properties

### cell

```ts
cell: Signal<Cell<TFeatures, TData, TValue>>;
```

Defined in: [helpers/cell.ts:17](https://github.com/TanStack/table/blob/main/packages/angular-table/src/helpers/cell.ts#L17)

Signal that returns the current cell instance.
