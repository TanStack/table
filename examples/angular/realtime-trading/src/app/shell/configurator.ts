import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { MarketFeedService } from '../feed/market-feed.service'
import { Diagnostics } from './diagnostics'
import { SelectedInstrument } from './selected-instrument'
import {
  formatRate,
  inputChecked,
  inputValue,
  selectValue,
} from './shell-formatters'
import type { FeedLoadProfile } from '../feed/feed-load-profiles'

@Component({
  selector: 'app-configurator',
  imports: [Diagnostics, SelectedInstrument],
  templateUrl: './configurator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configurator {
  readonly controller = inject(TradingBenchmarkController)
  readonly feed = inject(MarketFeedService)
  readonly formatRate = formatRate

  readonly setRowCount = (event: Event) => {
    this.controller.resetViewState()
    this.feed.setInstrumentCount(Number(selectValue(event)))
  }
  readonly setTargetRate = (event: Event) =>
    this.feed.setTargetRate(Number(inputValue(event)))
  readonly setFeedLoadProfile = (event: Event) =>
    this.feed.setLoadProfile(selectValue(event) as FeedLoadProfile)
  readonly setPublishInterval = (event: Event) =>
    this.feed.setPublishInterval(Number(selectValue(event)))
  readonly setRendererMode = (event: Event) =>
    this.controller.setRendererMode(inputChecked(event))
  readonly setTableWorkerEnabled = (event: Event) =>
    this.controller.setTableWorkerEnabled(inputChecked(event))
  readonly setVirtualScrollEnabled = (event: Event) =>
    this.controller.setVirtualScrollEnabled(inputChecked(event))
  readonly setSparklineUpdates = (event: Event) =>
    this.feed.setSparklineUpdates(inputChecked(event))
  readonly setSparklineSampleInterval = (event: Event) =>
    this.feed.setSparklineSampleInterval(Number(selectValue(event)))
}
