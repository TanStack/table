---
id: constructHeader
title: constructHeader
---

# Function: constructHeader()

```ts
function constructHeader<TFeatures, TData, TValue>(
   table, 
   column, 
options): Header<TFeatures, TData, TValue>;
```

Defined in: [core/headers/constructHeader.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/constructHeader.ts#L31)

Constructs a header instance from normalized table internals.

This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

### options

#### depth

`number`

#### id?

`string`

#### index

`number`

#### isPlaceholder?

`boolean`

#### placeholderId?

`string`

## Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>
