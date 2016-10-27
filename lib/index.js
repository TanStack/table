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
  trClassCallback: function trClassCallback(d) {
    return null;
  },
  thClassName: '',
  thGroupClassName: '',
  tdClassName: '',
  paginationClassName: '',
  // Styles
  style: {},
  tableStyle: {},
  theadStyle: {},
  tbodyStyle: {},
  trStyle: {},
  trStyleCallback: function trStyleCallback(d) {},
  thStyle: {},
  tdStyle: {},
  paginationStyle: {},
  //
  pageSize: 20,
  minRows: 0,
  // Global Column Defaults
  column: {
    sortable: true,
    show: true,
    className: '',
    style: {},
    innerClassName: '',
    innerStyle: {},
    headerClassName: '',
    headerStyle: {},
    headerInnerClassName: '',
    headerInnerStyle: {}
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
      {
        className: (0, _classnames2.default)(this.props.className, 'ReactTable'),
        style: this.props.style
      },
      _react2.default.createElement(
        TableComponent,
        {
          className: (0, _classnames2.default)(this.props.tableClassName),
          style: this.props.tableStyle
        },
        this.hasHeaderGroups && _react2.default.createElement(
          TheadComponent,
          {
            className: (0, _classnames2.default)(this.props.theadGroupClassName, '-headerGroups'),
            style: this.props.theadStyle
          },
          _react2.default.createElement(
            TrComponent,
            {
              className: this.props.trClassName,
              style: this.props.trStyle
            },
            this.headerGroups.map(function (column, i) {
              return _react2.default.createElement(
                ThComponent,
                {
                  key: i,
                  colSpan: column.columns.length,
                  className: (0, _classnames2.default)(_this4.props.thClassname, column.headerClassName),
                  style: Object.assign({}, _this4.props.thStyle, column.headerStyle)
                },
                _react2.default.createElement(
                  'div',
                  {
                    className: (0, _classnames2.default)(column.headerInnerClassName, '-th-inner'),
                    style: Object.assign({}, _this4.props.thInnerStyle, column.headerInnerStyle)
                  },
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
          {
            className: (0, _classnames2.default)(this.props.theadClassName),
            style: this.props.theadStyle
          },
          _react2.default.createElement(
            TrComponent,
            {
              className: this.props.trClassName,
              style: this.props.trStyle
            },
            this.decoratedColumns.map(function (column, i) {
              var sort = _this4.state.sorting.find(function (d) {
                return d.id === column.id;
              });
              var show = typeof column.show === 'function' ? column.show() : column.show;
              return _react2.default.createElement(
                ThComponent,
                {
                  key: i,
                  className: (0, _classnames2.default)(_this4.props.thClassname, column.headerClassName, sort ? sort.asc ? '-sort-asc' : '-sort-desc' : '', {
                    '-cursor-pointer': column.sortable,
                    '-hidden': !show
                  }),
                  style: Object.assign({}, _this4.props.thStyle, column.headerStyle),
                  onClick: function onClick(e) {
                    column.sortable && _this4.sortColumn(column, e.shiftKey);
                  }
                },
                _react2.default.createElement(
                  'div',
                  {
                    className: (0, _classnames2.default)(column.headerInnerClassName, '-th-inner'),
                    style: Object.assign({}, column.headerInnerStyle, {
                      minWidth: column.minWidth + 'px'
                    })
                  },
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
          {
            className: (0, _classnames2.default)(this.props.tbodyClassName),
            style: this.props.tbodyStyle
          },
          pageRows.map(function (row, i) {
            var rowInfo = {
              row: row.__original,
              index: row.__index,
              viewIndex: i
            };
            return _react2.default.createElement(
              TrComponent,
              {
                key: i,
                className: (0, _classnames2.default)(_this4.props.trClassName, _this4.props.trClassCallback(rowInfo)),
                style: Object.assign({}, _this4.props.trStyle, _this4.props.trStyleCallback(rowInfo))
              },
              _this4.decoratedColumns.map(function (column, i2) {
                var Cell = column.render;
                var show = typeof column.show === 'function' ? column.show() : column.show;
                return _react2.default.createElement(
                  TdComponent,
                  {
                    key: i2,
                    className: (0, _classnames2.default)(column.className, { hidden: !show }),
                    style: Object.assign({}, _this4.props.tdStyle, column.style)
                  },
                  _react2.default.createElement(
                    'div',
                    {
                      className: (0, _classnames2.default)(column.innerClassName, '-td-inner'),
                      style: Object.assign({}, column.innerStyle, {
                        minWidth: column.minWidth + 'px'
                      })
                    },
                    typeof Cell === 'function' ? _react2.default.createElement(Cell, _extends({
                      value: row[column.id]
                    }, rowInfo)) : typeof Cell !== 'undefined' ? Cell : row[column.id]
                  )
                );
              })
            );
          }),
          padRows.map(function (row, i) {
            return _react2.default.createElement(
              TrComponent,
              {
                key: i,
                className: (0, _classnames2.default)(_this4.props.trClassName, '-padRow'),
                style: _this4.props.trStyle
              },
              _this4.decoratedColumns.map(function (column, i2) {
                var show = typeof column.show === 'function' ? column.show() : column.show;
                return _react2.default.createElement(
                  TdComponent,
                  {
                    key: i2,
                    className: (0, _classnames2.default)(column.className, { hidden: !show }),
                    style: Object.assign({}, _this4.props.tdStyle, column.style)
                  },
                  _react2.default.createElement(
                    'div',
                    {
                      className: (0, _classnames2.default)(column.innerClassName, '-td-inner'),
                      style: Object.assign({}, column.innerStyle, {
                        minWidth: column.minWidth + 'px'
                      })
                    },
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
        {
          className: (0, _classnames2.default)(this.props.paginationClassName, '-pagination'),
          style: this.props.paginationStyle
        },
        _react2.default.createElement(
          'div',
          { className: '-left' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: canPrevious && function (e) {
                return _this4.previousPage(e);
              },
              disabled: !canPrevious
            },
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
              disabled: !canNext
            },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJfIiwiZ2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsImNsb25lIiwicmVtb3ZlIiwiZGVmYXVsdEJ1dHRvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJSZWFjdFRhYmxlRGVmYXVsdHMiLCJjbGFzc05hbWUiLCJ0YWJsZUNsYXNzTmFtZSIsInRoZWFkQ2xhc3NOYW1lIiwidGJvZHlDbGFzc05hbWUiLCJ0ckNsYXNzTmFtZSIsInRyQ2xhc3NDYWxsYmFjayIsInRoQ2xhc3NOYW1lIiwidGhHcm91cENsYXNzTmFtZSIsInRkQ2xhc3NOYW1lIiwicGFnaW5hdGlvbkNsYXNzTmFtZSIsInN0eWxlIiwidGFibGVTdHlsZSIsInRoZWFkU3R5bGUiLCJ0Ym9keVN0eWxlIiwidHJTdHlsZSIsInRyU3R5bGVDYWxsYmFjayIsInRoU3R5bGUiLCJ0ZFN0eWxlIiwicGFnaW5hdGlvblN0eWxlIiwicGFnZVNpemUiLCJtaW5Sb3dzIiwiY29sdW1uIiwic29ydGFibGUiLCJzaG93IiwiaW5uZXJDbGFzc05hbWUiLCJpbm5lclN0eWxlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJoZWFkZXJJbm5lckNsYXNzTmFtZSIsImhlYWRlcklubmVyU3R5bGUiLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0IiwidGFibGVDb21wb25lbnQiLCJ0aGVhZENvbXBvbmVudCIsInRib2R5Q29tcG9uZW50IiwidHJDb21wb25lbnQiLCJ0aENvbXBvbmVudCIsInRkQ29tcG9uZW50IiwicHJldmlvdXNDb21wb25lbnQiLCJuZXh0Q29tcG9uZW50IiwiZGF0YSIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0SW5pdGlhbFN0YXRlIiwic29ydGluZyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJyZXNldFN0YXRlIiwibG9hZGluZyIsInBhZ2UiLCJwYWdlcyIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImlzQXN5bmMiLCJidWlsZENvbHVtbnMiLCJidWlsZERhdGEiLCJoYXNIZWFkZXJHcm91cHMiLCJjb2x1bW5zIiwiZm9yRWFjaCIsImhlYWRlckdyb3VwcyIsImRlY29yYXRlZENvbHVtbnMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsInB1c2giLCJtYWtlRGVjb3JhdGVkQ29sdW1uIiwiZGNvbCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJpIiwibmVzdGVkQ29sdW1uIiwibGVuZ3RoIiwiZ2V0SW5pdFNvcnRpbmciLCJpbml0U29ydGluZyIsImZpbHRlciIsImQiLCJzb3J0IiwibWFwIiwiYXNjIiwic2V0RGF0YSIsImNiIiwicmVzIiwiUHJvbWlzZSIsInJlamVjdCIsImFjY2Vzc2VkRGF0YSIsImFjY2Vzc0RhdGEiLCJyb3dzIiwiZGF0YVJlcyIsInRoZW4iLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJfX29yaWdpbmFsIiwiX19pbmRleCIsInJlc29sdmVkU29ydGluZyIsIkluZmluaXR5IiwidG9Mb3dlckNhc2UiLCJzZXRQYWdlIiwicmVuZGVyIiwicGFnZXNMZW5ndGgiLCJNYXRoIiwiY2VpbCIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsInBhZFJvd3MiLCJtYXgiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJUYWJsZUNvbXBvbmVudCIsIlRoZWFkQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJ0aGVhZEdyb3VwQ2xhc3NOYW1lIiwidGhDbGFzc25hbWUiLCJ0aElubmVyU3R5bGUiLCJoZWFkZXIiLCJmaW5kIiwiZSIsInNvcnRDb2x1bW4iLCJzaGlmdEtleSIsIm1pbldpZHRoIiwicm93SW5mbyIsImluZGV4Iiwidmlld0luZGV4IiwiaTIiLCJDZWxsIiwiaGlkZGVuIiwicHJldmlvdXNQYWdlIiwibmV4dFBhZ2UiLCJhZGRpdGl2ZSIsImV4aXN0aW5nU29ydGluZyIsImV4aXN0aW5nSW5kZXgiLCJmaW5kSW5kZXgiLCJleGlzdGluZyIsInNwbGljZSIsInByZXZlbnREZWZhdWx0IiwiYSIsImIiLCJvIiwiciIsImlzQXJyYXkiLCJqb2luIiwicmVwbGFjZSIsInNwbGl0IiwicmVkdWNlIiwib2JqIiwicHJvcGVydHkiLCJhcnIiLCJuIiwic3RhcnQiLCJmdW5jcyIsImRpcnMiLCJjb21wIiwiY2EiLCJkZXNjIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5Iiwia2V5IiwidmFsdWUiLCJ0b1N0cmluZyIsIkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUNBO0FBQ0EsSUFBTUEsSUFBSTtBQUNSQyxVQURRO0FBRVJDLHNCQUZRO0FBR1JDLFlBSFE7QUFJUkMsa0JBSlE7QUFLUkMsY0FMUTtBQU1SQyxjQU5RO0FBT1JDO0FBUFEsQ0FBVjs7QUFVQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLEtBQUQ7QUFBQSxTQUNwQjtBQUFBO0FBQUEsaUJBQVlBLEtBQVosSUFBbUIsV0FBVSxNQUE3QjtBQUFxQ0EsVUFBTUM7QUFBM0MsR0FEb0I7QUFBQSxDQUF0Qjs7QUFJTyxJQUFNQyxrREFBcUI7QUFDaEM7QUFDQUMsYUFBVyxxQkFGcUI7QUFHaENDLGtCQUFnQixFQUhnQjtBQUloQ0Msa0JBQWdCLEVBSmdCO0FBS2hDQyxrQkFBZ0IsRUFMZ0I7QUFNaENDLGVBQWEsRUFObUI7QUFPaENDLG1CQUFpQjtBQUFBLFdBQUssSUFBTDtBQUFBLEdBUGU7QUFRaENDLGVBQWEsRUFSbUI7QUFTaENDLG9CQUFr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QixDQUFMLENBQVg7QUFDQSxVQUFNN0QsS0FBSzZFLEtBQUtmLENBQUwsQ0FBWDtBQUNBLFVBQU1pQixPQUFPSCxLQUFLdkYsQ0FBTCxNQUFZLEtBQVosSUFBcUJ1RixLQUFLdkYsQ0FBTCxNQUFZLE1BQTlDO0FBQ0EsVUFBSXlGLEtBQUs5RSxFQUFULEVBQWE7QUFDWCxlQUFPK0UsT0FBTyxDQUFDLENBQVIsR0FBWSxDQUFuQjtBQUNEO0FBQ0QsVUFBSUQsS0FBSzlFLEVBQVQsRUFBYTtBQUNYLGVBQU8rRSxPQUFPLENBQVAsR0FBVyxDQUFDLENBQW5CO0FBQ0Q7QUFDRjtBQUNELFdBQU8sQ0FBUDtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVELFNBQVNoTCxLQUFULENBQWdCOEosQ0FBaEIsRUFBbUI7QUFDakIsU0FBT21CLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlckIsQ0FBZixFQUFrQixVQUFVc0IsR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ3hELFFBQUksT0FBT0EsS0FBUCxLQUFpQixVQUFyQixFQUFpQztBQUMvQixhQUFPQSxNQUFNQyxRQUFOLEVBQVA7QUFDRDtBQUNELFdBQU9ELEtBQVA7QUFDRCxHQUxpQixDQUFYLENBQVA7QUFNRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUEsU0FBU25CLE9BQVQsQ0FBa0JKLENBQWxCLEVBQXFCO0FBQ25CLFNBQU95QixNQUFNckIsT0FBTixDQUFjSixDQUFkLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG4vL1xuY29uc3QgXyA9IHtcbiAgZ2V0LFxuICB0YWtlUmlnaHQsXG4gIGxhc3QsXG4gIG9yZGVyQnksXG4gIHJhbmdlLFxuICBjbG9uZSxcbiAgcmVtb3ZlXG59XG5cbmNvbnN0IGRlZmF1bHRCdXR0b24gPSAocHJvcHMpID0+IChcbiAgPGJ1dHRvbiB7Li4ucHJvcHN9IGNsYXNzTmFtZT0nLWJ0bic+e3Byb3BzLmNoaWxkcmVufTwvYnV0dG9uPlxuKVxuXG5leHBvcnQgY29uc3QgUmVhY3RUYWJsZURlZmF1bHRzID0ge1xuICAvLyBDbGFzc2VzXG4gIGNsYXNzTmFtZTogJy1zdHJpcGVkIC1oaWdobGlnaHQnLFxuICB0YWJsZUNsYXNzTmFtZTogJycsXG4gIHRoZWFkQ2xhc3NOYW1lOiAnJyxcbiAgdGJvZHlDbGFzc05hbWU6ICcnLFxuICB0ckNsYXNzTmFtZTogJycsXG4gIHRyQ2xhc3NDYWxsYmFjazogZCA9PiBudWxsLFxuICB0aENsYXNzTmFtZTogJycsXG4gIHRoR3JvdXBDbGFzc05hbWU6ICcnLFxuICB0ZENsYXNzTmFtZTogJycsXG4gIHBhZ2luYXRpb25DbGFzc05hbWU6ICcnLFxuICAvLyBTdHlsZXNcbiAgc3R5bGU6IHt9LFxuICB0YWJsZVN0eWxlOiB7fSxcbiAgdGhlYWRTdHlsZToge30sXG4gIHRib2R5U3R5bGU6IHt9LFxuICB0clN0eWxlOiB7fSxcbiAgdHJTdHlsZUNhbGxiYWNrOiBkID0+IHt9LFxuICB0aFN0eWxlOiB7fSxcbiAgdGRTdHlsZToge30sXG4gIHBhZ2luYXRpb25TdHlsZToge30sXG4gIC8vXG4gIHBhZ2VTaXplOiAyMCxcbiAgbWluUm93czogMCxcbiAgLy8gR2xvYmFsIENvbHVtbiBEZWZhdWx0c1xuICBjb2x1bW46IHtcbiAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICBzaG93OiB0cnVlLFxuICAgIGNsYXNzTmFtZTogJycsXG4gICAgc3R5bGU6IHt9LFxuICAgIGlubmVyQ2xhc3NOYW1lOiAnJyxcbiAgICBpbm5lclN0eWxlOiB7fSxcbiAgICBoZWFkZXJDbGFzc05hbWU6ICcnLFxuICAgIGhlYWRlclN0eWxlOiB7fSxcbiAgICBoZWFkZXJJbm5lckNsYXNzTmFtZTogJycsXG4gICAgaGVhZGVySW5uZXJTdHlsZToge31cbiAgfSxcbiAgLy8gVGV4dFxuICBwcmV2aW91c1RleHQ6ICdQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCcsXG4gIGxvYWRpbmdUZXh0OiAnTG9hZGluZy4uLicsXG4gIC8vIENvbXBvbmVudHNcbiAgdGFibGVDb21wb25lbnQ6IChwcm9wcykgPT4gPHRhYmxlIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGFibGU+LFxuICB0aGVhZENvbXBvbmVudDogKHByb3BzKSA9PiA8dGhlYWQgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aGVhZD4sXG4gIHRib2R5Q29tcG9uZW50OiAocHJvcHMpID0+IDx0Ym9keSB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3Rib2R5PixcbiAgdHJDb21wb25lbnQ6IChwcm9wcykgPT4gPHRyIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdHI+LFxuICB0aENvbXBvbmVudDogKHByb3BzKSA9PiA8dGggey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90aD4sXG4gIHRkQ29tcG9uZW50OiAocHJvcHMpID0+IDx0ZCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RkPixcbiAgcHJldmlvdXNDb21wb25lbnQ6IG51bGwsXG4gIG5leHRDb21wb25lbnQ6IG51bGwsXG4gIC8vIFVubGlzdGVkXG4gIGRhdGE6IFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0RGVmYXVsdFByb3BzICgpIHtcbiAgICByZXR1cm4gUmVhY3RUYWJsZURlZmF1bHRzXG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvcnRpbmc6IGZhbHNlXG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMudXBkYXRlKHRoaXMucHJvcHMpXG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIHRoaXMudXBkYXRlKG5leHRQcm9wcylcbiAgfSxcbiAgdXBkYXRlIChwcm9wcykge1xuICAgIGNvbnN0IHJlc2V0U3RhdGUgPSB7XG4gICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgIHBhZ2U6IDAsXG4gICAgICBwYWdlczogLTFcbiAgICAgIC8vIGNvbHVtbnM6IHt9ICBmb3IgY29sdW1uIGhpZGluZyBpbiB0aGUgZnV0dXJlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUocmVzZXRTdGF0ZSlcbiAgICBjb25zdCBuZXdTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHJlc2V0U3RhdGUpXG4gICAgdGhpcy5pc0FzeW5jID0gdHlwZW9mIHByb3BzLmRhdGEgPT09ICdmdW5jdGlvbidcbiAgICB0aGlzLmJ1aWxkQ29sdW1ucyhwcm9wcywgbmV3U3RhdGUpXG4gICAgdGhpcy5idWlsZERhdGEocHJvcHMsIG5ld1N0YXRlKVxuICB9LFxuICBidWlsZENvbHVtbnMgKHByb3BzKSB7XG4gICAgdGhpcy5oYXNIZWFkZXJHcm91cHMgPSBmYWxzZVxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmhlYWRlckdyb3VwcyA9IFtdXG4gICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zID0gW11cbiAgICBsZXQgY3VycmVudFNwYW4gPSBbXVxuXG4gICAgY29uc3QgYWRkSGVhZGVyID0gKGNvbHVtbnMsIGNvbHVtbiA9IHt9KSA9PiB7XG4gICAgICB0aGlzLmhlYWRlckdyb3Vwcy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGNvbHVtbiwge1xuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zXG4gICAgICB9KSlcbiAgICAgIGN1cnJlbnRTcGFuID0gW11cbiAgICB9XG4gICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4pID0+IHtcbiAgICAgIGNvbnN0IGRjb2wgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmNvbHVtbiwgY29sdW1uKVxuXG4gICAgICBpZiAodHlwZW9mIGRjb2wuYWNjZXNzb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRjb2wuaWQgPSBkY29sLmlkIHx8IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXG4gICAgICAgIGRjb2wuYWNjZXNzb3IgPSByb3cgPT4gXy5nZXQocm93LCBhY2Nlc3NvclN0cmluZylcbiAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgIH1cblxuICAgICAgaWYgKGRjb2wuYWNjZXNzb3IgJiYgIWRjb2wuaWQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGRjb2wpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQSBjb2x1bW4gaWQgaXMgcmVxdWlyZWQgaWYgdXNpbmcgYSBub24tc3RyaW5nIGFjY2Vzc29yIGZvciBjb2x1bW4gYWJvdmUuJylcbiAgICAgIH1cblxuICAgICAgZGNvbC5hY2Nlc3NvciA9IGQgPT4gdW5kZWZpbmVkXG4gICAgICByZXR1cm4gZGNvbFxuICAgIH1cblxuICAgIHByb3BzLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgY29sdW1uLmNvbHVtbnMuZm9yRWFjaChuZXN0ZWRDb2x1bW4gPT4ge1xuICAgICAgICAgIHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5wdXNoKG1ha2VEZWNvcmF0ZWRDb2x1bW4obmVzdGVkQ29sdW1uKSlcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyR3JvdXBzKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkSGVhZGVyKF8udGFrZVJpZ2h0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucywgY29sdW1uLmNvbHVtbnMubGVuZ3RoKSwgY29sdW1uKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMucHVzaChtYWtlRGVjb3JhdGVkQ29sdW1uKGNvbHVtbikpXG4gICAgICAgIGN1cnJlbnRTcGFuLnB1c2goXy5sYXN0KHRoaXMuZGVjb3JhdGVkQ29sdW1ucykpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLmhhc0hlYWRlckdyb3VwcyAmJiBjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgfVxuICB9LFxuICBnZXRJbml0U29ydGluZyAoKSB7XG4gICAgY29uc3QgaW5pdFNvcnRpbmcgPSB0aGlzLmRlY29yYXRlZENvbHVtbnMuZmlsdGVyKGQgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkLnNvcnQgIT09ICd1bmRlZmluZWQnXG4gICAgfSkubWFwKGQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgIGFzYzogZC5zb3J0ID09PSAnYXNjJ1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaW5pdFNvcnRpbmcubGVuZ3RoID8gaW5pdFNvcnRpbmcgOiBbe1xuICAgICAgaWQ6IHRoaXMuZGVjb3JhdGVkQ29sdW1uc1swXS5pZCxcbiAgICAgIGFzYzogdHJ1ZVxuICAgIH1dXG4gIH0sXG4gIGJ1aWxkRGF0YSAocHJvcHMsIHN0YXRlKSB7XG4gICAgY29uc3Qgc29ydGluZyA9IHN0YXRlLnNvcnRpbmcgPT09IGZhbHNlID8gdGhpcy5nZXRJbml0U29ydGluZygpIDogc3RhdGUuc29ydGluZ1xuXG4gICAgY29uc3Qgc2V0RGF0YSA9IChkYXRhKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc29ydGluZyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcGFnZTogc3RhdGUucGFnZSxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNBc3luYykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNiID0gKHJlcykgPT4ge1xuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnVWggT2ghIE5vdGhpbmcgd2FzIHJldHVybmVkIGluIFJlYWN0VGFibGVcXCdzIGRhdGEgY2FsbGJhY2shJylcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzLnBhZ2VzKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwYWdlczogcmVzLnBhZ2VzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBPbmx5IGFjY2VzcyB0aGUgZGF0YS4gU29ydGluZyBpcyBkb25lIHNlcnZlciBzaWRlLlxuICAgICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocmVzLnJvd3MpXG4gICAgICAgIHNldERhdGEoYWNjZXNzZWREYXRhKVxuICAgICAgfVxuXG4gICAgICAvLyBGZXRjaCBkYXRhIHdpdGggY3VycmVudCBzdGF0ZVxuICAgICAgY29uc3QgZGF0YVJlcyA9IHByb3BzLmRhdGEoe1xuICAgICAgICBzb3J0aW5nLFxuICAgICAgICBwYWdlOiBzdGF0ZS5wYWdlIHx8IDAsXG4gICAgICAgIHBhZ2VTaXplOiBwcm9wcy5wYWdlU2l6ZSxcbiAgICAgICAgcGFnZXM6IHN0YXRlLnBhZ2VzXG4gICAgICB9LCBjYilcblxuICAgICAgaWYgKGRhdGFSZXMgJiYgZGF0YVJlcy50aGVuKSB7XG4gICAgICAgIGRhdGFSZXMudGhlbihjYilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmV0dXJuIGxvY2FsbHkgYWNjZXNzZWQsIHNvcnRlZCBkYXRhXG4gICAgICBjb25zdCBhY2Nlc3NlZERhdGEgPSB0aGlzLmFjY2Vzc0RhdGEocHJvcHMuZGF0YSlcbiAgICAgIGNvbnN0IHNvcnRlZERhdGEgPSB0aGlzLnNvcnREYXRhKGFjY2Vzc2VkRGF0YSwgc29ydGluZylcbiAgICAgIHNldERhdGEoc29ydGVkRGF0YSlcbiAgICB9XG4gIH0sXG4gIGFjY2Vzc0RhdGEgKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IHtcbiAgICAgICAgX19vcmlnaW5hbDogZCxcbiAgICAgICAgX19pbmRleDogaVxuICAgICAgfVxuICAgICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgcm93W2NvbHVtbi5pZF0gPSBjb2x1bW4uYWNjZXNzb3IoZClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcm93XG4gICAgfSlcbiAgfSxcbiAgc29ydERhdGEgKGRhdGEsIHNvcnRpbmcpIHtcbiAgICBjb25zdCByZXNvbHZlZFNvcnRpbmcgPSBzb3J0aW5nLmxlbmd0aCA/IHNvcnRpbmcgOiB0aGlzLmdldEluaXRTb3J0aW5nKClcbiAgICByZXR1cm4gXy5vcmRlckJ5KGRhdGEsIHJlc29sdmVkU29ydGluZy5tYXAoc29ydCA9PiB7XG4gICAgICByZXR1cm4gcm93ID0+IHtcbiAgICAgICAgaWYgKHJvd1tzb3J0LmlkXSA9PT0gbnVsbCB8fCByb3dbc29ydC5pZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiAtSW5maW5pdHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIHJvd1tzb3J0LmlkXSA9PT0gJ3N0cmluZycgPyByb3dbc29ydC5pZF0udG9Mb3dlckNhc2UoKSA6IHJvd1tzb3J0LmlkXVxuICAgICAgfVxuICAgIH0pLCByZXNvbHZlZFNvcnRpbmcubWFwKGQgPT4gZC5hc2MgPyAnYXNjJyA6ICdkZXNjJykpXG4gIH0sXG4gIHNldFBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAodGhpcy5pc0FzeW5jKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZERhdGEodGhpcy5wcm9wcywgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge3BhZ2V9KSlcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYWdlXG4gICAgfSlcbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLnN0YXRlLmRhdGEgPyB0aGlzLnN0YXRlLmRhdGEgOiBbXVxuXG4gICAgY29uc3QgcGFnZXNMZW5ndGggPSB0aGlzLmlzQXN5bmMgPyB0aGlzLnN0YXRlLnBhZ2VzIDogTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gdGhpcy5wcm9wcy5wYWdlU2l6ZSlcbiAgICBjb25zdCBzdGFydFJvdyA9IHRoaXMucHJvcHMucGFnZVNpemUgKiB0aGlzLnN0YXRlLnBhZ2VcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHRoaXMucHJvcHMucGFnZVNpemVcbiAgICBjb25zdCBwYWdlUm93cyA9IHRoaXMuaXNBc3luYyA/IGRhdGEuc2xpY2UoMCwgdGhpcy5wcm9wcy5wYWdlU2l6ZSkgOiBkYXRhLnNsaWNlKHN0YXJ0Um93LCBlbmRSb3cpXG4gICAgY29uc3QgcGFkUm93cyA9IHBhZ2VzTGVuZ3RoID4gMSA/IF8ucmFuZ2UodGhpcy5wcm9wcy5wYWdlU2l6ZSAtIHBhZ2VSb3dzLmxlbmd0aClcbiAgICAgIDogdGhpcy5wcm9wcy5taW5Sb3dzID8gXy5yYW5nZShNYXRoLm1heCh0aGlzLnByb3BzLm1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxuICAgICAgOiBbXVxuXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSB0aGlzLnN0YXRlLnBhZ2UgPiAwXG4gICAgY29uc3QgY2FuTmV4dCA9IHRoaXMuc3RhdGUucGFnZSArIDEgPCBwYWdlc0xlbmd0aFxuXG4gICAgY29uc3QgVGFibGVDb21wb25lbnQgPSB0aGlzLnByb3BzLnRhYmxlQ29tcG9uZW50XG4gICAgY29uc3QgVGhlYWRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoZWFkQ29tcG9uZW50XG4gICAgY29uc3QgVGJvZHlDb21wb25lbnQgPSB0aGlzLnByb3BzLnRib2R5Q29tcG9uZW50XG4gICAgY29uc3QgVHJDb21wb25lbnQgPSB0aGlzLnByb3BzLnRyQ29tcG9uZW50XG4gICAgY29uc3QgVGhDb21wb25lbnQgPSB0aGlzLnByb3BzLnRoQ29tcG9uZW50XG4gICAgY29uc3QgVGRDb21wb25lbnQgPSB0aGlzLnByb3BzLnRkQ29tcG9uZW50XG5cbiAgICBjb25zdCBQcmV2aW91c0NvbXBvbmVudCA9IHRoaXMucHJvcHMucHJldmlvdXNDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuICAgIGNvbnN0IE5leHRDb21wb25lbnQgPSB0aGlzLnByb3BzLm5leHRDb21wb25lbnQgfHwgZGVmYXVsdEJ1dHRvblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMuY2xhc3NOYW1lLCAnUmVhY3RUYWJsZScpfVxuICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cbiAgICAgID5cbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGFibGVDbGFzc05hbWUpfVxuICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnRhYmxlU3R5bGV9XG4gICAgICAgID5cbiAgICAgICAgICB7dGhpcy5oYXNIZWFkZXJHcm91cHMgJiYgKFxuICAgICAgICAgICAgPFRoZWFkQ29tcG9uZW50XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRoZWFkR3JvdXBDbGFzc05hbWUsICctaGVhZGVyR3JvdXBzJyl9XG4gICAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnRoZWFkU3R5bGV9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxUckNvbXBvbmVudFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy50ckNsYXNzTmFtZX1cbiAgICAgICAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy50clN0eWxlfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RoaXMuaGVhZGVyR3JvdXBzLm1hcCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8VGhDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICAgICAgY29sU3Bhbj17Y29sdW1uLmNvbHVtbnMubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRoQ2xhc3NuYW1lLCBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy50aFN0eWxlLCBjb2x1bW4uaGVhZGVyU3R5bGUpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5oZWFkZXJJbm5lckNsYXNzTmFtZSwgJy10aC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudGhJbm5lclN0eWxlLCBjb2x1bW4uaGVhZGVySW5uZXJTdHlsZSl9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiBjb2x1bW4uaGVhZGVyID09PSAnZnVuY3Rpb24nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sdW1uLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE9e3RoaXMucHJvcHMuZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBjb2x1bW4uaGVhZGVyfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxUaGVhZENvbXBvbmVudFxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGhlYWRDbGFzc05hbWUpfVxuICAgICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMudGhlYWRTdHlsZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLnRyQ2xhc3NOYW1lfVxuICAgICAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy50clN0eWxlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc29ydCA9IHRoaXMuc3RhdGUuc29ydGluZy5maW5kKGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxuICAgICAgICAgICAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPFRoQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMudGhDbGFzc25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uLmhlYWRlckNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBzb3J0ID8gKHNvcnQuYXNjID8gJy1zb3J0LWFzYycgOiAnLXNvcnQtZGVzYycpIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJy1jdXJzb3ItcG9pbnRlcic6IGNvbHVtbi5zb3J0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICctaGlkZGVuJzogIXNob3dcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnRoU3R5bGUsIGNvbHVtbi5oZWFkZXJTdHlsZSl9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNvcnRhYmxlICYmIHRoaXMuc29ydENvbHVtbihjb2x1bW4sIGUuc2hpZnRLZXkpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmhlYWRlcklubmVyQ2xhc3NOYW1lLCAnLXRoLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIGNvbHVtbi5oZWFkZXJJbm5lclN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogY29sdW1uLm1pbldpZHRoICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiBjb2x1bW4uaGVhZGVyID09PSAnZnVuY3Rpb24nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbHVtbi5oZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW49e2NvbHVtbn1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IGNvbHVtbi5oZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9UaENvbXBvbmVudD5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgICAgIDxUYm9keUNvbXBvbmVudFxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGJvZHlDbGFzc05hbWUpfVxuICAgICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMudGJvZHlTdHlsZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cGFnZVJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgcm93SW5mbyA9IHtcbiAgICAgICAgICAgICAgICByb3c6IHJvdy5fX29yaWdpbmFsLFxuICAgICAgICAgICAgICAgIGluZGV4OiByb3cuX19pbmRleCxcbiAgICAgICAgICAgICAgICB2aWV3SW5kZXg6IGlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxUckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudHJDbGFzc05hbWUsIHRoaXMucHJvcHMudHJDbGFzc0NhbGxiYWNrKHJvd0luZm8pKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnRyU3R5bGUsIHRoaXMucHJvcHMudHJTdHlsZUNhbGxiYWNrKHJvd0luZm8pKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBDZWxsID0gY29sdW1uLnJlbmRlclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2kyfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5jbGFzc05hbWUsIHtoaWRkZW46ICFzaG93fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy50ZFN0eWxlLCBjb2x1bW4uc3R5bGUpfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5pbm5lckNsYXNzTmFtZSwgJy10ZC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgY29sdW1uLmlubmVyU3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogY29sdW1uLm1pbldpZHRoICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiBDZWxsID09PSAnZnVuY3Rpb24nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cm93W2NvbHVtbi5pZF19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Li4ucm93SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiB0eXBlb2YgQ2VsbCAhPT0gJ3VuZGVmaW5lZCcgPyBDZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogcm93W2NvbHVtbi5pZF19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIHtwYWRSb3dzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50ckNsYXNzTmFtZSwgJy1wYWRSb3cnKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnRyU3R5bGV9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3RoaXMuZGVjb3JhdGVkQ29sdW1ucy5tYXAoKGNvbHVtbiwgaTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxUZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpMn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uY2xhc3NOYW1lLCB7aGlkZGVuOiAhc2hvd30pfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudGRTdHlsZSwgY29sdW1uLnN0eWxlKX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uaW5uZXJDbGFzc05hbWUsICctdGQtaW5uZXInKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIGNvbHVtbi5pbm5lclN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IGNvbHVtbi5taW5XaWR0aCArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA+Jm5ic3A7PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9UZENvbXBvbmVudD5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9UYm9keUNvbXBvbmVudD5cbiAgICAgICAgPC9UYWJsZUNvbXBvbmVudD5cbiAgICAgICAge3BhZ2VzTGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMucGFnaW5hdGlvbkNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9XG4gICAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5wYWdpbmF0aW9uU3R5bGV9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1sZWZ0Jz5cbiAgICAgICAgICAgICAgPFByZXZpb3VzQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgb25DbGljaz17Y2FuUHJldmlvdXMgJiYgKChlKSA9PiB0aGlzLnByZXZpb3VzUGFnZShlKSl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5QcmV2aW91c31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cbiAgICAgICAgICAgICAgPC9QcmV2aW91c0NvbXBvbmVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1jZW50ZXInPlxuICAgICAgICAgICAgICBQYWdlIHt0aGlzLnN0YXRlLnBhZ2UgKyAxfSBvZiB7cGFnZXNMZW5ndGh9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctcmlnaHQnPlxuICAgICAgICAgICAgICA8TmV4dENvbXBvbmVudFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Nhbk5leHQgJiYgKChlKSA9PiB0aGlzLm5leHRQYWdlKGUpKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhbk5leHR9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cbiAgICAgICAgICAgICAgPC9OZXh0Q29tcG9uZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctbG9hZGluZycsIHsnLWFjdGl2ZSc6IHRoaXMuc3RhdGUubG9hZGluZ30pfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWxvYWRpbmctaW5uZXInPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubG9hZGluZ1RleHR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxuICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XG4gICAgY29uc3QgZXhpc3RpbmdTb3J0aW5nID0gdGhpcy5zdGF0ZS5zb3J0aW5nIHx8IFtdXG4gICAgbGV0IHNvcnRpbmcgPSBfLmNsb25lKHRoaXMuc3RhdGUuc29ydGluZyB8fCBbXSlcbiAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gc29ydGluZy5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXG4gICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBzb3J0aW5nW2V4aXN0aW5nSW5kZXhdXG4gICAgICBpZiAoZXhpc3RpbmcuYXNjKSB7XG4gICAgICAgIGV4aXN0aW5nLmFzYyA9IGZhbHNlXG4gICAgICAgIGlmICghYWRkaXRpdmUpIHtcbiAgICAgICAgICBzb3J0aW5nID0gW2V4aXN0aW5nXVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICBzb3J0aW5nLnNwbGljZShleGlzdGluZ0luZGV4LCAxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXN0aW5nLmFzYyA9IHRydWVcbiAgICAgICAgICBzb3J0aW5nID0gW2V4aXN0aW5nXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICBzb3J0aW5nLnB1c2goe1xuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgYXNjOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3J0aW5nID0gW3tcbiAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgIGFzYzogdHJ1ZVxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwYWdlID0gKGV4aXN0aW5nSW5kZXggPT09IDAgfHwgKCFleGlzdGluZ1NvcnRpbmcubGVuZ3RoICYmIHNvcnRpbmcubGVuZ3RoKSB8fCAhYWRkaXRpdmUpID8gMCA6IHRoaXMuc3RhdGUucGFnZVxuICAgIHRoaXMuYnVpbGREYXRhKHRoaXMucHJvcHMsIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUsIHtwYWdlLCBzb3J0aW5nfSkpXG4gIH0sXG4gIG5leHRQYWdlIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRQYWdlKHRoaXMuc3RhdGUucGFnZSArIDEpXG4gIH0sXG4gIHByZXZpb3VzUGFnZSAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuc2V0UGFnZSh0aGlzLnN0YXRlLnBhZ2UgLSAxKVxuICB9XG59KVxuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vIFV0aWxzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuZnVuY3Rpb24gcmVtb3ZlIChhLCBiKSB7XG4gIHJldHVybiBhLmZpbHRlcihmdW5jdGlvbiAobywgaSkge1xuICAgIHZhciByID0gYihvKVxuICAgIGlmIChyKSB7XG4gICAgICBhLnNwbGljZShpLCAxKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldCAoYSwgYikge1xuICBpZiAoaXNBcnJheShiKSkge1xuICAgIGIgPSBiLmpvaW4oJy4nKVxuICB9XG4gIHJldHVybiBiXG4gICAgLnJlcGxhY2UoJ1snLCAnLicpLnJlcGxhY2UoJ10nLCAnJylcbiAgICAuc3BsaXQoJy4nKVxuICAgIC5yZWR1Y2UoXG4gICAgICBmdW5jdGlvbiAob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gb2JqW3Byb3BlcnR5XVxuICAgICAgfSwgYVxuICAgIClcbn1cblxuZnVuY3Rpb24gdGFrZVJpZ2h0IChhcnIsIG4pIHtcbiAgY29uc3Qgc3RhcnQgPSBuID4gYXJyLmxlbmd0aCA/IDAgOiBhcnIubGVuZ3RoIC0gblxuICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0KVxufVxuXG5mdW5jdGlvbiBsYXN0IChhcnIpIHtcbiAgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV1cbn1cblxuZnVuY3Rpb24gcmFuZ2UgKG4pIHtcbiAgY29uc3QgYXJyID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICBhcnIucHVzaChuKVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gb3JkZXJCeSAoYXJyLCBmdW5jcywgZGlycykge1xuICByZXR1cm4gYXJyLnNvcnQoKGEsIGIpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZ1bmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjb21wID0gZnVuY3NbaV1cbiAgICAgIGNvbnN0IGNhID0gY29tcChhKVxuICAgICAgY29uc3QgY2IgPSBjb21wKGIpXG4gICAgICBjb25zdCBkZXNjID0gZGlyc1tpXSA9PT0gZmFsc2UgfHwgZGlyc1tpXSA9PT0gJ2Rlc2MnXG4gICAgICBpZiAoY2EgPiBjYikge1xuICAgICAgICByZXR1cm4gZGVzYyA/IC0xIDogMVxuICAgICAgfVxuICAgICAgaWYgKGNhIDwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MgPyAxIDogLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2xvbmUgKGEpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfSkpXG59XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gSGVscGVyc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGEpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSlcbn1cbiJdfQ==