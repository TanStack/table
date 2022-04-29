import { functionalUpdate, propGetter, RequiredKeys } from './utils'

import {
  Updater,
  Options,
  TableState,
  ColumnDef,
  TableProps,
  TableBodyProps,
  PropGetter,
  TableInstance,
  Renderable,
  UseRenderer,
  TableFeature,
  TableGenerics,
} from './types'

import { Columns } from './features/Columns'
import { Rows } from './features/Rows'
import { Cells } from './features/Cells'
import { ColumnSizing } from './features/ColumnSizing'
import { Expanding } from './features/Expanding'
import { Filters } from './features/Filters'
import { Grouping } from './features/Grouping'
import { Ordering } from './features/Ordering'
import { Pagination } from './features/Pagination'
import { Pinning } from './features/Pinning'
import { RowSelection } from './features/RowSelection'
import { Sorting } from './features/Sorting'
import { Visibility } from './features/Visibility'
import { Headers } from './features/Headers'
//
import { mean } from './aggregationFns'

export type CoreTableState = {
  coreProgress: number
}

export type CoreOptions<TGenerics extends TableGenerics> = {
  data: TGenerics['Row'][]
  state: Partial<TableState>
  onStateChange: (updater: Updater<TableState>) => void
  render: TGenerics['Render']
  debugAll?: boolean
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  debugRows?: boolean
  initialState?: Partial<TableState>
  autoResetAll?: boolean
  mergeOptions?: (
    defaultOptions: TableFeature,
    options: Partial<Options<TGenerics>>
  ) => Options<TGenerics>
  meta?: TGenerics['TableMeta']
}

export type TableCore<TGenerics extends TableGenerics> = {
  initialState: TableState
  reset: () => void
  options: RequiredKeys<Options<TGenerics>, 'state'>
  setOptions: (newOptions: Updater<Options<TGenerics>>) => void
  queue: (cb: () => void) => void
  willUpdate: () => void
  getState: () => TableState
  setState: (updater: Updater<TableState>) => void
  getTableProps: PropGetter<TableProps>
  getTableBodyProps: PropGetter<TableBodyProps>
  render: <TProps>(
    template: Renderable<TGenerics, TProps>,
    props: TProps
  ) => string | null | ReturnType<UseRenderer<TGenerics>>
  getOverallProgress: () => number
  _features: readonly TableFeature[]
}

export function createTableInstance<TGenerics extends TableGenerics>(
  options: Options<TGenerics>
): TableInstance<TGenerics> {
  if (options.debugAll || options.debugTable) {
    console.info('Creating Table Instance...')
  }

  let instance = {} as TableInstance<TGenerics>

  instance._features = [
    Columns,
    Rows,
    Cells,
    Headers,
    Visibility,
    Ordering,
    Pinning,
    Filters,
    Sorting,
    Grouping,
    Expanding,
    Pagination,
    RowSelection,
    ColumnSizing,
  ] as const

  const defaultOptions = instance._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(instance))
  }, {})

  const buildOptions = (options: Options<TGenerics>) => ({
    ...defaultOptions,
    ...options,
  })

  instance.options = buildOptions(options)

  const coreInitialState: CoreTableState = {
    coreProgress: 1,
  }

  const initialState = {
    ...coreInitialState,
    ...instance._features.reduce((obj, feature) => {
      return Object.assign(obj, feature.getInitialState?.())
    }, {}),
    ...(options.initialState ?? {}),
  } as TableState

  const queued: (() => void)[] = []
  let queuedTimeout: NodeJS.Timeout

  const finalInstance: TableInstance<TGenerics> = {
    ...instance,
    ...(instance._features.reduce((obj, feature) => {
      return Object.assign(obj, feature.createInstance?.(instance))
    }, {}) as unknown as TableInstance<TGenerics>),
    queue: cb => {
      queued.push(cb)
      if (!queuedTimeout) {
        queuedTimeout = setTimeout(() => {
          instance.setState(old => ({ ...old }))
        })
      }
    },
    willUpdate: () => {
      clearTimeout(queuedTimeout)
      while (queued.length) {
        queued.shift()!()
      }
    },
    initialState,
    reset: () => {
      instance.setState(instance.initialState)
    },
    setOptions: updater => {
      const newOptions = functionalUpdate(updater, instance.options)
      if (instance.options.mergeOptions) {
        instance.options = instance.options.mergeOptions(
          defaultOptions,
          newOptions
        )
      } else {
        instance.options = buildOptions(newOptions)
      }
    },
    render: (template, props) => {
      if (typeof instance.options.render === 'function') {
        return instance.options.render(template, props)
      }

      if (typeof template === 'function') {
        return (template as Function)(props)
      }

      return template
    },

    getState: () => {
      return instance.options.state as TableState
    },

    setState: (updater: Updater<TableState>) => {
      instance.options.onStateChange?.(updater)
    },

    getTableProps: userProps => {
      return propGetter(
        {
          role: 'table',
        },
        userProps
      )
    },

    getTableBodyProps: userProps => {
      return propGetter(
        {
          role: 'rowgroup',
        },
        userProps
      )
    },

    getOverallProgress: () => {
      const { coreProgress, columnFiltersProgress, globalFilterProgress } =
        instance.getState()

      return mean(() =>
        [coreProgress, columnFiltersProgress, globalFilterProgress].filter(
          d => d < 1
        )
      ) as number
    },
  }

  instance = Object.assign(instance, finalInstance)

  return instance
}
