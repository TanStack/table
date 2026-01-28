---
id: Cell_CoreProperties
title: Cell_CoreProperties
---

# Interface: Cell\_CoreProperties\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L21)

## Extended by

- [`Cell_Cell`](Cell_Cell.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L29)

The associated Column object for the cell.

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L33)

The unique ID for the cell across the entire table.

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L37)

The associated Row object for the cell.

***

### table

```ts
table: Table_Internal<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/cells/coreCellsFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.types.ts#L41)

Reference to the parent table instance.
