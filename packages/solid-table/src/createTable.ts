import { constructTable } from '@tanstack/table-core'
import { createComputed, getOwner, mergeProps, untrack } from 'solid-js'
import { shallow, useSelector } from '@tanstack/solid-store'
import { FlexRender } from './FlexRender'
import type { Atom, ReadonlyAtom } from '@tanstack/solid-store'
import type { Accessor, JSX } from 'solid-js'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableReactivityBindings,
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

  const mergedOptions = mergeProps(tableOptions, {
    reactivity: solidReactivity(owner),
  }) as any

  const resolvedOptions = mergeProps(
    {
      mergeOptions: (
        defaultOptions: TableOptions<TFeatures, TData>,
        options: TableOptions<TFeatures, TData>,
      ) => {
        return mergeProps(defaultOptions, options)
      },
    },
    mergedOptions,
  ) as TableOptions<TFeatures, TData> & { reactivity: TableReactivityBindings }

  const table = constructTable(resolvedOptions) as SolidTable<
    TFeatures,
    TData,
    TSelected
  >

  createComputed(() => {
    const userState = tableOptions.state
    if (userState) {
      for (const key in userState) {
        void (userState as Record<string, unknown>)[key]
      }
    }

    untrack(() => {
      table.setOptions((prev) => {
        return mergeProps(prev, mergedOptions) as TableOptions<TFeatures, TData>
      })
    })
  })

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
