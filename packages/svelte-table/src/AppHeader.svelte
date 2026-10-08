<script lang="ts">
  import { setContext, type Snippet } from 'svelte'

  interface Props {
    header: any
    headerComponents: any
    children: Snippet<[any]>
    contextKey?: any
  }

  let { children, header, headerComponents, contextKey }: Props = $props()

  if (contextKey) {
    setContext(contextKey, header)
  }
</script>

{@render children?.(Object.assign(header, headerComponents))}
