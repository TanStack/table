import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js'
import {
  getTableDevtoolsTargets,
  subscribeTableDevtoolsTargets,
} from './tableTarget'
import type { Accessor, ParentComponent, Setter } from 'solid-js'
import type {
  TableDevtoolsRegistration,
  TableDevtoolsTable,
} from './tableTarget'

type TableDevtoolsTabId = 'features' | 'state' | 'options' | 'rows' | 'columns'

interface TableDevtoolsContextValue {
  targets: Accessor<Array<TableDevtoolsRegistration>>
  selectedTargetId: Accessor<string | undefined>
  setSelectedTargetId: Setter<string | undefined>
  table: Accessor<TableDevtoolsTable | undefined>
  activeTab: Accessor<TableDevtoolsTabId>
  setActiveTab: Setter<TableDevtoolsTabId>
}

const TableDevtoolsContext = createContext<
  TableDevtoolsContextValue | undefined
>(undefined)

export const TableContextProvider: ParentComponent = (props) => {
  const initialTargets = getTableDevtoolsTargets()
  const [targets, setTargets] =
    createSignal<Array<TableDevtoolsRegistration>>(initialTargets)
  const [selectedTargetId, setSelectedTargetId] = createSignal<
    string | undefined
  >(initialTargets[0]?.id)
  const [activeTab, setActiveTab] = createSignal<TableDevtoolsTabId>('features')

  const selectedTarget = createMemo(() =>
    targets().find((target) => target.id === selectedTargetId()),
  )
  const table = createMemo<TableDevtoolsTable | undefined>(
    () => selectedTarget()?.table,
  )

  createEffect(() => {
    const unsubscribe = subscribeTableDevtoolsTargets((nextTargets) => {
      setTargets(nextTargets)
    })

    onCleanup(unsubscribe)
  })

  createEffect(() => {
    const nextTargets = targets()
    const currentSelectedTargetId = selectedTargetId()

    if (nextTargets.length === 0) {
      if (currentSelectedTargetId !== undefined) {
        setSelectedTargetId(undefined)
      }
      return
    }

    if (
      !currentSelectedTargetId ||
      !nextTargets.some((target) => target.id === currentSelectedTargetId)
    ) {
      setSelectedTargetId(nextTargets[0]?.id)
    }
  })

  return (
    <TableDevtoolsContext.Provider
      value={{
        targets,
        selectedTargetId,
        setSelectedTargetId,
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
