---
id: table_mergeOptions
title: table_mergeOptions
---

# Function: table\_mergeOptions()

```ts
function table_mergeOptions<TFeatures, TData>(table, newOptions): TableOptions<TFeatures, TData>;
```

Defined in: [core/table/coreTablesFeature.utils.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L80)

Merges new table options with the current resolved options.

If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
options are shallow-merged. Static options that should never change after
initialization are restored on a fresh object so framework merge helpers may
return readonly getter/proxy objects.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### newOptions

[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

## Returns

[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>

## Example

```ts
const options = table_mergeOptions(table, nextOptions)
```
