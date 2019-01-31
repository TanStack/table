import useReactTable, { actions as mainActions } from './useReactTable'
import usePagination, { actions as paginationActions } from './usePagination'
import useFlexLayout, { actions as flexLayoutActions } from './useFlexLayout'

const actions = {
  ...mainActions,
  ...paginationActions,
  ...flexLayoutActions,
}

export { useReactTable, usePagination, useFlexLayout, actions }
