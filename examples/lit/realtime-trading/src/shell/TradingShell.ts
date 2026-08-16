import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ControllerElement } from './controller-element'
import './AppHeader'
import './Configurator'
import './MarketStatusbar'
import './MetricsStrip'
import '../table/TradingTable'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

@customElement('trading-shell')
export class TradingShell extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  @property({ attribute: false }) feed!: MarketFeedController
  @state() private sidebarOpen = true
  protected render() {
    return html`<main class="trading-terminal ${this.sidebarOpen ? '' : 'is-sidebar-collapsed'}">
      <div class="shell-header"><trading-app-header .feed=${this.feed} .sidebarOpen=${this.sidebarOpen} .toggleSidebar=${() => { this.sidebarOpen = !this.sidebarOpen }}></trading-app-header>${import.meta.env.DEV ? html`<aside class="development-warning">DEV BUILD — use the production build before recording results.</aside>` : null}</div>
      <section class="market-panel" aria-label="Live synthetic quotes"><trading-metrics-strip .controller=${this.controller}></trading-metrics-strip><trading-data-table .controller=${this.controller} .feed=${this.feed}></trading-data-table></section>
      <trading-market-statusbar .controller=${this.controller}></trading-market-statusbar>
      <div class="sidebar-slot">${this.sidebarOpen ? html`<trading-configurator .controller=${this.controller} .feed=${this.feed}></trading-configurator>` : null}</div>
    </main>`
  }
}
