---
id: table_reset
title: table_reset
---

# Function: table\_reset()

```ts
function table_reset<TFeatures, TData>(table): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Defined in

[core/table/Tables.utils.ts:8](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/Tables.utils.ts#L8)
