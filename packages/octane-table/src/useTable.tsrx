import { shallow, useSelector } from '@tanstack/octane-store'
import { constructTable } from '@tanstack/table-core'
import { createRenderPhaseSource } from '@tanstack/table-core/reactivity'
import {
  table_publishExternalState,
  table_setOptions,
} from '@tanstack/table-core/static-functions'
import { useLayoutEffect, useMemo, useState } from 'octane'
import { FlexRender } from './FlexRender'
import { splitSlot } from './internal'
import { octaneReactivity } from './reactivity'
import { Subscribe } from './Subscribe.tsrx'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { OctaneTable } from './types'

/**
 * Creates an Octane table instance backed by TanStack Store atoms.
 *
 * The optional selector projects from `table.store`; the selected value is
 * exposed on `table.state` and compared shallowly for owner rerenders.
 */
export function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  ...rest: [
    selector?: (state: TableState<TFeatures>) => TSelected,
    slot?: symbol,
  ]
): OctaneTable<TFeatures, TData, TSelected> {
  const [user] = splitSlot(rest)
  const selector = user[0] as
    | ((state: TableState<TFeatures>) => TSelected)
    | undefined

  const [{ table, rootSource }] = useState(() => {
    const tableInstance = constructTable<TFeatures, TData>({
      ...tableOptions,
      features: {
        coreReactivityFeature: octaneReactivity(),
        ...tableOptions.features,
      },
    }) as unknown as OctaneTable<TFeatures, TData, TSelected>

    tableInstance.Subscribe = ((props: any) => (
      <Subscribe {...props} source={props.source ?? tableInstance.store} />
    )) as OctaneTable<TFeatures, TData, TSelected>['Subscribe']
    tableInstance.FlexRender = FlexRender

    return {
      table: tableInstance,
      rootSource: createRenderPhaseSource<TableState<TFeatures>>(
        tableInstance.store,
        shallow,
      ),
    }
  })

  const coreTable = table as unknown as Table<TFeatures, TData>

  table_setOptions(
    coreTable,
    (prev) => ({
      ...prev,
      ...tableOptions,
    }),
    { syncExternalState: false },
  )

  const controlledState = coreTable.options.state
  const renderSnapshot = rootSource.get()
  const state = useSelector(rootSource, selector, { compare: shallow })

  useLayoutEffect(() => {
    rootSource.markCommitted(renderSnapshot)
    table_publishExternalState(coreTable, controlledState ?? null, shallow)
  }, null)

  return useMemo(
    () => ({
      ...table,
      options: tableOptions,
      state,
    }),
    [table, tableOptions, state],
  ) as OctaneTable<TFeatures, TData, TSelected>
}
