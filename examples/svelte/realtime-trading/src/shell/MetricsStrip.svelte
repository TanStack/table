<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useTradingShellController } from './trading-shell-context'
  const state = useSelector(useTradingShellController().store, ({ metrics, longAnimationFramesSupported }) => ({ metrics, longAnimationFramesSupported }))
  const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const formatMs = (value: number) => `${value.toFixed(2)} ms`
  const metrics = $derived(state.current.metrics)
  const items = $derived([
    { label: 'FRAME RATE (EST.)', value: metrics.rafCallbacksPerSecond.toFixed(1), detail: 'rAF callbacks/s · rolling 1 s', testId: 'frame-rate' },
    { label: 'AVG COMMIT', value: formatMs(metrics.averageCommitLatencyMs), detail: 'snapshot → DOM · rolling 3 s', testId: 'average-commit-latency' },
    { label: 'LONG FRAMES', value: state.current.longAnimationFramesSupported ? String(metrics.longAnimationFrames) : 'N/A', detail: state.current.longAnimationFramesSupported ? `since reset · worst ${formatMs(metrics.worstLongAnimationFrameMs)}` : 'unsupported by this browser', testId: 'long-frame-count' },
  ])
</script>

<section class="metrics-strip" aria-labelledby="live-health">
  <h2 id="live-health">LIVE HEALTH</h2>
  {#each items as item (item.label)}<article><span>{item.label}</span><strong data-testid={item.testId}>{item.value}</strong><small>{item.detail}</small></article>{/each}
  <article><span>THROUGHPUT</span><strong data-testid="throughput-rate">{rate.format(metrics.rowUpdatesPerSecond)} rows/s</strong><small>{metrics.stateApplicationsPerSecond.toFixed(1)} snapshots/s · rows deduplicated per snapshot</small></article>
</section>
