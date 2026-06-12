---
id: ColumnDefResolved
title: ColumnDefResolved
---

# Type Alias: ColumnDefResolved\<TFeatures, TData, TValue\>

```ts
type ColumnDefResolved<TFeatures, TData, TValue> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & object;
```

Defined in: [types/ColumnDef.ts:248](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L248)

## Type Declaration

### accessorKey?

```ts
optional accessorKey: string;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
