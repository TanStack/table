---
id: header_getContext
title: header_getContext
---

# Function: header\_getContext()

```ts
function header_getContext<TFeatures, TData, TValue>(header): object;
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L56)

Returns context for a header.

This is the static implementation behind the matching header instance API and can account for nested header groups.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue`

## Parameters

### header

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>

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

## Example

```ts
const value = header_getContext(header)
```
