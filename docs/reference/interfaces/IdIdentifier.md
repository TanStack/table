---
id: IdIdentifier
title: IdIdentifier
---

# Interface: IdIdentifier\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/types/ColumnDef.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L50)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### header?

```ts
optional header: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L56)

***

### id

```ts
id: string;
```

Defined in: [packages/table-core/src/types/ColumnDef.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L55)
