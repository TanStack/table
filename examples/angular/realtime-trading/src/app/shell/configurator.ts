import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import {
  feedSampleRateAt,
  feedSampleRateIndex,
  feedSampleRateOptions,
} from '../feed/feed-sample-rates'
import { MarketFeedService } from '../feed/market-feed.service'
import { configuratorOptions } from './configurator-options'
import { Diagnostics } from './diagnostics'
import { MetricsStrip } from './metrics-strip'
import { SelectedInstrument } from './selected-instrument'
import {
  formatRate,
  inputChecked,
  inputValue,
  selectValue,
} from './shell-formatters'

@Component({
  selector: 'app-configurator',
  imports: [Diagnostics, MetricsStrip, SelectedInstrument],
  templateUrl: './configurator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configurator {
  readonly controller = inject(TradingBenchmarkController)
  readonly feed = inject(MarketFeedService)
  readonly formatRate = formatRate
  readonly options = configuratorOptions
  readonly sampleRateOptions = feedSampleRateOptions
  readonly sampleRateIndex = feedSampleRateIndex

  readonly setRowCount = (event: Event) => {
    this.controller.resetViewState()
    this.feed.setInstrumentCount(Number(selectValue(event)))
  }
  readonly setTargetRate = (event: Event) =>
    this.feed.setTargetRate(feedSampleRateAt(Number(inputValue(event))))
  readonly setPublishInterval = (event: Event) =>
    this.feed.setPublishInterval(Number(selectValue(event)))
  readonly setRendererMode = (event: Event) =>
    this.controller.setRendererMode(inputChecked(event))
  readonly setTableWorkerEnabled = (event: Event) =>
    this.controller.setTableWorkerEnabled(inputChecked(event))
  readonly setVirtualScrollMode = (event: Event) =>
    this.controller.setVirtualScrollEnabled(selectValue(event) === 'tanstack')
  readonly setSparklineUpdates = (event: Event) =>
    this.feed.setSparklineUpdates(inputChecked(event))
  readonly setSparklineSampleInterval = (event: Event) =>
    this.feed.setSparklineSampleInterval(Number(selectValue(event)))
}
