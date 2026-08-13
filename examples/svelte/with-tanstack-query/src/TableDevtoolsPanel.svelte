<script lang="ts">
  import { onMount } from 'svelte'
  import { TableDevtoolsCore } from '@tanstack/table-devtools'

  let { theme = 'dark' }: { theme?: 'light' | 'dark' } = $props()
  let hostElement: HTMLDivElement

  onMount(() => {
    const devtools = new TableDevtoolsCore()
    void devtools.mount(hostElement, { theme, devtoolsOpen: true })

    return () => devtools.unmount()
  })
</script>

<div class="table-devtools-panel" bind:this={hostElement}></div>

<style>
  .table-devtools-panel {
    height: 100%;
  }
</style>
