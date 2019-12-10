// Calculating column/cells widths
const cellStyles = {
  position: 'absolute',
  top: 0,
}

export const useAbsoluteLayout = hooks => {
  hooks.getTableBodyProps.push(getRowStyles)
  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)

  hooks.getHeaderProps.push((props, instance, header) => [
    props,
    {
      style: {
        ...cellStyles,
        left: `${header.totalLeft}px`,
        width: `${header.totalWidth}px`,
      },
    },
  ])

  hooks.getCellProps.push((props, instance, cell) => [
    props,
    {
      style: {
        ...cellStyles,
        left: `${cell.column.totalLeft}px`,
        width: `${cell.column.totalWidth}px`,
      },
    },
  ])
}

useAbsoluteLayout.pluginName = 'useAbsoluteLayout'

const getRowStyles = (props, instance) => [
  props,
  {
    style: {
      position: 'relative',
      width: `${instance.totalColumnsWidth}px`,
    },
  },
]
