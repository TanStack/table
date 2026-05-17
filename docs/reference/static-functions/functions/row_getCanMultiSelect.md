---
id: row_getCanMultiSelect
title: row_getCanMultiSelect
---

# Function: row\_getCanMultiSelect()

```ts
function row_getCanMultiSelect<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:559](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L559)

Checks whether this row can be selected alongside other rows.

`options.enableMultiRowSelection` may be a boolean or a row predicate; it
defaults to `true`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const canMultiSelect = row_getCanMultiSelect(row)
```
