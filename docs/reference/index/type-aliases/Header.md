---
id: Header
title: Header
---

# Type Alias: Header\<TFeatures, TData, TValue\>

```ts
type Header<TFeatures, TData, TValue> = Header_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Header_FeatureMap>;
```

Defined in: [types/Header.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Header.ts#L18)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` *extends* [`CellData`](CellData.md) = [`CellData`](CellData.md)
