import {
  createRoot,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'octane'
import { useCreateAtom } from '@tanstack/octane-store'
import {
  Subscribe,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { makeData } from './makeData'
import type {
  Column,
  OctaneTable,
  PaginationState,
  Row,
  RowSelectionState,
  TableState,
} from '@tanstack/octane-table'
import type { Person } from './makeData'
import './index.css'

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

type TableInstance = OctaneTable<typeof features, Person, null>
const columnHelper = createColumnHelper<typeof features, Person>()
const pageSizes = [10, 20, 30, 40, 50]

/**
 * This is an example showing how to use advanced re-rendering optimizations with more fine-grained control over what is subscribed to.
 * Subscribe/table.Subscribe is a higher-order component that allows you to subscribe to the table state or individual atoms/stores.
 * This is useful for making sure that re-renders only happen at certain parts of the Octane tree exactly where they need to be.
 * We recommend only using these patterns when you run into specific performance issues.
 */
function App() @{
  // Column definitions have a stable reference.
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'select',
          // Just import Subscribe if an Octane table is not available in scope and pass the table store as source.
          // It can be difficult to know what to subscribe to unless you understand every state dependency of the internal APIs.
          // Be careful to test and validate that it re-renders when you expect it to.
          header: ({ table }) => <Subscribe
            source={table.store}
            selector={(state) => state.rowSelection}
          >
            {() => <IndeterminateCheckbox
              ariaLabel="Select all rows"
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />}
          </Subscribe>,
          cell: ({ row, table }) => <RowCheckbox row={row} table={table as TableInstance} />,
        }),
        columnHelper.accessor('firstName', {
          header: 'First Name',
          cell: (info) => String(info.getValue()),
        }),
        columnHelper.accessor('lastName', {
          header: 'Last Name',
          cell: (info) => String(info.getValue()),
        }),
        columnHelper.accessor('age', { header: 'Age' }),
        columnHelper.accessor('visits', { header: 'Visits' }),
        columnHelper.accessor('status', { header: 'Status' }),
        columnHelper.accessor('progress', { header: 'Profile Progress' }),
      ]),
    [],
  )
  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // optionally, raise the selection state to your own atom
  const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

  const table = useTable(
    {
      debugTable: true,
      features,
      atoms: { rowSelection: rowSelectionAtom },
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: true, // enable row selection for all rows
      // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    },
    () => null, // subscribe to no table state by default; use table.Subscribe below for targeted updates
  )

  <div className="demo-root">
    <div>
      <button className="demo-button demo-button-spaced" onClick={refreshData}>
        Regenerate Data
      </button>
      <button className="demo-button demo-button-spaced" onClick={stressTest}>
        Stress Test (1M rows)
      </button>
    </div>
    {/* Identity-source subscription: only the global-filter island rerenders. */}
    <table.Subscribe source={table.atoms.globalFilter}>
      {(globalFilter: string | undefined) => <DebouncedInput
        ariaLabel="Global filter"
        value={globalFilter ?? ''}
        onChange={(value) => table.setGlobalFilter(value)}
        className="summary-panel"
        placeholder="Search all columns..."
      />}
    </table.Subscribe>
    <div className="spacer-sm" />
    <table>
      <thead>
        @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
          <tr>
            @for (const header of headerGroup.headers; key header.id) {
              <th colSpan={header.colSpan}>
                {header.isPlaceholder ? null : <>
                  <table.FlexRender header={header} />
                  {header.column.getCanFilter()
                    ? <div><Filter column={header.column} table={table} /></div>
                    : null}
                </>}
              </th>
            }
          </tr>
        }
      </thead>
      <tbody data-testid="row-model-subscription">
        {/* Subscribe the row model to filtering and pagination only. Row selection is handled per row below. */}
        <table.Subscribe
          selector={(state) => ({
            columnFilters: state.columnFilters,
            globalFilter: state.globalFilter,
            pagination: state.pagination,
          })}
        >
          {() => <SubscribedRows table={table} />}
        </table.Subscribe>
      </tbody>
      <tfoot>
        <tr>
          <td className="cell-padding">
            <table.Subscribe source={table.atoms.rowSelection}>
              {() => <IndeterminateCheckbox
                ariaLabel="Select all page rows"
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
              />}
            </table.Subscribe>
          </td>
          <td colSpan={20}>
            Page Rows ({String(table.getRowModel().rows.length)})
          </td>
        </tr>
      </tfoot>
    </table>
    <div className="spacer-sm" />
    <table.Subscribe selector={(state) => state.pagination}>
      {(pagination: PaginationState) => <div className="controls" data-testid="pagination-subscription">
        <button className="demo-button demo-button-sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
        <button className="demo-button demo-button-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
        <button className="demo-button demo-button-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
        <button className="demo-button demo-button-sm" onClick={() => table.lastPage()} disabled={!table.getCanLastPage()}>{'>>'}</button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>{String(pagination.pageIndex + 1)} of {String(table.getPageCount())}</strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={pagination.pageIndex + 1}
            onInput={(event) => {
              const value = event.currentTarget.value
              table.setPageIndex(value ? Number(value) - 1 : 0)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.currentTarget.value))}
        >
          @for (const pageSize of pageSizes; key pageSize) {
            <option value={pageSize}>Show {String(pageSize)}</option>
          }
        </select>
      </div>}
    </table.Subscribe>
    {/* Subscribe to the entire row-selection atom. */}
    <table.Subscribe source={table.atoms.rowSelection}>
      {(rowSelection: RowSelectionState) => <div data-testid="identity-source-subscription">
        {String(Object.keys(rowSelection).length)} of {String(table.getPreFilteredRowModel().rows.length)} Total Rows Selected
      </div>}
    </table.Subscribe>
    <hr />
    <br />
    <div>
      <button
        className="demo-button demo-button-spaced"
        onClick={() => console.info(
          'table.getSelectedRowModel().flatRows',
          table.getSelectedRowModel().flatRows,
        )}
      >
        Log table.getSelectedRowModel().flatRows
      </button>
    </div>
    <div>
      <label>Table State:</label>
      {/* Subscribe to the entire table state with the standalone component. */}
      <Subscribe source={table.store} selector={(state) => state}>
        {(state: TableState<typeof features>) => <pre data-testid="whole-store-subscription">{JSON.stringify(state, null, 2)}</pre>}
      </Subscribe>
    </div>
  </div>
}

