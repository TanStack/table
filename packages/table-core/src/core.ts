import { functionalUpdate, RequiredKeys } from './utils'

import {
  Updater,
  TableOptions,
  TableState,
  TableInstance,
  Renderable,
  TableFeature,
  TableGenerics,
  InitialTableState,
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
  render: TGenerics['Renderer']
  debugAll?: boolean
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  debugRows?: boolean
  initialState?: InitialTableState
  autoResetAll?: boolean
  mergeOptions?: <T>(defaultOptions: T, options: Partial<T>) => T
  meta?: TGenerics['TableMeta']
}

export type TableCore<TGenerics extends TableGenerics> = {
  // generics: TGenerics
  initialState: TableState
  reset: () => void
  options: RequiredKeys<TableOptions<TGenerics>, 'state'>
  setOptions: (newOptions: Updater<TableOptions<TGenerics>>) => void
  queue: (cb: () => void) => void
  // willUpdate: () => void
  getState: () => TableState
  setState: (updater: Updater<TableState>) => void
  render: <TProps>(
    template: Renderable<TGenerics, TProps>,
    props: TProps
  ) => string | null | TGenerics['Rendered']
  getOverallProgress: () => number
  _features: readonly TableFeature[]
}

export function createTableInstance<TGenerics extends TableGenerics>(
  options: TableOptions<TGenerics>
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
  }, {}) as TableOptions<TGenerics>

  const mergeOptions = (options: TableOptions<TGenerics>) => {
    if (instance.options.mergeOptions) {
      return instance.options.mergeOptions(defaultOptions, options)
    }

    return {
      ...defaultOptions,
      ...options,
    }
  }

  instance.options = {
    ...defaultOptions,
    ...options,
  }

  const coreInitialState: CoreTableState = {
    coreProgress: 1,
  }

  const initialState = {
    ...coreInitialState,
    ...(options.initialState ?? {}),
    ...instance._features.reduce((obj, feature) => {
      return Object.assign(obj, feature.getInitialState?.(options.initialState))
    }, {}),
  } as TableState

  const queued: (() => void)[] = []
  let queuedTimeout = false

  const finalInstance: TableInstance<TGenerics> = {
    ...instance,
    ...(instance._features.reduce((obj, feature) => {
      return Object.assign(obj, feature.createInstance?.(instance))
    }, {}) as unknown as TableInstance<TGenerics>),
    queue: cb => {
      queued.push(cb)

      if (!queuedTimeout) {
        queuedTimeout = true

        // Schedule a microtask to run the queued callbacks after
        // the current call stack (render, etc) has finished.
        Promise.resolve()
          .then(() => {
            while (queued.length) {
              queued.shift()!()
            }
            queuedTimeout = false
          })
          .catch(error =>
            setTimeout(() => {
              throw error
            })
          )
      }
    },
    // willUpdate: () => {},
    initialState,
    reset: () => {
      instance.setState(instance.initialState)
    },
    setOptions: updater => {
      const newOptions = functionalUpdate(updater, instance.options)
      instance.options = mergeOptions(newOptions)
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
