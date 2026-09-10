---
id: table_getFooterGroups
title: table_getFooterGroups
---

# Function: table\_getFooterGroups()

```ts
function table_getFooterGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L149)

Builds footer groups by reversing the current header groups.

Footer rendering uses the same header objects and grouping structure, but
renders them from leaf level back toward the root.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../../index/interfaces/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const footerGroups = table_getFooterGroups(table)
```
