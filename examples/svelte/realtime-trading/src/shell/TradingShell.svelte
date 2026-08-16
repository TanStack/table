<script lang="ts">
  import type { Snippet } from 'svelte'
  import AppHeader from './AppHeader.svelte'
  import Configurator from './Configurator.svelte'
  import MarketStatusbar from './MarketStatusbar.svelte'
  import MetricsStrip from './MetricsStrip.svelte'
  const { children }: { children: Snippet } = $props()
  const layout = $state({ sidebarOpen: true })
</script>

<main class:is-sidebar-collapsed={!layout.sidebarOpen} class="trading-terminal">
  <div class="shell-header"><AppHeader sidebarOpen={layout.sidebarOpen} onSidebarToggle={() => { layout.sidebarOpen = !layout.sidebarOpen }} />{#if import.meta.env.DEV}<aside class="development-warning">DEV BUILD — use the production build before recording results.</aside>{/if}</div>
  <section class="market-panel" aria-label="Live synthetic quotes"><MetricsStrip />{@render children()}</section>
  <MarketStatusbar />
  <div class="sidebar-slot">{#if layout.sidebarOpen}<Configurator />{/if}</div>
</main>
