---
id: header_getLeafHeaders
title: header_getLeafHeaders
---

# Function: header\_getLeafHeaders()

```ts
function header_getLeafHeaders<TFeatures, TData, TValue>(header): Header<TFeatures, TData, TValue>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L26)

Walks a header tree and collects all descendant leaf headers.

The header itself is included after its descendants, matching the recursive
shape used by nested header groups.

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
const leafHeaders = header_getLeafHeaders(header)
```
