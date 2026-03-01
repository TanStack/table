---
id: CachedRowModel_Core
title: CachedRowModel_Core
---

# Interface: CachedRowModel\_Core\<TFeatures, TData\>

Defined in: [core/row-models/coreRowModelsFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L37)

## Extends

- [`CachedRowModel_Plugins`](CachedRowModel_Plugins.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### coreRowModel()

```ts
coreRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L41)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
