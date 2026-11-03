import { constructTable } from '@tanstack/table-core'
import { table_syncExternalStateToBaseAtoms } from '@tanstack/table-core/static-functions'
import {
  $PROXY,
  createMemo,
  createRenderEffect,
  getOwner,
  merge,
  onCleanup,
  untrack,
} from 'solid-js'
import { FlexRender } from './FlexRender'
import { solidReactivity } from './reactivity'
import type { Element } from 'solid-js'
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
   * @deprecated Read table APIs or `table.atoms` directly inside JSX,
   * `createMemo`, or `createEffect`. Solid tracks those reads natively.
   * This compatibility wrapper only passes atoms to its child function;
   * it does not create a subscription or tracking scope.
   */
  Subscribe: (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => Element
  }) => Element
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
 * unrelated UI. Read table APIs or atoms inside JSX, `createMemo`, or
 * `createEffect` to track updates.
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

  // A Solid store keeps its identity when it changes in place, like the data
  // of a Solid Query query, but table-core memoizes row models by reference.
  // So a store array is passed on as a fresh copy each time its items change.
  const data = createMemo(() => {
    const value = tableOptions.data as any
    return value?.[$PROXY] ? [...value] : value
  })

  const mergedOptions = merge(tableOptions, {
    get data() {
      return data()
    },
    features: {
      coreReactivityFeature: reactivity,
      ...tableOptions.features,
    },
  }) as any

  const resolvedOptions = merge(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        options: TableOptions<TFeatures, TData>,
      ) => {
        return merge(defaultOptions, options)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData>

  // Construction reads options and state once; the atoms and memos it creates
  // do the tracking from then on.
  const table = untrack(() =>
    constructTable(resolvedOptions),
  ) as unknown as SolidTable<TFeatures, TData>

  // Keep the table's base atoms in step with controlled `state`. The state
  // atoms already read controlled values through the merged options proxy,
  // so this doesn't rewrite the options, which would make every row model
  // recompute a second time.
  createRenderEffect(
    // A fresh snapshot each run, so a change to any slice reaches the apply.
    () => (tableOptions.state ? { ...tableOptions.state } : undefined),
    (state) => {
      untrack(() =>
        table_syncExternalStateToBaseAtoms(table as never, state ?? null),
      )
    },
  )

  onCleanup(() => reactivity.unmount?.())

  table.Subscribe = (props: {
    children: (atoms: Table<TFeatures, TData>['atoms']) => Element
  }) => {
    return props.children(table.atoms as Table<TFeatures, TData>['atoms'])
  }

  table.FlexRender = FlexRender

  return table
}
