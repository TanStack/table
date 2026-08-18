import { Show } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { TradingRowVirtualization } from './trading-row-virtualizer'
import type { TradingRow, TradingTableInstance } from './trading-table-features'

export interface TradingTableFooterProps {
  table: TradingTableInstance
  rows: Accessor<Array<TradingRow>>
  virtualized: Accessor<boolean>
  virtualization: TradingRowVirtualization
}

export function TradingTableFooter(props: TradingTableFooterProps) {
  return (
    <Show when={props.virtualized()}>
      <footer
        class="virtual-scroll-footer"
        data-testid="virtual-scroll-footer"
      >
        <span>
          TanStack · Total · {props.rows().length} rows ·{' '}
          {props.table.getVisibleLeafColumns().length} columns
        </span>
        <span data-testid="visible-row-range">
          <Show
            when={props.virtualization.visibleRange()}
            fallback={'Current · rows —'}
          >
            {(range) => `Current · rows ${range().start}..${range().end}`}
          </Show>
        </span>
      </footer>
    </Show>
  )
}
