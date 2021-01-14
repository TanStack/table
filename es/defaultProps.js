var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import classnames from 'classnames';
//
import _ from './utils';
import Pagination from './pagination';

var emptyObj = function emptyObj() {
  return {};
};

export default {
  // General
  data: [],
  resolveData: function resolveData(data) {
    return data;
  },
  loading: false,
  showPagination: true,
  showPaginationTop: false,
  showPaginationBottom: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPage: 0,
  defaultPageSize: 20,
  showPageJump: true,
  collapseOnSortingChange: true,
  collapseOnPageChange: true,
  collapseOnDataChange: true,
  freezeWhenExpanded: false,
  sortable: true,
  multiSort: true,
  resizable: true,
  filterable: false,
  defaultSortDesc: false,
  defaultSorted: [],
  defaultFiltered: [],
  defaultResized: [],
  defaultExpanded: {},
  // eslint-disable-next-line no-unused-vars
  defaultFilterMethod: function defaultFilterMethod(filter, row, column) {
    var id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true;
  },
  // eslint-disable-next-line no-unused-vars
  defaultSortMethod: function defaultSortMethod(a, b, desc) {
    // force null and undefined to the bottom
    a = a === null || a === undefined ? '' : a;
    b = b === null || b === undefined ? '' : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0, undefined or any falsey value will use subsequent sorts or
    // the index as a tiebreaker
    return 0;
  },

  // Controlled State Props
  // page: undefined,
  // pageSize: undefined,
  // sorted: [],
  // filtered: [],
  // resized: [],
  // expanded: {},

  // Controlled State Callbacks
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortedChange: undefined,
  onFilteredChange: undefined,
  onResizedChange: undefined,
  onExpandedChange: undefined,

  // Pivoting
  pivotBy: undefined,

  // Key Constants
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',
  aggregatedKey: '_aggregated',
  nestingLevelKey: '_nestingLevel',
  originalKey: '_original',
  indexKey: '_index',
  groupedByPivotKey: '_groupedByPivot',

  // Server-side Callbacks
  onFetchData: function onFetchData() {
    return null;
  },

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
  getResizerProps: emptyObj,

  // Global Column Defaults
  column: {
    // Renderers
    Cell: undefined,
    Header: undefined,
    Footer: undefined,
    Aggregated: undefined,
    Pivot: undefined,
    PivotValue: undefined,
    Expander: undefined,
    Filter: undefined,
    Placeholder: undefined,
    // All Columns
    sortable: undefined, // use table default
    resizable: undefined, // use table default
    filterable: undefined, // use table default
    show: true,
    minWidth: 100,
    minResizeWidth: 11,
    // Cells only
    className: '',
    style: {},
    getProps: emptyObj,
    // Pivot only
    aggregate: undefined,
    // Headers only
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: emptyObj,
    // Footers only
    footerClassName: '',
    footerStyle: {},
    getFooterProps: emptyObj,
    filterMethod: undefined,
    filterAll: false,
    sortMethod: undefined
  },

  // Global Expander Column Defaults
  expanderDefaults: {
    sortable: false,
    resizable: false,
    filterable: false,
    width: 35
  },

  pivotDefaults: {
    // extend the defaults for pivoted columns here
  },

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  noDataText: 'No rows found',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',
  pageJumpText: 'jump to page',
  rowsSelectorText: 'rows per page',

  // Components
  TableComponent: React.forwardRef(function (_ref, ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return React.createElement(
      'div',
      _extends({
        ref: ref,
        className: classnames('rt-table', className),
        role: 'grid'
        // tabIndex='0'
      }, rest),
      children
    );
  }),
  TheadComponent: _.makeTemplateComponent('rt-thead', 'Thead'),
  TbodyComponent: _.makeTemplateComponent('rt-tbody', 'Tbody'),
  TrGroupComponent: function TrGroupComponent(_ref2) {
    var children = _ref2.children,
        className = _ref2.className,
        rest = _objectWithoutProperties(_ref2, ['children', 'className']);

    return React.createElement(
      'div',
      _extends({ className: classnames('rt-tr-group', className), role: 'rowgroup' }, rest),
      children
    );
  },
  TrComponent: function TrComponent(_ref3) {
    var children = _ref3.children,
        className = _ref3.className,
        rest = _objectWithoutProperties(_ref3, ['children', 'className']);

    return React.createElement(
      'div',
      _extends({ className: classnames('rt-tr', className), role: 'row' }, rest),
      children
    );
  },
  ThComponent: function ThComponent(_ref4) {
    var toggleSort = _ref4.toggleSort,
        className = _ref4.className,
        children = _ref4.children,
        rest = _objectWithoutProperties(_ref4, ['toggleSort', 'className', 'children']);

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      React.createElement(
        'div',
        _extends({
          className: classnames('rt-th', className),
          onClick: function onClick(e) {
            return toggleSort && toggleSort(e);
          },
          role: 'columnheader',
          tabIndex: '-1' // Resolves eslint issues without implementing keyboard navigation incorrectly
        }, rest),
        children
      )
    );
  },
  TdComponent: function TdComponent(_ref5) {
    var toggleSort = _ref5.toggleSort,
        className = _ref5.className,
        children = _ref5.children,
        rest = _objectWithoutProperties(_ref5, ['toggleSort', 'className', 'children']);

    return React.createElement(
      'div',
      _extends({ className: classnames('rt-td', className), role: 'gridcell' }, rest),
      children
    );
  },
  TfootComponent: _.makeTemplateComponent('rt-tfoot', 'Tfoot'),
  FilterComponent: function FilterComponent(_ref6) {
    var filter = _ref6.filter,
        _onChange = _ref6.onChange,
        column = _ref6.column;
    return React.createElement('input', {
      type: 'text',
      style: {
        width: '100%'
      },
      placeholder: column.Placeholder,
      value: filter ? filter.value : '',
      onChange: function onChange(event) {
        return _onChange(event.target.value);
      }
    });
  },
  ExpanderComponent: function ExpanderComponent(_ref7) {
    var isExpanded = _ref7.isExpanded;
    return React.createElement(
      'div',
      { className: classnames('rt-expander', isExpanded && '-open') },
      '\u2022'
    );
  },
  PivotValueComponent: function PivotValueComponent(_ref8) {
    var subRows = _ref8.subRows,
        value = _ref8.value;
    return React.createElement(
      'span',
      null,
      value,
      ' ',
      subRows && '(' + subRows.length + ')'
    );
  },
  AggregatedComponent: function AggregatedComponent(_ref9) {
    var subRows = _ref9.subRows,
        column = _ref9.column;

    var previewValues = subRows.filter(function (d) {
      return typeof d[column.id] !== 'undefined';
    }).map(function (row, i) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        React.createElement(
          'span',
          { key: i },
          row[column.id],
          i < subRows.length - 1 ? ', ' : ''
        )
      );
    });
    return React.createElement(
      'span',
      null,
      previewValues
    );
  },
  PivotComponent: undefined, // this is a computed default generated using
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: Pagination,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: function LoadingComponent(_ref10) {
    var className = _ref10.className,
        loading = _ref10.loading,
        loadingText = _ref10.loadingText,
        rest = _objectWithoutProperties(_ref10, ['className', 'loading', 'loadingText']);

    return React.createElement(
      'div',
      _extends({ className: classnames('-loading', { '-active': loading }, className) }, rest),
      React.createElement(
        'div',
        { className: '-loading-inner' },
        loadingText
      )
    );
  },
  NoDataComponent: _.makeTemplateComponent('rt-noData', 'NoData'),
  ResizerComponent: _.makeTemplateComponent('rt-resizer', 'Resizer'),
  PadRowComponent: function PadRowComponent() {
    return React.createElement(
      'span',
      null,
      '\xA0'
    );
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0UHJvcHMuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJjbGFzc25hbWVzIiwiXyIsIlBhZ2luYXRpb24iLCJlbXB0eU9iaiIsImRhdGEiLCJyZXNvbHZlRGF0YSIsImxvYWRpbmciLCJzaG93UGFnaW5hdGlvbiIsInNob3dQYWdpbmF0aW9uVG9wIiwic2hvd1BhZ2luYXRpb25Cb3R0b20iLCJzaG93UGFnZVNpemVPcHRpb25zIiwicGFnZVNpemVPcHRpb25zIiwiZGVmYXVsdFBhZ2UiLCJkZWZhdWx0UGFnZVNpemUiLCJzaG93UGFnZUp1bXAiLCJjb2xsYXBzZU9uU29ydGluZ0NoYW5nZSIsImNvbGxhcHNlT25QYWdlQ2hhbmdlIiwiY29sbGFwc2VPbkRhdGFDaGFuZ2UiLCJmcmVlemVXaGVuRXhwYW5kZWQiLCJzb3J0YWJsZSIsIm11bHRpU29ydCIsInJlc2l6YWJsZSIsImZpbHRlcmFibGUiLCJkZWZhdWx0U29ydERlc2MiLCJkZWZhdWx0U29ydGVkIiwiZGVmYXVsdEZpbHRlcmVkIiwiZGVmYXVsdFJlc2l6ZWQiLCJkZWZhdWx0RXhwYW5kZWQiLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwiZmlsdGVyIiwicm93IiwiY29sdW1uIiwiaWQiLCJwaXZvdElkIiwidW5kZWZpbmVkIiwiU3RyaW5nIiwic3RhcnRzV2l0aCIsInZhbHVlIiwiZGVmYXVsdFNvcnRNZXRob2QiLCJhIiwiYiIsImRlc2MiLCJ0b0xvd2VyQ2FzZSIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJvblNvcnRlZENoYW5nZSIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJvblJlc2l6ZWRDaGFuZ2UiLCJvbkV4cGFuZGVkQ2hhbmdlIiwicGl2b3RCeSIsInBpdm90VmFsS2V5IiwicGl2b3RJREtleSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5IiwibmVzdGluZ0xldmVsS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5Iiwib25GZXRjaERhdGEiLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsIkNlbGwiLCJIZWFkZXIiLCJGb290ZXIiLCJBZ2dyZWdhdGVkIiwiUGl2b3QiLCJQaXZvdFZhbHVlIiwiRXhwYW5kZXIiLCJGaWx0ZXIiLCJQbGFjZWhvbGRlciIsInNob3ciLCJtaW5XaWR0aCIsIm1pblJlc2l6ZVdpZHRoIiwiYWdncmVnYXRlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJnZXRIZWFkZXJQcm9wcyIsImZvb3RlckNsYXNzTmFtZSIsImZvb3RlclN0eWxlIiwiZ2V0Rm9vdGVyUHJvcHMiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJzb3J0TWV0aG9kIiwiZXhwYW5kZXJEZWZhdWx0cyIsIndpZHRoIiwicGl2b3REZWZhdWx0cyIsInByZXZpb3VzVGV4dCIsIm5leHRUZXh0IiwibG9hZGluZ1RleHQiLCJub0RhdGFUZXh0IiwicGFnZVRleHQiLCJvZlRleHQiLCJyb3dzVGV4dCIsInBhZ2VKdW1wVGV4dCIsInJvd3NTZWxlY3RvclRleHQiLCJUYWJsZUNvbXBvbmVudCIsImZvcndhcmRSZWYiLCJyZWYiLCJjaGlsZHJlbiIsInJlc3QiLCJUaGVhZENvbXBvbmVudCIsIm1ha2VUZW1wbGF0ZUNvbXBvbmVudCIsIlRib2R5Q29tcG9uZW50IiwiVHJHcm91cENvbXBvbmVudCIsIlRyQ29tcG9uZW50IiwiVGhDb21wb25lbnQiLCJ0b2dnbGVTb3J0IiwiZSIsIlRkQ29tcG9uZW50IiwiVGZvb3RDb21wb25lbnQiLCJGaWx0ZXJDb21wb25lbnQiLCJvbkNoYW5nZSIsImV2ZW50IiwidGFyZ2V0IiwiRXhwYW5kZXJDb21wb25lbnQiLCJpc0V4cGFuZGVkIiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsInN1YlJvd3MiLCJsZW5ndGgiLCJBZ2dyZWdhdGVkQ29tcG9uZW50IiwicHJldmlld1ZhbHVlcyIsImQiLCJtYXAiLCJpIiwiUGl2b3RDb21wb25lbnQiLCJQYWdpbmF0aW9uQ29tcG9uZW50IiwiUHJldmlvdXNDb21wb25lbnQiLCJOZXh0Q29tcG9uZW50IiwiTG9hZGluZ0NvbXBvbmVudCIsIk5vRGF0YUNvbXBvbmVudCIsIlJlc2l6ZXJDb21wb25lbnQiLCJQYWRSb3dDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixZQUF2QjtBQUNBO0FBQ0EsT0FBT0MsQ0FBUCxNQUFjLFNBQWQ7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLGNBQXZCOztBQUVBLElBQU1DLFdBQVcsU0FBWEEsUUFBVztBQUFBLFNBQU8sRUFBUDtBQUFBLENBQWpCOztBQUVBLGVBQWU7QUFDYjtBQUNBQyxRQUFNLEVBRk87QUFHYkMsZUFBYTtBQUFBLFdBQVFELElBQVI7QUFBQSxHQUhBO0FBSWJFLFdBQVMsS0FKSTtBQUtiQyxrQkFBZ0IsSUFMSDtBQU1iQyxxQkFBbUIsS0FOTjtBQU9iQyx3QkFBc0IsSUFQVDtBQVFiQyx1QkFBcUIsSUFSUjtBQVNiQyxtQkFBaUIsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFa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QUEwUGJrSixxQkFBbUJsSCxTQTFQTjtBQTJQYm1ILGlCQUFlbkgsU0EzUEY7QUE0UGJvSCxvQkFBa0I7QUFBQSxRQUNoQjNGLFNBRGdCLFVBQ2hCQSxTQURnQjtBQUFBLFFBQ0xyRCxPQURLLFVBQ0xBLE9BREs7QUFBQSxRQUNJd0csV0FESixVQUNJQSxXQURKO0FBQUEsUUFDb0JXLElBRHBCOztBQUFBLFdBR2hCO0FBQUE7QUFBQSxpQkFBSyxXQUFXekgsV0FBVyxVQUFYLEVBQXVCLEVBQUUsV0FBV00sT0FBYixFQUF2QixFQUErQ3FELFNBQS9DLENBQWhCLElBQStFOEQsSUFBL0U7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGdCQUFmO0FBQWlDWDtBQUFqQztBQURGLEtBSGdCO0FBQUEsR0E1UEw7QUFtUWJ5QyxtQkFBaUJ0SixFQUFFMEgscUJBQUYsQ0FBd0IsV0FBeEIsRUFBcUMsUUFBckMsQ0FuUUo7QUFvUWI2QixvQkFBa0J2SixFQUFFMEgscUJBQUYsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsQ0FwUUw7QUFxUWI4QixtQkFBaUI7QUFBQSxXQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBTjtBQUFBO0FBclFKLENBQWYiLCJmaWxlIjoiZGVmYXVsdFByb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG4vL1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuL3BhZ2luYXRpb24nXHJcblxyXG5jb25zdCBlbXB0eU9iaiA9ICgpID0+ICh7fSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAvLyBHZW5lcmFsXHJcbiAgZGF0YTogW10sXHJcbiAgcmVzb2x2ZURhdGE6IGRhdGEgPT4gZGF0YSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBzaG93UGFnaW5hdGlvbjogdHJ1ZSxcclxuICBzaG93UGFnaW5hdGlvblRvcDogZmFsc2UsXHJcbiAgc2hvd1BhZ2luYXRpb25Cb3R0b206IHRydWUsXHJcbiAgc2hvd1BhZ2VTaXplT3B0aW9uczogdHJ1ZSxcclxuICBwYWdlU2l6ZU9wdGlvbnM6IFs1LCAxMCwgMjAsIDI1LCA1MCwgMTAwXSxcclxuICBkZWZhdWx0UGFnZTogMCxcclxuICBkZWZhdWx0UGFnZVNpemU6IDIwLFxyXG4gIHNob3dQYWdlSnVtcDogdHJ1ZSxcclxuICBjb2xsYXBzZU9uU29ydGluZ0NoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uUGFnZUNoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uRGF0YUNoYW5nZTogdHJ1ZSxcclxuICBmcmVlemVXaGVuRXhwYW5kZWQ6IGZhbHNlLFxyXG4gIHNvcnRhYmxlOiB0cnVlLFxyXG4gIG11bHRpU29ydDogdHJ1ZSxcclxuICByZXNpemFibGU6IHRydWUsXHJcbiAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgZGVmYXVsdFNvcnREZXNjOiBmYWxzZSxcclxuICBkZWZhdWx0U29ydGVkOiBbXSxcclxuICBkZWZhdWx0RmlsdGVyZWQ6IFtdLFxyXG4gIGRlZmF1bHRSZXNpemVkOiBbXSxcclxuICBkZWZhdWx0RXhwYW5kZWQ6IHt9LFxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IChmaWx0ZXIsIHJvdywgY29sdW1uKSA9PiB7XHJcbiAgICBjb25zdCBpZCA9IGZpbHRlci5waXZvdElkIHx8IGZpbHRlci5pZFxyXG4gICAgcmV0dXJuIHJvd1tpZF0gIT09IHVuZGVmaW5lZCA/IFN0cmluZyhyb3dbaWRdKS5zdGFydHNXaXRoKGZpbHRlci52YWx1ZSkgOiB0cnVlXHJcbiAgfSxcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICBkZWZhdWx0U29ydE1ldGhvZDogKGEsIGIsIGRlc2MpID0+IHtcclxuICAgIC8vIGZvcmNlIG51bGwgYW5kIHVuZGVmaW5lZCB0byB0aGUgYm90dG9tXHJcbiAgICBhID0gYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgPyAnJyA6IGFcclxuICAgIGIgPSBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZCA/ICcnIDogYlxyXG4gICAgLy8gZm9yY2UgYW55IHN0cmluZyB2YWx1ZXMgdG8gbG93ZXJjYXNlXHJcbiAgICBhID0gdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogYVxyXG4gICAgYiA9IHR5cGVvZiBiID09PSAnc3RyaW5nJyA/IGIudG9Mb3dlckNhc2UoKSA6IGJcclxuICAgIC8vIFJldHVybiBlaXRoZXIgMSBvciAtMSB0byBpbmRpY2F0ZSBhIHNvcnQgcHJpb3JpdHlcclxuICAgIGlmIChhID4gYikge1xyXG4gICAgICByZXR1cm4gMVxyXG4gICAgfVxyXG4gICAgaWYgKGEgPCBiKSB7XHJcbiAgICAgIHJldHVybiAtMVxyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuaW5nIDAsIHVuZGVmaW5lZCBvciBhbnkgZmFsc2V5IHZhbHVlIHdpbGwgdXNlIHN1YnNlcXVlbnQgc29ydHMgb3JcclxuICAgIC8vIHRoZSBpbmRleCBhcyBhIHRpZWJyZWFrZXJcclxuICAgIHJldHVybiAwXHJcbiAgfSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBQcm9wc1xyXG4gIC8vIHBhZ2U6IHVuZGVmaW5lZCxcclxuICAvLyBwYWdlU2l6ZTogdW5kZWZpbmVkLFxyXG4gIC8vIHNvcnRlZDogW10sXHJcbiAgLy8gZmlsdGVyZWQ6IFtdLFxyXG4gIC8vIHJlc2l6ZWQ6IFtdLFxyXG4gIC8vIGV4cGFuZGVkOiB7fSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBDYWxsYmFja3NcclxuICBvblBhZ2VDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvblBhZ2VTaXplQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25Tb3J0ZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvbkZpbHRlcmVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25SZXNpemVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25FeHBhbmRlZENoYW5nZTogdW5kZWZpbmVkLFxyXG5cclxuICAvLyBQaXZvdGluZ1xyXG4gIHBpdm90Qnk6IHVuZGVmaW5lZCxcclxuXHJcbiAgLy8gS2V5IENvbnN0YW50c1xyXG4gIHBpdm90VmFsS2V5OiAnX3Bpdm90VmFsJyxcclxuICBwaXZvdElES2V5OiAnX3Bpdm90SUQnLFxyXG4gIHN1YlJvd3NLZXk6ICdfc3ViUm93cycsXHJcbiAgYWdncmVnYXRlZEtleTogJ19hZ2dyZWdhdGVkJyxcclxuICBuZXN0aW5nTGV2ZWxLZXk6ICdfbmVzdGluZ0xldmVsJyxcclxuICBvcmlnaW5hbEtleTogJ19vcmlnaW5hbCcsXHJcbiAgaW5kZXhLZXk6ICdfaW5kZXgnLFxyXG4gIGdyb3VwZWRCeVBpdm90S2V5OiAnX2dyb3VwZWRCeVBpdm90JyxcclxuXHJcbiAgLy8gU2VydmVyLXNpZGUgQ2FsbGJhY2tzXHJcbiAgb25GZXRjaERhdGE6ICgpID0+IG51bGwsXHJcblxyXG4gIC8vIENsYXNzZXNcclxuICBjbGFzc05hbWU6ICcnLFxyXG4gIHN0eWxlOiB7fSxcclxuXHJcbiAgLy8gQ29tcG9uZW50IGRlY29yYXRvcnNcclxuICBnZXRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGFibGVQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEdyb3VwVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFRoUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRUaFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkRmlsdGVyVGhQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGJvZHlQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VHJHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRmb290VGRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0UGFnaW5hdGlvblByb3BzOiBlbXB0eU9iaixcclxuICBnZXRMb2FkaW5nUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldE5vRGF0YVByb3BzOiBlbXB0eU9iaixcclxuICBnZXRSZXNpemVyUHJvcHM6IGVtcHR5T2JqLFxyXG5cclxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXHJcbiAgY29sdW1uOiB7XHJcbiAgICAvLyBSZW5kZXJlcnNcclxuICAgIENlbGw6IHVuZGVmaW5lZCxcclxuICAgIEhlYWRlcjogdW5kZWZpbmVkLFxyXG4gICAgRm9vdGVyOiB1bmRlZmluZWQsXHJcbiAgICBBZ2dyZWdhdGVkOiB1bmRlZmluZWQsXHJcbiAgICBQaXZvdDogdW5kZWZpbmVkLFxyXG4gICAgUGl2b3RWYWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgRXhwYW5kZXI6IHVuZGVmaW5lZCxcclxuICAgIEZpbHRlcjogdW5kZWZpbmVkLFxyXG4gICAgUGxhY2Vob2xkZXI6IHVuZGVmaW5lZCxcclxuICAgIC8vIEFsbCBDb2x1bW5zXHJcbiAgICBzb3J0YWJsZTogdW5kZWZpbmVkLCAvLyB1c2UgdGFibGUgZGVmYXVsdFxyXG4gICAgcmVzaXphYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XHJcbiAgICBmaWx0ZXJhYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XHJcbiAgICBzaG93OiB0cnVlLFxyXG4gICAgbWluV2lkdGg6IDEwMCxcclxuICAgIG1pblJlc2l6ZVdpZHRoOiAxMSxcclxuICAgIC8vIENlbGxzIG9ubHlcclxuICAgIGNsYXNzTmFtZTogJycsXHJcbiAgICBzdHlsZToge30sXHJcbiAgICBnZXRQcm9wczogZW1wdHlPYmosXHJcbiAgICAvLyBQaXZvdCBvbmx5XHJcbiAgICBhZ2dyZWdhdGU6IHVuZGVmaW5lZCxcclxuICAgIC8vIEhlYWRlcnMgb25seVxyXG4gICAgaGVhZGVyQ2xhc3NOYW1lOiAnJyxcclxuICAgIGhlYWRlclN0eWxlOiB7fSxcclxuICAgIGdldEhlYWRlclByb3BzOiBlbXB0eU9iaixcclxuICAgIC8vIEZvb3RlcnMgb25seVxyXG4gICAgZm9vdGVyQ2xhc3NOYW1lOiAnJyxcclxuICAgIGZvb3RlclN0eWxlOiB7fSxcclxuICAgIGdldEZvb3RlclByb3BzOiBlbXB0eU9iaixcclxuICAgIGZpbHRlck1ldGhvZDogdW5kZWZpbmVkLFxyXG4gICAgZmlsdGVyQWxsOiBmYWxzZSxcclxuICAgIHNvcnRNZXRob2Q6IHVuZGVmaW5lZCxcclxuICB9LFxyXG5cclxuICAvLyBHbG9iYWwgRXhwYW5kZXIgQ29sdW1uIERlZmF1bHRzXHJcbiAgZXhwYW5kZXJEZWZhdWx0czoge1xyXG4gICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gICAgd2lkdGg6IDM1LFxyXG4gIH0sXHJcblxyXG4gIHBpdm90RGVmYXVsdHM6IHtcclxuICAgIC8vIGV4dGVuZCB0aGUgZGVmYXVsdHMgZm9yIHBpdm90ZWQgY29sdW1ucyBoZXJlXHJcbiAgfSxcclxuXHJcbiAgLy8gVGV4dFxyXG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcclxuICBuZXh0VGV4dDogJ05leHQnLFxyXG4gIGxvYWRpbmdUZXh0OiAnTG9hZGluZy4uLicsXHJcbiAgbm9EYXRhVGV4dDogJ05vIHJvd3MgZm91bmQnLFxyXG4gIHBhZ2VUZXh0OiAnUGFnZScsXHJcbiAgb2ZUZXh0OiAnb2YnLFxyXG4gIHJvd3NUZXh0OiAncm93cycsXHJcbiAgcGFnZUp1bXBUZXh0OiAnanVtcCB0byBwYWdlJyxcclxuICByb3dzU2VsZWN0b3JUZXh0OiAncm93cyBwZXIgcGFnZScsXHJcblxyXG4gIC8vIENvbXBvbmVudHNcclxuICBUYWJsZUNvbXBvbmVudDogUmVhY3QuZm9yd2FyZFJlZigoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0sIHJlZikgPT4gKFxyXG4gICAgPGRpdlxyXG4gICAgICByZWY9e3JlZn1cclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10YWJsZScsIGNsYXNzTmFtZSl9XHJcbiAgICAgIHJvbGU9XCJncmlkXCJcclxuICAgICAgLy8gdGFiSW5kZXg9JzAnXHJcbiAgICAgIHsuLi5yZXN0fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApKSxcclxuICBUaGVhZENvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXRoZWFkJywgJ1RoZWFkJyksXHJcbiAgVGJvZHlDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10Ym9keScsICdUYm9keScpLFxyXG4gIFRyR3JvdXBDb21wb25lbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRyLWdyb3VwJywgY2xhc3NOYW1lKX0gcm9sZT1cInJvd2dyb3VwXCIgey4uLnJlc3R9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRyQ29tcG9uZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10cicsIGNsYXNzTmFtZSl9IHJvbGU9XCJyb3dcIiB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGhDb21wb25lbnQ6ICh7XHJcbiAgICB0b2dnbGVTb3J0LCBjbGFzc05hbWUsIGNoaWxkcmVuLCAuLi5yZXN0XHJcbiAgfSkgPT4gKFxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcclxuICAgIDxkaXZcclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10aCcsIGNsYXNzTmFtZSl9XHJcbiAgICAgIG9uQ2xpY2s9e2UgPT4gdG9nZ2xlU29ydCAmJiB0b2dnbGVTb3J0KGUpfVxyXG4gICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcclxuICAgICAgdGFiSW5kZXg9XCItMVwiIC8vIFJlc29sdmVzIGVzbGludCBpc3N1ZXMgd2l0aG91dCBpbXBsZW1lbnRpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbiBpbmNvcnJlY3RseVxyXG4gICAgICB7Li4ucmVzdH1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBUZENvbXBvbmVudDogKHtcclxuICAgIHRvZ2dsZVNvcnQsIGNsYXNzTmFtZSwgY2hpbGRyZW4sIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtdGQnLCBjbGFzc05hbWUpfSByb2xlPVwiZ3JpZGNlbGxcIiB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGZvb3RDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10Zm9vdCcsICdUZm9vdCcpLFxyXG4gIEZpbHRlckNvbXBvbmVudDogKHsgZmlsdGVyLCBvbkNoYW5nZSwgY29sdW1uIH0pID0+IChcclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgICAgcGxhY2Vob2xkZXI9e2NvbHVtbi5QbGFjZWhvbGRlcn1cclxuICAgICAgdmFsdWU9e2ZpbHRlciA/IGZpbHRlci52YWx1ZSA6ICcnfVxyXG4gICAgICBvbkNoYW5nZT17ZXZlbnQgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cclxuICAgIC8+XHJcbiAgKSxcclxuICBFeHBhbmRlckNvbXBvbmVudDogKHsgaXNFeHBhbmRlZCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtZXhwYW5kZXInLCBpc0V4cGFuZGVkICYmICctb3BlbicpfT4mYnVsbDs8L2Rpdj5cclxuICApLFxyXG4gIFBpdm90VmFsdWVDb21wb25lbnQ6ICh7IHN1YlJvd3MsIHZhbHVlIH0pID0+IChcclxuICAgIDxzcGFuPlxyXG4gICAgICB7dmFsdWV9IHtzdWJSb3dzICYmIGAoJHtzdWJSb3dzLmxlbmd0aH0pYH1cclxuICAgIDwvc3Bhbj5cclxuICApLFxyXG4gIEFnZ3JlZ2F0ZWRDb21wb25lbnQ6ICh7IHN1YlJvd3MsIGNvbHVtbiB9KSA9PiB7XHJcbiAgICBjb25zdCBwcmV2aWV3VmFsdWVzID0gc3ViUm93cy5maWx0ZXIoZCA9PiB0eXBlb2YgZFtjb2x1bW4uaWRdICE9PSAndW5kZWZpbmVkJykubWFwKChyb3csIGkpID0+IChcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICA8c3BhbiBrZXk9e2l9PlxyXG4gICAgICAgIHtyb3dbY29sdW1uLmlkXX1cclxuICAgICAgICB7aSA8IHN1YlJvd3MubGVuZ3RoIC0gMSA/ICcsICcgOiAnJ31cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKSlcclxuICAgIHJldHVybiA8c3Bhbj57cHJldmlld1ZhbHVlc308L3NwYW4+XHJcbiAgfSxcclxuICBQaXZvdENvbXBvbmVudDogdW5kZWZpbmVkLCAvLyB0aGlzIGlzIGEgY29tcHV0ZWQgZGVmYXVsdCBnZW5lcmF0ZWQgdXNpbmdcclxuICAvLyB0aGUgRXhwYW5kZXJDb21wb25lbnQgYW5kIFBpdm90VmFsdWVDb21wb25lbnQgYXQgcnVuLXRpbWUgaW4gbWV0aG9kcy5qc1xyXG4gIFBhZ2luYXRpb25Db21wb25lbnQ6IFBhZ2luYXRpb24sXHJcbiAgUHJldmlvdXNDb21wb25lbnQ6IHVuZGVmaW5lZCxcclxuICBOZXh0Q29tcG9uZW50OiB1bmRlZmluZWQsXHJcbiAgTG9hZGluZ0NvbXBvbmVudDogKHtcclxuICAgIGNsYXNzTmFtZSwgbG9hZGluZywgbG9hZGluZ1RleHQsIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWxvYWRpbmcnLCB7ICctYWN0aXZlJzogbG9hZGluZyB9LCBjbGFzc05hbWUpfSB7Li4ucmVzdH0+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLWxvYWRpbmctaW5uZXJcIj57bG9hZGluZ1RleHR9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIE5vRGF0YUNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LW5vRGF0YScsICdOb0RhdGEnKSxcclxuICBSZXNpemVyQ29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtcmVzaXplcicsICdSZXNpemVyJyksXHJcbiAgUGFkUm93Q29tcG9uZW50OiAoKSA9PiA8c3Bhbj4mbmJzcDs8L3NwYW4+LFxyXG59XHJcbiJdfQ==