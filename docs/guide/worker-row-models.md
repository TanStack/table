---
title: Worker Row Models Guide (Experimental)
---

> ⚠️ **Experimental.** The `experimental-worker-plugin` entry point is a proof of concept shipped for feedback. Its API may change or be removed in any release, and it is intentionally excluded from the stable API surface. It is probably only suitable for extreme use cases: as a rough starting point, do not reach for it unless you are processing **100,000+ rows on the client**. Most tables at that scale are better served by server-side processing (`manual*` options), pagination, and virtualization first.

## What It Does

The worker plugin moves the expensive row model stages (filtering, grouping with aggregation, and sorting) into a dedicated Web Worker, so heavy recomputation never blocks the main thread. Your table code stays almost identical to a normal table: no `manual*` flags and no `postMessage` calls. The worker runs a headless "shadow table" with the real row model pipeline, and posts back compact results (transferable index permutations, or serialized row trees when grouping is active). While a recomputation is in flight the table keeps rendering its previous rows, then updates when the result lands.

## When To Consider It

- The full dataset lives on the client (local-first apps, offline caches, analytics grids) and cannot be processed on a server.
- Row count times comparator cost exceeds a frame budget: roughly 100k+ rows for basic sorts, or fewer with expensive custom filter/sort functions.
- The UI must stay interactive during recomputation (filter-as-you-type, virtualized scrolling, animations).

If your data is server-paginated, or client-side processing finishes in a few milliseconds, this plugin only adds complexity.

## Quick Start

Three pieces are required. First, a shared module that both threads import. Everything in it must be thread-portable: `accessorKey` columns (or accessors defined in the module), functions from the `sortFns`/`filterFns`/`aggregationFns` registries, and no closures over app state.

```ts
// tableConfig.ts (imported by BOTH the app and the worker)
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'
import { workerRowModelsFeature } from '@tanstack/react-table/experimental-worker-plugin'

export const sharedFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  workerRowModelsFeature,
  // these sync row models run inside the worker's shadow table
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(), // pagination stays on main
  sortFns,
  filterFns,
})

const columnHelper = createColumnHelper<typeof sharedFeatures, Person>()
export const columns = columnHelper.columns([
  /* accessorKey columns, named fns, custom fns declared in this module */
])
```

Second, a worker entry file. This is the entire worker:

```ts
// table.worker.ts
import { initTableWorker } from '@tanstack/react-table/experimental-worker-plugin'
import { columns, sharedFeatures } from './tableConfig'

initTableWorker({ features: sharedFeatures, columns })
```

Third, swap the offloaded stages for worker-backed ones in your app. The `new Worker(new URL(...))` expression must live in your code so your bundler can discover and bundle the worker file:

```ts
// App.tsx
import {
  createTableWorker,
  createWorkerRowModel,
} from '@tanstack/react-table/experimental-worker-plugin'
import { columns, sharedFeatures } from './tableConfig'

const tableWorker = createTableWorker({
  createWorker: () =>
    new Worker(new URL('./table.worker.ts', import.meta.url), {
      type: 'module',
    }),
})

const features: typeof sharedFeatures = {
  ...sharedFeatures,
  filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
  sortedRowModel: createWorkerRowModel(tableWorker, 'sorted'),
}

// then a completely normal table:
const table = useTable({ features, columns, data })
```

Read `table.state.workerRowModels.isPending` for a loading indicator; `lastComputeMs` and `lastRoundTripMs` on the same slice expose timings. When results arrive, re-renders flow through the standard table state mechanism.

The plugin entry is available from every framework adapter (`@tanstack/react-table/experimental-worker-plugin`, `@tanstack/vue-table/experimental-worker-plugin`, and so on) as well as `@tanstack/table-core/experimental-worker-plugin`, and it is fully tree-shakable: apps that never import it ship none of it.

## Offloadable Stages and Composition

`createWorkerRowModel(tableWorker, stage)` accepts `'filtered'`, `'grouped'`, `'sorted'`, or `'expanded'`. All stages on a table share one worker and one round trip per state change, and stages whose inputs did not change are skipped entirely.

Offloaded stages must form a contiguous prefix of the pipeline (filtered, then grouped, then sorted, then expanded). Offloading `filtered` alone is fine because downstream sync stages consume it normally, but offloading `sorted` while filtering runs on the main thread would silently bypass the filter. A dev-mode warning fires on mismatches. In practice: offload `expanded` never (it changes on every toggle), and keep pagination on the main thread (it only slices the current page).

## Constraints and Behavior

- **Flat source data only** for now (no `getSubRows`).
- **Table options that affect processing** (a custom `globalFilterFn`, for example) must be passed to `initTableWorker` in the shared config, not just to your table hook.
- **Grouping aggregates** require both `aggregationFeature` and `columnGroupingFeature` in the shared feature set. They are computed eagerly in the worker, but only for columns with an explicit `aggregationFn` or `aggregatedCell`; group-row `getValue()` for other columns returns `undefined`.
- **Multiple aggregation results** are transferred as keyed objects. Custom aggregation results must be supported by the browser's structured-clone algorithm.
- **Grand totals and caller-selected row totals** from `column.getAggregationValue(rows?)` run on the main thread. The worker currently offloads row-model stages, not arbitrary aggregation requests.
- **SSR** works out of the box: on the server (no `Worker` global) the table renders unprocessed rows, and the client takes over after hydration.
- **If the worker fails** to load or throws, the plugin logs an error, keeps the last results on screen, and stops updating; un-resulted stages fall back to their pre-stage models.
- **Nothing terminates the worker automatically** yet. `tableWorker.terminate()` exists as a manual escape hatch and self-heals on the next read.
- Row selection, expansion, and pagination are main-thread state and unaffected by the plugin. Selection over very large groups still scales with row count on the main thread.

See the [Web Worker Row Models example](../framework/react/examples/web-worker-row-models) for a complete SSR app with sorting, filtering, grouping with aggregates, and row selection.
