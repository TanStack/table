---
id: table_setOptions
title: table_setOptions
---

# Function: table\_setOptions()

```ts
function table_setOptions<TFeatures, TData>(table, updater): void;
```

Defined in: [core/table/coreTablesFeature.utils.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L106)

Updates the table options object.

The updater receives the current resolved options and the merged result is
immediately assigned to the table instance.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

## Returns

`void`

## Example

```ts
table_setOptions(table, (old) => old)
```
