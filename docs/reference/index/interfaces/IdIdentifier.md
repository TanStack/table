---
id: IdIdentifier
title: IdIdentifier
---

# Interface: IdIdentifier\<TFeatures, TData, TValue\>

Defined in: [types/ColumnDef.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L82)

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

Defined in: [types/ColumnDef.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L94)

Header text or template used to render this column's header.

***

### id

```ts
id: string;
```

Defined in: [types/ColumnDef.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L90)

Explicit stable column id.
