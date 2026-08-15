import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core'
import {
  FlexRender,
  injectTable,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'
import {
  createTableWorker,
  createWorkerRowModel,
  workerRowModelsFeature,
} from '@tanstack/angular-table/experimental-worker-plugin'
import { TradingBenchmarkController } from '../../benchmark/trading-benchmark.controller'
import { createTradingColumns } from '../table-config/trading-columns'
import { TradingTableInteractionController } from '../table-interactions'
import { injectTradingTableInitialFit } from '../trading-table-initial-fit'
import { TradingGridCellDirective } from '../view/trading-grid-cell.directive'
import { TradingGridSelectionDirective } from '../view/trading-grid-selection.directive'
import { TradingHeaderCell } from '../view/trading-header-cell'
import {
  TRADING_ROW_HEIGHT,
  injectTradingRowVirtualizer,
} from '../trading-row-virtualizer'
import type { ElementRef } from '@angular/core'
import type { MarketQuote } from '../../feed/market-data'
import type { RendererMode } from '../table-config/trading-column-types'
import type { VirtualScrollMode } from '../trading-row-virtualizer'

function createWorkerTableRuntime() {
  const worker = createTableWorker({
    createWorker: () =>
      new Worker(new URL('./table-row-model.worker', import.meta.url), {
        type: 'module',
      }),
  })
  const features = tableFeatures({
    ...stockFeatures,
    workerRowModelsFeature,
    filteredRowModel: createWorkerRowModel(worker, 'filtered'),
    sortedRowModel: createWorkerRowModel(worker, 'sorted'),
  })

  return { worker, features }
}

@Component({
  selector: 'app-worker-trading-table',
  imports: [
    FlexRender,
    TradingGridCellDirective,
    TradingGridSelectionDirective,
    TradingHeaderCell,
  ],
  templateUrl: '../table-v9.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerTradingTable {
  readonly #controller = inject(TradingBenchmarkController)
  readonly #destroyRef = inject(DestroyRef)
  readonly #workerRuntime = createWorkerTableRuntime()
  readonly quotes = input<Array<MarketQuote>>([])
  readonly rendererMode = input.required<RendererMode>()
  readonly selectedSymbol = input<string | null>(null)
  readonly virtualScrollMode = input.required<VirtualScrollMode>()
  readonly symbolSelected = output<string>()
  readonly tanStackScrollContainer = viewChild<ElementRef<HTMLDivElement>>(
    'tanStackScrollContainer',
  )
  readonly rowHeight = TRADING_ROW_HEIGHT
  readonly interactions = new TradingTableInteractionController()

  readonly columns = createTradingColumns({
    rendererMode: () => this.rendererMode(),
    selectSymbol: (symbol) => this.symbolSelected.emit(symbol),
  })

  readonly table = injectTable(() => ({
    data: this.quotes(),
    columns: this.columns,
    features: this.#workerRuntime.features,
    columnResizeMode: 'onChange' as const,
    defaultColumn: { minSize: 56, maxSize: 800 },
    autoResetCellSelection: false,
    getRowId: (row) => row.id,
  }))
  readonly tableStyle = computed(() => {
    void this.table.atoms.columnSizing.get()
    void this.table.atoms.columnOrder.get()
    return untracked(() => {
      const styles: Record<string, string> = {
        width: `${this.table.getTotalSize()}px`,
      }
      for (const header of this.table.getFlatHeaders()) {
        styles[`--header-${header.id}-size`] = `${header.getSize()}`
        styles[`--col-${header.column.id}-size`] = `${header.column.getSize()}`
      }
      return styles
    })
  })
  readonly rows = computed(() => this.table.getRowModel().rows)
  readonly virtualization = injectTradingRowVirtualizer(
    this.rows,
    this.virtualScrollMode,
    this.tanStackScrollContainer,
    (count) => this.#controller.setRenderedRowCount(count),
  )

  readonly workerPending = computed<string>(() => {
    return String(this.table.atoms.workerRowModels.get().isPending)
  })

  readonly workerComputeMs = computed<string | null>(() => {
    const computeMs = this.table.atoms.workerRowModels.get().lastComputeMs
    return computeMs === undefined ? null : computeMs.toFixed(3)
  })

  readonly tableHeight = computed(() => this.rows().length * this.rowHeight)

  constructor() {
    injectTradingTableInitialFit(this.table, this.tanStackScrollContainer)
    this.#destroyRef.onDestroy(() => this.#workerRuntime.worker.terminate())
  }

  selectInstrument(symbol: string, event: MouseEvent): void {
    if (event.button === 0) this.symbolSelected.emit(symbol)
  }
}
