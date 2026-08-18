import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { on } from '@ember/modifier'
import { observeValue } from '../../utils/subscriptions'
import type Owner from '@ember/owner'
import type {
  MarketFeedController,
  MarketFeedState,
} from '../../feed/market-feed-controller'

interface Signature {
  Args: {
    feed: MarketFeedController
    sidebarOpen: boolean
    toggleSidebar: () => void
  }
}

export default class AppHeader extends Component<Signature> {
  @tracked feedState: MarketFeedState
  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args)
    this.feedState = args.feed.store.get()
    observeValue(this, args.feed.store, (state) => {
      this.feedState = state
    })
  }
  get status() {
    return !this.feedState.workerReady
      ? 'FEED CONNECTING'
      : this.feedState.running
        ? 'FEED LIVE'
        : 'FEED PAUSED'
  }
  <template>
    <header class='app-bar'>
      <div class='brand'><strong>MARKET MONITOR</strong></div>
      <div class='header-actions'>
        <span
          class='feed-status
            {{if
              (and this.feedState.workerReady this.feedState.running)
              "is-running"
            }}'
          data-testid='feed-status'
        >
          <span class='status-dot' aria-hidden='true'></span>{{this.status}}
        </span>
        <button
          class='sidebar-toggle'
          type='button'
          aria-expanded={{@sidebarOpen}}
          aria-controls='benchmark-configurator'
          aria-label={{if
            @sidebarOpen
            'Close configurator'
            'Open configurator'
          }}
          {{on 'click' @toggleSidebar}}
        >
          <svg viewBox='0 0 20 20' aria-hidden='true'><rect
              x='2.5'
              y='3'
              width='15'
              height='14'
              rx='1.5'
            ></rect><path d='M12.5 3v14'></path></svg>
        </button>
      </div>
    </header>
  </template>
}

const and = (left: boolean, right: boolean): boolean => left && right
