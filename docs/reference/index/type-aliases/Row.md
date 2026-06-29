---
id: Row
title: Row
---

# Type Alias: Row\<TFeatures, TData\>

```ts
type Row<TFeatures, TData> = Row_Core<TFeatures, TData> & ExtractFeatureMapTypes<TFeatures, Row_FeatureMap<TFeatures, TData>>;
```

Defined in: [types/Row.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/Row.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
