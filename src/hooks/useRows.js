import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  subRowsKey: PropTypes.string,
}

export const useRows = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useRows')

  const { debug, columns, subRowsKey = 'subRows', data } = props

  const accessedRows = React.useMemo(() => {
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
        path: [i], // used to create a key for each row even if not nested
        subRows,
        depth,
        cells: [{}], // This is a dummy cell
      }

      // Override common array functions (and the dummy cell's getCellProps function)
      // to show an error if it is accessed without calling prepareRow
      const unpreparedAccessWarning = () => {
        throw new Error(
          'React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.'
        )
      }
      row.cells.map = unpreparedAccessWarning
      row.cells.filter = unpreparedAccessWarning
      row.cells.forEach = unpreparedAccessWarning
      row.cells[0].getCellProps = unpreparedAccessWarning

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
  }, [debug, data, subRowsKey, columns])

  return {
    ...props,
    rows: accessedRows,
  }
}
