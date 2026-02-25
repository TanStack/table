import { For } from 'solid-js'
import { coreFeatures, stockFeatures } from '@tanstack/table-core'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { ResizableSplit } from './ResizableSplit'

type FnBuckets = Partial<
  Record<'filterFns' | 'sortFns' | 'aggregationFns', Record<string, unknown>>
>

function toFnBuckets(value: unknown): FnBuckets {
  return typeof value === 'object' && value != null ? (value as FnBuckets) : {}
}

const CORE_FEATURE_NAMES: Array<string> = Object.keys(coreFeatures)
const STOCK_FEATURE_NAMES: Array<string> = Object.keys(stockFeatures)

const ROW_MODEL_TO_FN_KIND: Record<
  string,
  'filterFns' | 'sortFns' | 'aggregationFns' | null
> = {
  filteredRowModel: 'filterFns',
  preFilteredRowModel: 'filterFns',
  sortedRowModel: 'sortFns',
  preSortedRowModel: 'sortFns',
  groupedRowModel: 'aggregationFns',
  preGroupedRowModel: 'aggregationFns',
}

const EXECUTION_ORDER_GETTERS = [
  'getCoreRowModel',
  'getFilteredRowModel',
  'getGroupedRowModel',
  'getSortedRowModel',
  'getExpandedRowModel',
  'getPaginatedRowModel',
  'getRowModel',
] as const

function getterToRowModelKey(getter: string): string | null {
  if (getter === 'getRowModel') return 'paginatedRowModel'
  const withoutGet = getter.slice(3)
  return withoutGet.charAt(0).toLowerCase() + withoutGet.slice(1)
}

const ROW_MODEL_TO_GETTER: Record<
  string,
  (typeof EXECUTION_ORDER_GETTERS)[number]
> = {
  coreRowModel: 'getCoreRowModel',
  filteredRowModel: 'getFilteredRowModel',
  preFilteredRowModel: 'getFilteredRowModel',
  groupedRowModel: 'getGroupedRowModel',
  preGroupedRowModel: 'getGroupedRowModel',
  sortedRowModel: 'getSortedRowModel',
  preSortedRowModel: 'getSortedRowModel',
  expandedRowModel: 'getExpandedRowModel',
  paginatedRowModel: 'getRowModel',
}

function getRowCountForModel(
  tableInstance: { [key: string]: unknown } | undefined,
  rowModelName: string,
): number {
  const getter = ROW_MODEL_TO_GETTER[rowModelName]
  if (!getter || typeof tableInstance?.[getter] !== 'function') return 0
  const result = (tableInstance[getter] as () => { rows?: Array<unknown> })()
  return result?.rows?.length ?? 0
}

export function FeaturesPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

  const tableInstance = table()
  const tableState = useTableStore(
    tableInstance ? tableInstance.store : undefined,
    (state) => state,
  )

  const getTableFeatures = (): Set<string> => {
    tableState?.()
    return new Set(Object.keys(tableInstance?._features ?? {}))
  }

  const getRowModelNames = (): Array<string> => {
    tableState?.()
    return Object.keys(tableInstance?.options._rowModels ?? {})
  }

  const getFnNames = (
    kind: 'filterFns' | 'sortFns' | 'aggregationFns',
  ): Array<string> => {
    tableState?.()
    const rowModelFns = toFnBuckets(tableInstance?._rowModelFns)
    const optionFns = toFnBuckets(tableInstance?.options)
    return Object.keys(rowModelFns[kind] ?? optionFns[kind] ?? {})
  }

  const getAdditionalPlugins = (): Array<string> => {
    const tableFeatures = getTableFeatures()
    const knownFeatures = new Set([
      ...CORE_FEATURE_NAMES,
      ...STOCK_FEATURE_NAMES,
    ])
    return [...tableFeatures].filter((f) => !knownFeatures.has(f)).sort()
  }

  const getRowModelFunctions = (rowModelName: string): Array<string> => {
    const fnKind = ROW_MODEL_TO_FN_KIND[rowModelName]
    if (!fnKind) return []
    return getFnNames(fnKind)
  }

  const tableFeatures = getTableFeatures()
  const rowModelNames = getRowModelNames()

  return (
    <div class={styles().panelScroll}>
      <ResizableSplit
        left={
          <>
            <div class={styles().sectionTitle}>Features</div>

            <div class={styles().featureSubsection}>
              <div class={styles().featureSubsectionTitle}>Core Features</div>
              <For each={CORE_FEATURE_NAMES}>
                {(name) => (
                  <div class={styles().featureListItem}>
                    <span
                      class={
                        tableFeatures.has(name)
                          ? styles().featureCheck
                          : styles().featureUncheck
                      }
                    >
                      {tableFeatures.has(name) ? '✓' : '○'}
                    </span>
                    {name}
                  </div>
                )}
              </For>
            </div>

            <div class={styles().featureSubsection}>
              <div class={styles().featureSubsectionTitle}>Stock Features</div>
              <For each={STOCK_FEATURE_NAMES}>
                {(name) => (
                  <div class={styles().featureListItem}>
                    <span
                      class={
                        tableFeatures.has(name)
                          ? styles().featureCheck
                          : styles().featureUncheck
                      }
                    >
                      {tableFeatures.has(name) ? '✓' : '○'}
                    </span>
                    {name}
                  </div>
                )}
              </For>
            </div>

            {getAdditionalPlugins().length > 0 && (
              <div class={styles().featureSubsection}>
                <div class={styles().featureSubsectionTitle}>
                  Additional Plugins
                </div>
                <For each={getAdditionalPlugins()}>
                  {(name) => (
                    <div class={styles().featureListItem}>
                      <span class={styles().featureCheck}>✓</span>
                      {name}
                    </div>
                  )}
                </For>
              </div>
            )}
          </>
        }
        right={
          <>
            <div class={styles().sectionTitle}>
              Client Side Row Models and Fns
            </div>
            <For each={rowModelNames}>
              {(rowModelName) => {
                const fns = getRowModelFunctions(rowModelName)
                return (
                  <div>
                    <div class={styles().rowModelItem}>{rowModelName}</div>
                    <For each={fns}>
                      {(fnName) => (
                        <div class={styles().rowModelFnItem}>{fnName}</div>
                      )}
                    </For>
                  </div>
                )
              }}
            </For>
            {rowModelNames.length === 0 && (
              <div class={styles().rowModelItem}>No row models configured</div>
            )}
            <div class={styles().rowModelExecutionOrder}>
              <div class={styles().featureSubsectionTitle}>Execution Order</div>
              <For each={EXECUTION_ORDER_GETTERS}>
                {(getter, index) => {
                  const rowModelKey = getterToRowModelKey(getter)
                  const isPresent =
                    rowModelKey !== null && rowModelNames.includes(rowModelKey)
                  return (
                    <>
                      {index() > 0 && ' → '}
                      <span
                        class={
                          isPresent
                            ? styles().rowModelExecutionOrderBold
                            : undefined
                        }
                      >
                        {getter}
                      </span>
                    </>
                  )
                }}
              </For>
            </div>
          </>
        }
      />
    </div>
  )
}
