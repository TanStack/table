import { applyDefaults, useGetLatest } from '../utils'

const defaultOptions = {
  initialState: {},
  state: {},
  onStateChange: d => d,
  getSubRows: (row, index) => row.subRows || [],
  getRowId: (row, index, parent) =>
    `${parent ? [parent.id, index].join('.') : index}`,
  enableFilters: true,
  filterFromChildrenUp: true,
  paginateExpandedRows: true,
  plugins: [],
}

export default function useTableOptions(options, instance) {
  const getInstance = useGetLatest(instance)

  return instance.plugs.useReduceOptions(
    applyDefaults(options, defaultOptions),
    {
      getInstance,
    }
  )
}
