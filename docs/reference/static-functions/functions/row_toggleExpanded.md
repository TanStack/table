---
id: row_toggleExpanded
title: row_toggleExpanded
---

# Function: row\_toggleExpanded()

```ts
function row_toggleExpanded<TFeatures, TData>(row, expanded?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:237](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L237)

Toggles expanded for a row.

The update is routed through the table state updater for the owning feature state slice.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### expanded?

`boolean`

## Returns

`void`

## Example

```ts
row_toggleExpanded(row)
```
