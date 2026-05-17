---
id: column_pin
title: column_pin
---

# Function: column\_pin()

```ts
function column_pin<TFeatures, TData, TValue>(column, position): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L56)

Moves this column's leaf column ids into a pinning region.

Pinning a group column pins all of its leaves. The leaf ids are first removed
from both regions, then appended to the requested `'left'` or `'right'`
region. Passing `false` unpins them back to the center.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### position

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Returns

`void`

## Example

```ts
column_pin(column, 'left')
```
