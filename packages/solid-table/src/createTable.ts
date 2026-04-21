import {
  constructReactivityFeature,
  constructTable,
} from '@tanstack/table-core'
import { createComputed, createSignal, mergeProps, untrack } from 'solid-js'
import { shallow, useSelector } from '@tanstack/solid-store'
import type { Atom, ReadonlyAtom } from '@tanstack/solid-store'
import type { Accessor, JSX } from 'solid-js'
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
   * Subscribe to the store (selector required) or a single slice atom (optional selector = whole atom).
   * Atom overload is listed first for JSX contextual typing.
   */
  Subscribe: {
    <TSubSelected, TAtomValue>(props: {
      atom: Atom<TAtomValue> | ReadonlyAtom<TAtomValue>
      selector?: (state: TAtomValue) => TSubSelected
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
  const [notifier, setNotifier] = createSignal<void>(void 0, { equals: false })

  const solidReactivityFeature = constructReactivityFeature({
    stateNotifier: () => notifier(),
    optionsNotifier: () => notifier(),
  })

  const mergedOptions = mergeProps(tableOptions, {
    _features: mergeProps(tableOptions._features, {
      solidReactivityFeature,
    }),
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
  ) as TableOptions<TFeatures, TData>

  const table = constructTable(resolvedOptions) as SolidTable<
    TFeatures,
    TData,
    TSelected
  >

  const allState = useSelector(table.store)
  const allOptions = useSelector(table.optionsStore)

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

  createComputed(() => {
    allState()
    allOptions()
    untrack(() => setNotifier(void 0))
  })

  table.Subscribe = function Subscribe(props: {
    atom?: Atom<unknown> | ReadonlyAtom<unknown>
    selector?: (state: unknown) => unknown
    children: ((state: Accessor<unknown>) => JSX.Element) | JSX.Element
  }) {
    const source = props.atom !== undefined ? props.atom : table.store
    const selectorFn =
      props.atom !== undefined ? props.selector : props.selector
    const selected = useSelector(
      source as never,
      selectorFn as ((s: unknown) => unknown) | undefined,
      { compare: shallow },
    )
    return typeof props.children === 'function'
      ? props.children(selected)
      : props.children
  } as SolidTable<TFeatures, TData, TSelected>['Subscribe']

  const state = useSelector(table.store, selector)

  return {
    ...table,
    state,
  } as SolidTable<TFeatures, TData, TSelected>
}
