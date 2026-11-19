import { constructTable } from '@tanstack/table-core'
import { table_syncExternalStateToBaseAtoms } from '@tanstack/table-core/static-functions'
import {
  $PROXY,
  createMemo,
  createRenderEffect,
  getOwner,
  merge,
  onCleanup,
  runWithOwner,
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

  // Built in a memo, so construction waits under `Loading` while an option it
  // reads is still loading, instead of throwing. The memo first reads those
  // options (tracked, so it re-runs when they resolve), then builds under the
  // component's owner, so the atoms and memos construction creates outlive
  // the memo. Once built it returns the table without reading anything.
  let built: SolidTable<TFeatures, TData> | undefined
  const instance = createMemo(() => {
    if (built) return built
    // Every option but `data`, which construction doesn't read (row models
    // read it later, in their own tracked scopes).
    const { data: _data, ...options } = tableOptions
    for (const slices of [options.state, options.initialState, options.atoms])
      if (slices) ({ ...slices })
    return (built = runWithOwner(
      owner,
      () =>
        constructTable(resolvedOptions) as unknown as SolidTable<
          TFeatures,
          TData
        >,
    ))
  })

  // The table forwards to the built instance. Once built (synchronously,
  // unless an option was loading) it is read directly; before that a read goes
  // through the memo, so it waits like any other pending value.
  const current = () => built ?? instance()

  // Keep the table's base atoms in step with controlled `state`. The state
  // atoms already read controlled values through the merged options proxy,
  // so this doesn't rewrite the options, which would make every row model
  // recompute a second time.
  createRenderEffect(
    // A fresh snapshot each run, so a change to any slice reaches the apply.
    () =>
      [
        current(),
        tableOptions.state ? { ...tableOptions.state } : undefined,
      ] as const,
    ([current, state]) => {
      table_syncExternalStateToBaseAtoms(current as never, state ?? null)
    },
  )

  onCleanup(() => reactivity.unmount?.())

  // The table's own components, which `<table.Subscribe>` reads in a
  // component body, so they don't need the built table until they render.
  const components: Record<PropertyKey, unknown> = {
    Subscribe: (props: {
      children: (atoms: Table<TFeatures, TData>['atoms']) => Element
    }) =>
      built
        ? props.children(built.atoms as Table<TFeatures, TData>['atoms'])
        : () =>
            props.children(current().atoms as Table<TFeatures, TData>['atoms']),
    FlexRender,
  }
  const target = (key: PropertyKey) =>
    key in components ? components : current()
  const table = new Proxy(components, {
    // Solid checks whether a computed value is a promise or an async iterable
    // with an untracked read, which gives no table while it is pending.
    get: (_, key) => {
      const owner = target(key) as object | undefined
      return owner && Reflect.get(owner, key)
    },
    set: (_, key, value) => Reflect.set(target(key), key, value),
    has: (_, key) => {
      const owner = target(key) as object | undefined
      return !!owner && key in owner
    },
    ownKeys: () => [
      ...new Set([
        ...Reflect.ownKeys(current()),
        ...Reflect.ownKeys(components),
      ]),
    ],
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(target(key), key)
      if (descriptor) descriptor.configurable = true
      return descriptor
    },
  }) as unknown as SolidTable<TFeatures, TData>

  return table
}
