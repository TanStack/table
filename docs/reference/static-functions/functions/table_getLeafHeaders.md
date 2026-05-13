---
id: table_getLeafHeaders
title: table_getLeafHeaders
---

# Function: table\_getLeafHeaders()

```ts
function table_getLeafHeaders<TFeatures, TData>(table): any[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L180)

Returns leaf headers for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`[]

## Example

```ts
const value = table_getLeafHeaders(table)
```
