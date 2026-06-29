---
id: tableFeatures
title: tableFeatures
---

# Function: tableFeatures()

```ts
function tableFeatures<TFeatures>(features): TFeatures;
```

Defined in: [helpers/tableFeatures.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableFeatures.ts#L45)

A helper function to help define the features that are to be imported and applied to a table instance.
Use this utility to make it easier to have the correct type inference for the features that are being imported.
**Note:** It is recommended to use this utility statically outside of a component.

Alongside feature modules, this object carries everything else that is
statically stitched into the table:

- Row model factories (`sortedRowModel`, `filteredRowModel`, etc.)
- Row model function registries (`sortFns`, `filterFns`, `aggregationFns`),
  whose keys become the valid string values for `sortFn`, `filterFn`,
  `globalFilterFn`, and `aggregationFn` with full inference
- Type-only `tableMeta`/`columnMeta` slots for declaring per-table meta types
  instead of using global declaration merging. The values are phantom
  (ignored and stripped at runtime); only their types are used.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

## Parameters

### features

`TFeatures` & [`ValidateFeatureSlots`](../type-aliases/ValidateFeatureSlots.md)\<`TFeatures`\>

## Returns

`TFeatures`

## Example

```
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'
const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, myCustomFilterFn },
  sortFns,
  tableMeta: {} as { updateData: (rowIndex: number, columnId: string, value: unknown) => void },
  columnMeta: {} as { align?: 'left' | 'right' },
});
const table = useTable({ features, columns, data });
```
