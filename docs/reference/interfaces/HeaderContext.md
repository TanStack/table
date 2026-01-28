---
id: HeaderContext
title: HeaderContext
---

# Interface: HeaderContext\<TFeatures, TData, TValue\>

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L38)

An instance of a column.

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L42)

An instance of a header.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L46)

The table instance.
