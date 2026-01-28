---
id: TableOptions_Columns
title: TableOptions_Columns
---

# Interface: TableOptions\_Columns\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L60)

## Extended by

- [`TableOptions_Core`](TableOptions_Core.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### columns

```ts
columns: ColumnDef<TFeatures, TData, TValue>[];
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L68)

The array of column defs to use for the table.

***

### defaultColumn?

```ts
optional defaultColumn: Partial<ColumnDef<TFeatures, TData, TValue>>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.types.ts#L72)

Default column options to use for all column defs supplied to the table.
