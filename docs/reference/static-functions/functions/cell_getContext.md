---
id: cell_getContext
title: cell_getContext
---

# Function: cell\_getContext()

```ts
function cell_getContext<TFeatures, TData, TValue>(cell): object;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L51)

Returns context for a cell.

This is the static implementation behind the matching cell instance API and uses the owning row and column context.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

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

### getValue()

```ts
getValue: () => NoInfer<TValue>;
```

#### Returns

[`NoInfer`](../../index/type-aliases/NoInfer.md)\<`TValue`\>

### renderValue()

```ts
renderValue: () => NoInfer<TValue | null>;
```

#### Returns

[`NoInfer`](../../index/type-aliases/NoInfer.md)\<`TValue` \| `null`\>

### row

```ts
row: Row<TFeatures, TData> = cell.row;
```

### table

```ts
table: Table_Internal<TFeatures, TData> = cell.table;
```

## Example

```ts
const value = cell_getContext(cell)
```
