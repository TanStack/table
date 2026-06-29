---
id: aggregationFn_uniqueCount
title: aggregationFn_uniqueCount
---

# Function: aggregationFn\_uniqueCount()

```ts
function aggregationFn_uniqueCount<TFeatures, TData>(columnId, leafRows): number;
```

Defined in: [fns/aggregationFns.ts:205](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L205)

Counts unique leaf-row values for a grouped column.

Values are compared with JavaScript `Set` semantics.

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

`number`
