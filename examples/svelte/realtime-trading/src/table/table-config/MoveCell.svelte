<script lang="ts">
  import { onMount } from 'svelte'
  import { formatSigned, quoteCellLifecycle, recordComponentRender } from './quote-cells'
  import type { QuoteComponentName } from './quote-cells'

  const { move, componentName, fixedDirection }: {
    move: number
    componentName: Extract<QuoteComponentName, 'StableMoveCell' | 'UpMoveCell' | 'DownMoveCell'>
    fixedDirection?: 'up' | 'down'
  } = $props()
  const direction = $derived(fixedDirection ?? (move >= 0 ? 'up' : 'down'))
  const indicator = $derived(fixedDirection === 'up' ? '▲ ' : fixedDirection === 'down' ? '▼ ' : '')
  $effect(() => { void move; recordComponentRender(componentName) })
  onMount(() => { quoteCellLifecycle.created++; return () => { quoteCellLifecycle.destroyed++ } })
</script>

<span class="move-cell quote-{direction}">{indicator}{formatSigned(move)}</span>
