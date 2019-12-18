const defaultCells = cell => cell.filter(d => d.column.isVisible)

const defaultGetHeaderProps = (props, instance, column) => ({
  key: `header_${column.id}`,
  colSpan: column.totalVisibleHeaderCount,
  ...props,
})

const defaultGetFooterProps = (props, instance, column) => ({
  key: `footer_${column.id}`,
  colSpan: column.totalVisibleHeaderCount,
  ...props,
})

const defaultGetHeaderGroupProps = (props, instance, headerGroup, index) => ({
  key: `headerGroup_${index}`,
  ...props,
})

const defaultGetFooterGroupProps = (props, instance, headerGroup, index) => ({
  key: `footerGroup_${index}`,
  ...props,
})

const defaultGetRowProps = (props, instance, row) => ({
  key: `row_${row.id}`,
  ...props,
})

const defaultGetCellProps = (props, instance, cell) => ({
  ...props,
  key: `cell_${cell.row.id}_${cell.column.id}`,
})

export default function makeDefaultPluginHooks() {
  return {
    useOptions: [],
    stateReducers: [],
    useControlledState: [],
    columns: [],
    columnsDeps: [],
    flatColumns: [],
    flatColumnsDeps: [],
    headerGroups: [],
    headerGroupsDeps: [],
    useInstanceBeforeDimensions: [],
    useInstance: [],
    useRows: [],
    cells: [defaultCells],
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
