const cellStyles = {
  display: 'inline-block',
  boxSizing: 'border-box',
}

const getRowStyles = (props, instance) => [
  props,
  {
    style: {
      display: 'flex',
      width: `${instance.totalColumnsWidth}px`,
    },
  },
]

export const useBlockLayout = hooks => {
  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)

  hooks.getHeaderProps.push((props, instance, header) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${header.totalWidth}px`,
      },
    },
  ])

  hooks.getCellProps.push((props, instance, cell) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${cell.column.totalWidth}px`,
      },
    },
  ])
}

useBlockLayout.pluginName = 'useBlockLayout'
