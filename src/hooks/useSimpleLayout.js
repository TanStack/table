
export const useSimpleLayout = props => {

  const {
    columns,
    rows,
    hooks: {
      columns: columnsHooks,
      getRowProps,
      getHeaderRowProps,
      getHeaderProps,
      getCellProps
    }
  } = props
  
  rows.forEach((row, i) => {
    if (row.cells === undefined) {
      row.cells = columns.map(column => {
        const cell = {
          column,
          row,
          state: null,
          value: row.values[column.id]
        }
        return cell
      })
    }
  })

  columnsHooks.push((columns, api) => {

    columns.filter(column => {
      column.visible =
        typeof column.show === 'function' ? column.show(api) : !!column.show
      return column.visible
    })

    const rowStyles = {
      style: {
        
      }
    }
    api.rowStyles = rowStyles
    
    getRowProps.push(() => rowStyles)
    getHeaderRowProps.push(() => rowStyles)

    getHeaderProps.push(column => ({
      style: {
        boxSizing: 'border-box',
        width: column.width !== undefined ? `${column.width}px` : 'auto',
      }
    }))

    getCellProps.push(cell => {
      return {
        style: {
          boxSizing: 'border-box',
          width: cell.column.width !== undefined ? `${cell.column.width}px` : 'auto',
        }
      }
    })

    return columns
  })

  return props
}
