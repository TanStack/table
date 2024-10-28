---
id: table_getGlobalFilterFn
title: table_getGlobalFilterFn
---

# Function: table\_getGlobalFilterFn()

```ts
function table_getGlobalFilterFn<TFeatures, TData>(table): FilterFn<TFeatures, TData> | FilterFn<TFeatures, TData> | undefined
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`FilterFn`](../interfaces/filterfn.md)\<`TFeatures`, `TData`\> \| [`FilterFn`](../interfaces/filterfn.md)\<`TFeatures`, `TData`\> \| `undefined`

## Defined in

[features/global-filtering/GlobalFiltering.utils.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/GlobalFiltering.utils.ts#L33)
