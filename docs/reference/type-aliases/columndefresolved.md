---
id: ColumnDefResolved
title: ColumnDefResolved
---

# Type Alias: ColumnDefResolved\<TFeatures, TData, TValue\>

```ts
type ColumnDefResolved<TFeatures, TData, TValue>: Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & object;
```

## Type declaration

### accessorKey?

```ts
optional accessorKey: string;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L189)
