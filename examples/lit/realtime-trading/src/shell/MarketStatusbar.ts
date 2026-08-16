import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ControllerElement } from './controller-element'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
@customElement('trading-market-statusbar')
export class MarketStatusbar extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  protected firstUpdated() { this.observe(this.controller.store) }
  protected render() { const state = this.controller.store.get(); return html`<footer class="market-statusbar"><span>MESSAGE SAMPLES <strong>${integer.format(state.metrics.lastBatchSize)}</strong></span><span>ROW UPDATES <strong>${integer.format(state.metrics.lastUpdateCount)}</strong></span><span>HOSTS <strong>${integer.format(state.mountedCells)}</strong></span><span>COMPONENTS <strong>${integer.format(state.liveComponents)}</strong></span></footer>` }
}
