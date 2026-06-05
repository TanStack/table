---
id: createColumnHelper
title: createColumnHelper
---

# Function: createColumnHelper()

```ts
function createColumnHelper<TFeatures, TData>(): ColumnHelper<TFeatures, TData>;
```

Defined in: [helpers/columnHelper.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L99)

Creates helper functions for authoring column definitions with stronger value
inference.

`accessor` infers `TValue` from an accessor key or accessor function,
`display` creates non-data columns, `group` creates parent columns, and
`columns` preserves tuple-level value types for arrays. At runtime these
helpers only return column definition objects.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`ColumnHelper`](../type-aliases/ColumnHelper.md)\<`TFeatures`, `TData`\>

## Example

```tsx
const helper = createColumnHelper<typeof features, Person>() // features is the result of `tableFeatures({})` helper
const columns = [
 helper.display({ id: 'actions', header: 'Actions' }),
 helper.accessor('firstName', {}),
 helper.accessor((row) => row.lastName, { id: 'lastName' }),
]
```
