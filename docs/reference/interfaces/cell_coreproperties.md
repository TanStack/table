---
id: Cell_CoreProperties
title: Cell_CoreProperties
---

# Interface: Cell\_CoreProperties\<TFeatures, TData, TValue\>

## Extended by

- [`Cell_Cell`](cell_cell.md)

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

The associated Column object for the cell.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#column)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:31](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L31)

***

### id

```ts
id: string;
```

The unique ID for the cell across the entire table.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#id)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:37](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L37)

***

### row

```ts
row: Row<TFeatures, TData>;
```

The associated Row object for the cell.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/cell#row)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/cells)

#### Defined in

[core/cells/Cells.types.ts:43](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.types.ts#L43)
