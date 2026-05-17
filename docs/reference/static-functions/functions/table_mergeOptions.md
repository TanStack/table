---
id: table_mergeOptions
title: table_mergeOptions
---

# Function: table\_mergeOptions()

```ts
function table_mergeOptions<TFeatures, TData>(table, newOptions): TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.utils.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L78)

Merges new table options with the current resolved options.

If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
options are shallow-merged.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### newOptions

[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

## Returns

[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

## Example

```ts
const options = table_mergeOptions(table, nextOptions)
```
