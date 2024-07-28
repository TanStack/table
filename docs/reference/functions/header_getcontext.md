---
id: header_getContext
title: header_getContext
---

# Function: header\_getContext()

```ts
function header_getContext<TFeatures, TData, TValue>(header, table): object
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue**

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`object`

### column

```ts
column: Column<TableFeatures, TData, TValue> = header.column;
```

### header

```ts
header: Header<TFeatures, TData, TValue>;
```

### table

```ts
table: Table<TFeatures, TData>;
```

## Defined in

[core/headers/Headers.utils.ts:32](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/Headers.utils.ts#L32)
