---
id: RowModel
title: RowModel
---

# Interface: RowModel\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### flatRows

```ts
flatRows: Row<TFeatures, TData>[];
```

#### Defined in

[core/row-models/RowModels.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L17)

***

### rows

```ts
rows: Row<TFeatures, TData>[];
```

#### Defined in

[core/row-models/RowModels.types.ts:16](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L16)

***

### rowsById

```ts
rowsById: Record<string, Row<TFeatures, TData>>;
```

#### Defined in

[core/row-models/RowModels.types.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.types.ts#L18)
