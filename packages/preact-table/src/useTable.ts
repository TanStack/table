import { useEffect, useMemo, useState } from 'preact/hooks'
import { constructTable } from '@tanstack/table-core'
import { shallow, useSelector } from '@tanstack/preact-store'
import { constructReactivityBindings } from '@tanstack/table-core/reactivity'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
// import { preactReactivity } from './reactivity'
import type {
  CellData,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Atom, ReadonlyAtom } from '@tanstack/preact-store'
import type { ComponentChildren } from 'preact'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribePropsWithStore } from './Subscribe'

export type PreactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
> = Table<TFeatures, TData> & {
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
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector?: undefined
      children: ((state: TSourceValue) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TSourceValue, TSubSelected>(props: {
      source: Atom<TSourceValue> | ReadonlyAtom<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: TSubSelected) => ComponentChildren) | ComponentChildren
    }): ComponentChildren
    <TSubSelected>(
      props: Omit<
        SubscribePropsWithStore<TFeatures, TData, TSubSelected>,
        'table'
      >,
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
   * The selected state of the table. This state may not match the structure of `table.store.state` because it is selected by the `selector` function that you pass as the 2nd argument to `useTable`.
   */
  readonly state: Readonly<TSelected> & {
    columns: TableOptions<TFeatures, TData>['columns']
    data: TableOptions<TFeatures, TData>['data']
  }
}

export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = {},
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector: (state: TableState<TFeatures>) => TSelected = () =>
    ({}) as TSelected,
): PreactTable<TFeatures, TData, TSelected> {
  const [table] = useState(() => {
    const tableInstance = constructTable({
      ...tableOptions,
      _features: {
        coreReativityFeature: constructReactivityBindings(), // preactReactivity() currently causes infinite re-renders
        ...tableOptions._features,
      },
    }) as PreactTable<TFeatures, TData, TSelected>

    tableInstance.Subscribe = ((props: any) => {
      return Subscribe({
        ...props,
        table: tableInstance,
      })
    }) as PreactTable<TFeatures, TData, TSelected>['Subscribe']

    tableInstance.FlexRender = FlexRender

    return tableInstance
  })

  useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      ...tableOptions,
    }))
  }, [table, tableOptions])

  const state = useSelector(table.store, selector, { compare: shallow })
  const options = useSelector(table.optionsStore, (options) => options, {
    compare: shallow,
  })

  return useMemo(
    () => ({
      ...table,
      options,
      state,
    }),
    [table, options, state],
  ) as PreactTable<TFeatures, TData, TSelected>
}
