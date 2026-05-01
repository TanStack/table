import { computed, defineComponent, h } from 'vue'
import { useHeaderContext } from '../hooks/table'

export const SortIndicator = defineComponent({
  name: 'SortIndicator',
  setup() {
    const header = useHeaderContext()

    return () => {
      const sorted = header.column.getIsSorted()
      const text = sorted === 'asc' ? '▲' : sorted === 'desc' ? '▼' : ''
      return text ? h('span', { class: 'sort-indicator' }, text) : null
    }
  },
})

export const ColumnFilter = defineComponent({
  name: 'ColumnFilter',
  setup() {
    const header = useHeaderContext()
    const value = computed(
      () => (header.column.getFilterValue() as string | undefined) ?? '',
    )

    return () => {
      if (!header.column.getCanFilter()) {
        return null
      }

      return h(
        'div',
        {
          class: 'column-filter',
          onClick: (event: Event) => event.stopPropagation(),
        },
        [
          h('input', {
            type: 'text',
            value: value.value,
            placeholder: `Filter ${header.column.id}...`,
            onInput: (event: Event) =>
              header.column.setFilterValue(
                (event.target as HTMLInputElement).value,
              ),
          }),
        ],
      )
    }
  },
})

export const FooterColumnId = defineComponent({
  name: 'FooterColumnId',
  setup() {
    const header = useHeaderContext()
    return () => h('span', header.column.id)
  },
})

export const FooterSum = defineComponent({
  name: 'FooterSum',
  setup() {
    const header = useHeaderContext()

    return () => {
      const rows = header.getContext().table.getFilteredRowModel().rows
      const sum = rows.reduce((total, row) => {
        const value = row.getValue(header.column.id)
        return total + (typeof value === 'number' ? value : 0)
      }, 0)

      return h('span', `Sum: ${sum.toLocaleString()}`)
    }
  },
})
