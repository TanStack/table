import { defineComponent, h } from 'vue'
import { useCellContext } from '../hooks/table'

export const TextCell = defineComponent({
  name: 'TextCell',
  setup() {
    const cell = useCellContext<string>()
    return () => h('span', String(cell.getValue() ?? ''))
  },
})

export const NumberCell = defineComponent({
  name: 'NumberCell',
  setup() {
    const cell = useCellContext<number>()
    return () => h('span', Number(cell.getValue() ?? 0).toLocaleString())
  },
})

export const StatusCell = defineComponent({
  name: 'StatusCell',
  setup() {
    const cell = useCellContext<string>()
    return () => {
      const status = String(cell.getValue() ?? '')
      const statusClass =
        status === 'Single'
          ? 'single'
          : status === 'Complicated'
            ? 'complicated'
            : 'relationship'

      return h('span', { class: ['status-pill', statusClass] }, status)
    }
  },
})

export const ProgressCell = defineComponent({
  name: 'ProgressCell',
  setup() {
    const cell = useCellContext<number>()
    return () => {
      const value = Number(cell.getValue() ?? 0)

      return h('div', { class: 'progress-track' }, [
        h('div', {
          class: 'progress-bar',
          style: { width: `${value}%` },
        }),
      ])
    }
  },
})

export const RowActionsCell = defineComponent({
  name: 'RowActionsCell',
  setup() {
    const cell = useCellContext()

    return () =>
      h(
        'button',
        {
          onClick: () => {
            const row = cell.row.original as {
              firstName?: string
              name?: string
            }
            window.alert(`Selected ${row.firstName ?? row.name ?? 'row'}`)
          },
        },
        'Open',
      )
  },
})

export const PriceCell = defineComponent({
  name: 'PriceCell',
  setup() {
    const cell = useCellContext<number>()
    return () =>
      h(
        'span',
        `$${Number(cell.getValue() ?? 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      )
  },
})

export const CategoryCell = defineComponent({
  name: 'CategoryCell',
  setup() {
    const cell = useCellContext<string>()
    return () => h('span', { class: 'muted' }, String(cell.getValue() ?? ''))
  },
})
