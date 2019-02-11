import { useMemo } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  subRowsKey: PropTypes.string
}

export const useRows = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useRows')

  const { debug, columns, subRowsKey = 'subRows', data } = props

  const accessedRows = useMemo(() => {
    if (debug) console.info('getAccessedRows')

    // Access the row's data
    const accessRow = (originalRow, i, depth = 0) => {
      // Keep the original reference around
      const original = originalRow

      // Process any subRows
      const subRows = originalRow[subRowsKey]
        ? originalRow[subRowsKey].map((d, i) => accessRow(d, i, depth + 1))
        : undefined

      const row = {
        original,
        index: i,
        subRows,
        depth
      }

      // Create the cells and values
      row.values = {}
      columns.forEach(column => {
        row.values[column.id] = column.accessor
          ? column.accessor(originalRow, i, { subRows, depth, data })
          : undefined
      })

      return row
    }

    // Use the resolved data
    return data.map((d, i) => accessRow(d, i))
  }, [data, columns])

  return {
    ...props,
    rows: accessedRows
  }
}
