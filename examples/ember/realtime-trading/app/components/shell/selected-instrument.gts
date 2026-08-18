import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { observeValue } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type { MarketQuote } from '../../feed/market-data'
import type { MarketFeedController } from '../../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: { controller: TradingBenchmarkController; feed: MarketFeedController }
}

export default class SelectedInstrument extends Component<Signature> {
  @tracked quotes: Array<MarketQuote>
  @tracked symbol: string | null
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.quotes = args.feed.quotes.get()
    this.symbol = args.controller.renderAtoms.selectedSymbol.get()
    observeValue(this, args.feed.quotes, (quotes) => { this.quotes = quotes })
    observeValue(this, args.controller.renderAtoms.selectedSymbol, (symbol) => {
      this.symbol = symbol
    })
  }
  get quote(): MarketQuote | null {
    return this.args.feed.getQuoteBySymbol(this.quotes, this.symbol)
  }
  <template>
    <section
      class='config-section selected-instrument'
      data-testid='selected-instrument'
    >
      <h2>SELECTED INSTRUMENT</h2>
      {{#if this.quote}}
        <div class='selection'><div><strong>{{this.quote.symbol}}</strong><span
            >{{this.quote.company}}</span></div><small
          >{{this.quote.venue}}</small></div>
        <dl><div><dt>Last</dt><dd>{{fixed this.quote.price}}</dd></div><div><dt
            >Bid / ask</dt><dd>{{fixed this.quote.bid}}
              /
              {{fixed this.quote.ask}}</dd></div></dl>
      {{else}}
        <p>Click or begin a cell selection in any row to inspect its instrument.</p>
      {{/if}}
    </section>
  </template>
}
const fixed = (value: number): string => value.toFixed(2)
