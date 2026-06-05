import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { Show } from 'solid-js'
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
    <Show
      when={typeof firstValue === 'number'}
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
      <div>
        <div class="filter-row">
          <input
            type="number"
            min={0}
            max={100}
            value={
              (columnFilterValue() as [number, number] | undefined)?.[0] ?? ''
            }
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute(
                (old: [number, number] | undefined) => [
                  e.currentTarget.value,
                  old?.[1] ?? '',
                ],
              )
            }
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
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute(
                (old: [number, number] | undefined) => [
                  old?.[0] ?? '',
                  e.currentTarget.value,
                ],
              )
            }
            placeholder={`Max`}
            class="filter-input"
          />
        </div>
      </div>
    </Show>
  )
}

export default ColumnFilter
