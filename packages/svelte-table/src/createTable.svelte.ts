import { constructTable } from '@tanstack/table-core'
import type {
  NoInfer,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import { useStore } from '@tanstack/svelte-store'
import type { Snippet } from 'svelte'

export type SvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * A Svelte component that allows you to subscribe to the table state.
   *
   * This is useful for opting into state subscriptions for specific parts of the table state.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {(state) => (
   *     <tr>
   *       // render the row
   *     </tr>
   *   )}
   * </table.Subscribe>
   */
  Subscribe: <TSelected>(props: {
    selector: (state: NoInfer<TableState<TFeatures>>) => TSelected
    children: ((state: Readonly<TSelected>) => Snippet) | Snippet
  }) => any
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.
   *
   * @example
   * const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected>
}

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): SvelteTable<TFeatures, TData, TSelected> {
  const statefulOptions: TableOptions<TFeatures, TData> = mergeObjects(
    tableOptions,
    {
      // Remove state and onStateChange - store handles it internally
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return mergeObjects(defaultOptions, newOptions)
      },
    },
  )

  const table = constructTable(statefulOptions) as SvelteTable<
    TFeatures,
    TData,
    TSelected
  >

  function updateOptions() {
    table.setOptions((prev) => {
      return mergeObjects(prev, tableOptions)
    })
  }

  updateOptions()

  /**
   * Temp force reactivity to all state changes on every table.get* method
   */
  const allState = useStore(table.store, (state) => state)

  // Wrap all "get*" methods to make them reactive
  // Access allState.current directly to create reactive dependency
  Object.keys(table).forEach((key) => {
    const value = (table as any)[key]
    if (typeof value === 'function' && key.startsWith('get')) {
      const originalMethod = value.bind(table)
      ;(table as any)[key] = (...args: any[]) => {
        // Access state to create reactive dependency
        allState.current
        return originalMethod(...args)
      }
    }
  })

  table.Subscribe = function Subscribe<TSelected>(props: {
    selector: (state: TableState<TFeatures>) => TSelected
    children: ((state: Readonly<TSelected>) => Snippet) | Snippet
  }): any {
    const selected = useStore(table.store, props.selector)
    if (typeof props.children === 'function') {
      return props.children(selected.current)
    }
    return props.children
  }

  const stateStore = useStore(table.store, selector)

  return {
    ...table,
    get state() {
      return stateStore.current
    },
  } as SvelteTable<TFeatures, TData, TSelected>
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
