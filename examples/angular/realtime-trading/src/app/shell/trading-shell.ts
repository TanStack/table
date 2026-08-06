import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../core/trading-benchmark.controller'
import { Configurator } from './configurator'
import { MarketStatusbar } from './market-statusbar'
import { MarketToolbar } from './market-toolbar'
import { MetricsStrip } from './metrics-strip'
import { ShellHeader } from './shell-header'

@Component({
  selector: 'app-trading-shell',
  imports: [
    Configurator,
    MarketStatusbar,
    MarketToolbar,
    MetricsStrip,
    ShellHeader,
  ],
  templateUrl: './trading-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingShell {
  readonly devMode = inject(TradingBenchmarkController).devMode
}
