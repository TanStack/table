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
            style: (0, _classnames2.default)(this.props.tbodyStyle)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJfIiwiZ2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsImNsb25lIiwicmVtb3ZlIiwiZGVmYXVsdEJ1dHRvbiIsInByb3BzIiwiY2hpbGRyZW4iLCJSZWFjdFRhYmxlRGVmYXVsdHMiLCJjbGFzc05hbWUiLCJ0YWJsZUNsYXNzTmFtZSIsInRoZWFkQ2xhc3NOYW1lIiwidGJvZHlDbGFzc05hbWUiLCJ0ckNsYXNzTmFtZSIsInRyQ2xhc3NDYWxsYmFjayIsInRoQ2xhc3NOYW1lIiwidGhHcm91cENsYXNzTmFtZSIsInRkQ2xhc3NOYW1lIiwicGFnaW5hdGlvbkNsYXNzTmFtZSIsInN0eWxlIiwidGFibGVTdHlsZSIsInRoZWFkU3R5bGUiLCJ0Ym9keVN0eWxlIiwidHJTdHlsZSIsInRyU3R5bGVDYWxsYmFjayIsInRoU3R5bGUiLCJ0ZFN0eWxlIiwicGFnaW5hdGlvblN0eWxlIiwicGFnZVNpemUiLCJtaW5Sb3dzIiwiY29sdW1uIiwic29ydGFibGUiLCJzaG93IiwiaW5uZXJDbGFzc05hbWUiLCJpbm5lclN0eWxlIiwiaGVhZGVyQ2xhc3NOYW1lIiwiaGVhZGVyU3R5bGUiLCJoZWFkZXJJbm5lckNsYXNzTmFtZSIsImhlYWRlcklubmVyU3R5bGUiLCJwcmV2aW91c1RleHQiLCJuZXh0VGV4dCIsImxvYWRpbmdUZXh0IiwidGFibGVDb21wb25lbnQiLCJ0aGVhZENvbXBvbmVudCIsInRib2R5Q29tcG9uZW50IiwidHJDb21wb25lbnQiLCJ0aENvbXBvbmVudCIsInRkQ29tcG9uZW50IiwicHJldmlvdXNDb21wb25lbnQiLCJuZXh0Q29tcG9uZW50IiwiZGF0YSIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0SW5pdGlhbFN0YXRlIiwic29ydGluZyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJyZXNldFN0YXRlIiwibG9hZGluZyIsInBhZ2UiLCJwYWdlcyIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImlzQXN5bmMiLCJidWlsZENvbHVtbnMiLCJidWlsZERhdGEiLCJoYXNIZWFkZXJHcm91cHMiLCJjb2x1bW5zIiwiZm9yRWFjaCIsImhlYWRlckdyb3VwcyIsImRlY29yYXRlZENvbHVtbnMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsInB1c2giLCJtYWtlRGVjb3JhdGVkQ29sdW1uIiwiZGNvbCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJpIiwibmVzdGVkQ29sdW1uIiwibGVuZ3RoIiwiZ2V0SW5pdFNvcnRpbmciLCJpbml0U29ydGluZyIsImZpbHRlciIsImQiLCJzb3J0IiwibWFwIiwiYXNjIiwic2V0RGF0YSIsImNiIiwicmVzIiwiUHJvbWlzZSIsInJlamVjdCIsImFjY2Vzc2VkRGF0YSIsImFjY2Vzc0RhdGEiLCJyb3dzIiwiZGF0YVJlcyIsInRoZW4iLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJfX29yaWdpbmFsIiwiX19pbmRleCIsInJlc29sdmVkU29ydGluZyIsIkluZmluaXR5IiwidG9Mb3dlckNhc2UiLCJzZXRQYWdlIiwicmVuZGVyIiwicGFnZXNMZW5ndGgiLCJNYXRoIiwiY2VpbCIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsInBhZFJvd3MiLCJtYXgiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJUYWJsZUNvbXBvbmVudCIsIlRoZWFkQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJ0aGVhZEdyb3VwQ2xhc3NOYW1lIiwidGhDbGFzc25hbWUiLCJ0aElubmVyU3R5bGUiLCJoZWFkZXIiLCJmaW5kIiwiZSIsInNvcnRDb2x1bW4iLCJzaGlmdEtleSIsIm1pbldpZHRoIiwicm93SW5mbyIsImluZGV4Iiwidmlld0luZGV4IiwiaTIiLCJDZWxsIiwiaGlkZGVuIiwicHJldmlvdXNQYWdlIiwibmV4dFBhZ2UiLCJhZGRpdGl2ZSIsImV4aXN0aW5nU29ydGluZyIsImV4aXN0aW5nSW5kZXgiLCJmaW5kSW5kZXgiLCJleGlzdGluZyIsInNwbGljZSIsInByZXZlbnREZWZhdWx0IiwiYSIsImIiLCJvIiwiciIsImlzQXJyYXkiLCJqb2luIiwicmVwbGFjZSIsInNwbGl0IiwicmVkdWNlIiwib2JqIiwicHJvcGVydHkiLCJhcnIiLCJuIiwic3RhcnQiLCJmdW5jcyIsImRpcnMiLCJjb21wIiwiY2EiLCJkZXNjIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5Iiwia2V5IiwidmFsdWUiLCJ0b1N0cmluZyIsIkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUNBO0FBQ0EsSUFBTUEsSUFBSTtBQUNSQyxVQURRO0FBRVJDLHNCQUZRO0FBR1JDLFlBSFE7QUFJUkMsa0JBSlE7QUFLUkMsY0FMUTtBQU1SQyxjQU5RO0FBT1JDO0FBUFEsQ0FBVjs7QUFVQSxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNDLEtBQUQ7QUFBQSxTQUNwQjtBQUFBO0FBQUEsaUJBQVlBLEtBQVosSUFBbUIsV0FBVSxNQUE3QjtBQUFxQ0EsVUFBTUM7QUFBM0MsR0FEb0I7QUFBQSxDQUF0Qjs7QUFJTyxJQUFNQyxrREFBcUI7QUFDaEM7QUFDQUMsYUFBVyxxQkFGcUI7QUFHaENDLGtCQUFnQixFQUhnQjtBQUloQ0Msa0JBQWdCLEVBSmdCO0FBS2hDQyxrQkFBZ0IsRUFMZ0I7QUFNaENDLGVBQWEsRUFObUI7QUFPaENDLG1CQUFpQjtBQUFBLFdBQUssSUFBTDtBQUFBLEdBUGU7QUFRaENDLGVBQWEsRUFSbUI7QUFTaENDLG9CQUFr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S0FBS0QsS0FBS2hCLENBQUwsQ0FBWDtBQUNBLFVBQU03RCxLQUFLNkUsS0FBS2YsQ0FBTCxDQUFYO0FBQ0EsVUFBTWlCLE9BQU9ILEtBQUt2RixDQUFMLE1BQVksS0FBWixJQUFxQnVGLEtBQUt2RixDQUFMLE1BQVksTUFBOUM7QUFDQSxVQUFJeUYsS0FBSzlFLEVBQVQsRUFBYTtBQUNYLGVBQU8rRSxPQUFPLENBQUMsQ0FBUixHQUFZLENBQW5CO0FBQ0Q7QUFDRCxVQUFJRCxLQUFLOUUsRUFBVCxFQUFhO0FBQ1gsZUFBTytFLE9BQU8sQ0FBUCxHQUFXLENBQUMsQ0FBbkI7QUFDRDtBQUNGO0FBQ0QsV0FBTyxDQUFQO0FBQ0QsR0FkTSxDQUFQO0FBZUQ7O0FBRUQsU0FBU2hMLEtBQVQsQ0FBZ0I4SixDQUFoQixFQUFtQjtBQUNqQixTQUFPbUIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVyQixDQUFmLEVBQWtCLFVBQVVzQixHQUFWLEVBQWVDLEtBQWYsRUFBc0I7QUFDeEQsUUFBSSxPQUFPQSxLQUFQLEtBQWlCLFVBQXJCLEVBQWlDO0FBQy9CLGFBQU9BLE1BQU1DLFFBQU4sRUFBUDtBQUNEO0FBQ0QsV0FBT0QsS0FBUDtBQUNELEdBTGlCLENBQVgsQ0FBUDtBQU1EOztBQUVEO0FBQ0E7QUFDQTs7QUFFQSxTQUFTbkIsT0FBVCxDQUFrQkosQ0FBbEIsRUFBcUI7QUFDbkIsU0FBT3lCLE1BQU1yQixPQUFOLENBQWNKLENBQWQsQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbi8vXG5jb25zdCBfID0ge1xuICBnZXQsXG4gIHRha2VSaWdodCxcbiAgbGFzdCxcbiAgb3JkZXJCeSxcbiAgcmFuZ2UsXG4gIGNsb25lLFxuICByZW1vdmVcbn1cblxuY29uc3QgZGVmYXVsdEJ1dHRvbiA9IChwcm9wcykgPT4gKFxuICA8YnV0dG9uIHsuLi5wcm9wc30gY2xhc3NOYW1lPSctYnRuJz57cHJvcHMuY2hpbGRyZW59PC9idXR0b24+XG4pXG5cbmV4cG9ydCBjb25zdCBSZWFjdFRhYmxlRGVmYXVsdHMgPSB7XG4gIC8vIENsYXNzZXNcbiAgY2xhc3NOYW1lOiAnLXN0cmlwZWQgLWhpZ2hsaWdodCcsXG4gIHRhYmxlQ2xhc3NOYW1lOiAnJyxcbiAgdGhlYWRDbGFzc05hbWU6ICcnLFxuICB0Ym9keUNsYXNzTmFtZTogJycsXG4gIHRyQ2xhc3NOYW1lOiAnJyxcbiAgdHJDbGFzc0NhbGxiYWNrOiBkID0+IG51bGwsXG4gIHRoQ2xhc3NOYW1lOiAnJyxcbiAgdGhHcm91cENsYXNzTmFtZTogJycsXG4gIHRkQ2xhc3NOYW1lOiAnJyxcbiAgcGFnaW5hdGlvbkNsYXNzTmFtZTogJycsXG4gIC8vIFN0eWxlc1xuICBzdHlsZToge30sXG4gIHRhYmxlU3R5bGU6IHt9LFxuICB0aGVhZFN0eWxlOiB7fSxcbiAgdGJvZHlTdHlsZToge30sXG4gIHRyU3R5bGU6IHt9LFxuICB0clN0eWxlQ2FsbGJhY2s6IGQgPT4ge30sXG4gIHRoU3R5bGU6IHt9LFxuICB0ZFN0eWxlOiB7fSxcbiAgcGFnaW5hdGlvblN0eWxlOiB7fSxcbiAgLy9cbiAgcGFnZVNpemU6IDIwLFxuICBtaW5Sb3dzOiAwLFxuICAvLyBHbG9iYWwgQ29sdW1uIERlZmF1bHRzXG4gIGNvbHVtbjoge1xuICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgIHNob3c6IHRydWUsXG4gICAgY2xhc3NOYW1lOiAnJyxcbiAgICBzdHlsZToge30sXG4gICAgaW5uZXJDbGFzc05hbWU6ICcnLFxuICAgIGlubmVyU3R5bGU6IHt9LFxuICAgIGhlYWRlckNsYXNzTmFtZTogJycsXG4gICAgaGVhZGVyU3R5bGU6IHt9LFxuICAgIGhlYWRlcklubmVyQ2xhc3NOYW1lOiAnJyxcbiAgICBoZWFkZXJJbm5lclN0eWxlOiB7fVxuICB9LFxuICAvLyBUZXh0XG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcbiAgbmV4dFRleHQ6ICdOZXh0JyxcbiAgbG9hZGluZ1RleHQ6ICdMb2FkaW5nLi4uJyxcbiAgLy8gQ29tcG9uZW50c1xuICB0YWJsZUNvbXBvbmVudDogKHByb3BzKSA9PiA8dGFibGUgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90YWJsZT4sXG4gIHRoZWFkQ29tcG9uZW50OiAocHJvcHMpID0+IDx0aGVhZCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RoZWFkPixcbiAgdGJvZHlDb21wb25lbnQ6IChwcm9wcykgPT4gPHRib2R5IHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGJvZHk+LFxuICB0ckNvbXBvbmVudDogKHByb3BzKSA9PiA8dHIgey4uLnByb3BzfT57cHJvcHMuY2hpbGRyZW59PC90cj4sXG4gIHRoQ29tcG9uZW50OiAocHJvcHMpID0+IDx0aCB7Li4ucHJvcHN9Pntwcm9wcy5jaGlsZHJlbn08L3RoPixcbiAgdGRDb21wb25lbnQ6IChwcm9wcykgPT4gPHRkIHsuLi5wcm9wc30+e3Byb3BzLmNoaWxkcmVufTwvdGQ+LFxuICBwcmV2aW91c0NvbXBvbmVudDogbnVsbCxcbiAgbmV4dENvbXBvbmVudDogbnVsbCxcbiAgLy8gVW5saXN0ZWRcbiAgZGF0YTogW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXREZWZhdWx0UHJvcHMgKCkge1xuICAgIHJldHVybiBSZWFjdFRhYmxlRGVmYXVsdHNcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc29ydGluZzogZmFsc2VcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy51cGRhdGUodGhpcy5wcm9wcylcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgdGhpcy51cGRhdGUobmV4dFByb3BzKVxuICB9LFxuICB1cGRhdGUgKHByb3BzKSB7XG4gICAgY29uc3QgcmVzZXRTdGF0ZSA9IHtcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgcGFnZTogMCxcbiAgICAgIHBhZ2VzOiAtMVxuICAgICAgLy8gY29sdW1uczoge30gIGZvciBjb2x1bW4gaGlkaW5nIGluIHRoZSBmdXR1cmVcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShyZXNldFN0YXRlKVxuICAgIGNvbnN0IG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgcmVzZXRTdGF0ZSlcbiAgICB0aGlzLmlzQXN5bmMgPSB0eXBlb2YgcHJvcHMuZGF0YSA9PT0gJ2Z1bmN0aW9uJ1xuICAgIHRoaXMuYnVpbGRDb2x1bW5zKHByb3BzLCBuZXdTdGF0ZSlcbiAgICB0aGlzLmJ1aWxkRGF0YShwcm9wcywgbmV3U3RhdGUpXG4gIH0sXG4gIGJ1aWxkQ29sdW1ucyAocHJvcHMpIHtcbiAgICB0aGlzLmhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXG4gICAgcHJvcHMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgdGhpcy5oYXNIZWFkZXJHcm91cHMgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuaGVhZGVyR3JvdXBzID0gW11cbiAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMgPSBbXVxuICAgIGxldCBjdXJyZW50U3BhbiA9IFtdXG5cbiAgICBjb25zdCBhZGRIZWFkZXIgPSAoY29sdW1ucywgY29sdW1uID0ge30pID0+IHtcbiAgICAgIHRoaXMuaGVhZGVyR3JvdXBzLnB1c2goT2JqZWN0LmFzc2lnbih7fSwgY29sdW1uLCB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNcbiAgICAgIH0pKVxuICAgICAgY3VycmVudFNwYW4gPSBbXVxuICAgIH1cbiAgICBjb25zdCBtYWtlRGVjb3JhdGVkQ29sdW1uID0gKGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgZGNvbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMuY29sdW1uLCBjb2x1bW4pXG5cbiAgICAgIGlmICh0eXBlb2YgZGNvbC5hY2Nlc3NvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGNvbC5pZCA9IGRjb2wuaWQgfHwgZGNvbC5hY2Nlc3NvclxuICAgICAgICBjb25zdCBhY2Nlc3NvclN0cmluZyA9IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgZGNvbC5hY2Nlc3NvciA9IHJvdyA9PiBfLmdldChyb3csIGFjY2Vzc29yU3RyaW5nKVxuICAgICAgICByZXR1cm4gZGNvbFxuICAgICAgfVxuXG4gICAgICBpZiAoZGNvbC5hY2Nlc3NvciAmJiAhZGNvbC5pZCkge1xuICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGNvbHVtbiBpZCBpcyByZXF1aXJlZCBpZiB1c2luZyBhIG5vbi1zdHJpbmcgYWNjZXNzb3IgZm9yIGNvbHVtbiBhYm92ZS4nKVxuICAgICAgfVxuXG4gICAgICBkY29sLmFjY2Vzc29yID0gZCA9PiB1bmRlZmluZWRcbiAgICAgIHJldHVybiBkY29sXG4gICAgfVxuXG4gICAgcHJvcHMuY29sdW1ucy5mb3JFYWNoKChjb2x1bW4sIGkpID0+IHtcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICBjb2x1bW4uY29sdW1ucy5mb3JFYWNoKG5lc3RlZENvbHVtbiA9PiB7XG4gICAgICAgICAgdGhpcy5kZWNvcmF0ZWRDb2x1bW5zLnB1c2gobWFrZURlY29yYXRlZENvbHVtbihuZXN0ZWRDb2x1bW4pKVxuICAgICAgICB9KVxuICAgICAgICBpZiAodGhpcy5oYXNIZWFkZXJHcm91cHMpIHtcbiAgICAgICAgICBpZiAoY3VycmVudFNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWRkSGVhZGVyKGN1cnJlbnRTcGFuKVxuICAgICAgICAgIH1cbiAgICAgICAgICBhZGRIZWFkZXIoXy50YWtlUmlnaHQodGhpcy5kZWNvcmF0ZWRDb2x1bW5zLCBjb2x1bW4uY29sdW1ucy5sZW5ndGgpLCBjb2x1bW4pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5wdXNoKG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uKSlcbiAgICAgICAgY3VycmVudFNwYW4ucHVzaChfLmxhc3QodGhpcy5kZWNvcmF0ZWRDb2x1bW5zKSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuaGFzSGVhZGVyR3JvdXBzICYmIGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICB9XG4gIH0sXG4gIGdldEluaXRTb3J0aW5nICgpIHtcbiAgICBjb25zdCBpbml0U29ydGluZyA9IHRoaXMuZGVjb3JhdGVkQ29sdW1ucy5maWx0ZXIoZCA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIGQuc29ydCAhPT0gJ3VuZGVmaW5lZCdcbiAgICB9KS5tYXAoZCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogZC5pZCxcbiAgICAgICAgYXNjOiBkLnNvcnQgPT09ICdhc2MnXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBpbml0U29ydGluZy5sZW5ndGggPyBpbml0U29ydGluZyA6IFt7XG4gICAgICBpZDogdGhpcy5kZWNvcmF0ZWRDb2x1bW5zWzBdLmlkLFxuICAgICAgYXNjOiB0cnVlXG4gICAgfV1cbiAgfSxcbiAgYnVpbGREYXRhIChwcm9wcywgc3RhdGUpIHtcbiAgICBjb25zdCBzb3J0aW5nID0gc3RhdGUuc29ydGluZyA9PT0gZmFsc2UgPyB0aGlzLmdldEluaXRTb3J0aW5nKCkgOiBzdGF0ZS5zb3J0aW5nXG5cbiAgICBjb25zdCBzZXREYXRhID0gKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzb3J0aW5nLFxuICAgICAgICBkYXRhLFxuICAgICAgICBwYWdlOiBzdGF0ZS5wYWdlLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0FzeW5jKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9hZGluZzogdHJ1ZVxuICAgICAgfSlcblxuICAgICAgY29uc3QgY2IgPSAocmVzKSA9PiB7XG4gICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdVaCBPaCEgTm90aGluZyB3YXMgcmV0dXJuZWQgaW4gUmVhY3RUYWJsZVxcJ3MgZGF0YSBjYWxsYmFjayEnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXMucGFnZXMpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHBhZ2VzOiByZXMucGFnZXNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIE9ubHkgYWNjZXNzIHRoZSBkYXRhLiBTb3J0aW5nIGlzIGRvbmUgc2VydmVyIHNpZGUuXG4gICAgICAgIGNvbnN0IGFjY2Vzc2VkRGF0YSA9IHRoaXMuYWNjZXNzRGF0YShyZXMucm93cylcbiAgICAgICAgc2V0RGF0YShhY2Nlc3NlZERhdGEpXG4gICAgICB9XG5cbiAgICAgIC8vIEZldGNoIGRhdGEgd2l0aCBjdXJyZW50IHN0YXRlXG4gICAgICBjb25zdCBkYXRhUmVzID0gcHJvcHMuZGF0YSh7XG4gICAgICAgIHNvcnRpbmcsXG4gICAgICAgIHBhZ2U6IHN0YXRlLnBhZ2UgfHwgMCxcbiAgICAgICAgcGFnZVNpemU6IHByb3BzLnBhZ2VTaXplLFxuICAgICAgICBwYWdlczogc3RhdGUucGFnZXNcbiAgICAgIH0sIGNiKVxuXG4gICAgICBpZiAoZGF0YVJlcyAmJiBkYXRhUmVzLnRoZW4pIHtcbiAgICAgICAgZGF0YVJlcy50aGVuKGNiKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZXR1cm4gbG9jYWxseSBhY2Nlc3NlZCwgc29ydGVkIGRhdGFcbiAgICAgIGNvbnN0IGFjY2Vzc2VkRGF0YSA9IHRoaXMuYWNjZXNzRGF0YShwcm9wcy5kYXRhKVxuICAgICAgY29uc3Qgc29ydGVkRGF0YSA9IHRoaXMuc29ydERhdGEoYWNjZXNzZWREYXRhLCBzb3J0aW5nKVxuICAgICAgc2V0RGF0YShzb3J0ZWREYXRhKVxuICAgIH1cbiAgfSxcbiAgYWNjZXNzRGF0YSAoZGF0YSkge1xuICAgIHJldHVybiBkYXRhLm1hcCgoZCwgaSkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0ge1xuICAgICAgICBfX29yaWdpbmFsOiBkLFxuICAgICAgICBfX2luZGV4OiBpXG4gICAgICB9XG4gICAgICB0aGlzLmRlY29yYXRlZENvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICByb3dbY29sdW1uLmlkXSA9IGNvbHVtbi5hY2Nlc3NvcihkKVxuICAgICAgfSlcbiAgICAgIHJldHVybiByb3dcbiAgICB9KVxuICB9LFxuICBzb3J0RGF0YSAoZGF0YSwgc29ydGluZykge1xuICAgIGNvbnN0IHJlc29sdmVkU29ydGluZyA9IHNvcnRpbmcubGVuZ3RoID8gc29ydGluZyA6IHRoaXMuZ2V0SW5pdFNvcnRpbmcoKVxuICAgIHJldHVybiBfLm9yZGVyQnkoZGF0YSwgcmVzb2x2ZWRTb3J0aW5nLm1hcChzb3J0ID0+IHtcbiAgICAgIHJldHVybiByb3cgPT4ge1xuICAgICAgICBpZiAocm93W3NvcnQuaWRdID09PSBudWxsIHx8IHJvd1tzb3J0LmlkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIC1JbmZpbml0eVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2Ygcm93W3NvcnQuaWRdID09PSAnc3RyaW5nJyA/IHJvd1tzb3J0LmlkXS50b0xvd2VyQ2FzZSgpIDogcm93W3NvcnQuaWRdXG4gICAgICB9XG4gICAgfSksIHJlc29sdmVkU29ydGluZy5tYXAoZCA9PiBkLmFzYyA/ICdhc2MnIDogJ2Rlc2MnKSlcbiAgfSxcbiAgc2V0UGFnZSAocGFnZSkge1xuICAgIGlmICh0aGlzLmlzQXN5bmMpIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkRGF0YSh0aGlzLnByb3BzLCBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLCB7cGFnZX0pKVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhZ2VcbiAgICB9KVxuICB9LFxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc3RhdGUuZGF0YSA/IHRoaXMuc3RhdGUuZGF0YSA6IFtdXG5cbiAgICBjb25zdCBwYWdlc0xlbmd0aCA9IHRoaXMuaXNBc3luYyA/IHRoaXMuc3RhdGUucGFnZXMgOiBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyB0aGlzLnByb3BzLnBhZ2VTaXplKVxuICAgIGNvbnN0IHN0YXJ0Um93ID0gdGhpcy5wcm9wcy5wYWdlU2l6ZSAqIHRoaXMuc3RhdGUucGFnZVxuICAgIGNvbnN0IGVuZFJvdyA9IHN0YXJ0Um93ICsgdGhpcy5wcm9wcy5wYWdlU2l6ZVxuICAgIGNvbnN0IHBhZ2VSb3dzID0gdGhpcy5pc0FzeW5jID8gZGF0YS5zbGljZSgwLCB0aGlzLnByb3BzLnBhZ2VTaXplKSA6IGRhdGEuc2xpY2Uoc3RhcnRSb3csIGVuZFJvdylcbiAgICBjb25zdCBwYWRSb3dzID0gcGFnZXNMZW5ndGggPiAxID8gXy5yYW5nZSh0aGlzLnByb3BzLnBhZ2VTaXplIC0gcGFnZVJvd3MubGVuZ3RoKVxuICAgICAgOiB0aGlzLnByb3BzLm1pblJvd3MgPyBfLnJhbmdlKE1hdGgubWF4KHRoaXMucHJvcHMubWluUm93cyAtIHBhZ2VSb3dzLmxlbmd0aCwgMCkpXG4gICAgICA6IFtdXG5cbiAgICBjb25zdCBjYW5QcmV2aW91cyA9IHRoaXMuc3RhdGUucGFnZSA+IDBcbiAgICBjb25zdCBjYW5OZXh0ID0gdGhpcy5zdGF0ZS5wYWdlICsgMSA8IHBhZ2VzTGVuZ3RoXG5cbiAgICBjb25zdCBUYWJsZUNvbXBvbmVudCA9IHRoaXMucHJvcHMudGFibGVDb21wb25lbnRcbiAgICBjb25zdCBUaGVhZENvbXBvbmVudCA9IHRoaXMucHJvcHMudGhlYWRDb21wb25lbnRcbiAgICBjb25zdCBUYm9keUNvbXBvbmVudCA9IHRoaXMucHJvcHMudGJvZHlDb21wb25lbnRcbiAgICBjb25zdCBUckNvbXBvbmVudCA9IHRoaXMucHJvcHMudHJDb21wb25lbnRcbiAgICBjb25zdCBUaENvbXBvbmVudCA9IHRoaXMucHJvcHMudGhDb21wb25lbnRcbiAgICBjb25zdCBUZENvbXBvbmVudCA9IHRoaXMucHJvcHMudGRDb21wb25lbnRcblxuICAgIGNvbnN0IFByZXZpb3VzQ29tcG9uZW50ID0gdGhpcy5wcm9wcy5wcmV2aW91c0NvbXBvbmVudCB8fCBkZWZhdWx0QnV0dG9uXG4gICAgY29uc3QgTmV4dENvbXBvbmVudCA9IHRoaXMucHJvcHMubmV4dENvbXBvbmVudCB8fCBkZWZhdWx0QnV0dG9uXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy5jbGFzc05hbWUsICdSZWFjdFRhYmxlJyl9XG4gICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfVxuICAgICAgPlxuICAgICAgICA8VGFibGVDb21wb25lbnRcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50YWJsZUNsYXNzTmFtZSl9XG4gICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMudGFibGVTdHlsZX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLmhhc0hlYWRlckdyb3VwcyAmJiAoXG4gICAgICAgICAgICA8VGhlYWRDb21wb25lbnRcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGhlYWRHcm91cENsYXNzTmFtZSwgJy1oZWFkZXJHcm91cHMnKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMudGhlYWRTdHlsZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLnRyQ2xhc3NOYW1lfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnRyU3R5bGV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5oZWFkZXJHcm91cHMubWFwKChjb2x1bW4sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgICAgICAgICBjb2xTcGFuPXtjb2x1bW4uY29sdW1ucy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRoaXMucHJvcHMudGhDbGFzc25hbWUsIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUpfVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnRoU3R5bGUsIGNvbHVtbi5oZWFkZXJTdHlsZSl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmhlYWRlcklubmVyQ2xhc3NOYW1lLCAnLXRoLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy50aElubmVyU3R5bGUsIGNvbHVtbi5oZWFkZXJJbm5lclN0eWxlKX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2x1bW4uaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5wcm9wcy5kYXRhfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IGNvbHVtbi5oZWFkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvVGhDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgICAgICl9XG4gICAgICAgICAgPFRoZWFkQ29tcG9uZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50aGVhZENsYXNzTmFtZSl9XG4gICAgICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy50aGVhZFN0eWxlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUckNvbXBvbmVudFxuICAgICAgICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMudHJDbGFzc05hbWV9XG4gICAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnRyU3R5bGV9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0aGlzLmRlY29yYXRlZENvbHVtbnMubWFwKChjb2x1bW4sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3J0ID0gdGhpcy5zdGF0ZS5zb3J0aW5nLmZpbmQoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8VGhDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy50aENsYXNzbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHNvcnQgPyAoc29ydC5hc2MgPyAnLXNvcnQtYXNjJyA6ICctc29ydC1kZXNjJykgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnLWN1cnNvci1wb2ludGVyJzogY29sdW1uLnNvcnRhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy1oaWRkZW4nOiAhc2hvd1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudGhTdHlsZSwgY29sdW1uLmhlYWRlclN0eWxlKX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc29ydGFibGUgJiYgdGhpcy5zb3J0Q29sdW1uKGNvbHVtbiwgZS5zaGlmdEtleSlcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjb2x1bW4uaGVhZGVySW5uZXJDbGFzc05hbWUsICctdGgtaW5uZXInKX1cbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgY29sdW1uLmhlYWRlcklubmVyU3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBjb2x1bW4ubWluV2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIGNvbHVtbi5oZWFkZXIgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sdW1uLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPXt0aGlzLnByb3BzLmRhdGF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbj17Y29sdW1ufVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICApIDogY29sdW1uLmhlYWRlcn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50Ym9keUNsYXNzTmFtZSl9XG4gICAgICAgICAgICBzdHlsZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRib2R5U3R5bGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYWdlUm93cy5tYXAoKHJvdywgaSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByb3dJbmZvID0ge1xuICAgICAgICAgICAgICAgIHJvdzogcm93Ll9fb3JpZ2luYWwsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHJvdy5fX2luZGV4LFxuICAgICAgICAgICAgICAgIHZpZXdJbmRleDogaVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy50ckNsYXNzTmFtZSwgdGhpcy5wcm9wcy50ckNsYXNzQ2FsbGJhY2socm93SW5mbykpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e09iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMudHJTdHlsZSwgdGhpcy5wcm9wcy50clN0eWxlQ2FsbGJhY2socm93SW5mbykpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt0aGlzLmRlY29yYXRlZENvbHVtbnMubWFwKChjb2x1bW4sIGkyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IENlbGwgPSBjb2x1bW4ucmVuZGVyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8VGRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aTJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmNsYXNzTmFtZSwge2hpZGRlbjogIXNob3d9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLnRkU3R5bGUsIGNvbHVtbi5zdHlsZSl9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29sdW1uLmlubmVyQ2xhc3NOYW1lLCAnLXRkLWlubmVyJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtPYmplY3QuYXNzaWduKHt9LCBjb2x1bW4uaW5uZXJTdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiBjb2x1bW4ubWluV2lkdGggKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIENlbGwgPT09ICdmdW5jdGlvbicgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtyb3dbY29sdW1uLmlkXX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsuLi5yb3dJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IHR5cGVvZiBDZWxsICE9PSAndW5kZWZpbmVkJyA/IENlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiByb3dbY29sdW1uLmlkXX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvVGRDb21wb25lbnQ+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAge3BhZFJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0aGlzLnByb3BzLnRyQ2xhc3NOYW1lLCAnLXBhZFJvdycpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3RoaXMucHJvcHMudHJTdHlsZX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dGhpcy5kZWNvcmF0ZWRDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2kyfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5jbGFzc05hbWUsIHtoaWRkZW46ICFzaG93fSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy50ZFN0eWxlLCBjb2x1bW4uc3R5bGUpfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbHVtbi5pbm5lckNsYXNzTmFtZSwgJy10ZC1pbm5lcicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgY29sdW1uLmlubmVyU3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5XaWR0aDogY29sdW1uLm1pbldpZHRoICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgID4mbmJzcDs8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L1Rib2R5Q29tcG9uZW50PlxuICAgICAgICA8L1RhYmxlQ29tcG9uZW50PlxuICAgICAgICB7cGFnZXNMZW5ndGggPiAxICYmIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGhpcy5wcm9wcy5wYWdpbmF0aW9uQ2xhc3NOYW1lLCAnLXBhZ2luYXRpb24nKX1cbiAgICAgICAgICAgIHN0eWxlPXt0aGlzLnByb3BzLnBhZ2luYXRpb25TdHlsZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWxlZnQnPlxuICAgICAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtjYW5QcmV2aW91cyAmJiAoKGUpID0+IHRoaXMucHJldmlvdXNQYWdlKGUpKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxuICAgICAgICAgICAgICA8L1ByZXZpb3VzQ29tcG9uZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nLWNlbnRlcic+XG4gICAgICAgICAgICAgIFBhZ2Uge3RoaXMuc3RhdGUucGFnZSArIDF9IG9mIHtwYWdlc0xlbmd0aH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9Jy1yaWdodCc+XG4gICAgICAgICAgICAgIDxOZXh0Q29tcG9uZW50XG4gICAgICAgICAgICAgICAgb25DbGljaz17Y2FuTmV4dCAmJiAoKGUpID0+IHRoaXMubmV4dFBhZ2UoZSkpfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLm5leHRUZXh0fVxuICAgICAgICAgICAgICA8L05leHRDb21wb25lbnQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1sb2FkaW5nJywgeyctYWN0aXZlJzogdGhpcy5zdGF0ZS5sb2FkaW5nfSl9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSctbG9hZGluZy1pbm5lcic+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sb2FkaW5nVGV4dH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG4gIHNvcnRDb2x1bW4gKGNvbHVtbiwgYWRkaXRpdmUpIHtcbiAgICBjb25zdCBleGlzdGluZ1NvcnRpbmcgPSB0aGlzLnN0YXRlLnNvcnRpbmcgfHwgW11cbiAgICBsZXQgc29ydGluZyA9IF8uY2xvbmUodGhpcy5zdGF0ZS5zb3J0aW5nIHx8IFtdKVxuICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBzb3J0aW5nLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICBpZiAoZXhpc3RpbmdJbmRleCA+IC0xKSB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHNvcnRpbmdbZXhpc3RpbmdJbmRleF1cbiAgICAgIGlmIChleGlzdGluZy5hc2MpIHtcbiAgICAgICAgZXhpc3RpbmcuYXNjID0gZmFsc2VcbiAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xuICAgICAgICAgIHNvcnRpbmcgPSBbZXhpc3RpbmddXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgIHNvcnRpbmcuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpc3RpbmcuYXNjID0gdHJ1ZVxuICAgICAgICAgIHNvcnRpbmcgPSBbZXhpc3RpbmddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgIHNvcnRpbmcucHVzaCh7XG4gICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICBhc2M6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvcnRpbmcgPSBbe1xuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgYXNjOiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHBhZ2UgPSAoZXhpc3RpbmdJbmRleCA9PT0gMCB8fCAoIWV4aXN0aW5nU29ydGluZy5sZW5ndGggJiYgc29ydGluZy5sZW5ndGgpIHx8ICFhZGRpdGl2ZSkgPyAwIDogdGhpcy5zdGF0ZS5wYWdlXG4gICAgdGhpcy5idWlsZERhdGEodGhpcy5wcm9wcywgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwge3BhZ2UsIHNvcnRpbmd9KSlcbiAgfSxcbiAgbmV4dFBhZ2UgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLnNldFBhZ2UodGhpcy5zdGF0ZS5wYWdlICsgMSlcbiAgfSxcbiAgcHJldmlvdXNQYWdlIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRQYWdlKHRoaXMuc3RhdGUucGFnZSAtIDEpXG4gIH1cbn0pXG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gVXRpbHNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5mdW5jdGlvbiByZW1vdmUgKGEsIGIpIHtcbiAgcmV0dXJuIGEuZmlsdGVyKGZ1bmN0aW9uIChvLCBpKSB7XG4gICAgdmFyIHIgPSBiKG8pXG4gICAgaWYgKHIpIHtcbiAgICAgIGEuc3BsaWNlKGksIDEpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0IChhLCBiKSB7XG4gIGlmIChpc0FycmF5KGIpKSB7XG4gICAgYiA9IGIuam9pbignLicpXG4gIH1cbiAgcmV0dXJuIGJcbiAgICAucmVwbGFjZSgnWycsICcuJykucmVwbGFjZSgnXScsICcnKVxuICAgIC5zcGxpdCgnLicpXG4gICAgLnJlZHVjZShcbiAgICAgIGZ1bmN0aW9uIChvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcGVydHldXG4gICAgICB9LCBhXG4gICAgKVxufVxuXG5mdW5jdGlvbiB0YWtlUmlnaHQgKGFyciwgbikge1xuICBjb25zdCBzdGFydCA9IG4gPiBhcnIubGVuZ3RoID8gMCA6IGFyci5sZW5ndGggLSBuXG4gIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQpXG59XG5cbmZ1bmN0aW9uIGxhc3QgKGFycikge1xuICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXVxufVxuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICBjb25zdCBhcnIgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIGFyci5wdXNoKG4pXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBvcmRlckJ5IChhcnIsIGZ1bmNzLCBkaXJzKSB7XG4gIHJldHVybiBhcnIuc29ydCgoYSwgYikgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnVuY3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbXAgPSBmdW5jc1tpXVxuICAgICAgY29uc3QgY2EgPSBjb21wKGEpXG4gICAgICBjb25zdCBjYiA9IGNvbXAoYilcbiAgICAgIGNvbnN0IGRlc2MgPSBkaXJzW2ldID09PSBmYWxzZSB8fCBkaXJzW2ldID09PSAnZGVzYydcbiAgICAgIGlmIChjYSA+IGNiKSB7XG4gICAgICAgIHJldHVybiBkZXNjID8gLTEgOiAxXG4gICAgICB9XG4gICAgICBpZiAoY2EgPCBjYikge1xuICAgICAgICByZXR1cm4gZGVzYyA/IDEgOiAtMVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5mdW5jdGlvbiBjbG9uZSAoYSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9KSlcbn1cblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyBIZWxwZXJzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuZnVuY3Rpb24gaXNBcnJheSAoYSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhKVxufVxuIl19