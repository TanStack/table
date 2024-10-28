---
id: table_resetPagination
title: table_resetPagination
---

# Function: table\_resetPagination()

```ts
function table_resetPagination<TFeatures, TData>(table, defaultState?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **defaultState?**: `boolean`

## Returns

`void`

## Defined in

[features/row-pagination/RowPagination.utils.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/RowPagination.utils.ts#L43)
