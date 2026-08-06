import {
  FlexRender,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  sortFn_basic,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  TradingRow,
  readMeasuredRows,
  tradingColumns,
} from './trading-table-shared'
import { useTableBenchmark } from './benchmark/use-table-benchmark'
import {
  useTradingShellController,
  useTradingShellState,
} from './shell/trading-shell-context'
import type { MarketQuote } from './market-data'
import type { CoreTableState } from './trading-table-shared'

const localFeatures = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { basic: sortFn_basic },
})

export function LocalTradingTable() {
  const controller = useTradingShellController()
  const quotes = useTradingShellState((state) => state.displayQuotes)
  const scrollStressMode = useTradingShellState(
    (state) => state.scrollStressMode,
  )

  useTableBenchmark(controller, 'local', scrollStressMode)
  const table = useLocalTradingTable({
    quotes,
    tableAtoms: controller.tableAtoms,
  })

  return (
    <div className="table-scroll" data-table-adapter="local">
      <table style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {!header.isPlaceholder && <FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <LocalTradingTableBody table={table} quotes={quotes} />
      </table>
    </div>
  )
}

function useLocalTradingTable(props: {
  quotes: Array<MarketQuote>
  tableAtoms: ReturnType<typeof useTradingShellController>['tableAtoms']
}) {
  return useTable(
    {
      key: 'react-realtime-trading-local',
      features: localFeatures,
      columns: tradingColumns,
      data: props.quotes,
      getRowId: (row) => row.id,
      atoms: props.tableAtoms,
    },
    () => null,
  )
}

function LocalTradingTableBody(props: {
  table: ReturnType<typeof useLocalTradingTable>
  quotes: Array<MarketQuote>
}) {
  return (
    <props.table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {(coreState) => (
        <LocalTradingRows
          table={props.table}
          quoteSnapshot={props.quotes}
          coreState={coreState}
        />
      )}
    </props.table.Subscribe>
  )
}

function LocalTradingRows(props: {
  table: ReturnType<typeof useLocalTradingTable>
  quoteSnapshot: Array<MarketQuote>
  coreState: CoreTableState
}) {
  const rows = readLocalRows(props.table, props.quoteSnapshot, props.coreState)

  return (
    <tbody data-source-row-count={props.quoteSnapshot.length}>
      {rows.map((row) => (
        <TradingRow key={row.id} quote={row.original}>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className={
                cell.column.id !== 'symbol' && cell.column.id !== 'venue'
                  ? 'numeric-cell'
                  : undefined
              }
            >
              <FlexRender cell={cell} />
            </td>
          ))}
        </TradingRow>
      ))}
    </tbody>
  )
}

function readLocalRows(
  table: ReturnType<typeof useLocalTradingTable>,
  quoteSnapshot: Array<MarketQuote>,
  coreState: CoreTableState,
) {
  // These explicit inputs describe the external dependencies behind the
  // table's mutable row-model API to React Compiler.
  void quoteSnapshot
  void coreState
  return readMeasuredRows('local', () => table.getRowModel().rows)
}
