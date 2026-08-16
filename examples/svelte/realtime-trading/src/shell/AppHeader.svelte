<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { useMarketFeedController } from './trading-shell-context'
  const { sidebarOpen, onSidebarToggle }: { sidebarOpen: boolean; onSidebarToggle: () => void } = $props()
  const state = useSelector(useMarketFeedController().store, ({ workerReady, running }) => ({ workerReady, running }))
</script>

<header class="app-bar">
  <div class="brand"><strong>MARKET MONITOR</strong></div>
  <div class="header-actions">
    <span class:is-running={state.current.workerReady && state.current.running} class="feed-status" data-testid="feed-status"><span class="status-dot" aria-hidden="true"></span>{!state.current.workerReady ? 'FEED CONNECTING' : state.current.running ? 'FEED LIVE' : 'FEED PAUSED'}</span>
    <button class="sidebar-toggle" type="button" aria-expanded={sidebarOpen} aria-controls="benchmark-configurator" aria-label={sidebarOpen ? 'Close configurator' : 'Open configurator'} onclick={onSidebarToggle}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="15" height="14" rx="1.5"></rect><path d="M12.5 3v14"></path></svg>
    </button>
  </div>
</header>
