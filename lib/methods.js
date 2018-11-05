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
            allVisibleColumns = resolvedState.allVisibleColumns,
            allDecoratedColumns = resolvedState.allDecoratedColumns;


        var sortMethodsByColumnID = {};

        allDecoratedColumns.filter(function (col) {
          return col.sortMethod;
        }).forEach(function (col) {
          sortMethodsByColumnID[col.id] = col.sortMethod;
        });

        // Resolve the data from either manual data or sorted data
        return {
          sortedData: manual ? resolvedData : this.sortData(this.filterData(resolvedData, filtered, defaultFilterMethod, allVisibleColumns), sorted, sortMethodsByColumnID)
        };
      }
    }, {
      key: 'fireFetchData',
      value: function fireFetchData() {
        this.props.onFetchData(this.getResolvedState(), this);
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
          return c.accessor === currentlyResizing.id;
        });
        var minResizeWidth = currentColumn ? currentColumn.minResizeWidth : column.minResizeWidth;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiXyIsImNvbXBhY3RPYmplY3QiLCJuZXdTdGF0ZSIsImRhdGFDaGFuZ2VkIiwiY29sdW1ucyIsInBpdm90QnkiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJwaXZvdElES2V5IiwicGl2b3RWYWxLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIlN1YkNvbXBvbmVudCIsImhhc0hlYWRlckdyb3VwcyIsImZvckVhY2giLCJjb2x1bW4iLCJjb2x1bW5zV2l0aEV4cGFuZGVyIiwiZXhwYW5kZXJDb2x1bW4iLCJmaW5kIiwiY29sIiwiZXhwYW5kZXIiLCJzb21lIiwiY29sMiIsIm1ha2VEZWNvcmF0ZWRDb2x1bW4iLCJwYXJlbnRDb2x1bW4iLCJkY29sIiwiZXhwYW5kZXJEZWZhdWx0cyIsIm1heFdpZHRoIiwibWluV2lkdGgiLCJhY2Nlc3NvciIsImlkIiwiYWNjZXNzb3JTdHJpbmciLCJnZXQiLCJyb3ciLCJjb25zb2xlIiwid2FybiIsIkVycm9yIiwidW5kZWZpbmVkIiwiYWxsRGVjb3JhdGVkQ29sdW1ucyIsImRlY29yYXRlQW5kQWRkVG9BbGwiLCJkZWNvcmF0ZWRDb2x1bW4iLCJwdXNoIiwiZGVjb3JhdGVkQ29sdW1ucyIsIm1hcCIsImQiLCJ2aXNpYmxlQ29sdW1ucyIsInNsaWNlIiwiYWxsVmlzaWJsZUNvbHVtbnMiLCJ2aXNpYmxlU3ViQ29sdW1ucyIsImZpbHRlciIsImluZGV4T2YiLCJnZXRGaXJzdERlZmluZWQiLCJzaG93IiwibGVuZ3RoIiwicGl2b3RJbmRleCIsImZpbmRJbmRleCIsInBpdm90IiwicGl2b3RDb2x1bW5zIiwiZm91bmQiLCJwaXZvdElEIiwiUGl2b3RQYXJlbnRDb2x1bW4iLCJyZWR1Y2UiLCJwcmV2IiwiY3VycmVudCIsIlBpdm90R3JvdXBIZWFkZXIiLCJIZWFkZXIiLCJwaXZvdENvbHVtbkdyb3VwIiwicGl2b3REZWZhdWx0cyIsInBpdm90ZWQiLCJzcGxpY2UiLCJ1bnNoaWZ0IiwiaGVhZGVyR3JvdXBzIiwiY3VycmVudFNwYW4iLCJhZGRIZWFkZXIiLCJjb25jYXQiLCJhY2Nlc3NSb3ciLCJpIiwibGV2ZWwiLCJyZXNvbHZlZERhdGEiLCJhZ2dyZWdhdGluZ0NvbHVtbnMiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGlvblZhbHVlcyIsInZhbHVlcyIsInJvd3MiLCJncm91cFJlY3Vyc2l2ZWx5Iiwia2V5cyIsImdyb3VwZWRSb3dzIiwiT2JqZWN0IiwiZW50cmllcyIsImdyb3VwQnkiLCJrZXkiLCJ2YWx1ZSIsInN1YlJvd3MiLCJyb3dHcm91cCIsIm1hbnVhbCIsInNvcnRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInNvcnRNZXRob2RzQnlDb2x1bW5JRCIsInNvcnRNZXRob2QiLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJmaWx0ZXJEYXRhIiwib25GZXRjaERhdGEiLCJnZXRSZXNvbHZlZFN0YXRlIiwiZmlsdGVyZWREYXRhIiwiZmlsdGVyZWRTb0ZhciIsIm5leHRGaWx0ZXIiLCJ4IiwiZmlsdGVyYWJsZSIsImZpbHRlck1ldGhvZCIsImZpbHRlckFsbCIsIm9yZGVyQnlNZXRob2QiLCJvcmRlckJ5Iiwic29ydCIsImEiLCJiIiwiZGVzYyIsImRlZmF1bHRTb3J0TWV0aG9kIiwibWluUm93cyIsImdldFN0YXRlT3JQcm9wIiwicGFnZSIsIm9uUGFnZUNoYW5nZSIsImNvbGxhcHNlT25QYWdlQ2hhbmdlIiwiZXhwYW5kZWQiLCJzZXRTdGF0ZVdpdGhEYXRhIiwibmV3UGFnZVNpemUiLCJvblBhZ2VTaXplQ2hhbmdlIiwicGFnZVNpemUiLCJjdXJyZW50Um93IiwibmV3UGFnZSIsIk1hdGgiLCJmbG9vciIsImFkZGl0aXZlIiwic2tpcE5leHRTb3J0IiwiZGVmYXVsdFNvcnREZXNjIiwiZmlyc3RTb3J0RGlyZWN0aW9uIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwic2Vjb25kU29ydERpcmVjdGlvbiIsIm9uU29ydGVkQ2hhbmdlIiwibmV3U29ydGVkIiwiY2xvbmUiLCJpc1NvcnRpbmdEZXNjIiwiaXNBcnJheSIsImV4aXN0aW5nSW5kZXgiLCJleGlzdGluZyIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJuZXdGaWx0ZXJpbmciLCJldmVudCIsImlzVG91Y2giLCJzdG9wUHJvcGFnYXRpb24iLCJwYXJlbnRXaWR0aCIsInRhcmdldCIsInBhcmVudEVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsInBhZ2VYIiwiY2hhbmdlZFRvdWNoZXMiLCJ0cmFwRXZlbnRzIiwiY3VycmVudGx5UmVzaXppbmciLCJzdGFydFgiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNpemVDb2x1bW5FbmQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwiY3VycmVudENvbHVtbiIsImMiLCJtaW5SZXNpemVXaWR0aCIsIm5ld1Jlc2l6ZWQiLCJ0eXBlIiwibmV3V2lkdGgiLCJtYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztrQkFFZTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSx1Q0FFT0EsS0FGUCxFQUVjQyxLQUZkLEVBRXFCO0FBQzlCLFlBQU1DLDZCQUNEQyxnQkFBRUMsYUFBRixDQUFnQixLQUFLSCxLQUFyQixDQURDLEVBRURFLGdCQUFFQyxhQUFGLENBQWdCLEtBQUtKLEtBQXJCLENBRkMsRUFHREcsZ0JBQUVDLGFBQUYsQ0FBZ0JILEtBQWhCLENBSEMsRUFJREUsZ0JBQUVDLGFBQUYsQ0FBZ0JKLEtBQWhCLENBSkMsQ0FBTjtBQU1BLGVBQU9FLGFBQVA7QUFDRDtBQVZVO0FBQUE7QUFBQSxtQ0FZR0csUUFaSCxFQVlhQyxXQVpiLEVBWTBCO0FBQUE7O0FBQUEsWUFFakNDLE9BRmlDLEdBZS9CRixRQWYrQixDQUVqQ0UsT0FGaUM7QUFBQSxnQ0FlL0JGLFFBZitCLENBR2pDRyxPQUhpQztBQUFBLFlBR2pDQSxPQUhpQyxxQ0FHdkIsRUFIdUI7QUFBQSxZQUlqQ0MsSUFKaUMsR0FlL0JKLFFBZitCLENBSWpDSSxJQUppQztBQUFBLFlBS2pDQyxXQUxpQyxHQWUvQkwsUUFmK0IsQ0FLakNLLFdBTGlDO0FBQUEsWUFNakNDLFVBTmlDLEdBZS9CTixRQWYrQixDQU1qQ00sVUFOaUM7QUFBQSxZQU9qQ0MsV0FQaUMsR0FlL0JQLFFBZitCLENBT2pDTyxXQVBpQztBQUFBLFlBUWpDQyxVQVJpQyxHQWUvQlIsUUFmK0IsQ0FRakNRLFVBUmlDO0FBQUEsWUFTakNDLGFBVGlDLEdBZS9CVCxRQWYrQixDQVNqQ1MsYUFUaUM7QUFBQSxZQVVqQ0MsZUFWaUMsR0FlL0JWLFFBZitCLENBVWpDVSxlQVZpQztBQUFBLFlBV2pDQyxXQVhpQyxHQWUvQlgsUUFmK0IsQ0FXakNXLFdBWGlDO0FBQUEsWUFZakNDLFFBWmlDLEdBZS9CWixRQWYrQixDQVlqQ1ksUUFaaUM7QUFBQSxZQWFqQ0MsaUJBYmlDLEdBZS9CYixRQWYrQixDQWFqQ2EsaUJBYmlDO0FBQUEsWUFjakNDLFlBZGlDLEdBZS9CZCxRQWYrQixDQWNqQ2MsWUFkaUM7O0FBaUJuQzs7QUFDQSxZQUFJQyxrQkFBa0IsS0FBdEI7QUFDQWIsZ0JBQVFjLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDeEIsY0FBSUMsT0FBT2YsT0FBWCxFQUFvQjtBQUNsQmEsOEJBQWtCLElBQWxCO0FBQ0Q7QUFDRixTQUpEOztBQU1BLFlBQUlHLG1EQUEwQmhCLE9BQTFCLEVBQUo7O0FBRUEsWUFBSWlCLGlCQUFpQmpCLFFBQVFrQixJQUFSLENBQ25CO0FBQUEsaUJBQU9DLElBQUlDLFFBQUosSUFBaUJELElBQUluQixPQUFKLElBQWVtQixJQUFJbkIsT0FBSixDQUFZcUIsSUFBWixDQUFpQjtBQUFBLG1CQUFRQyxLQUFLRixRQUFiO0FBQUEsV0FBakIsQ0FBdkM7QUFBQSxTQURtQixDQUFyQjtBQUdBO0FBQ0EsWUFBSUgsa0JBQWtCLENBQUNBLGVBQWVHLFFBQXRDLEVBQWdEO0FBQzlDSCwyQkFBaUJBLGVBQWVqQixPQUFmLENBQXVCa0IsSUFBdkIsQ0FBNEI7QUFBQSxtQkFBT0MsSUFBSUMsUUFBWDtBQUFBLFdBQTVCLENBQWpCO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJUixnQkFBZ0IsQ0FBQ0ssY0FBckIsRUFBcUM7QUFDbkNBLDJCQUFpQixFQUFFRyxVQUFVLElBQVosRUFBakI7QUFDQUosaUNBQXVCQyxjQUF2Qiw0QkFBMENELG1CQUExQztBQUNEOztBQUVELFlBQU1PLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNSLE1BQUQsRUFBU1MsWUFBVCxFQUEwQjtBQUNwRCxjQUFJQyxhQUFKO0FBQ0EsY0FBSVYsT0FBT0ssUUFBWCxFQUFxQjtBQUNuQkssZ0NBQ0ssT0FBS2hDLEtBQUwsQ0FBV3NCLE1BRGhCLEVBRUssT0FBS3RCLEtBQUwsQ0FBV2lDLGdCQUZoQixFQUdLWCxNQUhMO0FBS0QsV0FORCxNQU1PO0FBQ0xVLGdDQUNLLE9BQUtoQyxLQUFMLENBQVdzQixNQURoQixFQUVLQSxNQUZMO0FBSUQ7O0FBRUQ7QUFDQSxjQUFJVSxLQUFLRSxRQUFMLEdBQWdCRixLQUFLRyxRQUF6QixFQUFtQztBQUNqQ0gsaUJBQUtHLFFBQUwsR0FBZ0JILEtBQUtFLFFBQXJCO0FBQ0Q7O0FBRUQsY0FBSUgsWUFBSixFQUFrQjtBQUNoQkMsaUJBQUtELFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJLE9BQU9DLEtBQUtJLFFBQVosS0FBeUIsUUFBN0IsRUFBdUM7QUFDckNKLGlCQUFLSyxFQUFMLEdBQVVMLEtBQUtLLEVBQUwsSUFBV0wsS0FBS0ksUUFBMUI7QUFDQSxnQkFBTUUsaUJBQWlCTixLQUFLSSxRQUE1QjtBQUNBSixpQkFBS0ksUUFBTCxHQUFnQjtBQUFBLHFCQUFPakMsZ0JBQUVvQyxHQUFGLENBQU1DLEdBQU4sRUFBV0YsY0FBWCxDQUFQO0FBQUEsYUFBaEI7QUFDQSxtQkFBT04sSUFBUDtBQUNEOztBQUVEO0FBQ0EsY0FBSUEsS0FBS0ksUUFBTCxJQUFpQixDQUFDSixLQUFLSyxFQUEzQixFQUErQjtBQUM3Qkksb0JBQVFDLElBQVIsQ0FBYVYsSUFBYjtBQUNBLGtCQUFNLElBQUlXLEtBQUosQ0FDSiwwRUFESSxDQUFOO0FBR0Q7O0FBRUQ7QUFDQSxjQUFJLENBQUNYLEtBQUtJLFFBQVYsRUFBb0I7QUFDbEJKLGlCQUFLSSxRQUFMLEdBQWdCO0FBQUEscUJBQU1RLFNBQU47QUFBQSxhQUFoQjtBQUNEOztBQUVELGlCQUFPWixJQUFQO0FBQ0QsU0E5Q0Q7O0FBZ0RBLFlBQU1hLHNCQUFzQixFQUE1Qjs7QUFFQTtBQUNBLFlBQU1DLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUN4QixNQUFELEVBQVNTLFlBQVQsRUFBMEI7QUFDcEQsY0FBTWdCLGtCQUFrQmpCLG9CQUFvQlIsTUFBcEIsRUFBNEJTLFlBQTVCLENBQXhCO0FBQ0FjLDhCQUFvQkcsSUFBcEIsQ0FBeUJELGVBQXpCO0FBQ0EsaUJBQU9BLGVBQVA7QUFDRCxTQUpEOztBQU1BLFlBQU1FLG1CQUFtQjFCLG9CQUFvQjJCLEdBQXBCLENBQXdCLGtCQUFVO0FBQ3pELGNBQUk1QixPQUFPZixPQUFYLEVBQW9CO0FBQ2xCLGdDQUNLZSxNQURMO0FBRUVmLHVCQUFTZSxPQUFPZixPQUFQLENBQWUyQyxHQUFmLENBQW1CO0FBQUEsdUJBQUtKLG9CQUFvQkssQ0FBcEIsRUFBdUI3QixNQUF2QixDQUFMO0FBQUEsZUFBbkI7QUFGWDtBQUlEO0FBQ0QsaUJBQU93QixvQkFBb0J4QixNQUFwQixDQUFQO0FBQ0QsU0FSd0IsQ0FBekI7O0FBVUE7QUFDQSxZQUFJOEIsaUJBQWlCSCxpQkFBaUJJLEtBQWpCLEVBQXJCO0FBQ0EsWUFBSUMsb0JBQW9CLEVBQXhCOztBQUVBRix5QkFBaUJBLGVBQWVGLEdBQWYsQ0FBbUIsa0JBQVU7QUFDNUMsY0FBSTVCLE9BQU9mLE9BQVgsRUFBb0I7QUFDbEIsZ0JBQU1nRCxvQkFBb0JqQyxPQUFPZixPQUFQLENBQWVpRCxNQUFmLENBQ3hCO0FBQUEscUJBQU1oRCxRQUFRaUQsT0FBUixDQUFnQk4sRUFBRWQsRUFBbEIsSUFBd0IsQ0FBQyxDQUF6QixHQUE2QixLQUE3QixHQUFxQ2xDLGdCQUFFdUQsZUFBRixDQUFrQlAsRUFBRVEsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBM0M7QUFBQSxhQUR3QixDQUExQjtBQUdBLGdDQUNLckMsTUFETDtBQUVFZix1QkFBU2dEO0FBRlg7QUFJRDtBQUNELGlCQUFPakMsTUFBUDtBQUNELFNBWGdCLENBQWpCOztBQWFBOEIseUJBQWlCQSxlQUFlSSxNQUFmLENBQ2Y7QUFBQSxpQkFDRWxDLE9BQU9mLE9BQVAsR0FDSWUsT0FBT2YsT0FBUCxDQUFlcUQsTUFEbkIsR0FFSXBELFFBQVFpRCxPQUFSLENBQWdCbkMsT0FBT2UsRUFBdkIsSUFBNkIsQ0FBQyxDQUE5QixHQUNFLEtBREYsR0FFRWxDLGdCQUFFdUQsZUFBRixDQUFrQnBDLE9BQU9xQyxJQUF6QixFQUErQixJQUEvQixDQUxSO0FBQUEsU0FEZSxDQUFqQjs7QUFTQTtBQUNBLFlBQU1FLGFBQWFULGVBQWVVLFNBQWYsQ0FBeUI7QUFBQSxpQkFBT3BDLElBQUlxQyxLQUFYO0FBQUEsU0FBekIsQ0FBbkI7O0FBRUE7QUFDQSxZQUFJdkQsUUFBUW9ELE1BQVosRUFBb0I7QUFDbEI7QUFDQSxjQUFNSSxlQUFlLEVBQXJCO0FBQ0F4RCxrQkFBUWEsT0FBUixDQUFnQixtQkFBVztBQUN6QixnQkFBTTRDLFFBQVFwQixvQkFBb0JwQixJQUFwQixDQUF5QjtBQUFBLHFCQUFLMEIsRUFBRWQsRUFBRixLQUFTNkIsT0FBZDtBQUFBLGFBQXpCLENBQWQ7QUFDQSxnQkFBSUQsS0FBSixFQUFXO0FBQ1RELDJCQUFhaEIsSUFBYixDQUFrQmlCLEtBQWxCO0FBQ0Q7QUFDRixXQUxEOztBQU9BLGNBQU1FLG9CQUFvQkgsYUFBYUksTUFBYixDQUN4QixVQUFDQyxJQUFELEVBQU9DLE9BQVA7QUFBQSxtQkFBbUJELFFBQVFBLFNBQVNDLFFBQVF2QyxZQUF6QixJQUF5Q3VDLFFBQVF2QyxZQUFwRTtBQUFBLFdBRHdCLEVBRXhCaUMsYUFBYSxDQUFiLEVBQWdCakMsWUFGUSxDQUExQjs7QUFLQSxjQUFJd0MsbUJBQW1CbkQsbUJBQW1CK0Msa0JBQWtCSyxNQUE1RDtBQUNBRCw2QkFBbUJBLG9CQUFxQjtBQUFBLG1CQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBTjtBQUFBLFdBQXhDOztBQUVBLGNBQUlFLG1CQUFtQjtBQUNyQkQsb0JBQVFELGdCQURhO0FBRXJCaEUscUJBQVN5RCxhQUFhZCxHQUFiLENBQWlCO0FBQUEsa0NBQ3JCLE9BQUtsRCxLQUFMLENBQVcwRSxhQURVLEVBRXJCaEQsR0FGcUI7QUFHeEJpRCx5QkFBUztBQUhlO0FBQUEsYUFBakI7O0FBT1g7QUFUdUIsV0FBdkIsQ0FVQSxJQUFJZCxjQUFjLENBQWxCLEVBQXFCO0FBQ25CWSw0Q0FDS3JCLGVBQWVTLFVBQWYsQ0FETCxFQUVLWSxnQkFGTDtBQUlBckIsMkJBQWV3QixNQUFmLENBQXNCZixVQUF0QixFQUFrQyxDQUFsQyxFQUFxQ1ksZ0JBQXJDO0FBQ0QsV0FORCxNQU1PO0FBQ0xyQiwyQkFBZXlCLE9BQWYsQ0FBdUJKLGdCQUF2QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFNSyxlQUFlLEVBQXJCO0FBQ0EsWUFBSUMsY0FBYyxFQUFsQjs7QUFFQTtBQUNBLFlBQU1DLFlBQVksU0FBWkEsU0FBWSxDQUFDekUsT0FBRCxFQUFVZSxNQUFWLEVBQXFCO0FBQ3JDd0QsdUJBQWE5QixJQUFiLGNBQ0ssT0FBS2hELEtBQUwsQ0FBV3NCLE1BRGhCLEVBRUtBLE1BRkw7QUFHRWY7QUFIRjtBQUtBd0Usd0JBQWMsRUFBZDtBQUNELFNBUEQ7O0FBU0E7QUFDQTNCLHVCQUFlL0IsT0FBZixDQUF1QixrQkFBVTtBQUMvQixjQUFJQyxPQUFPZixPQUFYLEVBQW9CO0FBQ2xCK0MsZ0NBQW9CQSxrQkFBa0IyQixNQUFsQixDQUF5QjNELE9BQU9mLE9BQWhDLENBQXBCO0FBQ0EsZ0JBQUl3RSxZQUFZbkIsTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUMxQm9CLHdCQUFVRCxXQUFWO0FBQ0Q7QUFDREMsc0JBQVUxRCxPQUFPZixPQUFqQixFQUEwQmUsTUFBMUI7QUFDQTtBQUNEO0FBQ0RnQyw0QkFBa0JOLElBQWxCLENBQXVCMUIsTUFBdkI7QUFDQXlELHNCQUFZL0IsSUFBWixDQUFpQjFCLE1BQWpCO0FBQ0QsU0FYRDtBQVlBLFlBQUlGLG1CQUFtQjJELFlBQVluQixNQUFaLEdBQXFCLENBQTVDLEVBQStDO0FBQzdDb0Isb0JBQVVELFdBQVY7QUFDRDs7QUFFRDtBQUNBLFlBQU1HLFlBQVksU0FBWkEsU0FBWSxDQUFDL0IsQ0FBRCxFQUFJZ0MsQ0FBSixFQUFxQjtBQUFBOztBQUFBLGNBQWRDLEtBQWMsdUVBQU4sQ0FBTTs7QUFDckMsY0FBTTVDLHdDQUNIeEIsV0FERyxFQUNXbUMsQ0FEWCx5QkFFSGxDLFFBRkcsRUFFUWtFLENBRlIseUJBR0h0RSxVQUhHLEVBR1VzQyxFQUFFdEMsVUFBRixDQUhWLHlCQUlIRSxlQUpHLEVBSWVxRSxLQUpmLFFBQU47QUFNQXZDLDhCQUFvQnhCLE9BQXBCLENBQTRCLGtCQUFVO0FBQ3BDLGdCQUFJQyxPQUFPSyxRQUFYLEVBQXFCO0FBQ3JCYSxnQkFBSWxCLE9BQU9lLEVBQVgsSUFBaUJmLE9BQU9jLFFBQVAsQ0FBZ0JlLENBQWhCLENBQWpCO0FBQ0QsV0FIRDtBQUlBLGNBQUlYLElBQUkzQixVQUFKLENBQUosRUFBcUI7QUFDbkIyQixnQkFBSTNCLFVBQUosSUFBa0IyQixJQUFJM0IsVUFBSixFQUFnQnFDLEdBQWhCLENBQW9CLFVBQUNDLENBQUQsRUFBSWdDLENBQUo7QUFBQSxxQkFBVUQsVUFBVS9CLENBQVYsRUFBYWdDLENBQWIsRUFBZ0JDLFFBQVEsQ0FBeEIsQ0FBVjtBQUFBLGFBQXBCLENBQWxCO0FBQ0Q7QUFDRCxpQkFBTzVDLEdBQVA7QUFDRCxTQWZEOztBQWlCQTtBQUNBLFlBQUk2QyxlQUFlLEtBQUtBLFlBQXhCO0FBQ0E7QUFDQSxZQUFJLENBQUMsS0FBS0EsWUFBTixJQUFzQi9FLFdBQTFCLEVBQXVDO0FBQ3JDK0UseUJBQWUzRSxZQUFZRCxJQUFaLENBQWY7QUFDQSxlQUFLNEUsWUFBTCxHQUFvQkEsWUFBcEI7QUFDRDtBQUNEO0FBQ0FBLHVCQUFlQSxhQUFhbkMsR0FBYixDQUFpQixVQUFDQyxDQUFELEVBQUlnQyxDQUFKO0FBQUEsaUJBQVVELFVBQVUvQixDQUFWLEVBQWFnQyxDQUFiLENBQVY7QUFBQSxTQUFqQixDQUFmOztBQUVBO0FBQ0EsWUFBTUcscUJBQXFCaEMsa0JBQWtCRSxNQUFsQixDQUF5QjtBQUFBLGlCQUFLLENBQUNMLEVBQUV4QixRQUFILElBQWV3QixFQUFFb0MsU0FBdEI7QUFBQSxTQUF6QixDQUEzQjs7QUFFQTtBQUNBLFlBQU1BLFlBQVksU0FBWkEsU0FBWSxPQUFRO0FBQ3hCLGNBQU1DLG9CQUFvQixFQUExQjtBQUNBRiw2QkFBbUJqRSxPQUFuQixDQUEyQixrQkFBVTtBQUNuQyxnQkFBTW9FLFNBQVNDLEtBQUt4QyxHQUFMLENBQVM7QUFBQSxxQkFBS0MsRUFBRTdCLE9BQU9lLEVBQVQsQ0FBTDtBQUFBLGFBQVQsQ0FBZjtBQUNBbUQsOEJBQWtCbEUsT0FBT2UsRUFBekIsSUFBK0JmLE9BQU9pRSxTQUFQLENBQWlCRSxNQUFqQixFQUF5QkMsSUFBekIsQ0FBL0I7QUFDRCxXQUhEO0FBSUEsaUJBQU9GLGlCQUFQO0FBQ0QsU0FQRDtBQVFBLFlBQUloRixRQUFRb0QsTUFBWixFQUFvQjtBQUNsQixjQUFNK0IsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0QsSUFBRCxFQUFPRSxJQUFQLEVBQXVCO0FBQUEsZ0JBQVZULENBQVUsdUVBQU4sQ0FBTTs7QUFDOUM7QUFDQSxnQkFBSUEsTUFBTVMsS0FBS2hDLE1BQWYsRUFBdUI7QUFDckIscUJBQU84QixJQUFQO0FBQ0Q7QUFDRDtBQUNBLGdCQUFJRyxjQUFjQyxPQUFPQyxPQUFQLENBQWU1RixnQkFBRTZGLE9BQUYsQ0FBVU4sSUFBVixFQUFnQkUsS0FBS1QsQ0FBTCxDQUFoQixDQUFmLEVBQXlDakMsR0FBekMsQ0FBNkM7QUFBQTs7QUFBQTtBQUFBLGtCQUFFK0MsR0FBRjtBQUFBLGtCQUFPQyxLQUFQOztBQUFBLHdEQUM1RHZGLFVBRDRELEVBQy9DaUYsS0FBS1QsQ0FBTCxDQUQrQywwQkFFNUR2RSxXQUY0RCxFQUU5Q3FGLEdBRjhDLDBCQUc1REwsS0FBS1QsQ0FBTCxDQUg0RCxFQUdsRGMsR0FIa0QsMEJBSTVEcEYsVUFKNEQsRUFJL0NxRixLQUorQywwQkFLNURuRixlQUw0RCxFQUsxQ29FLENBTDBDLDBCQU01RGpFLGlCQU40RCxFQU14QyxJQU53QztBQUFBLGFBQTdDLENBQWxCO0FBUUE7QUFDQTJFLDBCQUFjQSxZQUFZM0MsR0FBWixDQUFnQixvQkFBWTtBQUFBOztBQUN4QyxrQkFBTWlELFVBQVVSLGlCQUFpQlMsU0FBU3ZGLFVBQVQsQ0FBakIsRUFBdUMrRSxJQUF2QyxFQUE2Q1QsSUFBSSxDQUFqRCxDQUFoQjtBQUNBLGtDQUNLaUIsUUFETCw4Q0FFR3ZGLFVBRkgsRUFFZ0JzRixPQUZoQiw4QkFHR3JGLGFBSEgsRUFHbUIsSUFIbkIsZUFJS3lFLFVBQVVZLE9BQVYsQ0FKTDtBQU1ELGFBUmEsQ0FBZDtBQVNBLG1CQUFPTixXQUFQO0FBQ0QsV0F6QkQ7QUEwQkFSLHlCQUFlTSxpQkFBaUJOLFlBQWpCLEVBQStCN0UsT0FBL0IsQ0FBZjtBQUNEOztBQUVELDRCQUNLSCxRQURMO0FBRUVnRixvQ0FGRjtBQUdFL0IsOENBSEY7QUFJRXdCLG9DQUpGO0FBS0VqQyxrREFMRjtBQU1FekI7QUFORjtBQVFEO0FBMVNVO0FBQUE7QUFBQSxvQ0E0U0lsQixhQTVTSixFQTRTbUI7QUFBQSxZQUUxQm1HLE1BRjBCLEdBU3hCbkcsYUFUd0IsQ0FFMUJtRyxNQUYwQjtBQUFBLFlBRzFCQyxNQUgwQixHQVN4QnBHLGFBVHdCLENBRzFCb0csTUFIMEI7QUFBQSxZQUkxQkMsUUFKMEIsR0FTeEJyRyxhQVR3QixDQUkxQnFHLFFBSjBCO0FBQUEsWUFLMUJDLG1CQUwwQixHQVN4QnRHLGFBVHdCLENBSzFCc0csbUJBTDBCO0FBQUEsWUFNMUJuQixZQU4wQixHQVN4Qm5GLGFBVHdCLENBTTFCbUYsWUFOMEI7QUFBQSxZQU8xQi9CLGlCQVAwQixHQVN4QnBELGFBVHdCLENBTzFCb0QsaUJBUDBCO0FBQUEsWUFRMUJULG1CQVIwQixHQVN4QjNDLGFBVHdCLENBUTFCMkMsbUJBUjBCOzs7QUFXNUIsWUFBTTRELHdCQUF3QixFQUE5Qjs7QUFFQTVELDRCQUFvQlcsTUFBcEIsQ0FBMkI7QUFBQSxpQkFBTzlCLElBQUlnRixVQUFYO0FBQUEsU0FBM0IsRUFBa0RyRixPQUFsRCxDQUEwRCxlQUFPO0FBQy9Eb0YsZ0NBQXNCL0UsSUFBSVcsRUFBMUIsSUFBZ0NYLElBQUlnRixVQUFwQztBQUNELFNBRkQ7O0FBSUE7QUFDQSxlQUFPO0FBQ0xDLHNCQUFZTixTQUNSaEIsWUFEUSxHQUVSLEtBQUt1QixRQUFMLENBQ0EsS0FBS0MsVUFBTCxDQUFnQnhCLFlBQWhCLEVBQThCa0IsUUFBOUIsRUFBd0NDLG1CQUF4QyxFQUE2RGxELGlCQUE3RCxDQURBLEVBRUFnRCxNQUZBLEVBR0FHLHFCQUhBO0FBSEMsU0FBUDtBQVNEO0FBdlVVO0FBQUE7QUFBQSxzQ0F5VU07QUFDZixhQUFLekcsS0FBTCxDQUFXOEcsV0FBWCxDQUF1QixLQUFLQyxnQkFBTCxFQUF2QixFQUFnRCxJQUFoRDtBQUNEO0FBM1VVO0FBQUE7QUFBQSxxQ0E2VUtkLEdBN1VMLEVBNlVVO0FBQ25CLGVBQU85RixnQkFBRXVELGVBQUYsQ0FBa0IsS0FBSzFELEtBQUwsQ0FBV2lHLEdBQVgsQ0FBbEIsRUFBbUMsS0FBS2hHLEtBQUwsQ0FBV2dHLEdBQVgsQ0FBbkMsQ0FBUDtBQUNEO0FBL1VVO0FBQUE7QUFBQSxxQ0FpVktBLEdBalZMLEVBaVZVO0FBQ25CLGVBQU85RixnQkFBRXVELGVBQUYsQ0FBa0IsS0FBS3pELEtBQUwsQ0FBV2dHLEdBQVgsQ0FBbEIsRUFBbUMsS0FBS2pHLEtBQUwsQ0FBV2lHLEdBQVgsQ0FBbkMsQ0FBUDtBQUNEO0FBblZVO0FBQUE7QUFBQSxpQ0FxVkN4RixJQXJWRCxFQXFWTzhGLFFBclZQLEVBcVZpQkMsbUJBclZqQixFQXFWc0NsRCxpQkFyVnRDLEVBcVZ5RDtBQUFBOztBQUNsRSxZQUFJMEQsZUFBZXZHLElBQW5COztBQUVBLFlBQUk4RixTQUFTM0MsTUFBYixFQUFxQjtBQUNuQm9ELHlCQUFlVCxTQUFTbkMsTUFBVCxDQUFnQixVQUFDNkMsYUFBRCxFQUFnQkMsVUFBaEIsRUFBK0I7QUFDNUQsZ0JBQU01RixTQUFTZ0Msa0JBQWtCN0IsSUFBbEIsQ0FBdUI7QUFBQSxxQkFBSzBGLEVBQUU5RSxFQUFGLEtBQVM2RSxXQUFXN0UsRUFBekI7QUFBQSxhQUF2QixDQUFmOztBQUVBO0FBQ0EsZ0JBQUksQ0FBQ2YsTUFBRCxJQUFXQSxPQUFPOEYsVUFBUCxLQUFzQixLQUFyQyxFQUE0QztBQUMxQyxxQkFBT0gsYUFBUDtBQUNEOztBQUVELGdCQUFNSSxlQUFlL0YsT0FBTytGLFlBQVAsSUFBdUJiLG1CQUE1Qzs7QUFFQTtBQUNBLGdCQUFJbEYsT0FBT2dHLFNBQVgsRUFBc0I7QUFDcEIscUJBQU9ELGFBQWFILFVBQWIsRUFBeUJELGFBQXpCLEVBQXdDM0YsTUFBeEMsQ0FBUDtBQUNEO0FBQ0QsbUJBQU8yRixjQUFjekQsTUFBZCxDQUFxQjtBQUFBLHFCQUFPNkQsYUFBYUgsVUFBYixFQUF5QjFFLEdBQXpCLEVBQThCbEIsTUFBOUIsQ0FBUDtBQUFBLGFBQXJCLENBQVA7QUFDRCxXQWZjLEVBZVowRixZQWZZLENBQWY7O0FBaUJBO0FBQ0E7QUFDQUEseUJBQWVBLGFBQ1o5RCxHQURZLENBQ1IsZUFBTztBQUNWLGdCQUFJLENBQUNWLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixDQUFMLEVBQWlDO0FBQy9CLHFCQUFPMkIsR0FBUDtBQUNEO0FBQ0QsZ0NBQ0tBLEdBREwsc0JBRUcsT0FBS3hDLEtBQUwsQ0FBV2EsVUFGZCxFQUUyQixPQUFLZ0csVUFBTCxDQUN2QnJFLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixDQUR1QixFQUV2QjBGLFFBRnVCLEVBR3ZCQyxtQkFIdUIsRUFJdkJsRCxpQkFKdUIsQ0FGM0I7QUFTRCxXQWRZLEVBZVpFLE1BZlksQ0FlTCxlQUFPO0FBQ2IsZ0JBQUksQ0FBQ2hCLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixDQUFMLEVBQWlDO0FBQy9CLHFCQUFPLElBQVA7QUFDRDtBQUNELG1CQUFPMkIsSUFBSSxPQUFLeEMsS0FBTCxDQUFXYSxVQUFmLEVBQTJCK0MsTUFBM0IsR0FBb0MsQ0FBM0M7QUFDRCxXQXBCWSxDQUFmO0FBcUJEOztBQUVELGVBQU9vRCxZQUFQO0FBQ0Q7QUFwWVU7QUFBQTtBQUFBLCtCQXNZRHZHLElBdFlDLEVBc1lLNkYsTUF0WUwsRUFzWXlDO0FBQUE7O0FBQUEsWUFBNUJHLHFCQUE0Qix1RUFBSixFQUFJOztBQUNsRCxZQUFJLENBQUNILE9BQU8xQyxNQUFaLEVBQW9CO0FBQ2xCLGlCQUFPbkQsSUFBUDtBQUNEOztBQUVELFlBQU1rRyxhQUFhLENBQUMsS0FBSzNHLEtBQUwsQ0FBV3VILGFBQVgsSUFBNEJwSCxnQkFBRXFILE9BQS9CLEVBQ2pCL0csSUFEaUIsRUFFakI2RixPQUFPcEQsR0FBUCxDQUFXLGdCQUFRO0FBQ2pCO0FBQ0EsY0FBSXVELHNCQUFzQmdCLEtBQUtwRixFQUEzQixDQUFKLEVBQW9DO0FBQ2xDLG1CQUFPLFVBQUNxRixDQUFELEVBQUlDLENBQUo7QUFBQSxxQkFBVWxCLHNCQUFzQmdCLEtBQUtwRixFQUEzQixFQUErQnFGLEVBQUVELEtBQUtwRixFQUFQLENBQS9CLEVBQTJDc0YsRUFBRUYsS0FBS3BGLEVBQVAsQ0FBM0MsRUFBdURvRixLQUFLRyxJQUE1RCxDQUFWO0FBQUEsYUFBUDtBQUNEO0FBQ0QsaUJBQU8sVUFBQ0YsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsbUJBQVUsT0FBSzNILEtBQUwsQ0FBVzZILGlCQUFYLENBQTZCSCxFQUFFRCxLQUFLcEYsRUFBUCxDQUE3QixFQUF5Q3NGLEVBQUVGLEtBQUtwRixFQUFQLENBQXpDLEVBQXFEb0YsS0FBS0csSUFBMUQsQ0FBVjtBQUFBLFdBQVA7QUFDRCxTQU5ELENBRmlCLEVBU2pCdEIsT0FBT3BELEdBQVAsQ0FBVztBQUFBLGlCQUFLLENBQUNDLEVBQUV5RSxJQUFSO0FBQUEsU0FBWCxDQVRpQixFQVVqQixLQUFLNUgsS0FBTCxDQUFXaUIsUUFWTSxDQUFuQjs7QUFhQTBGLG1CQUFXdEYsT0FBWCxDQUFtQixlQUFPO0FBQ3hCLGNBQUksQ0FBQ21CLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixDQUFMLEVBQWlDO0FBQy9CO0FBQ0Q7QUFDRDJCLGNBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixJQUE2QixPQUFLK0YsUUFBTCxDQUMzQnBFLElBQUksT0FBS3hDLEtBQUwsQ0FBV2EsVUFBZixDQUQyQixFQUUzQnlGLE1BRjJCLEVBRzNCRyxxQkFIMkIsQ0FBN0I7QUFLRCxTQVREOztBQVdBLGVBQU9FLFVBQVA7QUFDRDtBQXBhVTtBQUFBO0FBQUEsbUNBc2FHO0FBQ1osZUFBT3hHLGdCQUFFdUQsZUFBRixDQUFrQixLQUFLMUQsS0FBTCxDQUFXOEgsT0FBN0IsRUFBc0MsS0FBS0MsY0FBTCxDQUFvQixVQUFwQixDQUF0QyxDQUFQO0FBQ0Q7O0FBRUQ7O0FBMWFXO0FBQUE7QUFBQSxtQ0EyYUdDLElBM2FILEVBMmFTO0FBQUEscUJBQzZCLEtBQUtoSSxLQURsQztBQUFBLFlBQ1ZpSSxZQURVLFVBQ1ZBLFlBRFU7QUFBQSxZQUNJQyxvQkFESixVQUNJQSxvQkFESjs7O0FBR2xCLFlBQU03SCxXQUFXLEVBQUUySCxVQUFGLEVBQWpCO0FBQ0EsWUFBSUUsb0JBQUosRUFBMEI7QUFDeEI3SCxtQkFBUzhILFFBQVQsR0FBb0IsRUFBcEI7QUFDRDtBQUNELGFBQUtDLGdCQUFMLENBQXNCL0gsUUFBdEIsRUFBZ0M7QUFBQSxpQkFBTTRILGdCQUFnQkEsYUFBYUQsSUFBYixDQUF0QjtBQUFBLFNBQWhDO0FBQ0Q7QUFuYlU7QUFBQTtBQUFBLHVDQXFiT0ssV0FyYlAsRUFxYm9CO0FBQUEsWUFDckJDLGdCQURxQixHQUNBLEtBQUt0SSxLQURMLENBQ3JCc0ksZ0JBRHFCOztBQUFBLGdDQUVGLEtBQUt2QixnQkFBTCxFQUZFO0FBQUEsWUFFckJ3QixRQUZxQixxQkFFckJBLFFBRnFCO0FBQUEsWUFFWFAsSUFGVyxxQkFFWEEsSUFGVzs7QUFJN0I7OztBQUNBLFlBQU1RLGFBQWFELFdBQVdQLElBQTlCO0FBQ0EsWUFBTVMsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSCxhQUFhSCxXQUF4QixDQUFoQjs7QUFFQSxhQUFLRCxnQkFBTCxDQUNFO0FBQ0VHLG9CQUFVRixXQURaO0FBRUVMLGdCQUFNUztBQUZSLFNBREYsRUFLRTtBQUFBLGlCQUFNSCxvQkFBb0JBLGlCQUFpQkQsV0FBakIsRUFBOEJJLE9BQTlCLENBQTFCO0FBQUEsU0FMRjtBQU9EO0FBcGNVO0FBQUE7QUFBQSxpQ0FzY0NuSCxNQXRjRCxFQXNjU3NILFFBdGNULEVBc2NtQjtBQUFBLGlDQUNzQixLQUFLN0IsZ0JBQUwsRUFEdEI7QUFBQSxZQUNwQlQsTUFEb0Isc0JBQ3BCQSxNQURvQjtBQUFBLFlBQ1p1QyxZQURZLHNCQUNaQSxZQURZO0FBQUEsWUFDRUMsZUFERixzQkFDRUEsZUFERjs7QUFHNUIsWUFBTUMscUJBQXFCakQsT0FBT2tELFNBQVAsQ0FBaUJDLGNBQWpCLENBQWdDQyxJQUFoQyxDQUFxQzVILE1BQXJDLEVBQTZDLGlCQUE3QyxJQUN2QkEsT0FBT3dILGVBRGdCLEdBRXZCQSxlQUZKO0FBR0EsWUFBTUssc0JBQXNCLENBQUNKLGtCQUE3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUlGLFlBQUosRUFBa0I7QUFDaEIsZUFBS1QsZ0JBQUwsQ0FBc0I7QUFDcEJTLDBCQUFjO0FBRE0sV0FBdEI7QUFHQTtBQUNEOztBQWpCMkIsWUFtQnBCTyxjQW5Cb0IsR0FtQkQsS0FBS3BKLEtBbkJKLENBbUJwQm9KLGNBbkJvQjs7O0FBcUI1QixZQUFJQyxZQUFZbEosZ0JBQUVtSixLQUFGLENBQVFoRCxVQUFVLEVBQWxCLEVBQXNCcEQsR0FBdEIsQ0FBMEIsYUFBSztBQUM3Q0MsWUFBRXlFLElBQUYsR0FBU3pILGdCQUFFb0osYUFBRixDQUFnQnBHLENBQWhCLENBQVQ7QUFDQSxpQkFBT0EsQ0FBUDtBQUNELFNBSGUsQ0FBaEI7QUFJQSxZQUFJLENBQUNoRCxnQkFBRXFKLE9BQUYsQ0FBVWxJLE1BQVYsQ0FBTCxFQUF3QjtBQUN0QjtBQUNBLGNBQU1tSSxnQkFBZ0JKLFVBQVV2RixTQUFWLENBQW9CO0FBQUEsbUJBQUtYLEVBQUVkLEVBQUYsS0FBU2YsT0FBT2UsRUFBckI7QUFBQSxXQUFwQixDQUF0QjtBQUNBLGNBQUlvSCxnQkFBZ0IsQ0FBQyxDQUFyQixFQUF3QjtBQUN0QixnQkFBTUMsV0FBV0wsVUFBVUksYUFBVixDQUFqQjtBQUNBLGdCQUFJQyxTQUFTOUIsSUFBVCxLQUFrQnVCLG1CQUF0QixFQUEyQztBQUN6QyxrQkFBSVAsUUFBSixFQUFjO0FBQ1pTLDBCQUFVekUsTUFBVixDQUFpQjZFLGFBQWpCLEVBQWdDLENBQWhDO0FBQ0QsZUFGRCxNQUVPO0FBQ0xDLHlCQUFTOUIsSUFBVCxHQUFnQm1CLGtCQUFoQjtBQUNBTSw0QkFBWSxDQUFDSyxRQUFELENBQVo7QUFDRDtBQUNGLGFBUEQsTUFPTztBQUNMQSx1QkFBUzlCLElBQVQsR0FBZ0J1QixtQkFBaEI7QUFDQSxrQkFBSSxDQUFDUCxRQUFMLEVBQWU7QUFDYlMsNEJBQVksQ0FBQ0ssUUFBRCxDQUFaO0FBQ0Q7QUFDRjtBQUNGLFdBZkQsTUFlTyxJQUFJZCxRQUFKLEVBQWM7QUFDbkJTLHNCQUFVckcsSUFBVixDQUFlO0FBQ2JYLGtCQUFJZixPQUFPZSxFQURFO0FBRWJ1RixvQkFBTW1CO0FBRk8sYUFBZjtBQUlELFdBTE0sTUFLQTtBQUNMTSx3QkFBWSxDQUNWO0FBQ0VoSCxrQkFBSWYsT0FBT2UsRUFEYjtBQUVFdUYsb0JBQU1tQjtBQUZSLGFBRFUsQ0FBWjtBQU1EO0FBQ0YsU0EvQkQsTUErQk87QUFDTDtBQUNBLGNBQU1VLGlCQUFnQkosVUFBVXZGLFNBQVYsQ0FBb0I7QUFBQSxtQkFBS1gsRUFBRWQsRUFBRixLQUFTZixPQUFPLENBQVAsRUFBVWUsRUFBeEI7QUFBQSxXQUFwQixDQUF0QjtBQUNBO0FBQ0EsY0FBSW9ILGlCQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBQ3RCLGdCQUFNQyxZQUFXTCxVQUFVSSxjQUFWLENBQWpCO0FBQ0EsZ0JBQUlDLFVBQVM5QixJQUFULEtBQWtCdUIsbUJBQXRCLEVBQTJDO0FBQ3pDLGtCQUFJUCxRQUFKLEVBQWM7QUFDWlMsMEJBQVV6RSxNQUFWLENBQWlCNkUsY0FBakIsRUFBZ0NuSSxPQUFPc0MsTUFBdkM7QUFDRCxlQUZELE1BRU87QUFDTHRDLHVCQUFPRCxPQUFQLENBQWUsVUFBQzhCLENBQUQsRUFBSWdDLENBQUosRUFBVTtBQUN2QmtFLDRCQUFVSSxpQkFBZ0J0RSxDQUExQixFQUE2QnlDLElBQTdCLEdBQW9DbUIsa0JBQXBDO0FBQ0QsaUJBRkQ7QUFHRDtBQUNGLGFBUkQsTUFRTztBQUNMekgscUJBQU9ELE9BQVAsQ0FBZSxVQUFDOEIsQ0FBRCxFQUFJZ0MsQ0FBSixFQUFVO0FBQ3ZCa0UsMEJBQVVJLGlCQUFnQnRFLENBQTFCLEVBQTZCeUMsSUFBN0IsR0FBb0N1QixtQkFBcEM7QUFDRCxlQUZEO0FBR0Q7QUFDRCxnQkFBSSxDQUFDUCxRQUFMLEVBQWU7QUFDYlMsMEJBQVlBLFVBQVVoRyxLQUFWLENBQWdCb0csY0FBaEIsRUFBK0JuSSxPQUFPc0MsTUFBdEMsQ0FBWjtBQUNEO0FBQ0Q7QUFDRCxXQW5CRCxNQW1CTyxJQUFJZ0YsUUFBSixFQUFjO0FBQ25CUyx3QkFBWUEsVUFBVXBFLE1BQVYsQ0FDVjNELE9BQU80QixHQUFQLENBQVc7QUFBQSxxQkFBTTtBQUNmYixvQkFBSWMsRUFBRWQsRUFEUztBQUVmdUYsc0JBQU1tQjtBQUZTLGVBQU47QUFBQSxhQUFYLENBRFUsQ0FBWjtBQU1ELFdBUE0sTUFPQTtBQUNMTSx3QkFBWS9ILE9BQU80QixHQUFQLENBQVc7QUFBQSxxQkFBTTtBQUMzQmIsb0JBQUljLEVBQUVkLEVBRHFCO0FBRTNCdUYsc0JBQU1tQjtBQUZxQixlQUFOO0FBQUEsYUFBWCxDQUFaO0FBSUQ7QUFDRjs7QUFFRCxhQUFLWCxnQkFBTCxDQUNFO0FBQ0VKLGdCQUFPLENBQUMxQixPQUFPMUMsTUFBUixJQUFrQnlGLFVBQVV6RixNQUE3QixJQUF3QyxDQUFDZ0YsUUFBekMsR0FBb0QsQ0FBcEQsR0FBd0QsS0FBSzNJLEtBQUwsQ0FBVytILElBRDNFO0FBRUUxQixrQkFBUStDO0FBRlYsU0FERixFQUtFO0FBQUEsaUJBQU1ELGtCQUFrQkEsZUFBZUMsU0FBZixFQUEwQi9ILE1BQTFCLEVBQWtDc0gsUUFBbEMsQ0FBeEI7QUFBQSxTQUxGO0FBT0Q7QUEzaUJVO0FBQUE7QUFBQSxtQ0E2aUJHdEgsTUE3aUJILEVBNmlCVzRFLEtBN2lCWCxFQTZpQmtCO0FBQUEsaUNBQ04sS0FBS2EsZ0JBQUwsRUFETTtBQUFBLFlBQ25CUixRQURtQixzQkFDbkJBLFFBRG1COztBQUFBLFlBRW5Cb0QsZ0JBRm1CLEdBRUUsS0FBSzNKLEtBRlAsQ0FFbkIySixnQkFGbUI7O0FBSTNCOztBQUNBLFlBQU1DLGVBQWUsQ0FBQ3JELFlBQVksRUFBYixFQUFpQi9DLE1BQWpCLENBQXdCO0FBQUEsaUJBQUsyRCxFQUFFOUUsRUFBRixLQUFTZixPQUFPZSxFQUFyQjtBQUFBLFNBQXhCLENBQXJCOztBQUVBLFlBQUk2RCxVQUFVLEVBQWQsRUFBa0I7QUFDaEIwRCx1QkFBYTVHLElBQWIsQ0FBa0I7QUFDaEJYLGdCQUFJZixPQUFPZSxFQURLO0FBRWhCNkQ7QUFGZ0IsV0FBbEI7QUFJRDs7QUFFRCxhQUFLa0MsZ0JBQUwsQ0FDRTtBQUNFN0Isb0JBQVVxRDtBQURaLFNBREYsRUFJRTtBQUFBLGlCQUFNRCxvQkFBb0JBLGlCQUFpQkMsWUFBakIsRUFBK0J0SSxNQUEvQixFQUF1QzRFLEtBQXZDLENBQTFCO0FBQUEsU0FKRjtBQU1EO0FBamtCVTtBQUFBO0FBQUEsd0NBbWtCUTJELEtBbmtCUixFQW1rQmV2SSxNQW5rQmYsRUFta0J1QndJLE9BbmtCdkIsRUFta0JnQztBQUFBOztBQUN6Q0QsY0FBTUUsZUFBTjtBQUNBLFlBQU1DLGNBQWNILE1BQU1JLE1BQU4sQ0FBYUMsYUFBYixDQUEyQkMscUJBQTNCLEdBQW1EQyxLQUF2RTs7QUFFQSxZQUFJQyxjQUFKO0FBQ0EsWUFBSVAsT0FBSixFQUFhO0FBQ1hPLGtCQUFRUixNQUFNUyxjQUFOLENBQXFCLENBQXJCLEVBQXdCRCxLQUFoQztBQUNELFNBRkQsTUFFTztBQUNMQSxrQkFBUVIsTUFBTVEsS0FBZDtBQUNEOztBQUVELGFBQUtFLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxhQUFLbkMsZ0JBQUwsQ0FDRTtBQUNFb0MsNkJBQW1CO0FBQ2pCbkksZ0JBQUlmLE9BQU9lLEVBRE07QUFFakJvSSxvQkFBUUosS0FGUztBQUdqQkw7QUFIaUI7QUFEckIsU0FERixFQVFFLFlBQU07QUFDSixjQUFJRixPQUFKLEVBQWE7QUFDWFkscUJBQVNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLE9BQUtDLGtCQUE1QztBQUNBRixxQkFBU0MsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsT0FBS0UsZUFBOUM7QUFDQUgscUJBQVNDLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDLE9BQUtFLGVBQTNDO0FBQ0QsV0FKRCxNQUlPO0FBQ0xILHFCQUFTQyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxPQUFLQyxrQkFBNUM7QUFDQUYscUJBQVNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLE9BQUtFLGVBQTFDO0FBQ0FILHFCQUFTQyxnQkFBVCxDQUEwQixZQUExQixFQUF3QyxPQUFLRSxlQUE3QztBQUNEO0FBQ0YsU0FsQkg7QUFvQkQ7QUFubUJVO0FBQUE7QUFBQSx5Q0FxbUJTaEIsS0FybUJULEVBcW1CZ0I7QUFDekJBLGNBQU1FLGVBQU47QUFEeUIsc0JBRVcsS0FBSy9KLEtBRmhCO0FBQUEsWUFFakI4SyxlQUZpQixXQUVqQkEsZUFGaUI7QUFBQSxZQUVBeEosTUFGQSxXQUVBQSxNQUZBOztBQUFBLGlDQUd1QixLQUFLeUYsZ0JBQUwsRUFIdkI7QUFBQSxZQUdqQmdFLE9BSGlCLHNCQUdqQkEsT0FIaUI7QUFBQSxZQUdSUCxpQkFIUSxzQkFHUkEsaUJBSFE7QUFBQSxZQUdXakssT0FIWCxzQkFHV0EsT0FIWDs7QUFJekIsWUFBTXlLLGdCQUFnQnpLLFFBQVFrQixJQUFSLENBQWE7QUFBQSxpQkFBS3dKLEVBQUU3SSxRQUFGLEtBQWVvSSxrQkFBa0JuSSxFQUF0QztBQUFBLFNBQWIsQ0FBdEI7QUFDQSxZQUFNNkksaUJBQWlCRixnQkFBZ0JBLGNBQWNFLGNBQTlCLEdBQStDNUosT0FBTzRKLGNBQTdFOztBQUVBO0FBQ0EsWUFBTUMsYUFBYUosUUFBUXZILE1BQVIsQ0FBZTtBQUFBLGlCQUFLMkQsRUFBRTlFLEVBQUYsS0FBU21JLGtCQUFrQm5JLEVBQWhDO0FBQUEsU0FBZixDQUFuQjs7QUFFQSxZQUFJZ0ksY0FBSjs7QUFFQSxZQUFJUixNQUFNdUIsSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQzlCZixrQkFBUVIsTUFBTVMsY0FBTixDQUFxQixDQUFyQixFQUF3QkQsS0FBaEM7QUFDRCxTQUZELE1BRU8sSUFBSVIsTUFBTXVCLElBQU4sS0FBZSxXQUFuQixFQUFnQztBQUNyQ2Ysa0JBQVFSLE1BQU1RLEtBQWQ7QUFDRDs7QUFFRCxZQUFNZ0IsV0FBVzNDLEtBQUs0QyxHQUFMLENBQ2ZkLGtCQUFrQlIsV0FBbEIsR0FBZ0NLLEtBQWhDLEdBQXdDRyxrQkFBa0JDLE1BRDNDLEVBRWZTLGNBRmUsQ0FBakI7O0FBS0FDLG1CQUFXbkksSUFBWCxDQUFnQjtBQUNkWCxjQUFJbUksa0JBQWtCbkksRUFEUjtBQUVkNkQsaUJBQU9tRjtBQUZPLFNBQWhCOztBQUtBLGFBQUtqRCxnQkFBTCxDQUNFO0FBQ0UyQyxtQkFBU0k7QUFEWCxTQURGLEVBSUU7QUFBQSxpQkFBTUwsbUJBQW1CQSxnQkFBZ0JLLFVBQWhCLEVBQTRCdEIsS0FBNUIsQ0FBekI7QUFBQSxTQUpGO0FBTUQ7QUF2b0JVO0FBQUE7QUFBQSxzQ0F5b0JNQSxLQXpvQk4sRUF5b0JhO0FBQ3RCQSxjQUFNRSxlQUFOO0FBQ0EsWUFBTUQsVUFBVUQsTUFBTXVCLElBQU4sS0FBZSxVQUFmLElBQTZCdkIsTUFBTXVCLElBQU4sS0FBZSxhQUE1RDs7QUFFQSxZQUFJdEIsT0FBSixFQUFhO0FBQ1hZLG1CQUFTYSxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxLQUFLWCxrQkFBL0M7QUFDQUYsbUJBQVNhLG1CQUFULENBQTZCLGFBQTdCLEVBQTRDLEtBQUtWLGVBQWpEO0FBQ0FILG1CQUFTYSxtQkFBVCxDQUE2QixVQUE3QixFQUF5QyxLQUFLVixlQUE5QztBQUNEOztBQUVEO0FBQ0E7QUFDQUgsaUJBQVNhLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUtYLGtCQUEvQztBQUNBRixpQkFBU2EsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBS1YsZUFBN0M7QUFDQUgsaUJBQVNhLG1CQUFULENBQTZCLFlBQTdCLEVBQTJDLEtBQUtWLGVBQWhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUksQ0FBQ2YsT0FBTCxFQUFjO0FBQ1osZUFBSzFCLGdCQUFMLENBQXNCO0FBQ3BCUywwQkFBYyxJQURNO0FBRXBCMkIsK0JBQW1CO0FBRkMsV0FBdEI7QUFJRDtBQUNGO0FBbHFCVTs7QUFBQTtBQUFBLElBQ0NnQixJQUREO0FBQUEsQyIsImZpbGUiOiJtZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxyXG4gIGNsYXNzIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBnZXRSZXNvbHZlZFN0YXRlIChwcm9wcywgc3RhdGUpIHtcclxuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHtcclxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5zdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMucHJvcHMpLFxyXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChzdGF0ZSksXHJcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHByb3BzKSxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzb2x2ZWRTdGF0ZVxyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGFNb2RlbCAobmV3U3RhdGUsIGRhdGFDaGFuZ2VkKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgIHBpdm90QnkgPSBbXSxcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHJlc29sdmVEYXRhLFxyXG4gICAgICAgIHBpdm90SURLZXksXHJcbiAgICAgICAgcGl2b3RWYWxLZXksXHJcbiAgICAgICAgc3ViUm93c0tleSxcclxuICAgICAgICBhZ2dyZWdhdGVkS2V5LFxyXG4gICAgICAgIG5lc3RpbmdMZXZlbEtleSxcclxuICAgICAgICBvcmlnaW5hbEtleSxcclxuICAgICAgICBpbmRleEtleSxcclxuICAgICAgICBncm91cGVkQnlQaXZvdEtleSxcclxuICAgICAgICBTdWJDb21wb25lbnQsXHJcbiAgICAgIH0gPSBuZXdTdGF0ZVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIEhlYWRlciBHcm91cHNcclxuICAgICAgbGV0IGhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXHJcbiAgICAgIGNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGxldCBjb2x1bW5zV2l0aEV4cGFuZGVyID0gWy4uLmNvbHVtbnNdXHJcblxyXG4gICAgICBsZXQgZXhwYW5kZXJDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXHJcbiAgICAgICAgY29sID0+IGNvbC5leHBhbmRlciB8fCAoY29sLmNvbHVtbnMgJiYgY29sLmNvbHVtbnMuc29tZShjb2wyID0+IGNvbDIuZXhwYW5kZXIpKVxyXG4gICAgICApXHJcbiAgICAgIC8vIFRoZSBhY3R1YWwgZXhwYW5kZXIgbWlnaHQgYmUgaW4gdGhlIGNvbHVtbnMgZmllbGQgb2YgYSBncm91cCBjb2x1bW5cclxuICAgICAgaWYgKGV4cGFuZGVyQ29sdW1uICYmICFleHBhbmRlckNvbHVtbi5leHBhbmRlcikge1xyXG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0gZXhwYW5kZXJDb2x1bW4uY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuZXhwYW5kZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHdlIGhhdmUgU3ViQ29tcG9uZW50J3Mgd2UgbmVlZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBhbiBleHBhbmRlciBjb2x1bW5cclxuICAgICAgaWYgKFN1YkNvbXBvbmVudCAmJiAhZXhwYW5kZXJDb2x1bW4pIHtcclxuICAgICAgICBleHBhbmRlckNvbHVtbiA9IHsgZXhwYW5kZXI6IHRydWUgfVxyXG4gICAgICAgIGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbZXhwYW5kZXJDb2x1bW4sIC4uLmNvbHVtbnNXaXRoRXhwYW5kZXJdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG1ha2VEZWNvcmF0ZWRDb2x1bW4gPSAoY29sdW1uLCBwYXJlbnRDb2x1bW4pID0+IHtcclxuICAgICAgICBsZXQgZGNvbFxyXG4gICAgICAgIGlmIChjb2x1bW4uZXhwYW5kZXIpIHtcclxuICAgICAgICAgIGRjb2wgPSB7XHJcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmV4cGFuZGVyRGVmYXVsdHMsXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGNvbCA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuc3VyZSBtaW5XaWR0aCBpcyBub3QgZ3JlYXRlciB0aGFuIG1heFdpZHRoIGlmIHNldFxyXG4gICAgICAgIGlmIChkY29sLm1heFdpZHRoIDwgZGNvbC5taW5XaWR0aCkge1xyXG4gICAgICAgICAgZGNvbC5taW5XaWR0aCA9IGRjb2wubWF4V2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnRDb2x1bW4pIHtcclxuICAgICAgICAgIGRjb2wucGFyZW50Q29sdW1uID0gcGFyZW50Q29sdW1uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBjaGVjayBmb3Igc3RyaW5nIGFjY2Vzc29yXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgZGNvbC5pZCA9IGRjb2wuaWQgfHwgZGNvbC5hY2Nlc3NvclxyXG4gICAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXHJcbiAgICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXHJcbiAgICAgICAgICByZXR1cm4gZGNvbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIGZ1bmN0aW9uYWwgYWNjZXNzb3IgKGJ1dCByZXF1aXJlIGFuIElEKVxyXG4gICAgICAgIGlmIChkY29sLmFjY2Vzc29yICYmICFkY29sLmlkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgJ0EgY29sdW1uIGlkIGlzIHJlcXVpcmVkIGlmIHVzaW5nIGEgbm9uLXN0cmluZyBhY2Nlc3NvciBmb3IgY29sdW1uIGFib3ZlLidcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBhbiB1bmRlZmluZWQgYWNjZXNzb3JcclxuICAgICAgICBpZiAoIWRjb2wuYWNjZXNzb3IpIHtcclxuICAgICAgICAgIGRjb2wuYWNjZXNzb3IgPSAoKSA9PiB1bmRlZmluZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkY29sXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFsbERlY29yYXRlZENvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgLy8gRGVjb3JhdGUgdGhlIGNvbHVtbnNcclxuICAgICAgY29uc3QgZGVjb3JhdGVBbmRBZGRUb0FsbCA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbiA9IG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uLCBwYXJlbnRDb2x1bW4pXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5wdXNoKGRlY29yYXRlZENvbHVtbilcclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkQ29sdW1uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbnMgPSBjb2x1bW5zV2l0aEV4cGFuZGVyLm1hcChjb2x1bW4gPT4ge1xyXG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW4uY29sdW1ucy5tYXAoZCA9PiBkZWNvcmF0ZUFuZEFkZFRvQWxsKGQsIGNvbHVtbikpLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmRBZGRUb0FsbChjb2x1bW4pXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBCdWlsZCB0aGUgdmlzaWJsZSBjb2x1bW5zLCBoZWFkZXJzIGFuZCBmbGF0IGNvbHVtbiBsaXN0XHJcbiAgICAgIGxldCB2aXNpYmxlQ29sdW1ucyA9IGRlY29yYXRlZENvbHVtbnMuc2xpY2UoKVxyXG4gICAgICBsZXQgYWxsVmlzaWJsZUNvbHVtbnMgPSBbXVxyXG5cclxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5tYXAoY29sdW1uID0+IHtcclxuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICAgIGNvbnN0IHZpc2libGVTdWJDb2x1bW5zID0gY29sdW1uLmNvbHVtbnMuZmlsdGVyKFxyXG4gICAgICAgICAgICBkID0+IChwaXZvdEJ5LmluZGV4T2YoZC5pZCkgPiAtMSA/IGZhbHNlIDogXy5nZXRGaXJzdERlZmluZWQoZC5zaG93LCB0cnVlKSlcclxuICAgICAgICAgIClcclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICAgICAgY29sdW1uczogdmlzaWJsZVN1YkNvbHVtbnMsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2x1bW5cclxuICAgICAgfSlcclxuXHJcbiAgICAgIHZpc2libGVDb2x1bW5zID0gdmlzaWJsZUNvbHVtbnMuZmlsdGVyKFxyXG4gICAgICAgIGNvbHVtbiA9PlxyXG4gICAgICAgICAgY29sdW1uLmNvbHVtbnNcclxuICAgICAgICAgICAgPyBjb2x1bW4uY29sdW1ucy5sZW5ndGhcclxuICAgICAgICAgICAgOiBwaXZvdEJ5LmluZGV4T2YoY29sdW1uLmlkKSA+IC0xXHJcbiAgICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICAgIDogXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLnNob3csIHRydWUpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIC8vIEZpbmQgYW55IGN1c3RvbSBwaXZvdCBsb2NhdGlvblxyXG4gICAgICBjb25zdCBwaXZvdEluZGV4ID0gdmlzaWJsZUNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wucGl2b3QpXHJcblxyXG4gICAgICAvLyBIYW5kbGUgUGl2b3QgQ29sdW1uc1xyXG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcclxuICAgICAgICAvLyBSZXRyaWV2ZSB0aGUgcGl2b3QgY29sdW1ucyBpbiB0aGUgY29ycmVjdCBwaXZvdCBvcmRlclxyXG4gICAgICAgIGNvbnN0IHBpdm90Q29sdW1ucyA9IFtdXHJcbiAgICAgICAgcGl2b3RCeS5mb3JFYWNoKHBpdm90SUQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZm91bmQgPSBhbGxEZWNvcmF0ZWRDb2x1bW5zLmZpbmQoZCA9PiBkLmlkID09PSBwaXZvdElEKVxyXG4gICAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICAgIHBpdm90Q29sdW1ucy5wdXNoKGZvdW5kKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnN0IFBpdm90UGFyZW50Q29sdW1uID0gcGl2b3RDb2x1bW5zLnJlZHVjZShcclxuICAgICAgICAgIChwcmV2LCBjdXJyZW50KSA9PiBwcmV2ICYmIHByZXYgPT09IGN1cnJlbnQucGFyZW50Q29sdW1uICYmIGN1cnJlbnQucGFyZW50Q29sdW1uLFxyXG4gICAgICAgICAgcGl2b3RDb2x1bW5zWzBdLnBhcmVudENvbHVtblxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgbGV0IFBpdm90R3JvdXBIZWFkZXIgPSBoYXNIZWFkZXJHcm91cHMgJiYgUGl2b3RQYXJlbnRDb2x1bW4uSGVhZGVyXHJcbiAgICAgICAgUGl2b3RHcm91cEhlYWRlciA9IFBpdm90R3JvdXBIZWFkZXIgfHwgKCgpID0+IDxzdHJvbmc+UGl2b3RlZDwvc3Ryb25nPilcclxuXHJcbiAgICAgICAgbGV0IHBpdm90Q29sdW1uR3JvdXAgPSB7XHJcbiAgICAgICAgICBIZWFkZXI6IFBpdm90R3JvdXBIZWFkZXIsXHJcbiAgICAgICAgICBjb2x1bW5zOiBwaXZvdENvbHVtbnMubWFwKGNvbCA9PiAoe1xyXG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLnBpdm90RGVmYXVsdHMsXHJcbiAgICAgICAgICAgIC4uLmNvbCxcclxuICAgICAgICAgICAgcGl2b3RlZDogdHJ1ZSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBsYWNlIHRoZSBwaXZvdENvbHVtbnMgYmFjayBpbnRvIHRoZSB2aXNpYmxlQ29sdW1uc1xyXG4gICAgICAgIGlmIChwaXZvdEluZGV4ID49IDApIHtcclxuICAgICAgICAgIHBpdm90Q29sdW1uR3JvdXAgPSB7XHJcbiAgICAgICAgICAgIC4uLnZpc2libGVDb2x1bW5zW3Bpdm90SW5kZXhdLFxyXG4gICAgICAgICAgICAuLi5waXZvdENvbHVtbkdyb3VwLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmlzaWJsZUNvbHVtbnMuc3BsaWNlKHBpdm90SW5kZXgsIDEsIHBpdm90Q29sdW1uR3JvdXApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZpc2libGVDb2x1bW5zLnVuc2hpZnQocGl2b3RDb2x1bW5Hcm91cClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEJ1aWxkIEhlYWRlciBHcm91cHNcclxuICAgICAgY29uc3QgaGVhZGVyR3JvdXBzID0gW11cclxuICAgICAgbGV0IGN1cnJlbnRTcGFuID0gW11cclxuXHJcbiAgICAgIC8vIEEgY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gYWRkIGEgaGVhZGVyIGFuZCByZXNldCB0aGUgY3VycmVudFNwYW5cclxuICAgICAgY29uc3QgYWRkSGVhZGVyID0gKGNvbHVtbnMsIGNvbHVtbikgPT4ge1xyXG4gICAgICAgIGhlYWRlckdyb3Vwcy5wdXNoKHtcclxuICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxyXG4gICAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgICAgY29sdW1ucyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIGN1cnJlbnRTcGFuID0gW11cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQnVpbGQgZmxhc3QgbGlzdCBvZiBhbGxWaXNpYmxlQ29sdW1ucyBhbmQgSGVhZGVyR3JvdXBzXHJcbiAgICAgIHZpc2libGVDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcclxuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICAgIGFsbFZpc2libGVDb2x1bW5zID0gYWxsVmlzaWJsZUNvbHVtbnMuY29uY2F0KGNvbHVtbi5jb2x1bW5zKVxyXG4gICAgICAgICAgaWYgKGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYWRkSGVhZGVyKGN1cnJlbnRTcGFuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYWRkSGVhZGVyKGNvbHVtbi5jb2x1bW5zLCBjb2x1bW4pXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMucHVzaChjb2x1bW4pXHJcbiAgICAgICAgY3VycmVudFNwYW4ucHVzaChjb2x1bW4pXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmIChoYXNIZWFkZXJHcm91cHMgJiYgY3VycmVudFNwYW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWNjZXNzIHRoZSBkYXRhXHJcbiAgICAgIGNvbnN0IGFjY2Vzc1JvdyA9IChkLCBpLCBsZXZlbCA9IDApID0+IHtcclxuICAgICAgICBjb25zdCByb3cgPSB7XHJcbiAgICAgICAgICBbb3JpZ2luYWxLZXldOiBkLFxyXG4gICAgICAgICAgW2luZGV4S2V5XTogaSxcclxuICAgICAgICAgIFtzdWJSb3dzS2V5XTogZFtzdWJSb3dzS2V5XSxcclxuICAgICAgICAgIFtuZXN0aW5nTGV2ZWxLZXldOiBsZXZlbCxcclxuICAgICAgICB9XHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XHJcbiAgICAgICAgICBpZiAoY29sdW1uLmV4cGFuZGVyKSByZXR1cm5cclxuICAgICAgICAgIHJvd1tjb2x1bW4uaWRdID0gY29sdW1uLmFjY2Vzc29yKGQpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZiAocm93W3N1YlJvd3NLZXldKSB7XHJcbiAgICAgICAgICByb3dbc3ViUm93c0tleV0gPSByb3dbc3ViUm93c0tleV0ubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSwgbGV2ZWwgKyAxKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyAvLyBJZiB0aGUgZGF0YSBoYXNuJ3QgY2hhbmdlZCwganVzdCB1c2UgdGhlIGNhY2hlZCBkYXRhXHJcbiAgICAgIGxldCByZXNvbHZlZERhdGEgPSB0aGlzLnJlc29sdmVkRGF0YVxyXG4gICAgICAvLyBJZiB0aGUgZGF0YSBoYXMgY2hhbmdlZCwgcnVuIHRoZSBkYXRhIHJlc29sdmVyIGFuZCBjYWNoZSB0aGUgcmVzdWx0XHJcbiAgICAgIGlmICghdGhpcy5yZXNvbHZlZERhdGEgfHwgZGF0YUNoYW5nZWQpIHtcclxuICAgICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlRGF0YShkYXRhKVxyXG4gICAgICAgIHRoaXMucmVzb2x2ZWREYXRhID0gcmVzb2x2ZWREYXRhXHJcbiAgICAgIH1cclxuICAgICAgLy8gVXNlIHRoZSByZXNvbHZlZCBkYXRhXHJcbiAgICAgIHJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YS5tYXAoKGQsIGkpID0+IGFjY2Vzc1JvdyhkLCBpKSlcclxuXHJcbiAgICAgIC8vIFRPRE86IE1ha2UgaXQgcG9zc2libGUgdG8gZmFicmljYXRlIG5lc3RlZCByb3dzIHdpdGhvdXQgcGl2b3RpbmdcclxuICAgICAgY29uc3QgYWdncmVnYXRpbmdDb2x1bW5zID0gYWxsVmlzaWJsZUNvbHVtbnMuZmlsdGVyKGQgPT4gIWQuZXhwYW5kZXIgJiYgZC5hZ2dyZWdhdGUpXHJcblxyXG4gICAgICAvLyBJZiBwaXZvdGluZywgcmVjdXJzaXZlbHkgZ3JvdXAgdGhlIGRhdGFcclxuICAgICAgY29uc3QgYWdncmVnYXRlID0gcm93cyA9PiB7XHJcbiAgICAgICAgY29uc3QgYWdncmVnYXRpb25WYWx1ZXMgPSB7fVxyXG4gICAgICAgIGFnZ3JlZ2F0aW5nQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XHJcbiAgICAgICAgICBjb25zdCB2YWx1ZXMgPSByb3dzLm1hcChkID0+IGRbY29sdW1uLmlkXSlcclxuICAgICAgICAgIGFnZ3JlZ2F0aW9uVmFsdWVzW2NvbHVtbi5pZF0gPSBjb2x1bW4uYWdncmVnYXRlKHZhbHVlcywgcm93cylcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBhZ2dyZWdhdGlvblZhbHVlc1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwaXZvdEJ5Lmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwUmVjdXJzaXZlbHkgPSAocm93cywga2V5cywgaSA9IDApID0+IHtcclxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgbGV2ZWwsIGp1c3QgcmV0dXJuIHRoZSByb3dzXHJcbiAgICAgICAgICBpZiAoaSA9PT0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJvd3NcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIEdyb3VwIHRoZSByb3dzIHRvZ2V0aGVyIGZvciB0aGlzIGxldmVsXHJcbiAgICAgICAgICBsZXQgZ3JvdXBlZFJvd3MgPSBPYmplY3QuZW50cmllcyhfLmdyb3VwQnkocm93cywga2V5c1tpXSkpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiAoe1xyXG4gICAgICAgICAgICBbcGl2b3RJREtleV06IGtleXNbaV0sXHJcbiAgICAgICAgICAgIFtwaXZvdFZhbEtleV06IGtleSxcclxuICAgICAgICAgICAgW2tleXNbaV1dOiBrZXksXHJcbiAgICAgICAgICAgIFtzdWJSb3dzS2V5XTogdmFsdWUsXHJcbiAgICAgICAgICAgIFtuZXN0aW5nTGV2ZWxLZXldOiBpLFxyXG4gICAgICAgICAgICBbZ3JvdXBlZEJ5UGl2b3RLZXldOiB0cnVlLFxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgICAvLyBSZWN1cnNlIGludG8gdGhlIHN1YlJvd3NcclxuICAgICAgICAgIGdyb3VwZWRSb3dzID0gZ3JvdXBlZFJvd3MubWFwKHJvd0dyb3VwID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc3ViUm93cyA9IGdyb3VwUmVjdXJzaXZlbHkocm93R3JvdXBbc3ViUm93c0tleV0sIGtleXMsIGkgKyAxKVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIC4uLnJvd0dyb3VwLFxyXG4gICAgICAgICAgICAgIFtzdWJSb3dzS2V5XTogc3ViUm93cyxcclxuICAgICAgICAgICAgICBbYWdncmVnYXRlZEtleV06IHRydWUsXHJcbiAgICAgICAgICAgICAgLi4uYWdncmVnYXRlKHN1YlJvd3MpLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgcmV0dXJuIGdyb3VwZWRSb3dzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc29sdmVkRGF0YSA9IGdyb3VwUmVjdXJzaXZlbHkocmVzb2x2ZWREYXRhLCBwaXZvdEJ5KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLm5ld1N0YXRlLFxyXG4gICAgICAgIHJlc29sdmVkRGF0YSxcclxuICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucyxcclxuICAgICAgICBoZWFkZXJHcm91cHMsXHJcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcclxuICAgICAgICBoYXNIZWFkZXJHcm91cHMsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRTb3J0ZWREYXRhIChyZXNvbHZlZFN0YXRlKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBtYW51YWwsXHJcbiAgICAgICAgc29ydGVkLFxyXG4gICAgICAgIGZpbHRlcmVkLFxyXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgcmVzb2x2ZWREYXRhLFxyXG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxyXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXHJcbiAgICAgIH0gPSByZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgICBjb25zdCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fVxyXG5cclxuICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5maWx0ZXIoY29sID0+IGNvbC5zb3J0TWV0aG9kKS5mb3JFYWNoKGNvbCA9PiB7XHJcbiAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEW2NvbC5pZF0gPSBjb2wuc29ydE1ldGhvZFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gUmVzb2x2ZSB0aGUgZGF0YSBmcm9tIGVpdGhlciBtYW51YWwgZGF0YSBvciBzb3J0ZWQgZGF0YVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNvcnRlZERhdGE6IG1hbnVhbFxyXG4gICAgICAgICAgPyByZXNvbHZlZERhdGFcclxuICAgICAgICAgIDogdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJEYXRhKHJlc29sdmVkRGF0YSwgZmlsdGVyZWQsIGRlZmF1bHRGaWx0ZXJNZXRob2QsIGFsbFZpc2libGVDb2x1bW5zKSxcclxuICAgICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcclxuICAgICAgICAgICksXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaXJlRmV0Y2hEYXRhICgpIHtcclxuICAgICAgdGhpcy5wcm9wcy5vbkZldGNoRGF0YSh0aGlzLmdldFJlc29sdmVkU3RhdGUoKSwgdGhpcylcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9wT3JTdGF0ZSAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnByb3BzW2tleV0sIHRoaXMuc3RhdGVba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdGF0ZU9yUHJvcCAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnN0YXRlW2tleV0sIHRoaXMucHJvcHNba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJEYXRhIChkYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsVmlzaWJsZUNvbHVtbnMpIHtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IGRhdGFcclxuXHJcbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIHtcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZC5yZWR1Y2UoKGZpbHRlcmVkU29GYXIsIG5leHRGaWx0ZXIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IGFsbFZpc2libGVDb2x1bW5zLmZpbmQoeCA9PiB4LmlkID09PSBuZXh0RmlsdGVyLmlkKVxyXG5cclxuICAgICAgICAgIC8vIERvbid0IGZpbHRlciBoaWRkZW4gY29sdW1ucyBvciBjb2x1bW5zIHRoYXQgaGF2ZSBoYWQgdGhlaXIgZmlsdGVycyBkaXNhYmxlZFxyXG4gICAgICAgICAgaWYgKCFjb2x1bW4gfHwgY29sdW1uLmZpbHRlcmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgZmlsdGVyTWV0aG9kID0gY29sdW1uLmZpbHRlck1ldGhvZCB8fCBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcblxyXG4gICAgICAgICAgLy8gSWYgJ2ZpbHRlckFsbCcgaXMgc2V0IHRvIHRydWUsIHBhc3MgdGhlIGVudGlyZSBkYXRhc2V0IHRvIHRoZSBmaWx0ZXIgbWV0aG9kXHJcbiAgICAgICAgICBpZiAoY29sdW1uLmZpbHRlckFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIGZpbHRlcmVkU29GYXIsIGNvbHVtbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyLmZpbHRlcihyb3cgPT4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIHJvdywgY29sdW1uKSlcclxuICAgICAgICB9LCBmaWx0ZXJlZERhdGEpXHJcblxyXG4gICAgICAgIC8vIEFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIHN1YnJvd3MgaWYgd2UgYXJlIHBpdm90aW5nLCBhbmQgdGhlblxyXG4gICAgICAgIC8vIGZpbHRlciBhbnkgcm93cyB3aXRob3V0IHN1YmNvbHVtbnMgYmVjYXVzZSBpdCB3b3VsZCBiZSBzdHJhbmdlIHRvIHNob3dcclxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFcclxuICAgICAgICAgIC5tYXAocm93ID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiByb3dcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIC4uLnJvdyxcclxuICAgICAgICAgICAgICBbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XTogdGhpcy5maWx0ZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICAgICAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1uc1xyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZmlsdGVyKHJvdyA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XS5sZW5ndGggPiAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmlsdGVyZWREYXRhXHJcbiAgICB9XHJcblxyXG4gICAgc29ydERhdGEgKGRhdGEsIHNvcnRlZCwgc29ydE1ldGhvZHNCeUNvbHVtbklEID0ge30pIHtcclxuICAgICAgaWYgKCFzb3J0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc29ydGVkRGF0YSA9ICh0aGlzLnByb3BzLm9yZGVyQnlNZXRob2QgfHwgXy5vcmRlckJ5KShcclxuICAgICAgICBkYXRhLFxyXG4gICAgICAgIHNvcnRlZC5tYXAoc29ydCA9PiB7XHJcbiAgICAgICAgICAvLyBTdXBwb3J0IGN1c3RvbSBzb3J0aW5nIG1ldGhvZHMgZm9yIGVhY2ggY29sdW1uXHJcbiAgICAgICAgICBpZiAoc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gdGhpcy5wcm9wcy5kZWZhdWx0U29ydE1ldGhvZChhW3NvcnQuaWRdLCBiW3NvcnQuaWRdLCBzb3J0LmRlc2MpXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgc29ydGVkLm1hcChkID0+ICFkLmRlc2MpLFxyXG4gICAgICAgIHRoaXMucHJvcHMuaW5kZXhLZXlcclxuICAgICAgKVxyXG5cclxuICAgICAgc29ydGVkRGF0YS5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldID0gdGhpcy5zb3J0RGF0YShcclxuICAgICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLFxyXG4gICAgICAgICAgc29ydGVkLFxyXG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEXHJcbiAgICAgICAgKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHNvcnRlZERhdGFcclxuICAgIH1cclxuXHJcbiAgICBnZXRNaW5Sb3dzICgpIHtcclxuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHMubWluUm93cywgdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZVNpemUnKSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2VyIGFjdGlvbnNcclxuICAgIG9uUGFnZUNoYW5nZSAocGFnZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZUNoYW5nZSwgY29sbGFwc2VPblBhZ2VDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBwYWdlIH1cclxuICAgICAgaWYgKGNvbGxhcHNlT25QYWdlQ2hhbmdlKSB7XHJcbiAgICAgICAgbmV3U3RhdGUuZXhwYW5kZWQgPSB7fVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShuZXdTdGF0ZSwgKCkgPT4gb25QYWdlQ2hhbmdlICYmIG9uUGFnZUNoYW5nZShwYWdlKSlcclxuICAgIH1cclxuXHJcbiAgICBvblBhZ2VTaXplQ2hhbmdlIChuZXdQYWdlU2l6ZSkge1xyXG4gICAgICBjb25zdCB7IG9uUGFnZVNpemVDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgeyBwYWdlU2l6ZSwgcGFnZSB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGFnZSB0byBkaXNwbGF5XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcclxuICAgICAgY29uc3QgbmV3UGFnZSA9IE1hdGguZmxvb3IoY3VycmVudFJvdyAvIG5ld1BhZ2VTaXplKVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhZ2VTaXplOiBuZXdQYWdlU2l6ZSxcclxuICAgICAgICAgIHBhZ2U6IG5ld1BhZ2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiBvblBhZ2VTaXplQ2hhbmdlICYmIG9uUGFnZVNpemVDaGFuZ2UobmV3UGFnZVNpemUsIG5ld1BhZ2UpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XHJcbiAgICAgIGNvbnN0IHsgc29ydGVkLCBza2lwTmV4dFNvcnQsIGRlZmF1bHRTb3J0RGVzYyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuXHJcbiAgICAgIGNvbnN0IGZpcnN0U29ydERpcmVjdGlvbiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb2x1bW4sICdkZWZhdWx0U29ydERlc2MnKVxyXG4gICAgICAgID8gY29sdW1uLmRlZmF1bHRTb3J0RGVzY1xyXG4gICAgICAgIDogZGVmYXVsdFNvcnREZXNjXHJcbiAgICAgIGNvbnN0IHNlY29uZFNvcnREaXJlY3Rpb24gPSAhZmlyc3RTb3J0RGlyZWN0aW9uXHJcblxyXG4gICAgICAvLyB3ZSBjYW4ndCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGZyb20gdGhlIGNvbHVtbiByZXNpemUgbW92ZSBoYW5kbGVyc1xyXG4gICAgICAvLyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgYmVjYXVzZSBvZiByZWFjdCdzIHN5bnRoZXRpYyBldmVudHNcclxuICAgICAgLy8gc28gd2UgaGF2ZSB0byBwcmV2ZW50IHRoZSBzb3J0IGZ1bmN0aW9uIGZyb20gYWN0dWFsbHkgc29ydGluZ1xyXG4gICAgICAvLyBpZiB3ZSBjbGljayBvbiB0aGUgY29sdW1uIHJlc2l6ZSBlbGVtZW50IHdpdGhpbiBhIGhlYWRlci5cclxuICAgICAgaWYgKHNraXBOZXh0U29ydCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XHJcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHsgb25Tb3J0ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGxldCBuZXdTb3J0ZWQgPSBfLmNsb25lKHNvcnRlZCB8fCBbXSkubWFwKGQgPT4ge1xyXG4gICAgICAgIGQuZGVzYyA9IF8uaXNTb3J0aW5nRGVzYyhkKVxyXG4gICAgICAgIHJldHVybiBkXHJcbiAgICAgIH0pXHJcbiAgICAgIGlmICghXy5pc0FycmF5KGNvbHVtbikpIHtcclxuICAgICAgICAvLyBTaW5nbGUtU29ydFxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxyXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcclxuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbmV3U29ydGVkW2V4aXN0aW5nSW5kZXhdXHJcbiAgICAgICAgICBpZiAoZXhpc3RpbmcuZGVzYyA9PT0gc2Vjb25kU29ydERpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWQuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IGZpcnN0U29ydERpcmVjdGlvblxyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpdmUpIHtcclxuICAgICAgICAgIG5ld1NvcnRlZC5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcclxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE11bHRpLVNvcnRcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gbmV3U29ydGVkLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtblswXS5pZClcclxuICAgICAgICAvLyBFeGlzdGluZyBTb3J0ZWQgQ29sdW1uXHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cclxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgY29sdW1uLmxlbmd0aClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmV3U29ydGVkW2V4aXN0aW5nSW5kZXggKyBpXS5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sdW1uLmZvckVhY2goKGQsIGkpID0+IHtcclxuICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBzZWNvbmRTb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XHJcbiAgICAgICAgICAgIG5ld1NvcnRlZCA9IG5ld1NvcnRlZC5zbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gTmV3IFNvcnQgQ29sdW1uXHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLmNvbmNhdChcclxuICAgICAgICAgICAgY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgICAgaWQ6IGQuaWQsXHJcbiAgICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICAgIClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U29ydGVkID0gY29sdW1uLm1hcChkID0+ICh7XHJcbiAgICAgICAgICAgIGlkOiBkLmlkLFxyXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYWdlOiAoIXNvcnRlZC5sZW5ndGggJiYgbmV3U29ydGVkLmxlbmd0aCkgfHwgIWFkZGl0aXZlID8gMCA6IHRoaXMuc3RhdGUucGFnZSxcclxuICAgICAgICAgIHNvcnRlZDogbmV3U29ydGVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25Tb3J0ZWRDaGFuZ2UgJiYgb25Tb3J0ZWRDaGFuZ2UobmV3U29ydGVkLCBjb2x1bW4sIGFkZGl0aXZlKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQ29sdW1uIChjb2x1bW4sIHZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IHsgZmlsdGVyZWQgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcbiAgICAgIGNvbnN0IHsgb25GaWx0ZXJlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIG9sZCBmaWx0ZXIgZmlyc3QgaWYgaXQgZXhpc3RzXHJcbiAgICAgIGNvbnN0IG5ld0ZpbHRlcmluZyA9IChmaWx0ZXJlZCB8fCBbXSkuZmlsdGVyKHggPT4geC5pZCAhPT0gY29sdW1uLmlkKVxyXG5cclxuICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgIG5ld0ZpbHRlcmluZy5wdXNoKHtcclxuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXHJcbiAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmlsdGVyZWQ6IG5ld0ZpbHRlcmluZyxcclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IG9uRmlsdGVyZWRDaGFuZ2UgJiYgb25GaWx0ZXJlZENoYW5nZShuZXdGaWx0ZXJpbmcsIGNvbHVtbiwgdmFsdWUpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5TdGFydCAoZXZlbnQsIGNvbHVtbiwgaXNUb3VjaCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICBjb25zdCBwYXJlbnRXaWR0aCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcblxyXG4gICAgICBsZXQgcGFnZVhcclxuICAgICAgaWYgKGlzVG91Y2gpIHtcclxuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnRyYXBFdmVudHMgPSB0cnVlXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzoge1xyXG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxyXG4gICAgICAgICAgICBzdGFydFg6IHBhZ2VYLFxyXG4gICAgICAgICAgICBwYXJlbnRXaWR0aCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVDb2x1bW5Nb3ZpbmcgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlLCBjb2x1bW4gfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgeyByZXNpemVkLCBjdXJyZW50bHlSZXNpemluZywgY29sdW1ucyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgICAgY29uc3QgY3VycmVudENvbHVtbiA9IGNvbHVtbnMuZmluZChjID0+IGMuYWNjZXNzb3IgPT09IGN1cnJlbnRseVJlc2l6aW5nLmlkKTtcclxuICAgICAgY29uc3QgbWluUmVzaXplV2lkdGggPSBjdXJyZW50Q29sdW1uID8gY3VycmVudENvbHVtbi5taW5SZXNpemVXaWR0aCA6IGNvbHVtbi5taW5SZXNpemVXaWR0aDtcclxuXHJcbiAgICAgIC8vIERlbGV0ZSBvbGQgdmFsdWVcclxuICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHggPT4geC5pZCAhPT0gY3VycmVudGx5UmVzaXppbmcuaWQpXHJcblxyXG4gICAgICBsZXQgcGFnZVhcclxuXHJcbiAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVhcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJykge1xyXG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVhcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLm1heChcclxuICAgICAgICBjdXJyZW50bHlSZXNpemluZy5wYXJlbnRXaWR0aCArIHBhZ2VYIC0gY3VycmVudGx5UmVzaXppbmcuc3RhcnRYLFxyXG4gICAgICAgIG1pblJlc2l6ZVdpZHRoXHJcbiAgICAgIClcclxuXHJcbiAgICAgIG5ld1Jlc2l6ZWQucHVzaCh7XHJcbiAgICAgICAgaWQ6IGN1cnJlbnRseVJlc2l6aW5nLmlkLFxyXG4gICAgICAgIHZhbHVlOiBuZXdXaWR0aCxcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICB7XHJcbiAgICAgICAgICByZXNpemVkOiBuZXdSZXNpemVkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKCkgPT4gb25SZXNpemVkQ2hhbmdlICYmIG9uUmVzaXplZENoYW5nZShuZXdSZXNpemVkLCBldmVudClcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZUNvbHVtbkVuZCAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgY29uc3QgaXNUb3VjaCA9IGV2ZW50LnR5cGUgPT09ICd0b3VjaGVuZCcgfHwgZXZlbnQudHlwZSA9PT0gJ3RvdWNoY2FuY2VsJ1xyXG5cclxuICAgICAgaWYgKGlzVG91Y2gpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGl0cyBhIHRvdWNoIGV2ZW50IGNsZWFyIHRoZSBtb3VzZSBvbmUncyBhcyB3ZWxsIGJlY2F1c2Ugc29tZXRpbWVzXHJcbiAgICAgIC8vIHRoZSBtb3VzZURvd24gZXZlbnQgZ2V0cyBjYWxsZWQgYXMgd2VsbCwgYnV0IHRoZSBtb3VzZVVwIGV2ZW50IGRvZXNuJ3RcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxyXG5cclxuICAgICAgLy8gVGhlIHRvdWNoIGV2ZW50cyBkb24ndCBwcm9wYWdhdGUgdXAgdG8gdGhlIHNvcnRpbmcncyBvbk1vdXNlRG93biBldmVudCBzb1xyXG4gICAgICAvLyBubyBuZWVkIHRvIHByZXZlbnQgaXQgZnJvbSBoYXBwZW5pbmcgb3IgZWxzZSB0aGUgZmlyc3QgY2xpY2sgYWZ0ZXIgYSB0b3VjaFxyXG4gICAgICAvLyBldmVudCByZXNpemUgd2lsbCBub3Qgc29ydCB0aGUgY29sdW1uLlxyXG4gICAgICBpZiAoIWlzVG91Y2gpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoe1xyXG4gICAgICAgICAgc2tpcE5leHRTb3J0OiB0cnVlLFxyXG4gICAgICAgICAgY3VycmVudGx5UmVzaXppbmc6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiJdfQ==