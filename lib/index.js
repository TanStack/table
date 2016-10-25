'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactTableDefaults = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
var _ = {
  get: get,
  takeRight: takeRight,
  last: last,
  orderBy: orderBy,
  range: range,
  clone: clone,
  remove: remove
};

var defaultButton = function defaultButton(props) {
  return _react2.default.createElement(
    'button',
    _extends({}, props, { className: '-btn' }),
    props.children
  );
};

var ReactTableDefaults = exports.ReactTableDefaults = {
  // Classes
  className: '-striped -highlight',
  tableClassName: '',
  theadClassName: '',
  tbodyClassName: '',
  trClassName: '',
  paginationClassName: '',
  //
  pageSize: 20,
  minRows: 0,
  // Global Column Defaults
  column: {
    sortable: true,
    show: true
  },
  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  // Components
  tableComponent: function tableComponent(props) {
    return _react2.default.createElement(
      'table',
      props,
      props.children
    );
  },
  theadComponent: function theadComponent(props) {
    return _react2.default.createElement(
      'thead',
      props,
      props.children
    );
  },
  tbodyComponent: function tbodyComponent(props) {
    return _react2.default.createElement(
      'tbody',
      props,
      props.children
    );
  },
  trComponent: function trComponent(props) {
    return _react2.default.createElement(
      'tr',
      props,
      props.children
    );
  },
  thComponent: function thComponent(props) {
    return _react2.default.createElement(
      'th',
      props,
      props.children
    );
  },
  tdComponent: function tdComponent(props) {
    return _react2.default.createElement(
      'td',
      props,
      props.children
    );
  },
  previousComponent: null,
  nextComponent: null,
  // Unlisted
  data: []
};

