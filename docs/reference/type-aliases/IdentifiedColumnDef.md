---
id: IdentifiedColumnDef
title: IdentifiedColumnDef
---

# Type Alias: IdentifiedColumnDef\<TFeatures, TData, TValue\>

```ts
type IdentifiedColumnDef<TFeatures, TData, TValue> = ColumnDefBase<TFeatures, TData, TValue> & object;
```

Defined in: [types/ColumnDef.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L133)

## Type Declaration

### header?

```ts
optional header: StringOrTemplateHeader<TFeatures, TData, TValue>;
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
