<script lang="ts">
  import { setContext, untrack } from 'svelte'
  import { headerContextKey } from './context-keys'
  import type { Snippet } from 'svelte'

  interface Props {
    header: any
    headerComponents: any
    children: Snippet<[any]>
  }

  let { children, header, headerComponents }: Props = $props()

  setContext(
    headerContextKey,
    untrack(() => header),
  )
</script>

{@render children?.(Object.assign(header, headerComponents))}
