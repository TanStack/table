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
  TableComponent: function TableComponent(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return React.createElement(
      'div',
      _extends({
        className: classnames('rt-table', className),
        role: 'grid'
        // tabIndex='0'
      }, rest),
      children
    );
  },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0UHJvcHMuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJjbGFzc25hbWVzIiwiXyIsIlBhZ2luYXRpb24iLCJlbXB0eU9iaiIsImRhdGEiLCJyZXNvbHZlRGF0YSIsImxvYWRpbmciLCJzaG93UGFnaW5hdGlvbiIsInNob3dQYWdpbmF0aW9uVG9wIiwic2hvd1BhZ2luYXRpb25Cb3R0b20iLCJzaG93UGFnZVNpemVPcHRpb25zIiwicGFnZVNpemVPcHRpb25zIiwiZGVmYXVsdFBhZ2UiLCJkZWZhdWx0UGFnZVNpemUiLCJzaG93UGFnZUp1bXAiLCJjb2xsYXBzZU9uU29ydGluZ0NoYW5nZSIsImNvbGxhcHNlT25QYWdlQ2hhbmdlIiwiY29sbGFwc2VPbkRhdGFDaGFuZ2UiLCJmcmVlemVXaGVuRXhwYW5kZWQiLCJzb3J0YWJsZSIsIm11bHRpU29ydCIsInJlc2l6YWJsZSIsImZpbHRlcmFibGUiLCJkZWZhdWx0U29ydERlc2MiLCJkZWZhdWx0U29ydGVkIiwiZGVmYXVsdEZpbHRlcmVkIiwiZGVmYXVsdFJlc2l6ZWQiLCJkZWZhdWx0RXhwYW5kZWQiLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwiZmlsdGVyIiwicm93IiwiY29sdW1uIiwiaWQiLCJwaXZvdElkIiwidW5kZWZpbmVkIiwiU3RyaW5nIiwic3RhcnRzV2l0aCIsInZhbHVlIiwiZGVmYXVsdFNvcnRNZXRob2QiLCJhIiwiYiIsImRlc2MiLCJ0b0xvd2VyQ2FzZSIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJvblNvcnRlZENoYW5nZSIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJvblJlc2l6ZWRDaGFuZ2UiLCJvbkV4cGFuZGVkQ2hhbmdlIiwicGl2b3RCeSIsInBpdm90VmFsS2V5IiwicGl2b3RJREtleSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5IiwibmVzdGluZ0xldmVsS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5Iiwib25GZXRjaERhdGEiLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsIkNlbGwiLCJIZWFkZXIiLCJGb290ZXIiLCJBZ2dyZWdhdGVkIiwiUGl2b3QiLCJQaXZvdFZhbHVlIiwiRXhwYW5kZXIiLCJGaWx0ZXIiLCJQbGFjZWhvbGRlciIsInNob3ciLCJtaW5XaWR0aCIsIm1pblJlc2l6ZVdpZHRoIiwiYWdncmVnYXRlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJnZXRIZWFkZXJQcm9wcyIsImZvb3RlckNsYXNzTmFtZSIsImZvb3RlclN0eWxlIiwiZ2V0Rm9vdGVyUHJvcHMiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJzb3J0TWV0aG9kIiwiZXhwYW5kZXJEZWZhdWx0cyIsIndpZHRoIiwicGl2b3REZWZhdWx0cyIsInByZXZpb3VzVGV4dCIsIm5leHRUZXh0IiwibG9hZGluZ1RleHQiLCJub0RhdGFUZXh0IiwicGFnZVRleHQiLCJvZlRleHQiLCJyb3dzVGV4dCIsInBhZ2VKdW1wVGV4dCIsInJvd3NTZWxlY3RvclRleHQiLCJUYWJsZUNvbXBvbmVudCIsImNoaWxkcmVuIiwicmVzdCIsIlRoZWFkQ29tcG9uZW50IiwibWFrZVRlbXBsYXRlQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckdyb3VwQ29tcG9uZW50IiwiVHJDb21wb25lbnQiLCJUaENvbXBvbmVudCIsInRvZ2dsZVNvcnQiLCJlIiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJ0YXJnZXQiLCJFeHBhbmRlckNvbXBvbmVudCIsImlzRXhwYW5kZWQiLCJQaXZvdFZhbHVlQ29tcG9uZW50Iiwic3ViUm93cyIsImxlbmd0aCIsIkFnZ3JlZ2F0ZWRDb21wb25lbnQiLCJwcmV2aWV3VmFsdWVzIiwiZCIsIm1hcCIsImkiLCJQaXZvdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLFlBQXZCO0FBQ0E7QUFDQSxPQUFPQyxDQUFQLE1BQWMsU0FBZDtBQUNBLE9BQU9DLFVBQVAsTUFBdUIsY0FBdkI7O0FBRUEsSUFBTUMsV0FBVyxTQUFYQSxRQUFXO0FBQUEsU0FBTyxFQUFQO0FBQUEsQ0FBakI7O0FBRUEsZUFBZTtBQUNiO0FBQ0FDLFFBQU0sRUFGTztBQUdiQyxlQUFhO0FBQUEsV0FBUUQsSUFBUjtBQUFBLEdBSEE7QUFJYkUsV0FBUyxLQUpJO0FBS2JDLGtCQUFnQixJQUxIO0FBTWJDLHFCQUFtQixLQU5OO0FBT2JDLHdCQUFzQixJQVBUO0FBUWJDLHVCQUFxQixJQVJSO0FBU2JDLG1CQUFpQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsRUFBb0Is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QixVQUNoQkEsU0FEZ0I7QUFBQSxRQUNMckQsT0FESyxVQUNMQSxPQURLO0FBQUEsUUFDSXdHLFdBREosVUFDSUEsV0FESjtBQUFBLFFBQ29CUyxJQURwQjs7QUFBQSxXQUdoQjtBQUFBO0FBQUEsaUJBQUssV0FBV3ZILFdBQVcsVUFBWCxFQUF1QixFQUFFLFdBQVdNLE9BQWIsRUFBdkIsRUFBK0NxRCxTQUEvQyxDQUFoQixJQUErRTRELElBQS9FO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxnQkFBZjtBQUFpQ1Q7QUFBakM7QUFERixLQUhnQjtBQUFBLEdBM1BMO0FBa1FidUMsbUJBQWlCcEosRUFBRXdILHFCQUFGLENBQXdCLFdBQXhCLEVBQXFDLFFBQXJDLENBbFFKO0FBbVFiNkIsb0JBQWtCckosRUFBRXdILHFCQUFGLENBQXdCLFlBQXhCLEVBQXNDLFNBQXRDLENBblFMO0FBb1FiOEIsbUJBQWlCO0FBQUEsV0FBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQU47QUFBQTtBQXBRSixDQUFmIiwiZmlsZSI6ImRlZmF1bHRQcm9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcclxuLy9cclxuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi9wYWdpbmF0aW9uJ1xyXG5cclxuY29uc3QgZW1wdHlPYmogPSAoKSA9PiAoe30pXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgLy8gR2VuZXJhbFxyXG4gIGRhdGE6IFtdLFxyXG4gIHJlc29sdmVEYXRhOiBkYXRhID0+IGRhdGEsXHJcbiAgbG9hZGluZzogZmFsc2UsXHJcbiAgc2hvd1BhZ2luYXRpb246IHRydWUsXHJcbiAgc2hvd1BhZ2luYXRpb25Ub3A6IGZhbHNlLFxyXG4gIHNob3dQYWdpbmF0aW9uQm90dG9tOiB0cnVlLFxyXG4gIHNob3dQYWdlU2l6ZU9wdGlvbnM6IHRydWUsXHJcbiAgcGFnZVNpemVPcHRpb25zOiBbNSwgMTAsIDIwLCAyNSwgNTAsIDEwMF0sXHJcbiAgZGVmYXVsdFBhZ2U6IDAsXHJcbiAgZGVmYXVsdFBhZ2VTaXplOiAyMCxcclxuICBzaG93UGFnZUp1bXA6IHRydWUsXHJcbiAgY29sbGFwc2VPblNvcnRpbmdDaGFuZ2U6IHRydWUsXHJcbiAgY29sbGFwc2VPblBhZ2VDaGFuZ2U6IHRydWUsXHJcbiAgY29sbGFwc2VPbkRhdGFDaGFuZ2U6IHRydWUsXHJcbiAgZnJlZXplV2hlbkV4cGFuZGVkOiBmYWxzZSxcclxuICBzb3J0YWJsZTogdHJ1ZSxcclxuICBtdWx0aVNvcnQ6IHRydWUsXHJcbiAgcmVzaXphYmxlOiB0cnVlLFxyXG4gIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gIGRlZmF1bHRTb3J0RGVzYzogZmFsc2UsXHJcbiAgZGVmYXVsdFNvcnRlZDogW10sXHJcbiAgZGVmYXVsdEZpbHRlcmVkOiBbXSxcclxuICBkZWZhdWx0UmVzaXplZDogW10sXHJcbiAgZGVmYXVsdEV4cGFuZGVkOiB7fSxcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICBkZWZhdWx0RmlsdGVyTWV0aG9kOiAoZmlsdGVyLCByb3csIGNvbHVtbikgPT4ge1xyXG4gICAgY29uc3QgaWQgPSBmaWx0ZXIucGl2b3RJZCB8fCBmaWx0ZXIuaWRcclxuICAgIHJldHVybiByb3dbaWRdICE9PSB1bmRlZmluZWQgPyBTdHJpbmcocm93W2lkXSkuc3RhcnRzV2l0aChmaWx0ZXIudmFsdWUpIDogdHJ1ZVxyXG4gIH0sXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgZGVmYXVsdFNvcnRNZXRob2Q6IChhLCBiLCBkZXNjKSA9PiB7XHJcbiAgICAvLyBmb3JjZSBudWxsIGFuZCB1bmRlZmluZWQgdG8gdGhlIGJvdHRvbVxyXG4gICAgYSA9IGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkID8gJycgOiBhXHJcbiAgICBiID0gYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQgPyAnJyA6IGJcclxuICAgIC8vIGZvcmNlIGFueSBzdHJpbmcgdmFsdWVzIHRvIGxvd2VyY2FzZVxyXG4gICAgYSA9IHR5cGVvZiBhID09PSAnc3RyaW5nJyA/IGEudG9Mb3dlckNhc2UoKSA6IGFcclxuICAgIGIgPSB0eXBlb2YgYiA9PT0gJ3N0cmluZycgPyBiLnRvTG93ZXJDYXNlKCkgOiBiXHJcbiAgICAvLyBSZXR1cm4gZWl0aGVyIDEgb3IgLTEgdG8gaW5kaWNhdGUgYSBzb3J0IHByaW9yaXR5XHJcbiAgICBpZiAoYSA+IGIpIHtcclxuICAgICAgcmV0dXJuIDFcclxuICAgIH1cclxuICAgIGlmIChhIDwgYikge1xyXG4gICAgICByZXR1cm4gLTFcclxuICAgIH1cclxuICAgIC8vIHJldHVybmluZyAwLCB1bmRlZmluZWQgb3IgYW55IGZhbHNleSB2YWx1ZSB3aWxsIHVzZSBzdWJzZXF1ZW50IHNvcnRzIG9yXHJcbiAgICAvLyB0aGUgaW5kZXggYXMgYSB0aWVicmVha2VyXHJcbiAgICByZXR1cm4gMFxyXG4gIH0sXHJcblxyXG4gIC8vIENvbnRyb2xsZWQgU3RhdGUgUHJvcHNcclxuICAvLyBwYWdlOiB1bmRlZmluZWQsXHJcbiAgLy8gcGFnZVNpemU6IHVuZGVmaW5lZCxcclxuICAvLyBzb3J0ZWQ6IFtdLFxyXG4gIC8vIGZpbHRlcmVkOiBbXSxcclxuICAvLyByZXNpemVkOiBbXSxcclxuICAvLyBleHBhbmRlZDoge30sXHJcblxyXG4gIC8vIENvbnRyb2xsZWQgU3RhdGUgQ2FsbGJhY2tzXHJcbiAgb25QYWdlQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25QYWdlU2l6ZUNoYW5nZTogdW5kZWZpbmVkLFxyXG4gIG9uU29ydGVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25GaWx0ZXJlZENoYW5nZTogdW5kZWZpbmVkLFxyXG4gIG9uUmVzaXplZENoYW5nZTogdW5kZWZpbmVkLFxyXG4gIG9uRXhwYW5kZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuXHJcbiAgLy8gUGl2b3RpbmdcclxuICBwaXZvdEJ5OiB1bmRlZmluZWQsXHJcblxyXG4gIC8vIEtleSBDb25zdGFudHNcclxuICBwaXZvdFZhbEtleTogJ19waXZvdFZhbCcsXHJcbiAgcGl2b3RJREtleTogJ19waXZvdElEJyxcclxuICBzdWJSb3dzS2V5OiAnX3N1YlJvd3MnLFxyXG4gIGFnZ3JlZ2F0ZWRLZXk6ICdfYWdncmVnYXRlZCcsXHJcbiAgbmVzdGluZ0xldmVsS2V5OiAnX25lc3RpbmdMZXZlbCcsXHJcbiAgb3JpZ2luYWxLZXk6ICdfb3JpZ2luYWwnLFxyXG4gIGluZGV4S2V5OiAnX2luZGV4JyxcclxuICBncm91cGVkQnlQaXZvdEtleTogJ19ncm91cGVkQnlQaXZvdCcsXHJcblxyXG4gIC8vIFNlcnZlci1zaWRlIENhbGxiYWNrc1xyXG4gIG9uRmV0Y2hEYXRhOiAoKSA9PiBudWxsLFxyXG5cclxuICAvLyBDbGFzc2VzXHJcbiAgY2xhc3NOYW1lOiAnJyxcclxuICBzdHlsZToge30sXHJcblxyXG4gIC8vIENvbXBvbmVudCBkZWNvcmF0b3JzXHJcbiAgZ2V0UHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRhYmxlUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkR3JvdXBQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkR3JvdXBUaFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZFRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkVGhQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRGaWx0ZXJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRGaWx0ZXJUclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclRoUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRib2R5UHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRyR3JvdXBQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGZvb3RQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGZvb3RUclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFRkUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFBhZ2luYXRpb25Qcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0TG9hZGluZ1Byb3BzOiBlbXB0eU9iaixcclxuICBnZXROb0RhdGFQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0UmVzaXplclByb3BzOiBlbXB0eU9iaixcclxuXHJcbiAgLy8gR2xvYmFsIENvbHVtbiBEZWZhdWx0c1xyXG4gIGNvbHVtbjoge1xyXG4gICAgLy8gUmVuZGVyZXJzXHJcbiAgICBDZWxsOiB1bmRlZmluZWQsXHJcbiAgICBIZWFkZXI6IHVuZGVmaW5lZCxcclxuICAgIEZvb3RlcjogdW5kZWZpbmVkLFxyXG4gICAgQWdncmVnYXRlZDogdW5kZWZpbmVkLFxyXG4gICAgUGl2b3Q6IHVuZGVmaW5lZCxcclxuICAgIFBpdm90VmFsdWU6IHVuZGVmaW5lZCxcclxuICAgIEV4cGFuZGVyOiB1bmRlZmluZWQsXHJcbiAgICBGaWx0ZXI6IHVuZGVmaW5lZCxcclxuICAgIFBsYWNlaG9sZGVyOiB1bmRlZmluZWQsXHJcbiAgICAvLyBBbGwgQ29sdW1uc1xyXG4gICAgc29ydGFibGU6IHVuZGVmaW5lZCwgLy8gdXNlIHRhYmxlIGRlZmF1bHRcclxuICAgIHJlc2l6YWJsZTogdW5kZWZpbmVkLCAvLyB1c2UgdGFibGUgZGVmYXVsdFxyXG4gICAgZmlsdGVyYWJsZTogdW5kZWZpbmVkLCAvLyB1c2UgdGFibGUgZGVmYXVsdFxyXG4gICAgc2hvdzogdHJ1ZSxcclxuICAgIG1pbldpZHRoOiAxMDAsXHJcbiAgICBtaW5SZXNpemVXaWR0aDogMTEsXHJcbiAgICAvLyBDZWxscyBvbmx5XHJcbiAgICBjbGFzc05hbWU6ICcnLFxyXG4gICAgc3R5bGU6IHt9LFxyXG4gICAgZ2V0UHJvcHM6IGVtcHR5T2JqLFxyXG4gICAgLy8gUGl2b3Qgb25seVxyXG4gICAgYWdncmVnYXRlOiB1bmRlZmluZWQsXHJcbiAgICAvLyBIZWFkZXJzIG9ubHlcclxuICAgIGhlYWRlckNsYXNzTmFtZTogJycsXHJcbiAgICBoZWFkZXJTdHlsZToge30sXHJcbiAgICBnZXRIZWFkZXJQcm9wczogZW1wdHlPYmosXHJcbiAgICAvLyBGb290ZXJzIG9ubHlcclxuICAgIGZvb3RlckNsYXNzTmFtZTogJycsXHJcbiAgICBmb290ZXJTdHlsZToge30sXHJcbiAgICBnZXRGb290ZXJQcm9wczogZW1wdHlPYmosXHJcbiAgICBmaWx0ZXJNZXRob2Q6IHVuZGVmaW5lZCxcclxuICAgIGZpbHRlckFsbDogZmFsc2UsXHJcbiAgICBzb3J0TWV0aG9kOiB1bmRlZmluZWQsXHJcbiAgfSxcclxuXHJcbiAgLy8gR2xvYmFsIEV4cGFuZGVyIENvbHVtbiBEZWZhdWx0c1xyXG4gIGV4cGFuZGVyRGVmYXVsdHM6IHtcclxuICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICBmaWx0ZXJhYmxlOiBmYWxzZSxcclxuICAgIHdpZHRoOiAzNSxcclxuICB9LFxyXG5cclxuICBwaXZvdERlZmF1bHRzOiB7XHJcbiAgICAvLyBleHRlbmQgdGhlIGRlZmF1bHRzIGZvciBwaXZvdGVkIGNvbHVtbnMgaGVyZVxyXG4gIH0sXHJcblxyXG4gIC8vIFRleHRcclxuICBwcmV2aW91c1RleHQ6ICdQcmV2aW91cycsXHJcbiAgbmV4dFRleHQ6ICdOZXh0JyxcclxuICBsb2FkaW5nVGV4dDogJ0xvYWRpbmcuLi4nLFxyXG4gIG5vRGF0YVRleHQ6ICdObyByb3dzIGZvdW5kJyxcclxuICBwYWdlVGV4dDogJ1BhZ2UnLFxyXG4gIG9mVGV4dDogJ29mJyxcclxuICByb3dzVGV4dDogJ3Jvd3MnLFxyXG4gIHBhZ2VKdW1wVGV4dDogJ2p1bXAgdG8gcGFnZScsXHJcbiAgcm93c1NlbGVjdG9yVGV4dDogJ3Jvd3MgcGVyIHBhZ2UnLFxyXG5cclxuICAvLyBDb21wb25lbnRzXHJcbiAgVGFibGVDb21wb25lbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRhYmxlJywgY2xhc3NOYW1lKX1cclxuICAgICAgcm9sZT1cImdyaWRcIlxyXG4gICAgICAvLyB0YWJJbmRleD0nMCdcclxuICAgICAgey4uLnJlc3R9XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGhlYWRDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10aGVhZCcsICdUaGVhZCcpLFxyXG4gIFRib2R5Q29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtdGJvZHknLCAnVGJvZHknKSxcclxuICBUckdyb3VwQ29tcG9uZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10ci1ncm91cCcsIGNsYXNzTmFtZSl9IHJvbGU9XCJyb3dncm91cFwiIHsuLi5yZXN0fT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBUckNvbXBvbmVudDogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgLi4ucmVzdCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtdHInLCBjbGFzc05hbWUpfSByb2xlPVwicm93XCIgey4uLnJlc3R9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRoQ29tcG9uZW50OiAoe1xyXG4gICAgdG9nZ2xlU29ydCwgY2xhc3NOYW1lLCBjaGlsZHJlbiwgLi4ucmVzdFxyXG4gIH0pID0+IChcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc3gtYTExeS9jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtdGgnLCBjbGFzc05hbWUpfVxyXG4gICAgICBvbkNsaWNrPXtlID0+IHRvZ2dsZVNvcnQgJiYgdG9nZ2xlU29ydChlKX1cclxuICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXHJcbiAgICAgIHRhYkluZGV4PVwiLTFcIiAvLyBSZXNvbHZlcyBlc2xpbnQgaXNzdWVzIHdpdGhvdXQgaW1wbGVtZW50aW5nIGtleWJvYXJkIG5hdmlnYXRpb24gaW5jb3JyZWN0bHlcclxuICAgICAgey4uLnJlc3R9XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGRDb21wb25lbnQ6ICh7XHJcbiAgICB0b2dnbGVTb3J0LCBjbGFzc05hbWUsIGNoaWxkcmVuLCAuLi5yZXN0XHJcbiAgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRkJywgY2xhc3NOYW1lKX0gcm9sZT1cImdyaWRjZWxsXCIgey4uLnJlc3R9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRmb290Q29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtdGZvb3QnLCAnVGZvb3QnKSxcclxuICBGaWx0ZXJDb21wb25lbnQ6ICh7IGZpbHRlciwgb25DaGFuZ2UsIGNvbHVtbiB9KSA9PiAoXHJcbiAgICA8aW5wdXRcclxuICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIH19XHJcbiAgICAgIHBsYWNlaG9sZGVyPXtjb2x1bW4uUGxhY2Vob2xkZXJ9XHJcbiAgICAgIHZhbHVlPXtmaWx0ZXIgPyBmaWx0ZXIudmFsdWUgOiAnJ31cclxuICAgICAgb25DaGFuZ2U9e2V2ZW50ID0+IG9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSl9XHJcbiAgICAvPlxyXG4gICksXHJcbiAgRXhwYW5kZXJDb21wb25lbnQ6ICh7IGlzRXhwYW5kZWQgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LWV4cGFuZGVyJywgaXNFeHBhbmRlZCAmJiAnLW9wZW4nKX0+JmJ1bGw7PC9kaXY+XHJcbiAgKSxcclxuICBQaXZvdFZhbHVlQ29tcG9uZW50OiAoeyBzdWJSb3dzLCB2YWx1ZSB9KSA9PiAoXHJcbiAgICA8c3Bhbj5cclxuICAgICAge3ZhbHVlfSB7c3ViUm93cyAmJiBgKCR7c3ViUm93cy5sZW5ndGh9KWB9XHJcbiAgICA8L3NwYW4+XHJcbiAgKSxcclxuICBBZ2dyZWdhdGVkQ29tcG9uZW50OiAoeyBzdWJSb3dzLCBjb2x1bW4gfSkgPT4ge1xyXG4gICAgY29uc3QgcHJldmlld1ZhbHVlcyA9IHN1YlJvd3MuZmlsdGVyKGQgPT4gdHlwZW9mIGRbY29sdW1uLmlkXSAhPT0gJ3VuZGVmaW5lZCcpLm1hcCgocm93LCBpKSA9PiAoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgPHNwYW4ga2V5PXtpfT5cclxuICAgICAgICB7cm93W2NvbHVtbi5pZF19XHJcbiAgICAgICAge2kgPCBzdWJSb3dzLmxlbmd0aCAtIDEgPyAnLCAnIDogJyd9XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgICkpXHJcbiAgICByZXR1cm4gPHNwYW4+e3ByZXZpZXdWYWx1ZXN9PC9zcGFuPlxyXG4gIH0sXHJcbiAgUGl2b3RDb21wb25lbnQ6IHVuZGVmaW5lZCwgLy8gdGhpcyBpcyBhIGNvbXB1dGVkIGRlZmF1bHQgZ2VuZXJhdGVkIHVzaW5nXHJcbiAgLy8gdGhlIEV4cGFuZGVyQ29tcG9uZW50IGFuZCBQaXZvdFZhbHVlQ29tcG9uZW50IGF0IHJ1bi10aW1lIGluIG1ldGhvZHMuanNcclxuICBQYWdpbmF0aW9uQ29tcG9uZW50OiBQYWdpbmF0aW9uLFxyXG4gIFByZXZpb3VzQ29tcG9uZW50OiB1bmRlZmluZWQsXHJcbiAgTmV4dENvbXBvbmVudDogdW5kZWZpbmVkLFxyXG4gIExvYWRpbmdDb21wb25lbnQ6ICh7XHJcbiAgICBjbGFzc05hbWUsIGxvYWRpbmcsIGxvYWRpbmdUZXh0LCAuLi5yZXN0XHJcbiAgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1sb2FkaW5nJywgeyAnLWFjdGl2ZSc6IGxvYWRpbmcgfSwgY2xhc3NOYW1lKX0gey4uLnJlc3R9PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1sb2FkaW5nLWlubmVyXCI+e2xvYWRpbmdUZXh0fTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBOb0RhdGFDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC1ub0RhdGEnLCAnTm9EYXRhJyksXHJcbiAgUmVzaXplckNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXJlc2l6ZXInLCAnUmVzaXplcicpLFxyXG4gIFBhZFJvd0NvbXBvbmVudDogKCkgPT4gPHNwYW4+Jm5ic3A7PC9zcGFuPixcclxufVxyXG4iXX0=