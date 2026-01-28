---
id: RowModel
title: RowModel
---

# Interface: RowModel\<TFeatures, TData\>

Defined in: [packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L12)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### flatRows

```ts
flatRows: Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L17)

***

### rows

```ts
rows: Row<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L16)

***

### rowsById

```ts
rowsById: Record<string, Row<TFeatures, TData>>;
```

Defined in: [packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L18)
