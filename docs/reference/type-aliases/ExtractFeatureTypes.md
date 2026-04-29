---
id: ExtractFeatureTypes
title: ExtractFeatureTypes
---

# Type Alias: ExtractFeatureTypes\<TKey, TFeatures\>

```ts
type ExtractFeatureTypes<TKey, TFeatures> = UnionToIntersection<{ [K in keyof TFeatures]: TFeatures[K] extends TableFeature<infer FeatureConstructorOptions> ? TKey extends keyof FeatureConstructorOptions ? FeatureConstructorOptions[TKey] : never : any }[keyof TFeatures]>;
```

Defined in: [types/TableFeatures.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L10)

## Type Parameters

### TKey

`TKey` *extends* keyof [`FeatureConstructors`](../interfaces/FeatureConstructors.md)

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
