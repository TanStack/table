---
id: row_getToggleSelectedHandler
title: row_getToggleSelectedHandler
---

# Function: row\_getToggleSelectedHandler()

```ts
function row_getToggleSelectedHandler<TFeatures, TData>(row): (e) => void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:582](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L582)

Creates a checkbox-style handler that selects or deselects this row.

The handler is a no-op when the row cannot be selected and reads
`event.target.checked`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`

## Example

```ts
const onChange = row_getToggleSelectedHandler(row)
```
