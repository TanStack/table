import { For } from 'solid-js'
import { coreFeatures, stockFeatures } from '@tanstack/table-core'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'

type FnBuckets = Partial<
  Record<'filterFns' | 'sortFns' | 'aggregationFns', Record<string, unknown>>
>

function toFnBuckets(value: unknown): FnBuckets {
  return typeof value === 'object' && value != null ? (value as FnBuckets) : {}
}

const CORE_FEATURE_NAMES: Array<string> = Object.keys(coreFeatures)
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
  tableInstance: { [key: string]: unknown } | undefined,
  rowModelName: string,
): number {
  const getter = ROW_MODEL_TO_GETTER[rowModelName]
  if (!getter || typeof tableInstance?.[getter] !== 'function') return 0
  const result = (tableInstance[getter] as () => { rows?: Array<unknown> })()
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

  const tableInstance = table()
  const tableState = useTableStore(
    tableInstance ? tableInstance.store : undefined,
    (state) => state,
  )

  if (!tableInstance) {
    return <NoTableConnected title="Features" />
  }

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
  const enabledFeatureEstimate = [...tableFeatures].reduce(
    (total, featureName) => {
      return total + (FEATURE_SIZE_ESTIMATES_BYTES[featureName] ?? 0)
    },
    0,
  )
  const enabledRowModelEstimate = [...new Set(rowModelNames)]
    .map((rowModelName) => normalizeRowModelEstimateKey(rowModelName))
    .filter((rowModelName, index, all) => all.indexOf(rowModelName) === index)
    .reduce((total, rowModelName) => {
      return total + (ROW_MODEL_SIZE_ESTIMATES_BYTES[rowModelName] ?? 0)
    }, 0)
  const totalEstimatedBundleSize =
    enabledFeatureEstimate + enabledRowModelEstimate

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
                <span>{formatEstimatedSize(enabledFeatureEstimate)}</span>
              </div>
              <div class={styles().featureEstimateSummaryRow}>
                <span>Client row models</span>
                <span>{formatEstimatedSize(enabledRowModelEstimate)}</span>
              </div>
              <div class={styles().featureEstimateSummaryTotal}>
                <span>Total</span>
                <span>{formatEstimatedSize(totalEstimatedBundleSize)}</span>
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
                    tableFeatures.has(name),
                    formatEstimatedSize(FEATURE_SIZE_ESTIMATES_BYTES[name]),
                  )
                }
              </For>
            </div>

            <div class={styles().featureSubsection}>
              <div class={styles().featureSubsectionTitle}>Stock Features</div>
              <For each={STOCK_FEATURE_NAMES}>
                {(name) =>
                  renderFeatureItem(
                    name,
                    tableFeatures.has(name),
                    formatEstimatedSize(FEATURE_SIZE_ESTIMATES_BYTES[name]),
                  )
                }
              </For>
            </div>

            {getAdditionalPlugins().length > 0 && (
              <div class={styles().featureSubsection}>
                <div class={styles().featureSubsectionTitle}>
                  Additional Plugins
                </div>
                <For each={getAdditionalPlugins()}>
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
            <For each={rowModelNames}>
              {(rowModelName) => {
                const fns = getRowModelFunctions(rowModelName)
                const rowCount = getRowCountForModel(
                  tableInstance,
                  rowModelName,
                )
                const sharedLabel = ROW_MODEL_SHARED_SIZE_LABELS[rowModelName]
                const estimateLabel =
                  sharedLabel ??
                  formatEstimatedSize(
                    ROW_MODEL_SIZE_ESTIMATES_BYTES[
                      normalizeRowModelEstimateKey(rowModelName)
                    ],
                  )
                return (
                  <div>
                    <div class={styles().rowModelItem}>
                      <span class={styles().featureLabel}>{rowModelName}</span>
                      <span class={styles().featureMeta}>
                        {rowCount} rows, {estimateLabel}
                      </span>
                    </div>
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
            <div class={styles().featureEstimateSummaryNote}>
              Full package reference:{' '}
              {formatEstimatedSize(PACKAGE_SIZE_LIMIT_BYTES)}
            </div>
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
