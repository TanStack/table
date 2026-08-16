<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useMarketFeedController, useTradingShellController } from './trading-shell-context'
  const feed = useMarketFeedController()
  const selectedSymbol = useSelector(useTradingShellController().renderAtoms.selectedSymbol)
  const quotes = useSelector(feed.store, (state) => state.quotes)
  const selectedQuote = $derived(feed.getQuoteBySymbol(quotes.current, selectedSymbol.current))
</script>

<section class="config-section selected-instrument" data-testid="selected-instrument">
  <h2>SELECTED INSTRUMENT</h2>
  {#if selectedQuote}
    <div class="selection"><div><strong>{selectedQuote.symbol}</strong><span>{selectedQuote.company}</span></div><small>{selectedQuote.venue}</small></div>
    <dl><div><dt>Last</dt><dd>{selectedQuote.price.toFixed(2)}</dd></div><div><dt>Bid / ask</dt><dd>{selectedQuote.bid.toFixed(2)} / {selectedQuote.ask.toFixed(2)}</dd></div></dl>
  {:else}<p>Click or begin a cell selection in any row to inspect its instrument.</p>{/if}
</section>
