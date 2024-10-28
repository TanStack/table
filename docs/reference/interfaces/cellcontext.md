---
id: CellContext
title: CellContext
---

# Interface: CellContext\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

#### Defined in

[core/cells/Cells.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L13)

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

#### Defined in

[core/cells/Cells.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L14)

***

### getValue

```ts
getValue: Getter<TValue>;
```

#### Defined in

[core/cells/Cells.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L15)

***

### renderValue

```ts
renderValue: Getter<null | TValue>;
```

#### Defined in

[core/cells/Cells.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L16)

***

### row

```ts
row: Row<TFeatures, TData>;
```

#### Defined in

[core/cells/Cells.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L17)

***

### table

```ts
table: Table<TFeatures, TData>;
```

#### Defined in

[core/cells/Cells.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.types.ts#L18)
