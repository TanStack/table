---
id: table_mergeOptions
title: table_mergeOptions
---

# Function: table\_mergeOptions()

```ts
function table_mergeOptions<TFeatures, TData>(table, newOptions): TableOptions<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **newOptions**: [`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

## Returns

[`TableOptions`](../type-aliases/tableoptions.md)\<`TFeatures`, `TData`\>

## Defined in

[core/table/Tables.utils.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L15)
