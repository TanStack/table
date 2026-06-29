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

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:286](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L286)

Pins or unpins a row.

Optional flags let callers include parent rows or leaf rows when updating
the row pinning state.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### position

[`RowPinningPosition`](../../index/type-aliases/RowPinningPosition.md)

### includeLeafRows?

`boolean`

### includeParentRows?

`boolean`

## Returns

`void`

## Example

```ts
row_pin(row, 'top')
```
