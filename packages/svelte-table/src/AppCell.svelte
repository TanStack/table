<script lang="ts">
  import { setContext } from 'svelte'
  import { cellContextKey } from './context-keys'
  import { createLiveProxy } from './live-proxy'
  import type { Snippet } from 'svelte'

  interface Props {
    cell: any
    cellComponents: any
    children: Snippet<[any]>
  }

  let { children, cell, cellComponents }: Props = $props()

  const extendedCell = $derived(Object.assign(cell, cellComponents))

  // A keyed `{#each}` reuses this component when `data` is replaced, passing
  // a new cell with the same id. The context forwards to the current cell so
  // consumers never read the one this component was created with.
  setContext(
    cellContextKey,
    createLiveProxy(() => extendedCell),
  )
</script>

{@render children?.(extendedCell)}
