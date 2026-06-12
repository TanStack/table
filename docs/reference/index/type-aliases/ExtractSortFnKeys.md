---
id: ExtractSortFnKeys
title: ExtractSortFnKeys
---

# Type Alias: ExtractSortFnKeys\<TFeatures\>

```ts
type ExtractSortFnKeys<TFeatures> = IsAny<TFeatures> extends true ? 
  | keyof SortFns
  | BuiltInSortFn : TFeatures extends object ? Extract<keyof TSortFns, string> : keyof SortFns;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L54)

Resolves the valid string names for `columnDef.sortFn` for a feature set.

When the features object declares a `sortFns` registry
(`tableFeatures({ ..., sortFns })`), its keys are the only valid names; a
name is only assignable if a sorting function is actually registered for it.
Otherwise this falls back to the global declaration-merged `SortFns`
interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
