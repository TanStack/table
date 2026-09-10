---
id: AggregationResult
title: AggregationResult
---

# Type Alias: AggregationResult\<TOption, TFeatures\>

```ts
type AggregationResult<TOption, TFeatures> = TOption extends ReadonlyArray<infer TEntry> ? { [TKey in AggregationEntryId<TEntry>]: AggregationResultOfRef<AggregationEntryDefinition<Extract<TEntry, TKey | { id: TKey }>>, TFeatures> } : AggregationResultOfRef<TOption, TFeatures>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L198)

Infers the scalar or keyed result produced by an aggregation option.

## Type Parameters

### TOption

`TOption`

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md) = `any`
