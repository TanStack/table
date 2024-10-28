---
id: StringOrTemplateHeader
title: StringOrTemplateHeader
---

# Type Alias: StringOrTemplateHeader\<TFeatures, TData, TValue\>

```ts
type StringOrTemplateHeader<TFeatures, TData, TValue>: string | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/ColumnDef.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/ColumnDef.ts#L29)
