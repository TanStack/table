import { createSignal } from 'solid-js'
import {
  useMarketFeedController,
  useTradingShellController,
} from '../shell/trading-shell-context'
import { createTradingTableModel } from './create-trading-table-model'
import {
  createTradingGridProps,
  createTradingTableElementProps,
} from './trading-grid-props'
import {
  createFeedCommitTracking,
  createTableAutoFit,
} from './trading-table-effects'
import { createTradingRowVirtualization } from './trading-row-virtualizer'
import { TradingTableBody } from './trading-table-body'
import { TradingTableFooter } from './trading-table-footer'
import { TradingTableHeader } from './trading-table-header'

export function TradingTable() {
  const feed = useMarketFeedController()
  const { state, actions } = useTradingShellController()
  const [scrollElement, setScrollElement] =
    createSignal<HTMLDivElement | null>(null)
  const virtualized = () => state.virtualScrollMode() === 'tanstack'
  const model = createTradingTableModel({
    quotes: feed.state.quotes,
    rendererMode: state.rendererMode,
    onSelectSymbol: actions.selectSymbol,
  })
  const virtualization = createTradingRowVirtualization({
    rows: model.rows,
    scrollElement,
    enabled: virtualized,
    onRenderedRowCount: actions.setRenderedRowCount,
  })
  const elementOptions = { table: model.table, virtualized }
  const gridProps = createTradingGridProps(elementOptions)
  const tableProps = createTradingTableElementProps(
    elementOptions,
    model.tableStyle,
  )

  createFeedCommitTracking(feed.state.quotes, feed.completeRender)
  createTableAutoFit(model.table, scrollElement)

  return (
    <>
      <div
        {...gridProps}
        ref={(element) => {
          setScrollElement(element)
        }}
      >
        <table {...tableProps}>
          <TradingTableHeader table={model.table} />
          <TradingTableBody
            table={model.table}
            rows={model.rows}
            columnVersion={model.columns}
            selectedSymbol={state.selectedSymbol}
            virtualized={virtualized}
            virtualization={virtualization}
            selectSymbol={actions.selectSymbol}
          />
        </table>
      </div>
      <TradingTableFooter
        table={model.table}
        rows={model.rows}
        virtualized={virtualized}
        virtualization={virtualization}
      />
    </>
  )
}
