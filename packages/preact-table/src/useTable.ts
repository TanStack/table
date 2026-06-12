import { useMemo, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import { shallow, useSelector } from '@tanstack/preact-store'
import { preactReactivity } from './reactivity'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
import type {
  CellData,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { ComponentChildren } from 'preact'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribePropsWithStore, SubscribeSource } from './Subscribe'

export type PreactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = Omit<Table<TFeatures, TData>, 'store'> & {
  /**
   * @deprecated Prefer `table.state` for render reads,
   * `table.atoms.<slice>.get()` for slice snapshots, or
   * `table.Subscribe` / `useSelector(table.store, selector)` for explicit
   * subscriptions. `table.store.state` is a current-value snapshot and is easy
   * to misuse in render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * A Preact HOC (Higher Order Component) that allows you to subscribe to the table state.
   *
   * Pass `source` to subscribe to a single atom or store (e.g. `table.atoms.rowSelection`
   * or `table.optionsStore`) instead of the full `table.store`.
   *
   * @example
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {({ rowSelection }) => (
   *     <tr key={row.id}>...</tr>
   *   )}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe source={table.atoms.rowSelection}>
   *   {(rowSelection) => <div>...</div>}
   * </table.Subscribe>
   *
   * @example
   * <table.Subscribe source={table.atoms.rowSelection} selector={(s) => s?.[row.id]}>
   *   {() => <tr key={row.id}>...</tr>}
   * </table.Subscribe>
   */
  /**
   * Overloads (source first, then store) so JSX contextual typing works for both modes.
   * Source without `selector` is separate so children infer `TSourceValue` (identity projection).
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: SubscribeSource<TSourceValue>
      selector?: undefined
      children: ((state: TSourceValue) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TSourceValue, TSubSelected>(props: {
      source: SubscribeSource<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: TSubSelected) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TSubSelected>(
      props: Omit<SubscribePropsWithStore<TFeatures, TSubSelected>, 'source'>,
    ): ComponentChildren
  }
  /**
   * A Preact component that renders headers, cells, or footers with custom markup.
   * Use this utility component instead of manually calling flexRender.
   */
  FlexRender: <TValue extends CellData = CellData>(
    props: FlexRenderProps<TFeatures, TData, TValue>,
  ) => ComponentChildren
  /**
   * The selected state of the table. This state may not match the structure of
   * the full table state because it is selected by the selector function that
   * you pass as the 2nd argument to `useTable`.
   */
  readonly state: Readonly<TSelected>
}

/**
 * Creates a Preact table instance backed by TanStack Store atoms.
 *
 * The optional selector projects from `table.store`; the selected value is
 * exposed on `table.state` and compared shallowly for Preact re-renders. Omit
 * the selector to subscribe to every registered table state slice, or pass a
 * narrower selector and use `table.Subscribe` lower in the tree for targeted
 * subscriptions.
 *
 * @example
 * ```tsx
 * const table = useTable(
 *   {
 *     features,
 *     columns,
 *     data,
 *   },
 *   (state) => ({ pagination: state.pagination }),
 * )
 *
 * table.state.pagination
 * ```
 */
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => TSelected,
): PreactTable<TFeatures, TData, TSelected> {
  const [table] = useState(() => {
    // Explicit type arguments skip generic inference from the spread object (a
    // type-check hot spot); the spread only adds the preact reactivity binding
    // to `features`.
    const tableInstance = constructTable<TFeatures, TData>({
      ...tableOptions,
      features: {
        coreReactivityFeature: preactReactivity(),
        ...tableOptions.features,
      },
    }) as unknown as PreactTable<TFeatures, TData, TSelected>

    tableInstance.Subscribe = ((props: any) => {
      const source = props.source ?? tableInstance.store

      return Subscribe({
        ...props,
        source,
      })
    }) as PreactTable<TFeatures, TData, TSelected>['Subscribe']

    tableInstance.FlexRender = FlexRender

    return tableInstance
  })

  // sync options on every render
  table.setOptions((prev) => ({
    ...prev,
    ...tableOptions,
  }))

  const state = useSelector(table.store, selector, { compare: shallow })

  return useMemo(
    () => ({
      ...table,
      options: tableOptions,
      state,
    }),
    [table, tableOptions, state],
  )
}
