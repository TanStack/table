---
id: CachedRowModel_Core
title: CachedRowModel_Core
---

# Interface: CachedRowModel\_Core\<TFeatures, TData\>

Defined in: [core/row-models/coreRowModelsFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L38)

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

Defined in: [core/row-models/coreRowModelsFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L42)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
