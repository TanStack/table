
export const useSimpleLayout = props => {
  const {
    hooks: {
      columns: columnsHooks,
      getHeaderProps,
      getCellProps
    }
  } = props

  columnsHooks.push((columns, api) => {
    columns.forEach(column => {
      column.visible =
        typeof column.show === 'function' ? column.show(api) : !!column.show
    })

    getHeaderProps.push(column => ({
      style: {
        boxSizing: 'border-box',
        width: column.width !== undefined ? `${column.width}px` : 'auto'
      }
    }))

    getCellProps.push(cell => {
      return {
        style: {
          boxSizing: 'border-box',
          width: cell.column.width !== undefined ? `${cell.column.width}px` : 'auto'
        }
      }
    })

    return columns
  })

  return props
}
