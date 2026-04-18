import { JsonTree } from '@tanstack/devtools-ui'
import { useSelector } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'

export function OptionsPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const tableInstance = table()
  const tableState = tableInstance
    ? useSelector(tableInstance.optionsStore, (state: unknown) => {
        const {
          state: _s,
          data: _d,
          _features: _f,
          _rowModels: _r,
          ...options
        } = state as Record<string, unknown>
        return options
      })
    : undefined

  if (!tableInstance) {
    return <NoTableConnected title="Options" />
  }

  const getState = (): unknown => {
    tableState?.()
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
