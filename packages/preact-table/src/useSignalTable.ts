import { useEffect, useRef, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import { shallow } from '@tanstack/preact-store'
import { FlexRender } from './FlexRender'
import { signalReactivity } from './signalReactivity'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'

export type PreactSignalTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  /**
   * Convenience FlexRender component attached to the table instance for
   * rendering headers, cells, or footers with custom markup.
   *
   * @example
   * <table.FlexRender header={header} />
   * <table.FlexRender cell={cell} />
   * <table.FlexRender footer={footer} />
   */
  FlexRender: typeof FlexRender
}

/**
 * Compares two render's option objects so per-render object identity churn
 * does not invalidate the options signal (which would recompute every
 * option-dependent derivation and can ping-pong renders). Nested option
 * objects that are idiomatically re-created inline each render are compared
 * one level deep.
 */
function shallowEqualOptions(
  previous: Record<string, any>,
  next: Record<string, any>,
): boolean {
  if (previous === next) return true
  const previousKeys = Object.keys(previous)
  const nextKeys = Object.keys(next)
  if (previousKeys.length !== nextKeys.length) return false
  for (const key of previousKeys) {
    const previousValue = previous[key]
    const nextValue = next[key]
    if (previousValue === nextValue) continue
    if (
      (key === 'state' ||
        key === 'initialState' ||
        key === 'atoms' ||
        key === 'features') &&
      shallow(previousValue, nextValue)
    ) {
      continue
    }
    return false
  }
  return true
}

/**
 * Creates a Preact table instance backed by native Preact signals instead of
 * the React-style render/commit model used by `useTable`.
 *
 * Any component that calls table APIs during render (e.g.
 * `table.getRowModel()`, `row.getIsSelected()`) automatically subscribes to
 * exactly the state signals those APIs read — no selectors or subscription
 * components needed. Split UI into components to scope re-renders to the
 * state each piece actually reads; columnDef `header`/`cell` functions
 * rendered through `FlexRender` are already their own boundaries.
 *
 * Because options feed a signal, keep non-primitive options referentially
 * stable across renders (module scope, `useMemo`, or state) — inline object
 * and function options would otherwise invalidate option-dependent
 * derivations on every render. For external state, prefer signals wrapped
 * with `signalAtom` over the controlled `state` option.
 *
 * @example
 * ```tsx
 * const table = useSignalTable({
 *   features,
 *   columns,
 *   data: data.value,
 *   atoms: { sorting: signalAtom(sorting) },
 * })
 * ```
 */
export function useSignalTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableOptions: TableOptions<TFeatures, TData>,
): PreactSignalTable<TFeatures, TData> {
  const [{ table, reactivity }] = useState(() => {
    const reactivityBindings = signalReactivity()
    // Construction happens during the owning component's render, where signal
    // reads would auto-subscribe it; feature setup reads must stay untracked.
    const tableInstance = reactivityBindings.untrack(() =>
      constructTable<TFeatures, TData>({
        ...tableOptions,
        features: {
          coreReactivityFeature: reactivityBindings,
          ...tableOptions.features,
        },
      }),
    ) as unknown as PreactSignalTable<TFeatures, TData>

    tableInstance.FlexRender = FlexRender

    return { table: tableInstance, reactivity: reactivityBindings }
  })

  const previousOptionsRef = useRef(tableOptions)
  if (!shallowEqualOptions(previousOptionsRef.current, tableOptions)) {
    reactivity.batch(() => {
      reactivity.untrack(() => {
        ;(table as Table<TFeatures, TData>).setOptions((prev) => ({
          ...prev,
          ...tableOptions,
        }))
      })
    })
  }
  previousOptionsRef.current = tableOptions

  useEffect(() => () => reactivity.unmount?.(), [reactivity])

  return table
}
