---
id: aggregationFn_mean
title: aggregationFn_mean
---

# Function: aggregationFn\_mean()

```ts
function aggregationFn_mean<TFeatures, TData>(columnId, leafRows): number | undefined;
```

Defined in: [fns/aggregationFns.ts:126](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L126)

Averages numeric leaf-row values for a grouped column.

Number-like values are coerced with unary `+`; nullish and non-numeric values
are ignored.

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
