---
id: CustomFilterFns
title: CustomFilterFns
---

```ts
type CustomFilterFns<TFeatures, TData> = Record<string, FilterFn<TFeatures, TData>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L150)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)
