import { createRoot, useState } from 'octane'
import { createTableHook } from '@tanstack/octane-table'
import './index.css'

// This example uses the new `createTableHook` method to create a re-usable table hook factory instead of independently using the standalone `useTable` hook and `createColumnHelper` method. You can choose to use either way.

// 1. Define what the shape of your data will be for each row
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 2. Create some dummy data with a stable reference (this could be an API response stored in useState or similar)
const defaultData: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24, visits: 100, status: 'In Relationship', progress: 50 },
  { firstName: 'tandy', lastName: 'miller', age: 40, visits: 40, status: 'Single', progress: 80 },
  { firstName: 'joe', lastName: 'dirte', age: 45, visits: 20, status: 'Complicated', progress: 10 },
  { firstName: 'kevin', lastName: 'vandy', age: 28, visits: 100, status: 'Single', progress: 70 },
]

function CellValue() @{
  const cell = useCellContext()
  <span data-registered-cell="true">{String(cell.renderValue())}</span>
}

function HeaderValue() @{
  const header = useHeaderContext()
  <span data-registered-header="true">{String(header.column.id)}</span>
}

// 3. New in V9! Tell the table which features and row models we want to use. In this case, this will be a basic table with no additional features
const {
  useAppTable,
  createAppColumnHelper,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features: {},
  debugTable: true,
  cellComponents: { CellValue },
  headerComponents: { HeaderValue },
})

// 4. Create a helper object to help define our columns
const columnHelper = createAppColumnHelper<Person>()

// 5. Define the columns for your table with a stable reference (in this case, defined statically outside of an Octane component)
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name', footer: (info) => info.column.id }),
  columnHelper.accessor((row) => row.lastName, { id: 'lastName', header: 'Last Name', footer: (info) => info.column.id }),
  columnHelper.accessor((row) => Number(row.age), { id: 'age', header: 'Age', footer: (info) => info.column.id }),
  columnHelper.accessor('visits', { header: 'Visits', footer: (info) => info.column.id }),
  columnHelper.accessor('status', { header: 'Status', footer: (info) => info.column.id }),
  columnHelper.accessor('progress', { header: 'Profile Progress', footer: (info) => info.column.id }),
])

function App() @{
  // 6. Store data with a stable reference
  const [data] = useState(() => [...defaultData])

  // 7. Create the table instance with the required columns and data.
  // Features and row models are already defined in the createTableHook call above.
  const table = useAppTable(
    {
      debugTable: true,
      columns,
      data,
      // add additional table options here or in the createTableHook call above
    },
    (state) => state, // default selector
  )

  // 8. Render your table markup from the table instance APIs
  <table.AppTable>
    <div className="demo-root">
      <table>
        <thead>
          @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
            <tr>
              @for (const header of headerGroup.headers; key header.id) {
                <table.AppHeader header={header}>
                  {(appHeader) => <th>
                    {header.isPlaceholder ? null : <appHeader.FlexRender />}
                    <appHeader.HeaderValue />
                  </th>}
                </table.AppHeader>
              }
            </tr>
          }
        </thead>
        <tbody>
          @for (const row of table.getRowModel().rows; key row.id) {
            <tr>
              @for (const cell of row.getAllCells(); key cell.id) {
                <table.AppCell cell={cell}>
                  {(appCell) => <td>
                    <appCell.CellValue />
                  </td>}
                </table.AppCell>
              }
            </tr>
          }
        </tbody>
        <tfoot>
          @for (const footerGroup of table.getFooterGroups(); key footerGroup.id) {
            <tr>
              @for (const header of footerGroup.headers; key header.id) {
                <table.AppFooter header={header}>
                  {(appFooter) => <th><appFooter.FlexRender /></th>}
                </table.AppFooter>
              }
            </tr>
          }
        </tfoot>
      </table>
    </div>
  </table.AppTable>
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
createRoot(rootElement).render(App)
