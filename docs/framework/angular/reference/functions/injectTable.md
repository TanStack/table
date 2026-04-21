---
id: injectTable
title: injectTable
---

# Function: injectTable()

```ts
function injectTable<TFeatures, TData, TSelected>(options, selector): AngularTable<TFeatures, TData, TSelected>;
```

Defined in: [injectTable.ts:118](https://github.com/TanStack/table/blob/main/packages/angular-table/src/injectTable.ts#L118)

Creates and returns an Angular-reactive table instance.

The initializer is intentionally re-evaluated whenever any signal read inside it changes.
This is how the adapter keeps the table in sync with Angular's reactivity model.

Because of that behavior, keep expensive/static values (for example `columns`, feature setup, row models)
as stable references outside the initializer, and only read reactive state (`data()`, pagination/filter/sorting signals, etc.)
inside it.

The returned table is also signal-reactive: table state and table APIs are wired for Angular signals, so you can safely consume table methods inside `computed(...)` and `effect(...)`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

## Parameters

### options

() => `TableOptions`\<`TFeatures`, `TData`\>

### selector

(`state`) => `TSelected`

## Returns

[`AngularTable`](../type-aliases/AngularTable.md)\<`TFeatures`, `TData`, `TSelected`\>

An Angular-reactive TanStack Table instance.

## Example

1. Register the table features you need
```ts
// Register only the features you need
import {tableFeatures, rowPaginationFeature} from '@tanstack/angular-table';
const _features = tableFeatures({
 rowPaginationFeature,
 // ...all other features you need
})

// Use all table core features
import {stockFeatures} from '@tanstack/angular-table';
const _features = tableFeatures(stockFeatures);
```
2. Prepare the table columns
```ts
import {ColumnDef} from '@tanstack/angular-table';

type MyData = {}

const columns: ColumnDef<typeof _features, MyData>[] = [
  // ...column definitions
]

// or using createColumnHelper
import {createColumnHelper} from '@tanstack/angular-table';
const columnHelper = createColumnHelper<typeof _features, MyData>();
const columns = columnHelper.columns([
 columnHelper.accessor(...),
 // ...other columns
])
```
3. Create the table instance with `injectTable`
```ts
const table = injectTable(() => {
  // ...table options,
  _features,
  columns: columns,
  data: myDataSignal(),
})
```
