---
id: header_getContext
title: header_getContext
---

# Function: header\_getContext()

```ts
function header_getContext<TFeatures, TData, TValue>(header): object
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue**

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

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

## Defined in

[core/headers/Headers.utils.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.utils.ts#L34)
