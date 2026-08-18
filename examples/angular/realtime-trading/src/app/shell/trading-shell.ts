import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'
import { Configurator } from './configurator'
import { MarketStatusbar } from './market-statusbar'
import { ShellHeader } from './shell-header'

@Component({
  selector: 'app-trading-shell',
  imports: [Configurator, MarketStatusbar, ShellHeader],
  templateUrl: './trading-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingShell {
  readonly devMode = inject(TradingBenchmarkController).devMode
  readonly sidebarOpen = signal(true)
  readonly toggleSidebar = () => this.sidebarOpen.update((open) => !open)
}
