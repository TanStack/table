import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TradingBenchmarkController } from './benchmark/trading-benchmark-controller'
import { MarketFeedController } from './feed/market-feed-controller'
import './shell/TradingShell'
import './index.css'

@customElement('realtime-trading-app')
export class RealtimeTradingApp extends LitElement {
  readonly #feed = new MarketFeedController()
  readonly #benchmark = new TradingBenchmarkController(this.#feed)
  readonly #stop = {
    feed: null as (() => void) | null,
    benchmark: null as (() => void) | null,
  }
  protected createRenderRoot() {
    return this
  }
  connectedCallback() {
    super.connectedCallback()
    this.#stop.feed = this.#feed.start()
    this.#stop.benchmark = this.#benchmark.start()
  }
  disconnectedCallback() {
    this.#stop.benchmark?.()
    this.#stop.feed?.()
    super.disconnectedCallback()
  }
  protected render() {
    return html`<trading-shell
      .controller=${this.#benchmark}
      .feed=${this.#feed}
    ></trading-shell>`
  }
}
