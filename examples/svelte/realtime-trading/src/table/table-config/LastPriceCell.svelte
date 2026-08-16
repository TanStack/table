<script lang="ts">
  import { useTradingShellController } from '../../shell/trading-shell-context'
  import type { MarketQuote } from '../../feed/market-data'
  import PriceCell from './PriceCell.svelte'
  import { getDayChange } from './trading-columns'

  const { quote }: { quote: MarketQuote } = $props()
  const { selectSymbol } = useTradingShellController().actions
</script>

<PriceCell price={quote.price} move={getDayChange(quote)} onSelect={() => selectSymbol(quote.symbol)} />
