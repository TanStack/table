---
name: custom-features
description: >
  Author a TanStack Table v9 feature plugin across every FeatureMap and API installation surface: state, options, column definitions, table, column, row, cell, header, row-model functions/caches, defaults, prototypes, and table/row/column instance data lifecycles. Load for initTableInstanceData, resetTableInstanceData, constructTableAPIs, or reusable behavior not covered by built-ins, meta, or option composition.
metadata:
  type: sub-skill
  library: '@tanstack/table-core'
  library_version: '9.0.0-beta.78'
requires: ['core', 'table-features', 'typescript']
sources:
  - 'TanStack/table:docs/framework/react/guide/custom-features.md'
  - 'TanStack/table:packages/table-core/src/types'
  - 'TanStack/table:packages/table-core/src/types/TableFeatures.ts'
  - 'TanStack/table:packages/table-core/src/utils.ts'
  - 'TanStack/table:packages/table-core/src/features'
  - 'TanStack/table:examples/react/custom-plugin'
---

This skill builds on `core`, `table-features`, and `typescript`. Prefer a built-in feature or typed `tableMeta`/`columnMeta` for application callbacks; create a feature only for reusable state or behavior that must augment Table objects.

## Extension Surface

Declaration-merge `Plugins` to register the feature key, then merge only the maps backed by runtime behavior:

| Feature map                                      | Contribution                              |
| ------------------------------------------------ | ----------------------------------------- |
| `TableState_FeatureMap`                          | State slices in options, atoms, and store |
| `TableOptions_FeatureMap<TFeatures, TData>`      | Table options and change callbacks        |
| `Table_FeatureMap<TFeatures, TData>`             | Public table APIs                         |
| `ColumnDef_FeatureMap<TFeatures, TData, TValue>` | Column-definition options                 |
| `Column_FeatureMap<TFeatures, TData>`            | Public column APIs/data                   |
| `Row_FeatureMap<TFeatures, TData>`               | Public row APIs/data                      |
| `Cell_FeatureMap`                                | Public cell APIs                          |
| `Header_FeatureMap`                              | Public header APIs                        |
| `RowModelFns_FeatureMap<TFeatures, TData>`       | Advanced `table._rowModelFns` registries  |
| `CachedRowModels_FeatureMap<TFeatures, TData>`   | Advanced `table._rowModels` cache getters |

`assignTableAPIs` installs singleton table methods. Use `assignPrototypeAPIs` inside `assignColumnPrototype`, `assignRowPrototype`, `assignCellPrototype`, or `assignHeaderPrototype` for shared object methods. Use `initColumnInstanceData` and `initRowInstanceData` only for per-instance fields.

Use `initTableInstanceData` for mutable, non-reactive data owned by one table. It runs once after options, state atoms, and the store exist, and every feature initialization finishes before any `constructTableAPIs` hook runs. Use `resetTableInstanceData` to clear transient instance data after internal atoms reset during `table.reset()`; it does not own state slices or externally controlled state. Keep `constructTableAPIs` exclusively for method assignment.

## Table Instance Lifecycle

```ts
import type { TableFeature } from '@tanstack/table-core'

interface InteractionData {
  _interactionHistory: Set<string>
}

const interactionData = (table: object): InteractionData =>
  table as unknown as InteractionData

export const interactionFeature: TableFeature = {
  initTableInstanceData: (table) => {
    interactionData(table)._interactionHistory = new Set()
  },
  resetTableInstanceData: (table) => {
    interactionData(table)._interactionHistory.clear()
  },
}
```

Initialization may allocate resources once while reset clears their transient contents. Do not rerun initialization during `table.reset()`.

## Complete Example

This single example shows every ordinary FeatureMap and API installation path. It names the two advanced row-model maps without enabling them because density does not own the row-model pipeline.

<!-- skill-snippet:check -->

