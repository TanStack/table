import { For, Show, createMemo } from 'solid-js'
import {
  aggregationFns as builtInAggregationFns,
  filterFns as builtInFilterFns,
  sortFns as builtInSortFns,
  coreFeatures,
  stockFeatures,
} from '@tanstack/table-core'
import { useTableDevtoolsContext } from '../TableContextProvider'
import { useTableStore } from '../useTableStore'
import { useStyles } from '../styles/use-styles'
import { bundleSizes } from '../bundleSizes'
import { estimateBundleSize } from '../estimateBundleSize'
import { NoTableConnected } from './NoTableConnected'
import { ResizableSplit } from './ResizableSplit'
import type { BundleSizeSelection } from '../estimateBundleSize'
import type { TableDevtoolsTable } from '../tableTarget'

type FnKind = 'filterFns' | 'sortFns' | 'aggregationFns'

type FnBuckets = Partial<Record<FnKind, Record<string, unknown>>>

interface RegisteredFn {
  name: string
  /** The built-in this function is, when it is one */
  builtInName?: string
}

function toFnBuckets(value: unknown): FnBuckets {
  return typeof value === 'object' && value != null ? value : {}
}

/** Maps each built-in fn back to its registry name to size registered fns */
const BUILT_IN_FN_NAMES: Record<FnKind, Map<unknown, string>> = {
  filterFns: new Map(
    Object.entries(builtInFilterFns).map(([name, fn]) => [fn, name]),
  ),
  sortFns: new Map(
    Object.entries(builtInSortFns).map(([name, fn]) => [fn, name]),
  ),
  aggregationFns: new Map(
    Object.entries(builtInAggregationFns).map(([name, fn]) => [fn, name]),
  ),
}

const CORE_REACTIVITY_FEATURE_NAME = 'coreReactivityFeature'

const CORE_FEATURE_NAMES: Array<string> = [
  CORE_REACTIVITY_FEATURE_NAME,
  ...Object.keys(coreFeatures).filter(
    (featureName) => featureName !== CORE_REACTIVITY_FEATURE_NAME,
  ),
]
const STOCK_FEATURE_NAMES: Array<string> = Object.keys(stockFeatures)

