import { Index, Show, createMemo } from 'solid-js'
import { createTradingGridSelectionHandlers } from './table-interactions'
import { TradingTableRow } from './trading-table-row'
import type { Accessor, JSX } from 'solid-js'
import type { TradingColumnSet } from './table-config/trading-columns'
import type { TradingRowVirtualization } from './trading-row-virtualizer'
import type {
  TradingRow,
  TradingTableInstance,
} from './trading-table-features'

export interface TradingTableBodyProps {
  table: TradingTableInstance
  rows: Accessor<Array<TradingRow>>
  columnVersion: Accessor<TradingColumnSet>
  selectedSymbol: Accessor<string | null>
  virtualized: Accessor<boolean>
  virtualization: TradingRowVirtualization
  selectSymbol: (symbol: string) => void
}

export function TradingTableBody(props: TradingTableBodyProps) {
  const bodyProps = createTradingTableBodyProps(props)

  return (
    <tbody {...bodyProps}>
      <Show
        when={props.virtualized()}
        fallback={<FullTableRows {...props} />}
      >
        <VirtualTableRows {...props} />
      </Show>
    </tbody>
  )
}

function FullTableRows(props: TradingTableBodyProps) {
  return (
    <Index each={props.rows()}>
      {(row) => (
        <TradingTableRow
          row={row()}
          columnVersion={props.columnVersion()}
          selectedSymbol={props.selectedSymbol()}
        />
      )}
    </Index>
  )
}

function VirtualTableRows(props: TradingTableBodyProps) {
  return (
    <Index each={props.virtualization.virtualRows()}>
      {(virtualRow) => {
        const row = createMemo(() => props.rows()[virtualRow().index])
        return (
          <TradingTableRow
            row={row()}
            columnVersion={props.columnVersion()}
            selectedSymbol={props.selectedSymbol()}
            virtualItem={virtualRow()}
          />
        )
      }}
    </Index>
  )
}

function createTradingTableBodyProps(
  options: TradingTableBodyProps,
): JSX.IntrinsicElements['tbody'] {
  const selectionHandlers = createTradingGridSelectionHandlers(
    options.table,
    options.selectSymbol,
  )

  return {
    ...selectionHandlers,
    get classList() {
      return { 'virtual-table-body': options.virtualized() }
    },
    get style() {
      const height = options.virtualization.bodyHeight()
      return height === undefined ? undefined : { height }
    },
  }
}
