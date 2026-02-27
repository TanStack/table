import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js'
import {
  getTableDevtoolsTarget,
  subscribeTableDevtoolsTarget,
} from './tableTarget'

import type { Accessor, ParentComponent, Setter } from 'solid-js'
import type { RowData, Table, TableFeatures } from '@tanstack/table-core'

export type TableDevtoolsTabId = 'features' | 'state' | 'rows'
type AnyTable = Table<TableFeatures, RowData>

interface TableDevtoolsContextValue {
  table: Accessor<AnyTable | undefined>
  activeTab: Accessor<TableDevtoolsTabId>
  setActiveTab: Setter<TableDevtoolsTabId>
}

const TableDevtoolsContext = createContext<
  TableDevtoolsContextValue | undefined
>(undefined)

export const TableContextProvider: ParentComponent = (props) => {
  const [table, setTable] = createSignal<AnyTable | undefined>(
    getTableDevtoolsTarget(),
  )
  const [activeTab, setActiveTab] = createSignal<TableDevtoolsTabId>('features')

  createEffect(() => {
    const unsubscribe = subscribeTableDevtoolsTarget((nextTable) => {
      setTable(nextTable)
    })

    onCleanup(unsubscribe)
  })

  return (
    <TableDevtoolsContext.Provider
      value={{
        table,
        activeTab,
        setActiveTab,
      }}
    >
      {props.children}
    </TableDevtoolsContext.Provider>
  )
}

export function useTableDevtoolsContext() {
  const context = useContext(TableDevtoolsContext)

  if (!context) {
    throw new Error(
      'useTableDevtoolsContext must be used within TableContextProvider',
    )
  }

  return context
}
