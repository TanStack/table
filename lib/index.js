'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactTableDefaults = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        var _ret = function () {
          dcol.id = dcol.id || dcol.accessor;
          var accessorString = dcol.accessor;
          dcol.accessor = function (row) {
            return _.get(row, accessorString);
          };
          return {
            v: dcol
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      if (dcol.accessor && !dcol.id) {
        console.warn(dcol);
        throw new Error('A column id is required if using a non-string accessor for column above.');
      }

      dcol.accessor = function (d) {
        return undefined;
      };
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

    return data.map(function (d, i) {
      var row = {
        __original: d,
        __index: i
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
                      index: row.__index,
                      viewIndex: i
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJfIiwiZ2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsImNsb25lIiwicmVtb3ZlIiwiZGVmYXVsdEJ1dHRvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJSZWFjdFRhYmxlRGVmYXVsdHMiLCJjbGFzc05hbWUiLCJ0YWJsZUNsYXNzTmFtZSIsInRoZWFkQ2xhc3NOYW1lIiwidGJvZHlDbGFzc05hbWUiLCJ0ckNsYXNzTmFtZSIsInBhZ2luYXRpb25DbGFzc05hbWUiLCJwYWdlU2l6ZSIsIm1pblJvd3MiLCJjb2x1bW4iLCJzb3J0YWJsZSIsInNob3ciLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0IiwidGFibGVDb21wb25lbnQiLCJ0aGVhZENvbXBvbmVudCIsInRib2R5Q29tcG9uZW50IiwidHJDb21wb25lbnQiLCJ0aENvbXBvbmVudCIsInRkQ29tcG9uZW50IiwicHJldmlvdXNDb21wb25lbnQiLCJuZXh0Q29tcG9uZW50IiwiZGF0YSIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0SW5pdGlhbFN0YXRlIiwic29ydGluZyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJyZXNldFN0YXRlIiwibG9hZGluZyIsInBhZ2UiLCJwYWdlcyIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImlzQXN5bmMiLCJidWlsZENvbHVtbnMiLCJidWlsZERhdGEiLCJoYXNIZWFkZXJHcm91cHMiLCJjb2x1bW5zIiwiZm9yRWFjaCIsImhlYWRlckdyb3VwcyIsImRlY29yYXRlZENvbHVtbnMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsInB1c2giLCJtYWtlRGVjb3JhdGVkQ29sdW1uIiwiZGNvbCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJpIiwibmVzdGVkQ29sdW1uIiwibGVuZ3RoIiwiZ2V0SW5pdFNvcnRpbmciLCJpbml0U29ydGluZyIsImZpbHRlciIsImQiLCJzb3J0IiwibWFwIiwiYXNjIiwic2V0RGF0YSIsImNiIiwicmVzIiwiUHJvbWlzZSIsInJlamVjdCIsImFjY2Vzc2VkRGF0YSIsImFjY2Vzc0RhdGEiLCJyb3dzIiwiZGF0YVJlcyIsInRoZW4iLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJfX29yaWdpbmFsIiwiX19pbmRleCIsInJlc29sdmVkU29ydGluZyIsIkluZmluaXR5IiwidG9Mb3dlckNhc2UiLCJzZXRQYWdlIiwicmVuZGVyIiwicGFnZXNMZW5ndGgiLCJNYXRoIiwiY2VpbCIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsInBhZFJvd3MiLCJtYXgiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJUYWJsZUNvbXBvbmVudCIsIlRoZWFkQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJpbm5lckNsYXNzTmFtZSIsImhlYWRlciIsImZpbmQiLCJlIiwic29ydENvbHVtbiIsInNoaWZ0S2V5Iiwid2lkdGgiLCJtaW5XaWR0aCIsImkyIiwiQ2VsbCIsImhpZGRlbiIsInByZXZpb3VzUGFnZSIsIm5leHRQYWdlIiwiYWRkaXRpdmUiLCJleGlzdGluZ1NvcnRpbmciLCJleGlzdGluZ0luZGV4IiwiZmluZEluZGV4IiwiZXhpc3RpbmciLCJzcGxpY2UiLCJwcmV2ZW50RGVmYXVsdCIsImEiLCJiIiwibyIsInIiLCJpc0FycmF5Iiwiam9pbiIsInJlcGxhY2UiLCJzcGxpdCIsInJlZHVjZSIsIm9iaiIsInByb3BlcnR5IiwiYXJyIiwibiIsInN0YXJ0IiwiZnVuY3MiLCJkaXJzIiwiY29tcCIsImNhIiwiZGVzYyIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsInZhbHVlIiwidG9TdHJpbmciLCJBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFDQTtBQUNBLElBQU1BLElBQUk7QUFDUkMsVUFEUTtBQUVSQyxzQkFGUTtBQUdSQyxZQUhRO0FBSVJDLGtCQUpRO0FBS1JDLGNBTFE7QUFNUkMsY0FOUTtBQU9SQztBQVBRLENBQVY7O0FBVUEsSUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxLQUFEO0FBQUEsU0FDcEI7QUFBQTtBQUFBLGlCQUFZQSxLQUFaLElBQW1CLFdBQVUsTUFBN0I7QUFBcUNBLFVBQU1DO0FBQTNDLEdBRG9CO0FBQUEsQ0FBdEI7O0FBSU8sSUFBTUMsa0RBQXFCO0FBQ2hDO0FBQ0FDLGFBQVcscUJBRnFCO0FBR2hDQyxrQkFBZ0IsRUFIZ0I7QUFJaENDLGtCQUFnQixFQUpnQjtBQUtoQ0Msa0JBQWdCLEVBTGdCO0FBTWhDQyxlQUFhLEVBTm1CO0FBT2hDQyx1QkFBcUIsRUFQVztBQVFoQztBQUNBQyxZQUFVLEVBVHNCO0FBVWhDQyxXQUFTLENBVnVCO0FBV2hDO0FBQ0FDLFVBQVE7QUFDTkMsY0FBVSxJQURKO0FBRU5DLFVBQU07QUFGQSxHQVp3QjtBQWdCaEM7QUFDQUMsZ0JBQWMsVUFqQmtCO0FBa0JoQ0MsWUFBVSxNQWxCc0I7QUFtQmhDQyxlQUFhLFlBbkJtQjtBQW9CaEM7QUFDQUMsa0JBQWdCLHdCQUFDakIsS0FBRDtBQUFBLFdBQVc7QUFBQTtBQUFXQSxXQUFYO0FBQW1CQSxZQUFNQztBQUF6QixLQUFYO0FBQUEsR0FyQmdCO0FBc0JoQ2lCLGtCQUFnQix3QkFBQ2xCLEtBQUQ7QUFBQSxXQUFXO0FBQUE7QUFBV0EsV0FBWDtBQUFtQkEsWUFBTUM7QUFBekIsS0FBWDtBQUFBLEdBdEJnQjtBQXVCaENrQixrQkFBZ0Isd0JBQUNuQixLQUFEO0FBQUEsV0FBVztB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LENBQUwsTUFBWSxLQUFaLElBQXFCbUYsS0FBS25GLENBQUwsTUFBWSxNQUE5QztBQUNBLFVBQUlxRixLQUFLMUUsRUFBVCxFQUFhO0FBQ1gsZUFBTzJFLE9BQU8sQ0FBQyxDQUFSLEdBQVksQ0FBbkI7QUFDRDtBQUNELFVBQUlELEtBQUsxRSxFQUFULEVBQWE7QUFDWCxlQUFPMkUsT0FBTyxDQUFQLEdBQVcsQ0FBQyxDQUFuQjtBQUNEO0FBQ0Y7QUFDRCxXQUFPLENBQVA7QUFDRCxHQWRNLENBQVA7QUFlRDs7QUFFRCxTQUFTekosS0FBVCxDQUFnQnVJLENBQWhCLEVBQW1CO0FBQ2pCLFNBQU9tQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZXJCLENBQWYsRUFBa0IsVUFBVXNCLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUN4RCxRQUFJLE9BQU9BLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBT0EsTUFBTUMsUUFBTixFQUFQO0FBQ0Q7QUFDRCxXQUFPRCxLQUFQO0FBQ0QsR0FMaUIsQ0FBWCxDQUFQO0FBTUQ7O0FBRUQ7QUFDQTtBQUNBOztBQUVBLFNBQVNuQixPQUFULENBQWtCSixDQUFsQixFQUFxQjtBQUNuQixTQUFPeUIsTUFBTXJCLE9BQU4sQ0FBY0osQ0FBZCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuLy9cbmNvbnN0IF8gPSB7XG4gIGdldCxcbiAgdGFrZVJpZ2h0LFxuICBsYXN0LFxuICBvcmRlckJ5LFxuICByYW5nZSxcbiAgY2xvbmUsXG4gIHJlbW92ZVxufVxuXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gKHByb3BzKSA9PiAoXG4gIDxidXR0b24gey4uLnByb3BzfSBjbGFzc05hbWU9Jy1idG4nPntwcm9wcy5jaGlsZHJlbn08L2J1dHRvbj5cbilcblxuZXhwb3J0IGNvbnN0IFJlYWN0VGFibGVEZWZhdWx0cyA9IHtcbiAgLy8gQ2xhc3Nlc1xuICBjbGFzc05hbWU6ICctc3RyaXBlZCAtaGlnaGxpZ2h0JyxcbiAgdGFibGVDbGFzc05hbWU6ICcnLFxuICB0aGVhZENsYXNzTmFtZTogJycsXG4gIHRib2R5Q2xhc3NOYW1lOiAnJyxcbiAgdHJDbGFzc05hbWU6ICcnLFxuICBwYWdpbmF0aW9uQ2xhc3NOYW1lOiAnJyxcbiAgLy9cbiAgcGFnZVNpemU6IDIwLFxuICBtaW5Sb3dzOiAwLFxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXG4gIGNvbHVtbjoge1xuICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfSxcbiAgLy8gVGV4dFxuICBwcmV2aW91c1RleHQ6ICdQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCcsXG4gIGxvYWRpbmdUZXh0OiAnTG9hZGluZy4uLicsXG4gIC8vIENvbXBvbmVudHNcbiAgdGFibGVDb21wb25lbnQ6IChwcm9wcykgPT4gPHRhYmxlIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGFibGU+LFxuICB0aGVhZENvbXBvbmVudDogKHByb3BzKSA9PiA8dGhlYWQgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aGVhZD4sXG4gIHRib2R5Q29tcG9uZW50OiAocHJvcHMpID0+IDx0Ym9keSB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3Rib2R5PixcbiAgdHJDb21wb25lbnQ6IChwcm9wcykgPT4gPHRyIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdHI+LFxuICB0aENvbXBvbmVudDogKHByb3BzKSA9PiA8dGggey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aD4sXG4gIHRkQ29tcG9uZW50OiAocHJvcHMpID0+IDx0ZCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RkPixcbiAgcHJldmlvdXNDb21wb25lbnQ6IG51bGwsXG4gIG5leHRDb21wb25lbnQ6IG51bGwsXG4gIC8vIFVubGlzdGVkXG4gIGRhdGE6IFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0RGVmYXVsdFByb3BzICgpIHtcbiAgICByZXR1cm4gUmVhY3RUYWJsZURlZmF1bHRzXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvcnRpbmc6IGZhbHNlXG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMudXBkYXRlKHRoaXMucHJvcHMpXG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIHRoaXMudXBkYXRlKG5leHRQcm9wcylcbiAgfSxcbiAgdXBkYXRlIChwcm9wcykge1xuICAgIGNvbnN0IHJlc2V0U3RhdGUgPSB7XG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIHBhZ2U6IDAsXG4gICAgICBwYWdlczogLTFcbiAgICAgIC8vIGNvbHVtbnM6IHt9ICBmb3IgY29sdW1uIGhpZGluZyBpbiB0aGUgZnV0dXJlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUocmVzZXRTdGF0ZSlcbiAgICBjb25zdCBuZXdTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHJlc2V0U3RhdGUpXG4gICAgdGhpcy5pc0FzeW5jID0gdHlwZW9mIHByb3BzLmRhdGEgPT09ICdmdW5jdGlvbidcbiAgICB0aGlzLmJ1aWxkQ29sdW1ucyhwcm9wcywgbmV3U3RhdGUpXG4gICAgdGhpcy5idWlsZERhdGEocHJvcHMsIG5ld1N0YXRlKVxuICB9LFxuICBidWlsZENvbHVtbnMgKHByb3BzKSB7XG4gICAgdGhpcy5oYXNIZWFkZXJHcm91cHMgPSBmYWxzZVxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmhlYWRlckdyb3VwcyA9IFtdXG4gICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zID0gW11cbiAgICBsZXQgY3VycmVudFNwYW4gPSBbXVxuXG4gICAgY29uc3QgYWRkSGVhZGVyID0gKGNvbHVtbnMsIGNvbHVtbiA9IHt9KSA9PiB7XG4gICAgICB0aGlzLmhlYWRlckdyb3Vwcy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGNvbHVtbiwge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9KSlcbiAgICAgIGN1cnJlbnRTcGFuID0gW11cbiAgICB9XG4gICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4pID0+IHtcbiAgICAgIGNvbnN0IGRjb2wgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmNvbHVtbiwgY29sdW1uKVxuXG4gICAgICBpZiAodHlwZW9mIGRjb2wuYWNjZXNzb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRjb2wuaWQgPSBkY29sLmlkIHx8IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXG4gICAgICAgIGRjb2wuYWNjZXNzb3IgPSByb3cgPT4gXy5nZXQocm93LCBhY2Nlc3NvclN0cmluZylcbiAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgIH1cblxuICAgICAgaWYgKGRjb2wuYWNjZXNzb3IgJiYgIWRjb2wuaWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGRjb2wpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQSBjb2x1bW4gaWQgaXMgcmVxdWlyZWQgaWYgdXNpbmcgYSBub24tc3RyaW5nIGFjY2Vzc29yIGZvciBjb2x1bW4gYWJvdmUuJylcbiAgICAgIH1cblxuICAgICAgZGNvbC5hY2Nlc3NvciA9IGQgPT4gdW5kZWZpbmVkXG4gICAgICByZXR1cm4gZGNvbFxuICAgIH1cblxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgY29sdW1uLmNvbHVtbnMuZm9yRWFjaChuZXN0ZWRDb2x1bW4gPT4ge1xuICAgICAgICAgIHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5wdXNoKG1ha2VEZWNvcmF0ZWRDb2x1bW4obmVzdGVkQ29sdW1uKSlcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyR3JvdXBzKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkSGVhZGVyKF8udGFrZVJpZ2h0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucywgY29sdW1uLmNvbHVtbnMubGVuZ3RoKSwgY29sdW1uKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMucHVzaChtYWtlRGVjb3JhdGVkQ29sdW1uKGNvbHVtbikpXG4gICAgICAgIGN1cnJlbnRTcGFuLnB1c2goXy5sYXN0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucykpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLmhhc0hlYWRlckdyb3VwcyAmJiBjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgfVxuICB9LFxuICBnZXRJbml0U29ydGluZyAoKSB7XG4gICAgY29uc3QgaW5pdFNvcnRpbmcgPSB0aGlzLmRlY29yYXRlZENvbHVtbnMuZmlsdGVyKGQgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkLnNvcnQgIT09ICd1bmRlZmluZWQnXG4gICAgfSkubWFwKGQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgIGFzYzogZC5zb3J0ID09PSAnYXNjJ1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW5pdFNvcnRpbmcubGVuZ3RoID8gaW5pdFNvcnRpbmcgOiBbe1xuICAgICAgaWQ6IHRoaXMuZGVjb3JhdGVkQ29sdW1uc1swXS5pZCxcbiAgICAgIGFzYzogdHJ1ZVxuICAgIH1dXG4gIH0sXG4gIGJ1aWxkRGF0YSAocHJvcHMsIHN0YXRlKSB7XG4gICAgY29uc3Qgc29ydGluZyA9IHN0YXRlLnNvcnRpbmcgPT09IGZhbHNlID8gdGhpcy5nZXRJbml0U29ydGluZygpIDogc3RhdGUuc29ydGluZ1xuXG4gICAgY29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc29ydGluZyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcGFnZTogc3RhdGUucGFnZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNBc3luYykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNiID0gKHJlcykgPT4ge1xuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnVWggT2ghIE5vdGhpbmcgd2FzIHJldHVybmVkIGluIFJlYWN0VGFibGVcXCdzIGRhdGEgY2FsbGJhY2shJylcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzLnBhZ2VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwYWdlczogcmVzLnBhZ2VzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBPbmx5IGFjY2VzcyB0aGUgZGF0YS4gU29ydGluZyBpcyBkb25lIHNlcnZlciBzaWRlLlxuICAgICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocmVzLnJvd3MpXG4gICAgICAgIHNldERhdGEoYWNjZXNzZWREYXRhKVxuICAgICAgfVxuXG4gICAgICAvLyBGZXRjaCBkYXRhIHdpdGggY3VycmVudCBzdGF0ZVxuICAgICAgY29uc3QgZGF0YVJlcyA9IHByb3BzLmRhdGEoe1xuICAgICAgICBzb3J0aW5nLFxuICAgICAgICBwYWdlOiBzdGF0ZS5wYWdlIHx8IDAsXG4gICAgICAgIHBhZ2VTaXplOiBwcm9wcy5wYWdlU2l6ZSxcbiAgICAgICAgcGFnZXM6IHN0YXRlLnBhZ2VzXG4gICAgICB9LCBjYilcblxuICAgICAgaWYgKGRhdGFSZXMgJiYgZGF0YVJlcy50aGVuKSB7XG4gICAgICAgIGRhdGFSZXMudGhlbihjYilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmV0dXJuIGxvY2FsbHkgYWNjZXNzZWQsIHNvcnRlZCBkYXRhXG4gICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocHJvcHMuZGF0YSlcbiAgICAgIGNvbnN0IHNvcnRlZERhdGEgPSB0aGlzLnNvcnREYXRhKGFjY2Vzc2VkRGF0YSwgc29ydGluZylcbiAgICAgIHNldERhdGEoc29ydGVkRGF0YSlcbiAgICB9XG4gIH0sXG4gIGFjY2Vzc0RhdGEgKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHtcbiAgICAgICAgX19vcmlnaW5hbDogZCxcbiAgICAgICAgX19pbmRleDogaVxuICAgICAgfVxuICAgICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgcm93W2NvbHVtbi5pZF0gPSBjb2x1bW4uYWNjZXNzb3IoZClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcm93XG4gICAgfSlcbiAgfSxcbiAgc29ydERhdGEgKGRhdGEsIHNvcnRpbmcpIHtcbiAgICBjb25zdCByZXNvbHZlZFNvcnRpbmcgPSBzb3J0aW5nLmxlbmd0aCA/IHNvcnRpbmcgOiB0aGlzLmdldEluaXRTb3J0aW5nKClcbiAgICByZXR1cm4gXy5vcmRlckJ5KGRhdGEsIHJlc29sdmVkU29ydGluZy5tYXAoc29ydCA9PiB7XG4gICAgICByZXR1cm4gcm93ID0+IHtcbiAgICAgICAgaWYgKHJvd1tzb3J0LmlkXSA9PT0gbnVsbCB8fCByb3dbc29ydC5pZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiAtSW5maW5pdHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIHJvd1tzb3J0LmlkXSA9PT0gJ3N0cmluZycgPyByb3dbc29ydC5pZF0udG9Mb3dlckNhc2UoKSA6IHJvd1tzb3J0LmlkXVxuICAgICAgfVxuICAgIH0pLCByZXNvbHZlZFNvcnRpbmcubWFwKGQgPT4gZC5hc2MgPyAnYXNjJyA6ICdkZXNjJykpXG4gIH0sXG4gIHNldFBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAodGhpcy5pc0FzeW5jKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZERhdGEodGhpcy5wcm9wcywgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge3BhZ2V9KSlcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYWdlXG4gICAgfSlcbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLnN0YXRlLmRhdGEgPyB0aGlzLnN0YXRlLmRhdGEgOiBbXVxuXG4gICAgY29uc3QgcGFnZXNMZW5ndGggPSB0aGlzLmlzQXN5bmMgPyB0aGlzLnN0YXRlLnBhZ2VzIDogTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gdGhpcy5wcm9wcy5wYWdlU2l6ZSlcbiAgICBjb25zdCBzdGFydFJvdyA9IHRoaXMucHJvcHMucGFnZVNpemUgKiB0aGlzLnN0YXRlLnBhZ2VcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHRoaXMucHJvcHMucGFnZVNpemVcbiAgICBjb25zdCBwYWdlUm93cyA9IHRoaXMuaXNBc3luYyA/IGRhdGEuc2xpY2UoMCwgdGhpcy5wcm9wcy5wYWdlU2l6ZSkgOiBkYXRhLnNsaWNlKHN0YXJ0Um93LCBlbmRSb3cpXG4gICAgY29uc3QgcGFkUm93cyA9IHBhZ2VzTGVuZ3RoID4gMSA/IF8ucmFuZ2UodGhpcy5wcm9wcy5wYWdlU2l6ZSAtIHBhZ2VSb3dzLmxlbmd0aClcbiAgICAgIDogdGhpcy5wcm9wcy5taW5Sb3dzID8gXy5yYW5nZShNYXRoLm1heCh0aGlzLnByb3BzLm1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxuICAgICAgOiBbXVxuXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSB0aGlzLnN0YXRlLnBhZ2UgPiAwXG4gICAgY29uc3QgY2FuTmV4dCA9IHRoaXMuc3RhdGUucGFnZSArIDEgPCBwYWdlc0xlbmd0aFxuXG4gICAgY29uc3QgVGFibGVDb21wb25lbnQgPSB0aGlzLnByb3BzLnRhYmxlQ29tcG9uZW50XG4gICAgY29uc3QgVGhlYWRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoZWFkQ29tcG9uZW50XG4gICAgY29uc3QgVGJvZHlDb21wb25lbnQgPSB0aGlzLnByb3BzLnRib2R5Q29tcG9uZW50XG4gICAgY29uc3QgVHJDb21wb25lbnQgPSB0aGlzLnByb3BzLnRyQ29tcG9uZW50XG4gICAgY29uc3QgVGhDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoQ29tcG9uZW50XG4gICAgY29uc3QgVGRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRkQ29tcG9uZW50XG5cbiAgICBjb25zdCBQcmV2aW91c0NvbXBvbmVudCA9IHRoaXMucHJvcHMucHJldmlvdXNDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuICAgIGNvbnN0IE5leHRDb21wb25lbnQgPSB0aGlzLnByb3BzLm5leHRDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCAnUmVhY3RUYWJsZScpfT5cbiAgICAgICAgPFRhYmxlQ29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRhYmxlQ2xhc3NOYW1lKX0+XG4gICAgICAgICAge3RoaXMuaGFzSGVhZGVyR3JvdXBzICYmIChcbiAgICAgICAgICAgIDxUaGVhZENvbXBvbmVudCBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50aGVhZENsYXNzTmFtZSwgJy1oZWFkZXJHcm91cHMnKX0+XG4gICAgICAgICAgICAgIDxUckNvbXBvbmVudCBjbGFzc05hbWU9e3RoaXMucHJvcHMudHJDbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHt0aGlzLmhlYWRlckdyb3Vwcy5tYXAoKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgPFRoQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uY2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICAgICAgICBjb2xTcGFuPXtjb2x1bW4uY29sdW1ucy5sZW5ndGh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uaW5uZXJDbGFzc05hbWUsICctdGgtaW5uZXInKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2x1bW4uaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IGNvbHVtbi5oZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvVGhDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFRoZWFkQ29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRoZWFkQ2xhc3NOYW1lKX0+XG4gICAgICAgICAgICA8VHJDb21wb25lbnQgY2xhc3NOYW1lPXt0aGlzLnByb3BzLnRyQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAge3RoaXMuZGVjb3JhdGVkQ29sdW1ucy5tYXAoKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvcnQgPSB0aGlzLnN0YXRlLnNvcnRpbmcuZmluZChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHNvcnQgPyAoc29ydC5hc2MgPyAnLXNvcnQtYXNjJyA6ICctc29ydC1kZXNjJykgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnLWN1cnNvci1wb2ludGVyJzogY29sdW1uLnNvcnRhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy1oaWRkZW4nOiAhc2hvd1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc29ydGFibGUgJiYgdGhpcy5zb3J0Q29sdW1uKGNvbHVtbiwgZS5zaGlmdEtleSlcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRoLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb2x1bW4ud2lkdGggKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sdW1uLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXt0aGlzLnByb3BzLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApIDogY29sdW1uLmhlYWRlcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRib2R5Q2xhc3NOYW1lKX0+XG4gICAgICAgICAgICB7cGFnZVJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRyQ2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICAgIGtleT17aX0+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBDZWxsID0gY29sdW1uLnJlbmRlclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmNsYXNzTmFtZSwge2hpZGRlbjogIXNob3d9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aTJ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRkLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbHVtbi53aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2YgQ2VsbCA9PT0gJ2Z1bmN0aW9uJyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Jvd1tjb2x1bW4uaWRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93PXtyb3cuX19vcmlnaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtyb3cuX19pbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdJbmRleD17aX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiB0eXBlb2YgQ2VsbCAhPT0gJ3VuZGVmaW5lZCcgPyBDZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogcm93W2NvbHVtbi5pZF19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIHtwYWRSb3dzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50ckNsYXNzTmFtZSwgJy1wYWRSb3cnKX1cbiAgICAgICAgICAgICAgICAgIGtleT17aX0+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmNsYXNzTmFtZSwge2hpZGRlbjogIXNob3d9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aTJ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRkLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbHVtbi53aWR0aCArICdweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+Jm5ic3A7PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9UZENvbXBvbmVudD5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9UYm9keUNvbXBvbmVudD5cbiAgICAgICAgPC9UYWJsZUNvbXBvbmVudD5cbiAgICAgICAge3BhZ2VzTGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy5wYWdpbmF0aW9uQ2xhc3NOYW1lLCAnLXBhZ2luYXRpb24nKX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWxlZnQnPlxuICAgICAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtjYW5QcmV2aW91cyAmJiAoKGUpID0+IHRoaXMucHJldmlvdXNQYWdlKGUpKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5wcmV2aW91c1RleHR9XG4gICAgICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctY2VudGVyJz5cbiAgICAgICAgICAgICAgUGFnZSB7dGhpcy5zdGF0ZS5wYWdlICsgMX0gb2Yge3BhZ2VzTGVuZ3RofVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLXJpZ2h0Jz5cbiAgICAgICAgICAgICAgPE5leHRDb21wb25lbnRcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtjYW5OZXh0ICYmICgoZSkgPT4gdGhpcy5uZXh0UGFnZShlKSl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5OZXh0fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cbiAgICAgICAgICAgICAgPC9OZXh0Q29tcG9uZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctbG9hZGluZycsIHsnLWFjdGl2ZSc6IHRoaXMuc3RhdGUubG9hZGluZ30pfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWxvYWRpbmctaW5uZXInPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubG9hZGluZ1RleHR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxuICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XG4gICAgY29uc3QgZXhpc3RpbmdTb3J0aW5nID0gdGhpcy5zdGF0ZS5zb3J0aW5nIHx8IFtdXG4gICAgbGV0IHNvcnRpbmcgPSBfLmNsb25lKHRoaXMuc3RhdGUuc29ydGluZyB8fCBbXSlcbiAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gc29ydGluZy5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXG4gICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBzb3J0aW5nW2V4aXN0aW5nSW5kZXhdXG4gICAgICBpZiAoZXhpc3RpbmcuYXNjKSB7XG4gICAgICAgIGV4aXN0aW5nLmFzYyA9IGZhbHNlXG4gICAgICAgIGlmICghYWRkaXRpdmUpIHtcbiAgICAgICAgICBzb3J0aW5nID0gW2V4aXN0aW5nXVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICBzb3J0aW5nLnNwbGljZShleGlzdGluZ0luZGV4LCAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXN0aW5nLmFzYyA9IHRydWVcbiAgICAgICAgICBzb3J0aW5nID0gW2V4aXN0aW5nXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICBzb3J0aW5nLnB1c2goe1xuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgYXNjOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3J0aW5nID0gW3tcbiAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgIGFzYzogdHJ1ZVxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwYWdlID0gKGV4aXN0aW5nSW5kZXggPT09IDAgfHwgKCFleGlzdGluZ1NvcnRpbmcubGVuZ3RoICYmIHNvcnRpbmcubGVuZ3RoKSB8fCAhYWRkaXRpdmUpID8gMCA6IHRoaXMuc3RhdGUucGFnZVxuICAgIHRoaXMuYnVpbGREYXRhKHRoaXMucHJvcHMsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtwYWdlLCBzb3J0aW5nfSkpXG4gIH0sXG4gIG5leHRQYWdlIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRQYWdlKHRoaXMuc3RhdGUucGFnZSArIDEpXG4gIH0sXG4gIHByZXZpb3VzUGFnZSAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuc2V0UGFnZSh0aGlzLnN0YXRlLnBhZ2UgLSAxKVxuICB9XG59KVxuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vIFV0aWxzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuZnVuY3Rpb24gcmVtb3ZlIChhLCBiKSB7XG4gIHJldHVybiBhLmZpbHRlcihmdW5jdGlvbiAobywgaSkge1xuICAgIHZhciByID0gYihvKVxuICAgIGlmIChyKSB7XG4gICAgICBhLnNwbGljZShpLCAxKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldCAoYSwgYikge1xuICBpZiAoaXNBcnJheShiKSkge1xuICAgIGIgPSBiLmpvaW4oJy4nKVxuICB9XG4gIHJldHVybiBiXG4gICAgLnJlcGxhY2UoJ1snLCAnLicpLnJlcGxhY2UoJ10nLCAnJylcbiAgICAuc3BsaXQoJy4nKVxuICAgIC5yZWR1Y2UoXG4gICAgICBmdW5jdGlvbiAob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gb2JqW3Byb3BlcnR5XVxuICAgICAgfSwgYVxuICAgIClcbn1cblxuZnVuY3Rpb24gdGFrZVJpZ2h0IChhcnIsIG4pIHtcbiAgY29uc3Qgc3RhcnQgPSBuID4gYXJyLmxlbmd0aCA/IDAgOiBhcnIubGVuZ3RoIC0gblxuICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0KVxufVxuXG5mdW5jdGlvbiBsYXN0IChhcnIpIHtcbiAgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV1cbn1cblxuZnVuY3Rpb24gcmFuZ2UgKG4pIHtcbiAgY29uc3QgYXJyID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICBhcnIucHVzaChuKVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gb3JkZXJCeSAoYXJyLCBmdW5jcywgZGlycykge1xuICByZXR1cm4gYXJyLnNvcnQoKGEsIGIpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZ1bmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb21wID0gZnVuY3NbaV1cbiAgICAgIGNvbnN0IGNhID0gY29tcChhKVxuICAgICAgY29uc3QgY2IgPSBjb21wKGIpXG4gICAgICBjb25zdCBkZXNjID0gZGlyc1tpXSA9PT0gZmFsc2UgfHwgZGlyc1tpXSA9PT0gJ2Rlc2MnXG4gICAgICBpZiAoY2EgPiBjYikge1xuICAgICAgICByZXR1cm4gZGVzYyA/IC0xIDogMVxuICAgICAgfVxuICAgICAgaWYgKGNhIDwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MgPyAxIDogLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2xvbmUgKGEpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfSkpXG59XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gSGVscGVyc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGEpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSlcbn1cbiJdfQ==