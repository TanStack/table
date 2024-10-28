---
id: AccessorFnColumnDefBase
title: AccessorFnColumnDefBase
---

# Type Alias: AccessorFnColumnDefBase\<TFeatures, TData, TValue\>

```ts
type AccessorFnColumnDefBase<TFeatures, TData, TValue>: ColumnDefBase<TFeatures, TData, TValue> & object;
```

## Type declaration

### accessorFn

```ts
accessorFn: AccessorFn<TData, TValue>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L141)
