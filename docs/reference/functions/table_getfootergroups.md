---
id: table_getFooterGroups
title: table_getFooterGroups
---

# Function: table\_getFooterGroups()

```ts
function table_getFooterGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/headers/Headers.utils.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.utils.ts#L76)
