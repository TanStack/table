<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useTradingShellController } from './trading-shell-context'
  const state = useSelector(useTradingShellController().store)
  const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
</script>

<footer class="market-statusbar">
  <span>MESSAGE SAMPLES <strong>{integer.format(state.current.metrics.lastBatchSize)}</strong></span>
  <span>ROW UPDATES <strong>{integer.format(state.current.metrics.lastUpdateCount)}</strong></span>
  <span>HOSTS <strong>{integer.format(state.current.mountedCells)}</strong></span>
  <span>COMPONENTS <strong>{integer.format(state.current.liveComponents)}</strong></span>
</footer>
