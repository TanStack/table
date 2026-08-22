<script lang="ts">
  import { onMount } from 'svelte'
  import { quoteCellLifecycle, recordComponentRender, sparklinePoints } from './quote-cells'

  const { values }: { values: ReadonlyArray<number> } = $props()
  const rising = $derived((values.at(-1) ?? 0) >= (values[0] ?? 0))
  const points = $derived(sparklinePoints(values))
  $effect(() => { void values; recordComponentRender('SparklineCell') })
  onMount(() => { quoteCellLifecycle.created++; return () => { quoteCellLifecycle.destroyed++ } })
</script>

<svg class:quote-up={rising} class:quote-down={!rising} class="sparkline" viewBox="0 0 100 24" preserveAspectRatio="none"><polyline {points} /></svg>
