---
id: table_getDefaultColumnDef
title: table_getDefaultColumnDef
---

# Function: table\_getDefaultColumnDef()

```ts
function table_getDefaultColumnDef<TFeatures, TData>(table): Partial<ColumnDef<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L80)

Merges built-in, feature, and user default column definitions.

Built-in defaults provide a header and fallback cell renderer, feature
defaults can add feature-specific column options, and
`options.defaultColumn` wins last.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Partial`\<[`ColumnDef`](../../index/type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Example

```ts
const defaultColumn = table_getDefaultColumnDef(table)
```
