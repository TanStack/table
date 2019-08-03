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
    manualRowSelectedKey = 'selected',
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

  const toggleRowSelected = (key, set) => {
    return setState(old => {
      // Join the paths of deep rows
      // to make a key, then manage all of the keys
      // in a flat object
      const exists = old.selectedRows.includes(key)
      const shouldExist = typeof set !== 'undefined' ? set : !exists
      let newSelectedRows = new Set(selectedRows)

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

  const toggleRowSelectedByPath = (path, set) => {
    return toggleRowSelected(path.join('.'), set)
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
    row.canSelect = !!row.original

    if (row.canSelect) {
      row.selected = selectedRows.includes(row.path.join('.'))
      row.toggleRowSelected = set => toggleRowSelectedByPath(row.path, set)
      row.getToggleRowSelectedProps = props => {
        let checked = false

        if (row.original && row.original[manualRowSelectedKey]) {
          checked = true
        } else {
          checked = selectedRows.includes(row.path.join('.'))
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
    toggleRowSelectedByPath,
    toggleRowSelectedAll,
    getToggleAllRowsSelectedProps,
    allRowsSelected,
  }
}
