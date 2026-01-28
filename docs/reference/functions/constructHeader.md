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

Defined in: [packages/table-core/src/core/headers/constructHeader.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/constructHeader.ts#L25)

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
