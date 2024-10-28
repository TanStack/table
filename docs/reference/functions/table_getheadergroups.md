---
id: table_getHeaderGroups
title: table_getHeaderGroups
---

# Function: table\_getHeaderGroups()

```ts
function table_getHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/headers/Headers.utils.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/Headers.utils.ts#L46)
