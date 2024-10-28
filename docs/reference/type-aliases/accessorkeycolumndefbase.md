---
id: AccessorKeyColumnDefBase
title: AccessorKeyColumnDefBase
---

# Type Alias: AccessorKeyColumnDefBase\<TFeatures, TData, TValue\>

```ts
type AccessorKeyColumnDefBase<TFeatures, TData, TValue>: ColumnDefBase<TFeatures, TData, TValue> & object;
```

## Type declaration

### accessorKey

```ts
accessorKey: string & object | keyof TData;
```

### id?

```ts
optional id: string;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L156)
