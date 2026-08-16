<script lang="ts">
  import { onMount } from 'svelte'
  import { quoteCellLifecycle, recordComponentRender } from './quote-cells'

  const { value }: { value: number } = $props()
  $effect(() => { void value; recordComponentRender('PercentChangeCell') })
  onMount(() => { quoteCellLifecycle.created++; return () => { quoteCellLifecycle.destroyed++ } })
</script>

<span class:quote-up={value >= 0} class:quote-down={value < 0} class="percent-change-cell">{value >= 0 ? '+' : ''}{value.toFixed(2)}%</span>
