'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _pagination = require('./pagination');

var _pagination2 = _interopRequireDefault(_pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//


var emptyObj = function emptyObj() {
  return {};
};

exports.default = {
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
  TableComponent: _react2.default.forwardRef(function (_ref, ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({
        ref: ref,
        className: (0, _classnames2.default)('rt-table', className),
        role: 'grid'
        // tabIndex='0'
      }, rest),
      children
    );
  }),
  TheadComponent: _utils2.default.makeTemplateComponent('rt-thead', 'Thead'),
  TbodyComponent: _utils2.default.makeTemplateComponent('rt-tbody', 'Tbody'),
  TrGroupComponent: function TrGroupComponent(_ref2) {
    var children = _ref2.children,
        className = _ref2.className,
        rest = _objectWithoutProperties(_ref2, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-tr-group', className), role: 'rowgroup' }, rest),
      children
    );
  },
  TrComponent: function TrComponent(_ref3) {
    var children = _ref3.children,
        className = _ref3.className,
        rest = _objectWithoutProperties(_ref3, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-tr', className), role: 'row' }, rest),
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
      _react2.default.createElement(
        'div',
        _extends({
          className: (0, _classnames2.default)('rt-th', className),
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

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('rt-td', className), role: 'gridcell' }, rest),
      children
    );
  },
  TfootComponent: _utils2.default.makeTemplateComponent('rt-tfoot', 'Tfoot'),
  FilterComponent: function FilterComponent(_ref6) {
    var filter = _ref6.filter,
        _onChange = _ref6.onChange,
        column = _ref6.column;
    return _react2.default.createElement('input', {
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
    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)('rt-expander', isExpanded && '-open') },
      '\u2022'
    );
  },
  PivotValueComponent: function PivotValueComponent(_ref8) {
    var subRows = _ref8.subRows,
        value = _ref8.value;
    return _react2.default.createElement(
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
        _react2.default.createElement(
          'span',
          { key: i },
          row[column.id],
          i < subRows.length - 1 ? ', ' : ''
        )
      );
    });
    return _react2.default.createElement(
      'span',
      null,
      previewValues
    );
  },
  PivotComponent: undefined, // this is a computed default generated using
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: _pagination2.default,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: function LoadingComponent(_ref10) {
    var className = _ref10.className,
        loading = _ref10.loading,
        loadingText = _ref10.loadingText,
        rest = _objectWithoutProperties(_ref10, ['className', 'loading', 'loadingText']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)('-loading', { '-active': loading }, className) }, rest),
      _react2.default.createElement(
        'div',
        { className: '-loading-inner' },
        loadingText
      )
    );
  },
  NoDataComponent: _utils2.default.makeTemplateComponent('rt-noData', 'NoData'),
  ResizerComponent: _utils2.default.makeTemplateComponent('rt-resizer', 'Resizer'),
  PadRowComponent: function PadRowComponent() {
    return _react2.default.createElement(
      'span',
      null,
      '\xA0'
    );
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0UHJvcHMuanMiXSwibmFtZXMiOlsiZW1wdHlPYmoiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJsb2FkaW5nIiwic2hvd1BhZ2luYXRpb24iLCJzaG93UGFnaW5hdGlvblRvcCIsInNob3dQYWdpbmF0aW9uQm90dG9tIiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsImRlZmF1bHRQYWdlIiwiZGVmYXVsdFBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UiLCJjb2xsYXBzZU9uUGFnZUNoYW5nZSIsImNvbGxhcHNlT25EYXRhQ2hhbmdlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwic29ydGFibGUiLCJtdWx0aVNvcnQiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIiwiZGVmYXVsdFNvcnREZXNjIiwiZGVmYXVsdFNvcnRlZCIsImRlZmF1bHRGaWx0ZXJlZCIsImRlZmF1bHRSZXNpemVkIiwiZGVmYXVsdEV4cGFuZGVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsImZpbHRlciIsInJvdyIsImNvbHVtbiIsImlkIiwicGl2b3RJZCIsInVuZGVmaW5lZCIsIlN0cmluZyIsInN0YXJ0c1dpdGgiLCJ2YWx1ZSIsImRlZmF1bHRTb3J0TWV0aG9kIiwiYSIsImIiLCJkZXNjIiwidG9Mb3dlckNhc2UiLCJvblBhZ2VDaGFuZ2UiLCJvblBhZ2VTaXplQ2hhbmdlIiwib25Tb3J0ZWRDaGFuZ2UiLCJvbkZpbHRlcmVkQ2hhbmdlIiwib25SZXNpemVkQ2hhbmdlIiwib25FeHBhbmRlZENoYW5nZSIsInBpdm90QnkiLCJwaXZvdFZhbEtleSIsInBpdm90SURLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIm9uRmV0Y2hEYXRhIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJnZXRQcm9wcyIsImdldFRhYmxlUHJvcHMiLCJnZXRUaGVhZEdyb3VwUHJvcHMiLCJnZXRUaGVhZEdyb3VwVHJQcm9wcyIsImdldFRoZWFkR3JvdXBUaFByb3BzIiwiZ2V0VGhlYWRQcm9wcyIsImdldFRoZWFkVHJQcm9wcyIsImdldFRoZWFkVGhQcm9wcyIsImdldFRoZWFkRmlsdGVyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRoUHJvcHMiLCJnZXRUYm9keVByb3BzIiwiZ2V0VHJHcm91cFByb3BzIiwiZ2V0VHJQcm9wcyIsImdldFRkUHJvcHMiLCJnZXRUZm9vdFByb3BzIiwiZ2V0VGZvb3RUclByb3BzIiwiZ2V0VGZvb3RUZFByb3BzIiwiZ2V0UGFnaW5hdGlvblByb3BzIiwiZ2V0TG9hZGluZ1Byb3BzIiwiZ2V0Tm9EYXRhUHJvcHMiLCJnZXRSZXNpemVyUHJvcHMiLCJDZWxsIiwiSGVhZGVyIiwiRm9vdGVyIiwiQWdncmVnYXRlZCIsIlBpdm90IiwiUGl2b3RWYWx1ZSIsIkV4cGFuZGVyIiwiRmlsdGVyIiwiUGxhY2Vob2xkZXIiLCJzaG93IiwibWluV2lkdGgiLCJtaW5SZXNpemVXaWR0aCIsImFnZ3JlZ2F0ZSIsImhlYWRlckNsYXNzTmFtZSIsImhlYWRlclN0eWxlIiwiZ2V0SGVhZGVyUHJvcHMiLCJmb290ZXJDbGFzc05hbWUiLCJmb290ZXJTdHlsZSIsImdldEZvb3RlclByb3BzIiwiZmlsdGVyTWV0aG9kIiwiZmlsdGVyQWxsIiwic29ydE1ldGhvZCIsImV4cGFuZGVyRGVmYXVsdHMiLCJ3aWR0aCIsInBpdm90RGVmYXVsdHMiLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInBhZ2VUZXh0Iiwib2ZUZXh0Iiwicm93c1RleHQiLCJwYWdlSnVtcFRleHQiLCJyb3dzU2VsZWN0b3JUZXh0IiwiVGFibGVDb21wb25lbnQiLCJSZWFjdCIsImZvcndhcmRSZWYiLCJyZWYiLCJjaGlsZHJlbiIsInJlc3QiLCJUaGVhZENvbXBvbmVudCIsIl8iLCJtYWtlVGVtcGxhdGVDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwidG9nZ2xlU29ydCIsImUiLCJUZENvbXBvbmVudCIsIlRmb290Q29tcG9uZW50IiwiRmlsdGVyQ29tcG9uZW50Iiwib25DaGFuZ2UiLCJldmVudCIsInRhcmdldCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiaXNFeHBhbmRlZCIsIlBpdm90VmFsdWVDb21wb25lbnQiLCJzdWJSb3dzIiwibGVuZ3RoIiwiQWdncmVnYXRlZENvbXBvbmVudCIsInByZXZpZXdWYWx1ZXMiLCJkIiwibWFwIiwiaSIsIlBpdm90Q29tcG9uZW50IiwiUGFnaW5hdGlvbkNvbXBvbmVudCIsIlBhZ2luYXRpb24iLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7OztBQUZBOzs7QUFJQSxJQUFNQSxXQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFPLEVBQVA7QUFBQSxDQUFqQjs7a0JBRWU7QUFDYjtBQUNBQyxRQUFNLEVBRk87QUFHYkMsZUFBYTtBQUFBLFdBQVFELElBQVI7QUFBQSxHQUhBO0FBSWJFLFdBQVMsS0FKSTtBQUtiQyxrQkFBZ0IsSUFMSDtBQU1iQyxxQkFBbUIsS0FOTjtBQU9iQyx3QkFBc0IsSUFQVDtBQVFiQyx1QkFBcUIsSUFSUjtBQVNiQyxtQkFBaUIsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLEVBQW9CLEdBQXBCLENBVEo7QUFVYkMsZUFBYSxDQVZBO0FBV2JDLG1CQUFpQixFQVhKO0FBWWJDLGdCQUFjLElBWkQ7QUFhYkMs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Q0xyRCxPQURLLFVBQ0xBLE9BREs7QUFBQSxRQUNJd0csV0FESixVQUNJQSxXQURKO0FBQUEsUUFDb0JZLElBRHBCOztBQUFBLFdBR2hCO0FBQUE7QUFBQSxpQkFBSyxXQUFXLDBCQUFXLFVBQVgsRUFBdUIsRUFBRSxXQUFXcEgsT0FBYixFQUF2QixFQUErQ3FELFNBQS9DLENBQWhCLElBQStFK0QsSUFBL0U7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGdCQUFmO0FBQWlDWjtBQUFqQztBQURGLEtBSGdCO0FBQUEsR0E1UEw7QUFtUWI0QyxtQkFBaUI5QixnQkFBRUMscUJBQUYsQ0FBd0IsV0FBeEIsRUFBcUMsUUFBckMsQ0FuUUo7QUFvUWI4QixvQkFBa0IvQixnQkFBRUMscUJBQUYsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsQ0FwUUw7QUFxUWIrQixtQkFBaUI7QUFBQSxXQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBTjtBQUFBO0FBclFKLEMiLCJmaWxlIjoiZGVmYXVsdFByb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG4vL1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuL3BhZ2luYXRpb24nXHJcblxyXG5jb25zdCBlbXB0eU9iaiA9ICgpID0+ICh7fSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAvLyBHZW5lcmFsXHJcbiAgZGF0YTogW10sXHJcbiAgcmVzb2x2ZURhdGE6IGRhdGEgPT4gZGF0YSxcclxuICBsb2FkaW5nOiBmYWxzZSxcclxuICBzaG93UGFnaW5hdGlvbjogdHJ1ZSxcclxuICBzaG93UGFnaW5hdGlvblRvcDogZmFsc2UsXHJcbiAgc2hvd1BhZ2luYXRpb25Cb3R0b206IHRydWUsXHJcbiAgc2hvd1BhZ2VTaXplT3B0aW9uczogdHJ1ZSxcclxuICBwYWdlU2l6ZU9wdGlvbnM6IFs1LCAxMCwgMjAsIDI1LCA1MCwgMTAwXSxcclxuICBkZWZhdWx0UGFnZTogMCxcclxuICBkZWZhdWx0UGFnZVNpemU6IDIwLFxyXG4gIHNob3dQYWdlSnVtcDogdHJ1ZSxcclxuICBjb2xsYXBzZU9uU29ydGluZ0NoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uUGFnZUNoYW5nZTogdHJ1ZSxcclxuICBjb2xsYXBzZU9uRGF0YUNoYW5nZTogdHJ1ZSxcclxuICBmcmVlemVXaGVuRXhwYW5kZWQ6IGZhbHNlLFxyXG4gIHNvcnRhYmxlOiB0cnVlLFxyXG4gIG11bHRpU29ydDogdHJ1ZSxcclxuICByZXNpemFibGU6IHRydWUsXHJcbiAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgZGVmYXVsdFNvcnREZXNjOiBmYWxzZSxcclxuICBkZWZhdWx0U29ydGVkOiBbXSxcclxuICBkZWZhdWx0RmlsdGVyZWQ6IFtdLFxyXG4gIGRlZmF1bHRSZXNpemVkOiBbXSxcclxuICBkZWZhdWx0RXhwYW5kZWQ6IHt9LFxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gIGRlZmF1bHRGaWx0ZXJNZXRob2Q6IChmaWx0ZXIsIHJvdywgY29sdW1uKSA9PiB7XHJcbiAgICBjb25zdCBpZCA9IGZpbHRlci5waXZvdElkIHx8IGZpbHRlci5pZFxyXG4gICAgcmV0dXJuIHJvd1tpZF0gIT09IHVuZGVmaW5lZCA/IFN0cmluZyhyb3dbaWRdKS5zdGFydHNXaXRoKGZpbHRlci52YWx1ZSkgOiB0cnVlXHJcbiAgfSxcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICBkZWZhdWx0U29ydE1ldGhvZDogKGEsIGIsIGRlc2MpID0+IHtcclxuICAgIC8vIGZvcmNlIG51bGwgYW5kIHVuZGVmaW5lZCB0byB0aGUgYm90dG9tXHJcbiAgICBhID0gYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgPyAnJyA6IGFcclxuICAgIGIgPSBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZCA/ICcnIDogYlxyXG4gICAgLy8gZm9yY2UgYW55IHN0cmluZyB2YWx1ZXMgdG8gbG93ZXJjYXNlXHJcbiAgICBhID0gdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogYVxyXG4gICAgYiA9IHR5cGVvZiBiID09PSAnc3RyaW5nJyA/IGIudG9Mb3dlckNhc2UoKSA6IGJcclxuICAgIC8vIFJldHVybiBlaXRoZXIgMSBvciAtMSB0byBpbmRpY2F0ZSBhIHNvcnQgcHJpb3JpdHlcclxuICAgIGlmIChhID4gYikge1xyXG4gICAgICByZXR1cm4gMVxyXG4gICAgfVxyXG4gICAgaWYgKGEgPCBiKSB7XHJcbiAgICAgIHJldHVybiAtMVxyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuaW5nIDAsIHVuZGVmaW5lZCBvciBhbnkgZmFsc2V5IHZhbHVlIHdpbGwgdXNlIHN1YnNlcXVlbnQgc29ydHMgb3JcclxuICAgIC8vIHRoZSBpbmRleCBhcyBhIHRpZWJyZWFrZXJcclxuICAgIHJldHVybiAwXHJcbiAgfSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBQcm9wc1xyXG4gIC8vIHBhZ2U6IHVuZGVmaW5lZCxcclxuICAvLyBwYWdlU2l6ZTogdW5kZWZpbmVkLFxyXG4gIC8vIHNvcnRlZDogW10sXHJcbiAgLy8gZmlsdGVyZWQ6IFtdLFxyXG4gIC8vIHJlc2l6ZWQ6IFtdLFxyXG4gIC8vIGV4cGFuZGVkOiB7fSxcclxuXHJcbiAgLy8gQ29udHJvbGxlZCBTdGF0ZSBDYWxsYmFja3NcclxuICBvblBhZ2VDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvblBhZ2VTaXplQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25Tb3J0ZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICBvbkZpbHRlcmVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25SZXNpemVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgb25FeHBhbmRlZENoYW5nZTogdW5kZWZpbmVkLFxyXG5cclxuICAvLyBQaXZvdGluZ1xyXG4gIHBpdm90Qnk6IHVuZGVmaW5lZCxcclxuXHJcbiAgLy8gS2V5IENvbnN0YW50c1xyXG4gIHBpdm90VmFsS2V5OiAnX3Bpdm90VmFsJyxcclxuICBwaXZvdElES2V5OiAnX3Bpdm90SUQnLFxyXG4gIHN1YlJvd3NLZXk6ICdfc3ViUm93cycsXHJcbiAgYWdncmVnYXRlZEtleTogJ19hZ2dyZWdhdGVkJyxcclxuICBuZXN0aW5nTGV2ZWxLZXk6ICdfbmVzdGluZ0xldmVsJyxcclxuICBvcmlnaW5hbEtleTogJ19vcmlnaW5hbCcsXHJcbiAgaW5kZXhLZXk6ICdfaW5kZXgnLFxyXG4gIGdyb3VwZWRCeVBpdm90S2V5OiAnX2dyb3VwZWRCeVBpdm90JyxcclxuXHJcbiAgLy8gU2VydmVyLXNpZGUgQ2FsbGJhY2tzXHJcbiAgb25GZXRjaERhdGE6ICgpID0+IG51bGwsXHJcblxyXG4gIC8vIENsYXNzZXNcclxuICBjbGFzc05hbWU6ICcnLFxyXG4gIHN0eWxlOiB7fSxcclxuXHJcbiAgLy8gQ29tcG9uZW50IGRlY29yYXRvcnNcclxuICBnZXRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGFibGVQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEdyb3VwVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRHcm91cFRoUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkVHJQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGhlYWRUaFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUaGVhZEZpbHRlclRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRoZWFkRmlsdGVyVGhQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VGJvZHlQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0VHJHcm91cFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUclByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFByb3BzOiBlbXB0eU9iaixcclxuICBnZXRUZm9vdFRyUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldFRmb290VGRQcm9wczogZW1wdHlPYmosXHJcbiAgZ2V0UGFnaW5hdGlvblByb3BzOiBlbXB0eU9iaixcclxuICBnZXRMb2FkaW5nUHJvcHM6IGVtcHR5T2JqLFxyXG4gIGdldE5vRGF0YVByb3BzOiBlbXB0eU9iaixcclxuICBnZXRSZXNpemVyUHJvcHM6IGVtcHR5T2JqLFxyXG5cclxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXHJcbiAgY29sdW1uOiB7XHJcbiAgICAvLyBSZW5kZXJlcnNcclxuICAgIENlbGw6IHVuZGVmaW5lZCxcclxuICAgIEhlYWRlcjogdW5kZWZpbmVkLFxyXG4gICAgRm9vdGVyOiB1bmRlZmluZWQsXHJcbiAgICBBZ2dyZWdhdGVkOiB1bmRlZmluZWQsXHJcbiAgICBQaXZvdDogdW5kZWZpbmVkLFxyXG4gICAgUGl2b3RWYWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgRXhwYW5kZXI6IHVuZGVmaW5lZCxcclxuICAgIEZpbHRlcjogdW5kZWZpbmVkLFxyXG4gICAgUGxhY2Vob2xkZXI6IHVuZGVmaW5lZCxcclxuICAgIC8vIEFsbCBDb2x1bW5zXHJcbiAgICBzb3J0YWJsZTogdW5kZWZpbmVkLCAvLyB1c2UgdGFibGUgZGVmYXVsdFxyXG4gICAgcmVzaXphYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XHJcbiAgICBmaWx0ZXJhYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XHJcbiAgICBzaG93OiB0cnVlLFxyXG4gICAgbWluV2lkdGg6IDEwMCxcclxuICAgIG1pblJlc2l6ZVdpZHRoOiAxMSxcclxuICAgIC8vIENlbGxzIG9ubHlcclxuICAgIGNsYXNzTmFtZTogJycsXHJcbiAgICBzdHlsZToge30sXHJcbiAgICBnZXRQcm9wczogZW1wdHlPYmosXHJcbiAgICAvLyBQaXZvdCBvbmx5XHJcbiAgICBhZ2dyZWdhdGU6IHVuZGVmaW5lZCxcclxuICAgIC8vIEhlYWRlcnMgb25seVxyXG4gICAgaGVhZGVyQ2xhc3NOYW1lOiAnJyxcclxuICAgIGhlYWRlclN0eWxlOiB7fSxcclxuICAgIGdldEhlYWRlclByb3BzOiBlbXB0eU9iaixcclxuICAgIC8vIEZvb3RlcnMgb25seVxyXG4gICAgZm9vdGVyQ2xhc3NOYW1lOiAnJyxcclxuICAgIGZvb3RlclN0eWxlOiB7fSxcclxuICAgIGdldEZvb3RlclByb3BzOiBlbXB0eU9iaixcclxuICAgIGZpbHRlck1ldGhvZDogdW5kZWZpbmVkLFxyXG4gICAgZmlsdGVyQWxsOiBmYWxzZSxcclxuICAgIHNvcnRNZXRob2Q6IHVuZGVmaW5lZCxcclxuICB9LFxyXG5cclxuICAvLyBHbG9iYWwgRXhwYW5kZXIgQ29sdW1uIERlZmF1bHRzXHJcbiAgZXhwYW5kZXJEZWZhdWx0czoge1xyXG4gICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gICAgd2lkdGg6IDM1LFxyXG4gIH0sXHJcblxyXG4gIHBpdm90RGVmYXVsdHM6IHtcclxuICAgIC8vIGV4dGVuZCB0aGUgZGVmYXVsdHMgZm9yIHBpdm90ZWQgY29sdW1ucyBoZXJlXHJcbiAgfSxcclxuXHJcbiAgLy8gVGV4dFxyXG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcclxuICBuZXh0VGV4dDogJ05leHQnLFxyXG4gIGxvYWRpbmdUZXh0OiAnTG9hZGluZy4uLicsXHJcbiAgbm9EYXRhVGV4dDogJ05vIHJvd3MgZm91bmQnLFxyXG4gIHBhZ2VUZXh0OiAnUGFnZScsXHJcbiAgb2ZUZXh0OiAnb2YnLFxyXG4gIHJvd3NUZXh0OiAncm93cycsXHJcbiAgcGFnZUp1bXBUZXh0OiAnanVtcCB0byBwYWdlJyxcclxuICByb3dzU2VsZWN0b3JUZXh0OiAncm93cyBwZXIgcGFnZScsXHJcblxyXG4gIC8vIENvbXBvbmVudHNcclxuICBUYWJsZUNvbXBvbmVudDogUmVhY3QuZm9yd2FyZFJlZigoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0sIHJlZikgPT4gKFxyXG4gICAgPGRpdlxyXG4gICAgICByZWY9e3JlZn1cclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10YWJsZScsIGNsYXNzTmFtZSl9XHJcbiAgICAgIHJvbGU9XCJncmlkXCJcclxuICAgICAgLy8gdGFiSW5kZXg9JzAnXHJcbiAgICAgIHsuLi5yZXN0fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApKSxcclxuICBUaGVhZENvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXRoZWFkJywgJ1RoZWFkJyksXHJcbiAgVGJvZHlDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10Ym9keScsICdUYm9keScpLFxyXG4gIFRyR3JvdXBDb21wb25lbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRyLWdyb3VwJywgY2xhc3NOYW1lKX0gcm9sZT1cInJvd2dyb3VwXCIgey4uLnJlc3R9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIFRyQ29tcG9uZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10cicsIGNsYXNzTmFtZSl9IHJvbGU9XCJyb3dcIiB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGhDb21wb25lbnQ6ICh7XHJcbiAgICB0b2dnbGVTb3J0LCBjbGFzc05hbWUsIGNoaWxkcmVuLCAuLi5yZXN0XHJcbiAgfSkgPT4gKFxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcclxuICAgIDxkaXZcclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10aCcsIGNsYXNzTmFtZSl9XHJcbiAgICAgIG9uQ2xpY2s9e2UgPT4gdG9nZ2xlU29ydCAmJiB0b2dnbGVTb3J0KGUpfVxyXG4gICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcclxuICAgICAgdGFiSW5kZXg9XCItMVwiIC8vIFJlc29sdmVzIGVzbGludCBpc3N1ZXMgd2l0aG91dCBpbXBsZW1lbnRpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbiBpbmNvcnJlY3RseVxyXG4gICAgICB7Li4ucmVzdH1cclxuICAgID5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKSxcclxuICBUZENvbXBvbmVudDogKHtcclxuICAgIHRvZ2dsZVNvcnQsIGNsYXNzTmFtZSwgY2hpbGRyZW4sIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtdGQnLCBjbGFzc05hbWUpfSByb2xlPVwiZ3JpZGNlbGxcIiB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gICksXHJcbiAgVGZvb3RDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10Zm9vdCcsICdUZm9vdCcpLFxyXG4gIEZpbHRlckNvbXBvbmVudDogKHsgZmlsdGVyLCBvbkNoYW5nZSwgY29sdW1uIH0pID0+IChcclxuICAgIDxpbnB1dFxyXG4gICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgfX1cclxuICAgICAgcGxhY2Vob2xkZXI9e2NvbHVtbi5QbGFjZWhvbGRlcn1cclxuICAgICAgdmFsdWU9e2ZpbHRlciA/IGZpbHRlci52YWx1ZSA6ICcnfVxyXG4gICAgICBvbkNoYW5nZT17ZXZlbnQgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cclxuICAgIC8+XHJcbiAgKSxcclxuICBFeHBhbmRlckNvbXBvbmVudDogKHsgaXNFeHBhbmRlZCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncnQtZXhwYW5kZXInLCBpc0V4cGFuZGVkICYmICctb3BlbicpfT4mYnVsbDs8L2Rpdj5cclxuICApLFxyXG4gIFBpdm90VmFsdWVDb21wb25lbnQ6ICh7IHN1YlJvd3MsIHZhbHVlIH0pID0+IChcclxuICAgIDxzcGFuPlxyXG4gICAgICB7dmFsdWV9IHtzdWJSb3dzICYmIGAoJHtzdWJSb3dzLmxlbmd0aH0pYH1cclxuICAgIDwvc3Bhbj5cclxuICApLFxyXG4gIEFnZ3JlZ2F0ZWRDb21wb25lbnQ6ICh7IHN1YlJvd3MsIGNvbHVtbiB9KSA9PiB7XHJcbiAgICBjb25zdCBwcmV2aWV3VmFsdWVzID0gc3ViUm93cy5maWx0ZXIoZCA9PiB0eXBlb2YgZFtjb2x1bW4uaWRdICE9PSAndW5kZWZpbmVkJykubWFwKChyb3csIGkpID0+IChcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICA8c3BhbiBrZXk9e2l9PlxyXG4gICAgICAgIHtyb3dbY29sdW1uLmlkXX1cclxuICAgICAgICB7aSA8IHN1YlJvd3MubGVuZ3RoIC0gMSA/ICcsICcgOiAnJ31cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKSlcclxuICAgIHJldHVybiA8c3Bhbj57cHJldmlld1ZhbHVlc308L3NwYW4+XHJcbiAgfSxcclxuICBQaXZvdENvbXBvbmVudDogdW5kZWZpbmVkLCAvLyB0aGlzIGlzIGEgY29tcHV0ZWQgZGVmYXVsdCBnZW5lcmF0ZWQgdXNpbmdcclxuICAvLyB0aGUgRXhwYW5kZXJDb21wb25lbnQgYW5kIFBpdm90VmFsdWVDb21wb25lbnQgYXQgcnVuLXRpbWUgaW4gbWV0aG9kcy5qc1xyXG4gIFBhZ2luYXRpb25Db21wb25lbnQ6IFBhZ2luYXRpb24sXHJcbiAgUHJldmlvdXNDb21wb25lbnQ6IHVuZGVmaW5lZCxcclxuICBOZXh0Q29tcG9uZW50OiB1bmRlZmluZWQsXHJcbiAgTG9hZGluZ0NvbXBvbmVudDogKHtcclxuICAgIGNsYXNzTmFtZSwgbG9hZGluZywgbG9hZGluZ1RleHQsIC4uLnJlc3RcclxuICB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWxvYWRpbmcnLCB7ICctYWN0aXZlJzogbG9hZGluZyB9LCBjbGFzc05hbWUpfSB7Li4ucmVzdH0+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLWxvYWRpbmctaW5uZXJcIj57bG9hZGluZ1RleHR9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApLFxyXG4gIE5vRGF0YUNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LW5vRGF0YScsICdOb0RhdGEnKSxcclxuICBSZXNpemVyQ29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtcmVzaXplcicsICdSZXNpemVyJyksXHJcbiAgUGFkUm93Q29tcG9uZW50OiAoKSA9PiA8c3Bhbj4mbmJzcDs8L3NwYW4+LFxyXG59XHJcbiJdfQ==