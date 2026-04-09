import { For, createSignal } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'

export function StatePanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()
  const [initialStateCopied, setInitialStateCopied] = createSignal(false)
  const [stateCopied, setStateCopied] = createSignal(false)
  const [pasteError, setPasteError] = createSignal<string | null>(null)

  const tableInstance = table()
  const tableState = useTableStore(
    tableInstance ? tableInstance.store : undefined,
    (state) => state,
  )

  if (!tableInstance) {
    return <NoTableConnected title="State" />
  }

  const getInitialState = (): unknown => {
    tableState?.()
    return tableInstance.initialState as unknown
  }

  const getState = (): unknown => {
    tableState?.()
    return tableInstance.store.state as unknown
  }

  const copyToClipboard = async (
    value: unknown,
    setCopied: (v: boolean) => void,
  ) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API may fail in some contexts
    }
  }

  const handlePaste = async () => {
    if (!tableInstance) return
    setPasteError(null)
    try {
      const text = await navigator.clipboard.readText()
      const parsed = JSON.parse(text)
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        setPasteError('Invalid state: must be a JSON object')
        return
      }
      tableInstance.baseStore.setState(() => ({
        ...tableInstance.store.state,
        ...parsed,
      }))
    } catch (e) {
      setPasteError(
        e instanceof Error ? e.message : 'Failed to parse clipboard',
      )
    }
  }

  const handleReset = () => {
    tableInstance.reset()
  }

  const getStateSummaries = (): Array<{ key: string; summary: string }> => {
    const state = getState() as Record<string, unknown> | undefined
    if (!state || typeof state !== 'object') return []

    const summaries: Array<{ key: string; summary: string }> = []

    if (Array.isArray(state.sorting) && state.sorting.length > 0) {
      const parts = (state.sorting as Array<{ id: string; desc: boolean }>).map(
        (s) => `${s.id} (${s.desc ? 'desc' : 'asc'})`,
      )
      summaries.push({
        key: 'sorting',
        summary: `${state.sorting.length} column(s) sorted: ${parts.join(', ')}`,
      })
    }

    if (Array.isArray(state.columnFilters) && state.columnFilters.length > 0) {
      const parts = (
        state.columnFilters as Array<{ id: string; value: unknown }>
      ).map((f) => `${f.id}=${JSON.stringify(f.value)}`)
      summaries.push({
        key: 'columnFilters',
        summary: `${state.columnFilters.length} filter(s): ${parts.join(', ')}`,
      })
    }

    if (
      state.rowSelection &&
      typeof state.rowSelection === 'object' &&
      !Array.isArray(state.rowSelection)
    ) {
      const count = Object.keys(
        state.rowSelection as Record<string, unknown>,
      ).filter((k) => (state.rowSelection as Record<string, boolean>)[k]).length
      summaries.push({
        key: 'rowSelection',
        summary: `${count} row(s) selected`,
      })
    }

    if (
      state.pagination &&
      typeof state.pagination === 'object' &&
      !Array.isArray(state.pagination)
    ) {
      const p = state.pagination as { pageIndex?: number; pageSize?: number }
      summaries.push({
        key: 'pagination',
        summary: `Page ${(p.pageIndex ?? 0) + 1}, size ${p.pageSize ?? 10}`,
      })
    }

    if (Array.isArray(state.grouping) && state.grouping.length > 0) {
      summaries.push({
        key: 'grouping',
        summary: `Grouped by: ${(state.grouping as Array<string>).join(', ')}`,
      })
    }

    if (
      state.columnPinning &&
      typeof state.columnPinning === 'object' &&
      !Array.isArray(state.columnPinning)
    ) {
      const p = state.columnPinning as {
        left?: Array<string>
        right?: Array<string>
      }
      const left = p.left?.length ?? 0
      const right = p.right?.length ?? 0
      summaries.push({
        key: 'columnPinning',
        summary: `${left} left, ${right} right pinned`,
      })
    }

    if (state.expanded !== undefined && state.expanded !== null) {
      if (state.expanded === true) {
        summaries.push({ key: 'expanded', summary: 'All expanded' })
      } else if (
        typeof state.expanded === 'object' &&
        !Array.isArray(state.expanded)
      ) {
        const count = Object.keys(
          state.expanded as Record<string, unknown>,
        ).filter((k) => (state.expanded as Record<string, boolean>)[k]).length
        summaries.push({
          key: 'expanded',
          summary: `${count} row(s) expanded`,
        })
      }
    }

    if ('globalFilter' in state) {
      const val = state.globalFilter
      const str =
        val === undefined || val === null
          ? 'Not set'
          : typeof val === 'string'
            ? val
              ? `"${val}"`
              : '(empty)'
            : JSON.stringify(val)
      summaries.push({ key: 'globalFilter', summary: str })
    }

    if (
      state.columnVisibility &&
      typeof state.columnVisibility === 'object' &&
      !Array.isArray(state.columnVisibility)
    ) {
      const hidden = Object.entries(
        state.columnVisibility as Record<string, boolean>,
      ).filter(([, v]) => v === false).length
      if (hidden > 0) {
        summaries.push({
          key: 'columnVisibility',
          summary: `${hidden} column(s) hidden`,
        })
      }
    }

    if (Array.isArray(state.columnOrder) && state.columnOrder.length > 0) {
      summaries.push({
        key: 'columnOrder',
        summary: `Custom order (${state.columnOrder.length} columns)`,
      })
    }

    return summaries
  }

  const stateSummaries = getStateSummaries()

  return (
    <div class={styles().panelScroll}>
      <ResizableSplit
        left={
          <>
            <div class={styles().sectionTitle}>initialState</div>
            <div class={styles().buttonRow}>
              <button
                type="button"
                class={styles().copyButton}
                onClick={() =>
                  copyToClipboard(getInitialState(), setInitialStateCopied)
                }
                disabled={!tableInstance}
              >
                {initialStateCopied() ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <JsonTree copyable value={getInitialState()} />
          </>
        }
        right={
          <>
            <div class={styles().sectionTitle}>State</div>
            <div class={styles().buttonRow}>
              <button
                type="button"
                class={styles().resetButton}
                onClick={handleReset}
                disabled={!tableInstance}
              >
                Reset to initialState
              </button>
              <button
                type="button"
                class={styles().copyButton}
                onClick={() => copyToClipboard(getState(), setStateCopied)}
                disabled={!tableInstance}
              >
                {stateCopied() ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                class={styles().pasteButton}
                onClick={handlePaste}
                disabled={!tableInstance}
              >
                Paste
              </button>
            </div>
            {pasteError() && (
              <div class={styles().pasteError}>{pasteError()}</div>
            )}
            {stateSummaries.length > 0 && (
              <details class={styles().summarySection} open>
                <summary class={styles().featureSubsectionTitle}>
                  State Summary
                </summary>
                <For each={stateSummaries}>
                  {(item) => (
                    <div class={styles().summaryItem}>
                      <strong>{item.key}:</strong> {item.summary}
                    </div>
                  )}
                </For>
              </details>
            )}
            <JsonTree copyable value={getState()} />
          </>
        }
      />
    </div>
  )
}
