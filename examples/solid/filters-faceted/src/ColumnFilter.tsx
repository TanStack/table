import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { For, Show, createMemo } from 'solid-js'
import type { Person } from './makeData'
import type { features } from './App'
import type { Column, Table } from '@tanstack/solid-table'

function ColumnFilter(props: {
  column: Column<typeof features, Person>
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

  const sortedUniqueValues = createMemo(() =>
    typeof firstValue === 'number'
      ? []
      : Array.from(props.column.getFacetedUniqueValues().keys()).sort(),
  )

  return (
    <Show
      when={typeof firstValue === 'number'}
      fallback={
        <div>
          <datalist id={`${props.column.id}list`}>
            <For each={sortedUniqueValues().slice(0, 5000)}>
              {(value: string) => <option value={value} />}
            </For>
          </datalist>
          <input
            type="text"
            value={(columnFilterValue() ?? '') as string}
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute(e.currentTarget.value)
            }
            placeholder={`Search... (${props.column.getFacetedUniqueValues().size})`}
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
            min={Number(props.column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(props.column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={
              (columnFilterValue() as [number, number] | undefined)?.[0] ?? ''
            }
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute((old: [number, number]) => [
                e.currentTarget.value,
                old[1],
              ])
            }
            placeholder={`Min ${
              props.column.getFacetedMinMaxValues()?.[0]
                ? `(${props.column.getFacetedMinMaxValues()?.[0]})`
                : ''
            }`}
            class="filter-input"
          />
          <input
            type="number"
            min={Number(props.column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(props.column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={
              (columnFilterValue() as [number, number] | undefined)?.[1] ?? ''
            }
            onInput={(e) =>
              columnFilterDebouncer.maybeExecute((old: [number, number]) => [
                old[0],
                e.currentTarget.value,
              ])
            }
            placeholder={`Max ${
              props.column.getFacetedMinMaxValues()?.[1]
                ? `(${props.column.getFacetedMinMaxValues()?.[1]})`
                : ''
            }`}
            class="filter-input"
          />
        </div>
      </div>
    </Show>
  )
}

export default ColumnFilter