function SubscribedRows({ table }: { table: TableInstance }) @{
  <>
    @for (const row of table.getRowModel().rows; key row.id) {
      <tr>
        @for (const cell of row.getAllCells(); key cell.id) {
          <td><table.FlexRender cell={cell} /></td>
        }
      </tr>
    }
  </>
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof features, Person>
  table: TableInstance
}) @{
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  <table.Subscribe source={table.atoms.columnFilters}>
    {() => typeof firstValue === 'number'
      ? <div className="filter-row">
        <DebouncedInput
          ariaLabel={`Minimum ${column.id}`}
          type="number"
          value={(column.getFilterValue() as [number, number] | undefined)?.[0] ?? ''}
          onChange={(value) => column.setFilterValue(
            (old: [number, number] | undefined) => [value, old?.[1]],
          )}
          placeholder="Min"
          className="filter-input"
        />
        <DebouncedInput
          ariaLabel={`Maximum ${column.id}`}
          type="number"
          value={(column.getFilterValue() as [number, number] | undefined)?.[1] ?? ''}
          onChange={(value) => column.setFilterValue(
            (old: [number, number] | undefined) => [old?.[0], value],
          )}
          placeholder="Max"
          className="filter-input"
        />
      </div>
      : <DebouncedInput
        ariaLabel={`Filter ${column.id}`}
        type="text"
        value={String(column.getFilterValue() ?? '')}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="filter-select"
      />}
  </table.Subscribe>
}

function RowCheckbox({
  row,
  table,
}: {
  row: Row<typeof features, Person>
  table: TableInstance
}) @{
  // Select only this row's selection value so toggling one row only re-renders that row's checkbox.
  <table.Subscribe
    source={table.atoms.rowSelection} // optimize to subscribe only to the row selection atom
    selector={(rowSelection) => Boolean(rowSelection[row.id])} // optimize to only re-render when the row selection changes for this row
  >
    {(selected: boolean) => <IndeterminateCheckbox
      ariaLabel={`Select row ${row.id}`}
      checked={selected}
      disabled={!row.getCanSelect()}
      indeterminate={row.getIsSomeSelected()}
      onChange={row.getToggleSelectedHandler()}
    />}
  </table.Subscribe>
}

// A debounced input Octane component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  className,
  ariaLabel,
  type = 'text',
}: {
  value: string | number
  onChange: (value: string) => void
  debounce?: number
  placeholder?: string
  className?: string
  ariaLabel: string
  type?: string
}) @{
  const [value, setValue] = useState(initialValue)
  const onChangeRef = useRef(onChange)
  const timeoutRef = useRef<number | undefined>(undefined)
  onChangeRef.current = onChange

  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  <input
    type={type}
    aria-label={ariaLabel}
    placeholder={placeholder}
    className={className}
    value={value}
    onInput={(event) => {
      const nextValue = event.currentTarget.value
      setValue(nextValue)
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(
        () => onChangeRef.current(nextValue),
        debounce,
      )
    }}
  />
}

function IndeterminateCheckbox({
  indeterminate,
  checked,
  disabled,
  onChange,
  ariaLabel,
}: {
  indeterminate?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
  ariaLabel: string
}) @{
  const ref = useRef<HTMLInputElement | null | null>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !checked && Boolean(indeterminate)
  }, [indeterminate, checked])

  <input
    ref={ref}
    type="checkbox"
    aria-label={ariaLabel}
    className="sortable-header"
    checked={checked}
    disabled={disabled}
    onChange={onChange}
  />
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
createRoot(rootElement).render(App)
