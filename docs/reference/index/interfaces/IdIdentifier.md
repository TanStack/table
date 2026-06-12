---
id: IdIdentifier
title: IdIdentifier
---

# Interface: IdIdentifier\<TFeatures, TData, TValue\>

Defined in: [types/ColumnDef.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L81)

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

Defined in: [types/ColumnDef.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L93)

Header text or template used to render this column's header.

***

### id

```ts
id: string;
```

Defined in: [types/ColumnDef.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L89)

Explicit stable column id.
