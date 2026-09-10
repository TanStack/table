---
id: ExtractFeatureMapTypes
title: ExtractFeatureMapTypes
---

# Type Alias: ExtractFeatureMapTypes\<TFeatures, TFeatureMap\>

```ts
type ExtractFeatureMapTypes<TFeatures, TFeatureMap> = IsAny<TFeatures> extends true ? UnionToIntersection<TFeatureMap[keyof TFeatureMap]> : UnionToIntersectionOrEmpty<TFeatureMap[Extract<keyof TFeatures, keyof TFeatureMap>]>;
```

Defined in: [types/TableFeatures.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/TableFeatures.ts#L43)

Extracts the API/types contributed by the features present in `TFeatures`.

`TFeatureMap` maps feature keys to the types they contribute. When
`TFeatures` is `any`, all feature-map entries are included to preserve the
permissive behavior expected by broad table types. Otherwise, only entries
whose keys are present in `TFeatures` are intersected together.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TFeatureMap

`TFeatureMap` *extends* `object`
