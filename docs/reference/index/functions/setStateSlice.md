---
id: setStateSlice
title: setStateSlice
---

# Function: setStateSlice()

```ts
function setStateSlice<K>(
   instance,
   key,
   updater): void;
```

Defined in: [utils.ts:230](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L230)

Routes a state slice update through the slice's `on<State>Change` handler,
skipping updates that would not change the state.

The updater is resolved once against the slice's current value (untracked,
so setters never register reactive dependencies). When the resolved value is
structurally equal to the current value, nothing fires: no change handler,
no atom write, no re-render. This makes every setter, toggle, reset, and
auto-reset a natural no-op when state is already in the target shape, for
both internally owned and externally controlled state.

For uncontrolled slices, default handlers created by `makeStateUpdater`
receive the pre-resolved value so the original updater runs exactly once;
the slice atom and the default handler's target are the same source, so the
resolved value is exactly what the handler would compute. Everything else
receives the original updater untouched: user handlers because a host state
container (such as a React `setState`) must resolve functional updaters
against its own latest queued state to keep same-tick updates composable,
and controlled slices routed to the default handler because the base atom
is an independent fallback that must keep resolving against its own value
while ownership is external.

## Type Parameters

### K

`K` *extends* `string` & `object` \| keyof TableState\_All

## Parameters

### instance

#### _reactivity

\{
  `untrack`: \<`T`\>(`fn`) => `T`;
\}

#### _reactivity.untrack

\<`T`\>(`fn`) => `T`

#### atoms

`object`

#### options

`object`

### key

`K`

### updater

[`Updater`](../type-aliases/Updater.md)\<`K` *extends*
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
  \| `"workerRowModels"` ? `TableState_WorkerRowModels` & [`TableState_ColumnFiltering`](../interfaces/TableState_ColumnFiltering.md) & [`TableState_ColumnGrouping`](../interfaces/TableState_ColumnGrouping.md) & [`TableState_RowExpanding`](../interfaces/TableState_RowExpanding.md) & [`TableState_RowPagination`](../interfaces/TableState_RowPagination.md) & [`TableState_RowSorting`](../interfaces/TableState_RowSorting.md) & [`TableState_ColumnPinning`](../interfaces/TableState_ColumnPinning.md) & [`TableState_ColumnSizing`](../interfaces/TableState_ColumnSizing.md) & [`TableState_ColumnResizing`](../interfaces/TableState_ColumnResizing.md) & [`TableState_GlobalFiltering`](../interfaces/TableState_GlobalFiltering.md) & [`TableState_ColumnOrdering`](../interfaces/TableState_ColumnOrdering.md) & [`TableState_ColumnVisibility`](../interfaces/TableState_ColumnVisibility.md) & [`TableState_RowPinning`](../interfaces/TableState_RowPinning.md) & [`TableState_RowSelection`](../interfaces/TableState_RowSelection.md) & [`TableState_CellSelection`](../interfaces/TableState_CellSelection.md)\[`K`\<`K`\>\] : `unknown`\>

## Returns

`void`
