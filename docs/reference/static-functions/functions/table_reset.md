---
id: table_reset
title: table_reset
---

# Function: table\_reset()

```ts
function table_reset<TFeatures, TData>(table): void;
```

Defined in: [core/table/coreTablesFeature.utils.ts:53](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.utils.ts#L53)

Resets all internal table base atoms to `table.initialState`.

This resets internally owned state slices in a single reactivity batch. Use
feature-specific reset APIs when a slice may be externally owned.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`void`

## Example

```ts
table_reset(table)
```
