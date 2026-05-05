import { constructTable } from '@tanstack/table-core'
import { createEffect, getOwner, merge, untrack } from 'solid-js'
import { shallow } from '@tanstack/store'
import { FlexRender } from './FlexRender'
import { solidReactivity } from './reactivity'
import { useSelector } from './useSelector'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { Accessor } from 'solid-js'
import type { JSX } from '@solidjs/web'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type SolidTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
  /**
   * Subscribe to the store (selector required) or a single source (atom or store).
   * Source **without** `selector` is a separate overload so children receive
   * `Accessor<TSourceValue>` (identity projection). Source overloads are listed first
   * for JSX contextual typing.
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector?: undefined
      children: ((state: Accessor<TSourceValue>) => JSX.Element) | JSX.Element
    }): JSX.Element
    <TSourceValue, TSubSelected>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: Accessor<TSubSelected>) => JSX.Element) | JSX.Element
    }): JSX.Element
    <TSubSelected>(props: {
      selector: (state: TableState<TFeatures>) => TSubSelected
      children: ((state: Accessor<TSubSelected>) => JSX.Element) | JSX.Element
    }): JSX.Element
  }
  /**
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `createTable`.
   *
   * @example
   * const table = createTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state().globalFilter)
   */
  readonly state: Accessor<Readonly<TSelected>>
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

export function createTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): SolidTable<TFeatures, TData, TSelected> {
  const owner = getOwner()!

  const mergedOptions = merge(tableOptions, {
    _features: {
      coreReativityFeature: solidReactivity(owner),
      ...tableOptions._features,
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

  const table = constructTable(resolvedOptions) as SolidTable<
    TFeatures,
    TData,
    TSelected
  >

  createEffect(
    () => {
      const userState = tableOptions.state
      if (userState) {
        for (const key in userState) {
          void (userState as Record<string, unknown>)[key]
        }
      }
    },
    () => {
      untrack(() => {
        table.setOptions((prev) => {
          return merge(prev, mergedOptions) as TableOptions<TFeatures, TData>
        })
      })
    },
  )

  table.Subscribe = ((props: {
    source?: Atom<unknown> | ReadonlyAtom<unknown>
    selector?: ((state: unknown) => unknown) | undefined
    children: ((state: Accessor<unknown>) => JSX.Element) | JSX.Element
  }) => {
    const source = props.source !== undefined ? props.source : table.store
    const selectFn =
      props.source !== undefined
        ? (props.selector ?? ((x: unknown) => x))
        : props.selector
    const selected = useSelector(source as never, selectFn, {
      compare: shallow,
    })
    return typeof props.children === 'function'
      ? props.children(selected)
      : props.children
  }) as SolidTable<TFeatures, TData, TSelected>['Subscribe']

  const state = useSelector(table.store, selector)

  table.FlexRender = FlexRender

  return {
    ...table,
    state,
  }
}
