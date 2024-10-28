---
id: CreateRowModel_Core
title: CreateRowModel_Core
---

# Interface: CreateRowModel\_Core\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### coreRowModel()?

```ts
optional coreRowModel: (table) => () => RowModel<TFeatures, TData>;
```

This required option is a factory for a function that computes and returns the core row model for the table.

#### Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

#### Returns

`Function`

##### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/row-models/RowModels.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L30)
