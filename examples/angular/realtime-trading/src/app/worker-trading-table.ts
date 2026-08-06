import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
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
import { createTradingColumns } from './trading-columns'
import type { OnDestroy } from '@angular/core'
import type { MarketQuote } from './market-data'
import type { RendererMode } from './trading-column-types'

const tableWorker = createTableWorker({
  createWorker: () =>
    new Worker(new URL('./table-row-model.worker', import.meta.url), {
      type: 'module',
    }),
})

const workerFeatures = tableFeatures({
  ...stockFeatures,
  workerRowModelsFeature,
  filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
})

@Component({
  selector: 'app-worker-trading-table',
  imports: [FlexRender],
  templateUrl: './table-v9.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerTradingTable implements OnDestroy {
  readonly quotes = input.required<Array<MarketQuote>>()
  readonly rendererMode = input.required<RendererMode>()
  readonly updateQuoteAges = input.required<boolean>()
  readonly quoteClock = input.required<number>()
  readonly selectedSymbol = input<string | null>(null)
  readonly symbolSelected = output<string>()

  readonly columns = createTradingColumns({
    rendererMode: () => this.rendererMode(),
    updateQuoteAges: () => this.updateQuoteAges(),
    quoteClock: () => this.quoteClock(),
    selectSymbol: (symbol) => this.symbolSelected.emit(symbol),
  })

  readonly table = injectTable(() => ({
    data: this.quotes(),
    columns: this.columns,
    features: workerFeatures,
    getRowId: (row) => row.id,
  }))

  @HostBinding('attr.data-table-worker-pending')
  get workerPending(): string {
    return String(this.table.store.get().workerRowModels.isPending)
  }

  @HostBinding('attr.data-table-worker-compute-ms')
  get workerComputeMs(): string | null {
    const computeMs = this.table.store.get().workerRowModels.lastComputeMs
    return computeMs === undefined ? null : computeMs.toFixed(3)
  }

  ngOnDestroy(): void {
    tableWorker.terminate()
  }
}
