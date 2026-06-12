---
id: ExtractFilterMeta
title: ExtractFilterMeta
---

# Type Alias: ExtractFilterMeta\<TFeatures\>

```ts
type ExtractFilterMeta<TFeatures> = IsAny<TFeatures> extends true ? FilterMeta : TFeatures extends object ? TFilterMeta : FilterMeta;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L23)

Resolves the type of the filter meta attached to rows for a feature set.

When the features object declares a `filterMeta` type-only slot
(`tableFeatures({ ..., filterMeta: {} as MyFilterMeta })`), that type wins.
Otherwise this falls back to the global declaration-merged `FilterMeta`
interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
