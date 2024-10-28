---
id: Header
title: Header
---

# Type Alias: Header\<TFeatures, TData, TValue\>

```ts
type Header<TFeatures, TData, TValue>: Header_Header<TFeatures, TData, TValue> & UnionToIntersection<"ColumnSizing" extends keyof TFeatures ? Header_ColumnSizing : never | "ColumnResizing" extends keyof TFeatures ? Header_ColumnResizing : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/Header.ts:7](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Header.ts#L7)
