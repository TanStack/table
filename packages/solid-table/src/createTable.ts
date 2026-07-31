import { constructTable } from '@tanstack/table-core'
import { createComputed, getOwner, onCleanup, untrack } from 'solid-js'
import { FlexRender } from './FlexRender'
import { mergeOptionSources } from './merge-options'
import { solidReactivity } from './reactivity'
import type { JSX } from 'solid-js'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export type SolidTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  /**
   * Creates a reactive render boundary. The child function reads the table
   * atoms it needs, so Solid only tracks those atom reads.
   */
  Subscribe: (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => JSX.Element
  }) => JSX.Element
  /**
   * Convenience FlexRender component attached to the table instance for
   * rendering headers, cells, or footers with custom markup. Mirrors the
   * `table.FlexRender` API exposed by `createTableHook`'s `createAppTable`.
   *
   * @example
   * <table.FlexRender header={header} />
   * <table.FlexRender cell={cell} />
   * <table.FlexRender footer={footer} />
   */
  FlexRender: typeof FlexRender
}

/**
 * Creates a Solid table instance backed by Solid-aware TanStack Store atoms.
 *
 * Table APIs and atom reads participate in Solid dependency tracking, so
 * computations that read a specific slice can update without invalidating
 * unrelated UI. Use `table.Subscribe` to create atom-tracked render boundaries.
 *
 * @example
 * ```tsx
 * const table = createTable(
 *   {
 *     features,
 *     columns,
 *     data,
 *   },
 * )
 * ```
 */
export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(tableOptions: TableOptions<TFeatures, TData>): SolidTable<TFeatures, TData> {
  const owner = getOwner()!
  const reactivity = solidReactivity(owner)

  const mergedOptions = mergeOptionSources(tableOptions, {
    features: {
      coreReactivityFeature: reactivity,
      ...tableOptions.features,
    },
  }) as any

  const resolvedOptions = mergeOptionSources(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        options: TableOptions<TFeatures, TData>,
      ) => {
        return mergeOptionSources(defaultOptions, options)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData>

  const table = constructTable(resolvedOptions) as unknown as SolidTable<
    TFeatures,
    TData
  >

  createComputed(() => {
    // Option atoms store resolved values. Touch every current option while
    // tracked so a signal-backed getter re-runs this synchronization.
    for (const key of Reflect.ownKeys(mergedOptions)) {
      void Reflect.get(mergedOptions, key, mergedOptions)
    }

    const userState = tableOptions.state
    if (userState) {
      for (const key in userState) {
        void (userState as Record<string, unknown>)[key]
      }
    }

    untrack(() => {
      table.setOptions(() => mergedOptions as TableOptions<TFeatures, TData>)
    })
  })

  onCleanup(() => reactivity.unmount?.())

  table.Subscribe = (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => JSX.Element
  }) => {
    return props.children(table.atoms as Table<TFeatures, TData>['atoms'])
  }

  table.FlexRender = FlexRender

  return table
}
