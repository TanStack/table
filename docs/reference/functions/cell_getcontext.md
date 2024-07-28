---
id: cell_getContext
title: cell_getContext
---

# Function: cell\_getContext()

```ts
function cell_getContext<TFeatures, TData, TValue>(cell, table): object
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`object`

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

### column

```ts
column: Column<TableFeatures, TData, TValue> = cell.column;
```

### getValue

```ts
getValue: Getter<TValue> = cell.getValue;
```

### renderValue

```ts
renderValue: Getter<null | TValue> = cell.renderValue;
```

### row

```ts
row: Row<TableFeatures, TData> = cell.row;
```

### table

```ts
table: Table<TFeatures, TData>;
```

## Defined in

[core/cells/Cells.utils.ts:26](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.utils.ts#L26)
