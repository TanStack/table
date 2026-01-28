---
id: table_setOptions
title: table_setOptions
---

# Function: table\_setOptions()

```ts
function table_setOptions<TFeatures, TData>(table, updater): void;
```

Defined in: [packages/table-core/src/core/table/coreTablesFeature.utils.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L31)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`TableOptions`](../type-aliases/TableOptions.md)\<`TFeatures`, `TData`\>\>

## Returns

`void`
