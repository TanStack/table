import { JsonTree } from '@tanstack/devtools-ui'
import { Show, createMemo } from 'solid-js'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'

function projectOptionsForTree(full: unknown) {
  const {
    state: _s,
    data: _d,
    features: _f,
    ...options
  } = full as Record<string, unknown>
  return options
}

export function OptionsPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const optionsStoreValue = useTableStore(
    () => table()?.optionsStore,
    (options) => options,
  )

  const options = createMemo(() => {
    const tableInstance = table()
    if (!tableInstance) {
      return undefined
    }

    return projectOptionsForTree(optionsStoreValue() ?? tableInstance.options)
  })

  return (
    <Show fallback={<NoTableConnected title="Options" />} when={table()}>
      <div class={styles().panelScroll}>
        <ResizableSplit
          left={
            <>
              <div class={styles().sectionTitle}>Options</div>
              <JsonTree copyable value={options()} />
            </>
          }
          right={<></>}
        />
      </div>
    </Show>
  )
}
