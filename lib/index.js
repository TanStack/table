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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJfIiwiZ2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsImNsb25lIiwicmVtb3ZlIiwiZGVmYXVsdEJ1dHRvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJSZWFjdFRhYmxlRGVmYXVsdHMiLCJjbGFzc05hbWUiLCJ0YWJsZUNsYXNzTmFtZSIsInRoZWFkQ2xhc3NOYW1lIiwidGJvZHlDbGFzc05hbWUiLCJ0ckNsYXNzTmFtZSIsInBhZ2luYXRpb25DbGFzc05hbWUiLCJwYWdlU2l6ZSIsIm1pblJvd3MiLCJjb2x1bW4iLCJzb3J0YWJsZSIsInNob3ciLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0IiwidGFibGVDb21wb25lbnQiLCJ0aGVhZENvbXBvbmVudCIsInRib2R5Q29tcG9uZW50IiwidHJDb21wb25lbnQiLCJ0aENvbXBvbmVudCIsInRkQ29tcG9uZW50IiwicHJldmlvdXNDb21wb25lbnQiLCJuZXh0Q29tcG9uZW50IiwiZGF0YSIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0SW5pdGlhbFN0YXRlIiwic29ydGluZyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJyZXNldFN0YXRlIiwibG9hZGluZyIsInBhZ2UiLCJwYWdlcyIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImlzQXN5bmMiLCJidWlsZENvbHVtbnMiLCJidWlsZERhdGEiLCJoYXNIZWFkZXJHcm91cHMiLCJjb2x1bW5zIiwiZm9yRWFjaCIsImhlYWRlckdyb3VwcyIsImRlY29yYXRlZENvbHVtbnMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsInB1c2giLCJtYWtlRGVjb3JhdGVkQ29sdW1uIiwiZGNvbCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiaSIsIm5lc3RlZENvbHVtbiIsImxlbmd0aCIsImdldEluaXRTb3J0aW5nIiwiaW5pdFNvcnRpbmciLCJmaWx0ZXIiLCJkIiwic29ydCIsIm1hcCIsImFzYyIsInNldERhdGEiLCJjYiIsInJlcyIsIlByb21pc2UiLCJyZWplY3QiLCJhY2Nlc3NlZERhdGEiLCJhY2Nlc3NEYXRhIiwicm93cyIsImRhdGFSZXMiLCJ0aGVuIiwic29ydGVkRGF0YSIsInNvcnREYXRhIiwiX19vcmlnaW5hbCIsIl9faW5kZXgiLCJyZXNvbHZlZFNvcnRpbmciLCJ1bmRlZmluZWQiLCJJbmZpbml0eSIsInRvTG93ZXJDYXNlIiwic2V0UGFnZSIsInJlbmRlciIsInBhZ2VzTGVuZ3RoIiwiTWF0aCIsImNlaWwiLCJzdGFydFJvdyIsImVuZFJvdyIsInBhZ2VSb3dzIiwic2xpY2UiLCJwYWRSb3dzIiwibWF4IiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0IiwiVGFibGVDb21wb25lbnQiLCJUaGVhZENvbXBvbmVudCIsIlRib2R5Q29tcG9uZW50IiwiVHJDb21wb25lbnQiLCJUaENvbXBvbmVudCIsIlRkQ29tcG9uZW50IiwiUHJldmlvdXNDb21wb25lbnQiLCJOZXh0Q29tcG9uZW50IiwiaW5uZXJDbGFzc05hbWUiLCJoZWFkZXIiLCJmaW5kIiwiZSIsInNvcnRDb2x1bW4iLCJzaGlmdEtleSIsIndpZHRoIiwibWluV2lkdGgiLCJpMiIsIkNlbGwiLCJoaWRkZW4iLCJwcmV2aW91c1BhZ2UiLCJuZXh0UGFnZSIsImFkZGl0aXZlIiwiZXhpc3RpbmdTb3J0aW5nIiwiZXhpc3RpbmdJbmRleCIsImZpbmRJbmRleCIsImV4aXN0aW5nIiwic3BsaWNlIiwicHJldmVudERlZmF1bHQiLCJhIiwiYiIsIm8iLCJyIiwiaXNBcnJheSIsImpvaW4iLCJyZXBsYWNlIiwic3BsaXQiLCJyZWR1Y2UiLCJvYmoiLCJwcm9wZXJ0eSIsImFyciIsIm4iLCJzdGFydCIsImZ1bmNzIiwiZGlycyIsImNvbXAiLCJjYSIsImRlc2MiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJrZXkiLCJ2YWx1ZSIsInRvU3RyaW5nIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUNBO0FBQ0EsSUFBTUEsSUFBSTtBQUNSQyxVQURRO0FBRVJDLHNCQUZRO0FBR1JDLFlBSFE7QUFJUkMsa0JBSlE7QUFLUkMsY0FMUTtBQU1SQyxjQU5RO0FBT1JDO0FBUFEsQ0FBVjs7QUFVQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLEtBQUQ7QUFBQSxTQUNwQjtBQUFBO0FBQUEsaUJBQVlBLEtBQVosSUFBbUIsV0FBVSxNQUE3QjtBQUFxQ0EsVUFBTUM7QUFBM0MsR0FEb0I7QUFBQSxDQUF0Qjs7QUFJTyxJQUFNQyxrREFBcUI7QUFDaEM7QUFDQUMsYUFBVyxxQkFGcUI7QUFHaENDLGtCQUFnQixFQUhnQjtBQUloQ0Msa0JBQWdCLEVBSmdCO0FBS2hDQyxrQkFBZ0IsRUFMZ0I7QUFNaENDLGVBQWEsRUFObUI7QUFPaENDLHVCQUFxQixFQVBXO0FBUWhDO0FBQ0FDLFlBQVUsRUFUc0I7QUFVaENDLFdBQVMsQ0FWdUI7QUFXaEM7QUFDQUMsVUFBUTtBQUNOQyxjQUFVLElBREo7QUFFTkMsVUFBTTtBQUZBLEdBWndCO0FBZ0JoQztBQUNBQyxnQkFBYyxVQWpCa0I7QUFrQmhDQyxZQUFVLE1BbEJzQjtBQW1CaENDLGVBQWEsWUFuQm1CO0FBb0JoQztBQUNBQyxrQkFBZ0Isd0JBQUNqQixLQUFEO0FBQUEsV0FBVztBQUFBO0FBQVdBLFdBQVg7QUFBbUJBLFlBQU1DO0FBQXpCLEtBQVg7QUFBQSxHQXJCZ0I7QUFzQmhDaUIsa0JBQWdCLHdCQUFDbEIsS0FBRDtBQUFBLFdBQVc7QUFBQTtBQUFXQSxXQUFYO0FBQW1CQSxZQUFNQztBQUF6QixLQUFYO0FBQUEsR0F0QmdCO0FBdUJoQ2tCLGtCQUFnQix3QkFBQ25CLEtBQUQ7QUFBQSxXQUFXO0FBQUE7QUFBV0EsV0FBWDtBQUFtQkEsWUFBTUM7QUFBekIsS0FBWDtBQUFBLEdBdkJnQjtBQXdCaENtQixlQUFhLHFCQUFDcEIsS0FBRDtBQUFBLFdBQVc7QUFBQTtBQUFRQSxXQUFSO0FBQWdCQSxZQUFNQztBQUF0QixLQUFYO0FBQUEsR0F4Qm1CO0FBeUJoQ29CLGVBQWEscUJBQUNyQixLQUFEO0FBQUEsV0FBVztBQUFBO0FBQVFBLFdBQVI7QUFBZ0JBLFlBQU1DO0FBQXRCLEtBQVg7QUFBQSxHQXpCbUI7QUEwQmhDcUIsZUFBYSxxQkFBQ3RCLEtBQUQ7QUFBQSxXQUFXO0FBQUE7QUFBUUEsV0FBUjtBQUFnQkEsWUFBTUM7QUFBdEIsS0FBWDtBQUFBLEdBMUJtQjtBQTJCaENzQixxQkFBbUIsSUEzQmE7QUE0QmhDQyxpQkFBZSxJQTVCaUI7QUE2QmhDO0FBQ0FDLFFBQU07QUE5QjBCLENBQTNCOztrQkFpQ1EsZ0JBQU1DLFdBQU4sQ0FBa0I7QUFBQTtBQUMvQkMsaUJBRCtCLDZCQUNaO0FBQ2pCLFdBQU96QixrQkFBUDtBQUNELEdBSDhCO0FBSS9CMEIsaUJBSitCLDZCQUlaO0FBQ2pCLFdBQU87QUFDTEMsZUFBUztBQURKLEtBQVA7QUFHRCxHQVI4QjtBQVMvQkMsb0JBVCtCLGdDQVNUO0FBQ3BCLFNBQUtDLE1BQUwsQ0FBWSxLQUFLL0IsS0FBakI7QUFDRCxHQVg4QjtBQVkvQmdDLDJCQVorQixxQ0FZSkMsU0FaSSxFQVlPO0FBQ3BDLFNBQUtGLE1BQUwsQ0FBWUUsU0FBWjtBQUNELEdBZDhCO0FBZS9CRixRQWYrQixrQkFldkIvQixLQWZ1QixFQWVoQjtBQUNiLFFBQU1rQyxhQUFhO0FBQ2pCQyxlQUFTLEtBRFE7QUFFakJDLFlBQU0sQ0FGVztBQUdqQkMsYUFBTyxDQUFDO0FBQ1I7QUFKaUIsS0FBbkI7QUFNQSxTQUFLQyxRQUFMLENBQWNKLFVBQWQ7QUFDQSxRQUFNSyxXQUFXQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLQyxLQUF2QixFQUE4QlIsVUFBOUIsQ0FBakI7QUFDQSxTQUFLUyxPQUFMLEdBQWUsT0FBTzNDLE1BQU15QixJQUFiLEtBQXNCLFVBQXJDO0FBQ0EsU0FBS21CLFlBQUwsQ0FBa0I1QyxLQUFsQixFQUF5QnVDLFFBQXpCO0FBQ0EsU0FBS00sU0FBTCxDQUFlN0MsS0FBZixFQUFzQnVDLFFBQXRCO0FBQ0QsR0EzQjhCO0FBNEIvQkssY0E1QitCLHdCQTRCakI1QyxLQTVCaUIsRUE0QlY7QUFBQTs7QUFDbkIsU0FBSzhDLGVBQUwsR0FBdUIsS0FBdkI7QUFDQTlDLFVBQU0rQyxPQUFOLENBQWNDLE9BQWQsQ0FBc0Isa0JBQVU7QUFDOUIsVUFBSXJDLE9BQU9vQyxPQUFYLEVBQW9CO0FBQ2xCLGNBQUtELGVBQUwsR0FBdUIsSUFBdkI7QUFDRDtBQUNGLEtBSkQ7O0FBTUEsU0FBS0csWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0EsUUFBSUMsY0FBYyxFQUFsQjs7QUFFQSxRQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0wsT0FBRCxFQUEwQjtBQUFBLFVBQWhCcEMsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDMUMsWUFBS3NDLFlBQUwsQ0FBa0JJLElBQWxCLENBQXVCYixPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQjlCLE1BQWxCLEVBQTBCO0FBQy9Db0MsaUJBQVNBO0FBRHNDLE9BQTFCLENBQXZCO0FBR0FJLG9CQUFjLEVBQWQ7QUFDRCxLQUxEO0FBTUEsUUFBTUcsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQzNDLE1BQUQsRUFBWTtBQUN0QyxVQUFNNEMsT0FBT2YsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsTUFBS3pDLEtBQUwsQ0FBV1csTUFBN0IsRUFBcUNBLE1BQXJDLENBQWI7QUFDQSxVQUFJLE9BQU80QyxLQUFLQyxRQUFaLEtBQXlCLFFBQTdCLEVBQXVDO0FBQUE7QUFDckNELGVBQUtFLEVBQUwsR0FBVUYsS0FBS0UsRUFBTCxJQUFXRixLQUFLQyxRQUExQjtBQUNBLGNBQU1FLGlCQUFpQkgsS0FBS0MsUUFBNUI7QUFDQUQsZUFBS0MsUUFBTCxHQUFnQjtBQUFBLG1CQUFPakUsRUFBRUMsR0FBRixDQUFNbUUsR0FBTixFQUFXRCxjQUFYLENBQVA7QUFBQSxXQUFoQjtBQUhxQztBQUl0QztBQUNELFVBQUksQ0FBQ0gsS0FBS0UsRUFBVixFQUFjO0FBQ1pHLGdCQUFRQyxJQUFSLENBQWEsaUNBQWIsRUFBZ0ROLElBQWhEO0FBQ0Q7QUFDRCxVQUFJLENBQUNBLEtBQUtDLFFBQVYsRUFBb0I7QUFDbEJJLGdCQUFRQyxJQUFSLENBQWEsdUNBQWIsRUFBc0ROLElBQXREO0FBQ0Q7QUFDRCxhQUFPQSxJQUFQO0FBQ0QsS0FkRDs7QUFnQkF2RCxVQUFNK0MsT0FBTixDQUFjQyxPQUFkLENBQXNCLFVBQUNyQyxNQUFELEVBQVNtRCxDQUFULEVBQWU7QUFDbkMsVUFBSW5ELE9BQU9vQyxPQUFYLEVBQW9CO0FBQ2xCcEMsZUFBT29DLE9BQVAsQ0FBZUMsT0FBZixDQUF1Qix3QkFBZ0I7QUFDckMsZ0JBQUtFLGdCQUFMLENBQXNCRyxJQUF0QixDQUEyQkMsb0JBQW9CUyxZQUFwQixDQUEzQjtBQUNELFNBRkQ7QUFHQSxZQUFJLE1BQUtqQixlQUFULEVBQTBCO0FBQ3hCLGNBQUlLLFlBQVlhLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDMUJaLHNCQUFVRCxXQUFWO0FBQ0Q7QUFDREMsb0JBQVU3RCxFQUFFRSxTQUFGLENBQVksTUFBS3lELGdCQUFqQixFQUFtQ3ZDLE9BQU9vQyxPQUFQLENBQWVpQixNQUFsRCxDQUFWLEVBQXFFckQsTUFBckU7QUFDRDtBQUNGLE9BVkQsTUFVTztBQUNMLGNBQUt1QyxnQkFBTCxDQUFzQkcsSUFBdEIsQ0FBMkJDLG9CQUFvQjNDLE1BQXBCLENBQTNCO0FBQ0F3QyxvQkFBWUUsSUFBWixDQUFpQjlELEVBQUVHLElBQUYsQ0FBTyxNQUFLd0QsZ0JBQVosQ0FBakI7QUFDRDtBQUNGLEtBZkQ7O0FBaUJBLFFBQUksS0FBS0osZUFBTCxJQUF3QkssWUFBWWEsTUFBWixHQUFxQixDQUFqRCxFQUFvRDtBQUNsRFosZ0JBQVVELFdBQVY7QUFDRDtBQUNGLEdBbEY4QjtBQW1GL0JjLGdCQW5GK0IsNEJBbUZiO0FBQ2hCLFFBQU1DLGNBQWMsS0FBS2hCLGdCQUFMLENBQXNCaUIsTUFBdEIsQ0FBNkIsYUFBSztBQUNwRCxhQUFPLE9BQU9DLEVBQUVDLElBQVQsS0FBa0IsV0FBekI7QUFDRCxLQUZtQixFQUVqQkMsR0FGaUIsQ0FFYixhQUFLO0FBQ1YsYUFBTztBQUNMYixZQUFJVyxFQUFFWCxFQUREO0FBRUxjLGFBQUtILEVBQUVDLElBQUYsS0FBVztBQUZYLE9BQVA7QUFJRCxLQVBtQixDQUFwQjs7QUFTQSxXQUFPSCxZQUFZRixNQUFaLEdBQXFCRSxXQUFyQixHQUFtQyxDQUFDO0FBQ3pDVCxVQUFJLEtBQUtQLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCTyxFQURZO0FBRXpDYyxXQUFLO0FBRm9DLEtBQUQsQ0FBMUM7QUFJRCxHQWpHOEI7QUFrRy9CMUIsV0FsRytCLHFCQWtHcEI3QyxLQWxHb0IsRUFrR2IwQyxLQWxHYSxFQWtHTjtBQUFBOztBQUN2QixRQUFNYixVQUFVYSxNQUFNYixPQUFOLEtBQWtCLEtBQWxCLEdBQTBCLEtBQUtvQyxjQUFMLEVBQTFCLEdBQWtEdkIsTUFBTWIsT0FBeEU7O0FBRUEsUUFBTTJDLFVBQVUsU0FBVkEsT0FBVSxDQUFDL0MsSUFBRCxFQUFVO0FBQ3hCLGFBQUthLFFBQUwsQ0FBYztBQUNaVCx3QkFEWTtBQUVaSixrQkFGWTtBQUdaVyxjQUFNTSxNQUFNTixJQUhBO0FBSVpELGlCQUFTO0FBSkcsT0FBZDtBQU1ELEtBUEQ7O0FBU0EsUUFBSSxLQUFLUSxPQUFULEVBQWtCO0FBQ2hCLFdBQUtMLFFBQUwsQ0FBYztBQUNaSCxpQkFBUztBQURHLE9BQWQ7O0FBSUEsVUFBTXNDLEtBQUssU0FBTEEsRUFBSyxDQUFDQyxHQUFELEVBQVM7QUFDbEIsWUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDUixpQkFBT0MsUUFBUUMsTUFBUixDQUFlLDZEQUFmLENBQVA7QUFDRDtBQUNELFlBQUlGLElBQUlyQyxLQUFSLEVBQWU7QUFDYixpQkFBS0MsUUFBTCxDQUFjO0FBQ1pELG1CQUFPcUMsSUFBSXJDO0FBREMsV0FBZDtBQUdEO0FBQ0Q7QUFDQSxZQUFNd0MsZUFBZSxPQUFLQyxVQUFMLENBQWdCSixJQUFJSyxJQUFwQixDQUFyQjtBQUNBUCxnQkFBUUssWUFBUjtBQUNELE9BWkQ7O0FBY0E7QUFDQSxVQUFNRyxVQUFVaEYsTUFBTXlCLElBQU4sQ0FBVztBQUN6Qkksd0JBRHlCO0FBRXpCTyxjQUFNTSxNQUFNTixJQUFOLElBQWMsQ0FGSztBQUd6QjNCLGtCQUFVVCxNQUFNUyxRQUhTO0FBSXpCNEIsZUFBT0ssTUFBTUw7QUFKWSxPQUFYLEVBS2JvQyxFQUxhLENBQWhCOztBQU9BLFVBQUlPLFdBQVdBLFFBQVFDLElBQXZCLEVBQTZCO0FBQzNCRCxnQkFBUUMsSUFBUixDQUFhUixFQUFiO0FBQ0Q7QUFDRixLQTlCRCxNQThCTztBQUNMO0FBQ0EsVUFBTUksZUFBZSxLQUFLQyxVQUFMLENBQWdCOUUsTUFBTXlCLElBQXRCLENBQXJCO0FBQ0EsVUFBTXlELGFBQWEsS0FBS0MsUUFBTCxDQUFjTixZQUFkLEVBQTRCaEQsT0FBNUIsQ0FBbkI7QUFDQTJDLGNBQVFVLFVBQVI7QUFDRDtBQUNGLEdBbEo4QjtBQW1KL0JKLFlBbkorQixzQkFtSm5CckQsSUFuSm1CLEVBbUpiO0FBQUE7O0FBQ2hCLFdBQU9BLEtBQUs2QyxHQUFMLENBQVMsVUFBQ0YsQ0FBRCxFQUFJTixDQUFKLEVBQVU7QUFDeEIsVUFBTUgsTUFBTTtBQUNWeUIsb0JBQVloQixDQURGO0FBRVZpQixpQkFBU3ZCO0FBRkMsT0FBWjtBQUlBLGFBQUtaLGdCQUFMLENBQXNCRixPQUF0QixDQUE4QixrQkFBVTtBQUN0Q1csWUFBSWhELE9BQU84QyxFQUFYLElBQWlCOUMsT0FBTzZDLFFBQVAsQ0FBZ0JZLENBQWhCLENBQWpCO0FBQ0QsT0FGRDtBQUdBLGFBQU9ULEdBQVA7QUFDRCxLQVRNLENBQVA7QUFVRCxHQTlKOEI7QUErSi9Cd0IsVUEvSitCLG9CQStKckIxRCxJQS9KcUIsRUErSmZJLE9BL0plLEVBK0pOO0FBQ3ZCLFFBQU15RCxrQkFBa0J6RCxRQUFRbUMsTUFBUixHQUFpQm5DLE9BQWpCLEdBQTJCLEtBQUtvQyxjQUFMLEVBQW5EO0FBQ0EsV0FBTzFFLEVBQUVJLE9BQUYsQ0FBVThCLElBQVYsRUFBZ0I2RCxnQkFBZ0JoQixHQUFoQixDQUFvQixnQkFBUTtBQUNqRCxhQUFPLGVBQU87QUFDWixZQUFJWCxJQUFJVSxLQUFLWixFQUFULE1BQWlCLElBQWpCLElBQXlCRSxJQUFJVSxLQUFLWixFQUFULE1BQWlCOEIsU0FBOUMsRUFBeUQ7QUFDdkQsaUJBQU8sQ0FBQ0MsUUFBUjtBQUNEO0FBQ0QsZUFBTyxPQUFPN0IsSUFBSVUsS0FBS1osRUFBVCxDQUFQLEtBQXdCLFFBQXhCLEdBQW1DRSxJQUFJVSxLQUFLWixFQUFULEVBQWFnQyxXQUFiLEVBQW5DLEdBQWdFOUIsSUFBSVUsS0FBS1osRUFBVCxDQUF2RTtBQUNELE9BTEQ7QUFNRCxLQVBzQixDQUFoQixFQU9INkIsZ0JBQWdCaEIsR0FBaEIsQ0FBb0I7QUFBQSxhQUFLRixFQUFFRyxHQUFGLEdBQVEsS0FBUixHQUFnQixNQUFyQjtBQUFBLEtBQXBCLENBUEcsQ0FBUDtBQVFELEdBeks4QjtBQTBLL0JtQixTQTFLK0IsbUJBMEt0QnRELElBMUtzQixFQTBLaEI7QUFDYixRQUFJLEtBQUtPLE9BQVQsRUFBa0I7QUFDaEIsYUFBTyxLQUFLRSxTQUFMLENBQWUsS0FBSzdDLEtBQXBCLEVBQTJCd0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEIsRUFBQ04sVUFBRCxFQUE5QixDQUEzQixDQUFQO0FBQ0Q7QUFDRCxTQUFLRSxRQUFMLENBQWM7QUFDWkY7QUFEWSxLQUFkO0FBR0QsR0FqTDhCO0FBbUwvQnVELFFBbkwrQixvQkFtTHJCO0FBQUE7O0FBQ1IsUUFBTWxFLE9BQU8sS0FBS2lCLEtBQUwsQ0FBV2pCLElBQVgsR0FBa0IsS0FBS2lCLEtBQUwsQ0FBV2pCLElBQTdCLEdBQW9DLEVBQWpEOztBQUVBLFFBQU1tRSxjQUFjLEtBQUtqRCxPQUFMLEdBQWUsS0FBS0QsS0FBTCxDQUFXTCxLQUExQixHQUFrQ3dELEtBQUtDLElBQUwsQ0FBVXJFLEtBQUt1QyxNQUFMLEdBQWMsS0FBS2hFLEtBQUwsQ0FBV1MsUUFBbkMsQ0FBdEQ7QUFDQSxRQUFNc0YsV0FBVyxLQUFLL0YsS0FBTCxDQUFXUyxRQUFYLEdBQXNCLEtBQUtpQyxLQUFMLENBQVdOLElBQWxEO0FBQ0EsUUFBTTRELFNBQVNELFdBQVcsS0FBSy9GLEtBQUwsQ0FBV1MsUUFBckM7QUFDQSxRQUFNd0YsV0FBVyxLQUFLdEQsT0FBTCxHQUFlbEIsS0FBS3lFLEtBQUwsQ0FBVyxDQUFYLEVBQWMsS0FBS2xHLEtBQUwsQ0FBV1MsUUFBekIsQ0FBZixHQUFvRGdCLEtBQUt5RSxLQUFMLENBQVdILFFBQVgsRUFBcUJDLE1BQXJCLENBQXJFO0FBQ0EsUUFBTUcsVUFBVVAsY0FBYyxDQUFkLEdBQWtCckcsRUFBRUssS0FBRixDQUFRLEtBQUtJLEtBQUwsQ0FBV1MsUUFBWCxHQUFzQndGLFNBQVNqQyxNQUF2QyxDQUFsQixHQUNaLEtBQUtoRSxLQUFMLENBQVdVLE9BQVgsR0FBcUJuQixFQUFFSyxLQUFGLENBQVFpRyxLQUFLTyxHQUFMLENBQVMsS0FBS3BHLEtBQUwsQ0FBV1UsT0FBWCxHQUFxQnVGLFNBQVNqQyxNQUF2QyxFQUErQyxDQUEvQyxDQUFSLENBQXJCLEdBQ0EsRUFGSjs7QUFJQSxRQUFNcUMsY0FBYyxLQUFLM0QsS0FBTCxDQUFXTixJQUFYLEdBQWtCLENBQXRDO0FBQ0EsUUFBTWtFLFVBQVUsS0FBSzVELEtBQUwsQ0FBV04sSUFBWCxHQUFrQixDQUFsQixHQUFzQndELFdBQXRDOztBQUVBLFFBQU1XLGlCQUFpQixLQUFLdkcsS0FBTCxDQUFXaUIsY0FBbEM7QUFDQSxRQUFNdUYsaUJBQWlCLEtBQUt4RyxLQUFMLENBQVdrQixjQUFsQztBQUNBLFFBQU11RixpQkFBaUIsS0FBS3pHLEtBQUwsQ0FBV21CLGNBQWxDO0FBQ0EsUUFBTXVGLGNBQWMsS0FBSzFHLEtBQUwsQ0FBV29CLFdBQS9CO0FBQ0EsUUFBTXVGLGNBQWMsS0FBSzNHLEtBQUwsQ0FBV3FCLFdBQS9CO0FBQ0EsUUFBTXVGLGNBQWMsS0FBSzVHLEtBQUwsQ0FBV3NCLFdBQS9COztBQUVBLFFBQU11RixvQkFBb0IsS0FBSzdHLEtBQUwsQ0FBV3VCLGlCQUFYLElBQWdDeEIsYUFBMUQ7QUFDQSxRQUFNK0csZ0JBQWdCLEtBQUs5RyxLQUFMLENBQVd3QixhQUFYLElBQTRCekIsYUFBbEQ7O0FBRUEsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFXLDBCQUFXLEtBQUtDLEtBQUwsQ0FBV0csU0FBdEIsRUFBaUMsWUFBakMsQ0FBaEI7QUFDRTtBQUFDLHNCQUFEO0FBQUEsVUFBZ0IsV0FBVywwQkFBVyxLQUFLSCxLQUFMLENBQVdJLGNBQXRCLENBQTNCO0FBQ0csYUFBSzBDLGVBQUwsSUFDQztBQUFDLHdCQUFEO0FBQUEsWUFBZ0IsV0FBVywwQkFBVyxLQUFLOUMsS0FBTCxDQUFXSyxjQUF0QixFQUFzQyxlQUF0QyxDQUEzQjtBQUNFO0FBQUMsdUJBQUQ7QUFBQSxjQUFhLFdBQVcsS0FBS0wsS0FBTCxDQUFXTyxXQUFuQztBQUNHLGlCQUFLMEMsWUFBTCxDQUFrQnFCLEdBQWxCLENBQXNCLFVBQUMzRCxNQUFELEVBQVNtRCxDQUFULEVBQWU7QUFDcEMscUJBQ0U7QUFBQywyQkFBRDtBQUFBO0FBQ0UsdUJBQUtBLENBRFA7QUFFRSw2QkFBVywwQkFBV25ELE9BQU9SLFNBQWxCLENBRmI7QUFHRSwyQkFBU1EsT0FBT29DLE9BQVAsQ0FBZWlCLE1BSDFCO0FBSUU7QUFBQTtBQUFBO0FBQ0UsK0JBQVcsMEJBQVdyRCxPQUFPb0csY0FBbEIsRUFBa0MsV0FBbEMsQ0FEYjtBQUVHLHlCQUFPcEcsT0FBT3FHLE1BQWQsS0FBeUIsVUFBekIsR0FDQyw4QkFBQyxNQUFELENBQVEsTUFBUjtBQUNFLDBCQUFNLE9BQUtoSCxLQUFMLENBQVd5QixJQURuQjtBQUVFLDRCQUFRZDtBQUZWLG9CQURELEdBS0dBLE9BQU9xRztBQVBiO0FBSkYsZUFERjtBQWdCRCxhQWpCQTtBQURIO0FBREYsU0FGSjtBQXlCRTtBQUFDLHdCQUFEO0FBQUEsWUFBZ0IsV0FBVywwQkFBVyxLQUFLaEgsS0FBTCxDQUFXSyxjQUF0QixDQUEzQjtBQUNFO0FBQUMsdUJBQUQ7QUFBQSxjQUFhLFdBQVcsS0FBS0wsS0FBTCxDQUFXTyxXQUFuQztBQUNHLGlCQUFLMkMsZ0JBQUwsQ0FBc0JvQixHQUF0QixDQUEwQixVQUFDM0QsTUFBRCxFQUFTbUQsQ0FBVCxFQUFlO0FBQ3hDLGtCQUFNTyxPQUFPLE9BQUszQixLQUFMLENBQVdiLE9BQVgsQ0FBbUJvRixJQUFuQixDQUF3QjtBQUFBLHVCQUFLN0MsRUFBRVgsRUFBRixLQUFTOUMsT0FBTzhDLEVBQXJCO0FBQUEsZUFBeEIsQ0FBYjtBQUNBLGtCQUFNNUMsT0FBTyxPQUFPRixPQUFPRSxJQUFkLEtBQXVCLFVBQXZCLEdBQW9DRixPQUFPRSxJQUFQLEVBQXBDLEdBQW9ERixPQUFPRSxJQUF4RTtBQUNBLHFCQUNFO0FBQUMsMkJBQUQ7QUFBQTtBQUNFLHVCQUFLaUQsQ0FEUDtBQUVFLDZCQUFXLDBCQUNUbkQsT0FBT1IsU0FERSxFQUVUa0UsT0FBUUEsS0FBS0UsR0FBTCxHQUFXLFdBQVgsR0FBeUIsWUFBakMsR0FBaUQsRUFGeEMsRUFHVDtBQUNFLHVDQUFtQjVELE9BQU9DLFFBRDVCO0FBRUUsK0JBQVcsQ0FBQ0M7QUFGZCxtQkFIUyxDQUZiO0FBVUUsMkJBQVMsaUJBQUNxRyxDQUFELEVBQU87QUFDZHZHLDJCQUFPQyxRQUFQLElBQW1CLE9BQUt1RyxVQUFMLENBQWdCeEcsTUFBaEIsRUFBd0J1RyxFQUFFRSxRQUExQixDQUFuQjtBQUNELG1CQVpIO0FBYUU7QUFBQTtBQUFBO0FBQ0UsK0JBQVcsMEJBQVd6RyxPQUFPb0csY0FBbEIsRUFBa0MsV0FBbEMsQ0FEYjtBQUVFLDJCQUFPO0FBQ0xNLDZCQUFPMUcsT0FBTzBHLEtBQVAsR0FBZSxJQURqQjtBQUVMQyxnQ0FBVTNHLE9BQU8yRyxRQUFQLEdBQWtCO0FBRnZCLHFCQUZUO0FBTUcseUJBQU8zRyxPQUFPcUcsTUFBZCxLQUF5QixVQUF6QixHQUNDLDhCQUFDLE1BQUQsQ0FBUSxNQUFSO0FBQ0UsMEJBQU0sT0FBS2hILEtBQUwsQ0FBV3lCLElBRG5CO0FBRUUsNEJBQVFkO0FBRlYsb0JBREQsR0FLR0EsT0FBT3FHO0FBWGI7QUFiRixlQURGO0FBNkJELGFBaENBO0FBREg7QUFERixTQXpCRjtBQThERTtBQUFDLHdCQUFEO0FBQUEsWUFBZ0IsV0FBVywwQkFBVyxLQUFLaEgsS0FBTCxDQUFXTSxjQUF0QixDQUEzQjtBQUNHMkYsbUJBQVMzQixHQUFULENBQWEsVUFBQ1gsR0FBRCxFQUFNRyxDQUFOLEVBQVk7QUFDeEIsbUJBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsMkJBQVcsMEJBQVcsT0FBSzlELEtBQUwsQ0FBV08sV0FBdEIsQ0FEYjtBQUVFLHFCQUFLdUQsQ0FGUDtBQUdHLHFCQUFLWixnQkFBTCxDQUFzQm9CLEdBQXRCLENBQTBCLFVBQUMzRCxNQUFELEVBQVM0RyxFQUFULEVBQWdCO0FBQ3pDLG9CQUFNQyxPQUFPN0csT0FBT2dGLE1BQXBCO0FBQ0Esb0JBQU05RSxPQUFPLE9BQU9GLE9BQU9FLElBQWQsS0FBdUIsVUFBdkIsR0FBb0NGLE9BQU9FLElBQVAsRUFBcEMsR0FBb0RGLE9BQU9FLElBQXhFO0FBQ0EsdUJBQ0U7QUFBQyw2QkFBRDtBQUFBO0FBQ0UsK0JBQVcsMEJBQVdGLE9BQU9SLFNBQWxCLEVBQTZCLEVBQUNzSCxRQUFRLENBQUM1RyxJQUFWLEVBQTdCLENBRGI7QUFFRSx5QkFBSzBHLEVBRlA7QUFHRTtBQUFBO0FBQUE7QUFDRSxpQ0FBVywwQkFBVzVHLE9BQU9vRyxjQUFsQixFQUFrQyxXQUFsQyxDQURiO0FBRUUsNkJBQU87QUFDTE0sK0JBQU8xRyxPQUFPMEcsS0FBUCxHQUFlLElBRGpCO0FBRUxDLGtDQUFVM0csT0FBTzJHLFFBQVAsR0FBa0I7QUFGdkIsdUJBRlQ7QUFNRywyQkFBT0UsSUFBUCxLQUFnQixVQUFoQixHQUNDLDhCQUFDLElBQUQ7QUFDRSw2QkFBTzdELElBQUloRCxPQUFPOEMsRUFBWCxDQURUO0FBRUUsMkJBQUtFLElBQUl5QixVQUZYO0FBR0UsNkJBQU96QixJQUFJMEIsT0FIYjtBQUlFLGlDQUFXdkI7QUFKYixzQkFERCxHQU9LLE9BQU8wRCxJQUFQLEtBQWdCLFdBQWhCLEdBQThCQSxJQUE5QixHQUNKN0QsSUFBSWhELE9BQU84QyxFQUFYO0FBZEo7QUFIRixpQkFERjtBQXNCRCxlQXpCQTtBQUhILGFBREY7QUFnQ0QsV0FqQ0EsQ0FESDtBQW1DRzBDLGtCQUFRN0IsR0FBUixDQUFZLFVBQUNYLEdBQUQsRUFBTUcsQ0FBTixFQUFZO0FBQ3ZCLG1CQUNFO0FBQUMseUJBQUQ7QUFBQTtBQUNFLDJCQUFXLDBCQUFXLE9BQUs5RCxLQUFMLENBQVdPLFdBQXRCLEVBQW1DLFNBQW5DLENBRGI7QUFFRSxxQkFBS3VELENBRlA7QUFHRyxxQkFBS1osZ0JBQUwsQ0FBc0JvQixHQUF0QixDQUEwQixVQUFDM0QsTUFBRCxFQUFTNEcsRUFBVCxFQUFnQjtBQUN6QyxvQkFBTTFHLE9BQU8sT0FBT0YsT0FBT0UsSUFBZCxLQUF1QixVQUF2QixHQUFvQ0YsT0FBT0UsSUFBUCxFQUFwQyxHQUFvREYsT0FBT0UsSUFBeEU7QUFDQSx1QkFDRTtBQUFDLDZCQUFEO0FBQUE7QUFDRSwrQkFBVywwQkFBV0YsT0FBT1IsU0FBbEIsRUFBNkIsRUFBQ3NILFFBQVEsQ0FBQzVHLElBQVYsRUFBN0IsQ0FEYjtBQUVFLHlCQUFLMEcsRUFGUDtBQUdFO0FBQUE7QUFBQTtBQUNFLGlDQUFXLDBCQUFXNUcsT0FBT29HLGNBQWxCLEVBQWtDLFdBQWxDLENBRGI7QUFFRSw2QkFBTztBQUNMTSwrQkFBTzFHLE9BQU8wRyxLQUFQLEdBQWUsSUFEakI7QUFFTEMsa0NBQVUzRyxPQUFPMkcsUUFBUCxHQUFrQjtBQUZ2Qix1QkFGVDtBQUFBO0FBQUE7QUFIRixpQkFERjtBQVlELGVBZEE7QUFISCxhQURGO0FBcUJELFdBdEJBO0FBbkNIO0FBOURGLE9BREY7QUEySEcxQixvQkFBYyxDQUFkLElBQ0M7QUFBQTtBQUFBLFVBQUssV0FBVywwQkFBVyxLQUFLNUYsS0FBTCxDQUFXUSxtQkFBdEIsRUFBMkMsYUFBM0MsQ0FBaEI7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLE9BQWY7QUFDRTtBQUFDLDZCQUFEO0FBQUE7QUFDRSx1QkFBUzZGLGVBQWdCLFVBQUNhLENBQUQ7QUFBQSx1QkFBTyxPQUFLUSxZQUFMLENBQWtCUixDQUFsQixDQUFQO0FBQUEsZUFEM0I7QUFFRSx3QkFBVSxDQUFDYixXQUZiO0FBR0csaUJBQUtyRyxLQUFMLENBQVdjO0FBSGQ7QUFERixTQURGO0FBUUU7QUFBQTtBQUFBLFlBQUssV0FBVSxTQUFmO0FBQUE7QUFDUSxlQUFLNEIsS0FBTCxDQUFXTixJQUFYLEdBQWtCLENBRDFCO0FBQUE7QUFDaUN3RDtBQURqQyxTQVJGO0FBV0U7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsdUJBQVNVLFdBQVksVUFBQ1ksQ0FBRDtBQUFBLHVCQUFPLE9BQUtTLFFBQUwsQ0FBY1QsQ0FBZCxDQUFQO0FBQUEsZUFEdkI7QUFFRSx3QkFBVSxDQUFDWixPQUZiO0FBR0csaUJBQUt0RyxLQUFMLENBQVdlO0FBSGQ7QUFERjtBQVhGLE9BNUhKO0FBZ0pFO0FBQUE7QUFBQSxVQUFLLFdBQVcsMEJBQVcsVUFBWCxFQUF1QixFQUFDLFdBQVcsS0FBSzJCLEtBQUwsQ0FBV1AsT0FBdkIsRUFBdkIsQ0FBaEI7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGdCQUFmO0FBQ0csZUFBS25DLEtBQUwsQ0FBV2dCO0FBRGQ7QUFERjtBQWhKRixLQURGO0FBd0pELEdBblc4QjtBQW9XL0JtRyxZQXBXK0Isc0JBb1duQnhHLE1BcFdtQixFQW9XWGlILFFBcFdXLEVBb1dEO0FBQzVCLFFBQU1DLGtCQUFrQixLQUFLbkYsS0FBTCxDQUFXYixPQUFYLElBQXNCLEVBQTlDO0FBQ0EsUUFBSUEsVUFBVXRDLEVBQUVNLEtBQUYsQ0FBUSxLQUFLNkMsS0FBTCxDQUFXYixPQUFYLElBQXNCLEVBQTlCLENBQWQ7QUFDQSxRQUFNaUcsZ0JBQWdCakcsUUFBUWtHLFNBQVIsQ0FBa0I7QUFBQSxhQUFLM0QsRUFBRVgsRUFBRixLQUFTOUMsT0FBTzhDLEVBQXJCO0FBQUEsS0FBbEIsQ0FBdEI7QUFDQSxRQUFJcUUsZ0JBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDdEIsVUFBTUUsV0FBV25HLFFBQVFpRyxhQUFSLENBQWpCO0FBQ0EsVUFBSUUsU0FBU3pELEdBQWIsRUFBa0I7QUFDaEJ5RCxpQkFBU3pELEdBQVQsR0FBZSxLQUFmO0FBQ0EsWUFBSSxDQUFDcUQsUUFBTCxFQUFlO0FBQ2IvRixvQkFBVSxDQUFDbUcsUUFBRCxDQUFWO0FBQ0Q7QUFDRixPQUxELE1BS087QUFDTCxZQUFJSixRQUFKLEVBQWM7QUFDWi9GLGtCQUFRb0csTUFBUixDQUFlSCxhQUFmLEVBQThCLENBQTlCO0FBQ0QsU0FGRCxNQUVPO0FBQ0xFLG1CQUFTekQsR0FBVCxHQUFlLElBQWY7QUFDQTFDLG9CQUFVLENBQUNtRyxRQUFELENBQVY7QUFDRDtBQUNGO0FBQ0YsS0FmRCxNQWVPO0FBQ0wsVUFBSUosUUFBSixFQUFjO0FBQ1ovRixnQkFBUXdCLElBQVIsQ0FBYTtBQUNYSSxjQUFJOUMsT0FBTzhDLEVBREE7QUFFWGMsZUFBSztBQUZNLFNBQWI7QUFJRCxPQUxELE1BS087QUFDTDFDLGtCQUFVLENBQUM7QUFDVDRCLGNBQUk5QyxPQUFPOEMsRUFERjtBQUVUYyxlQUFLO0FBRkksU0FBRCxDQUFWO0FBSUQ7QUFDRjtBQUNELFFBQU1uQyxPQUFRMEYsa0JBQWtCLENBQWxCLElBQXdCLENBQUNELGdCQUFnQjdELE1BQWpCLElBQTJCbkMsUUFBUW1DLE1BQTNELElBQXNFLENBQUM0RCxRQUF4RSxHQUFvRixDQUFwRixHQUF3RixLQUFLbEYsS0FBTCxDQUFXTixJQUFoSDtBQUNBLFNBQUtTLFNBQUwsQ0FBZSxLQUFLN0MsS0FBcEIsRUFBMkJ3QyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLQyxLQUF2QixFQUE4QixFQUFDTixVQUFELEVBQU9QLGdCQUFQLEVBQTlCLENBQTNCO0FBQ0QsR0F0WThCO0FBdVkvQjhGLFVBdlkrQixvQkF1WXJCVCxDQXZZcUIsRUF1WWxCO0FBQ1hBLE1BQUVnQixjQUFGO0FBQ0EsU0FBS3hDLE9BQUwsQ0FBYSxLQUFLaEQsS0FBTCxDQUFXTixJQUFYLEdBQWtCLENBQS9CO0FBQ0QsR0ExWThCO0FBMlkvQnNGLGNBM1krQix3QkEyWWpCUixDQTNZaUIsRUEyWWQ7QUFDZkEsTUFBRWdCLGNBQUY7QUFDQSxTQUFLeEMsT0FBTCxDQUFhLEtBQUtoRCxLQUFMLENBQVdOLElBQVgsR0FBa0IsQ0FBL0I7QUFDRDtBQTlZOEIsQ0FBbEIsQzs7QUFpWmY7QUFDQTtBQUNBOztBQUVBLFNBQVN0QyxNQUFULENBQWlCcUksQ0FBakIsRUFBb0JDLENBQXBCLEVBQXVCO0FBQ3JCLFNBQU9ELEVBQUVoRSxNQUFGLENBQVMsVUFBVWtFLENBQVYsRUFBYXZFLENBQWIsRUFBZ0I7QUFDOUIsUUFBSXdFLElBQUlGLEVBQUVDLENBQUYsQ0FBUjtBQUNBLFFBQUlDLENBQUosRUFBTztBQUNMSCxRQUFFRixNQUFGLENBQVNuRSxDQUFULEVBQVksQ0FBWjtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0FQTSxDQUFQO0FBUUQ7O0FBRUQsU0FBU3RFLEdBQVQsQ0FBYzJJLENBQWQsRUFBaUJDLENBQWpCLEVBQW9CO0FBQ2xCLE1BQUlHLFFBQVFILENBQVIsQ0FBSixFQUFnQjtBQUNkQSxRQUFJQSxFQUFFSSxJQUFGLENBQU8sR0FBUCxDQUFKO0FBQ0Q7QUFDRCxTQUFPSixFQUNKSyxPQURJLENBQ0ksR0FESixFQUNTLEdBRFQsRUFDY0EsT0FEZCxDQUNzQixHQUR0QixFQUMyQixFQUQzQixFQUVKQyxLQUZJLENBRUUsR0FGRixFQUdKQyxNQUhJLENBSUgsVUFBVUMsR0FBVixFQUFlQyxRQUFmLEVBQXlCO0FBQ3ZCLFdBQU9ELElBQUlDLFFBQUosQ0FBUDtBQUNELEdBTkUsRUFNQVYsQ0FOQSxDQUFQO0FBUUQ7O0FBRUQsU0FBUzFJLFNBQVQsQ0FBb0JxSixHQUFwQixFQUF5QkMsQ0FBekIsRUFBNEI7QUFDMUIsTUFBTUMsUUFBUUQsSUFBSUQsSUFBSTlFLE1BQVIsR0FBaUIsQ0FBakIsR0FBcUI4RSxJQUFJOUUsTUFBSixHQUFhK0UsQ0FBaEQ7QUFDQSxTQUFPRCxJQUFJNUMsS0FBSixDQUFVOEMsS0FBVixDQUFQO0FBQ0Q7O0FBRUQsU0FBU3RKLElBQVQsQ0FBZW9KLEdBQWYsRUFBb0I7QUFDbEIsU0FBT0EsSUFBSUEsSUFBSTlFLE1BQUosR0FBYSxDQUFqQixDQUFQO0FBQ0Q7O0FBRUQsU0FBU3BFLEtBQVQsQ0FBZ0JtSixDQUFoQixFQUFtQjtBQUNqQixNQUFNRCxNQUFNLEVBQVo7QUFDQSxPQUFLLElBQUloRixJQUFJLENBQWIsRUFBZ0JBLElBQUlpRixDQUFwQixFQUF1QmpGLEdBQXZCLEVBQTRCO0FBQzFCZ0YsUUFBSXpGLElBQUosQ0FBUzBGLENBQVQ7QUFDRDtBQUNELFNBQU9ELEdBQVA7QUFDRDs7QUFFRCxTQUFTbkosT0FBVCxDQUFrQm1KLEdBQWxCLEVBQXVCRyxLQUF2QixFQUE4QkMsSUFBOUIsRUFBb0M7QUFDbEMsU0FBT0osSUFBSXpFLElBQUosQ0FBUyxVQUFDOEQsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDeEIsU0FBSyxJQUFJdEUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbUYsTUFBTWpGLE1BQTFCLEVBQWtDRixHQUFsQyxFQUF1QztBQUNyQyxVQUFNcUYsT0FBT0YsTUFBTW5GLENBQU4sQ0FBYjtBQUNBLFVBQU1zRixLQUFLRCxLQUFLaEIsQ0FBTCxDQUFYO0FBQ0EsVUFBTTFELEtBQUswRSxLQUFLZixDQUFMLENBQVg7QUFDQSxVQUFNaUIsT0FBT0gsS0FBS3BGLENBQUwsTUFBWSxLQUFaLElBQXFCb0YsS0FBS3BGLENBQUwsTUFBWSxNQUE5QztBQUNBLFVBQUlzRixLQUFLM0UsRUFBVCxFQUFhO0FBQ1gsZUFBTzRFLE9BQU8sQ0FBQyxDQUFSLEdBQVksQ0FBbkI7QUFDRDtBQUNELFVBQUlELEtBQUszRSxFQUFULEVBQWE7QUFDWCxlQUFPNEUsT0FBTyxDQUFQLEdBQVcsQ0FBQyxDQUFuQjtBQUNEO0FBQ0Y7QUFDRCxXQUFPLENBQVA7QUFDRCxHQWRNLENBQVA7QUFlRDs7QUFFRCxTQUFTeEosS0FBVCxDQUFnQnNJLENBQWhCLEVBQW1CO0FBQ2pCLFNBQU9tQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZXJCLENBQWYsRUFBa0IsVUFBVXNCLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUN4RCxRQUFJLE9BQU9BLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBT0EsTUFBTUMsUUFBTixFQUFQO0FBQ0Q7QUFDRCxXQUFPRCxLQUFQO0FBQ0QsR0FMaUIsQ0FBWCxDQUFQO0FBTUQ7O0FBRUQ7QUFDQTtBQUNBOztBQUVBLFNBQVNuQixPQUFULENBQWtCSixDQUFsQixFQUFxQjtBQUNuQixTQUFPeUIsTUFBTXJCLE9BQU4sQ0FBY0osQ0FBZCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuLy9cbmNvbnN0IF8gPSB7XG4gIGdldCxcbiAgdGFrZVJpZ2h0LFxuICBsYXN0LFxuICBvcmRlckJ5LFxuICByYW5nZSxcbiAgY2xvbmUsXG4gIHJlbW92ZVxufVxuXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gKHByb3BzKSA9PiAoXG4gIDxidXR0b24gey4uLnByb3BzfSBjbGFzc05hbWU9Jy1idG4nPntwcm9wcy5jaGlsZHJlbn08L2J1dHRvbj5cbilcblxuZXhwb3J0IGNvbnN0IFJlYWN0VGFibGVEZWZhdWx0cyA9IHtcbiAgLy8gQ2xhc3Nlc1xuICBjbGFzc05hbWU6ICctc3RyaXBlZCAtaGlnaGxpZ2h0JyxcbiAgdGFibGVDbGFzc05hbWU6ICcnLFxuICB0aGVhZENsYXNzTmFtZTogJycsXG4gIHRib2R5Q2xhc3NOYW1lOiAnJyxcbiAgdHJDbGFzc05hbWU6ICcnLFxuICBwYWdpbmF0aW9uQ2xhc3NOYW1lOiAnJyxcbiAgLy9cbiAgcGFnZVNpemU6IDIwLFxuICBtaW5Sb3dzOiAwLFxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXG4gIGNvbHVtbjoge1xuICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfSxcbiAgLy8gVGV4dFxuICBwcmV2aW91c1RleHQ6ICdQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCcsXG4gIGxvYWRpbmdUZXh0OiAnTG9hZGluZy4uLicsXG4gIC8vIENvbXBvbmVudHNcbiAgdGFibGVDb21wb25lbnQ6IChwcm9wcykgPT4gPHRhYmxlIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGFibGU+LFxuICB0aGVhZENvbXBvbmVudDogKHByb3BzKSA9PiA8dGhlYWQgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aGVhZD4sXG4gIHRib2R5Q29tcG9uZW50OiAocHJvcHMpID0+IDx0Ym9keSB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3Rib2R5PixcbiAgdHJDb21wb25lbnQ6IChwcm9wcykgPT4gPHRyIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdHI+LFxuICB0aENvbXBvbmVudDogKHByb3BzKSA9PiA8dGggey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aD4sXG4gIHRkQ29tcG9uZW50OiAocHJvcHMpID0+IDx0ZCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RkPixcbiAgcHJldmlvdXNDb21wb25lbnQ6IG51bGwsXG4gIG5leHRDb21wb25lbnQ6IG51bGwsXG4gIC8vIFVubGlzdGVkXG4gIGRhdGE6IFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0RGVmYXVsdFByb3BzICgpIHtcbiAgICByZXR1cm4gUmVhY3RUYWJsZURlZmF1bHRzXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvcnRpbmc6IGZhbHNlXG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMudXBkYXRlKHRoaXMucHJvcHMpXG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIHRoaXMudXBkYXRlKG5leHRQcm9wcylcbiAgfSxcbiAgdXBkYXRlIChwcm9wcykge1xuICAgIGNvbnN0IHJlc2V0U3RhdGUgPSB7XG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIHBhZ2U6IDAsXG4gICAgICBwYWdlczogLTFcbiAgICAgIC8vIGNvbHVtbnM6IHt9ICBmb3IgY29sdW1uIGhpZGluZyBpbiB0aGUgZnV0dXJlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUocmVzZXRTdGF0ZSlcbiAgICBjb25zdCBuZXdTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHJlc2V0U3RhdGUpXG4gICAgdGhpcy5pc0FzeW5jID0gdHlwZW9mIHByb3BzLmRhdGEgPT09ICdmdW5jdGlvbidcbiAgICB0aGlzLmJ1aWxkQ29sdW1ucyhwcm9wcywgbmV3U3RhdGUpXG4gICAgdGhpcy5idWlsZERhdGEocHJvcHMsIG5ld1N0YXRlKVxuICB9LFxuICBidWlsZENvbHVtbnMgKHByb3BzKSB7XG4gICAgdGhpcy5oYXNIZWFkZXJHcm91cHMgPSBmYWxzZVxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmhlYWRlckdyb3VwcyA9IFtdXG4gICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zID0gW11cbiAgICBsZXQgY3VycmVudFNwYW4gPSBbXVxuXG4gICAgY29uc3QgYWRkSGVhZGVyID0gKGNvbHVtbnMsIGNvbHVtbiA9IHt9KSA9PiB7XG4gICAgICB0aGlzLmhlYWRlckdyb3Vwcy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGNvbHVtbiwge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9KSlcbiAgICAgIGN1cnJlbnRTcGFuID0gW11cbiAgICB9XG4gICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4pID0+IHtcbiAgICAgIGNvbnN0IGRjb2wgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmNvbHVtbiwgY29sdW1uKVxuICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xuICAgICAgICBkY29sLmlkID0gZGNvbC5pZCB8fCBkY29sLmFjY2Vzc29yXG4gICAgICAgIGNvbnN0IGFjY2Vzc29yU3RyaW5nID0gZGNvbC5hY2Nlc3NvclxuICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXG4gICAgICB9XG4gICAgICBpZiAoIWRjb2wuaWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdObyBjb2x1bW4gSUQgZm91bmQgZm9yIGNvbHVtbjogJywgZGNvbClcbiAgICAgIH1cbiAgICAgIGlmICghZGNvbC5hY2Nlc3Nvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05vIGNvbHVtbiBhY2Nlc3NvciBmb3VuZCBmb3IgY29sdW1uOiAnLCBkY29sKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRjb2xcbiAgICB9XG5cbiAgICBwcm9wcy5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgIGNvbHVtbi5jb2x1bW5zLmZvckVhY2gobmVzdGVkQ29sdW1uID0+IHtcbiAgICAgICAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMucHVzaChtYWtlRGVjb3JhdGVkQ29sdW1uKG5lc3RlZENvbHVtbikpXG4gICAgICAgIH0pXG4gICAgICAgIGlmICh0aGlzLmhhc0hlYWRlckdyb3Vwcykge1xuICAgICAgICAgIGlmIChjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZEhlYWRlcihfLnRha2VSaWdodCh0aGlzLmRlY29yYXRlZENvbHVtbnMsIGNvbHVtbi5jb2x1bW5zLmxlbmd0aCksIGNvbHVtbilcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLnB1c2gobWFrZURlY29yYXRlZENvbHVtbihjb2x1bW4pKVxuICAgICAgICBjdXJyZW50U3Bhbi5wdXNoKF8ubGFzdCh0aGlzLmRlY29yYXRlZENvbHVtbnMpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5oYXNIZWFkZXJHcm91cHMgJiYgY3VycmVudFNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgYWRkSGVhZGVyKGN1cnJlbnRTcGFuKVxuICAgIH1cbiAgfSxcbiAgZ2V0SW5pdFNvcnRpbmcgKCkge1xuICAgIGNvbnN0IGluaXRTb3J0aW5nID0gdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLmZpbHRlcihkID0+IHtcbiAgICAgIHJldHVybiB0eXBlb2YgZC5zb3J0ICE9PSAndW5kZWZpbmVkJ1xuICAgIH0pLm1hcChkID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBkLmlkLFxuICAgICAgICBhc2M6IGQuc29ydCA9PT0gJ2FzYydcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGluaXRTb3J0aW5nLmxlbmd0aCA/IGluaXRTb3J0aW5nIDogW3tcbiAgICAgIGlkOiB0aGlzLmRlY29yYXRlZENvbHVtbnNbMF0uaWQsXG4gICAgICBhc2M6IHRydWVcbiAgICB9XVxuICB9LFxuICBidWlsZERhdGEgKHByb3BzLCBzdGF0ZSkge1xuICAgIGNvbnN0IHNvcnRpbmcgPSBzdGF0ZS5zb3J0aW5nID09PSBmYWxzZSA/IHRoaXMuZ2V0SW5pdFNvcnRpbmcoKSA6IHN0YXRlLnNvcnRpbmdcblxuICAgIGNvbnN0IHNldERhdGEgPSAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNvcnRpbmcsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHBhZ2U6IHN0YXRlLnBhZ2UsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQXN5bmMpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2FkaW5nOiB0cnVlXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjYiA9IChyZXMpID0+IHtcbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1VoIE9oISBOb3RoaW5nIHdhcyByZXR1cm5lZCBpbiBSZWFjdFRhYmxlXFwncyBkYXRhIGNhbGxiYWNrIScpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcy5wYWdlcykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcGFnZXM6IHJlcy5wYWdlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gT25seSBhY2Nlc3MgdGhlIGRhdGEuIFNvcnRpbmcgaXMgZG9uZSBzZXJ2ZXIgc2lkZS5cbiAgICAgICAgY29uc3QgYWNjZXNzZWREYXRhID0gdGhpcy5hY2Nlc3NEYXRhKHJlcy5yb3dzKVxuICAgICAgICBzZXREYXRhKGFjY2Vzc2VkRGF0YSlcbiAgICAgIH1cblxuICAgICAgLy8gRmV0Y2ggZGF0YSB3aXRoIGN1cnJlbnQgc3RhdGVcbiAgICAgIGNvbnN0IGRhdGFSZXMgPSBwcm9wcy5kYXRhKHtcbiAgICAgICAgc29ydGluZyxcbiAgICAgICAgcGFnZTogc3RhdGUucGFnZSB8fCAwLFxuICAgICAgICBwYWdlU2l6ZTogcHJvcHMucGFnZVNpemUsXG4gICAgICAgIHBhZ2VzOiBzdGF0ZS5wYWdlc1xuICAgICAgfSwgY2IpXG5cbiAgICAgIGlmIChkYXRhUmVzICYmIGRhdGFSZXMudGhlbikge1xuICAgICAgICBkYXRhUmVzLnRoZW4oY2IpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJldHVybiBsb2NhbGx5IGFjY2Vzc2VkLCBzb3J0ZWQgZGF0YVxuICAgICAgY29uc3QgYWNjZXNzZWREYXRhID0gdGhpcy5hY2Nlc3NEYXRhKHByb3BzLmRhdGEpXG4gICAgICBjb25zdCBzb3J0ZWREYXRhID0gdGhpcy5zb3J0RGF0YShhY2Nlc3NlZERhdGEsIHNvcnRpbmcpXG4gICAgICBzZXREYXRhKHNvcnRlZERhdGEpXG4gICAgfVxuICB9LFxuICBhY2Nlc3NEYXRhIChkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKChkLCBpKSA9PiB7XG4gICAgICBjb25zdCByb3cgPSB7XG4gICAgICAgIF9fb3JpZ2luYWw6IGQsXG4gICAgICAgIF9faW5kZXg6IGlcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgIHJvd1tjb2x1bW4uaWRdID0gY29sdW1uLmFjY2Vzc29yKGQpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJvd1xuICAgIH0pXG4gIH0sXG4gIHNvcnREYXRhIChkYXRhLCBzb3J0aW5nKSB7XG4gICAgY29uc3QgcmVzb2x2ZWRTb3J0aW5nID0gc29ydGluZy5sZW5ndGggPyBzb3J0aW5nIDogdGhpcy5nZXRJbml0U29ydGluZygpXG4gICAgcmV0dXJuIF8ub3JkZXJCeShkYXRhLCByZXNvbHZlZFNvcnRpbmcubWFwKHNvcnQgPT4ge1xuICAgICAgcmV0dXJuIHJvdyA9PiB7XG4gICAgICAgIGlmIChyb3dbc29ydC5pZF0gPT09IG51bGwgfHwgcm93W3NvcnQuaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gLUluZmluaXR5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiByb3dbc29ydC5pZF0gPT09ICdzdHJpbmcnID8gcm93W3NvcnQuaWRdLnRvTG93ZXJDYXNlKCkgOiByb3dbc29ydC5pZF1cbiAgICAgIH1cbiAgICB9KSwgcmVzb2x2ZWRTb3J0aW5nLm1hcChkID0+IGQuYXNjID8gJ2FzYycgOiAnZGVzYycpKVxuICB9LFxuICBzZXRQYWdlIChwYWdlKSB7XG4gICAgaWYgKHRoaXMuaXNBc3luYykge1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGREYXRhKHRoaXMucHJvcHMsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtwYWdlfSkpXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGFnZVxuICAgIH0pXG4gIH0sXG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5zdGF0ZS5kYXRhID8gdGhpcy5zdGF0ZS5kYXRhIDogW11cblxuICAgIGNvbnN0IHBhZ2VzTGVuZ3RoID0gdGhpcy5pc0FzeW5jID8gdGhpcy5zdGF0ZS5wYWdlcyA6IE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHRoaXMucHJvcHMucGFnZVNpemUpXG4gICAgY29uc3Qgc3RhcnRSb3cgPSB0aGlzLnByb3BzLnBhZ2VTaXplICogdGhpcy5zdGF0ZS5wYWdlXG4gICAgY29uc3QgZW5kUm93ID0gc3RhcnRSb3cgKyB0aGlzLnByb3BzLnBhZ2VTaXplXG4gICAgY29uc3QgcGFnZVJvd3MgPSB0aGlzLmlzQXN5bmMgPyBkYXRhLnNsaWNlKDAsIHRoaXMucHJvcHMucGFnZVNpemUpIDogZGF0YS5zbGljZShzdGFydFJvdywgZW5kUm93KVxuICAgIGNvbnN0IHBhZFJvd3MgPSBwYWdlc0xlbmd0aCA+IDEgPyBfLnJhbmdlKHRoaXMucHJvcHMucGFnZVNpemUgLSBwYWdlUm93cy5sZW5ndGgpXG4gICAgICA6IHRoaXMucHJvcHMubWluUm93cyA/IF8ucmFuZ2UoTWF0aC5tYXgodGhpcy5wcm9wcy5taW5Sb3dzIC0gcGFnZVJvd3MubGVuZ3RoLCAwKSlcbiAgICAgIDogW11cblxuICAgIGNvbnN0IGNhblByZXZpb3VzID0gdGhpcy5zdGF0ZS5wYWdlID4gMFxuICAgIGNvbnN0IGNhbk5leHQgPSB0aGlzLnN0YXRlLnBhZ2UgKyAxIDwgcGFnZXNMZW5ndGhcblxuICAgIGNvbnN0IFRhYmxlQ29tcG9uZW50ID0gdGhpcy5wcm9wcy50YWJsZUNvbXBvbmVudFxuICAgIGNvbnN0IFRoZWFkQ29tcG9uZW50ID0gdGhpcy5wcm9wcy50aGVhZENvbXBvbmVudFxuICAgIGNvbnN0IFRib2R5Q29tcG9uZW50ID0gdGhpcy5wcm9wcy50Ym9keUNvbXBvbmVudFxuICAgIGNvbnN0IFRyQ29tcG9uZW50ID0gdGhpcy5wcm9wcy50ckNvbXBvbmVudFxuICAgIGNvbnN0IFRoQ29tcG9uZW50ID0gdGhpcy5wcm9wcy50aENvbXBvbmVudFxuICAgIGNvbnN0IFRkQ29tcG9uZW50ID0gdGhpcy5wcm9wcy50ZENvbXBvbmVudFxuXG4gICAgY29uc3QgUHJldmlvdXNDb21wb25lbnQgPSB0aGlzLnByb3BzLnByZXZpb3VzQ29tcG9uZW50IHx8IGRlZmF1bHRCdXR0b25cbiAgICBjb25zdCBOZXh0Q29tcG9uZW50ID0gdGhpcy5wcm9wcy5uZXh0Q29tcG9uZW50IHx8IGRlZmF1bHRCdXR0b25cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLmNsYXNzTmFtZSwgJ1JlYWN0VGFibGUnKX0+XG4gICAgICAgIDxUYWJsZUNvbXBvbmVudCBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50YWJsZUNsYXNzTmFtZSl9PlxuICAgICAgICAgIHt0aGlzLmhhc0hlYWRlckdyb3VwcyAmJiAoXG4gICAgICAgICAgICA8VGhlYWRDb21wb25lbnQgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGhlYWRDbGFzc05hbWUsICctaGVhZGVyR3JvdXBzJyl9PlxuICAgICAgICAgICAgICA8VHJDb21wb25lbnQgY2xhc3NOYW1lPXt0aGlzLnByb3BzLnRyQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5oZWFkZXJHcm91cHMubWFwKChjb2x1bW4sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmNsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgICAgICAgY29sU3Bhbj17Y29sdW1uLmNvbHVtbnMubGVuZ3RofT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRoLWlubmVyJyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiBjb2x1bW4uaGVhZGVyID09PSAnZnVuY3Rpb24nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sdW1uLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE9e3RoaXMucHJvcHMuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBjb2x1bW4uaGVhZGVyfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxUaGVhZENvbXBvbmVudCBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50aGVhZENsYXNzTmFtZSl9PlxuICAgICAgICAgICAgPFRyQ29tcG9uZW50IGNsYXNzTmFtZT17dGhpcy5wcm9wcy50ckNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgIHt0aGlzLmRlY29yYXRlZENvbHVtbnMubWFwKChjb2x1bW4sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3J0ID0gdGhpcy5zdGF0ZS5zb3J0aW5nLmZpbmQoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8VGhDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uLmNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBzb3J0ID8gKHNvcnQuYXNjID8gJy1zb3J0LWFzYycgOiAnLXNvcnQtZGVzYycpIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJy1jdXJzb3ItcG9pbnRlcic6IGNvbHVtbi5zb3J0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICctaGlkZGVuJzogIXNob3dcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNvcnRhYmxlICYmIHRoaXMuc29ydENvbHVtbihjb2x1bW4sIGUuc2hpZnRLZXkpXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5pbm5lckNsYXNzTmFtZSwgJy10aC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY29sdW1uLndpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBjb2x1bW4ubWluV2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiBjb2x1bW4uaGVhZGVyID09PSAnZnVuY3Rpb24nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbHVtbi5oZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbn1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IGNvbHVtbi5oZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9UaENvbXBvbmVudD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgICAgIDxUYm9keUNvbXBvbmVudCBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50Ym9keUNsYXNzTmFtZSl9PlxuICAgICAgICAgICAge3BhZ2VSb3dzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50ckNsYXNzTmFtZSl9XG4gICAgICAgICAgICAgICAgICBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAge3RoaXMuZGVjb3JhdGVkQ29sdW1ucy5tYXAoKGNvbHVtbiwgaTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgQ2VsbCA9IGNvbHVtbi5yZW5kZXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxUZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5jbGFzc05hbWUsIHtoaWRkZW46ICFzaG93fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2kyfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5pbm5lckNsYXNzTmFtZSwgJy10ZC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb2x1bW4ud2lkdGggKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBjb2x1bW4ubWluV2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIENlbGwgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyb3dbY29sdW1uLmlkXX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdz17cm93Ll9fb3JpZ2luYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17cm93Ll9faW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3SW5kZXg9e2l9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogdHlwZW9mIENlbGwgIT09ICd1bmRlZmluZWQnID8gQ2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IHJvd1tjb2x1bW4uaWRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9UZENvbXBvbmVudD5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7cGFkUm93cy5tYXAoKHJvdywgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxUckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudHJDbGFzc05hbWUsICctcGFkUm93Jyl9XG4gICAgICAgICAgICAgICAgICBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAge3RoaXMuZGVjb3JhdGVkQ29sdW1ucy5tYXAoKGNvbHVtbiwgaTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxUZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5jbGFzc05hbWUsIHtoaWRkZW46ICFzaG93fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2kyfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5pbm5lckNsYXNzTmFtZSwgJy10ZC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb2x1bW4ud2lkdGggKyAncHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBjb2x1bW4ubWluV2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH19PiZuYnNwOzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvVGRDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvVGJvZHlDb21wb25lbnQ+XG4gICAgICAgIDwvVGFibGVDb21wb25lbnQ+XG4gICAgICAgIHtwYWdlc0xlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMucGFnaW5hdGlvbkNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1sZWZ0Jz5cbiAgICAgICAgICAgICAgPFByZXZpb3VzQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgb25DbGljaz17Y2FuUHJldmlvdXMgJiYgKChlKSA9PiB0aGlzLnByZXZpb3VzUGFnZShlKSl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5QcmV2aW91c30+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxuICAgICAgICAgICAgICA8L1ByZXZpb3VzQ29tcG9uZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWNlbnRlcic+XG4gICAgICAgICAgICAgIFBhZ2Uge3RoaXMuc3RhdGUucGFnZSArIDF9IG9mIHtwYWdlc0xlbmd0aH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1yaWdodCc+XG4gICAgICAgICAgICAgIDxOZXh0Q29tcG9uZW50XG4gICAgICAgICAgICAgICAgb25DbGljaz17Y2FuTmV4dCAmJiAoKGUpID0+IHRoaXMubmV4dFBhZ2UoZSkpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dH0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmV4dFRleHR9XG4gICAgICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWxvYWRpbmcnLCB7Jy1hY3RpdmUnOiB0aGlzLnN0YXRlLmxvYWRpbmd9KX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1sb2FkaW5nLWlubmVyJz5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvYWRpbmdUZXh0fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbiAgc29ydENvbHVtbiAoY29sdW1uLCBhZGRpdGl2ZSkge1xuICAgIGNvbnN0IGV4aXN0aW5nU29ydGluZyA9IHRoaXMuc3RhdGUuc29ydGluZyB8fCBbXVxuICAgIGxldCBzb3J0aW5nID0gXy5jbG9uZSh0aGlzLnN0YXRlLnNvcnRpbmcgfHwgW10pXG4gICAgY29uc3QgZXhpc3RpbmdJbmRleCA9IHNvcnRpbmcuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxuICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nID0gc29ydGluZ1tleGlzdGluZ0luZGV4XVxuICAgICAgaWYgKGV4aXN0aW5nLmFzYykge1xuICAgICAgICBleGlzdGluZy5hc2MgPSBmYWxzZVxuICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XG4gICAgICAgICAgc29ydGluZyA9IFtleGlzdGluZ11cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgICAgc29ydGluZy5zcGxpY2UoZXhpc3RpbmdJbmRleCwgMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGlzdGluZy5hc2MgPSB0cnVlXG4gICAgICAgICAgc29ydGluZyA9IFtleGlzdGluZ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgc29ydGluZy5wdXNoKHtcbiAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgIGFzYzogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc29ydGluZyA9IFt7XG4gICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICBhc2M6IHRydWVcbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcGFnZSA9IChleGlzdGluZ0luZGV4ID09PSAwIHx8ICghZXhpc3RpbmdTb3J0aW5nLmxlbmd0aCAmJiBzb3J0aW5nLmxlbmd0aCkgfHwgIWFkZGl0aXZlKSA/IDAgOiB0aGlzLnN0YXRlLnBhZ2VcbiAgICB0aGlzLmJ1aWxkRGF0YSh0aGlzLnByb3BzLCBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7cGFnZSwgc29ydGluZ30pKVxuICB9LFxuICBuZXh0UGFnZSAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuc2V0UGFnZSh0aGlzLnN0YXRlLnBhZ2UgKyAxKVxuICB9LFxuICBwcmV2aW91c1BhZ2UgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLnNldFBhZ2UodGhpcy5zdGF0ZS5wYWdlIC0gMSlcbiAgfVxufSlcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyBVdGlsc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmZ1bmN0aW9uIHJlbW92ZSAoYSwgYikge1xuICByZXR1cm4gYS5maWx0ZXIoZnVuY3Rpb24gKG8sIGkpIHtcbiAgICB2YXIgciA9IGIobylcbiAgICBpZiAocikge1xuICAgICAgYS5zcGxpY2UoaSwgMSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXQgKGEsIGIpIHtcbiAgaWYgKGlzQXJyYXkoYikpIHtcbiAgICBiID0gYi5qb2luKCcuJylcbiAgfVxuICByZXR1cm4gYlxuICAgIC5yZXBsYWNlKCdbJywgJy4nKS5yZXBsYWNlKCddJywgJycpXG4gICAgLnNwbGl0KCcuJylcbiAgICAucmVkdWNlKFxuICAgICAgZnVuY3Rpb24gKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wZXJ0eV1cbiAgICAgIH0sIGFcbiAgICApXG59XG5cbmZ1bmN0aW9uIHRha2VSaWdodCAoYXJyLCBuKSB7XG4gIGNvbnN0IHN0YXJ0ID0gbiA+IGFyci5sZW5ndGggPyAwIDogYXJyLmxlbmd0aCAtIG5cbiAgcmV0dXJuIGFyci5zbGljZShzdGFydClcbn1cblxuZnVuY3Rpb24gbGFzdCAoYXJyKSB7XG4gIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdXG59XG5cbmZ1bmN0aW9uIHJhbmdlIChuKSB7XG4gIGNvbnN0IGFyciA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgYXJyLnB1c2gobilcbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIG9yZGVyQnkgKGFyciwgZnVuY3MsIGRpcnMpIHtcbiAgcmV0dXJuIGFyci5zb3J0KChhLCBiKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmdW5jcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY29tcCA9IGZ1bmNzW2ldXG4gICAgICBjb25zdCBjYSA9IGNvbXAoYSlcbiAgICAgIGNvbnN0IGNiID0gY29tcChiKVxuICAgICAgY29uc3QgZGVzYyA9IGRpcnNbaV0gPT09IGZhbHNlIHx8IGRpcnNbaV0gPT09ICdkZXNjJ1xuICAgICAgaWYgKGNhID4gY2IpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MgPyAtMSA6IDFcbiAgICAgIH1cbiAgICAgIGlmIChjYSA8IGNiKSB7XG4gICAgICAgIHJldHVybiBkZXNjID8gMSA6IC0xXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAwXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNsb25lIChhKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGEsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0pKVxufVxuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vIEhlbHBlcnNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5mdW5jdGlvbiBpc0FycmF5IChhKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGEpXG59XG4iXX0=