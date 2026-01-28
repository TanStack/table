---
id: column_getToggleVisibilityHandler
title: column_getToggleVisibilityHandler
---

# Function: column\_getToggleVisibilityHandler()

```ts
function column_getToggleVisibilityHandler<TFeatures, TData, TValue>(column): (e) => void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L55)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

```ts
(e): void;
```

### Parameters

#### e

`unknown`

### Returns

`void`
