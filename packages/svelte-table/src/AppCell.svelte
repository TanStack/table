<script lang="ts">
  import { setContext, type Snippet } from 'svelte'

  interface Props {
    cell: any
    cellComponents: any
    children: Snippet<[any]>
    contextKey?: any
  }

  let { children, cell, cellComponents, contextKey }: Props = $props()

  if (contextKey) {
    setContext(contextKey, cell)
  }
</script>

{@render children?.(Object.assign(cell, cellComponents))}
