import { shallowEqual, useStoreSelector } from '../use-store-value'
import type { MarketFeedController, MarketFeedState } from '../feed/market-feed-controller'

const selectFeedStatus = (state: MarketFeedState) => ({
  workerReady: state.workerReady,
  running: state.running,
})

export function AppHeader(props: {
  feed: MarketFeedController
  sidebarOpen: boolean
  toggleSidebar: () => void
}) @{
  const state = useStoreSelector(
    props.feed.store,
    selectFeedStatus,
    shallowEqual,
  )
  const status = !state.workerReady ? 'FEED CONNECTING' : state.running ? 'FEED LIVE' : 'FEED PAUSED'
  <header className="app-bar">
    <div className="brand"><strong>MARKET MONITOR</strong></div>
    <div className="header-actions">
      <span className={`feed-status ${state.workerReady && state.running ? 'is-running' : ''}`} data-testid="feed-status">
        <span className="status-dot" aria-hidden="true" />{status}
      </span>
      <button
        className="sidebar-toggle"
        type="button"
        aria-expanded={props.sidebarOpen}
        aria-controls="benchmark-configurator"
        aria-label={props.sidebarOpen ? 'Close configurator' : 'Open configurator'}
        onClick={props.toggleSidebar}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="15" height="14" rx="1.5" /><path d="M12.5 3v14" /></svg>
      </button>
    </div>
  </header>
}
