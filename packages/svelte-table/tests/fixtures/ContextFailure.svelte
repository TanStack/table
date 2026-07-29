<script lang="ts">
  import { untrack } from 'svelte'

  interface Props {
    readContext: () => unknown
  }

  let { readContext }: Props = $props()

  untrack(() => readContext())
</script>
