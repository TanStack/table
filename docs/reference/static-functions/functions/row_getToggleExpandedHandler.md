---
id: row_getToggleExpandedHandler
title: row_getToggleExpandedHandler
---

# Function: row\_getToggleExpandedHandler()

```ts
function row_getToggleExpandedHandler<TFeatures, TData>(row): () => void;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:364](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L364)

Creates a row control handler that toggles this row's expanded state.

The handler is a no-op when the row cannot expand.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

```ts
(): void;
```

### Returns

`void`

## Example

```ts
const onClick = row_getToggleExpandedHandler(row)
```