exports.default = _react2.default.createClass({
  displayName: 'src',
  getDefaultProps: function getDefaultProps() {
    return ReactTableDefaults;
  },
  getInitialState: function getInitialState() {
    return {
      sorting: false
    };
  },
  componentWillMount: function componentWillMount() {
    this.update(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  },
  update: function update(props) {
    var resetState = {
      loading: false,
      page: 0,
      pages: -1
      // columns: {}  for column hiding in the future
    };
    this.setState(resetState);
    var newState = Object.assign({}, this.state, resetState);
    this.isAsync = typeof props.data === 'function';
    this.buildColumns(props, newState);
    this.buildData(props, newState);
  },
  buildColumns: function buildColumns(props) {
    var _this = this;

    this.hasHeaderGroups = false;
    props.columns.forEach(function (column) {
      if (column.columns) {
        _this.hasHeaderGroups = true;
      }
    });

    this.headerGroups = [];
    this.decoratedColumns = [];
    var currentSpan = [];

    var addHeader = function addHeader(columns) {
      var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _this.headerGroups.push(Object.assign({}, column, {
        columns: columns
      }));
      currentSpan = [];
    };
    var makeDecoratedColumn = function makeDecoratedColumn(column) {
      var dcol = Object.assign({}, _this.props.column, column);
      if (typeof dcol.accessor === 'string') {
        (function () {
          dcol.id = dcol.id || dcol.accessor;
          var accessorString = dcol.accessor;
          dcol.accessor = function (row) {
            return _.get(row, accessorString);
          };
        })();
      }
      if (!dcol.id) {
        console.warn('No column ID found for column: ', dcol);
      }
      if (!dcol.accessor) {
        console.warn('No column accessor found for column: ', dcol);
      }
      return dcol;
    };

    props.columns.forEach(function (column, i) {
      if (column.columns) {
        column.columns.forEach(function (nestedColumn) {
          _this.decoratedColumns.push(makeDecoratedColumn(nestedColumn));
        });
        if (_this.hasHeaderGroups) {
          if (currentSpan.length > 0) {
            addHeader(currentSpan);
          }
          addHeader(_.takeRight(_this.decoratedColumns, column.columns.length), column);
        }
      } else {
        _this.decoratedColumns.push(makeDecoratedColumn(column));
        currentSpan.push(_.last(_this.decoratedColumns));
      }
    });

    if (this.hasHeaderGroups && currentSpan.length > 0) {
      addHeader(currentSpan);
    }
  },
  getInitSorting: function getInitSorting() {
    var initSorting = this.decoratedColumns.filter(function (d) {
      return typeof d.sort !== 'undefined';
    }).map(function (d) {
      return {
        id: d.id,
        asc: d.sort === 'asc'
      };
    });

    return initSorting.length ? initSorting : [{
      id: this.decoratedColumns[0].id,
      asc: true
    }];
  },
  buildData: function buildData(props, state) {
    var _this2 = this;

    var sorting = state.sorting === false ? this.getInitSorting() : state.sorting;

    var setData = function setData(data) {
      _this2.setState({
        sorting: sorting,
        data: data,
        page: state.page,
        loading: false
      });
    };

    if (this.isAsync) {
      this.setState({
        loading: true
      });

      var cb = function cb(res) {
        if (!res) {
          return Promise.reject('Uh Oh! Nothing was returned in ReactTable\'s data callback!');
        }
        if (res.pages) {
          _this2.setState({
            pages: res.pages
          });
        }
        // Only access the data. Sorting is done server side.
        var accessedData = _this2.accessData(res.rows);
        setData(accessedData);
      };

      // Fetch data with current state
      var dataRes = props.data({
        sorting: sorting,
        page: state.page || 0,
        pageSize: props.pageSize,
        pages: state.pages
      }, cb);

      if (dataRes && dataRes.then) {
        dataRes.then(cb);
      }
    } else {
      // Return locally accessed, sorted data
      var accessedData = this.accessData(props.data);
      var sortedData = this.sortData(accessedData, sorting);
      setData(sortedData);
    }
  },
  accessData: function accessData(data) {
    var _this3 = this;

    return data.map(function (d) {
      var row = {
        __original: d
      };
      _this3.decoratedColumns.forEach(function (column) {
        row[column.id] = column.accessor(d);
      });
      return row;
    });
  },
  sortData: function sortData(data, sorting) {
    var resolvedSorting = sorting.length ? sorting : this.getInitSorting();
    return _.orderBy(data, resolvedSorting.map(function (sort) {
      return function (row) {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity;
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id];
      };
    }), resolvedSorting.map(function (d) {
      return d.asc ? 'asc' : 'desc';
    }));
  },
  setPage: function setPage(page) {
    if (this.isAsync) {
      return this.buildData(this.props, Object.assign({}, this.state, { page: page }));
    }
    this.setState({
      page: page
    });
  },
  render: function render() {
    var _this4 = this;

    var data = this.state.data ? this.state.data : [];

    var pagesLength = this.isAsync ? this.state.pages : Math.ceil(data.length / this.props.pageSize);
    var startRow = this.props.pageSize * this.state.page;
    var endRow = startRow + this.props.pageSize;
    var pageRows = this.isAsync ? data.slice(0, this.props.pageSize) : data.slice(startRow, endRow);
    var padRows = pagesLength > 1 ? _.range(this.props.pageSize - pageRows.length) : this.props.minRows ? _.range(Math.max(this.props.minRows - pageRows.length, 0)) : [];

    var canPrevious = this.state.page > 0;
    var canNext = this.state.page + 1 < pagesLength;

    var TableComponent = this.props.tableComponent;
    var TheadComponent = this.props.theadComponent;
    var TbodyComponent = this.props.tbodyComponent;
    var TrComponent = this.props.trComponent;
    var ThComponent = this.props.thComponent;
    var TdComponent = this.props.tdComponent;

    var PreviousComponent = this.props.previousComponent || defaultButton;
    var NextComponent = this.props.nextComponent || defaultButton;

    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)(this.props.className, 'ReactTable') },
      _react2.default.createElement(
        TableComponent,
        { className: (0, _classnames2.default)(this.props.tableClassName) },
        this.hasHeaderGroups && _react2.default.createElement(
          TheadComponent,
          { className: (0, _classnames2.default)(this.props.theadClassName, '-headerGroups') },
          _react2.default.createElement(
            TrComponent,
            { className: this.props.trClassName },
            this.headerGroups.map(function (column, i) {
              return _react2.default.createElement(
                ThComponent,
                {
                  key: i,
                  className: (0, _classnames2.default)(column.className),
                  colSpan: column.columns.length },
                _react2.default.createElement(
                  'div',
                  {
                    className: (0, _classnames2.default)(column.innerClassName, '-th-inner') },
                  typeof column.header === 'function' ? _react2.default.createElement(column.header, {
                    data: _this4.props.data,
                    column: column
                  }) : column.header
                )
              );
            })
          )
        ),
        _react2.default.createElement(
          TheadComponent,
          { className: (0, _classnames2.default)(this.props.theadClassName) },
          _react2.default.createElement(
            TrComponent,
            { className: this.props.trClassName },
            this.decoratedColumns.map(function (column, i) {
              var sort = _this4.state.sorting.find(function (d) {
                return d.id === column.id;
              });
              var show = typeof column.show === 'function' ? column.show() : column.show;
              return _react2.default.createElement(
                ThComponent,
                {
                  key: i,
                  className: (0, _classnames2.default)(column.className, sort ? sort.asc ? '-sort-asc' : '-sort-desc' : '', {
                    '-cursor-pointer': column.sortable,
                    '-hidden': !show
                  }),
                  onClick: function onClick(e) {
                    column.sortable && _this4.sortColumn(column, e.shiftKey);
                  } },
                _react2.default.createElement(
                  'div',
                  {
                    className: (0, _classnames2.default)(column.innerClassName, '-th-inner'),
                    style: {
                      width: column.width + 'px',
                      minWidth: column.minWidth + 'px'
                    } },
                  typeof column.header === 'function' ? _react2.default.createElement(column.header, {
                    data: _this4.props.data,
                    column: column
                  }) : column.header
                )
              );
            })
          )
        ),
        _react2.default.createElement(
          TbodyComponent,
          { className: (0, _classnames2.default)(this.props.tbodyClassName) },
          pageRows.map(function (row, i) {
            return _react2.default.createElement(
              TrComponent,
              {
                className: (0, _classnames2.default)(_this4.props.trClassName),
                key: i },
              _this4.decoratedColumns.map(function (column, i2) {
                var Cell = column.render;
                var show = typeof column.show === 'function' ? column.show() : column.show;
                return _react2.default.createElement(
                  TdComponent,
                  {
                    className: (0, _classnames2.default)(column.className, { hidden: !show }),
                    key: i2 },
                  _react2.default.createElement(
                    'div',
                    {
                      className: (0, _classnames2.default)(column.innerClassName, '-td-inner'),
                      style: {
                        width: column.width + 'px',
                        minWidth: column.minWidth + 'px'
                      } },
                    typeof Cell === 'function' ? _react2.default.createElement(Cell, {
                      value: row[column.id],
                      row: row.__original,
                      index: i
                    }) : typeof Cell !== 'undefined' ? Cell : row[column.id]
                  )
                );
              })
            );
          }),
          padRows.map(function (row, i) {
            return _react2.default.createElement(
              TrComponent,
              {
                className: (0, _classnames2.default)(_this4.props.trClassName, '-padRow'),
                key: i },
              _this4.decoratedColumns.map(function (column, i2) {
                var show = typeof column.show === 'function' ? column.show() : column.show;
                return _react2.default.createElement(
                  TdComponent,
                  {
                    className: (0, _classnames2.default)(column.className, { hidden: !show }),
                    key: i2 },
                  _react2.default.createElement(
                    'div',
                    {
                      className: (0, _classnames2.default)(column.innerClassName, '-td-inner'),
                      style: {
                        width: column.width + 'px',
                        minWidth: column.minWidth + 'px'
                      } },
                    '\xA0'
                  )
                );
              })
            );
          })
        )
      ),
      pagesLength > 1 && _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(this.props.paginationClassName, '-pagination') },
        _react2.default.createElement(
          'div',
          { className: '-left' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: canPrevious && function (e) {
                return _this4.previousPage(e);
              },
              disabled: !canPrevious },
            this.props.previousText
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-center' },
          'Page ',
          this.state.page + 1,
          ' of ',
          pagesLength
        ),
        _react2.default.createElement(
          'div',
          { className: '-right' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: canNext && function (e) {
                return _this4.nextPage(e);
              },
              disabled: !canNext },
            this.props.nextText
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('-loading', { '-active': this.state.loading }) },
        _react2.default.createElement(
          'div',
          { className: '-loading-inner' },
          this.props.loadingText
        )
      )
    );
  },
  sortColumn: function sortColumn(column, additive) {
    var existingSorting = this.state.sorting || [];
    var sorting = _.clone(this.state.sorting || []);
    var existingIndex = sorting.findIndex(function (d) {
      return d.id === column.id;
    });
    if (existingIndex > -1) {
      var existing = sorting[existingIndex];
      if (existing.asc) {
        existing.asc = false;
        if (!additive) {
          sorting = [existing];
        }
      } else {
        if (additive) {
          sorting.splice(existingIndex, 1);
        } else {
          existing.asc = true;
          sorting = [existing];
        }
      }
    } else {
      if (additive) {
        sorting.push({
          id: column.id,
          asc: true
        });
      } else {
        sorting = [{
          id: column.id,
          asc: true
        }];
      }
    }
    var page = existingIndex === 0 || !existingSorting.length && sorting.length || !additive ? 0 : this.state.page;
    this.buildData(this.props, Object.assign({}, this.state, { page: page, sorting: sorting }));
  },
  nextPage: function nextPage(e) {
    e.preventDefault();
    this.setPage(this.state.page + 1);
  },
  previousPage: function previousPage(e) {
    e.preventDefault();
    this.setPage(this.state.page - 1);
  }
});

