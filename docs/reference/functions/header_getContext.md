---
id: header_getContext
title: header_getContext
---

# Function: header\_getContext()

```ts
function header_getContext<TFeatures, TData, TValue>(header): object;
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L36)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue`

## Parameters

### header

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`object`

### column

```ts
column: Column<TFeatures, TData, TValue> = header.column;
```

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

### table

```ts
table: Table_Internal<TFeatures, TData> = header.column.table;
```
