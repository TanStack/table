---
id: row_pin
title: row_pin
---

# Function: row\_pin()

```ts
function row_pin<TFeatures, TData>(
   row, 
   position, 
   includeLeafRows?, 
   includeParentRows?): void;
```

Defined in: [packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts:160](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L160)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### position

[`RowPinningPosition`](../type-aliases/RowPinningPosition.md)

### includeLeafRows?

`boolean`

### includeParentRows?

`boolean`

## Returns

`void`
