---
id: HeaderContext
title: HeaderContext
---

# Interface: HeaderContext\<TFeatures, TData, TValue\>

Defined in: [core/headers/coreHeadersFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L32)

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

Defined in: [core/headers/coreHeadersFeature.types.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L40)

An instance of a column.

***

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L44)

An instance of a header.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [core/headers/coreHeadersFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.types.ts#L48)

The table instance.
