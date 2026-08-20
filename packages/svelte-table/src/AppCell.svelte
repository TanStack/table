<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    cell: any
    cellComponents: any
    children: Snippet<[any]>
  }

  let { children, cell, cellComponents }: Props = $props()
</script>

{@render children?.(Object.assign(cell, cellComponents))}
