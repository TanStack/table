---
id: row_toggleExpanded
title: row_toggleExpanded
---

# Function: row\_toggleExpanded()

```ts
function row_toggleExpanded<TFeatures, TData>(row, expanded?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **expanded?**: `boolean`

## Returns

`void`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:122](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L122)
