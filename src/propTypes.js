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
      Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Header: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Footer: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Aggregated: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Pivot: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      PivotValue: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Expander: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
      Filter: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),

      // All Columns
      sortable: PropTypes.bool, // use table default
      resizable: PropTypes.bool, // use table default
      filterable: PropTypes.bool, // use table default
      show: PropTypes.bool,
      minWidth: PropTypes.number,
      minResizeWidth: PropTypes.number,

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
      getFooterProps: PropTypes.func,
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
  pageJumpText: PropTypes.node,
  rowsSelectorText: PropTypes.node,

  // Components
  TableComponent: PropTypes.elementType,
  TheadComponent: PropTypes.elementType,
  TbodyComponent: PropTypes.elementType,
  TrGroupComponent: PropTypes.elementType,
  TrComponent: PropTypes.elementType,
  ThComponent: PropTypes.elementType,
  TdComponent: PropTypes.elementType,
  TfootComponent: PropTypes.elementType,
  FilterComponent: PropTypes.elementType,
  ExpanderComponent: PropTypes.elementType,
  PivotValueComponent: PropTypes.elementType,
  AggregatedComponent: PropTypes.elementType,
  // this is a computed default generated using
  PivotComponent: PropTypes.elementType,
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: PropTypes.elementType,
  PreviousComponent: PropTypes.elementType,
  NextComponent: PropTypes.elementType,
  LoadingComponent: PropTypes.elementType,
  NoDataComponent: PropTypes.elementType,
  ResizerComponent: PropTypes.elementType,
  PadRowComponent: PropTypes.elementType,
}
