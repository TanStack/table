import PropTypes from 'prop-types'

import { getFirstDefined, sum } from '../utils'

export const actions = {}

const propTypes = {
  defaultFlex: PropTypes.number,
}

export const useFlexLayout = hooks => {
  hooks.useMain.push(useMain)
}

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useFlexLayout')

  const {
    defaultFlex = 1,
    hooks: {
      columns: columnsHooks,
      getRowProps,
      getHeaderGroupProps,
      getHeaderProps,
      getCellProps,
    },
  } = instance

  columnsHooks.push((columns, api) => {
    const visibleColumns = columns.filter(column => column.visible)
    const columnMeasurements = {}

    let sumWidth = 0
    visibleColumns.forEach(column => {
      const { width, minWidth } = getSizesForColumn(
        column,
        defaultFlex,
        undefined,
        undefined,
        api
      )
      if (width) {
        sumWidth += width
      } else if (minWidth) {
        sumWidth += minWidth
      } else {
        sumWidth += defaultFlex
      }
    })

    const rowStyles = {
      style: {
        display: 'flex',
        minWidth: `${sumWidth}px`,
      },
    }

    api.rowStyles = rowStyles

    getRowProps.push(() => rowStyles)
    getHeaderGroupProps.push(() => rowStyles)

    getHeaderProps.push(column => ({
      style: {
        boxSizing: 'border-box',
        ...getStylesForColumn(column, columnMeasurements, defaultFlex, api),
      },
    }))

    getCellProps.push(cell => {
      return {
        style: {
          ...getStylesForColumn(
            cell.column,
            columnMeasurements,
            defaultFlex,
            undefined,
            api
          ),
        },
      }
    })

    return columns
  })

  return instance
}

// Utils

function getStylesForColumn(column, columnMeasurements, defaultFlex, api) {
  const { flex, width, maxWidth } = getSizesForColumn(
    column,
    columnMeasurements,
    defaultFlex,
    api
  )

  return {
    flex: `${flex} 0 auto`,
    width: `${width}px`,
    maxWidth: `${maxWidth}px`,
  }
}

function getSizesForColumn(
  { columns, id, width, minWidth, maxWidth },
  columnMeasurements,
  defaultFlex,
  api
) {
  if (columns) {
    columns = columns
      .filter(col => col.show || col.visible)
      .map(column =>
        getSizesForColumn(column, columnMeasurements, defaultFlex, api)
      )
      .filter(Boolean)

    if (!columns.length) {
      return false
    }

    const flex = sum(columns.map(col => col.flex))
    const width = sum(columns.map(col => col.width))
    const maxWidth = sum(columns.map(col => col.maxWidth))

    return {
      flex,
      width,
      maxWidth,
    }
  }

  return {
    flex: width ? 0 : defaultFlex,
    width:
      width === 'auto'
        ? columnMeasurements[id] || defaultFlex
        : getFirstDefined(width, minWidth, defaultFlex),
    maxWidth,
  }
}
