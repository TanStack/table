'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'getResolvedState',
      value: function getResolvedState(props, state) {
        var resolvedState = _extends({}, _utils2.default.compactObject(this.state), _utils2.default.compactObject(this.props), _utils2.default.compactObject(state), _utils2.default.compactObject(props));
        return resolvedState;
      }
    }, {
      key: 'getDataModel',
      value: function getDataModel(newState, dataChanged) {
        var _this2 = this;

        var columns = newState.columns,
            _newState$pivotBy = newState.pivotBy,
            pivotBy = _newState$pivotBy === undefined ? [] : _newState$pivotBy,
            data = newState.data,
            resolveData = newState.resolveData,
            pivotIDKey = newState.pivotIDKey,
            pivotValKey = newState.pivotValKey,
            subRowsKey = newState.subRowsKey,
            aggregatedKey = newState.aggregatedKey,
            nestingLevelKey = newState.nestingLevelKey,
            originalKey = newState.originalKey,
            indexKey = newState.indexKey,
            groupedByPivotKey = newState.groupedByPivotKey,
            SubComponent = newState.SubComponent;

        // Determine Header Groups

        var hasHeaderGroups = false;
        columns.forEach(function (column) {
          if (column.columns) {
            hasHeaderGroups = true;
          }
        });

        var columnsWithExpander = [].concat(_toConsumableArray(columns));

        var expanderColumn = columns.find(function (col) {
          return col.expander || col.columns && col.columns.some(function (col2) {
            return col2.expander;
          });
        });
        // The actual expander might be in the columns field of a group column
        if (expanderColumn && !expanderColumn.expander) {
          expanderColumn = expanderColumn.columns.find(function (col) {
            return col.expander;
          });
        }

        // If we have SubComponent's we need to make sure we have an expander column
        if (SubComponent && !expanderColumn) {
          expanderColumn = { expander: true };
          columnsWithExpander = [expanderColumn].concat(_toConsumableArray(columnsWithExpander));
        }

        var makeDecoratedColumn = function makeDecoratedColumn(column, parentColumn) {
          var dcol = void 0;
          if (column.expander) {
            dcol = _extends({}, _this2.props.column, _this2.props.expanderDefaults, column);
          } else {
            dcol = _extends({}, _this2.props.column, column);
          }

          // Ensure minWidth is not greater than maxWidth if set
          if (dcol.maxWidth < dcol.minWidth) {
            dcol.minWidth = dcol.maxWidth;
          }

          if (parentColumn) {
            dcol.parentColumn = parentColumn;
          }

          // First check for string accessor
          if (typeof dcol.accessor === 'string') {
            dcol.id = dcol.id || dcol.accessor;
            var accessorString = dcol.accessor;
            dcol.accessor = function (row) {
              return _utils2.default.get(row, accessorString);
            };
            return dcol;
          }

          // Fall back to functional accessor (but require an ID)
          if (dcol.accessor && !dcol.id) {
            console.warn(dcol);
            throw new Error('A column id is required if using a non-string accessor for column above.');
          }

          // Fall back to an undefined accessor
          if (!dcol.accessor) {
            dcol.accessor = function () {
              return undefined;
            };
          }

          return dcol;
        };

        var allDecoratedColumns = [];

        // Decorate the columns
        var decorateAndAddToAll = function decorateAndAddToAll(column, parentColumn) {
          var decoratedColumn = makeDecoratedColumn(column, parentColumn);
          allDecoratedColumns.push(decoratedColumn);
          return decoratedColumn;
        };

        var decoratedColumns = columnsWithExpander.map(function (column) {
          if (column.columns) {
            return _extends({}, column, {
              columns: column.columns.map(function (d) {
                return decorateAndAddToAll(d, column);
              })
            });
          }
          return decorateAndAddToAll(column);
        });

        // Build the visible columns, headers and flat column list
        var visibleColumns = decoratedColumns.slice();
        var allVisibleColumns = [];

        visibleColumns = visibleColumns.map(function (column) {
          if (column.columns) {
            var visibleSubColumns = column.columns.filter(function (d) {
              return pivotBy.indexOf(d.id) > -1 ? false : _utils2.default.getFirstDefined(d.show, true);
            });
            return _extends({}, column, {
              columns: visibleSubColumns
            });
          }
          return column;
        });

        visibleColumns = visibleColumns.filter(function (column) {
          return column.columns ? column.columns.length : pivotBy.indexOf(column.id) > -1 ? false : _utils2.default.getFirstDefined(column.show, true);
        });

        // Find any custom pivot location
        var pivotIndex = visibleColumns.findIndex(function (col) {
          return col.pivot;
        });

        // Handle Pivot Columns
        if (pivotBy.length) {
          // Retrieve the pivot columns in the correct pivot order
          var pivotColumns = [];
          pivotBy.forEach(function (pivotID) {
            var found = allDecoratedColumns.find(function (d) {
              return d.id === pivotID;
            });
            if (found) {
              pivotColumns.push(found);
            }
          });

          var PivotParentColumn = pivotColumns.reduce(function (prev, current) {
            return prev && prev === current.parentColumn && current.parentColumn;
          }, pivotColumns[0].parentColumn);

          var PivotGroupHeader = hasHeaderGroups && PivotParentColumn.Header;
          PivotGroupHeader = PivotGroupHeader || function () {
            return _react2.default.createElement(
              'strong',
              null,
              'Pivoted'
            );
          };

          var pivotColumnGroup = {
            Header: PivotGroupHeader,
            columns: pivotColumns.map(function (col) {
              return _extends({}, _this2.props.pivotDefaults, col, {
                pivoted: true
              });
            })

            // Place the pivotColumns back into the visibleColumns
          };if (pivotIndex >= 0) {
            pivotColumnGroup = _extends({}, visibleColumns[pivotIndex], pivotColumnGroup);
            visibleColumns.splice(pivotIndex, 1, pivotColumnGroup);
          } else {
            visibleColumns.unshift(pivotColumnGroup);
          }
        }

        // Build Header Groups
        var headerGroups = [];
        var currentSpan = [];

        // A convenience function to add a header and reset the currentSpan
        var addHeader = function addHeader(columns, column) {
          headerGroups.push(_extends({}, _this2.props.column, column, {
            columns: columns
          }));
          currentSpan = [];
        };

        // Build flast list of allVisibleColumns and HeaderGroups
        visibleColumns.forEach(function (column) {
          if (column.columns) {
            allVisibleColumns = allVisibleColumns.concat(column.columns);
            if (currentSpan.length > 0) {
              addHeader(currentSpan);
            }
            addHeader(column.columns, column);
            return;
          }
          allVisibleColumns.push(column);
          currentSpan.push(column);
        });
        if (hasHeaderGroups && currentSpan.length > 0) {
          addHeader(currentSpan);
        }

        // Access the data
        var accessRow = function accessRow(d, i) {
          var _row;

          var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

          var row = (_row = {}, _defineProperty(_row, originalKey, d), _defineProperty(_row, indexKey, i), _defineProperty(_row, subRowsKey, d[subRowsKey]), _defineProperty(_row, nestingLevelKey, level), _row);
          allDecoratedColumns.forEach(function (column) {
            if (column.expander) return;
            row[column.id] = column.accessor(d);
          });
          if (row[subRowsKey]) {
            row[subRowsKey] = row[subRowsKey].map(function (d, i) {
              return accessRow(d, i, level + 1);
            });
          }
          return row;
        };

        // // If the data hasn't changed, just use the cached data
        var resolvedData = this.resolvedData;
        // If the data has changed, run the data resolver and cache the result
        if (!this.resolvedData || dataChanged) {
          resolvedData = resolveData(data);
          this.resolvedData = resolvedData;
        }
        // Use the resolved data
        resolvedData = resolvedData.map(function (d, i) {
          return accessRow(d, i);
        });

        // TODO: Make it possible to fabricate nested rows without pivoting
        var aggregatingColumns = allVisibleColumns.filter(function (d) {
          return !d.expander && d.aggregate;
        });

        // If pivoting, recursively group the data
        var aggregate = function aggregate(rows) {
          var aggregationValues = {};
          aggregatingColumns.forEach(function (column) {
            var values = rows.map(function (d) {
              return d[column.id];
            });
            aggregationValues[column.id] = column.aggregate(values, rows);
          });
          return aggregationValues;
        };
        if (pivotBy.length) {
          var groupRecursively = function groupRecursively(rows, keys) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            // This is the last level, just return the rows
            if (i === keys.length) {
              return rows;
            }
            // Group the rows together for this level
            var groupedRows = Object.entries(_utils2.default.groupBy(rows, keys[i])).map(function (_ref) {
              var _ref3;

              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  value = _ref2[1];

              return _ref3 = {}, _defineProperty(_ref3, pivotIDKey, keys[i]), _defineProperty(_ref3, pivotValKey, key), _defineProperty(_ref3, keys[i], key), _defineProperty(_ref3, subRowsKey, value), _defineProperty(_ref3, nestingLevelKey, i), _defineProperty(_ref3, groupedByPivotKey, true), _ref3;
            });
            // Recurse into the subRows
            groupedRows = groupedRows.map(function (rowGroup) {
              var _extends2;

              var subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1);
              return _extends({}, rowGroup, (_extends2 = {}, _defineProperty(_extends2, subRowsKey, subRows), _defineProperty(_extends2, aggregatedKey, true), _extends2), aggregate(subRows));
            });
            return groupedRows;
          };
          resolvedData = groupRecursively(resolvedData, pivotBy);
        }

        return _extends({}, newState, {
          resolvedData: resolvedData,
          allVisibleColumns: allVisibleColumns,
          headerGroups: headerGroups,
          allDecoratedColumns: allDecoratedColumns,
          hasHeaderGroups: hasHeaderGroups
        });
      }
    }, {
      key: 'getSortedData',
      value: function getSortedData(resolvedState) {
        var manual = resolvedState.manual,
            sorted = resolvedState.sorted,
            filtered = resolvedState.filtered,
            defaultFilterMethod = resolvedState.defaultFilterMethod,
            resolvedData = resolvedState.resolvedData,
            allDecoratedColumns = resolvedState.allDecoratedColumns;


        var sortMethodsByColumnID = {};

        allDecoratedColumns.filter(function (col) {
          return col.sortMethod;
        }).forEach(function (col) {
          sortMethodsByColumnID[col.id] = col.sortMethod;
        });

        // Resolve the data from either manual data or sorted data
        return {
          sortedData: manual ? resolvedData : this.sortData(this.filterData(resolvedData, filtered, defaultFilterMethod, allDecoratedColumns), sorted, sortMethodsByColumnID)
        };
      }
    }, {
      key: 'fireFetchData',
      value: function fireFetchData() {
        // determine the current state, preferring certain state values over props
        var currentState = _extends({}, this.getResolvedState(), {
          page: this.getStateOrProp('page'),
          pageSize: this.getStateOrProp('pageSize'),
          filtered: this.getStateOrProp('filtered')
        });

        this.props.onFetchData(currentState, this);
      }
    }, {
      key: 'getPropOrState',
      value: function getPropOrState(key) {
        return _utils2.default.getFirstDefined(this.props[key], this.state[key]);
      }
    }, {
      key: 'getStateOrProp',
      value: function getStateOrProp(key) {
        return _utils2.default.getFirstDefined(this.state[key], this.props[key]);
      }
    }, {
      key: 'filterData',
      value: function filterData(data, filtered, defaultFilterMethod, allVisibleColumns) {
        var _this3 = this;

        var filteredData = data;

        if (filtered.length) {
          filteredData = filtered.reduce(function (filteredSoFar, nextFilter) {
            var column = allVisibleColumns.find(function (x) {
              return x.id === nextFilter.id;
            });

            // Don't filter hidden columns or columns that have had their filters disabled
            if (!column || column.filterable === false) {
              return filteredSoFar;
            }

            var filterMethod = column.filterMethod || defaultFilterMethod;

            // If 'filterAll' is set to true, pass the entire dataset to the filter method
            if (column.filterAll) {
              return filterMethod(nextFilter, filteredSoFar, column);
            }
            return filteredSoFar.filter(function (row) {
              return filterMethod(nextFilter, row, column);
            });
          }, filteredData);

          // Apply the filter to the subrows if we are pivoting, and then
          // filter any rows without subcolumns because it would be strange to show
          filteredData = filteredData.map(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return row;
            }
            return _extends({}, row, _defineProperty({}, _this3.props.subRowsKey, _this3.filterData(row[_this3.props.subRowsKey], filtered, defaultFilterMethod, allVisibleColumns)));
          }).filter(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return true;
            }
            return row[_this3.props.subRowsKey].length > 0;
          });
        }

        return filteredData;
      }
    }, {
      key: 'sortData',
      value: function sortData(data, sorted) {
        var _this4 = this;

        var sortMethodsByColumnID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!sorted.length) {
          return data;
        }

        var sortedData = (this.props.orderByMethod || _utils2.default.orderBy)(data, sorted.map(function (sort) {
          // Support custom sorting methods for each column
          if (sortMethodsByColumnID[sort.id]) {
            return function (a, b) {
              return sortMethodsByColumnID[sort.id](a[sort.id], b[sort.id], sort.desc);
            };
          }
          return function (a, b) {
            return _this4.props.defaultSortMethod(a[sort.id], b[sort.id], sort.desc);
          };
        }), sorted.map(function (d) {
          return !d.desc;
        }), this.props.indexKey);

        sortedData.forEach(function (row) {
          if (!row[_this4.props.subRowsKey]) {
            return;
          }
          row[_this4.props.subRowsKey] = _this4.sortData(row[_this4.props.subRowsKey], sorted, sortMethodsByColumnID);
        });

        return sortedData;
      }
    }, {
      key: 'getMinRows',
      value: function getMinRows() {
        return _utils2.default.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'));
      }

      // User actions

    }, {
      key: 'onPageChange',
      value: function onPageChange(page) {
        var _props = this.props,
            onPageChange = _props.onPageChange,
            collapseOnPageChange = _props.collapseOnPageChange;


        var newState = { page: page };
        if (collapseOnPageChange) {
          newState.expanded = {};
        }
        this.setStateWithData(newState, function () {
          return onPageChange && onPageChange(page);
        });
      }
    }, {
      key: 'onPageSizeChange',
      value: function onPageSizeChange(newPageSize) {
        var onPageSizeChange = this.props.onPageSizeChange;

        var _getResolvedState = this.getResolvedState(),
            pageSize = _getResolvedState.pageSize,
            page = _getResolvedState.page;

        // Normalize the page to display


        var currentRow = pageSize * page;
        var newPage = Math.floor(currentRow / newPageSize);

        this.setStateWithData({
          pageSize: newPageSize,
          page: newPage
        }, function () {
          return onPageSizeChange && onPageSizeChange(newPageSize, newPage);
        });
      }
    }, {
      key: 'sortColumn',
      value: function sortColumn(column, additive) {
        var _getResolvedState2 = this.getResolvedState(),
            sorted = _getResolvedState2.sorted,
            skipNextSort = _getResolvedState2.skipNextSort,
            defaultSortDesc = _getResolvedState2.defaultSortDesc;

        var firstSortDirection = Object.prototype.hasOwnProperty.call(column, 'defaultSortDesc') ? column.defaultSortDesc : defaultSortDesc;
        var secondSortDirection = !firstSortDirection;

        // we can't stop event propagation from the column resize move handlers
        // attached to the document because of react's synthetic events
        // so we have to prevent the sort function from actually sorting
        // if we click on the column resize element within a header.
        if (skipNextSort) {
          this.setStateWithData({
            skipNextSort: false
          });
          return;
        }

        var onSortedChange = this.props.onSortedChange;


        var newSorted = _utils2.default.clone(sorted || []).map(function (d) {
          d.desc = _utils2.default.isSortingDesc(d);
          return d;
        });
        if (!_utils2.default.isArray(column)) {
          // Single-Sort
          var existingIndex = newSorted.findIndex(function (d) {
            return d.id === column.id;
          });
          if (existingIndex > -1) {
            var existing = newSorted[existingIndex];
            if (existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(existingIndex, 1);
              } else {
                existing.desc = firstSortDirection;
                newSorted = [existing];
              }
            } else {
              existing.desc = secondSortDirection;
              if (!additive) {
                newSorted = [existing];
              }
            }
          } else if (additive) {
            newSorted.push({
              id: column.id,
              desc: firstSortDirection
            });
          } else {
            newSorted = [{
              id: column.id,
              desc: firstSortDirection
            }];
          }
        } else {
          // Multi-Sort
          var _existingIndex = newSorted.findIndex(function (d) {
            return d.id === column[0].id;
          });
          // Existing Sorted Column
          if (_existingIndex > -1) {
            var _existing = newSorted[_existingIndex];
            if (_existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(_existingIndex, column.length);
              } else {
                column.forEach(function (d, i) {
                  newSorted[_existingIndex + i].desc = firstSortDirection;
                });
              }
            } else {
              column.forEach(function (d, i) {
                newSorted[_existingIndex + i].desc = secondSortDirection;
              });
            }
            if (!additive) {
              newSorted = newSorted.slice(_existingIndex, column.length);
            }
            // New Sort Column
          } else if (additive) {
            newSorted = newSorted.concat(column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            }));
          } else {
            newSorted = column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            });
          }
        }

        this.setStateWithData({
          page: !sorted.length && newSorted.length || !additive ? 0 : this.state.page,
          sorted: newSorted
        }, function () {
          return onSortedChange && onSortedChange(newSorted, column, additive);
        });
      }
    }, {
      key: 'filterColumn',
      value: function filterColumn(column, value) {
        var _getResolvedState3 = this.getResolvedState(),
            filtered = _getResolvedState3.filtered;

        var onFilteredChange = this.props.onFilteredChange;

        // Remove old filter first if it exists

        var newFiltering = (filtered || []).filter(function (x) {
          return x.id !== column.id;
        });

        if (value !== '') {
          newFiltering.push({
            id: column.id,
            value: value
          });
        }

        this.setStateWithData({
          filtered: newFiltering
        }, function () {
          return onFilteredChange && onFilteredChange(newFiltering, column, value);
        });
      }
    }, {
      key: 'resizeColumnStart',
      value: function resizeColumnStart(event, column, isTouch) {
        var _this5 = this;

        event.stopPropagation();
        var parentWidth = event.target.parentElement.getBoundingClientRect().width;

        var pageX = void 0;
        if (isTouch) {
          pageX = event.changedTouches[0].pageX;
        } else {
          pageX = event.pageX;
        }

        this.trapEvents = true;
        this.setStateWithData({
          currentlyResizing: {
            id: column.id,
            startX: pageX,
            parentWidth: parentWidth
          }
        }, function () {
          if (isTouch) {
            document.addEventListener('touchmove', _this5.resizeColumnMoving);
            document.addEventListener('touchcancel', _this5.resizeColumnEnd);
            document.addEventListener('touchend', _this5.resizeColumnEnd);
          } else {
            document.addEventListener('mousemove', _this5.resizeColumnMoving);
            document.addEventListener('mouseup', _this5.resizeColumnEnd);
            document.addEventListener('mouseleave', _this5.resizeColumnEnd);
          }
        });
      }
    }, {
      key: 'resizeColumnMoving',
      value: function resizeColumnMoving(event) {
        event.stopPropagation();
        var _props2 = this.props,
            onResizedChange = _props2.onResizedChange,
            column = _props2.column;

        var _getResolvedState4 = this.getResolvedState(),
            resized = _getResolvedState4.resized,
            currentlyResizing = _getResolvedState4.currentlyResizing,
            columns = _getResolvedState4.columns;

        var currentColumn = columns.find(function (c) {
          return c.accessor === currentlyResizing.id || c.id === currentlyResizing.id;
        });
        var minResizeWidth = currentColumn && currentColumn.minResizeWidth != null ? currentColumn.minResizeWidth : column.minResizeWidth;

        // Delete old value
        var newResized = resized.filter(function (x) {
          return x.id !== currentlyResizing.id;
        });

        var pageX = void 0;

        if (event.type === 'touchmove') {
          pageX = event.changedTouches[0].pageX;
        } else if (event.type === 'mousemove') {
          pageX = event.pageX;
        }

        var newWidth = Math.max(currentlyResizing.parentWidth + pageX - currentlyResizing.startX, minResizeWidth);

        newResized.push({
          id: currentlyResizing.id,
          value: newWidth
        });

        this.setStateWithData({
          resized: newResized
        }, function () {
          return onResizedChange && onResizedChange(newResized, event);
        });
      }
    }, {
      key: 'resizeColumnEnd',
      value: function resizeColumnEnd(event) {
        event.stopPropagation();
        var isTouch = event.type === 'touchend' || event.type === 'touchcancel';

        if (isTouch) {
          document.removeEventListener('touchmove', this.resizeColumnMoving);
          document.removeEventListener('touchcancel', this.resizeColumnEnd);
          document.removeEventListener('touchend', this.resizeColumnEnd);
        }

        // If its a touch event clear the mouse one's as well because sometimes
        // the mouseDown event gets called as well, but the mouseUp event doesn't
        document.removeEventListener('mousemove', this.resizeColumnMoving);
        document.removeEventListener('mouseup', this.resizeColumnEnd);
        document.removeEventListener('mouseleave', this.resizeColumnEnd);

        // The touch events don't propagate up to the sorting's onMouseDown event so
        // no need to prevent it from happening or else the first click after a touch
        // event resize will not sort the column.
        if (!isTouch) {
          this.setStateWithData({
            skipNextSort: true,
            currentlyResizing: false
          });
        }
      }
    }]);

    return _class;
  }(Base);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiXyIsImNvbXBhY3RPYmplY3QiLCJuZXdTdGF0ZSIsImRhdGFDaGFuZ2VkIiwiY29sdW1ucyIsInBpdm90QnkiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJwaXZvdElES2V5IiwicGl2b3RWYWxLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIlN1YkNvbXBvbmVudCIsImhhc0hlYWRlckdyb3VwcyIsImZvckVhY2giLCJjb2x1bW4iLCJjb2x1bW5zV2l0aEV4cGFuZGVyIiwiZXhwYW5kZXJDb2x1bW4iLCJmaW5kIiwiY29sIiwiZXhwYW5kZXIiLCJzb21lIiwiY29sMiIsIm1ha2VEZWNvcmF0ZWRDb2x1bW4iLCJwYXJlbnRDb2x1bW4iLCJkY29sIiwiZXhwYW5kZXJEZWZhdWx0cyIsIm1heFdpZHRoIiwibWluV2lkdGgiLCJhY2Nlc3NvciIsImlkIiwiYWNjZXNzb3JTdHJpbmciLCJnZXQiLCJyb3ciLCJjb25zb2xlIiwid2FybiIsIkVycm9yIiwidW5kZWZpbmVkIiwiYWxsRGVjb3JhdGVkQ29sdW1ucyIsImRlY29yYXRlQW5kQWRkVG9BbGwiLCJkZWNvcmF0ZWRDb2x1bW4iLCJwdXNoIiwiZGVjb3JhdGVkQ29sdW1ucyIsIm1hcCIsImQiLCJ2aXNpYmxlQ29sdW1ucyIsInNsaWNlIiwiYWxsVmlzaWJsZUNvbHVtbnMiLCJ2aXNpYmxlU3ViQ29sdW1ucyIsImZpbHRlciIsImluZGV4T2YiLCJnZXRGaXJzdERlZmluZWQiLCJzaG93IiwibGVuZ3RoIiwicGl2b3RJbmRleCIsImZpbmRJbmRleCIsInBpdm90IiwicGl2b3RDb2x1bW5zIiwiZm91bmQiLCJwaXZvdElEIiwiUGl2b3RQYXJlbnRDb2x1bW4iLCJyZWR1Y2UiLCJwcmV2IiwiY3VycmVudCIsIlBpdm90R3JvdXBIZWFkZXIiLCJIZWFkZXIiLCJwaXZvdENvbHVtbkdyb3VwIiwicGl2b3REZWZhdWx0cyIsInBpdm90ZWQiLCJzcGxpY2UiLCJ1bnNoaWZ0IiwiaGVhZGVyR3JvdXBzIiwiY3VycmVudFNwYW4iLCJhZGRIZWFkZXIiLCJjb25jYXQiLCJhY2Nlc3NSb3ciLCJpIiwibGV2ZWwiLCJyZXNvbHZlZERhdGEiLCJhZ2dyZWdhdGluZ0NvbHVtbnMiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGlvblZhbHVlcyIsInZhbHVlcyIsInJvd3MiLCJncm91cFJlY3Vyc2l2ZWx5Iiwia2V5cyIsImdyb3VwZWRSb3dzIiwiT2JqZWN0IiwiZW50cmllcyIsImdyb3VwQnkiLCJrZXkiLCJ2YWx1ZSIsInN1YlJvd3MiLCJyb3dHcm91cCIsIm1hbnVhbCIsInNvcnRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInNvcnRNZXRob2RzQnlDb2x1bW5JRCIsInNvcnRNZXRob2QiLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJmaWx0ZXJEYXRhIiwiY3VycmVudFN0YXRlIiwiZ2V0UmVzb2x2ZWRTdGF0ZSIsInBhZ2UiLCJnZXRTdGF0ZU9yUHJvcCIsInBhZ2VTaXplIiwib25GZXRjaERhdGEiLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJlZFNvRmFyIiwibmV4dEZpbHRlciIsIngiLCJmaWx0ZXJhYmxlIiwiZmlsdGVyTWV0aG9kIiwiZmlsdGVyQWxsIiwib3JkZXJCeU1ldGhvZCIsIm9yZGVyQnkiLCJzb3J0IiwiYSIsImIiLCJkZXNjIiwiZGVmYXVsdFNvcnRNZXRob2QiLCJtaW5Sb3dzIiwib25QYWdlQ2hhbmdlIiwiY29sbGFwc2VPblBhZ2VDaGFuZ2UiLCJleHBhbmRlZCIsInNldFN0YXRlV2l0aERhdGEiLCJuZXdQYWdlU2l6ZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjdXJyZW50Um93IiwibmV3UGFnZSIsIk1hdGgiLCJmbG9vciIsImFkZGl0aXZlIiwic2tpcE5leHRTb3J0IiwiZGVmYXVsdFNvcnREZXNjIiwiZmlyc3RTb3J0RGlyZWN0aW9uIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwic2Vjb25kU29ydERpcmVjdGlvbiIsIm9uU29ydGVkQ2hhbmdlIiwibmV3U29ydGVkIiwiY2xvbmUiLCJpc1NvcnRpbmdEZXNjIiwiaXNBcnJheSIsImV4aXN0aW5nSW5kZXgiLCJleGlzdGluZyIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJuZXdGaWx0ZXJpbmciLCJldmVudCIsImlzVG91Y2giLCJzdG9wUHJvcGFnYXRpb24iLCJwYXJlbnRXaWR0aCIsInRhcmdldCIsInBhcmVudEVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsInBhZ2VYIiwiY2hhbmdlZFRvdWNoZXMiLCJ0cmFwRXZlbnRzIiwiY3VycmVudGx5UmVzaXppbmciLCJzdGFydFgiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNpemVDb2x1bW5FbmQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwiY3VycmVudENvbHVtbiIsImMiLCJtaW5SZXNpemVXaWR0aCIsIm5ld1Jlc2l6ZWQiLCJ0eXBlIiwibmV3V2lkdGgiLCJtYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztrQkFFZTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSx1Q0FFT0EsS0FGUCxFQUVjQyxLQUZkLEVBRXFCO0FBQzlCLFlBQU1DLDZCQUNEQyxnQkFBRUMsYUFBRixDQUFnQixLQUFLSCxLQUFyQixDQURDLEVBRURFLGdCQUFFQyxhQUFGLENBQWdCLEtBQUtKLEtBQXJCLENBRkMsRUFHREcsZ0JBQUVDLGFBQUYsQ0FBZ0JILEtBQWhCLENBSEMsRUFJREUsZ0JBQUVDLGFBQUYsQ0FBZ0JKLEtBQWhCLENBSkMsQ0FBTjtBQU1BLGVBQU9FLGFBQVA7QUFDRDtBQVZVO0FBQUE7QUFBQSxtQ0FZR0csUUFaSCxFQVlhQyxXQVpiLEVBWTBCO0FBQUE7O0FBQUEsWUFFakNDLE9BRmlDLEdBZS9CRixRQWYrQixDQUVqQ0UsT0FGaUM7QUFBQSxnQ0FlL0JGLFFBZitCLENBR2pDRyxPQUhpQztBQUFBLFlBR2pDQSxPQUhpQyxxQ0FHdkIsRUFIdUI7QUFBQSxZQUlqQ0MsSUFKaUMsR0FlL0JKLFFBZitCLENBSWpDSSxJQUppQztBQUFBLFlBS2pDQyxXQUxpQyxHQWUvQkwsUUFmK0IsQ0FLakNLLFdBTGlDO0FBQUEsWUFNakNDLFVBTmlDLEdBZS9CTixRQWYrQixDQU1qQ00sVUFOaUM7QUFBQSxZQU9qQ0MsV0FQaUMsR0FlL0JQLFFBZitCLENBT2pDTyxXQVBpQztBQUFBLFlBUWpDQyxVQVJpQyxHQWUvQlIsUUFmK0IsQ0FRakNRLFVBUmlDO0FBQUEsWUFTakNDLGFBVGlDLEdBZS9CVCxRQWYrQixDQVNqQ1MsYUFUaUM7QUFBQSxZQVVqQ0MsZUFWaUMsR0FlL0JWLFFBZitCLENBVWpDVSxlQVZpQztBQUFBLFlBV2pDQyxXQVhpQyxHQWUvQlgsUUFmK0IsQ0FXakNXLFdBWGlDO0FBQUEsWUFZakNDLFFBWmlDLEdBZS9CWixRQWYrQixDQVlqQ1ksUUFaaUM7QUFBQSxZQWFqQ0MsaUJBYmlDLEdBZS9CYixRQWYrQixDQWFqQ2EsaUJBYmlDO0FBQUEsWUFjakNDLFlBZGlDLEdBZS9CZCxRQWYrQixDQWNqQ2MsWUFkaUM7O0FBaUJuQzs7QUFDQSxZQUFJQyxrQkFBa0IsS0FBdEI7QUFDQWIsZ0JBQVFjLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDeEIsY0FBSUMsT0FBT2YsT0FBWCxFQUFvQjtBQUNsQmEsOEJBQWtCLElBQWxCO0FBQ0Q7QUFDRixTQUpEOztBQU1BLFlBQUlHLG1EQUEwQmhCLE9BQTFCLEVBQUo7O0FBRUEsWUFBSWlCLGlCQUFpQmpCLFFBQVFrQixJQUFSLENBQ25CO0FBQUEsaUJBQU9DLElBQUlDLFFBQUosSUFBaUJELElBQUluQixPQUFKLElBQWVtQixJQUFJbkIsT0FBSixDQUFZcUIsSUFBWixDQUFpQjtBQUFBLG1CQUFRQyxLQUFLRixRQUFiO0FBQUEsV0FBakIsQ0FBdkM7QUFBQSxTQURtQixDQUFyQjtBQUdBO0FBQ0EsWUFBSUgsa0JBQWtCLENBQUNBLGVBQWVHLFFBQXRDLEVBQWdEO0FBQzlDSCwyQkFBaUJBLGVBQWVqQixPQUFmLENBQXVCa0IsSUFBdkIsQ0FBNEI7QUFBQSxtQkFBT0MsSUFBSUMsUUFBWDtBQUFBLFdBQTVCLENBQWpCO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJUixnQkFBZ0IsQ0FBQ0ssY0FBckIsRUFBcUM7QUFDbkNBLDJCQUFpQixFQUFFRyxVQUFVLElBQVosRUFBakI7QUFDQUosaUNBQXVCQyxjQUF2Qiw0QkFBMENELG1CQUExQztBQUNEOztBQUVELFlBQU1PLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNSLE1BQUQsRUFBU1MsWUFBVCxFQUEwQjtBQUNwRCxjQUFJQyxhQUFKO0FBQ0EsY0FBSVYsT0FBT0ssUUFBWCxFQUFxQjtBQUNuQkssZ0NBQ0ssT0FBS2hDLEtBQUwsQ0FBV3NCLE1BRGhCLEVBRUssT0FBS3RCLEtBQUwsQ0FBV2lDLGdCQUZoQixFQUdLWCxNQUhMO0FBS0QsV0FORCxNQU1PO0FBQ0xVLGdDQUNLLE9BQUtoQyxLQUFMLENBQVdzQixNQURoQixFQUVLQSxNQUZMO0FBSUQ7O0FBRUQ7QUFDQSxjQUFJVSxLQUFLRSxRQUFMLEdBQWdCRixLQUFLRyxRQUF6QixFQUFtQztBQUNqQ0gsaUJBQUtHLFFBQUwsR0FBZ0JILEtBQUtFLFFBQXJCO0FBQ0Q7O0FBRUQsY0FBSUgsWUFBSixFQUFrQjtBQUNoQkMsaUJBQUtELFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJLE9BQU9DLEtBQUtJLFFBQVosS0FBeUIsUUFBN0IsRUFBdUM7QUFDckNKLGlCQUFLSyxFQUFMLEdBQVVMLEtBQUtLLEVBQUwsSUFBV0wsS0FBS0ksUUFBMUI7QUFDQSxnQkFBTUUsaUJBQWlCTixLQUFLSSxRQUE1QjtBQUNBSixpQkFBS0ksUUFBTCxHQUFnQjtBQUFBLHFCQUFPakMsZ0JBQUVvQyxHQUFGLENBQU1DLEdBQU4sRUFBV0YsY0FBWCxDQUFQO0FBQUEsYUFBaEI7QUFDQSxtQkFBT04sSUFBUDtBQUNEOztBQUVEO0FBQ0EsY0FBSUEsS0FBS0ksUUFBTCxJQUFpQixDQUFDSixLQUFLSyxFQUEzQixFQUErQjtBQUM3Qkksb0JBQVFDLElBQVIsQ0FBYVYsSUFBYjtBQUNBLGtCQUFNLElBQUlXLEtBQUosQ0FDSiwwRUFESSxDQUFOO0FBR0Q7O0FBRUQ7QUFDQSxjQUFJLENBQUNYLEtBQUtJLFFBQVYsRUFBb0I7QUFDbEJKLGlCQUFLSSxRQUFMLEdBQWdCO0FBQUEscUJBQU1RLFNBQU47QUFBQSxhQUFoQjtBQUNEOztBQUVELGlCQUFPWixJQUFQO0FBQ0QsU0E5Q0Q7O0FBZ0RBLFlBQU1hLHNCQUFzQixFQUE1Qjs7QUFFQTtBQUNBLFlBQU1DLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUN4QixNQUFELEVBQVNTLFlBQVQsRUFBMEI7QUFDcEQsY0FBTWdCLGtCQUFrQmpCLG9CQUFvQlIsTUFBcEIsRUFBNEJTLFlBQTVCLENBQXhCO0FBQ0FjLDhCQUFvQkcsSUFBcEIsQ0FBeUJELGVBQXpCO0FBQ0EsaUJBQU9BLGVBQVA7QUFDRCxTQUpEOztBQU1BLFlBQU1FLG1CQUFtQjFCLG9CQUFvQjJCLEdBQXBCLENBQXdCLGtCQUFVO0FBQ3pELGNBQUk1QixPQUFPZixPQUFYLEVBQW9CO0FBQ2xCLGdDQUNLZSxNQURMO0FBRUVmLHVCQUFTZSxPQUFPZixPQUFQLENBQWUyQyxHQUFmLENBQW1CO0FBQUEsdUJBQUtKLG9CQUFvQkssQ0FBcEIsRUFBdUI3QixNQUF2QixDQUFMO0FBQUEsZUFBbkI7QUFGWDtBQUlEO0FBQ0QsaUJBQU93QixvQkFBb0J4QixNQUFwQixDQUFQO0FBQ0QsU0FSd0IsQ0FBekI7O0FBVUE7QUFDQSxZQUFJOEIsaUJBQWlCSCxpQkFBaUJJLEtBQWpCLEVBQXJCO0FBQ0EsWUFBSUMsb0JBQW9CLEVBQXhCOztBQUVBRix5QkFBaUJBLGVBQWVGLEdBQWYsQ0FBbUIsa0JBQVU7QUFDNUMsY0FBSTVCLE9BQU9mLE9BQVgsRUFBb0I7QUFDbEIsZ0JBQU1nRCxvQkFBb0JqQyxPQUFPZixPQUFQLENBQWVpRCxNQUFmLENBQXNCO0FBQUEscUJBQzlDaEQsUUFBUWlELE9BQVIsQ0FBZ0JOLEVBQUVkLEVBQWxCLElBQXdCLENBQUMsQ0FBekIsR0FBNkIsS0FBN0IsR0FBcUNsQyxnQkFBRXVELGVBQUYsQ0FBa0JQLEVBQUVRLElBQXBCLEVBQTBCLElBQTFCLENBRFM7QUFBQSxhQUF0QixDQUExQjtBQUdBLGdDQUNLckMsTUFETDtBQUVFZix1QkFBU2dEO0FBRlg7QUFJRDtBQUNELGlCQUFPakMsTUFBUDtBQUNELFNBWGdCLENBQWpCOztBQWFBOEIseUJBQWlCQSxlQUFlSSxNQUFmLENBQXNCO0FBQUEsaUJBQ3JDbEMsT0FBT2YsT0FBUCxHQUNJZSxPQUFPZixPQUFQLENBQWVxRCxNQURuQixHQUVJcEQsUUFBUWlELE9BQVIsQ0FBZ0JuQyxPQUFPZSxFQUF2QixJQUE2QixDQUFDLENBQTlCLEdBQ0UsS0FERixHQUVFbEMsZ0JBQUV1RCxlQUFGLENBQWtCcEMsT0FBT3FDLElBQXpCLEVBQStCLElBQS9CLENBTCtCO0FBQUEsU0FBdEIsQ0FBakI7O0FBUUE7QUFDQSxZQUFNRSxhQUFhVCxlQUFlVSxTQUFmLENBQXlCO0FBQUEsaUJBQU9wQyxJQUFJcUMsS0FBWDtBQUFBLFNBQXpCLENBQW5COztBQUVBO0FBQ0EsWUFBSXZELFFBQVFvRCxNQUFaLEVBQW9CO0FBQ2xCO0FBQ0EsY0FBTUksZUFBZSxFQUFyQjtBQUNBeEQsa0JBQVFhLE9BQVIsQ0FBZ0IsbUJBQVc7QUFDekIsZ0JBQU00QyxRQUFRcEIsb0JBQW9CcEIsSUFBcEIsQ0FBeUI7QUFBQSxxQkFBSzBCLEVBQUVkLEVBQUYsS0FBUzZCLE9BQWQ7QUFBQSxhQUF6QixDQUFkO0FBQ0EsZ0JBQUlELEtBQUosRUFBVztBQUNURCwyQkFBYWhCLElBQWIsQ0FBa0JpQixLQUFsQjtBQUNEO0FBQ0YsV0FMRDs7QUFPQSxjQUFNRSxvQkFBb0JILGFBQWFJLE1BQWIsQ0FDeEIsVUFBQ0MsSUFBRCxFQUFPQyxPQUFQO0FBQUEsbUJBQW1CRCxRQUFRQSxTQUFTQyxRQUFRdkMsWUFBekIsSUFBeUN1QyxRQUFRdkMsWUFBcEU7QUFBQSxXQUR3QixFQUV4QmlDLGFBQWEsQ0FBYixFQUFnQmpDLFlBRlEsQ0FBMUI7O0FBS0EsY0FBSXdDLG1CQUFtQm5ELG1CQUFtQitDLGtCQUFrQkssTUFBNUQ7QUFDQUQsNkJBQW1CQSxvQkFBcUI7QUFBQSxtQkFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQU47QUFBQSxXQUF4Qzs7QUFFQSxjQUFJRSxtQkFBbUI7QUFDckJELG9CQUFRRCxnQkFEYTtBQUVyQmhFLHFCQUFTeUQsYUFBYWQsR0FBYixDQUFpQjtBQUFBLGtDQUNyQixPQUFLbEQsS0FBTCxDQUFXMEUsYUFEVSxFQUVyQmhELEdBRnFCO0FBR3hCaUQseUJBQVM7QUFIZTtBQUFBLGFBQWpCOztBQU9YO0FBVHVCLFdBQXZCLENBVUEsSUFBSWQsY0FBYyxDQUFsQixFQUFxQjtBQUNuQlksNENBQ0tyQixlQUFlUyxVQUFmLENBREwsRUFFS1ksZ0JBRkw7QUFJQXJCLDJCQUFld0IsTUFBZixDQUFzQmYsVUFBdEIsRUFBa0MsQ0FBbEMsRUFBcUNZLGdCQUFyQztBQUNELFdBTkQsTUFNTztBQUNMckIsMkJBQWV5QixPQUFmLENBQXVCSixnQkFBdkI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsWUFBTUssZUFBZSxFQUFyQjtBQUNBLFlBQUlDLGNBQWMsRUFBbEI7O0FBRUE7QUFDQSxZQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ3pFLE9BQUQsRUFBVWUsTUFBVixFQUFxQjtBQUNyQ3dELHVCQUFhOUIsSUFBYixjQUNLLE9BQUtoRCxLQUFMLENBQVdzQixNQURoQixFQUVLQSxNQUZMO0FBR0VmO0FBSEY7QUFLQXdFLHdCQUFjLEVBQWQ7QUFDRCxTQVBEOztBQVNBO0FBQ0EzQix1QkFBZS9CLE9BQWYsQ0FBdUIsa0JBQVU7QUFDL0IsY0FBSUMsT0FBT2YsT0FBWCxFQUFvQjtBQUNsQitDLGdDQUFvQkEsa0JBQWtCMkIsTUFBbEIsQ0FBeUIzRCxPQUFPZixPQUFoQyxDQUFwQjtBQUNBLGdCQUFJd0UsWUFBWW5CLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDMUJvQix3QkFBVUQsV0FBVjtBQUNEO0FBQ0RDLHNCQUFVMUQsT0FBT2YsT0FBakIsRUFBMEJlLE1BQTFCO0FBQ0E7QUFDRDtBQUNEZ0MsNEJBQWtCTixJQUFsQixDQUF1QjFCLE1BQXZCO0FBQ0F5RCxzQkFBWS9CLElBQVosQ0FBaUIxQixNQUFqQjtBQUNELFNBWEQ7QUFZQSxZQUFJRixtQkFBbUIyRCxZQUFZbkIsTUFBWixHQUFxQixDQUE1QyxFQUErQztBQUM3Q29CLG9CQUFVRCxXQUFWO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFNRyxZQUFZLFNBQVpBLFNBQVksQ0FBQy9CLENBQUQsRUFBSWdDLENBQUosRUFBcUI7QUFBQTs7QUFBQSxjQUFkQyxLQUFjLHVFQUFOLENBQU07O0FBQ3JDLGNBQU01Qyx3Q0FDSHhCLFdBREcsRUFDV21DLENBRFgseUJBRUhsQyxRQUZHLEVBRVFrRSxDQUZSLHlCQUdIdEUsVUFIRyxFQUdVc0MsRUFBRXRDLFVBQUYsQ0FIVix5QkFJSEUsZUFKRyxFQUllcUUsS0FKZixRQUFOO0FBTUF2Qyw4QkFBb0J4QixPQUFwQixDQUE0QixrQkFBVTtBQUNwQyxnQkFBSUMsT0FBT0ssUUFBWCxFQUFxQjtBQUNyQmEsZ0JBQUlsQixPQUFPZSxFQUFYLElBQWlCZixPQUFPYyxRQUFQLENBQWdCZSxDQUFoQixDQUFqQjtBQUNELFdBSEQ7QUFJQSxjQUFJWCxJQUFJM0IsVUFBSixDQUFKLEVBQXFCO0FBQ25CMkIsZ0JBQUkzQixVQUFKLElBQWtCMkIsSUFBSTNCLFVBQUosRUFBZ0JxQyxHQUFoQixDQUFvQixVQUFDQyxDQUFELEVBQUlnQyxDQUFKO0FBQUEscUJBQVVELFVBQVUvQixDQUFWLEVBQWFnQyxDQUFiLEVBQWdCQyxRQUFRLENBQXhCLENBQVY7QUFBQSxhQUFwQixDQUFsQjtBQUNEO0FBQ0QsaUJBQU81QyxHQUFQO0FBQ0QsU0FmRDs7QUFpQkE7QUFDQSxZQUFJNkMsZUFBZSxLQUFLQSxZQUF4QjtBQUNBO0FBQ0EsWUFBSSxDQUFDLEtBQUtBLFlBQU4sSUFBc0IvRSxXQUExQixFQUF1QztBQUNyQytFLHlCQUFlM0UsWUFBWUQsSUFBWixDQUFmO0FBQ0EsZUFBSzRFLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0Q7QUFDRDtBQUNBQSx1QkFBZUEsYUFBYW5DLEdBQWIsQ0FBaUIsVUFBQ0MsQ0FBRCxFQUFJZ0MsQ0FBSjtBQUFBLGlCQUFVRCxVQUFVL0IsQ0FBVixFQUFhZ0MsQ0FBYixDQUFWO0FBQUEsU0FBakIsQ0FBZjs7QUFFQTtBQUNBLFlBQU1HLHFCQUFxQmhDLGtCQUFrQkUsTUFBbEIsQ0FBeUI7QUFBQSxpQkFBSyxDQUFDTCxFQUFFeEIsUUFBSCxJQUFld0IsRUFBRW9DLFNBQXRCO0FBQUEsU0FBekIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNQSxZQUFZLFNBQVpBLFNBQVksT0FBUTtBQUN4QixjQUFNQyxvQkFBb0IsRUFBMUI7QUFDQUYsNkJBQW1CakUsT0FBbkIsQ0FBMkIsa0JBQVU7QUFDbkMsZ0JBQU1vRSxTQUFTQyxLQUFLeEMsR0FBTCxDQUFTO0FBQUEscUJBQUtDLEVBQUU3QixPQUFPZSxFQUFULENBQUw7QUFBQSxhQUFULENBQWY7QUFDQW1ELDhCQUFrQmxFLE9BQU9lLEVBQXpCLElBQStCZixPQUFPaUUsU0FBUCxDQUFpQkUsTUFBakIsRUFBeUJDLElBQXpCLENBQS9CO0FBQ0QsV0FIRDtBQUlBLGlCQUFPRixpQkFBUDtBQUNELFNBUEQ7QUFRQSxZQUFJaEYsUUFBUW9ELE1BQVosRUFBb0I7QUFDbEIsY0FBTStCLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNELElBQUQsRUFBT0UsSUFBUCxFQUF1QjtBQUFBLGdCQUFWVCxDQUFVLHVFQUFOLENBQU07O0FBQzlDO0FBQ0EsZ0JBQUlBLE1BQU1TLEtBQUtoQyxNQUFmLEVBQXVCO0FBQ3JCLHFCQUFPOEIsSUFBUDtBQUNEO0FBQ0Q7QUFDQSxnQkFBSUcsY0FBY0MsT0FBT0MsT0FBUCxDQUFlNUYsZ0JBQUU2RixPQUFGLENBQVVOLElBQVYsRUFBZ0JFLEtBQUtULENBQUwsQ0FBaEIsQ0FBZixFQUF5Q2pDLEdBQXpDLENBQTZDO0FBQUE7O0FBQUE7QUFBQSxrQkFBRStDLEdBQUY7QUFBQSxrQkFBT0MsS0FBUDs7QUFBQSx3REFDNUR2RixVQUQ0RCxFQUMvQ2lGLEtBQUtULENBQUwsQ0FEK0MsMEJBRTVEdkUsV0FGNEQsRUFFOUNxRixHQUY4QywwQkFHNURMLEtBQUtULENBQUwsQ0FINEQsRUFHbERjLEdBSGtELDBCQUk1RHBGLFVBSjRELEVBSS9DcUYsS0FKK0MsMEJBSzVEbkYsZUFMNEQsRUFLMUNvRSxDQUwwQywwQkFNNURqRSxpQkFONEQsRUFNeEMsSUFOd0M7QUFBQSxhQUE3QyxDQUFsQjtBQVFBO0FBQ0EyRSwwQkFBY0EsWUFBWTNDLEdBQVosQ0FBZ0Isb0JBQVk7QUFBQTs7QUFDeEMsa0JBQU1pRCxVQUFVUixpQkFBaUJTLFNBQVN2RixVQUFULENBQWpCLEVBQXVDK0UsSUFBdkMsRUFBNkNULElBQUksQ0FBakQsQ0FBaEI7QUFDQSxrQ0FDS2lCLFFBREwsOENBRUd2RixVQUZILEVBRWdCc0YsT0FGaEIsOEJBR0dyRixhQUhILEVBR21CLElBSG5CLGVBSUt5RSxVQUFVWSxPQUFWLENBSkw7QUFNRCxhQVJhLENBQWQ7QUFTQSxtQkFBT04sV0FBUDtBQUNELFdBekJEO0FBMEJBUix5QkFBZU0saUJBQWlCTixZQUFqQixFQUErQjdFLE9BQS9CLENBQWY7QUFDRDs7QUFFRCw0QkFDS0gsUUFETDtBQUVFZ0Ysb0NBRkY7QUFHRS9CLDhDQUhGO0FBSUV3QixvQ0FKRjtBQUtFakMsa0RBTEY7QUFNRXpCO0FBTkY7QUFRRDtBQXpTVTtBQUFBO0FBQUEsb0NBMlNJbEIsYUEzU0osRUEyU21CO0FBQUEsWUFFMUJtRyxNQUYwQixHQVF4Qm5HLGFBUndCLENBRTFCbUcsTUFGMEI7QUFBQSxZQUcxQkMsTUFIMEIsR0FReEJwRyxhQVJ3QixDQUcxQm9HLE1BSDBCO0FBQUEsWUFJMUJDLFFBSjBCLEdBUXhCckcsYUFSd0IsQ0FJMUJxRyxRQUowQjtBQUFBLFlBSzFCQyxtQkFMMEIsR0FReEJ0RyxhQVJ3QixDQUsxQnNHLG1CQUwwQjtBQUFBLFlBTTFCbkIsWUFOMEIsR0FReEJuRixhQVJ3QixDQU0xQm1GLFlBTjBCO0FBQUEsWUFPMUJ4QyxtQkFQMEIsR0FReEIzQyxhQVJ3QixDQU8xQjJDLG1CQVAwQjs7O0FBVTVCLFlBQU00RCx3QkFBd0IsRUFBOUI7O0FBRUE1RCw0QkFDR1csTUFESCxDQUNVO0FBQUEsaUJBQU85QixJQUFJZ0YsVUFBWDtBQUFBLFNBRFYsRUFFR3JGLE9BRkgsQ0FFVyxlQUFPO0FBQ2RvRixnQ0FBc0IvRSxJQUFJVyxFQUExQixJQUFnQ1gsSUFBSWdGLFVBQXBDO0FBQ0QsU0FKSDs7QUFNQTtBQUNBLGVBQU87QUFDTEMsc0JBQVlOLFNBQ1JoQixZQURRLEdBRVIsS0FBS3VCLFFBQUwsQ0FDQSxLQUFLQyxVQUFMLENBQWdCeEIsWUFBaEIsRUFBOEJrQixRQUE5QixFQUF3Q0MsbUJBQXhDLEVBQTZEM0QsbUJBQTdELENBREEsRUFFQXlELE1BRkEsRUFHQUcscUJBSEE7QUFIQyxTQUFQO0FBU0Q7QUF2VVU7QUFBQTtBQUFBLHNDQXlVTTtBQUNmO0FBQ0EsWUFBTUssNEJBQ0QsS0FBS0MsZ0JBQUwsRUFEQztBQUVKQyxnQkFBTSxLQUFLQyxjQUFMLENBQW9CLE1BQXBCLENBRkY7QUFHSkMsb0JBQVUsS0FBS0QsY0FBTCxDQUFvQixVQUFwQixDQUhOO0FBSUpWLG9CQUFVLEtBQUtVLGNBQUwsQ0FBb0IsVUFBcEI7QUFKTixVQUFOOztBQU9BLGFBQUtqSCxLQUFMLENBQVdtSCxXQUFYLENBQXVCTCxZQUF2QixFQUFxQyxJQUFyQztBQUNEO0FBblZVO0FBQUE7QUFBQSxxQ0FxVktiLEdBclZMLEVBcVZVO0FBQ25CLGVBQU85RixnQkFBRXVELGVBQUYsQ0FBa0IsS0FBSzFELEtBQUwsQ0FBV2lHLEdBQVgsQ0FBbEIsRUFBbUMsS0FBS2hHLEtBQUwsQ0FBV2dHLEdBQVgsQ0FBbkMsQ0FBUDtBQUNEO0FBdlZVO0FBQUE7QUFBQSxxQ0F5VktBLEdBelZMLEVBeVZVO0FBQ25CLGVBQU85RixnQkFBRXVELGVBQUYsQ0FBa0IsS0FBS3pELEtBQUwsQ0FBV2dHLEdBQVgsQ0FBbEIsRUFBbUMsS0FBS2pHLEtBQUwsQ0FBV2lHLEdBQVgsQ0FBbkMsQ0FBUDtBQUNEO0FBM1ZVO0FBQUE7QUFBQSxpQ0E2VkN4RixJQTdWRCxFQTZWTzhGLFFBN1ZQLEVBNlZpQkMsbUJBN1ZqQixFQTZWc0NsRCxpQkE3VnRDLEVBNlZ5RDtBQUFBOztBQUNsRSxZQUFJOEQsZUFBZTNHLElBQW5COztBQUVBLFlBQUk4RixTQUFTM0MsTUFBYixFQUFxQjtBQUNuQndELHlCQUFlYixTQUFTbkMsTUFBVCxDQUFnQixVQUFDaUQsYUFBRCxFQUFnQkMsVUFBaEIsRUFBK0I7QUFDNUQsZ0JBQU1oRyxTQUFTZ0Msa0JBQWtCN0IsSUFBbEIsQ0FBdUI7QUFBQSxxQkFBSzhGLEVBQUVsRixFQUFGLEtBQVNpRixXQUFXakYsRUFBekI7QUFBQSxhQUF2QixDQUFmOztBQUVBO0FBQ0EsZ0JBQUksQ0FBQ2YsTUFBRCxJQUFXQSxPQUFPa0csVUFBUCxLQUFzQixLQUFyQyxFQUE0QztBQUMxQyxxQkFBT0gsYUFBUDtBQUNEOztBQUVELGdCQUFNSSxlQUFlbkcsT0FBT21HLFlBQVAsSUFBdUJqQixtQkFBNUM7O0FBRUE7QUFDQSxnQkFBSWxGLE9BQU9vRyxTQUFYLEVBQXNCO0FBQ3BCLHFCQUFPRCxhQUFhSCxVQUFiLEVBQXlCRCxhQUF6QixFQUF3Qy9GLE1BQXhDLENBQVA7QUFDRDtBQUNELG1CQUFPK0YsY0FBYzdELE1BQWQsQ0FBcUI7QUFBQSxxQkFBT2lFLGFBQWFILFVBQWIsRUFBeUI5RSxHQUF6QixFQUE4QmxCLE1BQTlCLENBQVA7QUFBQSxhQUFyQixDQUFQO0FBQ0QsV0FmYyxFQWVaOEYsWUFmWSxDQUFmOztBQWlCQTtBQUNBO0FBQ0FBLHlCQUFlQSxhQUNabEUsR0FEWSxDQUNSLGVBQU87QUFDVixnQkFBSSxDQUFDVixJQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsQ0FBTCxFQUFpQztBQUMvQixxQkFBTzJCLEdBQVA7QUFDRDtBQUNELGdDQUNLQSxHQURMLHNCQUVHLE9BQUt4QyxLQUFMLENBQVdhLFVBRmQsRUFFMkIsT0FBS2dHLFVBQUwsQ0FDdkJyRSxJQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsQ0FEdUIsRUFFdkIwRixRQUZ1QixFQUd2QkMsbUJBSHVCLEVBSXZCbEQsaUJBSnVCLENBRjNCO0FBU0QsV0FkWSxFQWVaRSxNQWZZLENBZUwsZUFBTztBQUNiLGdCQUFJLENBQUNoQixJQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsQ0FBTCxFQUFpQztBQUMvQixxQkFBTyxJQUFQO0FBQ0Q7QUFDRCxtQkFBTzJCLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixFQUEyQitDLE1BQTNCLEdBQW9DLENBQTNDO0FBQ0QsV0FwQlksQ0FBZjtBQXFCRDs7QUFFRCxlQUFPd0QsWUFBUDtBQUNEO0FBNVlVO0FBQUE7QUFBQSwrQkE4WUQzRyxJQTlZQyxFQThZSzZGLE1BOVlMLEVBOFl5QztBQUFBOztBQUFBLFlBQTVCRyxxQkFBNEIsdUVBQUosRUFBSTs7QUFDbEQsWUFBSSxDQUFDSCxPQUFPMUMsTUFBWixFQUFvQjtBQUNsQixpQkFBT25ELElBQVA7QUFDRDs7QUFFRCxZQUFNa0csYUFBYSxDQUFDLEtBQUszRyxLQUFMLENBQVcySCxhQUFYLElBQTRCeEgsZ0JBQUV5SCxPQUEvQixFQUNqQm5ILElBRGlCLEVBRWpCNkYsT0FBT3BELEdBQVAsQ0FBVyxnQkFBUTtBQUNqQjtBQUNBLGNBQUl1RCxzQkFBc0JvQixLQUFLeEYsRUFBM0IsQ0FBSixFQUFvQztBQUNsQyxtQkFBTyxVQUFDeUYsQ0FBRCxFQUFJQyxDQUFKO0FBQUEscUJBQVV0QixzQkFBc0JvQixLQUFLeEYsRUFBM0IsRUFBK0J5RixFQUFFRCxLQUFLeEYsRUFBUCxDQUEvQixFQUEyQzBGLEVBQUVGLEtBQUt4RixFQUFQLENBQTNDLEVBQXVEd0YsS0FBS0csSUFBNUQsQ0FBVjtBQUFBLGFBQVA7QUFDRDtBQUNELGlCQUFPLFVBQUNGLENBQUQsRUFBSUMsQ0FBSjtBQUFBLG1CQUFVLE9BQUsvSCxLQUFMLENBQVdpSSxpQkFBWCxDQUE2QkgsRUFBRUQsS0FBS3hGLEVBQVAsQ0FBN0IsRUFBeUMwRixFQUFFRixLQUFLeEYsRUFBUCxDQUF6QyxFQUFxRHdGLEtBQUtHLElBQTFELENBQVY7QUFBQSxXQUFQO0FBQ0QsU0FORCxDQUZpQixFQVNqQjFCLE9BQU9wRCxHQUFQLENBQVc7QUFBQSxpQkFBSyxDQUFDQyxFQUFFNkUsSUFBUjtBQUFBLFNBQVgsQ0FUaUIsRUFVakIsS0FBS2hJLEtBQUwsQ0FBV2lCLFFBVk0sQ0FBbkI7O0FBYUEwRixtQkFBV3RGLE9BQVgsQ0FBbUIsZUFBTztBQUN4QixjQUFJLENBQUNtQixJQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsQ0FBTCxFQUFpQztBQUMvQjtBQUNEO0FBQ0QyQixjQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsSUFBNkIsT0FBSytGLFFBQUwsQ0FDM0JwRSxJQUFJLE9BQUt4QyxLQUFMLENBQVdhLFVBQWYsQ0FEMkIsRUFFM0J5RixNQUYyQixFQUczQkcscUJBSDJCLENBQTdCO0FBS0QsU0FURDs7QUFXQSxlQUFPRSxVQUFQO0FBQ0Q7QUE1YVU7QUFBQTtBQUFBLG1DQThhRztBQUNaLGVBQU94RyxnQkFBRXVELGVBQUYsQ0FBa0IsS0FBSzFELEtBQUwsQ0FBV2tJLE9BQTdCLEVBQXNDLEtBQUtqQixjQUFMLENBQW9CLFVBQXBCLENBQXRDLENBQVA7QUFDRDs7QUFFRDs7QUFsYlc7QUFBQTtBQUFBLG1DQW1iR0QsSUFuYkgsRUFtYlM7QUFBQSxxQkFDNkIsS0FBS2hILEtBRGxDO0FBQUEsWUFDVm1JLFlBRFUsVUFDVkEsWUFEVTtBQUFBLFlBQ0lDLG9CQURKLFVBQ0lBLG9CQURKOzs7QUFHbEIsWUFBTS9ILFdBQVcsRUFBRTJHLFVBQUYsRUFBakI7QUFDQSxZQUFJb0Isb0JBQUosRUFBMEI7QUFDeEIvSCxtQkFBU2dJLFFBQVQsR0FBb0IsRUFBcEI7QUFDRDtBQUNELGFBQUtDLGdCQUFMLENBQXNCakksUUFBdEIsRUFBZ0M7QUFBQSxpQkFBTThILGdCQUFnQkEsYUFBYW5CLElBQWIsQ0FBdEI7QUFBQSxTQUFoQztBQUNEO0FBM2JVO0FBQUE7QUFBQSx1Q0E2Yk91QixXQTdiUCxFQTZib0I7QUFBQSxZQUNyQkMsZ0JBRHFCLEdBQ0EsS0FBS3hJLEtBREwsQ0FDckJ3SSxnQkFEcUI7O0FBQUEsZ0NBRUYsS0FBS3pCLGdCQUFMLEVBRkU7QUFBQSxZQUVyQkcsUUFGcUIscUJBRXJCQSxRQUZxQjtBQUFBLFlBRVhGLElBRlcscUJBRVhBLElBRlc7O0FBSTdCOzs7QUFDQSxZQUFNeUIsYUFBYXZCLFdBQVdGLElBQTlCO0FBQ0EsWUFBTTBCLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0gsYUFBYUYsV0FBeEIsQ0FBaEI7O0FBRUEsYUFBS0QsZ0JBQUwsQ0FDRTtBQUNFcEIsb0JBQVVxQixXQURaO0FBRUV2QixnQkFBTTBCO0FBRlIsU0FERixFQUtFO0FBQUEsaUJBQU1GLG9CQUFvQkEsaUJBQWlCRCxXQUFqQixFQUE4QkcsT0FBOUIsQ0FBMUI7QUFBQSxTQUxGO0FBT0Q7QUE1Y1U7QUFBQTtBQUFBLGlDQThjQ3BILE1BOWNELEVBOGNTdUgsUUE5Y1QsRUE4Y21CO0FBQUEsaUNBQ3NCLEtBQUs5QixnQkFBTCxFQUR0QjtBQUFBLFlBQ3BCVCxNQURvQixzQkFDcEJBLE1BRG9CO0FBQUEsWUFDWndDLFlBRFksc0JBQ1pBLFlBRFk7QUFBQSxZQUNFQyxlQURGLHNCQUNFQSxlQURGOztBQUc1QixZQUFNQyxxQkFBcUJsRCxPQUFPbUQsU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElBQWhDLENBQXFDN0gsTUFBckMsRUFBNkMsaUJBQTdDLElBQ3ZCQSxPQUFPeUgsZUFEZ0IsR0FFdkJBLGVBRko7QUFHQSxZQUFNSyxzQkFBc0IsQ0FBQ0osa0JBQTdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSUYsWUFBSixFQUFrQjtBQUNoQixlQUFLUixnQkFBTCxDQUFzQjtBQUNwQlEsMEJBQWM7QUFETSxXQUF0QjtBQUdBO0FBQ0Q7O0FBakIyQixZQW1CcEJPLGNBbkJvQixHQW1CRCxLQUFLckosS0FuQkosQ0FtQnBCcUosY0FuQm9COzs7QUFxQjVCLFlBQUlDLFlBQVluSixnQkFBRW9KLEtBQUYsQ0FBUWpELFVBQVUsRUFBbEIsRUFBc0JwRCxHQUF0QixDQUEwQixhQUFLO0FBQzdDQyxZQUFFNkUsSUFBRixHQUFTN0gsZ0JBQUVxSixhQUFGLENBQWdCckcsQ0FBaEIsQ0FBVDtBQUNBLGlCQUFPQSxDQUFQO0FBQ0QsU0FIZSxDQUFoQjtBQUlBLFlBQUksQ0FBQ2hELGdCQUFFc0osT0FBRixDQUFVbkksTUFBVixDQUFMLEVBQXdCO0FBQ3RCO0FBQ0EsY0FBTW9JLGdCQUFnQkosVUFBVXhGLFNBQVYsQ0FBb0I7QUFBQSxtQkFBS1gsRUFBRWQsRUFBRixLQUFTZixPQUFPZSxFQUFyQjtBQUFBLFdBQXBCLENBQXRCO0FBQ0EsY0FBSXFILGdCQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBQ3RCLGdCQUFNQyxXQUFXTCxVQUFVSSxhQUFWLENBQWpCO0FBQ0EsZ0JBQUlDLFNBQVMzQixJQUFULEtBQWtCb0IsbUJBQXRCLEVBQTJDO0FBQ3pDLGtCQUFJUCxRQUFKLEVBQWM7QUFDWlMsMEJBQVUxRSxNQUFWLENBQWlCOEUsYUFBakIsRUFBZ0MsQ0FBaEM7QUFDRCxlQUZELE1BRU87QUFDTEMseUJBQVMzQixJQUFULEdBQWdCZ0Isa0JBQWhCO0FBQ0FNLDRCQUFZLENBQUNLLFFBQUQsQ0FBWjtBQUNEO0FBQ0YsYUFQRCxNQU9PO0FBQ0xBLHVCQUFTM0IsSUFBVCxHQUFnQm9CLG1CQUFoQjtBQUNBLGtCQUFJLENBQUNQLFFBQUwsRUFBZTtBQUNiUyw0QkFBWSxDQUFDSyxRQUFELENBQVo7QUFDRDtBQUNGO0FBQ0YsV0FmRCxNQWVPLElBQUlkLFFBQUosRUFBYztBQUNuQlMsc0JBQVV0RyxJQUFWLENBQWU7QUFDYlgsa0JBQUlmLE9BQU9lLEVBREU7QUFFYjJGLG9CQUFNZ0I7QUFGTyxhQUFmO0FBSUQsV0FMTSxNQUtBO0FBQ0xNLHdCQUFZLENBQ1Y7QUFDRWpILGtCQUFJZixPQUFPZSxFQURiO0FBRUUyRixvQkFBTWdCO0FBRlIsYUFEVSxDQUFaO0FBTUQ7QUFDRixTQS9CRCxNQStCTztBQUNMO0FBQ0EsY0FBTVUsaUJBQWdCSixVQUFVeEYsU0FBVixDQUFvQjtBQUFBLG1CQUFLWCxFQUFFZCxFQUFGLEtBQVNmLE9BQU8sQ0FBUCxFQUFVZSxFQUF4QjtBQUFBLFdBQXBCLENBQXRCO0FBQ0E7QUFDQSxjQUFJcUgsaUJBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDdEIsZ0JBQU1DLFlBQVdMLFVBQVVJLGNBQVYsQ0FBakI7QUFDQSxnQkFBSUMsVUFBUzNCLElBQVQsS0FBa0JvQixtQkFBdEIsRUFBMkM7QUFDekMsa0JBQUlQLFFBQUosRUFBYztBQUNaUywwQkFBVTFFLE1BQVYsQ0FBaUI4RSxjQUFqQixFQUFnQ3BJLE9BQU9zQyxNQUF2QztBQUNELGVBRkQsTUFFTztBQUNMdEMsdUJBQU9ELE9BQVAsQ0FBZSxVQUFDOEIsQ0FBRCxFQUFJZ0MsQ0FBSixFQUFVO0FBQ3ZCbUUsNEJBQVVJLGlCQUFnQnZFLENBQTFCLEVBQTZCNkMsSUFBN0IsR0FBb0NnQixrQkFBcEM7QUFDRCxpQkFGRDtBQUdEO0FBQ0YsYUFSRCxNQVFPO0FBQ0wxSCxxQkFBT0QsT0FBUCxDQUFlLFVBQUM4QixDQUFELEVBQUlnQyxDQUFKLEVBQVU7QUFDdkJtRSwwQkFBVUksaUJBQWdCdkUsQ0FBMUIsRUFBNkI2QyxJQUE3QixHQUFvQ29CLG1CQUFwQztBQUNELGVBRkQ7QUFHRDtBQUNELGdCQUFJLENBQUNQLFFBQUwsRUFBZTtBQUNiUywwQkFBWUEsVUFBVWpHLEtBQVYsQ0FBZ0JxRyxjQUFoQixFQUErQnBJLE9BQU9zQyxNQUF0QyxDQUFaO0FBQ0Q7QUFDRDtBQUNELFdBbkJELE1BbUJPLElBQUlpRixRQUFKLEVBQWM7QUFDbkJTLHdCQUFZQSxVQUFVckUsTUFBVixDQUNWM0QsT0FBTzRCLEdBQVAsQ0FBVztBQUFBLHFCQUFNO0FBQ2ZiLG9CQUFJYyxFQUFFZCxFQURTO0FBRWYyRixzQkFBTWdCO0FBRlMsZUFBTjtBQUFBLGFBQVgsQ0FEVSxDQUFaO0FBTUQsV0FQTSxNQU9BO0FBQ0xNLHdCQUFZaEksT0FBTzRCLEdBQVAsQ0FBVztBQUFBLHFCQUFNO0FBQzNCYixvQkFBSWMsRUFBRWQsRUFEcUI7QUFFM0IyRixzQkFBTWdCO0FBRnFCLGVBQU47QUFBQSxhQUFYLENBQVo7QUFJRDtBQUNGOztBQUVELGFBQUtWLGdCQUFMLENBQ0U7QUFDRXRCLGdCQUFPLENBQUNWLE9BQU8xQyxNQUFSLElBQWtCMEYsVUFBVTFGLE1BQTdCLElBQXdDLENBQUNpRixRQUF6QyxHQUFvRCxDQUFwRCxHQUF3RCxLQUFLNUksS0FBTCxDQUFXK0csSUFEM0U7QUFFRVYsa0JBQVFnRDtBQUZWLFNBREYsRUFLRTtBQUFBLGlCQUFNRCxrQkFBa0JBLGVBQWVDLFNBQWYsRUFBMEJoSSxNQUExQixFQUFrQ3VILFFBQWxDLENBQXhCO0FBQUEsU0FMRjtBQU9EO0FBbmpCVTtBQUFBO0FBQUEsbUNBcWpCR3ZILE1BcmpCSCxFQXFqQlc0RSxLQXJqQlgsRUFxakJrQjtBQUFBLGlDQUNOLEtBQUthLGdCQUFMLEVBRE07QUFBQSxZQUNuQlIsUUFEbUIsc0JBQ25CQSxRQURtQjs7QUFBQSxZQUVuQnFELGdCQUZtQixHQUVFLEtBQUs1SixLQUZQLENBRW5CNEosZ0JBRm1COztBQUkzQjs7QUFDQSxZQUFNQyxlQUFlLENBQUN0RCxZQUFZLEVBQWIsRUFBaUIvQyxNQUFqQixDQUF3QjtBQUFBLGlCQUFLK0QsRUFBRWxGLEVBQUYsS0FBU2YsT0FBT2UsRUFBckI7QUFBQSxTQUF4QixDQUFyQjs7QUFFQSxZQUFJNkQsVUFBVSxFQUFkLEVBQWtCO0FBQ2hCMkQsdUJBQWE3RyxJQUFiLENBQWtCO0FBQ2hCWCxnQkFBSWYsT0FBT2UsRUFESztBQUVoQjZEO0FBRmdCLFdBQWxCO0FBSUQ7O0FBRUQsYUFBS29DLGdCQUFMLENBQ0U7QUFDRS9CLG9CQUFVc0Q7QUFEWixTQURGLEVBSUU7QUFBQSxpQkFBTUQsb0JBQW9CQSxpQkFBaUJDLFlBQWpCLEVBQStCdkksTUFBL0IsRUFBdUM0RSxLQUF2QyxDQUExQjtBQUFBLFNBSkY7QUFNRDtBQXprQlU7QUFBQTtBQUFBLHdDQTJrQlE0RCxLQTNrQlIsRUEya0JleEksTUEza0JmLEVBMmtCdUJ5SSxPQTNrQnZCLEVBMmtCZ0M7QUFBQTs7QUFDekNELGNBQU1FLGVBQU47QUFDQSxZQUFNQyxjQUFjSCxNQUFNSSxNQUFOLENBQWFDLGFBQWIsQ0FBMkJDLHFCQUEzQixHQUFtREMsS0FBdkU7O0FBRUEsWUFBSUMsY0FBSjtBQUNBLFlBQUlQLE9BQUosRUFBYTtBQUNYTyxrQkFBUVIsTUFBTVMsY0FBTixDQUFxQixDQUFyQixFQUF3QkQsS0FBaEM7QUFDRCxTQUZELE1BRU87QUFDTEEsa0JBQVFSLE1BQU1RLEtBQWQ7QUFDRDs7QUFFRCxhQUFLRSxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsYUFBS2xDLGdCQUFMLENBQ0U7QUFDRW1DLDZCQUFtQjtBQUNqQnBJLGdCQUFJZixPQUFPZSxFQURNO0FBRWpCcUksb0JBQVFKLEtBRlM7QUFHakJMO0FBSGlCO0FBRHJCLFNBREYsRUFRRSxZQUFNO0FBQ0osY0FBSUYsT0FBSixFQUFhO0FBQ1hZLHFCQUFTQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxPQUFLQyxrQkFBNUM7QUFDQUYscUJBQVNDLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLE9BQUtFLGVBQTlDO0FBQ0FILHFCQUFTQyxnQkFBVCxDQUEwQixVQUExQixFQUFzQyxPQUFLRSxlQUEzQztBQUNELFdBSkQsTUFJTztBQUNMSCxxQkFBU0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsT0FBS0Msa0JBQTVDO0FBQ0FGLHFCQUFTQyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxPQUFLRSxlQUExQztBQUNBSCxxQkFBU0MsZ0JBQVQsQ0FBMEIsWUFBMUIsRUFBd0MsT0FBS0UsZUFBN0M7QUFDRDtBQUNGLFNBbEJIO0FBb0JEO0FBM21CVTtBQUFBO0FBQUEseUNBNm1CU2hCLEtBN21CVCxFQTZtQmdCO0FBQ3pCQSxjQUFNRSxlQUFOO0FBRHlCLHNCQUVXLEtBQUtoSyxLQUZoQjtBQUFBLFlBRWpCK0ssZUFGaUIsV0FFakJBLGVBRmlCO0FBQUEsWUFFQXpKLE1BRkEsV0FFQUEsTUFGQTs7QUFBQSxpQ0FHdUIsS0FBS3lGLGdCQUFMLEVBSHZCO0FBQUEsWUFHakJpRSxPQUhpQixzQkFHakJBLE9BSGlCO0FBQUEsWUFHUlAsaUJBSFEsc0JBR1JBLGlCQUhRO0FBQUEsWUFHV2xLLE9BSFgsc0JBR1dBLE9BSFg7O0FBSXpCLFlBQU0wSyxnQkFBZ0IxSyxRQUFRa0IsSUFBUixDQUNwQjtBQUFBLGlCQUFLeUosRUFBRTlJLFFBQUYsS0FBZXFJLGtCQUFrQnBJLEVBQWpDLElBQXVDNkksRUFBRTdJLEVBQUYsS0FBU29JLGtCQUFrQnBJLEVBQXZFO0FBQUEsU0FEb0IsQ0FBdEI7QUFHQSxZQUFNOEksaUJBQ0pGLGlCQUFpQkEsY0FBY0UsY0FBZCxJQUFnQyxJQUFqRCxHQUNJRixjQUFjRSxjQURsQixHQUVJN0osT0FBTzZKLGNBSGI7O0FBS0E7QUFDQSxZQUFNQyxhQUFhSixRQUFReEgsTUFBUixDQUFlO0FBQUEsaUJBQUsrRCxFQUFFbEYsRUFBRixLQUFTb0ksa0JBQWtCcEksRUFBaEM7QUFBQSxTQUFmLENBQW5COztBQUVBLFlBQUlpSSxjQUFKOztBQUVBLFlBQUlSLE1BQU11QixJQUFOLEtBQWUsV0FBbkIsRUFBZ0M7QUFDOUJmLGtCQUFRUixNQUFNUyxjQUFOLENBQXFCLENBQXJCLEVBQXdCRCxLQUFoQztBQUNELFNBRkQsTUFFTyxJQUFJUixNQUFNdUIsSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQ3JDZixrQkFBUVIsTUFBTVEsS0FBZDtBQUNEOztBQUVELFlBQU1nQixXQUFXM0MsS0FBSzRDLEdBQUwsQ0FDZmQsa0JBQWtCUixXQUFsQixHQUFnQ0ssS0FBaEMsR0FBd0NHLGtCQUFrQkMsTUFEM0MsRUFFZlMsY0FGZSxDQUFqQjs7QUFLQUMsbUJBQVdwSSxJQUFYLENBQWdCO0FBQ2RYLGNBQUlvSSxrQkFBa0JwSSxFQURSO0FBRWQ2RCxpQkFBT29GO0FBRk8sU0FBaEI7O0FBS0EsYUFBS2hELGdCQUFMLENBQ0U7QUFDRTBDLG1CQUFTSTtBQURYLFNBREYsRUFJRTtBQUFBLGlCQUFNTCxtQkFBbUJBLGdCQUFnQkssVUFBaEIsRUFBNEJ0QixLQUE1QixDQUF6QjtBQUFBLFNBSkY7QUFNRDtBQXBwQlU7QUFBQTtBQUFBLHNDQXNwQk1BLEtBdHBCTixFQXNwQmE7QUFDdEJBLGNBQU1FLGVBQU47QUFDQSxZQUFNRCxVQUFVRCxNQUFNdUIsSUFBTixLQUFlLFVBQWYsSUFBNkJ2QixNQUFNdUIsSUFBTixLQUFlLGFBQTVEOztBQUVBLFlBQUl0QixPQUFKLEVBQWE7QUFDWFksbUJBQVNhLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUtYLGtCQUEvQztBQUNBRixtQkFBU2EsbUJBQVQsQ0FBNkIsYUFBN0IsRUFBNEMsS0FBS1YsZUFBakQ7QUFDQUgsbUJBQVNhLG1CQUFULENBQTZCLFVBQTdCLEVBQXlDLEtBQUtWLGVBQTlDO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBSCxpQkFBU2EsbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBS1gsa0JBQS9DO0FBQ0FGLGlCQUFTYSxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxLQUFLVixlQUE3QztBQUNBSCxpQkFBU2EsbUJBQVQsQ0FBNkIsWUFBN0IsRUFBMkMsS0FBS1YsZUFBaEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSSxDQUFDZixPQUFMLEVBQWM7QUFDWixlQUFLekIsZ0JBQUwsQ0FBc0I7QUFDcEJRLDBCQUFjLElBRE07QUFFcEIyQiwrQkFBbUI7QUFGQyxXQUF0QjtBQUlEO0FBQ0Y7QUEvcUJVOztBQUFBO0FBQUEsSUFDQ2dCLElBREQ7QUFBQSxDIiwiZmlsZSI6Im1ldGhvZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBfIGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYXNlID0+XHJcbiAgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcclxuICAgIGdldFJlc29sdmVkU3RhdGUgKHByb3BzLCBzdGF0ZSkge1xyXG4gICAgICBjb25zdCByZXNvbHZlZFN0YXRlID0ge1xyXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdCh0aGlzLnN0YXRlKSxcclxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5wcm9wcyksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHN0YXRlKSxcclxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QocHJvcHMpLFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXNvbHZlZFN0YXRlXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YU1vZGVsIChuZXdTdGF0ZSwgZGF0YUNoYW5nZWQpIHtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgcGl2b3RCeSA9IFtdLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgcmVzb2x2ZURhdGEsXHJcbiAgICAgICAgcGl2b3RJREtleSxcclxuICAgICAgICBwaXZvdFZhbEtleSxcclxuICAgICAgICBzdWJSb3dzS2V5LFxyXG4gICAgICAgIGFnZ3JlZ2F0ZWRLZXksXHJcbiAgICAgICAgbmVzdGluZ0xldmVsS2V5LFxyXG4gICAgICAgIG9yaWdpbmFsS2V5LFxyXG4gICAgICAgIGluZGV4S2V5LFxyXG4gICAgICAgIGdyb3VwZWRCeVBpdm90S2V5LFxyXG4gICAgICAgIFN1YkNvbXBvbmVudCxcclxuICAgICAgfSA9IG5ld1N0YXRlXHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgSGVhZGVyIEdyb3Vwc1xyXG4gICAgICBsZXQgaGFzSGVhZGVyR3JvdXBzID0gZmFsc2VcclxuICAgICAgY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICBoYXNIZWFkZXJHcm91cHMgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgbGV0IGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbLi4uY29sdW1uc11cclxuXHJcbiAgICAgIGxldCBleHBhbmRlckNvbHVtbiA9IGNvbHVtbnMuZmluZChcclxuICAgICAgICBjb2wgPT4gY29sLmV4cGFuZGVyIHx8IChjb2wuY29sdW1ucyAmJiBjb2wuY29sdW1ucy5zb21lKGNvbDIgPT4gY29sMi5leHBhbmRlcikpXHJcbiAgICAgIClcclxuICAgICAgLy8gVGhlIGFjdHVhbCBleHBhbmRlciBtaWdodCBiZSBpbiB0aGUgY29sdW1ucyBmaWVsZCBvZiBhIGdyb3VwIGNvbHVtblxyXG4gICAgICBpZiAoZXhwYW5kZXJDb2x1bW4gJiYgIWV4cGFuZGVyQ29sdW1uLmV4cGFuZGVyKSB7XHJcbiAgICAgICAgZXhwYW5kZXJDb2x1bW4gPSBleHBhbmRlckNvbHVtbi5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5leHBhbmRlcilcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgd2UgaGF2ZSBTdWJDb21wb25lbnQncyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGV4cGFuZGVyIGNvbHVtblxyXG4gICAgICBpZiAoU3ViQ29tcG9uZW50ICYmICFleHBhbmRlckNvbHVtbikge1xyXG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0geyBleHBhbmRlcjogdHJ1ZSB9XHJcbiAgICAgICAgY29sdW1uc1dpdGhFeHBhbmRlciA9IFtleHBhbmRlckNvbHVtbiwgLi4uY29sdW1uc1dpdGhFeHBhbmRlcl1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xyXG4gICAgICAgIGxldCBkY29sXHJcbiAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikge1xyXG4gICAgICAgICAgZGNvbCA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuZXhwYW5kZXJEZWZhdWx0cyxcclxuICAgICAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkY29sID0ge1xyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIG1pbldpZHRoIGlzIG5vdCBncmVhdGVyIHRoYW4gbWF4V2lkdGggaWYgc2V0XHJcbiAgICAgICAgaWYgKGRjb2wubWF4V2lkdGggPCBkY29sLm1pbldpZHRoKSB7XHJcbiAgICAgICAgICBkY29sLm1pbldpZHRoID0gZGNvbC5tYXhXaWR0aFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmVudENvbHVtbikge1xyXG4gICAgICAgICAgZGNvbC5wYXJlbnRDb2x1bW4gPSBwYXJlbnRDb2x1bW5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGZvciBzdHJpbmcgYWNjZXNzb3JcclxuICAgICAgICBpZiAodHlwZW9mIGRjb2wuYWNjZXNzb3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBkY29sLmlkID0gZGNvbC5pZCB8fCBkY29sLmFjY2Vzc29yXHJcbiAgICAgICAgICBjb25zdCBhY2Nlc3NvclN0cmluZyA9IGRjb2wuYWNjZXNzb3JcclxuICAgICAgICAgIGRjb2wuYWNjZXNzb3IgPSByb3cgPT4gXy5nZXQocm93LCBhY2Nlc3NvclN0cmluZylcclxuICAgICAgICAgIHJldHVybiBkY29sXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gZnVuY3Rpb25hbCBhY2Nlc3NvciAoYnV0IHJlcXVpcmUgYW4gSUQpXHJcbiAgICAgICAgaWYgKGRjb2wuYWNjZXNzb3IgJiYgIWRjb2wuaWQpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybihkY29sKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICAnQSBjb2x1bW4gaWQgaXMgcmVxdWlyZWQgaWYgdXNpbmcgYSBub24tc3RyaW5nIGFjY2Vzc29yIGZvciBjb2x1bW4gYWJvdmUuJ1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIGFuIHVuZGVmaW5lZCBhY2Nlc3NvclxyXG4gICAgICAgIGlmICghZGNvbC5hY2Nlc3Nvcikge1xyXG4gICAgICAgICAgZGNvbC5hY2Nlc3NvciA9ICgpID0+IHVuZGVmaW5lZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRjb2xcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYWxsRGVjb3JhdGVkQ29sdW1ucyA9IFtdXHJcblxyXG4gICAgICAvLyBEZWNvcmF0ZSB0aGUgY29sdW1uc1xyXG4gICAgICBjb25zdCBkZWNvcmF0ZUFuZEFkZFRvQWxsID0gKGNvbHVtbiwgcGFyZW50Q29sdW1uKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1uID0gbWFrZURlY29yYXRlZENvbHVtbihjb2x1bW4sIHBhcmVudENvbHVtbilcclxuICAgICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zLnB1c2goZGVjb3JhdGVkQ29sdW1uKVxyXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZWRDb2x1bW5cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoRXhwYW5kZXIubWFwKGNvbHVtbiA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5jb2x1bW4sXHJcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbi5jb2x1bW5zLm1hcChkID0+IGRlY29yYXRlQW5kQWRkVG9BbGwoZCwgY29sdW1uKSksXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZUFuZEFkZFRvQWxsKGNvbHVtbilcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIEJ1aWxkIHRoZSB2aXNpYmxlIGNvbHVtbnMsIGhlYWRlcnMgYW5kIGZsYXQgY29sdW1uIGxpc3RcclxuICAgICAgbGV0IHZpc2libGVDb2x1bW5zID0gZGVjb3JhdGVkQ29sdW1ucy5zbGljZSgpXHJcbiAgICAgIGxldCBhbGxWaXNpYmxlQ29sdW1ucyA9IFtdXHJcblxyXG4gICAgICB2aXNpYmxlQ29sdW1ucyA9IHZpc2libGVDb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgY29uc3QgdmlzaWJsZVN1YkNvbHVtbnMgPSBjb2x1bW4uY29sdW1ucy5maWx0ZXIoZCA9PlxyXG4gICAgICAgICAgICBwaXZvdEJ5LmluZGV4T2YoZC5pZCkgPiAtMSA/IGZhbHNlIDogXy5nZXRGaXJzdERlZmluZWQoZC5zaG93LCB0cnVlKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgICAgICBjb2x1bW5zOiB2aXNpYmxlU3ViQ29sdW1ucyxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbHVtblxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5maWx0ZXIoY29sdW1uID0+XHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnNcclxuICAgICAgICAgID8gY29sdW1uLmNvbHVtbnMubGVuZ3RoXHJcbiAgICAgICAgICA6IHBpdm90QnkuaW5kZXhPZihjb2x1bW4uaWQpID4gLTFcclxuICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICA6IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zaG93LCB0cnVlKVxyXG4gICAgICApXHJcblxyXG4gICAgICAvLyBGaW5kIGFueSBjdXN0b20gcGl2b3QgbG9jYXRpb25cclxuICAgICAgY29uc3QgcGl2b3RJbmRleCA9IHZpc2libGVDb2x1bW5zLmZpbmRJbmRleChjb2wgPT4gY29sLnBpdm90KVxyXG5cclxuICAgICAgLy8gSGFuZGxlIFBpdm90IENvbHVtbnNcclxuICAgICAgaWYgKHBpdm90QnkubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gUmV0cmlldmUgdGhlIHBpdm90IGNvbHVtbnMgaW4gdGhlIGNvcnJlY3QgcGl2b3Qgb3JkZXJcclxuICAgICAgICBjb25zdCBwaXZvdENvbHVtbnMgPSBbXVxyXG4gICAgICAgIHBpdm90QnkuZm9yRWFjaChwaXZvdElEID0+IHtcclxuICAgICAgICAgIGNvbnN0IGZvdW5kID0gYWxsRGVjb3JhdGVkQ29sdW1ucy5maW5kKGQgPT4gZC5pZCA9PT0gcGl2b3RJRClcclxuICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICBwaXZvdENvbHVtbnMucHVzaChmb3VuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCBQaXZvdFBhcmVudENvbHVtbiA9IHBpdm90Q29sdW1ucy5yZWR1Y2UoXHJcbiAgICAgICAgICAocHJldiwgY3VycmVudCkgPT4gcHJldiAmJiBwcmV2ID09PSBjdXJyZW50LnBhcmVudENvbHVtbiAmJiBjdXJyZW50LnBhcmVudENvbHVtbixcclxuICAgICAgICAgIHBpdm90Q29sdW1uc1swXS5wYXJlbnRDb2x1bW5cclxuICAgICAgICApXHJcblxyXG4gICAgICAgIGxldCBQaXZvdEdyb3VwSGVhZGVyID0gaGFzSGVhZGVyR3JvdXBzICYmIFBpdm90UGFyZW50Q29sdW1uLkhlYWRlclxyXG4gICAgICAgIFBpdm90R3JvdXBIZWFkZXIgPSBQaXZvdEdyb3VwSGVhZGVyIHx8ICgoKSA9PiA8c3Ryb25nPlBpdm90ZWQ8L3N0cm9uZz4pXHJcblxyXG4gICAgICAgIGxldCBwaXZvdENvbHVtbkdyb3VwID0ge1xyXG4gICAgICAgICAgSGVhZGVyOiBQaXZvdEdyb3VwSGVhZGVyLFxyXG4gICAgICAgICAgY29sdW1uczogcGl2b3RDb2x1bW5zLm1hcChjb2wgPT4gKHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5waXZvdERlZmF1bHRzLFxyXG4gICAgICAgICAgICAuLi5jb2wsXHJcbiAgICAgICAgICAgIHBpdm90ZWQ6IHRydWUsXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQbGFjZSB0aGUgcGl2b3RDb2x1bW5zIGJhY2sgaW50byB0aGUgdmlzaWJsZUNvbHVtbnNcclxuICAgICAgICBpZiAocGl2b3RJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICBwaXZvdENvbHVtbkdyb3VwID0ge1xyXG4gICAgICAgICAgICAuLi52aXNpYmxlQ29sdW1uc1twaXZvdEluZGV4XSxcclxuICAgICAgICAgICAgLi4ucGl2b3RDb2x1bW5Hcm91cCxcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZpc2libGVDb2x1bW5zLnNwbGljZShwaXZvdEluZGV4LCAxLCBwaXZvdENvbHVtbkdyb3VwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2aXNpYmxlQ29sdW1ucy51bnNoaWZ0KHBpdm90Q29sdW1uR3JvdXApXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBCdWlsZCBIZWFkZXIgR3JvdXBzXHJcbiAgICAgIGNvbnN0IGhlYWRlckdyb3VwcyA9IFtdXHJcbiAgICAgIGxldCBjdXJyZW50U3BhbiA9IFtdXHJcblxyXG4gICAgICAvLyBBIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGFkZCBhIGhlYWRlciBhbmQgcmVzZXQgdGhlIGN1cnJlbnRTcGFuXHJcbiAgICAgIGNvbnN0IGFkZEhlYWRlciA9IChjb2x1bW5zLCBjb2x1bW4pID0+IHtcclxuICAgICAgICBoZWFkZXJHcm91cHMucHVzaCh7XHJcbiAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcclxuICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjdXJyZW50U3BhbiA9IFtdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEJ1aWxkIGZsYXN0IGxpc3Qgb2YgYWxsVmlzaWJsZUNvbHVtbnMgYW5kIEhlYWRlckdyb3Vwc1xyXG4gICAgICB2aXNpYmxlQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmNvbmNhdChjb2x1bW4uY29sdW1ucylcclxuICAgICAgICAgIGlmIChjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGFkZEhlYWRlcihjb2x1bW4uY29sdW1ucywgY29sdW1uKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLnB1c2goY29sdW1uKVxyXG4gICAgICAgIGN1cnJlbnRTcGFuLnB1c2goY29sdW1uKVxyXG4gICAgICB9KVxyXG4gICAgICBpZiAoaGFzSGVhZGVyR3JvdXBzICYmIGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFjY2VzcyB0aGUgZGF0YVxyXG4gICAgICBjb25zdCBhY2Nlc3NSb3cgPSAoZCwgaSwgbGV2ZWwgPSAwKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0ge1xyXG4gICAgICAgICAgW29yaWdpbmFsS2V5XTogZCxcclxuICAgICAgICAgIFtpbmRleEtleV06IGksXHJcbiAgICAgICAgICBbc3ViUm93c0tleV06IGRbc3ViUm93c0tleV0sXHJcbiAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogbGV2ZWwsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikgcmV0dXJuXHJcbiAgICAgICAgICByb3dbY29sdW1uLmlkXSA9IGNvbHVtbi5hY2Nlc3NvcihkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHJvd1tzdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcm93W3N1YlJvd3NLZXldID0gcm93W3N1YlJvd3NLZXldLm1hcCgoZCwgaSkgPT4gYWNjZXNzUm93KGQsIGksIGxldmVsICsgMSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3dcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gLy8gSWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIGp1c3QgdXNlIHRoZSBjYWNoZWQgZGF0YVxyXG4gICAgICBsZXQgcmVzb2x2ZWREYXRhID0gdGhpcy5yZXNvbHZlZERhdGFcclxuICAgICAgLy8gSWYgdGhlIGRhdGEgaGFzIGNoYW5nZWQsIHJ1biB0aGUgZGF0YSByZXNvbHZlciBhbmQgY2FjaGUgdGhlIHJlc3VsdFxyXG4gICAgICBpZiAoIXRoaXMucmVzb2x2ZWREYXRhIHx8IGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzb2x2ZURhdGEoZGF0YSlcclxuICAgICAgICB0aGlzLnJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFVzZSB0aGUgcmVzb2x2ZWQgZGF0YVxyXG4gICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlZERhdGEubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSkpXHJcblxyXG4gICAgICAvLyBUT0RPOiBNYWtlIGl0IHBvc3NpYmxlIHRvIGZhYnJpY2F0ZSBuZXN0ZWQgcm93cyB3aXRob3V0IHBpdm90aW5nXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0aW5nQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmZpbHRlcihkID0+ICFkLmV4cGFuZGVyICYmIGQuYWdncmVnYXRlKVxyXG5cclxuICAgICAgLy8gSWYgcGl2b3RpbmcsIHJlY3Vyc2l2ZWx5IGdyb3VwIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZSA9IHJvd3MgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9uVmFsdWVzID0ge31cclxuICAgICAgICBhZ2dyZWdhdGluZ0NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gcm93cy5tYXAoZCA9PiBkW2NvbHVtbi5pZF0pXHJcbiAgICAgICAgICBhZ2dyZWdhdGlvblZhbHVlc1tjb2x1bW4uaWRdID0gY29sdW1uLmFnZ3JlZ2F0ZSh2YWx1ZXMsIHJvd3MpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYWdncmVnYXRpb25WYWx1ZXNcclxuICAgICAgfVxyXG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBncm91cFJlY3Vyc2l2ZWx5ID0gKHJvd3MsIGtleXMsIGkgPSAwKSA9PiB7XHJcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGxldmVsLCBqdXN0IHJldHVybiB0aGUgcm93c1xyXG4gICAgICAgICAgaWYgKGkgPT09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb3dzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBHcm91cCB0aGUgcm93cyB0b2dldGhlciBmb3IgdGhpcyBsZXZlbFxyXG4gICAgICAgICAgbGV0IGdyb3VwZWRSb3dzID0gT2JqZWN0LmVudHJpZXMoXy5ncm91cEJ5KHJvd3MsIGtleXNbaV0pKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcclxuICAgICAgICAgICAgW3Bpdm90SURLZXldOiBrZXlzW2ldLFxyXG4gICAgICAgICAgICBbcGl2b3RWYWxLZXldOiBrZXksXHJcbiAgICAgICAgICAgIFtrZXlzW2ldXToga2V5LFxyXG4gICAgICAgICAgICBbc3ViUm93c0tleV06IHZhbHVlLFxyXG4gICAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogaSxcclxuICAgICAgICAgICAgW2dyb3VwZWRCeVBpdm90S2V5XTogdHJ1ZSxcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgLy8gUmVjdXJzZSBpbnRvIHRoZSBzdWJSb3dzXHJcbiAgICAgICAgICBncm91cGVkUm93cyA9IGdyb3VwZWRSb3dzLm1hcChyb3dHcm91cCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YlJvd3MgPSBncm91cFJlY3Vyc2l2ZWx5KHJvd0dyb3VwW3N1YlJvd3NLZXldLCBrZXlzLCBpICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAuLi5yb3dHcm91cCxcclxuICAgICAgICAgICAgICBbc3ViUm93c0tleV06IHN1YlJvd3MsXHJcbiAgICAgICAgICAgICAgW2FnZ3JlZ2F0ZWRLZXldOiB0cnVlLFxyXG4gICAgICAgICAgICAgIC4uLmFnZ3JlZ2F0ZShzdWJSb3dzKSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHJldHVybiBncm91cGVkUm93c1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXNvbHZlZERhdGEgPSBncm91cFJlY3Vyc2l2ZWx5KHJlc29sdmVkRGF0YSwgcGl2b3RCeSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5uZXdTdGF0ZSxcclxuICAgICAgICByZXNvbHZlZERhdGEsXHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXHJcbiAgICAgICAgaGVhZGVyR3JvdXBzLFxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXHJcbiAgICAgICAgaGFzSGVhZGVyR3JvdXBzLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U29ydGVkRGF0YSAocmVzb2x2ZWRTdGF0ZSkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgbWFudWFsLFxyXG4gICAgICAgIHNvcnRlZCxcclxuICAgICAgICBmaWx0ZXJlZCxcclxuICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgICAgIHJlc29sdmVkRGF0YSxcclxuICAgICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zLFxyXG4gICAgICB9ID0gcmVzb2x2ZWRTdGF0ZVxyXG5cclxuICAgICAgY29uc3Qgc29ydE1ldGhvZHNCeUNvbHVtbklEID0ge31cclxuXHJcbiAgICAgIGFsbERlY29yYXRlZENvbHVtbnNcclxuICAgICAgICAuZmlsdGVyKGNvbCA9PiBjb2wuc29ydE1ldGhvZClcclxuICAgICAgICAuZm9yRWFjaChjb2wgPT4ge1xyXG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEW2NvbC5pZF0gPSBjb2wuc29ydE1ldGhvZFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAvLyBSZXNvbHZlIHRoZSBkYXRhIGZyb20gZWl0aGVyIG1hbnVhbCBkYXRhIG9yIHNvcnRlZCBkYXRhXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc29ydGVkRGF0YTogbWFudWFsXHJcbiAgICAgICAgICA/IHJlc29sdmVkRGF0YVxyXG4gICAgICAgICAgOiB0aGlzLnNvcnREYXRhKFxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckRhdGEocmVzb2x2ZWREYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsRGVjb3JhdGVkQ29sdW1ucyksXHJcbiAgICAgICAgICAgIHNvcnRlZCxcclxuICAgICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEXHJcbiAgICAgICAgICApLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmlyZUZldGNoRGF0YSAoKSB7XHJcbiAgICAgIC8vIGRldGVybWluZSB0aGUgY3VycmVudCBzdGF0ZSwgcHJlZmVycmluZyBjZXJ0YWluIHN0YXRlIHZhbHVlcyBvdmVyIHByb3BzXHJcbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHtcclxuICAgICAgICAuLi50aGlzLmdldFJlc29sdmVkU3RhdGUoKSxcclxuICAgICAgICBwYWdlOiB0aGlzLmdldFN0YXRlT3JQcm9wKCdwYWdlJyksXHJcbiAgICAgICAgcGFnZVNpemU6IHRoaXMuZ2V0U3RhdGVPclByb3AoJ3BhZ2VTaXplJyksXHJcbiAgICAgICAgZmlsdGVyZWQ6IHRoaXMuZ2V0U3RhdGVPclByb3AoJ2ZpbHRlcmVkJyksXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucHJvcHMub25GZXRjaERhdGEoY3VycmVudFN0YXRlLCB0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIGdldFByb3BPclN0YXRlIChrZXkpIHtcclxuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHNba2V5XSwgdGhpcy5zdGF0ZVtrZXldKVxyXG4gICAgfVxyXG5cclxuICAgIGdldFN0YXRlT3JQcm9wIChrZXkpIHtcclxuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMuc3RhdGVba2V5XSwgdGhpcy5wcm9wc1trZXldKVxyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlckRhdGEgKGRhdGEsIGZpbHRlcmVkLCBkZWZhdWx0RmlsdGVyTWV0aG9kLCBhbGxWaXNpYmxlQ29sdW1ucykge1xyXG4gICAgICBsZXQgZmlsdGVyZWREYXRhID0gZGF0YVxyXG5cclxuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCkge1xyXG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkLnJlZHVjZSgoZmlsdGVyZWRTb0ZhciwgbmV4dEZpbHRlcikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY29sdW1uID0gYWxsVmlzaWJsZUNvbHVtbnMuZmluZCh4ID0+IHguaWQgPT09IG5leHRGaWx0ZXIuaWQpXHJcblxyXG4gICAgICAgICAgLy8gRG9uJ3QgZmlsdGVyIGhpZGRlbiBjb2x1bW5zIG9yIGNvbHVtbnMgdGhhdCBoYXZlIGhhZCB0aGVpciBmaWx0ZXJzIGRpc2FibGVkXHJcbiAgICAgICAgICBpZiAoIWNvbHVtbiB8fCBjb2x1bW4uZmlsdGVyYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkU29GYXJcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBmaWx0ZXJNZXRob2QgPSBjb2x1bW4uZmlsdGVyTWV0aG9kIHx8IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuXHJcbiAgICAgICAgICAvLyBJZiAnZmlsdGVyQWxsJyBpcyBzZXQgdG8gdHJ1ZSwgcGFzcyB0aGUgZW50aXJlIGRhdGFzZXQgdG8gdGhlIGZpbHRlciBtZXRob2RcclxuICAgICAgICAgIGlmIChjb2x1bW4uZmlsdGVyQWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJNZXRob2QobmV4dEZpbHRlciwgZmlsdGVyZWRTb0ZhciwgY29sdW1uKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGZpbHRlcmVkU29GYXIuZmlsdGVyKHJvdyA9PiBmaWx0ZXJNZXRob2QobmV4dEZpbHRlciwgcm93LCBjb2x1bW4pKVxyXG4gICAgICAgIH0sIGZpbHRlcmVkRGF0YSlcclxuXHJcbiAgICAgICAgLy8gQXBwbHkgdGhlIGZpbHRlciB0byB0aGUgc3Vicm93cyBpZiB3ZSBhcmUgcGl2b3RpbmcsIGFuZCB0aGVuXHJcbiAgICAgICAgLy8gZmlsdGVyIGFueSByb3dzIHdpdGhvdXQgc3ViY29sdW1ucyBiZWNhdXNlIGl0IHdvdWxkIGJlIHN0cmFuZ2UgdG8gc2hvd1xyXG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVxyXG4gICAgICAgICAgLm1hcChyb3cgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJvd1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgLi4ucm93LFxyXG4gICAgICAgICAgICAgIFt0aGlzLnByb3BzLnN1YlJvd3NLZXldOiB0aGlzLmZpbHRlckRhdGEoXHJcbiAgICAgICAgICAgICAgICByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgICAgICAgICAgICAgIGFsbFZpc2libGVDb2x1bW5zXHJcbiAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5maWx0ZXIocm93ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLmxlbmd0aCA+IDBcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmaWx0ZXJlZERhdGFcclxuICAgIH1cclxuXHJcbiAgICBzb3J0RGF0YSAoZGF0YSwgc29ydGVkLCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fSkge1xyXG4gICAgICBpZiAoIXNvcnRlZC5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzb3J0ZWREYXRhID0gKHRoaXMucHJvcHMub3JkZXJCeU1ldGhvZCB8fCBfLm9yZGVyQnkpKFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgc29ydGVkLm1hcChzb3J0ID0+IHtcclxuICAgICAgICAgIC8vIFN1cHBvcnQgY3VzdG9tIHNvcnRpbmcgbWV0aG9kcyBmb3IgZWFjaCBjb2x1bW5cclxuICAgICAgICAgIGlmIChzb3J0TWV0aG9kc0J5Q29sdW1uSURbc29ydC5pZF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIChhLCBiKSA9PiBzb3J0TWV0aG9kc0J5Q29sdW1uSURbc29ydC5pZF0oYVtzb3J0LmlkXSwgYltzb3J0LmlkXSwgc29ydC5kZXNjKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIChhLCBiKSA9PiB0aGlzLnByb3BzLmRlZmF1bHRTb3J0TWV0aG9kKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcclxuICAgICAgICB9KSxcclxuICAgICAgICBzb3J0ZWQubWFwKGQgPT4gIWQuZGVzYyksXHJcbiAgICAgICAgdGhpcy5wcm9wcy5pbmRleEtleVxyXG4gICAgICApXHJcblxyXG4gICAgICBzb3J0ZWREYXRhLmZvckVhY2gocm93ID0+IHtcclxuICAgICAgICBpZiAoIXJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldKSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0gPSB0aGlzLnNvcnREYXRhKFxyXG4gICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXHJcbiAgICAgICAgICBzb3J0ZWQsXHJcbiAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcclxuICAgICAgICApXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gc29ydGVkRGF0YVxyXG4gICAgfVxyXG5cclxuICAgIGdldE1pblJvd3MgKCkge1xyXG4gICAgICByZXR1cm4gXy5nZXRGaXJzdERlZmluZWQodGhpcy5wcm9wcy5taW5Sb3dzLCB0aGlzLmdldFN0YXRlT3JQcm9wKCdwYWdlU2l6ZScpKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFVzZXIgYWN0aW9uc1xyXG4gICAgb25QYWdlQ2hhbmdlIChwYWdlKSB7XHJcbiAgICAgIGNvbnN0IHsgb25QYWdlQ2hhbmdlLCBjb2xsYXBzZU9uUGFnZUNoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB7IHBhZ2UgfVxyXG4gICAgICBpZiAoY29sbGFwc2VPblBhZ2VDaGFuZ2UpIHtcclxuICAgICAgICBuZXdTdGF0ZS5leHBhbmRlZCA9IHt9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKG5ld1N0YXRlLCAoKSA9PiBvblBhZ2VDaGFuZ2UgJiYgb25QYWdlQ2hhbmdlKHBhZ2UpKVxyXG4gICAgfVxyXG5cclxuICAgIG9uUGFnZVNpemVDaGFuZ2UgKG5ld1BhZ2VTaXplKSB7XHJcbiAgICAgIGNvbnN0IHsgb25QYWdlU2l6ZUNoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCB7IHBhZ2VTaXplLCBwYWdlIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG5cclxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBwYWdlIHRvIGRpc3BsYXlcclxuICAgICAgY29uc3QgY3VycmVudFJvdyA9IHBhZ2VTaXplICogcGFnZVxyXG4gICAgICBjb25zdCBuZXdQYWdlID0gTWF0aC5mbG9vcihjdXJyZW50Um93IC8gbmV3UGFnZVNpemUpXHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcGFnZVNpemU6IG5ld1BhZ2VTaXplLFxyXG4gICAgICAgICAgcGFnZTogbmV3UGFnZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IG9uUGFnZVNpemVDaGFuZ2UgJiYgb25QYWdlU2l6ZUNoYW5nZShuZXdQYWdlU2l6ZSwgbmV3UGFnZSlcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHNvcnRDb2x1bW4gKGNvbHVtbiwgYWRkaXRpdmUpIHtcclxuICAgICAgY29uc3QgeyBzb3J0ZWQsIHNraXBOZXh0U29ydCwgZGVmYXVsdFNvcnREZXNjIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG5cclxuICAgICAgY29uc3QgZmlyc3RTb3J0RGlyZWN0aW9uID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbHVtbiwgJ2RlZmF1bHRTb3J0RGVzYycpXHJcbiAgICAgICAgPyBjb2x1bW4uZGVmYXVsdFNvcnREZXNjXHJcbiAgICAgICAgOiBkZWZhdWx0U29ydERlc2NcclxuICAgICAgY29uc3Qgc2Vjb25kU29ydERpcmVjdGlvbiA9ICFmaXJzdFNvcnREaXJlY3Rpb25cclxuXHJcbiAgICAgIC8vIHdlIGNhbid0IHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gZnJvbSB0aGUgY29sdW1uIHJlc2l6ZSBtb3ZlIGhhbmRsZXJzXHJcbiAgICAgIC8vIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBiZWNhdXNlIG9mIHJlYWN0J3Mgc3ludGhldGljIGV2ZW50c1xyXG4gICAgICAvLyBzbyB3ZSBoYXZlIHRvIHByZXZlbnQgdGhlIHNvcnQgZnVuY3Rpb24gZnJvbSBhY3R1YWxseSBzb3J0aW5nXHJcbiAgICAgIC8vIGlmIHdlIGNsaWNrIG9uIHRoZSBjb2x1bW4gcmVzaXplIGVsZW1lbnQgd2l0aGluIGEgaGVhZGVyLlxyXG4gICAgICBpZiAoc2tpcE5leHRTb3J0KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHtcclxuICAgICAgICAgIHNraXBOZXh0U29ydDogZmFsc2UsXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgeyBvblNvcnRlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgbGV0IG5ld1NvcnRlZCA9IF8uY2xvbmUoc29ydGVkIHx8IFtdKS5tYXAoZCA9PiB7XHJcbiAgICAgICAgZC5kZXNjID0gXy5pc1NvcnRpbmdEZXNjKGQpXHJcbiAgICAgICAgcmV0dXJuIGRcclxuICAgICAgfSlcclxuICAgICAgaWYgKCFfLmlzQXJyYXkoY29sdW1uKSkge1xyXG4gICAgICAgIC8vIFNpbmdsZS1Tb3J0XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbmRleCA9IG5ld1NvcnRlZC5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cclxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgMSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBleGlzdGluZy5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgbmV3U29ydGVkID0gW2V4aXN0aW5nXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBleGlzdGluZy5kZXNjID0gc2Vjb25kU29ydERpcmVjdGlvblxyXG4gICAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XHJcbiAgICAgICAgICAgICAgbmV3U29ydGVkID0gW2V4aXN0aW5nXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgbmV3U29ydGVkLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxyXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpZDogY29sdW1uLmlkLFxyXG4gICAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gTXVsdGktU29ydFxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uWzBdLmlkKVxyXG4gICAgICAgIC8vIEV4aXN0aW5nIFNvcnRlZCBDb2x1bW5cclxuICAgICAgICBpZiAoZXhpc3RpbmdJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICBjb25zdCBleGlzdGluZyA9IG5ld1NvcnRlZFtleGlzdGluZ0luZGV4XVxyXG4gICAgICAgICAgaWYgKGV4aXN0aW5nLmRlc2MgPT09IHNlY29uZFNvcnREaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKGFkZGl0aXZlKSB7XHJcbiAgICAgICAgICAgICAgbmV3U29ydGVkLnNwbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbHVtbi5mb3JFYWNoKChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBmaXJzdFNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZFtleGlzdGluZ0luZGV4ICsgaV0uZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghYWRkaXRpdmUpIHtcclxuICAgICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLnNsaWNlKGV4aXN0aW5nSW5kZXgsIGNvbHVtbi5sZW5ndGgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBOZXcgU29ydCBDb2x1bW5cclxuICAgICAgICB9IGVsc2UgaWYgKGFkZGl0aXZlKSB7XHJcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBuZXdTb3J0ZWQuY29uY2F0KFxyXG4gICAgICAgICAgICBjb2x1bW4ubWFwKGQgPT4gKHtcclxuICAgICAgICAgICAgICBpZDogZC5pZCxcclxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBjb2x1bW4ubWFwKGQgPT4gKHtcclxuICAgICAgICAgICAgaWQ6IGQuaWQsXHJcbiAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2U6ICghc29ydGVkLmxlbmd0aCAmJiBuZXdTb3J0ZWQubGVuZ3RoKSB8fCAhYWRkaXRpdmUgPyAwIDogdGhpcy5zdGF0ZS5wYWdlLFxyXG4gICAgICAgICAgc29ydGVkOiBuZXdTb3J0ZWQsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblNvcnRlZENoYW5nZSAmJiBvblNvcnRlZENoYW5nZShuZXdTb3J0ZWQsIGNvbHVtbiwgYWRkaXRpdmUpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJDb2x1bW4gKGNvbHVtbiwgdmFsdWUpIHtcclxuICAgICAgY29uc3QgeyBmaWx0ZXJlZCB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgICAgY29uc3QgeyBvbkZpbHRlcmVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICAvLyBSZW1vdmUgb2xkIGZpbHRlciBmaXJzdCBpZiBpdCBleGlzdHNcclxuICAgICAgY29uc3QgbmV3RmlsdGVyaW5nID0gKGZpbHRlcmVkIHx8IFtdKS5maWx0ZXIoeCA9PiB4LmlkICE9PSBjb2x1bW4uaWQpXHJcblxyXG4gICAgICBpZiAodmFsdWUgIT09ICcnKSB7XHJcbiAgICAgICAgbmV3RmlsdGVyaW5nLnB1c2goe1xyXG4gICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaWx0ZXJlZDogbmV3RmlsdGVyaW5nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25GaWx0ZXJlZENoYW5nZSAmJiBvbkZpbHRlcmVkQ2hhbmdlKG5ld0ZpbHRlcmluZywgY29sdW1uLCB2YWx1ZSlcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZUNvbHVtblN0YXJ0IChldmVudCwgY29sdW1uLCBpc1RvdWNoKSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIGNvbnN0IHBhcmVudFdpZHRoID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcclxuXHJcbiAgICAgIGxldCBwYWdlWFxyXG4gICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVhcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudHJhcEV2ZW50cyA9IHRydWVcclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGN1cnJlbnRseVJlc2l6aW5nOiB7XHJcbiAgICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXHJcbiAgICAgICAgICAgIHN0YXJ0WDogcGFnZVgsXHJcbiAgICAgICAgICAgIHBhcmVudFdpZHRoLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIGlmIChpc1RvdWNoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZUNvbHVtbk1vdmluZyAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UsIGNvbHVtbiB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCB7IHJlc2l6ZWQsIGN1cnJlbnRseVJlc2l6aW5nLCBjb2x1bW5zIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG4gICAgICBjb25zdCBjdXJyZW50Q29sdW1uID0gY29sdW1ucy5maW5kKFxyXG4gICAgICAgIGMgPT4gYy5hY2Nlc3NvciA9PT0gY3VycmVudGx5UmVzaXppbmcuaWQgfHwgYy5pZCA9PT0gY3VycmVudGx5UmVzaXppbmcuaWRcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBtaW5SZXNpemVXaWR0aCA9XHJcbiAgICAgICAgY3VycmVudENvbHVtbiAmJiBjdXJyZW50Q29sdW1uLm1pblJlc2l6ZVdpZHRoICE9IG51bGxcclxuICAgICAgICAgID8gY3VycmVudENvbHVtbi5taW5SZXNpemVXaWR0aFxyXG4gICAgICAgICAgOiBjb2x1bW4ubWluUmVzaXplV2lkdGhcclxuXHJcbiAgICAgIC8vIERlbGV0ZSBvbGQgdmFsdWVcclxuICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHggPT4geC5pZCAhPT0gY3VycmVudGx5UmVzaXppbmcuaWQpXHJcblxyXG4gICAgICBsZXQgcGFnZVhcclxuXHJcbiAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVhcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJykge1xyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVhcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLm1heChcclxuICAgICAgICBjdXJyZW50bHlSZXNpemluZy5wYXJlbnRXaWR0aCArIHBhZ2VYIC0gY3VycmVudGx5UmVzaXppbmcuc3RhcnRYLFxyXG4gICAgICAgIG1pblJlc2l6ZVdpZHRoXHJcbiAgICAgIClcclxuXHJcbiAgICAgIG5ld1Jlc2l6ZWQucHVzaCh7XHJcbiAgICAgICAgaWQ6IGN1cnJlbnRseVJlc2l6aW5nLmlkLFxyXG4gICAgICAgIHZhbHVlOiBuZXdXaWR0aCxcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICByZXNpemVkOiBuZXdSZXNpemVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25SZXNpemVkQ2hhbmdlICYmIG9uUmVzaXplZENoYW5nZShuZXdSZXNpemVkLCBldmVudClcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZUNvbHVtbkVuZCAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgY29uc3QgaXNUb3VjaCA9IGV2ZW50LnR5cGUgPT09ICd0b3VjaGVuZCcgfHwgZXZlbnQudHlwZSA9PT0gJ3RvdWNoY2FuY2VsJ1xyXG5cclxuICAgICAgaWYgKGlzVG91Y2gpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGl0cyBhIHRvdWNoIGV2ZW50IGNsZWFyIHRoZSBtb3VzZSBvbmUncyBhcyB3ZWxsIGJlY2F1c2Ugc29tZXRpbWVzXHJcbiAgICAgIC8vIHRoZSBtb3VzZURvd24gZXZlbnQgZ2V0cyBjYWxsZWQgYXMgd2VsbCwgYnV0IHRoZSBtb3VzZVVwIGV2ZW50IGRvZXNuJ3RcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG5cclxuICAgICAgLy8gVGhlIHRvdWNoIGV2ZW50cyBkb24ndCBwcm9wYWdhdGUgdXAgdG8gdGhlIHNvcnRpbmcncyBvbk1vdXNlRG93biBldmVudCBzb1xyXG4gICAgICAvLyBubyBuZWVkIHRvIHByZXZlbnQgaXQgZnJvbSBoYXBwZW5pbmcgb3IgZWxzZSB0aGUgZmlyc3QgY2xpY2sgYWZ0ZXIgYSB0b3VjaFxyXG4gICAgICAvLyBldmVudCByZXNpemUgd2lsbCBub3Qgc29ydCB0aGUgY29sdW1uLlxyXG4gICAgICBpZiAoIWlzVG91Y2gpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoe1xyXG4gICAgICAgICAgc2tpcE5leHRTb3J0OiB0cnVlLFxyXG4gICAgICAgICAgY3VycmVudGx5UmVzaXppbmc6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiJdfQ==