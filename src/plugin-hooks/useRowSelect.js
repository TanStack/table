import PropTypes from 'prop-types'

import { mergeProps, applyPropHooks, ensurePluginOrder } from '../utils'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.selectedRows = []

addActions('toggleRowSelected', 'toggleRowSelectedAll')

const propTypes = {
  manualRowSelectedKey: PropTypes.string,
}

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = []
  hooks.getToggleAllRowsSelectedProps = []
  hooks.useMain.push(useMain)
}

useRowSelect.pluginName = 'useRowSelect'

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useRowSelect')

  const {
    hooks,
    manualRowSelectedKey = 'isSelected',
    plugins,
    rowPaths,
    state: [{ selectedRows }, setState],
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy'],
    'useRowSelect',
    []
  )

  const allRowsSelected = rowPaths.length === selectedRows.length

  const toggleRowSelectedAll = set => {
    setState(old => {
      const selectAll = typeof set !== 'undefined' ? set : !allRowsSelected
      return {
        ...old,
        selectedRows: selectAll ? [...rowPaths] : [],
      }
    }, actions.toggleRowSelectedAll)
  }

  const toggleRowSelected = (path, set) => {
    const key = path.join('.')

    return setState(old => {
      // Join the paths of deep rows
      // to make a key, then manage all of the keys
      // in a flat object
      const exists = old.selectedRows.includes(key)
      const shouldExist = typeof set !== 'undefined' ? set : !exists
      let newSelectedRows = new Set(old.selectedRows)

      if (!exists && shouldExist) {
        newSelectedRows.add(key)
      } else if (exists && !shouldExist) {
        newSelectedRows.delete(key)
      } else {
        return old
      }

      return {
        ...old,
        selectedRows: [...newSelectedRows.values()],
      }
    }, actions.toggleRowSelected)
  }

  const getToggleAllRowsSelectedProps = props => {
    return mergeProps(
      {
        onChange: e => {
          toggleRowSelectedAll(e.target.checked)
        },
        style: {
          cursor: 'pointer',
        },
        checked: allRowsSelected,
        title: 'Toggle All Rows Selected',
      },
      applyPropHooks(instance.hooks.getToggleAllRowsSelectedProps, instance),
      props
    )
  }

  hooks.prepareRow.push(row => {
    // Aggregate rows have entirely different select logic
    if (row.isAggregated) {
      const subRowPaths = row.subRows.map(row => row.path)
      row.isSelected = subRowPaths.every(path =>
        selectedRows.includes(path.join('.'))
      )
      row.toggleRowSelected = set => {
        set = typeof set !== 'undefined' ? set : !row.isSelected
        console.log(subRowPaths)
        subRowPaths.forEach(path => {
          toggleRowSelected(path, set)
        })
      }
      row.getToggleRowSelectedProps = props => {
        let checked = false

        if (row.original && row.original[manualRowSelectedKey]) {
          checked = true
        } else {
          checked = row.isSelected
        }

        return mergeProps(
          {
            onChange: e => {
              row.toggleRowSelected(e.target.checked)
            },
            style: {
              cursor: 'pointer',
            },
            checked,
            title: 'Toggle Row Selected',
          },
          applyPropHooks(
            instance.hooks.getToggleRowSelectedProps,
            row,
            instance
          ),
          props
        )
      }
    } else {
      row.isSelected = selectedRows.includes(row.path.join('.'))
      row.toggleRowSelected = set => toggleRowSelected(row.path, set)
      row.getToggleRowSelectedProps = props => {
        let checked = false

        if (row.original && row.original[manualRowSelectedKey]) {
          checked = true
        } else {
          checked = row.isSelected
        }

        return mergeProps(
          {
            onChange: e => {
              row.toggleRowSelected(e.target.checked)
            },
            style: {
              cursor: 'pointer',
            },
            checked,
            title: 'Toggle Row Selected',
          },
          applyPropHooks(
            instance.hooks.getToggleRowSelectedProps,
            row,
            instance
          ),
          props
        )
      }
    }

    return row
  })

  return {
    ...instance,
    toggleRowSelected,
    toggleRowSelectedAll,
    getToggleAllRowsSelectedProps,
    allRowsSelected,
  }
}
