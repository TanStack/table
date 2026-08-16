import { useStoreValue } from '../use-store-value'
import type { MarketFeedController } from '../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../benchmark/trading-benchmark-controller'

export function SelectedInstrument(props: {
  controller: TradingBenchmarkController
  feed: MarketFeedController
}) @{
  const feedState = useStoreValue(props.feed.store)
  const symbol = useStoreValue(props.controller.renderAtoms.selectedSymbol)
  const quote = props.feed.getQuoteBySymbol(feedState.quotes, symbol)
  <section className="config-section selected-instrument" data-testid="selected-instrument">
    <h2>SELECTED INSTRUMENT</h2>
    {quote ? <>
      <div className="selection"><div><strong>{quote.symbol}</strong><span>{quote.company}</span></div><small>{quote.venue}</small></div>
      <dl><div><dt>Last</dt><dd>{quote.price.toFixed(2)}</dd></div><div><dt>Bid / ask</dt><dd>{quote.bid.toFixed(2)} / {quote.ask.toFixed(2)}</dd></div></dl>
    </> : <p>Click or begin a cell selection in any row to inspect its instrument.</p>}
  </section>
}
