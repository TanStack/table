import { computed, defineComponent, h } from 'vue'
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
      h('div', { class: 'pager' }, [
        h(
          'button',
          {
            disabled: !table.getCanPreviousPage(),
            onClick: () => table.previousPage(),
          },
          'Previous',
        ),
        h(
          'button',
          {
            disabled: !table.getCanNextPage(),
            onClick: () => table.nextPage(),
          },
          'Next',
        ),
        h(
          'span',
          { class: 'muted' },
          `Page ${(pagination.value.pageIndex + 1).toLocaleString()} of ${table.getPageCount().toLocaleString()}`,
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
        { class: 'muted' },
        `${table.getFilteredRowModel().rows.length.toLocaleString()} rows`,
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
    const globalFilterState = useSelector(
      table.store,
      (state: ReturnType<typeof table.store.get>) => state.globalFilter,
    )
    const globalFilter = computed(
      () => (globalFilterState.value as string | undefined) ?? '',
    )

    return () =>
      h('div', { class: 'toolbar' }, [
        h('strong', props.title),
        h('div', { class: 'toolbar-actions' }, [
          h('input', {
            class: 'toolbar-input',
            value: globalFilter.value,
            placeholder: 'Search all columns...',
            onInput: (event: Event) =>
              table.setGlobalFilter((event.target as HTMLInputElement).value),
          }),
          props.onRefresh
            ? h('button', { onClick: () => props.onRefresh?.() }, 'Refresh')
            : null,
        ]),
      ])
  },
})
