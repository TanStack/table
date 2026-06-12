---
id: TableOptions
title: TableOptions
---

# Type Alias: TableOptions\<TFeatures, TData\>

```ts
type TableOptions<TFeatures, TData> = TableOptions_Core<TFeatures, TData> & ExtractFeatureMapTypes<TFeatures, TableOptions_FeatureMap<TFeatures, TData>> & DebugOptions<TFeatures>;
```

Defined in: [types/TableOptions.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableOptions.ts#L93)

Complete table options for a specific feature set.

Feature options are included only when their feature is present in
`TFeatures`, then custom feature/plugin options and debug options are mixed
in.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
