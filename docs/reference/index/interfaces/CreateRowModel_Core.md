---
id: CreateRowModel_Core
title: CreateRowModel_Core
---

# Interface: CreateRowModel\_Core\<TFeatures, TData\>

Defined in: [core/row-models/coreRowModelsFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L23)

## Extends

- [`CreateRowModel_Plugins`](CreateRowModel_Plugins.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### coreRowModel()?

```ts
optional coreRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.types.ts#L31)

Optional factory for the core row model. When omitted, the built-in
`createCoreRowModel()` factory is used.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
