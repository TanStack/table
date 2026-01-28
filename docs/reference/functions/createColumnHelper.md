---
id: createColumnHelper
title: createColumnHelper
---

# Function: createColumnHelper()

```ts
function createColumnHelper<TFeatures, TData>(): ColumnHelper<TFeatures, TData>;
```

Defined in: [packages/table-core/src/helpers/columnHelper.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/columnHelper.ts#L94)

A helper utility for creating column definitions with slightly better type inference for each individual column.
The `TValue` generic is inferred based on the accessor key or function provided.
**Note:** From a JavaScript perspective, the functions in these helpers do not do anything. They are only used to help TypeScript infer the correct types for the column definitions.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`ColumnHelper`](../type-aliases/ColumnHelper.md)\<`TFeatures`, `TData`\>

## Example

```tsx
const helper = createColumnHelper<typeof _features, Person>() // _features is the result of `tableFeatures({})` helper
const columns = [
 helper.display({ id: 'actions', header: 'Actions' }),
 helper.accessor('firstName', {}),
 helper.accessor((row) => row.lastName, {}
]
```
