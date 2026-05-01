import { defineComponent, h } from 'vue'
import { useSelector } from '@tanstack/vue-store'
import { useTableContext } from '../hooks/table'
import type { PropType } from 'vue'

export const PaginationControls = defineComponent({
  name: 'PaginationControls',
  setup() {
    const table = useTableContext()
    const pagination = useSelector(
      table.store,
      (state: ReturnType<typeof table.store.get>) => state.pagination,
    )

    return () =>
      h('div', { class: 'pagination' }, [
        h(
          'button',
          {
            onClick: () => table.firstPage(),
            disabled: !table.getCanPreviousPage(),
          },
          '<<',
        ),
        h(
          'button',
          {
            disabled: !table.getCanPreviousPage(),
            onClick: () => table.previousPage(),
          },
          '<',
        ),
        h(
          'button',
          {
            disabled: !table.getCanNextPage(),
            onClick: () => table.nextPage(),
          },
          '>',
        ),
        h(
          'button',
          {
            onClick: () => table.lastPage(),
            disabled: !table.getCanNextPage(),
          },
          '>>',
        ),
        h('span', [
          'Page ',
          h(
            'strong',
            `${(pagination.value.pageIndex + 1).toLocaleString()} of ${table.getPageCount().toLocaleString()}`,
          ),
        ]),
        h('span', [
          '| Go to page:',
          h('input', {
            type: 'number',
            min: 1,
            max: table.getPageCount(),
            value: pagination.value.pageIndex + 1,
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
            value: pagination.value.pageSize,
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
  },
})

export const RowCount = defineComponent({
  name: 'RowCount',
  setup() {
    const table = useTableContext()
    const stateSnapshot = useSelector(
      table.store,
      (state: ReturnType<typeof table.store.get>) => ({
        pagination: state.pagination,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        sorting: state.sorting,
      }),
    )

    return () => {
      stateSnapshot.value

      return h(
        'div',
        { class: 'row-count' },
        `Showing ${table.getRowModel().rows.length.toLocaleString()} of ${table.getRowCount().toLocaleString()} rows`,
      )
    }
  },
})

export const TableToolbar = defineComponent({
  name: 'TableToolbar',
  props: {
    title: {
      type: String,
      required: true,
    },
    onRefresh: {
      type: Function as PropType<() => void>,
      default: undefined,
    },
  },
  setup(props) {
    const table = useTableContext()
    return () =>
      h('div', { class: 'table-toolbar' }, [
        h('h2', props.title),
        h('div', [
          h(
            'button',
            { onClick: () => table.resetColumnFilters() },
            'Clear Filters',
          ),
          h('button', { onClick: () => table.resetSorting() }, 'Clear Sorting'),
          props.onRefresh
            ? h(
                'button',
                { onClick: () => props.onRefresh?.() },
                'Regenerate Data',
              )
            : null,
        ]),
      ])
  },
})
