import PropTypes from 'prop-types'

export default {
  // General
  data: PropTypes.any,
  loading: PropTypes.bool,
  showPagination: PropTypes.bool,
  showPaginationTop: PropTypes.bool,
  showPaginationBottom: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  defaultPageSize: PropTypes.number,
  showPageJump: PropTypes.bool,
  collapseOnSortingChange: PropTypes.bool,
  collapseOnPageChange: PropTypes.bool,
  collapseOnDataChange: PropTypes.bool,
  freezeWhenExpanded: PropTypes.bool,
  sortable: PropTypes.bool,
  resizable: PropTypes.bool,
  filterable: PropTypes.bool,
  defaultSortDesc: PropTypes.bool,
  defaultSorted: PropTypes.array,
  defaultFiltered: PropTypes.array,
  defaultResized: PropTypes.array,
  defaultExpanded: PropTypes.object,
  defaultFilterMethod: PropTypes.func,
  defaultSortMethod: PropTypes.func,

  // Controlled State Callbacks
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSortedChange: PropTypes.func,
  onFilteredChange: PropTypes.func,
  onResizedChange: PropTypes.func,
  onExpandedChange: PropTypes.func,

  // Pivoting
  pivotBy: PropTypes.array,

  // Key Constants
  pivotValKey: PropTypes.string,
  pivotIDKey: PropTypes.string,
  subRowsKey: PropTypes.string,
  aggregatedKey: PropTypes.string,
  nestingLevelKey: PropTypes.string,
  originalKey: PropTypes.string,
  indexKey: PropTypes.string,
  groupedByPivotKey: PropTypes.string,

  // Server-side Callbacks
  onFetchData: PropTypes.func,

  // Classes
  className: PropTypes.string,
  style: PropTypes.object,

  // Component decorators
  getProps: PropTypes.func,
  getTableProps: PropTypes.func,
  getTheadGroupProps: PropTypes.func,
  getTheadGroupTrProps: PropTypes.func,
  getTheadGroupThProps: PropTypes.func,
  getTheadProps: PropTypes.func,
  getTheadTrProps: PropTypes.func,
  getTheadThProps: PropTypes.func,
  getTheadFilterProps: PropTypes.func,
  getTheadFilterTrProps: PropTypes.func,
  getTheadFilterThProps: PropTypes.func,
  getTbodyProps: PropTypes.func,
  getTrGroupProps: PropTypes.func,
  getTrProps: PropTypes.func,
  getTdProps: PropTypes.func,
  getTfootProps: PropTypes.func,
  getTfootTrProps: PropTypes.func,
  getTfootTdProps: PropTypes.func,
  getPaginationProps: PropTypes.func,
  getLoadingProps: PropTypes.func,
  getNoDataProps: PropTypes.func,
  getResizerProps: PropTypes.func,

  // Global Column Defaults
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      // Renderers
      Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Header: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Footer: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Aggregated: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Pivot: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      PivotValue: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Expander: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),
      Filter: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

      // All Columns
      sortable: PropTypes.bool, // use table default
      resizable: PropTypes.bool, // use table default
      filterable: PropTypes.bool, // use table default
      show: PropTypes.bool,
      minWidth: PropTypes.number,

      // Cells only
      className: PropTypes.string,
      style: PropTypes.object,
      getProps: PropTypes.func,

      // Pivot only
      aggregate: PropTypes.func,

      // Headers only
      headerClassName: PropTypes.string,
      headerStyle: PropTypes.object,
      getHeaderProps: PropTypes.func,

      // Footers only
      footerClassName: PropTypes.string,
      footerStyle: PropTypes.object,
      getFooterProps: PropTypes.object,
      filterMethod: PropTypes.func,
      filterAll: PropTypes.bool,
      sortMethod: PropTypes.func,
    })
  ),

  // Global Expander Column Defaults
  expanderDefaults: PropTypes.shape({
    sortable: PropTypes.bool,
    resizable: PropTypes.bool,
    filterable: PropTypes.bool,
    width: PropTypes.number,
  }),

  pivotDefaults: PropTypes.object,

  // Text
  previousText: PropTypes.node,
  nextText: PropTypes.node,
  loadingText: PropTypes.node,
  noDataText: PropTypes.node,
  pageText: PropTypes.node,
  ofText: PropTypes.node,
  rowsText: PropTypes.node,

  // Components
  TableComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TheadComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TbodyComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TrGroupComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TrComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  ThComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TdComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  TfootComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  FilterComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  ExpanderComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  PivotValueComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  AggregatedComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  // this is a computed default generated using
  PivotComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  PreviousComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  NextComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  LoadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  NoDataComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  ResizerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  PadRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
}
