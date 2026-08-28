import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import AppHeader from './app-header.gts'
import Configurator from './configurator.gts'
import MarketStatusbar from './market-statusbar.gts'
import TradingTable from '../table/trading-table.gts'
import type { MarketFeedController } from '../../feed/market-feed-controller'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

interface Signature {
  Args: {
    controller: TradingBenchmarkController
    feed: MarketFeedController
  }
}

export default class TradingShell extends Component<Signature> {
  @tracked sidebarOpen = true
  toggleSidebar = () => {
    this.sidebarOpen = !this.sidebarOpen
  }
  get rootClass() {
    return `trading-terminal${this.sidebarOpen ? '' : ' is-sidebar-collapsed'}`
  }
  <template>
    <main class={{this.rootClass}}>
      <div class='shell-header'>
        <AppHeader
          @feed={{@feed}}
          @sidebarOpen={{this.sidebarOpen}}
          @toggleSidebar={{this.toggleSidebar}}
        />
        {{#if isDevelopment}}<aside class='development-warning'>DEV BUILD — use
            the production build before recording results.</aside>{{/if}}
      </div>
      <section class='market-panel' aria-label='Live synthetic quotes'>
        <TradingTable @controller={{@controller}} @feed={{@feed}} />
      </section>
      <MarketStatusbar @controller={{@controller}} />
      <div class='sidebar-slot'>{{#if this.sidebarOpen}}<Configurator
            @controller={{@controller}}
            @feed={{@feed}}
          />{{/if}}</div>
    </main>
  </template>
}

const isDevelopment = import.meta.env.DEV
