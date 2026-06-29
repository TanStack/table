import { For, Show, createMemo } from 'solid-js'
import { coreFeatures, stockFeatures } from '@tanstack/table-core'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'
import type { TableDevtoolsTable } from '../tableTarget'

type FnBuckets = Partial<
  Record<'filterFns' | 'sortFns' | 'aggregationFns', Record<string, unknown>>
>

function toFnBuckets(value: unknown): FnBuckets {
  return typeof value === 'object' && value != null ? value : {}
}

const CORE_REACTIVITY_FEATURE_NAME = 'coreReactivityFeature'

const CORE_FEATURE_NAMES: Array<string> = [
  CORE_REACTIVITY_FEATURE_NAME,
  ...Object.keys(coreFeatures).filter(
    (featureName) => featureName !== CORE_REACTIVITY_FEATURE_NAME,
  ),
]
const STOCK_FEATURE_NAMES: Array<string> = Object.keys(stockFeatures)

const PACKAGE_SIZE_LIMIT_BYTES = 16_987

const FEATURE_SIZE_ESTIMATES_BYTES: Record<string, number> = {
  coreCellsFeature: 358,
  coreColumnsFeature: 803,
  coreHeadersFeature: 1012,
  coreRowModelsFeature: 633,
  coreRowsFeature: 695,
  coreTablesFeature: 508,
  columnFacetingFeature: 953,
  columnFilteringFeature: 1266,
  columnGroupingFeature: 1141,
  columnOrderingFeature: 511,
  columnPinningFeature: 995,
  columnResizingFeature: 779,
  columnSizingFeature: 678,
  columnVisibilityFeature: 612,
  globalFilteringFeature: 435,
  rowExpandingFeature: 650,
  rowPaginationFeature: 605,
  rowPinningFeature: 671,
  rowSelectionFeature: 883,
  rowSortingFeature: 798,
}

const ROW_MODEL_SIZE_ESTIMATES_BYTES: Record<string, number> = {
  coreRowModel: 223,
  filteredRowModel: 588,
  groupedRowModel: 459,
  sortedRowModel: 341,
  expandedRowModel: 181,
  paginatedRowModel: 209,
}

// Row model factories live as slots on the `features` option alongside the
// feature modules themselves
const ROW_MODEL_FEATURE_SLOTS = [
  'coreRowModel',
  'filteredRowModel',
  'groupedRowModel',
  'sortedRowModel',
  'expandedRowModel',
  'paginatedRowModel',
  'facetedRowModel',
  'facetedMinMaxValues',
  'facetedUniqueValues',
]

const ROW_MODEL_SHARED_SIZE_LABELS: Record<string, string> = {
  preFilteredRowModel: 'shared',
  preGroupedRowModel: 'shared',
  preSortedRowModel: 'shared',
}

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
  tableInstance: TableDevtoolsTable | undefined,
  rowModelName: string,
): number {
  const getter = ROW_MODEL_TO_GETTER[rowModelName]
  if (!getter || !tableInstance) return 0

  const tableRecord = tableInstance as unknown as Record<string, unknown>
  if (typeof tableRecord[getter] !== 'function') return 0

  const result = (tableRecord[getter] as () => { rows?: Array<unknown> })()
  return result.rows?.length ?? 0
}

function formatEstimatedSize(sizeInBytes: number | undefined): string {
  if (typeof sizeInBytes !== 'number') return 'n/a'
  return `~${(sizeInBytes / 1000).toFixed(2)} kB brotli`
}

function normalizeRowModelEstimateKey(rowModelName: string): string {
  if (rowModelName === 'preFilteredRowModel') return 'filteredRowModel'
  if (rowModelName === 'preGroupedRowModel') return 'groupedRowModel'
  if (rowModelName === 'preSortedRowModel') return 'sortedRowModel'
  return rowModelName
}

