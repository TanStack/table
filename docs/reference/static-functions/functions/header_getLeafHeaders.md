---
id: header_getLeafHeaders
title: header_getLeafHeaders
---

# Function: header\_getLeafHeaders()

```ts
function header_getLeafHeaders<TFeatures, TData, TValue>(header): Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L30)

Returns leaf headers for a header.

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

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `TValue`\>[]

## Example

```ts
const value = header_getLeafHeaders(header)
```
