import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core'
import { MarketFeedService } from '../feed/market-feed.service'

@Component({
  selector: 'app-shell-header',
  template: `
    <header class="app-bar">
      <div class="brand">
        <span class="brand-mark">TT</span>
        <strong>MARKET MONITOR</strong>
        <span class="environment">SIMULATED</span>
      </div>
      <div class="header-actions">
        <div class="session-info">
          <span>ANGULAR / FLEX RENDER</span>
          <span
            class="feed-status"
            data-testid="feed-status"
            [class.is-running]="feed.workerReady() && feed.running()"
          >
            <span class="status-dot" aria-hidden="true"></span>
            {{
              !feed.workerReady()
                ? 'FEED CONNECTING'
                : feed.running()
                  ? 'FEED LIVE'
                  : 'FEED PAUSED'
            }}
          </span>
        </div>
        <button
          class="sidebar-toggle"
          type="button"
          [attr.aria-expanded]="sidebarOpen()"
          aria-controls="benchmark-configurator"
          [attr.aria-label]="
            sidebarOpen() ? 'Close configurator' : 'Open configurator'
          "
          [attr.title]="
            sidebarOpen() ? 'Close configurator' : 'Open configurator'
          "
          (click)="sidebarToggle.emit()"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="2.5" y="3" width="15" height="14" rx="1.5"></rect>
            <path d="M12.5 3v14"></path>
          </svg>
        </button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellHeader {
  readonly feed = inject(MarketFeedService)
  readonly sidebarOpen = input.required<boolean>()
  readonly sidebarToggle = output<void>()
}
