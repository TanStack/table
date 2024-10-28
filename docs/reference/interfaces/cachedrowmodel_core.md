---
id: CachedRowModel_Core
title: CachedRowModel_Core
---

# Interface: CachedRowModel\_Core\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### coreRowModel()?

```ts
optional coreRowModel: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Defined in

[core/row-models/RowModels.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L39)
