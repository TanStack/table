import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createAppColumnHelper, useAppTable } from './hooks/table'
import { makeData, makeProductData } from './makeData'
import type { Person, Product } from './makeData'
import './index.css'
// Import cell components directly - they use useCellContext internally

// Create column helpers with TFeatures already bound - only need TData!
const personColumnHelper = createAppColumnHelper<Person>()
const productColumnHelper = createAppColumnHelper<Product>()

// Users Table Component - Original implementation
function UsersTable() {
  // Data state
  const [data, setData] = useState(() => makeData(1000))

  // Refresh data callback
  const refreshData = useCallback(() => {
    setData(makeData(1000))
  }, [])

  const stressTest = useCallback(() => {
    setData(makeData(200_000))
  }, [])

  // Define columns using the column helper
  const columns = useMemo(
    () =>
      // NOTE: You must use `createAppColumnHelper` instead of `createColumnHelper` when using pre-bound components like <cell.TextCell />
      personColumnHelper.columns([
        personColumnHelper.accessor('firstName', {
          header: 'First Name',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.TextCell />,
        }),
        personColumnHelper.accessor('lastName', {
          header: 'Last Name',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.TextCell />,
        }),
        personColumnHelper.accessor('age', {
          header: 'Age',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.NumberCell />,
        }),
        personColumnHelper.accessor('visits', {
          header: 'Visits',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.NumberCell />,
        }),
        personColumnHelper.accessor('status', {
          header: 'Status',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.StatusCell />,
        }),
        personColumnHelper.accessor('progress', {
          header: 'Progress',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.ProgressCell />,
        }),
        personColumnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: ({ cell }) => <cell.RowActionsCell />,
        }),
      ]),
    [],
  )

  // Create the table - _features and _rowModels are already configured!
  const table = useAppTable(
    {
      columns,
      data,
      debugTable: true,
      // more table options
    },
    // (state) => state, // alternatively, subscribe to the entire state instead of using table.Subscribe or selectors down below
  )

  return (
    // Main selector on AppTable - selects all needed state in one place
    <table.AppTable
      selector={(state) => ({
        // subscribe to specific states for re-rendering if you are optimizing for maximum performance
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {({ sorting, columnFilters }) => (
        <div className="table-container">
          {/* Table toolbar using pre-bound component */}
          <table.TableToolbar title="Users Table" onRefresh={refreshData} />
          <div style={{ marginBottom: '8px' }}>
            <button onClick={() => refreshData()}>Regenerate Data</button>
            <button onClick={() => stressTest()}>
              Stress Test (200k rows)
            </button>
          </div>

          {/* Table element */}
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((h) => (
                    <table.AppHeader header={h} key={h.id}>
                      {(header) => (
                        <th
                          colSpan={header.colSpan}
                          className={
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              <header.FlexRender />
                              <header.SortIndicator />
                              <header.ColumnFilter />
                              {/* Show sort order number when multiple columns sorted */}
                              {sorting.length > 1 &&
                                sorting.findIndex(
                                  (s) => s.id === header.column.id,
                                ) > -1 && (
                                  <span className="sort-order">
                                    {sorting.findIndex(
                                      (s) => s.id === header.column.id,
                                    ) + 1}
                                  </span>
                                )}
                            </>
                          )}
                        </th>
                      )}
                    </table.AppHeader>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((c) => (
                    <table.AppCell cell={c} key={c.id}>
                      {(cell) => (
                        <td>
                          {/* Cell components are pre-bound via AppCell */}
                          <cell.FlexRender />
                        </td>
                      )}
                    </table.AppCell>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((f) => (
                    <table.AppFooter header={f} key={f.id}>
                      {(footer) => {
                        const columnId = footer.column.id
                        const hasFilter = columnFilters.some(
                          (cf) => cf.id === columnId,
                        )

                        return (
                          <td colSpan={footer.colSpan}>
                            {footer.isPlaceholder ? null : (
                              <>
                                {/* Use FooterSum for numeric columns, FooterColumnId for others */}
                                {columnId === 'age' ||
                                columnId === 'visits' ||
                                columnId === 'progress' ? (
                                  <>
                                    <footer.FooterSum />
                                    {hasFilter && (
                                      <span className="filtered-indicator">
                                        {' '}
                                        (filtered)
                                      </span>
                                    )}
                                  </>
                                ) : columnId === 'actions' ? null : (
                                  <>
                                    <footer.FooterColumnId />
                                    {hasFilter && (
                                      <span className="filtered-indicator">
                                        {' '}
                                        ✓
                                      </span>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        )
                      }}
                    </table.AppFooter>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>

          {/* Pagination using pre-bound component */}
          <table.PaginationControls />

          {/* Row count using pre-bound component */}
          <table.RowCount />
        </div>
      )}
    </table.AppTable>
  )
}

// Products Table Component - New implementation using same hook and components
function ProductsTable() {
  // Data state
  const [data, setData] = useState(() => makeProductData(500))

  // Refresh data callback
  const refreshData = useCallback(() => {
    setData(makeProductData(500))
  }, [])

  const stressTest = useCallback(() => {
    setData(makeProductData(200_000))
  }, [])

  // Define columns using the column helper - different structure than Users table
  const columns = useMemo(
    () =>
      productColumnHelper.columns([
        productColumnHelper.accessor('name', {
          header: 'Product Name',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.TextCell />,
        }),
        productColumnHelper.accessor('category', {
          header: 'Category',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.CategoryCell />,
        }),
        productColumnHelper.accessor('price', {
          header: 'Price',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.PriceCell />,
        }),
        productColumnHelper.accessor('stock', {
          header: 'In Stock',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.NumberCell />,
        }),
        productColumnHelper.accessor('rating', {
          header: 'Rating',
          footer: (props) => props.column.id,
          cell: ({ cell }) => <cell.ProgressCell />,
        }),
      ]),
    [],
  )

  // Create the table using the same useAppTable hook
  const table = useAppTable({
    debugTable: true,
    columns,
    data,
    getRowId: (row) => row.id,
  })

  return (
    <table.AppTable
      selector={(state) => ({
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {({ sorting, columnFilters }) => (
        <div className="table-container">
          {/* Table toolbar using the same pre-bound component */}
          <table.TableToolbar title="Products Table" onRefresh={refreshData} />
          <div style={{ marginBottom: '8px' }}>
            <button onClick={() => refreshData()}>Regenerate Data</button>
            <button onClick={() => stressTest()}>
              Stress Test (200k rows)
            </button>
          </div>

          {/* Table element */}
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((h) => (
                    <table.AppHeader header={h} key={h.id}>
                      {(header) => (
                        <th
                          colSpan={header.colSpan}
                          className={
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <>
                              <header.FlexRender />
                              <header.SortIndicator />
                              <header.ColumnFilter />
                              {sorting.length > 1 &&
                                sorting.findIndex(
                                  (s) => s.id === header.column.id,
                                ) > -1 && (
                                  <span className="sort-order">
                                    {sorting.findIndex(
                                      (s) => s.id === header.column.id,
                                    ) + 1}
                                  </span>
                                )}
                            </>
                          )}
                        </th>
                      )}
                    </table.AppHeader>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((c) => (
                    <table.AppCell cell={c} key={c.id}>
                      {(cell) => (
                        <td>
                          {/* Cell components are pre-bound via AppCell */}
                          <cell.FlexRender />
                        </td>
                      )}
                    </table.AppCell>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((f) => (
                    <table.AppFooter header={f} key={f.id}>
                      {(footer) => {
                        const columnId = footer.column.id
                        const hasFilter = columnFilters.some(
                          (cf) => cf.id === columnId,
                        )

                        return (
                          <td colSpan={footer.colSpan}>
                            {footer.isPlaceholder ? null : (
                              <>
                                {/* Use FooterSum for numeric columns, FooterColumnId for others */}
                                {columnId === 'price' ||
                                columnId === 'stock' ||
                                columnId === 'rating' ? (
                                  <>
                                    <footer.FooterSum />
                                    {hasFilter && (
                                      <span className="filtered-indicator">
                                        {' '}
                                        (filtered)
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <footer.FooterColumnId />
                                    {hasFilter && (
                                      <span className="filtered-indicator">
                                        {' '}
                                        ✓
                                      </span>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        )
                      }}
                    </table.AppFooter>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>

          {/* Pagination using the same pre-bound component */}
          <table.PaginationControls />

          {/* Row count using the same pre-bound component */}
          <table.RowCount />
        </div>
      )}
    </table.AppTable>
  )
}

function App() {
  return (
    <div className="app">
      <h1>Composable Tables Example</h1>
      <p className="description">
        Both tables below use the same <code>useAppTable</code> hook and
        shareable components, but with different data types and column
        configurations.
      </p>

      {/* Original Users Table */}
      <UsersTable />

      <div className="table-divider" />

      {/* New Products Table */}
      <ProductsTable />
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
