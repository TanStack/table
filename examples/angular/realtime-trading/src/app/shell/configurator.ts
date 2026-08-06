import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { Diagnostics } from './diagnostics'
import { SelectedInstrument } from './selected-instrument'
import {
  formatRate,
  inputChecked,
  inputValue,
  selectValue,
} from './shell-formatters'
import type { FeedLoadProfile, RowWorkloadMode } from '../benchmark-profiles'
import type { TableAdapter } from '../core/trading-benchmark.controller'

@Component({
  selector: 'app-configurator',
  imports: [Diagnostics, SelectedInstrument],
  templateUrl: './configurator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configurator {
  readonly controller = inject(TradingBenchmarkController)
  readonly formatRate = formatRate

  readonly setRowCount = (event: Event) =>
    this.controller.setRowCount(Number(selectValue(event)))
  readonly setTargetRate = (event: Event) =>
    this.controller.setTargetRate(Number(inputValue(event)))
  readonly setFeedLoadProfile = (event: Event) =>
    this.controller.setFeedLoadProfile(
      selectValue(event) as FeedLoadProfile,
    )
  readonly setRowWorkloadMode = (event: Event) =>
    this.controller.setRowWorkloadMode(
      selectValue(event) as RowWorkloadMode,
    )
  readonly setTableAdapter = (event: Event) =>
    this.controller.setTableAdapter(selectValue(event) as TableAdapter)
  readonly setRendererMode = (event: Event) =>
    this.controller.setRendererMode(inputChecked(event))
  readonly setTableWorkerEnabled = (event: Event) =>
    this.controller.setTableWorkerEnabled(inputChecked(event))
  readonly setSparklineUpdates = (event: Event) =>
    this.controller.setSparklineUpdates(inputChecked(event))
  readonly setQuoteAgeUpdates = (event: Event) =>
    this.controller.setQuoteAgeUpdates(inputChecked(event))
}
