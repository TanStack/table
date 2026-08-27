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

function visibleRangeLabel(virtualization: TradingRowVirtualization): string {
  const items = virtualization.virtualRows()
  if (items.length === 0) return 'Current · rows —'
  return `Current · rows ${items[0]!.index}..${items[items.length - 1]!.index}`
}

export function TradingTableFooter(props: TradingTableFooterProps) {
  return (
    <Show when={props.virtualized()}>
      <footer class="virtual-scroll-footer" data-testid="virtual-scroll-footer">
        <span>
          TanStack · Total · {props.rows().length} rows ·{' '}
          {props.table.getVisibleLeafColumns().length} columns
        </span>
        <span data-testid="visible-row-range">
          {visibleRangeLabel(props.virtualization)}
        </span>
      </footer>
    </Show>
  )
}
