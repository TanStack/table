<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { tableContextKey } from './context-keys'
  import type { Snippet } from 'svelte'

  interface Props {
    table: any
    children: Snippet
  }

  let { children, table }: Props = $props()

  setContext(
    tableContextKey,
    untrack(() => table),
  )
</script>

{@render children?.()}
