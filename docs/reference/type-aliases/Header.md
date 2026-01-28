---
id: Header
title: Header
---

# Type Alias: Header\<TFeatures, TData, TValue\>

```ts
type Header<TFeatures, TData, TValue> = Header_Core<TFeatures, TData, TValue> & UnionToIntersection<
  | "columnSizingFeature" extends keyof TFeatures ? Header_ColumnSizing : never
| "columnResizingFeature" extends keyof TFeatures ? Header_ColumnResizing : never> & ExtractFeatureTypes<"Header", TFeatures> & Header_Plugins<TFeatures, TData, TValue>;
```

Defined in: [packages/table-core/src/types/Header.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Header.ts#L23)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
