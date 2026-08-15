import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TradingBenchmarkController } from '../benchmark/trading-benchmark.controller'

@Component({
  selector: 'app-selected-instrument',
  template: `
    <section
      class="config-section selected-instrument"
      data-testid="selected-instrument"
    >
      <h2>SELECTED INSTRUMENT</h2>
      @if (controller.selectedQuote(); as quote) {
        <div class="selection">
          <div>
            <strong>{{ quote.symbol }}</strong>
            <span>{{ quote.company }}</span>
          </div>
          <small>{{ quote.venue }}</small>
        </div>
        <dl>
          <div>
            <dt>Last</dt>
            <dd>{{ quote.price.toFixed(2) }}</dd>
          </div>
          <div>
            <dt>Bid / ask</dt>
            <dd>{{ quote.bid.toFixed(2) }} / {{ quote.ask.toFixed(2) }}</dd>
          </div>
        </dl>
      } @else {
        <p>
          Click or begin a cell selection in any row to inspect its instrument.
        </p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedInstrument {
  readonly controller = inject(TradingBenchmarkController)
}
