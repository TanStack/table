---
id: HeaderContext
title: HeaderContext
---

# Interface: HeaderContext\<TFeatures, TData, TValue\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* [`CellData`](../type-aliases/celldata.md) = [`CellData`](../type-aliases/celldata.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

An instance of a column.

#### Defined in

[core/headers/Headers.types.ts:55](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L55)

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

An instance of a header.

#### Defined in

[core/headers/Headers.types.ts:59](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L59)

***

### table

```ts
table: Table<TFeatures, TData>;
```

The table instance.

#### Defined in

[core/headers/Headers.types.ts:63](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.types.ts#L63)
