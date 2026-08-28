import { FlexRender } from '@tanstack/solid-table'
import { Index, createMemo } from 'solid-js'
import { TradingRowDataProvider } from './trading-row-data-context'
import type { VirtualItem } from '@tanstack/solid-virtual'
import type { TradingColumnSet } from './table-config/trading-columns'
import type { TradingCell, TradingRow } from './trading-table-features'

export interface TradingTableRowProps {
  row: TradingRow
  columnVersion: TradingColumnSet
  selectedSymbol: string | null
  virtualItem?: VirtualItem
}

interface TradingTableCellProps {
  cell: TradingCell
  renderCell: TradingCell
}

export function TradingTableRow(props: TradingTableRowProps) {
  const currentCells = createMemo(() => props.row.getVisibleCells())
  const renderState = createMemo(
    () => ({
      rowId: props.row.id,
      columns: props.columnVersion,
      cells: currentCells(),
    }),
    undefined,
    {
      equals: (previous, next) =>
        previous.rowId === next.rowId &&
        previous.columns === next.columns &&
        haveSameCellOrder(previous.cells, next.cells),
    },
  )

  return (
    <TradingRowDataProvider quote={() => props.row.original}>
      <tr
        classList={{ 'virtual-table-row': props.virtualItem !== undefined }}
        style={
          props.virtualItem
            ? { transform: `translateY(${props.virtualItem.start}px)` }
            : undefined
        }
        data-virtual-index={props.virtualItem?.index}
        data-symbol={props.row.original.symbol}
        data-row-id={props.row.id}
        data-symbol-selected={
          props.selectedSymbol === props.row.original.symbol
            ? 'true'
            : undefined
        }
        title={props.virtualItem ? undefined : props.row.original.company}
        aria-selected={props.row.getIsSelected()}
      >
        <Index each={currentCells()}>
          {(cell, index) => (
            <TradingTableCell
              cell={cell()}
              renderCell={renderState().cells[index]}
            />
          )}
        </Index>
      </tr>
    </TradingRowDataProvider>
  )
}

function TradingTableCell(props: TradingTableCellProps) {
  const selection = createMemo(() => ({
    edges: props.cell.getSelectionEdges(),
    focused: props.cell.getIsFocused(),
    selected: props.cell.getIsSelected(),
    tabIndex: props.cell.getTabIndex(),
  }))

  return (
    <td
      style={{
        width: `calc(var(--col-${props.cell.column.id}-size) * 1px)`,
      }}
      data-column-id={props.cell.column.id}
      data-cell-focused={selection().focused ? 'true' : undefined}
      data-selection-top={selection().edges.top ? 'true' : undefined}
      data-selection-right={selection().edges.right ? 'true' : undefined}
      data-selection-bottom={selection().edges.bottom ? 'true' : undefined}
      data-selection-left={selection().edges.left ? 'true' : undefined}
      aria-selected={selection().selected}
      tabindex={selection().tabIndex}
    >
      <FlexRender cell={props.renderCell} />
    </td>
  )
}

function haveSameCellOrder(
  previous: ReadonlyArray<TradingCell>,
  next: ReadonlyArray<TradingCell>,
): boolean {
  return (
    previous.length === next.length &&
    previous.every((cell, index) => cell.column.id === next[index]?.column.id)
  )
}
