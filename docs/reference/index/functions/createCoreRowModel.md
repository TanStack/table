---
id: createCoreRowModel
title: createCoreRowModel
---

```ts
function createCoreRowModel<TFeatures, TData>(): (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/createCoreRowModel.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/createCoreRowModel.ts#L20)

Creates a memoized core row model factory.

The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

(`table`) => () => [`RowModel`](../interfaces/RowModel.md)\<`TFeatures`, `TData`\>
