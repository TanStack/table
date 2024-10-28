---
id: table_getTotalSize
title: table_getTotalSize
---

# Function: table\_getTotalSize()

```ts
function table_getTotalSize<TFeatures, TData>(table): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L148)
