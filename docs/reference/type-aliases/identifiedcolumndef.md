---
id: IdentifiedColumnDef
title: IdentifiedColumnDef
---

# Type Alias: IdentifiedColumnDef\<TFeatures, TData, TValue\>

```ts
type IdentifiedColumnDef<TFeatures, TData, TValue>: ColumnDefBase<TFeatures, TData, TValue> & object;
```

## Type declaration

### header?

```ts
optional header: StringOrTemplateHeader<TFeatures, TData, TValue>;
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

[types/ColumnDef.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L111)
