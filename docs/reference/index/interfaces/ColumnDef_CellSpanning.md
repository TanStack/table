---
id: ColumnDef_CellSpanning
title: ColumnDef_CellSpanning
---

# Interface: ColumnDef\_CellSpanning\<TFeatures, TData, TValue\>

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L78)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### enableCellSpanning?

```ts
optional enableCellSpanning: boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L87)

Turns this column off for cell spanning even when the table allows it.
Defaults to `true`.

***

### spanColumns?

```ts
optional spanColumns: number | (context) => number;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L102)

Makes this column's cell span the given number of columns per row,
starting at itself and counted in the order columns actually render.

Return `1` or less for no span. Larger values are clamped to the end of
the cell's pinned region, so a span can never cross the start-pinned,
center, or end-pinned boundary; pass `Infinity` for "the rest of my
region". Hidden columns are not counted.

#### Example

```ts
{ accessorKey: 'label', spanColumns: ({ row }) => row.original.isSummary ? Infinity : 1 }
```

***

### spanRows?

```ts
optional spanRows: boolean | (context) => boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L127)

Merges adjacent rows in this column into a single vertically spanning
cell.

`true` merges rows whose values for this column are the same value
(`Object.is`). Nullish values never merge under the default comparison.

A predicate replaces the comparison entirely and decides whether `row`
joins the run anchored at `anchorRow`; it may merge nullish values. It is
called once per candidate row each time the span index rebuilds, and each
call allocates one context object, so keep it cheap.

Spans are always recomputed from the rows that are actually rendered, so
sorting, filtering, and paging only change which rows are adjacent. Runs
never cross a page boundary, a pinned-row section boundary, a change of
position in the row tree, or a grouped row. Ignored while this column is
grouped.

#### Example

```ts
{ accessorKey: 'department', spanRows: true }
```
