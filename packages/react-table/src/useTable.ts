'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { constructTable } from '@tanstack/table-core'
import { createCommitFilteredSource } from '@tanstack/table-core/reactivity'
import {
  table_setOptions,
  table_syncExternalStateToBaseAtoms,
} from '@tanstack/table-core/static-functions'
import { shallow, useSelector } from '@tanstack/react-store'
import { reactReactivity } from './reactivity'
import { FlexRender } from './FlexRender'
import { Subscribe } from './Subscribe'
import type { FlexRenderProps } from './FlexRender'
import type { SubscribePropsWithStore, SubscribeSource } from './Subscribe'
import type {
  CellData,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { FunctionComponent, ReactNode } from 'react'

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export type ReactTable<
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
   * A React HOC (Higher Order Component) that allows you to subscribe to the table state.
   *
   * This is useful for opting into state re-renders for specific parts of the table state.
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
   * Overloads (not a single union) so `selector` callbacks get correct contextual
   * types in JSX; a union of two `selector` signatures degrades to implicit `any`.
   *
   * Source **without** `selector` is a separate overload so children receive `TSourceValue`
   * (identity projection). If `selector` were optional on one overload, `TSubSelected`
   * would default to `unknown` instead of inferring from the source.
   *
   * The **source** overloads are listed first so `TSourceValue` is inferred from `source`.
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: SubscribeSource<TSourceValue>
      selector?: undefined
      children: ((state: TSourceValue) => ReactNode) | ReactNode
    }): ReturnType<FunctionComponent>
    <TSourceValue, TSubSelected>(props: {
      source: SubscribeSource<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: TSubSelected) => ReactNode) | ReactNode
    }): ReturnType<FunctionComponent>
    <TSubSelected>(
      props: Omit<SubscribePropsWithStore<TFeatures, TSubSelected>, 'source'>,
    ): ReturnType<FunctionComponent>
  }
  /**
   * A React component that renders headers, cells, or footers with custom markup.
   * Use this utility component instead of manually calling flexRender.
   *
   * @example
   * ```tsx
   * <table.FlexRender cell={cell} />
   * <table.FlexRender header={header} />
   * <table.FlexRender footer={footer} />
   * ```
   *
   * This replaces calling `flexRender` directly like this:
   * ```tsx
   * flexRender(cell.column.columnDef.cell, cell.getContext())
   * flexRender(header.column.columnDef.header, header.getContext())
   * flexRender(footer.column.columnDef.footer, footer.getContext())
   * ```
   */
  FlexRender: <TValue extends CellData = CellData>(
    props: FlexRenderProps<TFeatures, TData, TValue>,
  ) => ReactNode
  /**
   * The selected state of the table. This state may not match the structure of
   * the full table state because it is selected by the selector function that
   * you pass as the 2nd argument to `useTable`.
   *
   * @example
   * const table = useTable(options, (state) => ({ globalFilter: state.globalFilter })) // only globalFilter is part of the selected state
   *
   * console.log(table.state.globalFilter)
   */
  readonly state: Readonly<TSelected>
}

/**
 * Creates a React table instance backed by TanStack Store atoms.
 *
 * The optional selector projects from `table.store`; the selected value is
 * exposed on `table.state` and compared shallowly for React re-renders. Omit
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
): ReactTable<TFeatures, TData, TSelected> {
  const [{ table, rootSource }] = useState(() => {
    // Explicit type arguments skip generic inference from the spread object (a
    // type-check hot spot); the spread only adds the react reactivity binding
    // to `features`.
    const tableInstance = constructTable<TFeatures, TData>({
      ...tableOptions,
      features: {
        coreReactivityFeature: reactReactivity(),
        ...tableOptions.features,
      },
    }) as unknown as ReactTable<TFeatures, TData, TSelected>

    tableInstance.Subscribe = ((props: any) => {
      const source = props.source ?? tableInstance.store

      return Subscribe({
        ...props,
        source,
      })
    }) as ReactTable<TFeatures, TData, TSelected>['Subscribe']

    tableInstance.FlexRender = FlexRender

    return {
      table: tableInstance,
      // The commit publication below re-notifies `table.store` so isolated
      // `table.Subscribe` consumers update, but this root hook already
      // rendered that exact snapshot — forwarding the notification here would
      // re-render the owner once per controlled update just to find nothing
      // changed. Only this hook's subscription is filtered.
      rootSource: createCommitFilteredSource<TableState<TFeatures>>(
        tableInstance.store,
      ),
    }
  })

  const coreTable = table as unknown as Table<TFeatures, TData>

  // Keep options current during render, so render reads (data, columns,
  // callbacks, controlled state) never lag a frame behind. The reactivity
  // bindings declare `deferExternalStateSync`, so no store subscriber is
  // notified while React is still rendering; the readonly atoms expose the
  // fresh controlled state through their live get() in the meantime.
  table_setOptions(coreTable, (prev) => ({
    ...prev,
    ...tableOptions,
  }))

  // Capture this render's controlled state: `table.options` is a shared
  // mutable object, and by the time the effect runs it may hold values from a
  // newer render that never commits (e.g. a suspended transition).
  const controlledState = coreTable.options.state

  const state = useSelector(rootSource, selector, { compare: shallow })

  useIsomorphicLayoutEffect(() => {
    // Publish only the state captured by a committed render. Layout effect
    // (not passive) so isolated table.Subscribe consumers update before
    // paint. Core batches the writes and bumps the commit version, which also
    // handles changes in controlled/uncontrolled ownership.
    table_syncExternalStateToBaseAtoms(
      coreTable,
      controlledState ?? null,
      shallow,
    )
  })

  // we know this is not the most efficient way to return the table,
  // but it is required for the react compiler to work
  return useMemo(
    () => ({
      ...table,
      options: tableOptions,
      state,
    }),
    [table, tableOptions, state],
  )
}
