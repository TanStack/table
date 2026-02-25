import { JsonTree } from '@tanstack/devtools-ui'
import { useStore } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
import { ResizableSplit } from './ResizableSplit'

export function StatePanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const tableInstance = table()
  const tableState = tableInstance
    ? useStore(tableInstance.store, (state) => state)
    : undefined

  const getInitialState = (): unknown => {
    tableState?.()
    if (!tableInstance) {
      return {
        message:
          'No table instance is connected. Pass a table instance to TableDevtoolsPanel.',
      }
    }
    return tableInstance.initialState as unknown
  }

  const getState = (): unknown => {
    tableState?.()
    if (!tableInstance) {
      return undefined
    }
    return tableInstance.store.state as unknown
  }

  return (
    <div class={styles().panelScroll}>
      <ResizableSplit
        left={
          <>
            <div class={styles().sectionTitle}>initialState</div>
            <JsonTree copyable value={getInitialState()} />
          </>
        }
        right={
          <>
            <div class={styles().sectionTitle}>State</div>
            <JsonTree copyable value={getState()} />
          </>
        }
      />
    </div>
  )
}
