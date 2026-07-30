import { For, Show } from 'solid-js'
import type { Account } from './makeData'
import type { FacetKey } from './buckets'
import type { features } from './App'
import type { Column, Table } from '@tanstack/solid-table'

function ColumnFilter(props: {
  column: Column<typeof features, Account>
  table: Table<typeof features, Account>
}) {
  const selected = () =>
    (props.column.getFilterValue() ?? []) as Array<FacetKey>
  const options = () => props.column.columnDef.meta?.facetOptions ?? []

  const toggleFacet = (value: FacetKey) => {
    props.column.setFilterValue(
      selected().includes(value)
        ? selected().filter((selectedValue) => selectedValue !== value)
        : [...selected(), value],
    )
  }

  return (
    <Show
      when={props.column.columnDef.meta?.filterVariant === 'facets'}
      fallback={
        <input
          type="text"
          value={(props.column.getFilterValue() ?? '') as string}
          onInput={(event) =>
            props.column.setFilterValue(event.currentTarget.value)
          }
          placeholder="Search…"
          class="filter-select"
        />
      }
    >
      <fieldset class="facet-options">
        <For each={options()}>
          {(option) => (
            <label>
              <input
                type="checkbox"
                checked={selected().includes(option.value)}
                onChange={() => toggleFacet(option.value)}
              />
              <span>{option.label}</span>
              <span class="count">
                {(
                  props.column.getFacetedUniqueValues().get(option.value) ?? 0
                ).toLocaleString()}
              </span>
            </label>
          )}
        </For>
      </fieldset>
    </Show>
  )
}

export default ColumnFilter
