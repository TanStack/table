import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ControllerElement } from './controller-element'
import type { MarketFeedController } from '../feed/market-feed-controller'

@customElement('trading-app-header')
export class AppHeader extends ControllerElement {
  @property({ attribute: false }) feed!: MarketFeedController
  @property({ type: Boolean }) sidebarOpen = true
  @property({ attribute: false }) toggleSidebar: () => void = () => undefined
  protected firstUpdated() {
    this.observe(this.feed.workerReady)
    this.observe(this.feed.running)
  }
  protected render() {
    const workerReady = this.feed.workerReady.get()
    const running = this.feed.running.get()
    return html`<header class="app-bar">
      <div class="brand"><strong>MARKET MONITOR</strong></div>
      <div class="header-actions">
        <span
          class="feed-status ${workerReady && running ? 'is-running' : ''}"
          data-testid="feed-status"
          ><span class="status-dot" aria-hidden="true"></span
          >${!workerReady ? 'FEED CONNECTING' : running ? 'FEED LIVE' : 'FEED PAUSED'}</span
        ><button
          class="sidebar-toggle"
          type="button"
          aria-expanded=${this.sidebarOpen}
          aria-controls="benchmark-configurator"
          aria-label=${this.sidebarOpen ? 'Close configurator' : 'Open configurator'}
          @click=${this.toggleSidebar}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="2.5" y="3" width="15" height="14" rx="1.5"></rect>
            <path d="M12.5 3v14"></path>
          </svg>
        </button>
      </div>
    </header>`
  }
}
