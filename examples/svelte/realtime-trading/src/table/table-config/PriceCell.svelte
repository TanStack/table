<script lang="ts">
  import { onMount } from 'svelte'
  import { quoteCellLifecycle, recordComponentRender } from './quote-cells'

  const { price, move, onSelect }: { price: number; move: number; onSelect: () => void } = $props()
  $effect(() => { void price; void move; recordComponentRender('PriceCell') })
  onMount(() => { quoteCellLifecycle.created++; return () => { quoteCellLifecycle.destroyed++ } })
</script>

<button class:quote-up={move >= 0} class:quote-down={move < 0} class="price-button" onclick={onSelect}>{price.toFixed(2)}</button>
