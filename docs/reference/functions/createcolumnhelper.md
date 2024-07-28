---
id: createColumnHelper
title: createColumnHelper
---

# Function: createColumnHelper()

```ts
function createColumnHelper<TFeatures, TData>(): ColumnHelper<TFeatures, TData>
```

A helper utility for creating column definitions with slightly better type inference for each individual column.
The `TValue` generic is inferred based on the accessor key or function provided.

**Note:** From a JavaScript perspective, the functions in these helpers do not do anything. They are only used to help TypeScript infer the correct types for the column definitions.

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Returns

[`ColumnHelper`](../type-aliases/columnhelper.md)\<`TFeatures`, `TData`\>

## Example

```tsx
const helper = createColumnHelper<typeof _features, Person>() // _features is the result of `tableFeatures({})` helper

const columns = [
 helper.display({ id: 'actions', header: 'Actions' }),
 helper.accessor('firstName', {}),
 helper.accessor((row) => row.lastName, {}
]
```

## Defined in

[helpers/columnHelper.ts:56](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/columnHelper.ts#L56)
