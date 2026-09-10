---
id: filterFn_inNumberRange
title: filterFn_inNumberRange
---

# Variable: filterFn\_inNumberRange

```ts
const filterFn_inNumberRange: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:285](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L285)

Keeps rows whose numeric value is inside an inclusive `[min, max]` range.

Filter values are normalized so blank endpoints become open-ended and
reversed endpoints are swapped. Only real numbers can fall inside the
range: non-numeric row values (`null`, `undefined`, strings, booleans)
never match.
