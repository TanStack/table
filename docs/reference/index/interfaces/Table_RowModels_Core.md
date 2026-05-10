---
id: Table_RowModels_Core
title: Table_RowModels_Core
---

# Interface: Table\_RowModels\_Core\<TFeatures, TData\>

Defined in: [core/row-models/coreRowModelsFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L45)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getCoreRowModel()

```ts
getCoreRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L52)

Returns the core row model before any processing has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getRowModel()

```ts
getRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L56)

Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
