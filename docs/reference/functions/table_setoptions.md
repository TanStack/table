---
id: table_setOptions
title: table_setOptions
---

# Function: table\_setOptions()

```ts
function table_setOptions<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>\>

## Returns

`void`

## Defined in

[core/table/Tables.utils.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L32)
