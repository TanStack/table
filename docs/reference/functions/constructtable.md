---
id: constructTable
title: constructTable
---

# Function: constructTable()

```ts
function constructTable<TFeatures, TData>(options): Table<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **options**: [`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

## Returns

[`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Defined in

[core/table/constructTable.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/constructTable.ts#L22)
