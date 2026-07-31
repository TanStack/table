import { getCurrentScope, onScopeDispose, unref, watch } from 'vue'
import { constructTable } from '@tanstack/table-core'
import { flatMerge, mergeProxy } from './merge-proxy'
import { vueReactivity } from './reactivity'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'
import type { MaybeRef, VNode } from 'vue'

export type TableOptionsWithReactiveData<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  [K in keyof TableOptions<TFeatures, TData>]: K extends 'data'
    ? MaybeRef<ReadonlyArray<TData>>
    : MaybeRef<TableOptions<TFeatures, TData>[K]>
}

function getOptionsWithReactiveValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  const resolvedOptions = Object.create(
    Object.getPrototypeOf(options),
  ) as Record<PropertyKey, unknown>

  for (const key of Reflect.ownKeys(options)) {
    const descriptor = Reflect.getOwnPropertyDescriptor(options, key)
    const value = unref(Reflect.get(options, key, options))
    Object.defineProperty(resolvedOptions, key, {
      configurable: true,
      enumerable: descriptor?.enumerable ?? true,
      get() {
        return value
      },
    })
  }

  return mergeProxy(options, resolvedOptions)
}

function getReactiveOptionDeps<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptionsWithReactiveData<TFeatures, TData>) {
  return Reflect.ownKeys(options).map((key) =>
    unref(Reflect.get(options, key, options)),
  )
}

export type VueTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  /** Creates a reactive render boundary. The child function reads the table
   * atoms it needs, so Vue only tracks those atom reads.
   */
  Subscribe: (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => VNode | Array<VNode>
  }) => VNode | Array<VNode>
}

/**
 * Creates a Vue table instance backed by Vue-aware TanStack Store atoms.
 *
 * Table options may contain Vue refs or computed values. The adapter unwraps
 * those reactive inputs, watches them with synchronous flushing, and keeps the
 * table options in sync. Use `table.Subscribe` or native Vue computed values
 * around `table.atoms.<slice>.get()` for selected reactive reads.
 *
 * @example
 * ```ts
 * const table = useTable(
 *   {
 *     features,
 *     columns,
 *     data,
 *   },
 * )
 * ```
 */
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableOptions:
    | TableOptions<TFeatures, TData>
    | TableOptionsWithReactiveData<TFeatures, TData>,
): VueTable<TFeatures, TData> {
  const syncTableOptions = (
    table: Table<TFeatures, TData>,
    options: TableOptionsWithReactiveData<TFeatures, TData>,
  ) => {
    table.setOptions((prev) =>
      flatMerge(prev, getOptionsWithReactiveValues(options)),
    )
  }

  const reactivity = vueReactivity()

  const mergedOptions = mergeProxy(tableOptions, {
    features: {
      coreReactivityFeature: reactivity,
      ...(unref(tableOptions.features) ?? {}),
    },
  }) as TableOptionsWithReactiveData<TFeatures, TData>

  const resolvedOptions = mergeProxy(
    getOptionsWithReactiveValues(mergedOptions),
    {
      // Remove state and onStateChange - store handles it internally
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        newOptions: Partial<TableOptions<TFeatures, TData>>,
      ) => {
        return flatMerge(defaultOptions, newOptions)
      },
    },
  ) as TableOptions<TFeatures, TData>

  const coreTable = constructTable(resolvedOptions)
  const table = coreTable as unknown as VueTable<TFeatures, TData>

  if (getCurrentScope()) {
    onScopeDispose(() => reactivity.unmount?.())
  }

  watch(
    () => getReactiveOptionDeps(mergedOptions),
    () => {
      syncTableOptions(coreTable, mergedOptions)
    },
    { immediate: true },
  )

  watch(
    () => {
      const controlledState = unref(tableOptions.state) as
        | Record<string, unknown>
        | undefined
      const controlledAtoms = unref(tableOptions.atoms) as
        | Record<string, unknown>
        | undefined

      if (!controlledState) {
        return []
      }

      const controlledValues: Array<unknown> = []

      for (const key of Object.keys(table.initialState)) {
        if (!(key in controlledState) || controlledAtoms?.[key] !== undefined) {
          continue
        }

        // Reading only controlled state slices here lets Vue subscribe to
        // getters/computed values that are passed through `options.state`.
        controlledValues.push(controlledState[key])
      }

      return controlledValues
    },
    (controlledValues) => {
      if (controlledValues.length > 0) {
        syncTableOptions(coreTable, mergedOptions)
      }
    },
    { immediate: true },
  )

  table.Subscribe = (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => VNode | Array<VNode>
  }) => {
    return props.children(table.atoms as Table<TFeatures, TData>['atoms'])
  }

  return table
}
