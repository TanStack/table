const cellStyles = {
  display: 'inline-block',
  boxSizing: 'border-box',
}

const getId = cell => {
  let role = 'cell';
  return role + '_' + cell.row.id + '_' + cell.column.id;
}

const getRowStyles = (props, { instance }) => [
  props,
  {
    style: {
      display: 'flex',
      width: `${instance.totalColumnsWidth}px`,
    },
  },
]

export const useBlockLayout = (hooks, spanList = {}) => {
  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)
  hooks.getFooterGroupProps.push(getRowStyles)

  hooks.getHeaderProps.push((props, { column }) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${column.totalWidth}px`,
      },
    },
  ])

  hooks.getCellProps.push((props, { cell }) => {
    let id = getId(cell);
    let spanStyles = {};

    if (id in spanList) {
      console.log(id, spanList[id])
    }

    return [
    props,
    {
      style: {
        ...cellStyles,
        ... spanStyles,
        width: `${cell.column.totalWidth}px`,
      },
    },
  ]})

  hooks.getFooterProps.push((props, { column }) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${column.totalWidth}px`,
      },
    },
  ])
}

useBlockLayout.pluginName = 'useBlockLayout'
