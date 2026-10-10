<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { cellContextKey } from './context-keys'
  import type { Snippet } from 'svelte'

  interface Props {
    cell: any
    cellComponents: any
    children: Snippet<[any]>
  }

  let { children, cell, cellComponents }: Props = $props()

  setContext(
    cellContextKey,
    untrack(() => cell),
  )
</script>

{@render children?.(Object.assign(cell, cellComponents))}
