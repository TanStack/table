---
id: expandRows
title: expandRows
---

# Function: expandRows()

```ts
function expandRows<TFeatures, TData>(rowModel): object
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **rowModel**: [`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

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

[features/row-expanding/createExpandedRowModel.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/createExpandedRowModel.ts#L50)
