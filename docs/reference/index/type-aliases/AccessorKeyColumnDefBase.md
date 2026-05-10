---
id: AccessorKeyColumnDefBase
title: AccessorKeyColumnDefBase
---

# Type Alias: AccessorKeyColumnDefBase\<TFeatures, TData, TValue\>

```ts
type AccessorKeyColumnDefBase<TFeatures, TData, TValue> = ColumnDefBase<TFeatures, TData, TValue> & object;
```

Defined in: [types/ColumnDef.ts:178](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L178)

## Type Declaration

### accessorKey

```ts
accessorKey: string & object | keyof TData;
```

### id?

```ts
optional id: string;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
