import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table'
import { computed, defineComponent, h } from 'vue'
import type { CellData, Header, RowData, VueTable } from '@tanstack/vue-table'

const features = tableFeatures({
  rowPaginationFeature,
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

const SortIndicator = defineComponent({
  name: 'SortIndicator',
  setup() {
    const header = useHeaderContext()

    return () => {
      const sorted = header.column.getIsSorted()
      const text = sorted === 'asc' ? ' 🔼' : sorted === 'desc' ? ' 🔽' : ''
      return text ? h('span', { class: 'sort-indicator' }, text) : null
    }
  },
})

const ColumnFilter = defineComponent({
  name: 'ColumnFilter',
  setup() {
    const table = useTableContext()
    const header = useHeaderContext()
    const firstValue = computed(() =>
      table.getPreFilteredRowModel().flatRows[0]?.getValue(header.column.id),
    )
    const columnFilterValue = computed(() => header.column.getFilterValue())

    return () => {
      if (!header.column.getCanFilter()) {
        return null
      }

      if (typeof firstValue.value === 'number') {
        const value = columnFilterValue.value as [number, number] | undefined

        return h(
          'div',
          {
            class: 'filter-row',
            onClick: (event: Event) => event.stopPropagation(),
          },
          [
            h('input', {
              type: 'number',
              value: value?.[0] ?? '',
              placeholder: 'Min',
              class: 'filter-input',
              onInput: (event: Event) => {
                const nextValue = (event.target as HTMLInputElement).value
                header.column.setFilterValue(
                  (old: [number, number] | undefined) => [nextValue, old?.[1]],
                )
              },
            }),
            h('input', {
              type: 'number',
              value: value?.[1] ?? '',
              placeholder: 'Max',
              class: 'filter-input',
              onInput: (event: Event) => {
                const nextValue = (event.target as HTMLInputElement).value
                header.column.setFilterValue(
                  (old: [number, number] | undefined) => [old?.[0], nextValue],
                )
              },
            }),
          ],
        )
      }

      return h(
        'div',
        { onClick: (event: Event) => event.stopPropagation() },
        h('input', {
          type: 'text',
          value: columnFilterValue.value ?? '',
          placeholder: 'Search...',
          class: 'filter-select',
          onInput: (event: Event) => {
            header.column.setFilterValue(
              (event.target as HTMLInputElement).value,
            )
          },
        }),
      )
    }
  },
})

const PaginationControls = defineComponent({
  name: 'PaginationControls',
  setup() {
    const table = useTableContext()

    return () => {
      const pagination = table.atoms.pagination.get()

      return h('div', { class: 'controls' }, [
        h(
          'button',
          {
            type: 'button',
            class: 'demo-button demo-button-sm',
            disabled: !table.getCanPreviousPage(),
            onClick: () => table.firstPage(),
          },
          '<<',
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'demo-button demo-button-sm',
            disabled: !table.getCanPreviousPage(),
            onClick: () => table.previousPage(),
          },
          '<',
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'demo-button demo-button-sm',
            disabled: !table.getCanNextPage(),
            onClick: () => table.nextPage(),
          },
          '>',
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'demo-button demo-button-sm',
            disabled: !table.getCanNextPage(),
            onClick: () => table.lastPage(),
          },
          '>>',
        ),
        h('span', { class: 'inline-controls' }, [
          h('div', 'Page'),
          h(
            'strong',
            `${(pagination.pageIndex + 1).toLocaleString()} of ${table.getPageCount().toLocaleString()}`,
          ),
        ]),
        h('span', { class: 'inline-controls' }, [
          '| Go to page:',
          h('input', {
            type: 'number',
            min: 1,
            max: table.getPageCount(),
            value: pagination.pageIndex + 1,
            class: 'page-size-input',
            onChange: (event: Event) => {
              const value = (event.target as HTMLInputElement).value
              const page = value ? Number(value) - 1 : 0
              table.setPageIndex(page)
            },
          }),
        ]),
        h(
          'select',
          {
            value: pagination.pageSize,
            onChange: (event: Event) => {
              table.setPageSize(
                Number((event.target as HTMLSelectElement).value),
              )
            },
          },
          [10, 20, 30, 40, 50].map((pageSize) =>
            h('option', { key: pageSize, value: pageSize }, `Show ${pageSize}`),
          ),
        ),
      ])
    }
  },
})

const RowCount = defineComponent({
  name: 'RowCount',
  setup() {
    const table = useTableContext()

    return () => {
      table.atoms.pagination.get()
      table.atoms.columnFilters.get()
      table.atoms.sorting.get()

      return h(
        'div',
        { class: 'row-count' },
        `Showing ${table.getRowModel().rows.length.toLocaleString()} of ${table.getRowCount().toLocaleString()} Rows`,
      )
    }
  },
})

const _hook = createTableHook({
  features,
  tableComponents: {
    PaginationControls,
    RowCount,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
  },
  cellComponents: {},
})

export const appFeatures = features
export const createAppColumnHelper = _hook.createAppColumnHelper
export const useAppTable = _hook.useAppTable

export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof features,
  TData
> = _hook.useTableContext

export const useHeaderContext: <TValue extends CellData = CellData>() => Header<
  typeof features,
  any,
  TValue
> = _hook.useHeaderContext
