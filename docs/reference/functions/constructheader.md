---
id: constructHeader
title: constructHeader
---

# Function: constructHeader()

```ts
function constructHeader<TFeatures, TData, TValue>(
   table, 
   column, 
options): Header<TFeatures, TData, TValue>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **options**

• **options.depth**: `number`

• **options.id?**: `string`

• **options.index**: `number`

• **options.isPlaceholder?**: `boolean`

• **options.placeholderId?**: `string`

## Returns

[`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

## Defined in

[core/headers/constructHeader.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/constructHeader.ts#L8)
