---
id: _Header
title: _Header
---

# Type Alias: \_Header\<TFeatures, TData, TValue\>

```ts
type _Header<TFeatures, TData, TValue>: Header_Header<TFeatures, TData, TValue> & UnionToIntersection<"ColumnSizing" extends keyof TFeatures ? Header_ColumnSizing : never | "ColumnResizing" extends keyof TFeatures ? Header_ColumnResizing : never>;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

• **TValue** *extends* [`CellData`](celldata.md) = [`CellData`](celldata.md)

## Defined in

[types/Header.ts:7](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/types/Header.ts#L7)
