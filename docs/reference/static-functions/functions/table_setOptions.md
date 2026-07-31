---
id: table_setOptions
title: table_setOptions
---

# Function: table\_setOptions()

```ts
function table_setOptions<TFeatures, TData>(
   table,
   updater,
   options?): number | undefined;
```

Defined in: [core/table/coreTablesFeature.utils.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L203)

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

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`TableOptions`](../../index/type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

### options?

#### syncExternalState?

`boolean`

## Returns

`number` \| `undefined`

## Example

```ts
table_setOptions(table, (old) => old)
table_setOptions(table, (old) => old, { syncExternalState: false })
```
