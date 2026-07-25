---
id: makeStateUpdater
title: makeStateUpdater
---

# Function: makeStateUpdater()

```ts
function makeStateUpdater<TFeatures, K>(key, instance): (updater) => void;
```

Defined in: [utils.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L97)

Creates a table state updater for a single state slice.

The updater writes through the table base atom for the slice and supports both value and functional updater forms.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### K

`K` *extends* `string` \| `number` \| `symbol` \| `string` & `object`

## Parameters

### key

`K`

### instance

#### baseAtoms

`object`

#### options

\{
  `atoms?`: `object`;
\}

#### options.atoms?

`object`

## Returns

```ts
(updater): void;
```

### Parameters

#### updater

[`Updater`](../type-aliases/Updater.md)\<`TableState_WorkerRowModels` & [`TableState_RowSorting`](../interfaces/TableState_RowSorting.md) & [`TableState_ColumnPinning`](../interfaces/TableState_ColumnPinning.md) & [`TableState_ColumnSizing`](../interfaces/TableState_ColumnSizing.md) & [`TableState_ColumnResizing`](../interfaces/TableState_ColumnResizing.md) & [`TableState_GlobalFiltering`](../interfaces/TableState_GlobalFiltering.md) & [`TableState_ColumnOrdering`](../interfaces/TableState_ColumnOrdering.md) & [`TableState_ColumnVisibility`](../interfaces/TableState_ColumnVisibility.md) & [`TableState_RowExpanding`](../interfaces/TableState_RowExpanding.md) & [`TableState_RowPinning`](../interfaces/TableState_RowPinning.md) & [`TableState_RowSelection`](../interfaces/TableState_RowSelection.md) & [`TableState_ColumnFiltering`](../interfaces/TableState_ColumnFiltering.md) & [`TableState_RowPagination`](../interfaces/TableState_RowPagination.md) & [`TableState_ColumnGrouping`](../interfaces/TableState_ColumnGrouping.md) & [`TableState_CellSelection`](../interfaces/TableState_CellSelection.md)\[`K` & 
  \| `"expanded"`
  \| `"columnFilters"`
  \| `"globalFilter"`
  \| `"grouping"`
  \| `"sorting"`
  \| `"cellSelection"`
  \| `"columnOrder"`
  \| `"columnPinning"`
  \| `"columnResizing"`
  \| `"columnSizing"`
  \| `"columnVisibility"`
  \| `"pagination"`
  \| `"rowPinning"`
  \| `"rowSelection"`
  \| `"workerRowModels"`\]\>

### Returns

`void`
