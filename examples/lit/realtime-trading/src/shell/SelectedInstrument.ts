import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ControllerElement } from './controller-element'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

@customElement('trading-selected-instrument')
export class SelectedInstrument extends ControllerElement {
  @property({ attribute: false }) controller!: TradingBenchmarkController
  @property({ attribute: false }) feed!: MarketFeedController
  protected firstUpdated() {
    this.observe(this.controller.renderAtoms.selectedSymbol)
    this.observe(this.feed.store)
  }
  protected render() {
    const quote = this.feed.getQuoteBySymbol(
      this.feed.store.get().quotes,
      this.controller.renderAtoms.selectedSymbol.get(),
    )
    return html`<section
      class="config-section selected-instrument"
      data-testid="selected-instrument"
    >
      <h2>SELECTED INSTRUMENT</h2>
      ${
        quote
          ? html`<div class="selection">
                <div>
                  <strong>${quote.symbol}</strong><span>${quote.company}</span>
                </div>
                <small>${quote.venue}</small>
              </div>
              <dl>
                <div>
                  <dt>Last</dt>
                  <dd>${quote.price.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Bid / ask</dt>
                  <dd>${quote.bid.toFixed(2)} / ${quote.ask.toFixed(2)}</dd>
                </div>
              </dl>`
          : html`<p>
              Click or begin a cell selection in any row to inspect its
              instrument.
            </p>`
      }
    </section>`
  }
}
