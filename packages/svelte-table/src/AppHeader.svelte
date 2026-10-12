<script lang="ts">
  import { setContext } from 'svelte'
  import { headerContextKey } from './context-keys'
  import { createLiveProxy } from './live-proxy'
  import type { Snippet } from 'svelte'

  interface Props {
    header: any
    headerComponents: any
    children: Snippet<[any]>
  }

  let { children, header, headerComponents }: Props = $props()

  const extendedHeader = $derived(Object.assign(header, headerComponents))

  // A keyed `{#each}` reuses this component when `data` is replaced, passing
  // a new header with the same id. The context forwards to the current header so
  // consumers never read the one this component was created with.
  setContext(
    headerContextKey,
    createLiveProxy(() => extendedHeader),
  )
</script>

{@render children?.(extendedHeader)}
