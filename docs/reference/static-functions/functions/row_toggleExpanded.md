---
id: row_toggleExpanded
title: row_toggleExpanded
---

# Function: row\_toggleExpanded()

```ts
function row_toggleExpanded<TFeatures, TData>(row, expanded?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L250)

Expands or collapses this row.

Omitting `expanded` toggles the row. If the current state is expanded-all,
the function first materializes that state into a row-id map before applying
the row-specific change.

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
