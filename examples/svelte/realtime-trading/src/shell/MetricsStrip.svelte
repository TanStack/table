<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useTradingShellController } from './trading-shell-context'
  const state = useSelector(useTradingShellController().store, ({ metrics, longAnimationFramesSupported }) => ({ metrics, longAnimationFramesSupported }))
  const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const formatMs = (value: number) => `${value.toFixed(2)} ms`
  const metrics = $derived(state.current.metrics)
  const items = $derived([
    { label: 'WORKER SAMPLES', value: rate.format(metrics.actualTicksPerSecond), detail: 'generated samples/s', testId: 'actual-rate' },
    { label: 'ROW UPDATES', value: rate.format(metrics.rowUpdatesPerSecond), detail: 'unique rows applied/s', testId: 'row-update-rate' },
    { label: 'MESSAGES', value: metrics.workerMessagesPerSecond.toFixed(1), detail: 'worker messages/s', testId: 'message-rate' },
    { label: 'STATE APPLIES', value: metrics.stateApplicationsPerSecond.toFixed(1), detail: 'quote snapshots/s', testId: 'state-apply-rate' },
    { label: 'TABLE COMMITS', value: metrics.tableRendersPerSecond.toFixed(1), detail: 'completed renders/s', testId: 'table-render-rate' },
    { label: 'AVG RENDER', value: formatMs(metrics.averageRenderMs), detail: 'mutation → render' },
    { label: 'P95 RENDER', value: formatMs(metrics.p95RenderMs), detail: `max ${formatMs(metrics.maxRenderMs)}` },
    { label: 'LONG FRAMES', value: state.current.longAnimationFramesSupported ? String(metrics.longAnimationFrames) : 'N/A', detail: state.current.longAnimationFramesSupported ? `worst ${formatMs(metrics.worstLongAnimationFrameMs)}` : 'unsupported', testId: 'long-frame-count' },
  ])
</script>

<section class="metrics-strip" aria-label="Live performance metrics">
  {#each items as item (item.label)}<article><span>{item.label}</span><strong data-testid={item.testId}>{item.value}</strong><small>{item.detail}</small></article>{/each}
</section>
