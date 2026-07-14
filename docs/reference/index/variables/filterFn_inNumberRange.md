---
id: filterFn_inNumberRange
title: filterFn_inNumberRange
---

# Variable: filterFn\_inNumberRange

```ts
const filterFn_inNumberRange: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:283](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L283)

Keeps rows whose numeric value is inside an inclusive `[min, max]` range.

Filter values are normalized so blank endpoints become open-ended and
reversed endpoints are swapped.
