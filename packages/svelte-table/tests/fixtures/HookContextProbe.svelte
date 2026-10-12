<script lang="ts">
  import { getContext } from 'svelte'
  import {
    cellContextKey,
    headerContextKey,
    tableContextKey,
  } from '../../src/context-keys'

  const visible = [tableContextKey, cellContextKey, headerContextKey].filter(
    (key) => getContext(key) !== undefined,
  )
</script>

<output aria-label="Contexts outside the wrappers">{visible.join(',')}</output>