```ts
import {
  assignPrototypeAPIs,
  assignTableAPIs,
  functionalUpdate,
  makeStateUpdater,
  tableFeatures,
  type CellData,
  type OnChangeFn,
  type RowData,
  type TableFeature,
  type TableFeatures,
  type Updater,
} from '@tanstack/table-core'

type Density = 'sm' | 'md'
interface DensityState {
  density: Density
}
interface DensityOptions {
  onDensityChange?: OnChangeFn<Density>
}
interface DensityColumnDef {
  enableDensity?: boolean
}
interface DensityAPI {
  getDensity: () => Density
}
interface DensityTable extends DensityAPI {
  setDensity: (updater: Updater<Density>) => void
}
interface DensityColumn extends DensityAPI {
  densityAtCreation?: Density
}
interface DensityRow extends DensityAPI {
  densityAtCreation?: Density
}
type DensityCell = DensityAPI
type DensityHeader = DensityAPI

declare module '@tanstack/table-core' {
  interface Plugins {
    densityFeature: TableFeature
  }
  interface TableState_FeatureMap {
    densityFeature: DensityState
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityFeature: DensityOptions
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityFeature: DensityTable
  }
  interface ColumnDef_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    densityFeature: DensityColumnDef
  }
  interface Column_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityFeature: DensityColumn
  }
  interface Row_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityFeature: DensityRow
  }
  interface Cell_FeatureMap {
    densityFeature: DensityCell
  }
  interface Header_FeatureMap {
    densityFeature: DensityHeader
  }

  // If this feature actually owned a row-model stage, it would also merge
  // RowModelFns_FeatureMap and CachedRowModels_FeatureMap here, then populate
  // table._rowModelFns/table._rowModels with matching runtime/cache wiring.
}

const readDensity = (table: unknown): Density =>
  (
    table as {
      atoms: { density: { get: () => Density } }
    }
  ).atoms.density.get()

export const densityFeature: TableFeature = {
  getInitialState: (state) => ({ density: 'md', ...state }),
  getDefaultTableOptions: (table) => ({
    onDensityChange: makeStateUpdater('density', table),
  }),
  constructTableAPIs: (table) => {
    assignTableAPIs('densityFeature', table, {
      table_getDensity: { fn: () => readDensity(table) },
      table_setDensity: {
        fn: (updater: Updater<Density>) =>
          (table.options as DensityOptions).onDensityChange?.((old) =>
            functionalUpdate(updater, old),
          ),
      },
    })
  },
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('densityFeature', prototype, table, {
      column_getDensity: { fn: (column) => readDensity(column.table) },
    })
  },
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('densityFeature', prototype, table, {
      row_getDensity: { fn: (row) => readDensity(row.table) },
    })
  },
  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs('densityFeature', prototype, table, {
      cell_getDensity: { fn: (cell) => readDensity(cell.table) },
    })
  },
  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs('densityFeature', prototype, table, {
      header_getDensity: { fn: (header) => readDensity(header.table) },
    })
  },
  initColumnInstanceData: (column) => {
    ;(column as unknown as DensityColumn).densityAtCreation = readDensity(
      column.table,
    )
  },
  initRowInstanceData: (row) => {
    ;(row as unknown as DensityRow).densityAtCreation = readDensity(row.table)
  },
}

export const features = tableFeatures({ densityFeature })
```

`getDefaultColumnDef` is also available for overridable column defaults; add it when the feature owns a real column-definition default. Do not add lifecycle hooks merely to fill the surface.

## Guardrails

- Keep the feature object and `tableFeatures({ densityFeature })` result stable.
- Match every declaration-merged API with runtime installation. Types alone do nothing.
- Preserve incoming state in `getInitialState`; put user state after defaults.
- Method keys use `table_`, `column_`, `row_`, `cell_`, or `header_`; the prefix is removed on installation.
- Table API `fn` receives declared arguments. Prototype API `fn` receives the current object first.
- Initialize table-owned mutable data in `initTableInstanceData`, not `constructTableAPIs`; all feature data is initialized before any table API is assigned.
- Clear transient table-owned data in `resetTableInstanceData`. Reset state slices through atoms/updaters, and do not expect this hook to reset externally controlled state.
- Add `memoDeps` only for a genuinely derived method. Prototype methods are shared and must not close over per-object mutable data.
- There are no `assignColumnAPIs`, `assignRowAPIs`, `assignCellAPIs`, or `assignHeaderAPIs`; use `assignPrototypeAPIs` in the matching hook.
- Do not mutate constructed instances ad hoc or use a feature for renderer-only callbacks that belong in meta.

## API Discovery

Inspect exported `*_FeatureMap` interfaces under `node_modules/@tanstack/table-core/dist/types/`, `TableFeature` in `types/TableFeatures.d.ts`, and `assignTableAPIs`/`assignPrototypeAPIs` in `utils.d.ts`. Copy lifecycle shapes—not domain behavior—from the nearest stock feature under `dist/features/`.
