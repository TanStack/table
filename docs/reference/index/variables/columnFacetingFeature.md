---
id: columnFacetingFeature
title: columnFacetingFeature
---

# Variable: columnFacetingFeature

```ts
const columnFacetingFeature: TableFeature;
```

Defined in: [features/column-faceting/columnFacetingFeature.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.ts#L21)

Feature that derives faceted row models, unique values, and min/max values for filters.

These APIs are deliberately not memoized at this layer: the stock
`createFaceted*` factories memoize internally (like every other stock row
model), and an extra memo layer here would freeze custom factories whose
data changes independently of the faceted row model. Custom factories own
their memoization.
