import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { Match, Switch } from 'solid-js'
import type { Person } from './makeData'
import type { features } from './App'
import type { Column, Table } from '@tanstack/solid-table'

function ColumnFilter(props: {
  column: Column<typeof features, Person, unknown>
  table: Table<typeof features, Person>
}) {
  const firstValue = props.table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(props.column.id)

  const columnFilterValue = () => props.column.getFilterValue()
  const columnFilterDebouncer = createDebouncer(
    (value: unknown) => props.column.setFilterValue(value),
    { wait: 500 },
  )

  return (
    <Switch
      fallback={
        <div>
          <input
            type="text"
            value={(columnFilterValue() ?? '') as string}
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute(e.currentTarget.value)
            }
            placeholder={`Search...`}
            class="filter-select"
            list={`${props.column.id}list`}
          />
        </div>
      }
    >
      <Match when={firstValue instanceof Date}>
        <div>
          <div class="filter-row">
            <input
              type="date"
              aria-label={`${props.column.id} min`}
              value={
                (columnFilterValue() as [string, string] | undefined)?.[0] ?? ''
              }
              onInput={(e) => {
                // Read the value now; `e.currentTarget` is gone after the debounce
                const value = e.currentTarget.value
                columnFilterDebouncer.maybeExecute(
                  (old: [string, string] | undefined) => [value, old?.[1]],
                )
              }}
              class="filter-input"
            />
            <input
              type="date"
              aria-label={`${props.column.id} max`}
              value={
                (columnFilterValue() as [string, string] | undefined)?.[1] ?? ''
              }
              onInput={(e) => {
                // Read the value now; `e.currentTarget` is gone after the debounce
                const value = e.currentTarget.value
                columnFilterDebouncer.maybeExecute(
                  (old: [string, string] | undefined) => [old?.[0], value],
                )
              }}
              class="filter-input"
            />
          </div>
        </div>
      </Match>
      <Match when={typeof firstValue === 'number'}>
        <div>
          <div class="filter-row">
            <input
              type="number"
              min={0}
              max={100}
              value={
                (columnFilterValue() as [number, number] | undefined)?.[0] ?? ''
              }
              onInput={(e) => {
                // Read the value now; `e.currentTarget` is gone after the debounce
                const value = e.currentTarget.value
                columnFilterDebouncer.maybeExecute(
                  (old: [number, number] | undefined) => [
                    value,
                    old?.[1] ?? '',
                  ],
                )
              }}
              placeholder={`Min`}
              class="filter-input"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={
                (columnFilterValue() as [number, number] | undefined)?.[1] ?? ''
              }
              onInput={(e) => {
                // Read the value now; `e.currentTarget` is gone after the debounce
                const value = e.currentTarget.value
                columnFilterDebouncer.maybeExecute(
                  (old: [number, number] | undefined) => [
                    old?.[0] ?? '',
                    value,
                  ],
                )
              }}
              placeholder={`Max`}
              class="filter-input"
            />
          </div>
        </div>
      </Match>
    </Switch>
  )
}

export default ColumnFilter