const CORE_FEATURE_SIZES: Record<string, number> = bundleSizes.coreFeatures
const FEATURE_SIZES: Record<string, number> = bundleSizes.features
const ROW_MODEL_SIZES: Record<string, number> = bundleSizes.rowModels
const FN_SIZES: Record<FnKind, Record<string, number>> = {
  filterFns: bundleSizes.filterFns,
  sortFns: bundleSizes.sortFns,
  aggregationFns: bundleSizes.aggregationFns,
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

const ROW_MODEL_TO_FN_KIND: Record<string, FnKind | null> = {
  filteredRowModel: 'filterFns',
  preFilteredRowModel: 'filterFns',
  sortedRowModel: 'sortFns',
  preSortedRowModel: 'sortFns',
  groupedRowModel: null,
  preGroupedRowModel: null,
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

function formatSize(sizeInBytes: number | undefined): string {
  if (typeof sizeInBytes !== 'number') return 'n/a'
  return `${(sizeInBytes / 1000).toFixed(2)} kB`
}

function formatRegisteredFnSize(kind: FnKind, fn: RegisteredFn): string {
  return fn.builtInName ? formatSize(FN_SIZES[kind][fn.builtInName]) : 'custom'
}

function normalizeRowModelSizeKey(rowModelName: string): string {
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
  const optionsStoreValue = useTableStore(
    () => table()?.optionsStore,
    (options) => options,
  )

  const tableFeatures = createMemo((): Set<string> => {
    const tableInstance = table()
    if (!tableInstance) return new Set()

    return new Set(Object.keys(tableInstance._features))
  })

  const rowModelNames = createMemo((): Array<string> => {
    const tableInstance = table()
    if (!tableInstance) return []

    optionsStoreValue()

    return Object.keys(tableInstance.options.features ?? {}).filter((key) =>
      ROW_MODEL_FEATURE_SLOTS.includes(key),
    )
  })

  const getRegisteredFns = (kind: FnKind): Array<RegisteredFn> => {
    const tableInstance = table()
    if (!tableInstance) return []

    optionsStoreValue()

    const rowModelFns = toFnBuckets(tableInstance._rowModelFns)
    const optionFns = toFnBuckets(tableInstance.options)
    const registry = rowModelFns[kind] ?? optionFns[kind] ?? {}
    return Object.entries(registry).map(([name, fn]) => ({
      name,
      builtInName: BUILT_IN_FN_NAMES[kind].get(fn),
    }))
  }

  const additionalPlugins = createMemo((): Array<string> => {
    const currentFeatures = tableFeatures()
    const knownFeatures = new Set([
      ...CORE_FEATURE_NAMES,
      ...STOCK_FEATURE_NAMES,
    ])
    return [...currentFeatures].filter((f) => !knownFeatures.has(f)).sort()
  })

  const registeredFns = createMemo((): Record<FnKind, Array<RegisteredFn>> => ({
    filterFns: getRegisteredFns('filterFns'),
    sortFns: getRegisteredFns('sortFns'),
    aggregationFns: getRegisteredFns('aggregationFns'),
  }))

  const getRowModelFunctions = (rowModelName: string): Array<RegisteredFn> => {
    const fnKind = ROW_MODEL_TO_FN_KIND[rowModelName]
    if (!fnKind) return []
    return registeredFns()[fnKind]
  }

  // Estimates stack up cumulatively (core, then features, then row models,
  // then fns) so the breakdown rows add up to the total even though items
  // share code
  const sizeEstimate = createMemo(() => {
    const builtInNames = (kind: FnKind) =>
      registeredFns()[kind].flatMap((fn) =>
        fn.builtInName ? [fn.builtInName] : [],
      )
    const withFeatures: BundleSizeSelection = {
      features: [...tableFeatures()],
    }
    const withRowModels: BundleSizeSelection = {
      ...withFeatures,
      rowModels: rowModelNames(),
    }
    const withFns: BundleSizeSelection = {
      ...withRowModels,
      filterFns: builtInNames('filterFns'),
      sortFns: builtInNames('sortFns'),
      aggregationFns: builtInNames('aggregationFns'),
    }

    const core = bundleSizes.core
    const features = estimateBundleSize(withFeatures)
    const rowModels = estimateBundleSize(withRowModels)
    const total = estimateBundleSize(withFns)

    return {
      core,
      features: features - core,
      rowModels: rowModels - features,
      fns: total - rowModels,
      total,
    }
  })

  const rowModels = createMemo(() => {
    const tableInstance = table()
    if (!tableInstance) return []

    tableState()

    return rowModelNames().map((rowModelName) => {
      const sharedLabel = ROW_MODEL_SHARED_SIZE_LABELS[rowModelName]
      const fnKind = ROW_MODEL_TO_FN_KIND[rowModelName] ?? null

      return {
        rowModelName,
        fnKind,
        fns: getRowModelFunctions(rowModelName),
        rowCount: getRowCountForModel(tableInstance, rowModelName),
        sizeLabel:
          sharedLabel ??
          formatSize(ROW_MODEL_SIZES[normalizeRowModelSizeKey(rowModelName)]),
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
                  Estimated @tanstack/table-core bundle
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Core</span>
                  <span>{formatSize(sizeEstimate().core)}</span>
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Registered features</span>
                  <span>+{formatSize(sizeEstimate().features)}</span>
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Client row models</span>
                  <span>+{formatSize(sizeEstimate().rowModels)}</span>
                </div>
                <div class={styles().featureEstimateSummaryRow}>
                  <span>Built-in fns</span>
                  <span>+{formatSize(sizeEstimate().fns)}</span>
                </div>
                <div class={styles().featureEstimateSummaryTotal}>
                  <span>Total</span>
                  <span>{formatSize(sizeEstimate().total)}</span>
                </div>
                <div class={styles().featureEstimateSummaryNote}>
                  Minified + brotli, the metric `pnpm size` reports, measured
                  for v{bundleSizes.tableCoreVersion}. Each item shows what it
                  adds on its own; the total counts code that items share once.
                  Excludes the framework adapter and custom features.
                </div>
              </div>

              <div class={styles().featureSubsection}>
                <div class={styles().featureSubsectionTitle}>Core Features</div>
                <For each={CORE_FEATURE_NAMES}>
                  {(name) =>
                    renderFeatureItem(
                      name,
                      tableFeatures().has(name),
                      name === CORE_REACTIVITY_FEATURE_NAME
                        ? 'adapter'
                        : formatSize(CORE_FEATURE_SIZES[name]),
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
                      `+${formatSize(FEATURE_SIZES[name])}`,
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
                        {rowModel.rowCount} rows, {rowModel.sizeLabel}
                      </span>
                    </div>
                    <For each={rowModel.fns}>
                      {(fn) => (
                        <div class={styles().rowModelFnItem}>
                          <span class={styles().featureLabel}>{fn.name}</span>
                          <span class={styles().featureMeta}>
                            {rowModel.fnKind
                              ? formatRegisteredFnSize(rowModel.fnKind, fn)
                              : ''}
                          </span>
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
              {tableFeatures().has('rowAggregationFeature') && (
                <div>
                  <div class={styles().rowModelItem}>
                    <span class={styles().featureLabel}>aggregationFns</span>
                    <span class={styles().featureMeta}>
                      {registeredFns().aggregationFns.length} registered
                    </span>
                  </div>
                  <For each={registeredFns().aggregationFns}>
                    {(fn) => (
                      <div class={styles().rowModelFnItem}>
                        <span class={styles().featureLabel}>{fn.name}</span>
                        <span class={styles().featureMeta}>
                          {formatRegisteredFnSize('aggregationFns', fn)}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              )}
              {rowModelNames().length === 0 && (
                <div class={styles().rowModelItem}>
                  No row models configured
                </div>
              )}
              <div class={styles().featureEstimateSummaryNote}>
                Full package: {formatSize(bundleSizes.package)}
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
