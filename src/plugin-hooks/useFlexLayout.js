export function useFlexLayout(hooks) {
  hooks.getTableBodyProps.push((props, instance) => [
    props,
    {
      style: {
        minWidth: `${instance.totalColumnsWidth}px`,
      },
    },
  ])

  const getRowStyles = (props, instance) => [
    props,
    {
      style: {
        display: 'flex',
        flex: '1 0 auto',
        minWidth: `${instance.totalColumnsMinWidth}px`,
      },
    },
  ]

  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)

  hooks.getHeaderProps.push((props, instance, header) => [
    props,
    {
      style: {
        boxSizing: 'border-box',
        flex: `${header.totalWidth} 0 auto`,
        minWidth: `${header.totalMinWidth}px`,
        width: `${header.totalWidth}px`,
      },
    },
  ])

  hooks.getCellProps.push((props, instance, cell) => [
    props,
    {
      style: {
        boxSizing: 'border-box',
        flex: `${cell.column.totalWidth} 0 auto`,
        minWidth: `${cell.column.totalMinWidth}px`,
        width: `${cell.column.totalWidth}px`,
      },
    },
  ])
}

useFlexLayout.pluginName = 'useFlexLayout'
