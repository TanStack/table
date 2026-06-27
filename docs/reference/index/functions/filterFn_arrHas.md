---
id: filterFn_arrHas
title: filterFn_arrHas
---

# Function: filterFn\_arrHas()

```ts
function filterFn_arrHas<TFeatures, TData>(
   row, 
   columnId, 
   filterValue): boolean;
```

Defined in: [fns/filterFns.ts:299](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/filterFns.ts#L299)

Keeps rows whose scalar column value equals at least one filter value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

### filterValue

`unknown`[]

## Returns

`boolean`
