---
id: header_getContext
title: header_getContext
---

# Function: header\_getContext()

```ts
function header_getContext<TFeatures, TData, TValue>(header): object;
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L55)

Builds the render context passed to a column's `header` or `footer` template.

The context contains the header, its column, and the owning table instance.

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
const context = header_getContext(header)
```
