---
id: aggregationFn_median
title: aggregationFn_median
---

# Function: aggregationFn\_median()

```ts
function aggregationFn_median<TFeatures, TData>(columnId, leafRows): number | undefined;
```

Defined in: [fns/aggregationFns.ts:158](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L158)

Computes the median of numeric leaf-row values for a grouped column.

All values must be numbers. If any value is non-numeric, or no leaf rows are
present, the result is `undefined`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### columnId

`string`

### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`number` \| `undefined`
