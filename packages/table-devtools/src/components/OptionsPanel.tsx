import { JsonTree } from '@tanstack/devtools-ui'
import { useStore } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
import { ResizableSplit } from './ResizableSplit'

export function OptionsPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const tableInstance = table()
  const tableState = tableInstance
    ? useStore(
        tableInstance.baseOptionsStore,
        ({ state, data, _features, _rowModels, ...options }) => options,
      )
    : undefined

  const getState = (): unknown => {
    tableState?.()
    if (!tableInstance) {
      return undefined
    }
    return tableState?.()
  }

  return (
    <div class={styles().panelScroll}>
      <ResizableSplit
        left={
          <>
            <div class={styles().sectionTitle}>Options</div>
            <JsonTree copyable value={getState()} />
          </>
        }
        right={<></>}
      />
    </div>
  )
}
