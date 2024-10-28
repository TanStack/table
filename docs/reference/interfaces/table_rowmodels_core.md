---
id: Table_RowModels_Core
title: Table_RowModels_Core
---

# Interface: Table\_RowModels\_Core\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getCoreRowModel()

```ts
getCoreRowModel: () => RowModel<TFeatures, TData>;
```

Returns the core row model before any processing has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/row-models/RowModels.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L51)

***

### getRowModel()

```ts
getRowModel: () => RowModel<TFeatures, TData>;
```

Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/tables)

#### Defined in

[core/row-models/RowModels.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L57)
