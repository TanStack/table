export const useBlockLayout = hooks => {
  hooks.useMain.push(useMain)
}

useBlockLayout.pluginName = 'useBlockLayout'

const useMain = instance => {
  const {
    totalColumnsWidth,
    hooks: { getRowProps, getHeaderGroupProps, getHeaderProps, getCellProps },
  } = instance

  const rowStyles = {
    style: {
      display: 'flex',
      width: `${totalColumnsWidth}px`,
    },
  }

  getRowProps.push(() => rowStyles)
  getHeaderGroupProps.push(() => rowStyles)

  const cellStyles = {
    display: 'inline-block',
    boxSizing: 'border-box',
  }

  getHeaderProps.push(header => {
    return {
      style: {
        ...cellStyles,
        width: `${header.totalWidth}px`,
      },
    }
  })

  getCellProps.push(cell => {
    return {
      style: {
        ...cellStyles,
        width: `${cell.column.totalWidth}px`,
      },
    }
  })

  return instance
}
