---
id: table_setState
title: table_setState
---

# Function: table\_setState()

```ts
function table_setState<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`TableState`](../type-aliases/tablestate.md)\<`TFeatures`\>\>

## Returns

`void`

## Defined in

[core/table/Tables.utils.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L57)
