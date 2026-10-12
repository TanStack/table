---
id: filterFn_inDateRange
title: filterFn_inDateRange
---

```ts
const filterFn_inDateRange: CreatedFilterFn<any, any>;
```

Defined in: [features/column-filtering/filterFns.ts:336](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/filterFns.ts#L336)

Keeps rows whose date value is inside an inclusive `[min, max]` date range.

Row values and range endpoints may be `Date` objects, timestamps, or
parseable date strings. Blank or invalid endpoints become open-ended and
reversed endpoints are swapped. Rows without a valid date never match.