export function FeaturesPanel() {
  const styles = useStyles()
  const { table } = useTableDevtoolsContext()

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

  const tableFeatures = createMemo((): Set<string> => {
    const tableInstance = table()
    if (!tableInstance) return new Set()

    tableState()
    return new Set(Object.keys(tableInstance._features))
  })

  const rowModelNames = createMemo((): Array<string> => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()
    tableOptions()

    return Object.keys(tableInstance.options.features ?? {}).filter((key) =>
      ROW_MODEL_FEATURE_SLOTS.includes(key),
    )
  })

  const getFnNames = (
    kind: 'filterFns' | 'sortFns' | 'aggregationFns',
  ): Array<string> => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()
    tableOptions()

    const rowModelFns = toFnBuckets(tableInstance._rowModelFns)
    const optionFns = toFnBuckets(tableInstance.options)
    return Object.keys(rowModelFns[kind] ?? optionFns[kind] ?? {})
  }

  const additionalPlugins = createMemo((): Array<string> => {
    const currentFeatures = tableFeatures()
    const knownFeatures = new Set([
      ...CORE_FEATURE_NAMES,
      ...STOCK_FEATURE_NAMES,
    ])
    return [...currentFeatures].filter((f) => !knownFeatures.has(f)).sort()
  })

  const getRowModelFunctions = (rowModelName: string): Array<string> => {
    const fnKind = ROW_MODEL_TO_FN_KIND[rowModelName]
    if (!fnKind) return []
    return getFnNames(fnKind)
  }

  const enabledFeatureEstimate = createMemo(() =>
    [...tableFeatures()].reduce((total, featureName) => {
      return total + (FEATURE_SIZE_ESTIMATES_BYTES[featureName] ?? 0)
    }, 0),
  )
  const enabledRowModelEstimate = createMemo(() =>
    [...new Set(rowModelNames())]
      .map((rowModelName) => normalizeRowModelEstimateKey(rowModelName))
      .filter((rowModelName, index, all) => all.indexOf(rowModelName) === index)
      .reduce((total, rowModelName) => {
        return total + (ROW_MODEL_SIZE_ESTIMATES_BYTES[rowModelName] ?? 0)
      }, 0),
  )
  const totalEstimatedBundleSize = createMemo(
    () => enabledFeatureEstimate() + enabledRowModelEstimate(),
  )

  const rowModels = createMemo(() => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()

    return rowModelNames().map((rowModelName) => {
      const sharedLabel = ROW_MODEL_SHARED_SIZE_LABELS[rowModelName]

      return {
        rowModelName,
        fns: getRowModelFunctions(rowModelName),
        rowCount: getRowCountForModel(tableInstance, rowModelName),
        estimateLabel:
          sharedLabel ??
          formatEstimatedSize(
            ROW_MODEL_SIZE_ESTIMATES_BYTES[
              normalizeRowModelEstimateKey(rowModelName)
            ],
          ),
      }
    })
  })

  const renderFeatureItem = (
    name: string,
    isEnabled: boolean,
    sizeLabel: string,
  ) => (
    <div class={styles().featureListItem}>
      <span class={isEnabled ? styles().featureCheck : styles().featureUncheck}>
        {isEnabled ? '✓' : '○'}
      </span>
      <span class={styles().featureLabel}>{name}</span>
      <span class={styles().featureMeta}>{sizeLabel}</span>
    </div>
  )

  return (
    <Show fallback={<NoTableConnected title="Features" />} when={table()}>
      <div class={styles().panelScroll}>
        <ResizableSplit
          left={
            <>
              <div class={styles().sectionTitle}>Features</div>
              <div class={styles().featureEstimateSummary}>
                <div class={styles().featureEstimateSummaryTitle}>
                  Estimated table-core package
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Registered features</span>
                  <span>{formatEstimatedSize(enabledFeatureEstimate())}</span>
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Client row models</span>
                  <span>{formatEstimatedSize(enabledRowModelEstimate())}</span>
                </div>
                <div class={styles().featureEstimateSummaryTotal}>
                  <span>Total</span>
                  <span>{formatEstimatedSize(totalEstimatedBundleSize())}</span>
                </div>
                <div class={styles().featureEstimateSummaryNote}>
                  Allocated from the current `size-limit` metric: minified and
                  brotlied.
                </div>
              </div>

              <div class={styles().featureSubsection}>
                <div class={styles().featureSubsectionTitle}>Core Features</div>
                <For each={CORE_FEATURE_NAMES}>
                  {(name) =>
                    renderFeatureItem(
                      name,
                      tableFeatures().has(name),
                      formatEstimatedSize(FEATURE_SIZE_ESTIMATES_BYTES[name]),
                    )
                  }
                </For>
              </div>

              <div class={styles().featureSubsection}>
                <div class={styles().featureSubsectionTitle}>
                  Stock Features
                </div>
                <For each={STOCK_FEATURE_NAMES}>
                  {(name) =>
                    renderFeatureItem(
                      name,
                      tableFeatures().has(name),
                      formatEstimatedSize(FEATURE_SIZE_ESTIMATES_BYTES[name]),
                    )
                  }
                </For>
              </div>

              {additionalPlugins().length > 0 && (
                <div class={styles().featureSubsection}>
                  <div class={styles().featureSubsectionTitle}>
                    Additional Plugins
                  </div>
                  <For each={additionalPlugins()}>
                    {(name) => renderFeatureItem(name, true, 'custom')}
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
              <For each={rowModels()}>
                {(rowModel) => (
                  <div>
                    <div class={styles().rowModelItem}>
                      <span class={styles().featureLabel}>
                        {rowModel.rowModelName}
                      </span>
                      <span class={styles().featureMeta}>
                        {rowModel.rowCount} rows, {rowModel.estimateLabel}
                      </span>
                    </div>
                    <For each={rowModel.fns}>
                      {(fnName) => (
                        <div class={styles().rowModelFnItem}>{fnName}</div>
                      )}
                    </For>
                  </div>
                )}
              </For>
              {rowModelNames().length === 0 && (
                <div class={styles().rowModelItem}>
                  No row models configured
                </div>
              )}
              <div class={styles().featureEstimateSummaryNote}>
                Full package reference:{' '}
                {formatEstimatedSize(PACKAGE_SIZE_LIMIT_BYTES)}
              </div>
              <div class={styles().rowModelExecutionOrder}>
                <div class={styles().featureSubsectionTitle}>
                  Execution Order
                </div>
                <For each={EXECUTION_ORDER_GETTERS}>
                  {(getter, index) => {
                    const rowModelKey = getterToRowModelKey(getter)
                    const isPresent =
                      rowModelKey !== null &&
                      rowModelNames().includes(rowModelKey)

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
    </Show>
  )
}
