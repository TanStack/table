---
id: table_getIsSomeRowsExpanded
title: table_getIsSomeRowsExpanded
---

# Function: table\_getIsSomeRowsExpanded()

```ts
function table_getIsSomeRowsExpanded<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:71](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L71)
