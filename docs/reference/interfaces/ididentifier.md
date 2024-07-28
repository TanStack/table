---
id: IdIdentifier
title: IdIdentifier
---

# Interface: IdIdentifier\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### header?

```ts
optional header: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

#### Defined in

[types/ColumnDef.ts:51](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L51)

***

### id

```ts
id: string;
```

#### Defined in

[types/ColumnDef.ts:50](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/ColumnDef.ts#L50)
