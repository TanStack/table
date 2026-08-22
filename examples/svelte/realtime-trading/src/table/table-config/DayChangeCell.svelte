<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useTradingShellController } from '../../shell/trading-shell-context'
  import type { MarketQuote } from '../../feed/market-data'
  import MoveCell from './MoveCell.svelte'
  import { getDayChange } from './trading-columns'

  const { quote }: { quote: MarketQuote } = $props()
  const mode = useSelector(useTradingShellController().renderAtoms.rendererMode)
  const change = $derived(getDayChange(quote))
</script>

{#if mode.current === 'stable'}
  <MoveCell move={change} componentName="StableMoveCell" />
{:else if change >= 0}
  <MoveCell move={change} componentName="UpMoveCell" fixedDirection="up" />
{:else}
  <MoveCell move={change} componentName="DownMoveCell" fixedDirection="down" />
{/if}
