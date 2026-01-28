---
id: table_getDefaultColumnDef
title: table_getDefaultColumnDef
---

# Function: table\_getDefaultColumnDef()

```ts
function table_getDefaultColumnDef<TFeatures, TData>(table): Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [packages/table-core/src/core/columns/coreColumnsFeature.utils.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L46)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Partial`\<[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>
