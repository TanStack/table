export const useAbsoluteLayout = hooks => {
  hooks.useMain.push(useMain)
}

useAbsoluteLayout.pluginName = 'useAbsoluteLayout'

const useMain = instance => {
  const {
    totalColumnsWidth,
    hooks: {
      getRowProps,
      getTableBodyProps,
      getHeaderGroupProps,
      getHeaderProps,
      getCellProps,
    },
  } = instance

  const rowStyles = {
    style: {
      position: 'relative',
      width: `${totalColumnsWidth}px`,
    },
  }

  getTableBodyProps.push(() => rowStyles)
  getRowProps.push(() => rowStyles)
  getHeaderGroupProps.push(() => rowStyles)

  // Calculating column/cells widths
  const cellStyles = {
    position: 'absolute',
    top: 0,
  }

  getHeaderProps.push(header => {
    return {
      style: {
        ...cellStyles,
        left: `${header.totalLeft}px`,
        width: `${header.totalWidth}px`,
      },
    }
  })

  getCellProps.push(cell => {
    return {
      style: {
        ...cellStyles,
        left: `${cell.column.totalLeft}px`,
        width: `${cell.column.totalWidth}px`,
      },
    }
  })

  return instance
}
