const defaultGetHeaderProps = (props, instance, column) => ({
  key: ['header', column.id].join('_'),
  colSpan: column.totalVisibleHeaderCount,
  ...props,
})

const defaultGetFooterProps = (props, instance, column) => ({
  key: ['footer', column.id].join('_'),
  colSpan: column.totalVisibleHeaderCount,
  ...props,
})

const defaultGetHeaderGroupProps = (props, instance, headerGroup, index) => ({
  key: ['header', index].join('_'),
  ...props,
})

const defaultGetFooterGroupProps = (props, instance, headerGroup, index) => ({
  key: ['footer', index].join('_'),
  ...props,
})

const defaultGetRowProps = (props, instance, row) => ({
  key: ['row', ...row.path].join('_'),
  ...props,
})

const defaultGetCellProps = (props, instance, cell) => ({
  ...props,
  key: ['cell', ...cell.row.path, cell.column.id].join('_'),
})

export default function makeDefaultPluginHooks() {
  return {
    useOptions: [],
    stateReducers: [],
    columns: [],
    columnsDeps: [],
    flatColumns: [],
    flatColumnsDeps: [],
    headerGroups: [],
    headerGroupsDeps: [],
    useInstanceBeforeDimensions: [],
    useInstance: [],
    useRows: [],
    prepareRow: [],
    getTableProps: [],
    getTableBodyProps: [],
    getHeaderGroupProps: [defaultGetHeaderGroupProps],
    getFooterGroupProps: [defaultGetFooterGroupProps],
    getHeaderProps: [defaultGetHeaderProps],
    getFooterProps: [defaultGetFooterProps],
    getRowProps: [defaultGetRowProps],
    getCellProps: [defaultGetCellProps],
    useFinalInstance: [],
  }
}
