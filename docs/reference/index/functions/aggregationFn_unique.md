---
id: aggregationFn_unique
title: aggregationFn_unique
---

# Function: aggregationFn\_unique()

```ts
function aggregationFn_unique<TFeatures, TData>(columnId, leafRows): unknown[];
```

Defined in: [fns/aggregationFns.ts:189](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L189)

Collects unique leaf-row values for a grouped column.

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

`unknown`[]
