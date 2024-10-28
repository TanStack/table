---
id: table_setGlobalFilter
title: table_setGlobalFilter
---

# Function: table\_setGlobalFilter()

```ts
function table_setGlobalFilter<TFeatures, TData>(table, updater): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **updater**: `any`

## Returns

`void`

## Defined in

[features/global-filtering/GlobalFiltering.utils.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/GlobalFiltering.utils.ts#L51)
