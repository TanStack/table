import { For, createSignal } from 'solid-js'
import { createAppColumnHelper, createAppTable } from './hooks/table'
import { makeData, makeProductData } from './makeData'
import type { Person, Product } from './makeData'
// Import cell components directly - they use useCellContext internally

// Create column helpers with TFeatures already bound - only need TData!
const personColumnHelper = createAppColumnHelper<Person>()
const productColumnHelper = createAppColumnHelper<Product>()

// Users Table Component - Original implementation
function UsersTable() {
  // Data state
  const [data, setData] = createSignal(makeData(1000))

  // Refresh data callback
  const refreshData = () => {
    setData(() => makeData(1000))
  }

  // Define columns using the column helper
  const columns =
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
    ])

  // Create the table - _features and _rowModels are already configured!
  const table = createAppTable({
    columns,
    get data() {
      return data()
    },
    debugTable: true,
    // more table options
  })

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
      {(state) => {
        const sorting = () => state().sorting
        const columnFilters = () => state().columnFilters
        return (
          <div class="table-container">
            {/* Table toolbar using pre-bound component */}
            <table.TableToolbar title="Users Table" onRefresh={refreshData} />

            {/* Table element */}
            <table>
              <thead>
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(h) => (
                          <table.AppHeader header={h}>
                            {(header) => (
                              <th
                                colSpan={header.colSpan}
                                class={
                                  header.column.getCanSort()
                                    ? 'sortable-header'
                                    : ''
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {header.isPlaceholder ? null : (
                                  <>
                                    <header.FlexRender />
                                    <header.SortIndicator />
                                    <header.ColumnFilter />
                                    {/* Show sort order number when multiple columns sorted */}
                                    {sorting().length > 1 &&
                                      sorting().findIndex(
                                        (s) => s.id === header.column.id,
                                      ) > -1 && (
                                        <span class="sort-order">
                                          {sorting().findIndex(
                                            (s) => s.id === header.column.id,
                                          ) + 1}
                                        </span>
                                      )}
                                  </>
                                )}
                              </th>
                            )}
                          </table.AppHeader>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </thead>
              <tbody>
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <tr>
                      <For each={row.getAllCells()}>
                        {(c) => (
                          <table.AppCell cell={c}>
                            {(cell) => (
                              <td>
                                {/* Cell components are pre-bound via AppCell */}
                                <cell.FlexRender />
                              </td>
                            )}
                          </table.AppCell>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
              <tfoot>
                <For each={table.getFooterGroups()}>
                  {(footerGroup) => (
                    <tr>
                      <For each={footerGroup.headers}>
                        {(f) => (
                          <table.AppFooter header={f}>
                            {(footer) => {
                              const columnId = footer.column.id
                              const hasFilter = () =>
                                columnFilters().some((cf) => cf.id === columnId)

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
                                          {hasFilter() && (
                                            <span class="filtered-indicator">
                                              {' '}
                                              (filtered)
                                            </span>
                                          )}
                                        </>
                                      ) : columnId === 'actions' ? null : (
                                        <>
                                          <footer.FooterColumnId />
                                          {hasFilter() && (
                                            <span class="filtered-indicator">
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
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tfoot>
            </table>

            {/* Pagination using pre-bound component */}
            <table.PaginationControls />

            {/* Row count using pre-bound component */}
            <table.RowCount />
          </div>
        )
      }}
    </table.AppTable>
  )
}

// Products Table Component - New implementation using same hook and components
function ProductsTable() {
  // Data state
  const [data, setData] = createSignal(makeProductData(500))

  // Refresh data callback
  const refreshData = () => {
    setData(makeProductData(500))
  }

  // Define columns using the column helper - different structure than Users table
  const columns = productColumnHelper.columns([
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
  ])

  // Create the table using the same createAppTable hook
  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data()
    },
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
      {(state) => {
        const sorting = () => state().sorting
        const columnFilters = () => state().columnFilters
        return (
          <div class="table-container">
            {/* Table toolbar using the same pre-bound component */}
            <table.TableToolbar
              title="Products Table"
              onRefresh={refreshData}
            />

            {/* Table element */}
            <table>
              <thead>
                <For each={table.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(h) => (
                          <table.AppHeader header={h}>
                            {(header) => (
                              <th
                                colSpan={header.colSpan}
                                class={
                                  header.column.getCanSort()
                                    ? 'sortable-header'
                                    : ''
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {header.isPlaceholder ? null : (
                                  <>
                                    <header.FlexRender />
                                    <header.SortIndicator />
                                    <header.ColumnFilter />
                                    {sorting().length > 1 &&
                                      sorting().findIndex(
                                        (s) => s.id === header.column.id,
                                      ) > -1 && (
                                        <span class="sort-order">
                                          {sorting().findIndex(
                                            (s) => s.id === header.column.id,
                                          ) + 1}
                                        </span>
                                      )}
                                  </>
                                )}
                              </th>
                            )}
                          </table.AppHeader>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </thead>
              <tbody>
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <tr>
                      <For each={row.getAllCells()}>
                        {(c) => (
                          <table.AppCell cell={c}>
                            {(cell) => (
                              <td>
                                {/* Cell components are pre-bound via AppCell */}
                                <cell.FlexRender />
                              </td>
                            )}
                          </table.AppCell>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
              <tfoot>
                <For each={table.getFooterGroups()}>
                  {(footerGroup) => (
                    <tr>
                      <For each={footerGroup.headers}>
                        {(f) => (
                          <table.AppFooter header={f}>
                            {(footer) => {
                              const columnId = footer.column.id
                              const hasFilter = () =>
                                columnFilters().some((cf) => cf.id === columnId)

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
                                          {hasFilter() && (
                                            <span class="filtered-indicator">
                                              {' '}
                                              (filtered)
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <footer.FooterColumnId />
                                          {hasFilter() && (
                                            <span class="filtered-indicator">
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
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tfoot>
            </table>

            {/* Pagination using the same pre-bound component */}
            <table.PaginationControls />

            {/* Row count using the same pre-bound component */}
            <table.RowCount />
          </div>
        )
      }}
    </table.AppTable>
  )
}

function App() {
  return (
    <div class="app">
      <h1>Composable Tables Example</h1>
      <p class="description">
        Both tables below use the same <code>createAppTable</code> hook and
        shareable components, but with different data types and column
        configurations.
      </p>

      {/* Original Users Table */}
      <UsersTable />

      <div class="table-divider" />

      {/* New Products Table */}
      <ProductsTable />
    </div>
  )
}

export default App
