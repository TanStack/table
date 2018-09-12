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
    // All Columns
    sortable: undefined, // use table default
    resizable: undefined, // use table default
    filterable: undefined, // use table default
    show: true,
    minWidth: 100,
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

  // Components
  TableComponent: function TableComponent(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({
        className: (0, _classnames2.default)('rt-table', className),
        role: 'grid'
        // tabIndex='0'
      }, rest),
      children
    );
  },
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
        _onChange = _ref6.onChange;
    return _react2.default.createElement('input', {
      type: 'text',
      style: {
        width: '100%'
      },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0UHJvcHMuanMiXSwibmFtZXMiOlsiZW1wdHlPYmoiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJsb2FkaW5nIiwic2hvd1BhZ2luYXRpb24iLCJzaG93UGFnaW5hdGlvblRvcCIsInNob3dQYWdpbmF0aW9uQm90dG9tIiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsImRlZmF1bHRQYWdlIiwiZGVmYXVsdFBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UiLCJjb2xsYXBzZU9uUGFnZUNoYW5nZSIsImNvbGxhcHNlT25EYXRhQ2hhbmdlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwic29ydGFibGUiLCJtdWx0aVNvcnQiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIiwiZGVmYXVsdFNvcnREZXNjIiwiZGVmYXVsdFNvcnRlZCIsImRlZmF1bHRGaWx0ZXJlZCIsImRlZmF1bHRSZXNpemVkIiwiZGVmYXVsdEV4cGFuZGVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsImZpbHRlciIsInJvdyIsImNvbHVtbiIsImlkIiwicGl2b3RJZCIsInVuZGVmaW5lZCIsIlN0cmluZyIsInN0YXJ0c1dpdGgiLCJ2YWx1ZSIsImRlZmF1bHRTb3J0TWV0aG9kIiwiYSIsImIiLCJkZXNjIiwidG9Mb3dlckNhc2UiLCJvblBhZ2VDaGFuZ2UiLCJvblBhZ2VTaXplQ2hhbmdlIiwib25Tb3J0ZWRDaGFuZ2UiLCJvbkZpbHRlcmVkQ2hhbmdlIiwib25SZXNpemVkQ2hhbmdlIiwib25FeHBhbmRlZENoYW5nZSIsInBpdm90QnkiLCJwaXZvdFZhbEtleSIsInBpdm90SURLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIm9uRmV0Y2hEYXRhIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJnZXRQcm9wcyIsImdldFRhYmxlUHJvcHMiLCJnZXRUaGVhZEdyb3VwUHJvcHMiLCJnZXRUaGVhZEdyb3VwVHJQcm9wcyIsImdldFRoZWFkR3JvdXBUaFByb3BzIiwiZ2V0VGhlYWRQcm9wcyIsImdldFRoZWFkVHJQcm9wcyIsImdldFRoZWFkVGhQcm9wcyIsImdldFRoZWFkRmlsdGVyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRoUHJvcHMiLCJnZXRUYm9keVByb3BzIiwiZ2V0VHJHcm91cFByb3BzIiwiZ2V0VHJQcm9wcyIsImdldFRkUHJvcHMiLCJnZXRUZm9vdFByb3BzIiwiZ2V0VGZvb3RUclByb3BzIiwiZ2V0VGZvb3RUZFByb3BzIiwiZ2V0UGFnaW5hdGlvblByb3BzIiwiZ2V0TG9hZGluZ1Byb3BzIiwiZ2V0Tm9EYXRhUHJvcHMiLCJnZXRSZXNpemVyUHJvcHMiLCJDZWxsIiwiSGVhZGVyIiwiRm9vdGVyIiwiQWdncmVnYXRlZCIsIlBpdm90IiwiUGl2b3RWYWx1ZSIsIkV4cGFuZGVyIiwiRmlsdGVyIiwic2hvdyIsIm1pbldpZHRoIiwiYWdncmVnYXRlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJnZXRIZWFkZXJQcm9wcyIsImZvb3RlckNsYXNzTmFtZSIsImZvb3RlclN0eWxlIiwiZ2V0Rm9vdGVyUHJvcHMiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJzb3J0TWV0aG9kIiwiZXhwYW5kZXJEZWZhdWx0cyIsIndpZHRoIiwicGl2b3REZWZhdWx0cyIsInByZXZpb3VzVGV4dCIsIm5leHRUZXh0IiwibG9hZGluZ1RleHQiLCJub0RhdGFUZXh0IiwicGFnZVRleHQiLCJvZlRleHQiLCJyb3dzVGV4dCIsIlRhYmxlQ29tcG9uZW50IiwiY2hpbGRyZW4iLCJyZXN0IiwiVGhlYWRDb21wb25lbnQiLCJfIiwibWFrZVRlbXBsYXRlQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckdyb3VwQ29tcG9uZW50IiwiVHJDb21wb25lbnQiLCJUaENvbXBvbmVudCIsInRvZ2dsZVNvcnQiLCJlIiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJ0YXJnZXQiLCJFeHBhbmRlckNvbXBvbmVudCIsImlzRXhwYW5kZWQiLCJQaXZvdFZhbHVlQ29tcG9uZW50Iiwic3ViUm93cyIsImxlbmd0aCIsIkFnZ3JlZ2F0ZWRDb21wb25lbnQiLCJwcmV2aWV3VmFsdWVzIiwiZCIsIm1hcCIsImkiLCJQaXZvdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJQYWdpbmF0aW9uIiwiUHJldmlvdXNDb21wb25lbnQiLCJOZXh0Q29tcG9uZW50IiwiTG9hZGluZ0NvbXBvbmVudCIsIk5vRGF0YUNvbXBvbmVudCIsIlJlc2l6ZXJDb21wb25lbnQiLCJQYWRSb3dDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7QUFGQTs7O0FBSUEsSUFBTUEsV0FBVyxTQUFYQSxRQUFXO0FBQUEsU0FBTyxFQUFQO0FBQUEsQ0FBakI7O2tCQUVlO0FBQ2I7QUFDQUMsUUFBTSxFQUZPO0FBR2JDLGVBQWE7QUFBQSxXQUFRRCxJQUFSO0FBQUEsR0FIQTtBQUliRSxXQUFTLEtBSkk7QUFLYkMsa0JBQWdCLElBTEg7QUFNYkMscUJBQW1CLEtBTk47QUFPYkMsd0JBQXNCLElBUFQ7QUFRYkMsdUJBQXFCLElBUlI7QUFTYkMsbUJBQWlCLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixFQUFoQixFQUFvQixHQUFwQixDQVRKO0FBVWJDLGVBQWEsQ0FWQTtBQVdiQyxtQkFBaUIsRUFYSjtBQVliQyxnQkFBYyxJQVpEO0FBYWJDLDJCQUF5QixJQWJaO0FBY2JDLHdCQUFzQixJQWRUO0FBZWJDLHdCQUFzQixJQWZUO0FBZ0JiQyxzQkFBb0IsS0FoQlA7QUFpQmJDLFlBQVUsSUFqQkc7QUFrQmJD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UUFBckMsQ0E3UEo7QUE4UGI4QixvQkFBa0IvQixnQkFBRUMscUJBQUYsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsQ0E5UEw7QUErUGIrQixtQkFBaUI7QUFBQSxXQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBTjtBQUFBO0FBL1BKLEMiLCJmaWxlIjoiZGVmYXVsdFByb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbi8vXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi9wYWdpbmF0aW9uJ1xuXG5jb25zdCBlbXB0eU9iaiA9ICgpID0+ICh7fSlcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBHZW5lcmFsXG4gIGRhdGE6IFtdLFxuICByZXNvbHZlRGF0YTogZGF0YSA9PiBkYXRhLFxuICBsb2FkaW5nOiBmYWxzZSxcbiAgc2hvd1BhZ2luYXRpb246IHRydWUsXG4gIHNob3dQYWdpbmF0aW9uVG9wOiBmYWxzZSxcbiAgc2hvd1BhZ2luYXRpb25Cb3R0b206IHRydWUsXG4gIHNob3dQYWdlU2l6ZU9wdGlvbnM6IHRydWUsXG4gIHBhZ2VTaXplT3B0aW9uczogWzUsIDEwLCAyMCwgMjUsIDUwLCAxMDBdLFxuICBkZWZhdWx0UGFnZTogMCxcbiAgZGVmYXVsdFBhZ2VTaXplOiAyMCxcbiAgc2hvd1BhZ2VKdW1wOiB0cnVlLFxuICBjb2xsYXBzZU9uU29ydGluZ0NoYW5nZTogdHJ1ZSxcbiAgY29sbGFwc2VPblBhZ2VDaGFuZ2U6IHRydWUsXG4gIGNvbGxhcHNlT25EYXRhQ2hhbmdlOiB0cnVlLFxuICBmcmVlemVXaGVuRXhwYW5kZWQ6IGZhbHNlLFxuICBzb3J0YWJsZTogdHJ1ZSxcbiAgbXVsdGlTb3J0OiB0cnVlLFxuICByZXNpemFibGU6IHRydWUsXG4gIGZpbHRlcmFibGU6IGZhbHNlLFxuICBkZWZhdWx0U29ydERlc2M6IGZhbHNlLFxuICBkZWZhdWx0U29ydGVkOiBbXSxcbiAgZGVmYXVsdEZpbHRlcmVkOiBbXSxcbiAgZGVmYXVsdFJlc2l6ZWQ6IFtdLFxuICBkZWZhdWx0RXhwYW5kZWQ6IHt9LFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgZGVmYXVsdEZpbHRlck1ldGhvZDogKGZpbHRlciwgcm93LCBjb2x1bW4pID0+IHtcbiAgICBjb25zdCBpZCA9IGZpbHRlci5waXZvdElkIHx8IGZpbHRlci5pZFxuICAgIHJldHVybiByb3dbaWRdICE9PSB1bmRlZmluZWQgPyBTdHJpbmcocm93W2lkXSkuc3RhcnRzV2l0aChmaWx0ZXIudmFsdWUpIDogdHJ1ZVxuICB9LFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgZGVmYXVsdFNvcnRNZXRob2Q6IChhLCBiLCBkZXNjKSA9PiB7XG4gICAgLy8gZm9yY2UgbnVsbCBhbmQgdW5kZWZpbmVkIHRvIHRoZSBib3R0b21cbiAgICBhID0gYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgPyAnJyA6IGFcbiAgICBiID0gYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQgPyAnJyA6IGJcbiAgICAvLyBmb3JjZSBhbnkgc3RyaW5nIHZhbHVlcyB0byBsb3dlcmNhc2VcbiAgICBhID0gdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gYS50b0xvd2VyQ2FzZSgpIDogYVxuICAgIGIgPSB0eXBlb2YgYiA9PT0gJ3N0cmluZycgPyBiLnRvTG93ZXJDYXNlKCkgOiBiXG4gICAgLy8gUmV0dXJuIGVpdGhlciAxIG9yIC0xIHRvIGluZGljYXRlIGEgc29ydCBwcmlvcml0eVxuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIDFcbiAgICB9XG4gICAgaWYgKGEgPCBiKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgLy8gcmV0dXJuaW5nIDAsIHVuZGVmaW5lZCBvciBhbnkgZmFsc2V5IHZhbHVlIHdpbGwgdXNlIHN1YnNlcXVlbnQgc29ydHMgb3JcbiAgICAvLyB0aGUgaW5kZXggYXMgYSB0aWVicmVha2VyXG4gICAgcmV0dXJuIDBcbiAgfSxcblxuICAvLyBDb250cm9sbGVkIFN0YXRlIFByb3BzXG4gIC8vIHBhZ2U6IHVuZGVmaW5lZCxcbiAgLy8gcGFnZVNpemU6IHVuZGVmaW5lZCxcbiAgLy8gc29ydGVkOiBbXSxcbiAgLy8gZmlsdGVyZWQ6IFtdLFxuICAvLyByZXNpemVkOiBbXSxcbiAgLy8gZXhwYW5kZWQ6IHt9LFxuXG4gIC8vIENvbnRyb2xsZWQgU3RhdGUgQ2FsbGJhY2tzXG4gIG9uUGFnZUNoYW5nZTogdW5kZWZpbmVkLFxuICBvblBhZ2VTaXplQ2hhbmdlOiB1bmRlZmluZWQsXG4gIG9uU29ydGVkQ2hhbmdlOiB1bmRlZmluZWQsXG4gIG9uRmlsdGVyZWRDaGFuZ2U6IHVuZGVmaW5lZCxcbiAgb25SZXNpemVkQ2hhbmdlOiB1bmRlZmluZWQsXG4gIG9uRXhwYW5kZWRDaGFuZ2U6IHVuZGVmaW5lZCxcblxuICAvLyBQaXZvdGluZ1xuICBwaXZvdEJ5OiB1bmRlZmluZWQsXG5cbiAgLy8gS2V5IENvbnN0YW50c1xuICBwaXZvdFZhbEtleTogJ19waXZvdFZhbCcsXG4gIHBpdm90SURLZXk6ICdfcGl2b3RJRCcsXG4gIHN1YlJvd3NLZXk6ICdfc3ViUm93cycsXG4gIGFnZ3JlZ2F0ZWRLZXk6ICdfYWdncmVnYXRlZCcsXG4gIG5lc3RpbmdMZXZlbEtleTogJ19uZXN0aW5nTGV2ZWwnLFxuICBvcmlnaW5hbEtleTogJ19vcmlnaW5hbCcsXG4gIGluZGV4S2V5OiAnX2luZGV4JyxcbiAgZ3JvdXBlZEJ5UGl2b3RLZXk6ICdfZ3JvdXBlZEJ5UGl2b3QnLFxuXG4gIC8vIFNlcnZlci1zaWRlIENhbGxiYWNrc1xuICBvbkZldGNoRGF0YTogKCkgPT4gbnVsbCxcblxuICAvLyBDbGFzc2VzXG4gIGNsYXNzTmFtZTogJycsXG4gIHN0eWxlOiB7fSxcblxuICAvLyBDb21wb25lbnQgZGVjb3JhdG9yc1xuICBnZXRQcm9wczogZW1wdHlPYmosXG4gIGdldFRhYmxlUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUaGVhZEdyb3VwUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUaGVhZEdyb3VwVHJQcm9wczogZW1wdHlPYmosXG4gIGdldFRoZWFkR3JvdXBUaFByb3BzOiBlbXB0eU9iaixcbiAgZ2V0VGhlYWRQcm9wczogZW1wdHlPYmosXG4gIGdldFRoZWFkVHJQcm9wczogZW1wdHlPYmosXG4gIGdldFRoZWFkVGhQcm9wczogZW1wdHlPYmosXG4gIGdldFRoZWFkRmlsdGVyUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUaGVhZEZpbHRlclRyUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUaGVhZEZpbHRlclRoUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUYm9keVByb3BzOiBlbXB0eU9iaixcbiAgZ2V0VHJHcm91cFByb3BzOiBlbXB0eU9iaixcbiAgZ2V0VHJQcm9wczogZW1wdHlPYmosXG4gIGdldFRkUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRUZm9vdFByb3BzOiBlbXB0eU9iaixcbiAgZ2V0VGZvb3RUclByb3BzOiBlbXB0eU9iaixcbiAgZ2V0VGZvb3RUZFByb3BzOiBlbXB0eU9iaixcbiAgZ2V0UGFnaW5hdGlvblByb3BzOiBlbXB0eU9iaixcbiAgZ2V0TG9hZGluZ1Byb3BzOiBlbXB0eU9iaixcbiAgZ2V0Tm9EYXRhUHJvcHM6IGVtcHR5T2JqLFxuICBnZXRSZXNpemVyUHJvcHM6IGVtcHR5T2JqLFxuXG4gIC8vIEdsb2JhbCBDb2x1bW4gRGVmYXVsdHNcbiAgY29sdW1uOiB7XG4gICAgLy8gUmVuZGVyZXJzXG4gICAgQ2VsbDogdW5kZWZpbmVkLFxuICAgIEhlYWRlcjogdW5kZWZpbmVkLFxuICAgIEZvb3RlcjogdW5kZWZpbmVkLFxuICAgIEFnZ3JlZ2F0ZWQ6IHVuZGVmaW5lZCxcbiAgICBQaXZvdDogdW5kZWZpbmVkLFxuICAgIFBpdm90VmFsdWU6IHVuZGVmaW5lZCxcbiAgICBFeHBhbmRlcjogdW5kZWZpbmVkLFxuICAgIEZpbHRlcjogdW5kZWZpbmVkLFxuICAgIC8vIEFsbCBDb2x1bW5zXG4gICAgc29ydGFibGU6IHVuZGVmaW5lZCwgLy8gdXNlIHRhYmxlIGRlZmF1bHRcbiAgICByZXNpemFibGU6IHVuZGVmaW5lZCwgLy8gdXNlIHRhYmxlIGRlZmF1bHRcbiAgICBmaWx0ZXJhYmxlOiB1bmRlZmluZWQsIC8vIHVzZSB0YWJsZSBkZWZhdWx0XG4gICAgc2hvdzogdHJ1ZSxcbiAgICBtaW5XaWR0aDogMTAwLFxuICAgIC8vIENlbGxzIG9ubHlcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIHN0eWxlOiB7fSxcbiAgICBnZXRQcm9wczogZW1wdHlPYmosXG4gICAgLy8gUGl2b3Qgb25seVxuICAgIGFnZ3JlZ2F0ZTogdW5kZWZpbmVkLFxuICAgIC8vIEhlYWRlcnMgb25seVxuICAgIGhlYWRlckNsYXNzTmFtZTogJycsXG4gICAgaGVhZGVyU3R5bGU6IHt9LFxuICAgIGdldEhlYWRlclByb3BzOiBlbXB0eU9iaixcbiAgICAvLyBGb290ZXJzIG9ubHlcbiAgICBmb290ZXJDbGFzc05hbWU6ICcnLFxuICAgIGZvb3RlclN0eWxlOiB7fSxcbiAgICBnZXRGb290ZXJQcm9wczogZW1wdHlPYmosXG4gICAgZmlsdGVyTWV0aG9kOiB1bmRlZmluZWQsXG4gICAgZmlsdGVyQWxsOiBmYWxzZSxcbiAgICBzb3J0TWV0aG9kOiB1bmRlZmluZWQsXG4gIH0sXG5cbiAgLy8gR2xvYmFsIEV4cGFuZGVyIENvbHVtbiBEZWZhdWx0c1xuICBleHBhbmRlckRlZmF1bHRzOiB7XG4gICAgc29ydGFibGU6IGZhbHNlLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgZmlsdGVyYWJsZTogZmFsc2UsXG4gICAgd2lkdGg6IDM1LFxuICB9LFxuXG4gIHBpdm90RGVmYXVsdHM6IHtcbiAgICAvLyBleHRlbmQgdGhlIGRlZmF1bHRzIGZvciBwaXZvdGVkIGNvbHVtbnMgaGVyZVxuICB9LFxuXG4gIC8vIFRleHRcbiAgcHJldmlvdXNUZXh0OiAnUHJldmlvdXMnLFxuICBuZXh0VGV4dDogJ05leHQnLFxuICBsb2FkaW5nVGV4dDogJ0xvYWRpbmcuLi4nLFxuICBub0RhdGFUZXh0OiAnTm8gcm93cyBmb3VuZCcsXG4gIHBhZ2VUZXh0OiAnUGFnZScsXG4gIG9mVGV4dDogJ29mJyxcbiAgcm93c1RleHQ6ICdyb3dzJyxcblxuICAvLyBDb21wb25lbnRzXG4gIFRhYmxlQ29tcG9uZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCAuLi5yZXN0IH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRhYmxlJywgY2xhc3NOYW1lKX1cbiAgICAgIHJvbGU9XCJncmlkXCJcbiAgICAgIC8vIHRhYkluZGV4PScwJ1xuICAgICAgey4uLnJlc3R9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBUaGVhZENvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXRoZWFkJywgJ1RoZWFkJyksXG4gIFRib2R5Q29tcG9uZW50OiBfLm1ha2VUZW1wbGF0ZUNvbXBvbmVudCgncnQtdGJvZHknLCAnVGJvZHknKSxcbiAgVHJHcm91cENvbXBvbmVudDogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgLi4ucmVzdCB9KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRyLWdyb3VwJywgY2xhc3NOYW1lKX0gcm9sZT1cInJvd2dyb3VwXCIgey4uLnJlc3R9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBUckNvbXBvbmVudDogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgLi4ucmVzdCB9KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRyJywgY2xhc3NOYW1lKX0gcm9sZT1cInJvd1wiIHsuLi5yZXN0fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKSxcbiAgVGhDb21wb25lbnQ6ICh7XG4gICAgdG9nZ2xlU29ydCwgY2xhc3NOYW1lLCBjaGlsZHJlbiwgLi4ucmVzdFxuICB9KSA9PiAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzeC1hMTF5L2NsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LXRoJywgY2xhc3NOYW1lKX1cbiAgICAgIG9uQ2xpY2s9e2UgPT4gdG9nZ2xlU29ydCAmJiB0b2dnbGVTb3J0KGUpfVxuICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICB0YWJJbmRleD1cIi0xXCIgLy8gUmVzb2x2ZXMgZXNsaW50IGlzc3VlcyB3aXRob3V0IGltcGxlbWVudGluZyBrZXlib2FyZCBuYXZpZ2F0aW9uIGluY29ycmVjdGx5XG4gICAgICB7Li4ucmVzdH1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICksXG4gIFRkQ29tcG9uZW50OiAoe1xuICAgIHRvZ2dsZVNvcnQsIGNsYXNzTmFtZSwgY2hpbGRyZW4sIC4uLnJlc3RcbiAgfSkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdydC10ZCcsIGNsYXNzTmFtZSl9IHJvbGU9XCJncmlkY2VsbFwiIHsuLi5yZXN0fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKSxcbiAgVGZvb3RDb21wb25lbnQ6IF8ubWFrZVRlbXBsYXRlQ29tcG9uZW50KCdydC10Zm9vdCcsICdUZm9vdCcpLFxuICBGaWx0ZXJDb21wb25lbnQ6ICh7IGZpbHRlciwgb25DaGFuZ2UgfSkgPT4gKFxuICAgIDxpbnB1dFxuICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIH19XG4gICAgICB2YWx1ZT17ZmlsdGVyID8gZmlsdGVyLnZhbHVlIDogJyd9XG4gICAgICBvbkNoYW5nZT17ZXZlbnQgPT4gb25DaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAvPlxuICApLFxuICBFeHBhbmRlckNvbXBvbmVudDogKHsgaXNFeHBhbmRlZCB9KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3J0LWV4cGFuZGVyJywgaXNFeHBhbmRlZCAmJiAnLW9wZW4nKX0+JmJ1bGw7PC9kaXY+XG4gICksXG4gIFBpdm90VmFsdWVDb21wb25lbnQ6ICh7IHN1YlJvd3MsIHZhbHVlIH0pID0+IChcbiAgICA8c3Bhbj5cbiAgICAgIHt2YWx1ZX0ge3N1YlJvd3MgJiYgYCgke3N1YlJvd3MubGVuZ3RofSlgfVxuICAgIDwvc3Bhbj5cbiAgKSxcbiAgQWdncmVnYXRlZENvbXBvbmVudDogKHsgc3ViUm93cywgY29sdW1uIH0pID0+IHtcbiAgICBjb25zdCBwcmV2aWV3VmFsdWVzID0gc3ViUm93cy5maWx0ZXIoZCA9PiB0eXBlb2YgZFtjb2x1bW4uaWRdICE9PSAndW5kZWZpbmVkJykubWFwKChyb3csIGkpID0+IChcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcbiAgICAgIDxzcGFuIGtleT17aX0+XG4gICAgICAgIHtyb3dbY29sdW1uLmlkXX1cbiAgICAgICAge2kgPCBzdWJSb3dzLmxlbmd0aCAtIDEgPyAnLCAnIDogJyd9XG4gICAgICA8L3NwYW4+XG4gICAgKSlcbiAgICByZXR1cm4gPHNwYW4+e3ByZXZpZXdWYWx1ZXN9PC9zcGFuPlxuICB9LFxuICBQaXZvdENvbXBvbmVudDogdW5kZWZpbmVkLCAvLyB0aGlzIGlzIGEgY29tcHV0ZWQgZGVmYXVsdCBnZW5lcmF0ZWQgdXNpbmdcbiAgLy8gdGhlIEV4cGFuZGVyQ29tcG9uZW50IGFuZCBQaXZvdFZhbHVlQ29tcG9uZW50IGF0IHJ1bi10aW1lIGluIG1ldGhvZHMuanNcbiAgUGFnaW5hdGlvbkNvbXBvbmVudDogUGFnaW5hdGlvbixcbiAgUHJldmlvdXNDb21wb25lbnQ6IHVuZGVmaW5lZCxcbiAgTmV4dENvbXBvbmVudDogdW5kZWZpbmVkLFxuICBMb2FkaW5nQ29tcG9uZW50OiAoe1xuICAgIGNsYXNzTmFtZSwgbG9hZGluZywgbG9hZGluZ1RleHQsIC4uLnJlc3RcbiAgfSkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctbG9hZGluZycsIHsgJy1hY3RpdmUnOiBsb2FkaW5nIH0sIGNsYXNzTmFtZSl9IHsuLi5yZXN0fT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLWxvYWRpbmctaW5uZXJcIj57bG9hZGluZ1RleHR9PC9kaXY+XG4gICAgPC9kaXY+XG4gICksXG4gIE5vRGF0YUNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LW5vRGF0YScsICdOb0RhdGEnKSxcbiAgUmVzaXplckNvbXBvbmVudDogXy5tYWtlVGVtcGxhdGVDb21wb25lbnQoJ3J0LXJlc2l6ZXInLCAnUmVzaXplcicpLFxuICBQYWRSb3dDb21wb25lbnQ6ICgpID0+IDxzcGFuPiZuYnNwOzwvc3Bhbj4sXG59XG4iXX0=