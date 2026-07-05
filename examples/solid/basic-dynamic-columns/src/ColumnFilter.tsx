import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { For, Match, Show, Switch, createMemo } from 'solid-js'
import type { DataType, DynamicRow, features } from './App'
import type { Column, Table } from '@tanstack/solid-table'

// A different filter UI per data type. Solid's fine-grained reactivity keeps the
// reads (getFilterValue, the faceted values) fresh on their own, so unlike the React
// version there's no Subscribe wrapper needed. Text / range inputs are debounced via
// the solid-pacer debouncer; the enum and boolean selects apply immediately.
function ColumnFilter(props: {
  column: Column<typeof features, DynamicRow>
  table: Table<typeof features, DynamicRow>
}) {
  const dataType = (): DataType =>
    props.column.columnDef.meta?.dataType ?? 'string'

  const filterValue = () => props.column.getFilterValue()

  const filterDebouncer = createDebouncer(
    (value: unknown) => props.column.setFilterValue(value),
    { wait: 500 },
  )

  // number range hints
  const minMax = () => props.column.getFacetedMinMaxValues() ?? []

  // string: low-cardinality columns become a select of their faceted values,
  // everything else gets a free-text search.
  const uniqueValues = createMemo(() =>
    Array.from(props.column.getFacetedUniqueValues().keys()).map(String).sort(),
  )
  const isEnum = () => uniqueValues().length > 0 && uniqueValues().length <= 10

  return (
    <Switch
      fallback={
        <Show
          when={isEnum()}
          fallback={
            <input
              type="text"
              value={(filterValue() ?? '') as string}
              onInput={(e) =>
                filterDebouncer.maybeExecute(e.currentTarget.value)
              }
              placeholder={`Search... (${props.column.getFacetedUniqueValues().size})`}
              class="filter-input"
            />
          }
        >
          <select
            class="filter-select"
            value={(filterValue() ?? '').toString()}
            onChange={(e) => props.column.setFilterValue(e.currentTarget.value)}
          >
            <option value="">All</option>
            <For each={uniqueValues()}>
              {(value) => <option value={value}>{value}</option>}
            </For>
          </select>
        </Show>
      }
    >
      <Match when={dataType() === 'number'}>
        <div class="filter-row">
          <input
            type="number"
            value={(filterValue() as [number, number] | undefined)?.[0] ?? ''}
            onInput={(e) =>
              filterDebouncer.maybeExecute(
                (old: [number, number] | undefined) => [
                  e.currentTarget.value,
                  old?.[1],
                ],
              )
            }
            placeholder={`Min${
              minMax()[0] !== undefined ? ` (${minMax()[0]})` : ''
            }`}
            class="filter-input"
          />
          <input
            type="number"
            value={(filterValue() as [number, number] | undefined)?.[1] ?? ''}
            onInput={(e) =>
              filterDebouncer.maybeExecute(
                (old: [number, number] | undefined) => [
                  old?.[0],
                  e.currentTarget.value,
                ],
              )
            }
            placeholder={`Max${
              minMax()[1] !== undefined ? ` (${minMax()[1]})` : ''
            }`}
            class="filter-input"
          />
        </div>
      </Match>

      <Match when={dataType() === 'date'}>
        <div class="filter-row">
          <input
            type="date"
            value={(filterValue() as [string, string] | undefined)?.[0] ?? ''}
            onInput={(e) =>
              filterDebouncer.maybeExecute(
                (old: [string, string] | undefined) => [
                  String(e.currentTarget.value),
                  old?.[1] ?? '',
                ],
              )
            }
            class="filter-input"
          />
          <input
            type="date"
            value={(filterValue() as [string, string] | undefined)?.[1] ?? ''}
            onInput={(e) =>
              filterDebouncer.maybeExecute(
                (old: [string, string] | undefined) => [
                  old?.[0] ?? '',
                  String(e.currentTarget.value),
                ],
              )
            }
            class="filter-input"
          />
        </div>
      </Match>

      <Match when={dataType() === 'boolean'}>
        <select
          class="filter-select"
          value={(filterValue() ?? '').toString()}
          onChange={(e) => props.column.setFilterValue(e.currentTarget.value)}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Match>
    </Switch>
  )
}

export default ColumnFilter
