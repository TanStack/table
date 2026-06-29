import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { batch } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ThreeWayResizableSplit } from './ThreeWayResizableSplit'

type AtomSource = 'external-atom' | 'external-state' | 'internal'

interface AtomSlice {
  key: string
  value: unknown
  source: AtomSource
}

export function StatePanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()
  const [initialStateCopied, setInitialStateCopied] = createSignal(false)
  const [storeCopied, setStoreCopied] = createSignal(false)
  const [pasteError, setPasteError] = createSignal<string | null>(null)

  // Subscribe to both stores so the panel re-renders when either the table
  // state or the options (e.g. options.atoms / options.state) change.
  const tableState = useTableStore(
    () => table()?.store,
    (state) => state,
  )
  const tableOptions = useTableStore(
    () => {
      const tableInstance = table()
      return tableInstance?.optionsStore ?? tableInstance?.store
    },
    () => table()?.options as unknown,
  )

  const initialState = createMemo((): unknown => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    tableState()
    tableOptions()

    return tableInstance.initialState
  })

  const storeState = createMemo((): unknown => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    tableState()
    tableOptions()

    return tableInstance.store.state
  })

  const atomSlices = createMemo((): Array<AtomSlice> => {
    const tableInstance = table()
    if (!tableInstance) return []

    // Touch subscriptions so this recomputes on state or option change.
    tableState()
    tableOptions()

    const options = tableInstance.options as unknown as Record<string, unknown>
    const externalAtoms =
      (options.atoms as Record<string, unknown> | undefined) ?? {}
    const externalState =
      (options.state as Record<string, unknown> | undefined) ?? {}
    const storeState = tableInstance.store.state as Record<string, unknown>

    return Object.keys(storeState).map((key) => {
      const hasExternalAtom = externalAtoms[key] != null
      const hasExternalState =
        !hasExternalAtom &&
        key in externalState &&
        externalState[key] !== undefined

      const source: AtomSource = hasExternalAtom
        ? 'external-atom'
        : hasExternalState
          ? 'external-state'
          : 'internal'

      return {
        key,
        value: storeState[key],
        source,
      }
    })
  })

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
    const tableInstance = table()
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
      const baseAtoms = tableInstance.baseAtoms as Record<
        string,
        { set: (v: unknown) => void }
      >
      batch(() => {
        for (const [key, value] of Object.entries(parsed)) {
          if (key in baseAtoms) {
            baseAtoms[key]!.set(value)
          }
        }
      })
    } catch (e) {
      setPasteError(
        e instanceof Error ? e.message : 'Failed to parse clipboard',
      )
    }
  }

  const handleReset = () => {
    table()?.reset()
  }

  return (
    <Show fallback={<NoTableConnected title="State" />} when={table()}>
      <div class={styles().panelScroll}>
        <ThreeWayResizableSplit
          left={
            <>
              <div class={styles().sectionTitle}>initialState</div>
              <div class={styles().buttonRow}>
                <button
                  type="button"
                  class={styles().copyButton}
                  onClick={() =>
                    copyToClipboard(initialState(), setInitialStateCopied)
                  }
                >
                  {initialStateCopied() ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <JsonTree copyable value={initialState()} />
            </>
          }
          middle={
            <>
              <div class={styles().sectionTitle}>Atoms</div>
              <div class={styles().buttonRow}>
                <button
                  type="button"
                  class={styles().resetButton}
                  onClick={handleReset}
                >
                  Reset to initialState
                </button>
              </div>
              <For each={atomSlices()}>
                {(slice) => <AtomRow slice={slice} />}
              </For>
            </>
          }
          right={
            <>
              <div class={styles().sectionTitle}>Store</div>
              <div class={styles().buttonRow}>
                <button
                  type="button"
                  class={styles().copyButton}
                  onClick={() => copyToClipboard(storeState(), setStoreCopied)}
                >
                  {storeCopied() ? 'Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  class={styles().pasteButton}
                  onClick={handlePaste}
                >
                  Paste
                </button>
              </div>
              {pasteError() && (
                <div class={styles().pasteError}>{pasteError()}</div>
              )}
              <JsonTree copyable value={storeState()} />
            </>
          }
        />
      </div>
    </Show>
  )
}

function AtomRow(props: { slice: AtomSlice }) {
  const styles = useStyles()

  const badgeLabel = () => {
    switch (props.slice.source) {
      case 'external-atom':
        return 'External Atom'
      case 'external-state':
        return 'External State'
      case 'internal':
        return 'Internal'
    }
  }

  const badgeClass = () => {
    const base = styles().atomBadge
    switch (props.slice.source) {
      case 'external-atom':
        return `${base} ${styles().atomBadgeExternalAtom}`
      case 'external-state':
        return `${base} ${styles().atomBadgeExternalState}`
      case 'internal':
        return `${base} ${styles().atomBadgeInternal}`
    }
  }

  return (
    <div class={styles().atomRow}>
      <div class={styles().atomRowHeader}>
        <span class={styles().atomKey}>{props.slice.key}</span>
        <span class={badgeClass()}>{badgeLabel()}</span>
      </div>
      <div class={styles().atomValue}>
        <JsonTree copyable value={props.slice.value} />
      </div>
    </div>
  )
}
