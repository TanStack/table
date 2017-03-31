import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'
import Pagination from './pagination'

const emptyObj = () => ({})

export default {
  // General
  data: [],
  loading: false,
  showPagination: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPageSize: 20,
  showPageJump: true,
  expanderColumnWidth: 35,
  collapseOnSortingChange: true,
  collapseOnPageChange: true,
  collapseOnDataChange: true,
  freezeWhenExpanded: false,
  defaultSorting: [],
  showFilters: false,
  defaultFiltering: [],
  defaultFilterMethod: (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true
  },

  // Controlled State Overrides
  // page: undefined,
  // pageSize: undefined,
  // sorting: undefined,

  // Controlled State Callbacks
  onExpandSubComponent: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortingChange: undefined,
  onFilteringChange: undefined,

  // Pivoting
  pivotBy: undefined,
  pivotColumnWidth: 200,
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',

  // Pivoting State Overrides
  // expandedRows: {},

  // Pivoting State Callbacks
  onExpandRow: undefined,

  // General Callbacks
  onChange: () => null,

  // Classes
  className: '',
  style: {},

  // Component decorators
  getProps: emptyObj,
  getTableProps: emptyObj,
  getTheadGroupProps: emptyObj,
  getTheadGroupTrProps: emptyObj,
  getTheadGroupThProps: emptyObj,
  getTheadProps: emptyObj,
  getTheadTrProps: emptyObj,
  getTheadThProps: emptyObj,
  getTheadFilterProps: emptyObj,
  getTheadFilterTrProps: emptyObj,
  getTheadFilterThProps: emptyObj,
  getTbodyProps: emptyObj,
  getTrGroupProps: emptyObj,
  getTrProps: emptyObj,
  getTdProps: emptyObj,
  getTfootProps: emptyObj,
  getTfootTrProps: emptyObj,
  getTfootTdProps: emptyObj,
  getPaginationProps: emptyObj,
  getLoadingProps: emptyObj,
  getNoDataProps: emptyObj,

  // Global Column Defaults
  column: {
    sortable: true,
    show: true,
    minWidth: 100,
    // Cells only
    render: undefined,
    className: '',
    style: {},
    getProps: emptyObj,
    // Headers only
    header: undefined,
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: emptyObj,
    // Footers only
    footer: undefined,
    footerClassName: '',
    footerStyle: {},
    getFooterProps: emptyObj,
    filterMethod: undefined,
    hideFilter: false,
    filterRender: ({filter, onFilterChange}) => (
      <input type='text'
        style={{
          width: '100%'
        }}
        value={filter ? filter.value : ''}
        onChange={(event) => onFilterChange(event.target.value)}
      />
    )
  },

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  noDataText: 'No rows found',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',

  // Components
  TableComponent: _.makeTemplateComponent('rt-table'),
  TheadComponent: _.makeTemplateComponent('rt-thead'),
  TbodyComponent: _.makeTemplateComponent('rt-tbody'),
  TrGroupComponent: _.makeTemplateComponent('rt-tr-group'),
  TrComponent: _.makeTemplateComponent('rt-tr'),
  ThComponent: ({toggleSort, className, children, ...rest}) => {
    return (
      <div
        className={classnames(className, 'rt-th')}
        onClick={e => {
          toggleSort && toggleSort(e)
        }}
        {...rest}
      >
        {children}
      </div>
    )
  },
  TdComponent: _.makeTemplateComponent('rt-td'),
  TfootComponent: _.makeTemplateComponent('rt-tfoot'),
  ExpanderComponent: ({isExpanded, ...rest}) => {
    return (
      <div
        className={classnames('rt-expander', isExpanded && '-open')}
        {...rest}
      >&bull;</div>
    )
  },
  PaginationComponent: Pagination,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: ({className, loading, loadingText, ...rest}) => (
    <div className={classnames(
      '-loading',
      {'-active': loading},
      className
    )}
      {...rest}
    >
      <div className='-loading-inner'>
        {loadingText}
      </div>
    </div>
  ),
  NoDataComponent: _.makeTemplateComponent('rt-noData')
}
