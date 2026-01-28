---
id: AccessorFnColumnDefBase
title: AccessorFnColumnDefBase
---

# Type Alias: AccessorFnColumnDefBase\<TFeatures, TData, TValue\>

```ts
type AccessorFnColumnDefBase<TFeatures, TData, TValue> = ColumnDefBase<TFeatures, TData, TValue> & object;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:163](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L163)

## Type Declaration

### accessorFn

```ts
accessorFn: AccessorFn<TData, TValue>;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
