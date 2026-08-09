---
id: row_toggleExpanded
title: row_toggleExpanded
---

# Function: row\_toggleExpanded()

```ts
function row_toggleExpanded<TFeatures, TData>(row, expanded?): void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:292](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L292)

Expands or collapses this row.

Omitting `expanded` toggles the row. If the current state is expanded-all,
the function first materializes that state into a row-id map (containing
only expandable row ids) before applying the row-specific change.

The call is a no-op (no `onExpandedChange`) when the requested state matches
the current state, or when expanding a row that cannot expand. Collapsing is
always allowed so stale expanded ids can be cleaned up.

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
