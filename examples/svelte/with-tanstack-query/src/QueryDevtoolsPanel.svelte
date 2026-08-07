<script lang="ts">
  import { onMount } from 'svelte'
  import { onlineManager } from '@tanstack/svelte-query'
  import type { QueryClient } from '@tanstack/svelte-query'
  import type {
    TanstackQueryDevtoolsPanel,
    Theme,
  } from '@tanstack/query-devtools'

  let {
    client,
    theme = 'dark',
  }: { client: QueryClient; theme?: Theme } = $props()
  let hostElement: HTMLDivElement
  let devtools: TanstackQueryDevtoolsPanel | undefined

  onMount(() => {
    let disposed = false

    void import('@tanstack/query-devtools').then((module) => {
      if (disposed) return

      devtools = new module.TanstackQueryDevtoolsPanel({
        client,
        queryFlavor: 'Svelte Query',
        version: '5',
        onlineManager,
        theme,
      })
      devtools.mount(hostElement)
    })

    return () => {
      disposed = true
      devtools?.unmount()
    }
  })

  $effect(() => {
    devtools?.setClient(client)
    devtools?.setTheme(theme)
  })
</script>

<div class="query-devtools-panel" bind:this={hostElement}></div>

<style>
  .query-devtools-panel {
    height: 100%;
  }
</style>
