---
id: table_getLeafHeaders
title: table_getLeafHeaders
---

# Function: table\_getLeafHeaders()

```ts
function table_getLeafHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L187)

Collects only the leaf headers from the current header tree.

Parent/group headers are skipped, making the result suitable for rendering
one header per visible leaf column.

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
const leafHeaders = table_getLeafHeaders(table)
```
