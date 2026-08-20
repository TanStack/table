---
id: CellSpanIndex
title: CellSpanIndex
---

# Interface: CellSpanIndex\<TFeatures, TData\>

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L13)

The table's cell span index for the rows that are currently rendered.

Cell APIs read this; it is exposed for devtools and for virtualizers that
need to know where a run's anchor sits relative to the rendered window.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### colSpans

```ts
colSpans: (Int32Array<ArrayBufferLike> | undefined)[];
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L23)

Column spans per render-order row position, indexed by render-order column
position. Holes are the common case: only rows that declared a column span
get an array. In a stored array, the spanning cell holds its span and the
cells it covers hold `0`; every other cell holds `1`.

***

### columnIndexes

```ts
columnIndexes: Record<string, number>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L27)

Render-order index for every visible column id. Hidden columns are absent.

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L40)

The exact ordered rows this index was built from, in render order:
top-pinned rows, then the (paginated) center rows, then bottom-pinned
rows. Cell reads compare against this to reject stale row positions.

***

### rowSpans

```ts
rowSpans: Record<string, Int32Array>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L34)

Row spans per column id, indexed by render-order row position. Only columns
that produced at least one run longer than one row appear here; a missing
column means every cell in it spans exactly one row. In a stored array, the
run's anchor row holds the run length and the rows it covers hold `0`.
