import { useMemo } from 'react'
import PropTypes from 'prop-types'

import {
  getBy,
  getFirstDefined,
  setBy,
  mergeProps,
  applyPropHooks,
} from '../utils'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.expanded = {}

addActions('toggleExpanded', 'useExpanded')

const propTypes = {
  manualExpandedKey: PropTypes.string,
  nestExpandedRows: PropTypes.bool,
}

export const useExpanded = hooks => {
  hooks.getExpandedToggleProps = []
  hooks.useMain.push(useMain)
}

useExpanded.pluginName = 'useExpanded'

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useExpanded')

  const {
    debug,
    rows,
    manualExpandedKey = 'expanded',
    hooks,
    state: [{ expanded }, setState],
    nestExpandedRows,
  } = instance

  const toggleExpandedByPath = (path, set) => {
    return setState(old => {
      const { expanded } = old
      const existing = getBy(expanded, path)
      set = getFirstDefined(set, !existing)
      return {
        ...old,
        expanded: setBy(expanded, path, set),
      }
    }, actions.toggleExpanded)
  }

  hooks.prepareRow.push(row => {
    row.toggleExpanded = set => toggleExpandedByPath(row.path, set)
    row.getExpandedToggleProps = props => {
      return mergeProps(
        {
          onClick: e => {
            e.persist()
            row.toggleExpanded()
          },
          style: {
            cursor: 'pointer',
          },
          title: 'Toggle Expanded',
        },
        applyPropHooks(instance.hooks.getExpandedToggleProps, row, instance),
        props
      )
    }
    return row
  })

  const expandedRows = useMemo(() => {
    if (process.env.NODE_ENV === 'development' && debug)
      console.info('getExpandedRows')

    const expandedRows = []

    // Here we do some mutation, but it's the last stage in the
    // immutable process so this is safe
    const handleRow = row => {
      row.isExpanded =
        (row.original && row.original[manualExpandedKey]) ||
        getBy(expanded, row.path)

      if (!nestExpandedRows || (nestExpandedRows && row.depth === 0)) {
        expandedRows.push(row)
      }

      row.canExpand = row.subRows && !!row.subRows.length

      if (row.isExpanded && row.subRows && row.subRows.length) {
        row.subRows.forEach(handleRow)
      }

      return row
    }

    rows.forEach(handleRow)

    return expandedRows
  }, [debug, rows, manualExpandedKey, expanded, nestExpandedRows])

  const expandedDepth = findExpandedDepth(expanded)

  return {
    ...instance,
    toggleExpandedByPath,
    expandedDepth,
    rows: expandedRows,
  }
}

function findExpandedDepth(obj, depth = 1) {
  return Object.values(obj).reduce((prev, curr) => {
    if (typeof curr === 'object') {
      return Math.max(prev, findExpandedDepth(curr, depth + 1))
    }
    return depth
  }, 0)
}
