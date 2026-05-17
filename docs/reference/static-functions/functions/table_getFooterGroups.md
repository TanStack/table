---
id: table_getFooterGroups
title: table_getFooterGroups
---

# Function: table\_getFooterGroups()

```ts
function table_getFooterGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[];
```

Defined in: [core/headers/coreHeadersFeature.utils.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.utils.ts#L142)

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

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../../index/type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]

## Example

```ts
const footerGroups = table_getFooterGroups(table)
```
