import { For, Show, createMemo, createSignal } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { batch } from '@tanstack/solid-store'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ThreeWayResizableSplit } from './ThreeWayResizableSplit'
import type { Accessor } from 'solid-js'
import type { TableDevtoolsStyles } from '../styles/use-styles'

type AtomSource = 'external-atom' | 'external-state' | 'internal'

export function StatePanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()
  const [initialStateCopied, setInitialStateCopied] = createSignal(false)
  const [storeCopied, setStoreCopied] = createSignal(false)
  const [pasteError, setPasteError] = createSignal<string | null>(null)

  const tableState = useTableStore(
    () => table()?.store,
    (state) => state,
  )
  const optionsStoreValue = useTableStore(
    () => table()?.optionsStore,
    (options) => options,
  )

  const initialState = createMemo((): unknown => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    return tableInstance.initialState
  })

  const storeState = createMemo((): Record<string, unknown> | undefined => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    return (tableState() ?? tableInstance.store.get()) as Record<
      string,
      unknown
    >
  })

  const tableOptions = createMemo<Record<string, unknown> | undefined>(() => {
    const tableInstance = table()
    if (!tableInstance) return undefined

    return (optionsStoreValue() ?? tableInstance.options) as Record<
      string,
      unknown
    >
  })

  const atomKeys = createMemo(() => Object.keys(storeState() ?? {}))

  const getAtomSource = (key: string): AtomSource => {
    const options = tableOptions() ?? {}
    const externalAtoms =
      (options.atoms as Record<string, unknown> | undefined) ?? {}
    const externalState =
      (options.state as Record<string, unknown> | undefined) ?? {}
    const hasExternalAtom = externalAtoms[key] != null
    const hasExternalState =
      !hasExternalAtom &&
      key in externalState &&
      externalState[key] !== undefined

    return hasExternalAtom
      ? 'external-atom'
      : hasExternalState
        ? 'external-state'
        : 'internal'
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
              <For each={atomKeys()}>
                {(key) => (
                  <AtomRow
                    atomKey={key}
                    source={() => getAtomSource(key)}
                    styles={styles}
                    value={() => storeState()?.[key]}
                  />
                )}
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

function AtomRow(props: {
  atomKey: string
  source: Accessor<AtomSource>
  styles: Accessor<TableDevtoolsStyles>
  value: Accessor<unknown>
}) {
  const badgeLabel = () => {
    switch (props.source()) {
      case 'external-atom':
        return 'External Atom'
      case 'external-state':
        return 'External State'
      case 'internal':
        return 'Internal'
    }
  }

  const badgeClass = () => {
    const base = props.styles().atomBadge
    switch (props.source()) {
      case 'external-atom':
        return `${base} ${props.styles().atomBadgeExternalAtom}`
      case 'external-state':
        return `${base} ${props.styles().atomBadgeExternalState}`
      case 'internal':
        return `${base} ${props.styles().atomBadgeInternal}`
    }
  }

  return (
    <div class={props.styles().atomRow}>
      <div class={props.styles().atomRowHeader}>
        <span class={props.styles().atomKey}>{props.atomKey}</span>
        <span class={badgeClass()}>{badgeLabel()}</span>
      </div>
      <div class={props.styles().atomValue}>
        <JsonTree copyable value={props.value()} />
      </div>
    </div>
  )
}
