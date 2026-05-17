---
id: table_getFlatHeaders
title: table_getFlatHeaders
---

# Function: table\_getFlatHeaders()

```ts
function table_getFlatHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L161)

Flattens every header from every header group into one array.

The result includes parent headers and placeholder headers, in header-group
order from top to bottom.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const flatHeaders = table_getFlatHeaders(table)
```
