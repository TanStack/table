---
id: cell_getContext
title: cell_getContext
---

# Function: cell\_getContext()

```ts
function cell_getContext<TFeatures, TData, TValue>(cell): object;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L21)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

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

[`NoInfer`](../type-aliases/NoInfer.md)\<`TValue`\>

### renderValue()

```ts
renderValue: () => NoInfer<TValue | null>;
```

#### Returns

[`NoInfer`](../type-aliases/NoInfer.md)\<`TValue` \| `null`\>

### row

```ts
row: Row<TFeatures, TData> = cell.row;
```

### table

```ts
table: Table_Internal<TFeatures, TData> = cell.table;
```
