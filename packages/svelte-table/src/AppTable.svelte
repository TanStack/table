<script lang="ts">
  import { setContext, type Snippet } from 'svelte'

  interface Props {
    children: Snippet
    contextKey?: any
    table?: any
  }

  let { children, contextKey, table }: Props = $props()

  if (contextKey) {
    setContext(contextKey, table)
  }
</script>

{@render children?.()}
