---
id: HeaderGroup
title: HeaderGroup
---

# Type Alias: HeaderGroup\<TFeatures, TData\>

```ts
type HeaderGroup<TFeatures, TData> = HeaderGroup_Core<TFeatures, TData> & ExtractFeatureTypes<"HeaderGroup", TFeatures> & HeaderGroup_Plugins<TFeatures, TData>;
```

Defined in: [types/HeaderGroup.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/HeaderGroup.ts#L19)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
