---
id: IdIdentifier
title: IdIdentifier
---

# Interface: IdIdentifier\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### header?

```ts
optional header: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

#### Defined in

[types/ColumnDef.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L46)

***

### id

```ts
id: string;
```

#### Defined in

[types/ColumnDef.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L45)
