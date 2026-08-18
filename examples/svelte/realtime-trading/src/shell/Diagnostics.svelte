<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useTradingShellController } from './trading-shell-context'
  import type { NamedInvocationRate } from '../benchmark/benchmark-monitor'

  const state = useSelector(useTradingShellController().store)
  const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  const rate = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const ms = (value: number) => `${value.toFixed(2)} ms`
  const invocationRates = (values: ReadonlyArray<NamedInvocationRate>) => {
    const active = values.filter((entry) => entry.callsPerSecond > 0)
    return active.length === 0 ? '—' : active.map((entry) => `${entry.name} ${rate.format(entry.callsPerSecond)}`).join(' · ')
  }
  const metrics = $derived(state.current.metrics)
  const items = $derived([
    ['Worker samples / s', rate.format(metrics.actualTicksPerSecond), 'actual-rate'],
    ['Worker messages / s', metrics.workerMessagesPerSecond.toFixed(1), 'message-rate'],
    ['Changed rows / s', rate.format(metrics.rowUpdatesPerSecond), 'row-update-rate'],
    ['Snapshots applied / s', metrics.stateApplicationsPerSecond.toFixed(1), 'state-apply-rate'],
    ['DOM commits / s', metrics.tableCommitsPerSecond.toFixed(1), 'table-render-rate'],
    ['P95 / max commit latency', `${ms(metrics.p95CommitLatencyMs)} / ${ms(metrics.maxCommitLatencyMs)}`],
    ['Mounted cells', integer.format(state.current.mountedCells)],
    ['Live components', integer.format(state.current.liveComponents)],
    ['Created / destroyed', `${integer.format(metrics.componentsCreated)} / ${integer.format(metrics.componentsDestroyed)}`],
    ['Renderer callbacks / s', rate.format(metrics.cellRendererCallsPerSecond), 'cell-render-rate'],
    ['Component executions / s', rate.format(metrics.componentRenderCallsPerSecond), 'component-render-rate'],
    ['Executions by component / s', invocationRates(metrics.componentRenderRates), 'component-render-breakdown'],
    ['Callbacks by column / s', invocationRates(metrics.cellRendererRates), 'cell-render-breakdown'],
    ['Observed MutationRecords / s', rate.format(metrics.domMutationsPerSecond), 'dom-mutation-rate'],
    ['Core row model calls / s', metrics.rowModelCallsPerSecond.toFixed(1), 'row-model-call-rate'],
    ['Core row model avg / max', `${ms(metrics.rowModelAverageMs)} / ${ms(metrics.rowModelMaxMs)}`, 'row-model-duration'],
    ['Visible rows', integer.format(metrics.visibleRows), 'visible-row-count'],
    ['Worker messages', integer.format(metrics.workerMessages), 'worker-messages'],
    ['Worker-coalesced updates / s', rate.format(metrics.supersededUpdatesPerSecond), 'superseded-update-rate'],
    ['Last samples / updated rows', `${integer.format(metrics.lastBatchSize)} / ${integer.format(metrics.lastUpdateCount)}`],
    ['Commits > 16.7 ms', integer.format(metrics.slowCommits)],
    ['JS heap (GC-sensitive)', metrics.heapMb === null ? 'N/A' : `${metrics.heapMb.toFixed(1)} MB`],
  ] as const)
</script>

<section class="config-section diagnostics" aria-labelledby="diagnostics"><h2 id="diagnostics">DIAGNOSTICS</h2><dl>
  {#each items as item (item[0])}<div><dt>{item[0]}</dt><dd data-testid={item[2]}>{item[1]}</dd></div>{/each}
</dl></section>
