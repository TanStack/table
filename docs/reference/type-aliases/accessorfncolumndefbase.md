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

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:128](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L128)