// ########################################################################
// Utils
// ########################################################################

function remove(a, b) {
  return a.filter(function (o, i) {
    var r = b(o);
    if (r) {
      a.splice(i, 1);
      return true;
    }
    return false;
  });
}

function get(a, b) {
  if (isArray(b)) {
    b = b.join('.');
  }
  return b.replace('[', '.').replace(']', '').split('.').reduce(function (obj, property) {
    return obj[property];
  }, a);
}

function takeRight(arr, n) {
  var start = n > arr.length ? 0 : arr.length - n;
  return arr.slice(start);
}

function last(arr) {
  return arr[arr.length - 1];
}

function range(n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push(n);
  }
  return arr;
}

function orderBy(arr, funcs, dirs) {
  return arr.sort(function (a, b) {
    for (var i = 0; i < funcs.length; i++) {
      var comp = funcs[i];
      var ca = comp(a);
      var cb = comp(b);
      var desc = dirs[i] === false || dirs[i] === 'desc';
      if (ca > cb) {
        return desc ? -1 : 1;
      }
      if (ca < cb) {
        return desc ? 1 : -1;
      }
    }
    return 0;
  });
}

function clone(a) {
  return JSON.parse(JSON.stringify(a, function (key, value) {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  }));
}

// ########################################################################
// Helpers
// ########################################################################

