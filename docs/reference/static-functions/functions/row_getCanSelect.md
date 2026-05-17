---
id: row_getCanSelect
title: row_getCanSelect
---

# Function: row\_getCanSelect()

```ts
function row_getCanSelect<TFeatures, TData>(row): boolean;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:513](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L513)

Checks whether this row can be selected.

`options.enableRowSelection` may be a boolean or a row predicate; it defaults
to `true`.

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
const canSelect = row_getCanSelect(row)
```
