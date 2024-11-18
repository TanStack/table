import { debounce } from '@solid-primitives/scheduled'
import { Show } from 'solid-js'
import type { Person } from './makeData'
import type { _features } from './App'
import type { Column, Table } from '@tanstack/solid-table'

function ColumnFilter(props: {
  column: Column<typeof _features, Person, unknown>
  table: Table<typeof _features, Person>
}) {
  const firstValue = props.table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(props.column.id)

  const columnFilterValue = () => props.column.getFilterValue()

  return (
    <Show
      when={typeof firstValue === 'number'}
      fallback={
        <div>
          <input
            type="text"
            value={(columnFilterValue() ?? '') as string}
            onInput={debounce(
              (e) => props.column.setFilterValue(e.target.value),
              500,
            )}
            placeholder={`Search...`}
            class="w-36 border shadow rounded"
            list={`${props.column.id}list`}
          />
        </div>
      }
    >
      <div>
        <div class="flex space-x-2">
          <input
            type="number"
            min={0}
            max={100}
            value={
              (columnFilterValue() as [number, number] | undefined)?.[0] ?? ''
            }
            onInput={debounce(
              (e) =>
                props.column.setFilterValue(
                  (old: [number, number] | undefined) => [
                    e.target.value,
                    old?.[1] ?? '',
                  ],
                ),
              500,
            )}
            placeholder={`Min`}
            class="w-24 border shadow rounded"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={
              (columnFilterValue() as [number, number] | undefined)?.[1] ?? ''
            }
            onInput={debounce(
              (e) =>
                props.column.setFilterValue(
                  (old: [number, number] | undefined) => [
                    old?.[0] ?? '',
                    e.target.value,
                  ],
                ),
              500,
            )}
            placeholder={`Max`}
            class="w-24 border shadow rounded"
          />
        </div>
      </div>
    </Show>
  )
}

export default ColumnFilter
