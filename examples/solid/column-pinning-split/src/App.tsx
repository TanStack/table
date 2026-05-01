import { faker } from '@faker-js/faker'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnVisibilityFeature,
  columnPinningFeature,
  columnOrderingFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
]

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const columns = defaultColumns
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(500_000))

  const table = createTable({
    _features,
    _rowModels: {},
    columns,
    get data() {
      return data()
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  const PinButtons = (props: {
    column: ReturnType<typeof table.getAllLeafColumns>[0]
  }) => (
    <div class="pin-actions">
      {props.column.getIsPinned() !== 'left' ? (
        <button class="pin-button" onClick={() => props.column.pin('left')}>
          {'<='}
        </button>
      ) : null}
      {props.column.getIsPinned() ? (
        <button class="pin-button" onClick={() => props.column.pin(false)}>
          X
        </button>
      ) : null}
      {props.column.getIsPinned() !== 'right' ? (
        <button class="pin-button" onClick={() => props.column.pin('right')}>
          {'=>'}
        </button>
      ) : null}
    </div>
  )

  return (
    <div class="demo-root">
      <div class="column-toggle-panel">
        <div class="column-toggle-panel-header">
          <label>
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />{' '}
            Toggle All
          </label>
        </div>
        <For each={table.getAllLeafColumns()}>
          {(column) => (
            <div class="column-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />{' '}
                {column.id}
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="spacer-md" />
      <div class="button-row">
        <button
          onClick={() => refreshData()}
          class="demo-button demo-button-sm"
        >
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} class="demo-button demo-button-sm">
          Stress Test (500k rows)
        </button>
        <button
          onClick={() => randomizeColumns()}
          class="demo-button demo-button-sm"
        >
          Shuffle Columns
        </button>
      </div>
      <div class="spacer-md" />
      <p class="demo-note">
        This example takes advantage of the "splitting" APIs. (APIs that have
        "left", "center", and "right" modifiers)
      </p>
      <div class="split-tables">
        <table class="outlined-table">
          <thead>
            <For each={table.getLeftHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <div class="nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <PinButtons column={header.column} />
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows.slice(0, 20)}>
              {(row) => (
                <tr>
                  <For each={row.getLeftVisibleCells()}>
                    {(cell) => (
                      <td>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <table class="outlined-table">
          <thead>
            <For each={table.getCenterHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <div class="nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <PinButtons column={header.column} />
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows.slice(0, 20)}>
              {(row) => (
                <tr>
                  <For each={row.getCenterVisibleCells()}>
                    {(cell) => (
                      <td>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <table class="outlined-table">
          <thead>
            <For each={table.getRightHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <div class="nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <PinButtons column={header.column} />
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows.slice(0, 20)}>
              {(row) => (
                <tr>
                  <For each={row.getRightVisibleCells()}>
                    {(cell) => (
                      <td>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
