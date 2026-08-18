---
id: ColSpanContext
title: ColSpanContext
---

# Interface: ColSpanContext\<TFeatures, TData, TValue\>

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L68)

Context passed to a `spanColumns` resolver for each rendered row.

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

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L73)

***

### row

```ts
row: Row<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:74](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L74)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L75)
