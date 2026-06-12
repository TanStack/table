---
id: ExtractFilterFnKeys
title: ExtractFilterFnKeys
---

# Type Alias: ExtractFilterFnKeys\<TFeatures\>

```ts
type ExtractFilterFnKeys<TFeatures> = IsAny<TFeatures> extends true ? 
  | keyof FilterFns
  | BuiltInFilterFn : TFeatures extends object ? Extract<keyof TFilterFns, string> : keyof FilterFns;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L100)

Resolves the valid string names for `columnDef.filterFn` and
`options.globalFilterFn` for a feature set.

When the features object declares a `filterFns` registry
(`tableFeatures({ ..., filterFns })`), its keys are the only valid names; a
name is only assignable if a filter function is actually registered for it.
Otherwise this falls back to the global declaration-merged `FilterFns`
interface.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
