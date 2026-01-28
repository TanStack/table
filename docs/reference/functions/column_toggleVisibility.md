---
id: column_toggleVisibility
title: column_toggleVisibility
---

# Function: column\_toggleVisibility()

```ts
function column_toggleVisibility<TFeatures, TData, TValue>(column, visible?): void;
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L14)

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

### visible?

`boolean`

## Returns

`void`
