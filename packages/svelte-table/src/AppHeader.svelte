<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    header: any
    headerComponents: any
    children: Snippet<[any]>
  }

  let { children, header, headerComponents }: Props = $props()
</script>

{@render children?.(Object.assign(header, headerComponents))}
