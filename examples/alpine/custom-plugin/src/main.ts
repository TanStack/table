import Alpine from 'alpinejs'
import {
  FlexRender,
  assignTableAPIs,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFn_inNumberRange,
  filterFn_includesString,
  functionalUpdate,
  makeStateUpdater,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type {
  Column,
  OnChangeFn,
  RowData,
  TableFeature,
  TableFeatures,
  Updater,
} from '@tanstack/alpine-table'
import type { Person } from './makeData'

// TypeScript setup for our new feature with all of the same type-safety as stock TanStack Table features

// define types for our new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg'
export interface TableState_Density {
  density: DensityState
}

// define types for our new feature's table options
export interface TableOptions_Density {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// Define types for our new feature's table APIs
export interface Table_Density {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}

declare module '@tanstack/alpine-table' {
  interface Plugins {
    densityPlugin: TableFeature
  }

  interface TableState_FeatureMap {
    densityPlugin: TableState_Density
  }

  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: TableOptions_Density
  }

  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    densityPlugin: Table_Density
  }
}

// Here is all of the actual javascript code for our new feature
export const densityPlugin: TableFeature = {
  // define the new feature's initial state
  getInitialState: (initialState) => {
    return {
      density: 'md',
      ...initialState, // must come last
    }
  },

  // define the new feature's default options
  getDefaultTableOptions: (table) => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    }
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: () => {},

  // define the new feature's table instance methods
  constructTableAPIs: (table) => {
    assignTableAPIs('densityPlugin', table, {
      table_setDensity: {
        fn: (updater: Updater<DensityState>) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            const newState = functionalUpdate(updater, old)
            return newState
          }
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          )
        },
      },
      table_toggleDensity: {
        fn: (value?: DensityState) => {
          const safeUpdater: Updater<DensityState> = (old) => {
            if (value) return value
            return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // cycle through the 3 options
          }
          return (table.options as TableOptions_Density).onDensityChange?.(
            safeUpdater,
          )
        },
      },
    })
  },
}
// end of custom feature code

// app code
const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  densityPlugin, // pass in our plugin just like any other stock feature
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => '<span>Visits</span>',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
])

type PersonColumn = Column<typeof features, Person>

Alpine.data('table', () => {
  // The density state is owned externally (in Alpine-reactive state) and passed
  // back into the table via the `state` option + `onDensityChange` handler that
  // our custom feature exposes.
  const local = Alpine.reactive({
    data: makeData(1_000),
    density: 'md',
  }) as { data: Array<Person>; density: DensityState }

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    debugTable: true,
    state: {
      // passing the density state to the table, TS is still happy :)
      get density() {
        return local.density
      },
    },
    onDensityChange: (updater) => {
      // raise density state changes to our own state management
      local.density =
        typeof updater === 'function' ? updater(local.density) : updater
    },
  })

  return {
    table,
    FlexRender,
    // padding driven by our custom density feature
    densityPadding() {
      return local.density === 'sm'
        ? '4px'
        : local.density === 'md'
          ? '8px'
          : '16px'
    },
    // pick the indicator for a column's current sort direction
    sortIndicator(isSorted: false | 'asc' | 'desc') {
      return { asc: ' 🔼', desc: ' 🔽' }[isSorted as string] ?? ''
    },
    // the demo filters numeric columns with a min/max range, others with text
    isNumberColumn(column: PersonColumn) {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)
      return typeof firstValue === 'number'
    },
    setTextFilter(column: PersonColumn, value: string) {
      column.setFilterValue(value)
    },
    rangeValue(column: PersonColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    setRangeMin(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        value,
        old?.[1],
      ])
    },
    setRangeMax(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        old?.[0],
        value,
      ])
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    setPageSize(value: string) {
      table.setPageSize(Number(value))
    },
    refreshData() {
      local.data = makeData(1_000)
    },
    stressTest() {
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
