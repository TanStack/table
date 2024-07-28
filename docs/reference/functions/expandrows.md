---
id: expandRows
title: expandRows
---

# Function: expandRows()

```ts
function expandRows<TFeatures, TData>(rowModel, table): object
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **rowModel**: `RowModel`\<`TFeatures`, `TData`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`object`

### flatRows

```ts
flatRows: Row<TFeatures, TData>[] = rowModel.flatRows;
```

### rows

```ts
rows: Row<TFeatures, TData>[] = expandedRows;
```

### rowsById

```ts
rowsById: Record<string, Row<TFeatures, TData>> = rowModel.rowsById;
```

## Defined in

[features/row-expanding/createExpandedRowModel.ts:40](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-expanding/createExpandedRowModel.ts#L40)
