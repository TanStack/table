---
id: metaHelper
title: metaHelper
---

# Function: metaHelper()

```ts
function metaHelper<TMeta>(): TMeta;
```

Defined in: [helpers/metaHelper.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/metaHelper.ts#L22)

A helper for declaring the `tableMeta`/`columnMeta` type-only slots in the
`features` option without a type assertion.

Equivalent to `{} as TMeta`, but reads as type-only at the call site and
avoids `@typescript-eslint/no-unnecessary-type-assertion` false positives
when the meta type has only optional properties (where an auto-fix removing
the assertion would silently degrade the inferred meta type to `{}`).

The returned value is a phantom — it is ignored and stripped from the
table's registered features at runtime; only its type is used.

## Type Parameters

### TMeta

`TMeta` *extends* `object`

## Returns

`TMeta`

## Example

```
import { metaHelper, tableFeatures, rowSortingFeature } from '@tanstack/react-table'
const features = tableFeatures({
  rowSortingFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
});
```