function isArray(a) {
  return Array.isArray(a);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJfIiwiZ2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsImNsb25lIiwicmVtb3ZlIiwiZGVmYXVsdEJ1dHRvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJSZWFjdFRhYmxlRGVmYXVsdHMiLCJjbGFzc05hbWUiLCJ0YWJsZUNsYXNzTmFtZSIsInRoZWFkQ2xhc3NOYW1lIiwidGJvZHlDbGFzc05hbWUiLCJ0ckNsYXNzTmFtZSIsInBhZ2luYXRpb25DbGFzc05hbWUiLCJwYWdlU2l6ZSIsIm1pblJvd3MiLCJjb2x1bW4iLCJzb3J0YWJsZSIsInNob3ciLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0IiwidGFibGVDb21wb25lbnQiLCJ0aGVhZENvbXBvbmVudCIsInRib2R5Q29tcG9uZW50IiwidHJDb21wb25lbnQiLCJ0aENvbXBvbmVudCIsInRkQ29tcG9uZW50IiwicHJldmlvdXNDb21wb25lbnQiLCJuZXh0Q29tcG9uZW50IiwiZGF0YSIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0SW5pdGlhbFN0YXRlIiwic29ydGluZyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJyZXNldFN0YXRlIiwibG9hZGluZyIsInBhZ2UiLCJwYWdlcyIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImlzQXN5bmMiLCJidWlsZENvbHVtbnMiLCJidWlsZERhdGEiLCJoYXNIZWFkZXJHcm91cHMiLCJjb2x1bW5zIiwiZm9yRWFjaCIsImhlYWRlckdyb3VwcyIsImRlY29yYXRlZENvbHVtbnMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsInB1c2giLCJtYWtlRGVjb3JhdGVkQ29sdW1uIiwiZGNvbCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiaSIsIm5lc3RlZENvbHVtbiIsImxlbmd0aCIsImdldEluaXRTb3J0aW5nIiwiaW5pdFNvcnRpbmciLCJmaWx0ZXIiLCJkIiwic29ydCIsIm1hcCIsImFzYyIsInNldERhdGEiLCJjYiIsInJlcyIsIlByb21pc2UiLCJyZWplY3QiLCJhY2Nlc3NlZERhdGEiLCJhY2Nlc3NEYXRhIiwicm93cyIsImRhdGFSZXMiLCJ0aGVuIiwic29ydGVkRGF0YSIsInNvcnREYXRhIiwiX19vcmlnaW5hbCIsInJlc29sdmVkU29ydGluZyIsInVuZGVmaW5lZCIsIkluZmluaXR5IiwidG9Mb3dlckNhc2UiLCJzZXRQYWdlIiwicmVuZGVyIiwicGFnZXNMZW5ndGgiLCJNYXRoIiwiY2VpbCIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsInBhZFJvd3MiLCJtYXgiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJUYWJsZUNvbXBvbmVudCIsIlRoZWFkQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJpbm5lckNsYXNzTmFtZSIsImhlYWRlciIsImZpbmQiLCJlIiwic29ydENvbHVtbiIsInNoaWZ0S2V5Iiwid2lkdGgiLCJtaW5XaWR0aCIsImkyIiwiQ2VsbCIsImhpZGRlbiIsInByZXZpb3VzUGFnZSIsIm5leHRQYWdlIiwiYWRkaXRpdmUiLCJleGlzdGluZ1NvcnRpbmciLCJleGlzdGluZ0luZGV4IiwiZmluZEluZGV4IiwiZXhpc3RpbmciLCJzcGxpY2UiLCJwcmV2ZW50RGVmYXVsdCIsImEiLCJiIiwibyIsInIiLCJpc0FycmF5Iiwiam9pbiIsInJlcGxhY2UiLCJzcGxpdCIsInJlZHVjZSIsIm9iaiIsInByb3BlcnR5IiwiYXJyIiwibiIsInN0YXJ0IiwiZnVuY3MiLCJkaXJzIiwiY29tcCIsImNhIiwiZGVzYyIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsInZhbHVlIiwidG9TdHJpbmciLCJBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBQ0E7QUFDQSxJQUFNQSxJQUFJO0FBQ1JDLFVBRFE7QUFFUkMsc0JBRlE7QUFHUkMsWUFIUTtBQUlSQyxrQkFKUTtBQUtSQyxjQUxRO0FBTVJDLGNBTlE7QUFPUkM7QUFQUSxDQUFWOztBQVVBLElBQU1DLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRDtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxpQkFBWUEsS0FBWixJQUFtQixXQUFVLE1BQTdCO0FBQXFDQSxVQUFNQztBQUEzQyxHQURvQjtBQUFBLENBQXRCOztBQUlPLElBQU1DLGtEQUFxQjtBQUNoQztBQUNBQyxhQUFXLHFCQUZxQjtBQUdoQ0Msa0JBQWdCLEVBSGdCO0FBSWhDQyxrQkFBZ0IsRUFKZ0I7QUFLaENDLGtCQUFnQixFQUxnQjtBQU1oQ0MsZUFBYSxFQU5tQjtBQU9oQ0MsdUJBQXFCLEVBUFc7QUFRaEM7QUFDQUMsWUFBVSxFQVRzQjtBQVVoQ0MsV0FBUyxDQVZ1QjtBQVdoQztBQUNBQyxVQUFRO0FBQ05DLGNBQVUsSUFESjtBQUVOQyxVQUFNO0FBRkEsR0Fad0I7QUFnQmhDO0FBQ0FDLGdCQUFjLFVBakJrQjtBQWtCaENDLFlBQVUsTUFsQnNCO0FBbUJoQ0MsZUFBYSxZQW5CbUI7QUFvQmhDO0FBQ0FDLGtCQUFnQix3QkFBQ2pCLEtBQUQ7QUFBQSxXQUFXO0FBQUE7QUFBV0EsV0FBWDtBQUFtQkEsWUFBTUM7QUFBekIsS0FBWDtBQUFBLEdBckJnQjtBQXNCaENpQixrQkFBZ0Isd0JBQUNsQixLQUFEO0FBQUEsV0FBVztBQUFBO0FBQVdBLFdBQVg7QUFBbUJBLFlBQU1DO0FBQXpCLEtBQVg7QUFBQSxHQXRCZ0I7QUF1QmhDa0Isa0JBQWdCLHdCQUFDbkIsS0FBRDtBQUFBLFdBQVc7QUFBQTtBQUFXQSxXQUFYO0FBQW1C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SUQsS0FBSzFFLEVBQVQsRUFBYTtBQUNYLGVBQU8yRSxPQUFPLENBQVAsR0FBVyxDQUFDLENBQW5CO0FBQ0Q7QUFDRjtBQUNELFdBQU8sQ0FBUDtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVELFNBQVN2SixLQUFULENBQWdCcUksQ0FBaEIsRUFBbUI7QUFDakIsU0FBT21CLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlckIsQ0FBZixFQUFrQixVQUFVc0IsR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ3hELFFBQUksT0FBT0EsS0FBUCxLQUFpQixVQUFyQixFQUFpQztBQUMvQixhQUFPQSxNQUFNQyxRQUFOLEVBQVA7QUFDRDtBQUNELFdBQU9ELEtBQVA7QUFDRCxHQUxpQixDQUFYLENBQVA7QUFNRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUEsU0FBU25CLE9BQVQsQ0FBa0JKLENBQWxCLEVBQXFCO0FBQ25CLFNBQU95QixNQUFNckIsT0FBTixDQUFjSixDQUFkLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG4vL1xuY29uc3QgXyA9IHtcbiAgZ2V0LFxuICB0YWtlUmlnaHQsXG4gIGxhc3QsXG4gIG9yZGVyQnksXG4gIHJhbmdlLFxuICBjbG9uZSxcbiAgcmVtb3ZlXG59XG5cbmNvbnN0IGRlZmF1bHRCdXR0b24gPSAocHJvcHMpID0+IChcbiAgPGJ1dHRvbiB7Li4ucHJvcHN9IGNsYXNzTmFtZT0nLWJ0bic+e3Byb3BzLmNoaWxkcmVufTwvYnV0dG9uPlxuKVxuXG5leHBvcnQgY29uc3QgUmVhY3RUYWJsZURlZmF1bHRzID0ge1xuICAvLyBDbGFzc2VzXG4gIGNsYXNzTmFtZTogJy1zdHJpcGVkIC1oaWdobGlnaHQnLFxuICB0YWJsZUNsYXNzTmFtZTogJycsXG4gIHRoZWFkQ2xhc3NOYW1lOiAnJyxcbiAgdGJvZHlDbGFzc05hbWU6ICcnLFxuICB0ckNsYXNzTmFtZTogJycsXG4gIHBhZ2luYXRpb25DbGFzc05hbWU6ICcnLFxuICAvL1xuICBwYWdlU2l6ZTogMjAsXG4gIG1pblJvd3M6IDAsXG4gIC8vIEdsb2JhbCBDb2x1bW4gRGVmYXVsdHNcbiAgY29sdW1uOiB7XG4gICAgc29ydGFibGU6IHRydWUsXG4gICAgc2hvdzogdHJ1ZVxuICB9LFxuICAvLyBUZXh0XG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcbiAgbmV4dFRleHQ6ICdOZXh0JyxcbiAgbG9hZGluZ1RleHQ6ICdMb2FkaW5nLi4uJyxcbiAgLy8gQ29tcG9uZW50c1xuICB0YWJsZUNvbXBvbmVudDogKHByb3BzKSA9PiA8dGFibGUgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90YWJsZT4sXG4gIHRoZWFkQ29tcG9uZW50OiAocHJvcHMpID0+IDx0aGVhZCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RoZWFkPixcbiAgdGJvZHlDb21wb25lbnQ6IChwcm9wcykgPT4gPHRib2R5IHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGJvZHk+LFxuICB0ckNvbXBvbmVudDogKHByb3BzKSA9PiA8dHIgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90cj4sXG4gIHRoQ29tcG9uZW50OiAocHJvcHMpID0+IDx0aCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RoPixcbiAgdGRDb21wb25lbnQ6IChwcm9wcykgPT4gPHRkIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGQ+LFxuICBwcmV2aW91c0NvbXBvbmVudDogbnVsbCxcbiAgbmV4dENvbXBvbmVudDogbnVsbCxcbiAgLy8gVW5saXN0ZWRcbiAgZGF0YTogW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXREZWZhdWx0UHJvcHMgKCkge1xuICAgIHJldHVybiBSZWFjdFRhYmxlRGVmYXVsdHNcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc29ydGluZzogZmFsc2VcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy51cGRhdGUodGhpcy5wcm9wcylcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgdGhpcy51cGRhdGUobmV4dFByb3BzKVxuICB9LFxuICB1cGRhdGUgKHByb3BzKSB7XG4gICAgY29uc3QgcmVzZXRTdGF0ZSA9IHtcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgcGFnZTogMCxcbiAgICAgIHBhZ2VzOiAtMVxuICAgICAgLy8gY29sdW1uczoge30gIGZvciBjb2x1bW4gaGlkaW5nIGluIHRoZSBmdXR1cmVcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShyZXNldFN0YXRlKVxuICAgIGNvbnN0IG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgcmVzZXRTdGF0ZSlcbiAgICB0aGlzLmlzQXN5bmMgPSB0eXBlb2YgcHJvcHMuZGF0YSA9PT0gJ2Z1bmN0aW9uJ1xuICAgIHRoaXMuYnVpbGRDb2x1bW5zKHByb3BzLCBuZXdTdGF0ZSlcbiAgICB0aGlzLmJ1aWxkRGF0YShwcm9wcywgbmV3U3RhdGUpXG4gIH0sXG4gIGJ1aWxkQ29sdW1ucyAocHJvcHMpIHtcbiAgICB0aGlzLmhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXG4gICAgcHJvcHMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5oYXNIZWFkZXJHcm91cHMgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuaGVhZGVyR3JvdXBzID0gW11cbiAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMgPSBbXVxuICAgIGxldCBjdXJyZW50U3BhbiA9IFtdXG5cbiAgICBjb25zdCBhZGRIZWFkZXIgPSAoY29sdW1ucywgY29sdW1uID0ge30pID0+IHtcbiAgICAgIHRoaXMuaGVhZGVyR3JvdXBzLnB1c2goT2JqZWN0LmFzc2lnbih7fSwgY29sdW1uLCB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH0pKVxuICAgICAgY3VycmVudFNwYW4gPSBbXVxuICAgIH1cbiAgICBjb25zdCBtYWtlRGVjb3JhdGVkQ29sdW1uID0gKGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgZGNvbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMuY29sdW1uLCBjb2x1bW4pXG4gICAgICBpZiAodHlwZW9mIGRjb2wuYWNjZXNzb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRjb2wuaWQgPSBkY29sLmlkIHx8IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXG4gICAgICAgIGRjb2wuYWNjZXNzb3IgPSByb3cgPT4gXy5nZXQocm93LCBhY2Nlc3NvclN0cmluZylcbiAgICAgIH1cbiAgICAgIGlmICghZGNvbC5pZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05vIGNvbHVtbiBJRCBmb3VuZCBmb3IgY29sdW1uOiAnLCBkY29sKVxuICAgICAgfVxuICAgICAgaWYgKCFkY29sLmFjY2Vzc29yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTm8gY29sdW1uIGFjY2Vzc29yIGZvdW5kIGZvciBjb2x1bW46ICcsIGRjb2wpXG4gICAgICB9XG4gICAgICByZXR1cm4gZGNvbFxuICAgIH1cblxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgY29sdW1uLmNvbHVtbnMuZm9yRWFjaChuZXN0ZWRDb2x1bW4gPT4ge1xuICAgICAgICAgIHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5wdXNoKG1ha2VEZWNvcmF0ZWRDb2x1bW4obmVzdGVkQ29sdW1uKSlcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyR3JvdXBzKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkSGVhZGVyKF8udGFrZVJpZ2h0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucywgY29sdW1uLmNvbHVtbnMubGVuZ3RoKSwgY29sdW1uKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMucHVzaChtYWtlRGVjb3JhdGVkQ29sdW1uKGNvbHVtbikpXG4gICAgICAgIGN1cnJlbnRTcGFuLnB1c2goXy5sYXN0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucykpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLmhhc0hlYWRlckdyb3VwcyAmJiBjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgfVxuICB9LFxuICBnZXRJbml0U29ydGluZyAoKSB7XG4gICAgY29uc3QgaW5pdFNvcnRpbmcgPSB0aGlzLmRlY29yYXRlZENvbHVtbnMuZmlsdGVyKGQgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkLnNvcnQgIT09ICd1bmRlZmluZWQnXG4gICAgfSkubWFwKGQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgIGFzYzogZC5zb3J0ID09PSAnYXNjJ1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW5pdFNvcnRpbmcubGVuZ3RoID8gaW5pdFNvcnRpbmcgOiBbe1xuICAgICAgaWQ6IHRoaXMuZGVjb3JhdGVkQ29sdW1uc1swXS5pZCxcbiAgICAgIGFzYzogdHJ1ZVxuICAgIH1dXG4gIH0sXG4gIGJ1aWxkRGF0YSAocHJvcHMsIHN0YXRlKSB7XG4gICAgY29uc3Qgc29ydGluZyA9IHN0YXRlLnNvcnRpbmcgPT09IGZhbHNlID8gdGhpcy5nZXRJbml0U29ydGluZygpIDogc3RhdGUuc29ydGluZ1xuXG4gICAgY29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc29ydGluZyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcGFnZTogc3RhdGUucGFnZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNBc3luYykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNiID0gKHJlcykgPT4ge1xuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnVWggT2ghIE5vdGhpbmcgd2FzIHJldHVybmVkIGluIFJlYWN0VGFibGVcXCdzIGRhdGEgY2FsbGJhY2shJylcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzLnBhZ2VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwYWdlczogcmVzLnBhZ2VzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBPbmx5IGFjY2VzcyB0aGUgZGF0YS4gU29ydGluZyBpcyBkb25lIHNlcnZlciBzaWRlLlxuICAgICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocmVzLnJvd3MpXG4gICAgICAgIHNldERhdGEoYWNjZXNzZWREYXRhKVxuICAgICAgfVxuXG4gICAgICAvLyBGZXRjaCBkYXRhIHdpdGggY3VycmVudCBzdGF0ZVxuICAgICAgY29uc3QgZGF0YVJlcyA9IHByb3BzLmRhdGEoe1xuICAgICAgICBzb3J0aW5nLFxuICAgICAgICBwYWdlOiBzdGF0ZS5wYWdlIHx8IDAsXG4gICAgICAgIHBhZ2VTaXplOiBwcm9wcy5wYWdlU2l6ZSxcbiAgICAgICAgcGFnZXM6IHN0YXRlLnBhZ2VzXG4gICAgICB9LCBjYilcblxuICAgICAgaWYgKGRhdGFSZXMgJiYgZGF0YVJlcy50aGVuKSB7XG4gICAgICAgIGRhdGFSZXMudGhlbihjYilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmV0dXJuIGxvY2FsbHkgYWNjZXNzZWQsIHNvcnRlZCBkYXRhXG4gICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocHJvcHMuZGF0YSlcbiAgICAgIGNvbnN0IHNvcnRlZERhdGEgPSB0aGlzLnNvcnREYXRhKGFjY2Vzc2VkRGF0YSwgc29ydGluZylcbiAgICAgIHNldERhdGEoc29ydGVkRGF0YSlcbiAgICB9XG4gIH0sXG4gIGFjY2Vzc0RhdGEgKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGQpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHtcbiAgICAgICAgX19vcmlnaW5hbDogZFxuICAgICAgfVxuICAgICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgcm93W2NvbHVtbi5pZF0gPSBjb2x1bW4uYWNjZXNzb3IoZClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcm93XG4gICAgfSlcbiAgfSxcbiAgc29ydERhdGEgKGRhdGEsIHNvcnRpbmcpIHtcbiAgICBjb25zdCByZXNvbHZlZFNvcnRpbmcgPSBzb3J0aW5nLmxlbmd0aCA/IHNvcnRpbmcgOiB0aGlzLmdldEluaXRTb3J0aW5nKClcbiAgICByZXR1cm4gXy5vcmRlckJ5KGRhdGEsIHJlc29sdmVkU29ydGluZy5tYXAoc29ydCA9PiB7XG4gICAgICByZXR1cm4gcm93ID0+IHtcbiAgICAgICAgaWYgKHJvd1tzb3J0LmlkXSA9PT0gbnVsbCB8fCByb3dbc29ydC5pZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiAtSW5maW5pdHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIHJvd1tzb3J0LmlkXSA9PT0gJ3N0cmluZycgPyByb3dbc29ydC5pZF0udG9Mb3dlckNhc2UoKSA6IHJvd1tzb3J0LmlkXVxuICAgICAgfVxuICAgIH0pLCByZXNvbHZlZFNvcnRpbmcubWFwKGQgPT4gZC5hc2MgPyAnYXNjJyA6ICdkZXNjJykpXG4gIH0sXG4gIHNldFBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAodGhpcy5pc0FzeW5jKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZERhdGEodGhpcy5wcm9wcywgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge3BhZ2V9KSlcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYWdlXG4gICAgfSlcbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLnN0YXRlLmRhdGEgPyB0aGlzLnN0YXRlLmRhdGEgOiBbXVxuXG4gICAgY29uc3QgcGFnZXNMZW5ndGggPSB0aGlzLmlzQXN5bmMgPyB0aGlzLnN0YXRlLnBhZ2VzIDogTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gdGhpcy5wcm9wcy5wYWdlU2l6ZSlcbiAgICBjb25zdCBzdGFydFJvdyA9IHRoaXMucHJvcHMucGFnZVNpemUgKiB0aGlzLnN0YXRlLnBhZ2VcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHRoaXMucHJvcHMucGFnZVNpemVcbiAgICBjb25zdCBwYWdlUm93cyA9IHRoaXMuaXNBc3luYyA/IGRhdGEuc2xpY2UoMCwgdGhpcy5wcm9wcy5wYWdlU2l6ZSkgOiBkYXRhLnNsaWNlKHN0YXJ0Um93LCBlbmRSb3cpXG4gICAgY29uc3QgcGFkUm93cyA9IHBhZ2VzTGVuZ3RoID4gMSA/IF8ucmFuZ2UodGhpcy5wcm9wcy5wYWdlU2l6ZSAtIHBhZ2VSb3dzLmxlbmd0aClcbiAgICAgIDogdGhpcy5wcm9wcy5taW5Sb3dzID8gXy5yYW5nZShNYXRoLm1heCh0aGlzLnByb3BzLm1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxuICAgICAgOiBbXVxuXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSB0aGlzLnN0YXRlLnBhZ2UgPiAwXG4gICAgY29uc3QgY2FuTmV4dCA9IHRoaXMuc3RhdGUucGFnZSArIDEgPCBwYWdlc0xlbmd0aFxuXG4gICAgY29uc3QgVGFibGVDb21wb25lbnQgPSB0aGlzLnByb3BzLnRhYmxlQ29tcG9uZW50XG4gICAgY29uc3QgVGhlYWRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoZWFkQ29tcG9uZW50XG4gICAgY29uc3QgVGJvZHlDb21wb25lbnQgPSB0aGlzLnByb3BzLnRib2R5Q29tcG9uZW50XG4gICAgY29uc3QgVHJDb21wb25lbnQgPSB0aGlzLnByb3BzLnRyQ29tcG9uZW50XG4gICAgY29uc3QgVGhDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoQ29tcG9uZW50XG4gICAgY29uc3QgVGRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRkQ29tcG9uZW50XG5cbiAgICBjb25zdCBQcmV2aW91c0NvbXBvbmVudCA9IHRoaXMucHJvcHMucHJldmlvdXNDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuICAgIGNvbnN0IE5leHRDb21wb25lbnQgPSB0aGlzLnByb3BzLm5leHRDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCAnUmVhY3RUYWJsZScpfT5cbiAgICAgICAgPFRhYmxlQ29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRhYmxlQ2xhc3NOYW1lKX0+XG4gICAgICAgICAge3RoaXMuaGFzSGVhZGVyR3JvdXBzICYmIChcbiAgICAgICAgICAgIDxUaGVhZENvbXBvbmVudCBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50aGVhZENsYXNzTmFtZSwgJy1oZWFkZXJHcm91cHMnKX0+XG4gICAgICAgICAgICAgIDxUckNvbXBvbmVudCBjbGFzc05hbWU9e3RoaXMucHJvcHMudHJDbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHt0aGlzLmhlYWRlckdyb3Vwcy5tYXAoKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPFRoQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uY2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICAgICAgICBjb2xTcGFuPXtjb2x1bW4uY29sdW1ucy5sZW5ndGh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uaW5uZXJDbGFzc05hbWUsICctdGgtaW5uZXInKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2x1bW4uaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IGNvbHVtbi5oZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvVGhDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFRoZWFkQ29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRoZWFkQ2xhc3NOYW1lKX0+XG4gICAgICAgICAgICA8VHJDb21wb25lbnQgY2xhc3NOYW1lPXt0aGlzLnByb3BzLnRyQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAge3RoaXMuZGVjb3JhdGVkQ29sdW1ucy5tYXAoKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvcnQgPSB0aGlzLnN0YXRlLnNvcnRpbmcuZmluZChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHNvcnQgPyAoc29ydC5hc2MgPyAnLXNvcnQtYXNjJyA6ICctc29ydC1kZXNjJykgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnLWN1cnNvci1wb2ludGVyJzogY29sdW1uLnNvcnRhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy1oaWRkZW4nOiAhc2hvd1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc29ydGFibGUgJiYgdGhpcy5zb3J0Q29sdW1uKGNvbHVtbiwgZS5zaGlmdEtleSlcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRoLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb2x1bW4ud2lkdGggKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sdW1uLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXt0aGlzLnByb3BzLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApIDogY29sdW1uLmhlYWRlcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRib2R5Q2xhc3NOYW1lKX0+XG4gICAgICAgICAgICB7cGFnZVJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRyQ2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICAgIGtleT17aX0+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBDZWxsID0gY29sdW1uLnJlbmRlclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmNsYXNzTmFtZSwge2hpZGRlbjogIXNob3d9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aTJ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRkLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbHVtbi53aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2YgQ2VsbCA9PT0gJ2Z1bmN0aW9uJyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Jvd1tjb2x1bW4uaWRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93PXtyb3cuX19vcmlnaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IHR5cGVvZiBDZWxsICE9PSAndW5kZWZpbmVkJyA/IENlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiByb3dbY29sdW1uLmlkXX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvVGRDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAge3BhZFJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRyQ2xhc3NOYW1lLCAnLXBhZFJvdycpfVxuICAgICAgICAgICAgICAgICAga2V5PXtpfT5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLmRlY29yYXRlZENvbHVtbnMubWFwKChjb2x1bW4sIGkyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8VGRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uY2xhc3NOYW1lLCB7aGlkZGVuOiAhc2hvd30pfVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpMn0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uaW5uZXJDbGFzc05hbWUsICctdGQtaW5uZXInKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29sdW1uLndpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogY29sdW1uLm1pbldpZHRoICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fT4mbmJzcDs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L1Rib2R5Q29tcG9uZW50PlxuICAgICAgICA8L1RhYmxlQ29tcG9uZW50PlxuICAgICAgICB7cGFnZXNMZW5ndGggPiAxICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnBhZ2luYXRpb25DbGFzc05hbWUsICctcGFnaW5hdGlvbicpfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctbGVmdCc+XG4gICAgICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2NhblByZXZpb3VzICYmICgoZSkgPT4gdGhpcy5wcmV2aW91c1BhZ2UoZSkpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshY2FuUHJldmlvdXN9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cbiAgICAgICAgICAgICAgPC9QcmV2aW91c0NvbXBvbmVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1jZW50ZXInPlxuICAgICAgICAgICAgICBQYWdlIHt0aGlzLnN0YXRlLnBhZ2UgKyAxfSBvZiB7cGFnZXNMZW5ndGh9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctcmlnaHQnPlxuICAgICAgICAgICAgICA8TmV4dENvbXBvbmVudFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Nhbk5leHQgJiYgKChlKSA9PiB0aGlzLm5leHRQYWdlKGUpKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhbk5leHR9PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5leHRUZXh0fVxuICAgICAgICAgICAgICA8L05leHRDb21wb25lbnQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1sb2FkaW5nJywgeyctYWN0aXZlJzogdGhpcy5zdGF0ZS5sb2FkaW5nfSl9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctbG9hZGluZy1pbm5lcic+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sb2FkaW5nVGV4dH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG4gIHNvcnRDb2x1bW4gKGNvbHVtbiwgYWRkaXRpdmUpIHtcbiAgICBjb25zdCBleGlzdGluZ1NvcnRpbmcgPSB0aGlzLnN0YXRlLnNvcnRpbmcgfHwgW11cbiAgICBsZXQgc29ydGluZyA9IF8uY2xvbmUodGhpcy5zdGF0ZS5zb3J0aW5nIHx8IFtdKVxuICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBzb3J0aW5nLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICBpZiAoZXhpc3RpbmdJbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHNvcnRpbmdbZXhpc3RpbmdJbmRleF1cbiAgICAgIGlmIChleGlzdGluZy5hc2MpIHtcbiAgICAgICAgZXhpc3RpbmcuYXNjID0gZmFsc2VcbiAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xuICAgICAgICAgIHNvcnRpbmcgPSBbZXhpc3RpbmddXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgIHNvcnRpbmcuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpc3RpbmcuYXNjID0gdHJ1ZVxuICAgICAgICAgIHNvcnRpbmcgPSBbZXhpc3RpbmddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgIHNvcnRpbmcucHVzaCh7XG4gICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICBhc2M6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvcnRpbmcgPSBbe1xuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgYXNjOiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHBhZ2UgPSAoZXhpc3RpbmdJbmRleCA9PT0gMCB8fCAoIWV4aXN0aW5nU29ydGluZy5sZW5ndGggJiYgc29ydGluZy5sZW5ndGgpIHx8ICFhZGRpdGl2ZSkgPyAwIDogdGhpcy5zdGF0ZS5wYWdlXG4gICAgdGhpcy5idWlsZERhdGEodGhpcy5wcm9wcywgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge3BhZ2UsIHNvcnRpbmd9KSlcbiAgfSxcbiAgbmV4dFBhZ2UgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLnNldFBhZ2UodGhpcy5zdGF0ZS5wYWdlICsgMSlcbiAgfSxcbiAgcHJldmlvdXNQYWdlIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRQYWdlKHRoaXMuc3RhdGUucGFnZSAtIDEpXG4gIH1cbn0pXG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gVXRpbHNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5mdW5jdGlvbiByZW1vdmUgKGEsIGIpIHtcbiAgcmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uIChvLCBpKSB7XG4gICAgdmFyIHIgPSBiKG8pXG4gICAgaWYgKHIpIHtcbiAgICAgIGEuc3BsaWNlKGksIDEpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0IChhLCBiKSB7XG4gIGlmIChpc0FycmF5KGIpKSB7XG4gICAgYiA9IGIuam9pbignLicpXG4gIH1cbiAgcmV0dXJuIGJcbiAgICAucmVwbGFjZSgnWycsICcuJykucmVwbGFjZSgnXScsICcnKVxuICAgIC5zcGxpdCgnLicpXG4gICAgLnJlZHVjZShcbiAgICAgIGZ1bmN0aW9uIChvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcGVydHldXG4gICAgICB9LCBhXG4gICAgKVxufVxuXG5mdW5jdGlvbiB0YWtlUmlnaHQgKGFyciwgbikge1xuICBjb25zdCBzdGFydCA9IG4gPiBhcnIubGVuZ3RoID8gMCA6IGFyci5sZW5ndGggLSBuXG4gIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQpXG59XG5cbmZ1bmN0aW9uIGxhc3QgKGFycikge1xuICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXVxufVxuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICBjb25zdCBhcnIgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIGFyci5wdXNoKG4pXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBvcmRlckJ5IChhcnIsIGZ1bmNzLCBkaXJzKSB7XG4gIHJldHVybiBhcnIuc29ydCgoYSwgYikgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnVuY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbXAgPSBmdW5jc1tpXVxuICAgICAgY29uc3QgY2EgPSBjb21wKGEpXG4gICAgICBjb25zdCBjYiA9IGNvbXAoYilcbiAgICAgIGNvbnN0IGRlc2MgPSBkaXJzW2ldID09PSBmYWxzZSB8fCBkaXJzW2ldID09PSAnZGVzYydcbiAgICAgIGlmIChjYSA+IGNiKSB7XG4gICAgICAgIHJldHVybiBkZXNjID8gLTEgOiAxXG4gICAgICB9XG4gICAgICBpZiAoY2EgPCBjYikge1xuICAgICAgICByZXR1cm4gZGVzYyA/IDEgOiAtMVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5mdW5jdGlvbiBjbG9uZSAoYSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9KSlcbn1cblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyBIZWxwZXJzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuZnVuY3Rpb24gaXNBcnJheSAoYSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhKVxufVxuIl19