---
id: cell_getContext
title: cell_getContext
---

# Function: cell\_getContext()

```ts
function cell_getContext<TFeatures, TData, TValue>(cell): object
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`object`

### cell

```ts
cell: Cell<TFeatures, TData, TValue>;
```

### column

```ts
column: Column<TFeatures, TData, TValue> = cell.column;
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
row: Row<TFeatures, TData> = cell.row;
```

### table

```ts
table: Table_Internal<TFeatures, TData> = cell.table;
```

## Defined in

[core/cells/Cells.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.utils.ts#L21)
