import {
  constructTable,
  coreFeatures,
  getInitialTableState,
} from '@tanstack/table-core'
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>) {
  const _features = { ...coreFeatures, ...tableOptions._features }

  let state = $state<Partial<TableState<TFeatures>>>(
    getInitialTableState(_features, tableOptions.initialState),
  )

  const statefulOptions: TableOptions<TFeatures, TData> = mergeObjects(
    tableOptions,
    {
      _features,
      state: { ...state, ...tableOptions.state },
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return mergeObjects(defaultOptions, newOptions)
      },
    },
  )

  const table = constructTable(statefulOptions)

  function updateOptions() {
    table.setOptions((prev) => {
      return mergeObjects(prev, tableOptions, {
        state: mergeObjects(state, tableOptions.state || {}),
        onStateChange: (updater: any) => {
          if (updater instanceof Function) state = updater(state)
          else state = mergeObjects(state, updater)

          tableOptions.onStateChange?.(updater)
        },
      })
    })
  }

  updateOptions()

  $effect.pre(() => {
    updateOptions() // re-render the table whenever the state or options change
  })

  return table
}

/**
 * Merges objects together while keeping their getters alive.
 * Taken from SolidJS: {https://github.com/solidjs/solid/blob/24abc825c0996fd2bc8c1de1491efe9a7e743aff/packages/solid/src/server/rendering.ts#L82-L115}
 * */
function mergeObjects<T>(source: T): T
function mergeObjects<T, U>(source: T, source1: U): T & U
function mergeObjects<T, U, V>(source: T, source1: U, source2: V): T & U & V
function mergeObjects<T, U, V, W>(
  source: T,
  source1: U,
  source2: V,
  source3: W,
): T & U & V & W
function mergeObjects(...sources: any): any {
  const target = {}
  for (let source of sources) {
    if (typeof source === 'function') source = source()
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source)
      for (const key in descriptors) {
        if (key in target) continue
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let v,
                s = sources[i]
              if (typeof s === 'function') s = s()
              // eslint-disable-next-line prefer-const
              v = (s || {})[key]
              if (v !== undefined) return v
            }
          },
        })
      }
    }
  }
  return target
}
