---
id: table_getFlatHeaders
title: table_getFlatHeaders
---

# Function: table\_getFlatHeaders()

```ts
function table_getFlatHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/core/headers/coreHeadersFeature.utils.ts:90](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L90)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]
