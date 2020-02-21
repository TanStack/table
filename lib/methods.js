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
          filter: this.getStateOrProp('filter')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiXyIsImNvbXBhY3RPYmplY3QiLCJuZXdTdGF0ZSIsImRhdGFDaGFuZ2VkIiwiY29sdW1ucyIsInBpdm90QnkiLCJkYXRhIiwicmVzb2x2ZURhdGEiLCJwaXZvdElES2V5IiwicGl2b3RWYWxLZXkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm5lc3RpbmdMZXZlbEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsIlN1YkNvbXBvbmVudCIsImhhc0hlYWRlckdyb3VwcyIsImZvckVhY2giLCJjb2x1bW4iLCJjb2x1bW5zV2l0aEV4cGFuZGVyIiwiZXhwYW5kZXJDb2x1bW4iLCJmaW5kIiwiY29sIiwiZXhwYW5kZXIiLCJzb21lIiwiY29sMiIsIm1ha2VEZWNvcmF0ZWRDb2x1bW4iLCJwYXJlbnRDb2x1bW4iLCJkY29sIiwiZXhwYW5kZXJEZWZhdWx0cyIsIm1heFdpZHRoIiwibWluV2lkdGgiLCJhY2Nlc3NvciIsImlkIiwiYWNjZXNzb3JTdHJpbmciLCJnZXQiLCJyb3ciLCJjb25zb2xlIiwid2FybiIsIkVycm9yIiwidW5kZWZpbmVkIiwiYWxsRGVjb3JhdGVkQ29sdW1ucyIsImRlY29yYXRlQW5kQWRkVG9BbGwiLCJkZWNvcmF0ZWRDb2x1bW4iLCJwdXNoIiwiZGVjb3JhdGVkQ29sdW1ucyIsIm1hcCIsImQiLCJ2aXNpYmxlQ29sdW1ucyIsInNsaWNlIiwiYWxsVmlzaWJsZUNvbHVtbnMiLCJ2aXNpYmxlU3ViQ29sdW1ucyIsImZpbHRlciIsImluZGV4T2YiLCJnZXRGaXJzdERlZmluZWQiLCJzaG93IiwibGVuZ3RoIiwicGl2b3RJbmRleCIsImZpbmRJbmRleCIsInBpdm90IiwicGl2b3RDb2x1bW5zIiwiZm91bmQiLCJwaXZvdElEIiwiUGl2b3RQYXJlbnRDb2x1bW4iLCJyZWR1Y2UiLCJwcmV2IiwiY3VycmVudCIsIlBpdm90R3JvdXBIZWFkZXIiLCJIZWFkZXIiLCJwaXZvdENvbHVtbkdyb3VwIiwicGl2b3REZWZhdWx0cyIsInBpdm90ZWQiLCJzcGxpY2UiLCJ1bnNoaWZ0IiwiaGVhZGVyR3JvdXBzIiwiY3VycmVudFNwYW4iLCJhZGRIZWFkZXIiLCJjb25jYXQiLCJhY2Nlc3NSb3ciLCJpIiwibGV2ZWwiLCJyZXNvbHZlZERhdGEiLCJhZ2dyZWdhdGluZ0NvbHVtbnMiLCJhZ2dyZWdhdGUiLCJhZ2dyZWdhdGlvblZhbHVlcyIsInZhbHVlcyIsInJvd3MiLCJncm91cFJlY3Vyc2l2ZWx5Iiwia2V5cyIsImdyb3VwZWRSb3dzIiwiT2JqZWN0IiwiZW50cmllcyIsImdyb3VwQnkiLCJrZXkiLCJ2YWx1ZSIsInN1YlJvd3MiLCJyb3dHcm91cCIsIm1hbnVhbCIsInNvcnRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInNvcnRNZXRob2RzQnlDb2x1bW5JRCIsInNvcnRNZXRob2QiLCJzb3J0ZWREYXRhIiwic29ydERhdGEiLCJmaWx0ZXJEYXRhIiwiY3VycmVudFN0YXRlIiwiZ2V0UmVzb2x2ZWRTdGF0ZSIsInBhZ2UiLCJnZXRTdGF0ZU9yUHJvcCIsInBhZ2VTaXplIiwib25GZXRjaERhdGEiLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJlZFNvRmFyIiwibmV4dEZpbHRlciIsIngiLCJmaWx0ZXJhYmxlIiwiZmlsdGVyTWV0aG9kIiwiZmlsdGVyQWxsIiwib3JkZXJCeU1ldGhvZCIsIm9yZGVyQnkiLCJzb3J0IiwiYSIsImIiLCJkZXNjIiwiZGVmYXVsdFNvcnRNZXRob2QiLCJtaW5Sb3dzIiwib25QYWdlQ2hhbmdlIiwiY29sbGFwc2VPblBhZ2VDaGFuZ2UiLCJleHBhbmRlZCIsInNldFN0YXRlV2l0aERhdGEiLCJuZXdQYWdlU2l6ZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjdXJyZW50Um93IiwibmV3UGFnZSIsIk1hdGgiLCJmbG9vciIsImFkZGl0aXZlIiwic2tpcE5leHRTb3J0IiwiZGVmYXVsdFNvcnREZXNjIiwiZmlyc3RTb3J0RGlyZWN0aW9uIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwic2Vjb25kU29ydERpcmVjdGlvbiIsIm9uU29ydGVkQ2hhbmdlIiwibmV3U29ydGVkIiwiY2xvbmUiLCJpc1NvcnRpbmdEZXNjIiwiaXNBcnJheSIsImV4aXN0aW5nSW5kZXgiLCJleGlzdGluZyIsIm9uRmlsdGVyZWRDaGFuZ2UiLCJuZXdGaWx0ZXJpbmciLCJldmVudCIsImlzVG91Y2giLCJzdG9wUHJvcGFnYXRpb24iLCJwYXJlbnRXaWR0aCIsInRhcmdldCIsInBhcmVudEVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ3aWR0aCIsInBhZ2VYIiwiY2hhbmdlZFRvdWNoZXMiLCJ0cmFwRXZlbnRzIiwiY3VycmVudGx5UmVzaXppbmciLCJzdGFydFgiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNpemVDb2x1bW5FbmQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwiY3VycmVudENvbHVtbiIsImMiLCJtaW5SZXNpemVXaWR0aCIsIm5ld1Jlc2l6ZWQiLCJ0eXBlIiwibmV3V2lkdGgiLCJtYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiQmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztrQkFFZTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSx1Q0FFT0EsS0FGUCxFQUVjQyxLQUZkLEVBRXFCO0FBQzlCLFlBQU1DLDZCQUNEQyxnQkFBRUMsYUFBRixDQUFnQixLQUFLSCxLQUFyQixDQURDLEVBRURFLGdCQUFFQyxhQUFGLENBQWdCLEtBQUtKLEtBQXJCLENBRkMsRUFHREcsZ0JBQUVDLGFBQUYsQ0FBZ0JILEtBQWhCLENBSEMsRUFJREUsZ0JBQUVDLGFBQUYsQ0FBZ0JKLEtBQWhC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cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBfIGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IEJhc2UgPT5cbiAgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICBnZXRSZXNvbHZlZFN0YXRlIChwcm9wcywgc3RhdGUpIHtcbiAgICAgIGNvbnN0IHJlc29sdmVkU3RhdGUgPSB7XG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdCh0aGlzLnN0YXRlKSxcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMucHJvcHMpLFxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3Qoc3RhdGUpLFxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QocHJvcHMpLFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmVkU3RhdGVcbiAgICB9XG5cbiAgICBnZXREYXRhTW9kZWwgKG5ld1N0YXRlLCBkYXRhQ2hhbmdlZCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBwaXZvdEJ5ID0gW10sXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHJlc29sdmVEYXRhLFxuICAgICAgICBwaXZvdElES2V5LFxuICAgICAgICBwaXZvdFZhbEtleSxcbiAgICAgICAgc3ViUm93c0tleSxcbiAgICAgICAgYWdncmVnYXRlZEtleSxcbiAgICAgICAgbmVzdGluZ0xldmVsS2V5LFxuICAgICAgICBvcmlnaW5hbEtleSxcbiAgICAgICAgaW5kZXhLZXksXG4gICAgICAgIGdyb3VwZWRCeVBpdm90S2V5LFxuICAgICAgICBTdWJDb21wb25lbnQsXG4gICAgICB9ID0gbmV3U3RhdGVcblxuICAgICAgLy8gRGV0ZXJtaW5lIEhlYWRlciBHcm91cHNcbiAgICAgIGxldCBoYXNIZWFkZXJHcm91cHMgPSBmYWxzZVxuICAgICAgY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIGhhc0hlYWRlckdyb3VwcyA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgbGV0IGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbLi4uY29sdW1uc11cblxuICAgICAgbGV0IGV4cGFuZGVyQ29sdW1uID0gY29sdW1ucy5maW5kKFxuICAgICAgICBjb2wgPT4gY29sLmV4cGFuZGVyIHx8IChjb2wuY29sdW1ucyAmJiBjb2wuY29sdW1ucy5zb21lKGNvbDIgPT4gY29sMi5leHBhbmRlcikpXG4gICAgICApXG4gICAgICAvLyBUaGUgYWN0dWFsIGV4cGFuZGVyIG1pZ2h0IGJlIGluIHRoZSBjb2x1bW5zIGZpZWxkIG9mIGEgZ3JvdXAgY29sdW1uXG4gICAgICBpZiAoZXhwYW5kZXJDb2x1bW4gJiYgIWV4cGFuZGVyQ29sdW1uLmV4cGFuZGVyKSB7XG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0gZXhwYW5kZXJDb2x1bW4uY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuZXhwYW5kZXIpXG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgU3ViQ29tcG9uZW50J3Mgd2UgbmVlZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBhbiBleHBhbmRlciBjb2x1bW5cbiAgICAgIGlmIChTdWJDb21wb25lbnQgJiYgIWV4cGFuZGVyQ29sdW1uKSB7XG4gICAgICAgIGV4cGFuZGVyQ29sdW1uID0geyBleHBhbmRlcjogdHJ1ZSB9XG4gICAgICAgIGNvbHVtbnNXaXRoRXhwYW5kZXIgPSBbZXhwYW5kZXJDb2x1bW4sIC4uLmNvbHVtbnNXaXRoRXhwYW5kZXJdXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1ha2VEZWNvcmF0ZWRDb2x1bW4gPSAoY29sdW1uLCBwYXJlbnRDb2x1bW4pID0+IHtcbiAgICAgICAgbGV0IGRjb2xcbiAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikge1xuICAgICAgICAgIGRjb2wgPSB7XG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuZXhwYW5kZXJEZWZhdWx0cyxcbiAgICAgICAgICAgIC4uLmNvbHVtbixcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGNvbCA9IHtcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxuICAgICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSBtaW5XaWR0aCBpcyBub3QgZ3JlYXRlciB0aGFuIG1heFdpZHRoIGlmIHNldFxuICAgICAgICBpZiAoZGNvbC5tYXhXaWR0aCA8IGRjb2wubWluV2lkdGgpIHtcbiAgICAgICAgICBkY29sLm1pbldpZHRoID0gZGNvbC5tYXhXaWR0aFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmVudENvbHVtbikge1xuICAgICAgICAgIGRjb2wucGFyZW50Q29sdW1uID0gcGFyZW50Q29sdW1uXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaXJzdCBjaGVjayBmb3Igc3RyaW5nIGFjY2Vzc29yXG4gICAgICAgIGlmICh0eXBlb2YgZGNvbC5hY2Nlc3NvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBkY29sLmlkID0gZGNvbC5pZCB8fCBkY29sLmFjY2Vzc29yXG4gICAgICAgICAgY29uc3QgYWNjZXNzb3JTdHJpbmcgPSBkY29sLmFjY2Vzc29yXG4gICAgICAgICAgZGNvbC5hY2Nlc3NvciA9IHJvdyA9PiBfLmdldChyb3csIGFjY2Vzc29yU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBkY29sXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gZnVuY3Rpb25hbCBhY2Nlc3NvciAoYnV0IHJlcXVpcmUgYW4gSUQpXG4gICAgICAgIGlmIChkY29sLmFjY2Vzc29yICYmICFkY29sLmlkKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGRjb2wpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0EgY29sdW1uIGlkIGlzIHJlcXVpcmVkIGlmIHVzaW5nIGEgbm9uLXN0cmluZyBhY2Nlc3NvciBmb3IgY29sdW1uIGFib3ZlLidcbiAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gYW4gdW5kZWZpbmVkIGFjY2Vzc29yXG4gICAgICAgIGlmICghZGNvbC5hY2Nlc3Nvcikge1xuICAgICAgICAgIGRjb2wuYWNjZXNzb3IgPSAoKSA9PiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkY29sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFsbERlY29yYXRlZENvbHVtbnMgPSBbXVxuXG4gICAgICAvLyBEZWNvcmF0ZSB0aGUgY29sdW1uc1xuICAgICAgY29uc3QgZGVjb3JhdGVBbmRBZGRUb0FsbCA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCBkZWNvcmF0ZWRDb2x1bW4gPSBtYWtlRGVjb3JhdGVkQ29sdW1uKGNvbHVtbiwgcGFyZW50Q29sdW1uKVxuICAgICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zLnB1c2goZGVjb3JhdGVkQ29sdW1uKVxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkQ29sdW1uXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbnMgPSBjb2x1bW5zV2l0aEV4cGFuZGVyLm1hcChjb2x1bW4gPT4ge1xuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgICAgY29sdW1uczogY29sdW1uLmNvbHVtbnMubWFwKGQgPT4gZGVjb3JhdGVBbmRBZGRUb0FsbChkLCBjb2x1bW4pKSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlY29yYXRlQW5kQWRkVG9BbGwoY29sdW1uKVxuICAgICAgfSlcblxuICAgICAgLy8gQnVpbGQgdGhlIHZpc2libGUgY29sdW1ucywgaGVhZGVycyBhbmQgZmxhdCBjb2x1bW4gbGlzdFxuICAgICAgbGV0IHZpc2libGVDb2x1bW5zID0gZGVjb3JhdGVkQ29sdW1ucy5zbGljZSgpXG4gICAgICBsZXQgYWxsVmlzaWJsZUNvbHVtbnMgPSBbXVxuXG4gICAgICB2aXNpYmxlQ29sdW1ucyA9IHZpc2libGVDb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgICBjb25zdCB2aXNpYmxlU3ViQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zLmZpbHRlcihkID0+XG4gICAgICAgICAgICBwaXZvdEJ5LmluZGV4T2YoZC5pZCkgPiAtMSA/IGZhbHNlIDogXy5nZXRGaXJzdERlZmluZWQoZC5zaG93LCB0cnVlKVxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgICAgY29sdW1uczogdmlzaWJsZVN1YkNvbHVtbnMsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2x1bW5cbiAgICAgIH0pXG5cbiAgICAgIHZpc2libGVDb2x1bW5zID0gdmlzaWJsZUNvbHVtbnMuZmlsdGVyKGNvbHVtbiA9PlxuICAgICAgICBjb2x1bW4uY29sdW1uc1xuICAgICAgICAgID8gY29sdW1uLmNvbHVtbnMubGVuZ3RoXG4gICAgICAgICAgOiBwaXZvdEJ5LmluZGV4T2YoY29sdW1uLmlkKSA+IC0xXG4gICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICA6IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zaG93LCB0cnVlKVxuICAgICAgKVxuXG4gICAgICAvLyBGaW5kIGFueSBjdXN0b20gcGl2b3QgbG9jYXRpb25cbiAgICAgIGNvbnN0IHBpdm90SW5kZXggPSB2aXNpYmxlQ29sdW1ucy5maW5kSW5kZXgoY29sID0+IGNvbC5waXZvdClcblxuICAgICAgLy8gSGFuZGxlIFBpdm90IENvbHVtbnNcbiAgICAgIGlmIChwaXZvdEJ5Lmxlbmd0aCkge1xuICAgICAgICAvLyBSZXRyaWV2ZSB0aGUgcGl2b3QgY29sdW1ucyBpbiB0aGUgY29ycmVjdCBwaXZvdCBvcmRlclxuICAgICAgICBjb25zdCBwaXZvdENvbHVtbnMgPSBbXVxuICAgICAgICBwaXZvdEJ5LmZvckVhY2gocGl2b3RJRCA9PiB7XG4gICAgICAgICAgY29uc3QgZm91bmQgPSBhbGxEZWNvcmF0ZWRDb2x1bW5zLmZpbmQoZCA9PiBkLmlkID09PSBwaXZvdElEKVxuICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgcGl2b3RDb2x1bW5zLnB1c2goZm91bmQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IFBpdm90UGFyZW50Q29sdW1uID0gcGl2b3RDb2x1bW5zLnJlZHVjZShcbiAgICAgICAgICAocHJldiwgY3VycmVudCkgPT4gcHJldiAmJiBwcmV2ID09PSBjdXJyZW50LnBhcmVudENvbHVtbiAmJiBjdXJyZW50LnBhcmVudENvbHVtbixcbiAgICAgICAgICBwaXZvdENvbHVtbnNbMF0ucGFyZW50Q29sdW1uXG4gICAgICAgIClcblxuICAgICAgICBsZXQgUGl2b3RHcm91cEhlYWRlciA9IGhhc0hlYWRlckdyb3VwcyAmJiBQaXZvdFBhcmVudENvbHVtbi5IZWFkZXJcbiAgICAgICAgUGl2b3RHcm91cEhlYWRlciA9IFBpdm90R3JvdXBIZWFkZXIgfHwgKCgpID0+IDxzdHJvbmc+UGl2b3RlZDwvc3Ryb25nPilcblxuICAgICAgICBsZXQgcGl2b3RDb2x1bW5Hcm91cCA9IHtcbiAgICAgICAgICBIZWFkZXI6IFBpdm90R3JvdXBIZWFkZXIsXG4gICAgICAgICAgY29sdW1uczogcGl2b3RDb2x1bW5zLm1hcChjb2wgPT4gKHtcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMucGl2b3REZWZhdWx0cyxcbiAgICAgICAgICAgIC4uLmNvbCxcbiAgICAgICAgICAgIHBpdm90ZWQ6IHRydWUsXG4gICAgICAgICAgfSkpLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGxhY2UgdGhlIHBpdm90Q29sdW1ucyBiYWNrIGludG8gdGhlIHZpc2libGVDb2x1bW5zXG4gICAgICAgIGlmIChwaXZvdEluZGV4ID49IDApIHtcbiAgICAgICAgICBwaXZvdENvbHVtbkdyb3VwID0ge1xuICAgICAgICAgICAgLi4udmlzaWJsZUNvbHVtbnNbcGl2b3RJbmRleF0sXG4gICAgICAgICAgICAuLi5waXZvdENvbHVtbkdyb3VwLFxuICAgICAgICAgIH1cbiAgICAgICAgICB2aXNpYmxlQ29sdW1ucy5zcGxpY2UocGl2b3RJbmRleCwgMSwgcGl2b3RDb2x1bW5Hcm91cClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2aXNpYmxlQ29sdW1ucy51bnNoaWZ0KHBpdm90Q29sdW1uR3JvdXApXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgSGVhZGVyIEdyb3Vwc1xuICAgICAgY29uc3QgaGVhZGVyR3JvdXBzID0gW11cbiAgICAgIGxldCBjdXJyZW50U3BhbiA9IFtdXG5cbiAgICAgIC8vIEEgY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gYWRkIGEgaGVhZGVyIGFuZCByZXNldCB0aGUgY3VycmVudFNwYW5cbiAgICAgIGNvbnN0IGFkZEhlYWRlciA9IChjb2x1bW5zLCBjb2x1bW4pID0+IHtcbiAgICAgICAgaGVhZGVyR3JvdXBzLnB1c2goe1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxuICAgICAgICAgIC4uLmNvbHVtbixcbiAgICAgICAgICBjb2x1bW5zLFxuICAgICAgICB9KVxuICAgICAgICBjdXJyZW50U3BhbiA9IFtdXG4gICAgICB9XG5cbiAgICAgIC8vIEJ1aWxkIGZsYXN0IGxpc3Qgb2YgYWxsVmlzaWJsZUNvbHVtbnMgYW5kIEhlYWRlckdyb3Vwc1xuICAgICAgdmlzaWJsZUNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmNvbmNhdChjb2x1bW4uY29sdW1ucylcbiAgICAgICAgICBpZiAoY3VycmVudFNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYWRkSGVhZGVyKGN1cnJlbnRTcGFuKVxuICAgICAgICAgIH1cbiAgICAgICAgICBhZGRIZWFkZXIoY29sdW1uLmNvbHVtbnMsIGNvbHVtbilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucy5wdXNoKGNvbHVtbilcbiAgICAgICAgY3VycmVudFNwYW4ucHVzaChjb2x1bW4pXG4gICAgICB9KVxuICAgICAgaWYgKGhhc0hlYWRlckdyb3VwcyAmJiBjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICAgIH1cblxuICAgICAgLy8gQWNjZXNzIHRoZSBkYXRhXG4gICAgICBjb25zdCBhY2Nlc3NSb3cgPSAoZCwgaSwgbGV2ZWwgPSAwKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHtcbiAgICAgICAgICBbb3JpZ2luYWxLZXldOiBkLFxuICAgICAgICAgIFtpbmRleEtleV06IGksXG4gICAgICAgICAgW3N1YlJvd3NLZXldOiBkW3N1YlJvd3NLZXldLFxuICAgICAgICAgIFtuZXN0aW5nTGV2ZWxLZXldOiBsZXZlbCxcbiAgICAgICAgfVxuICAgICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICBpZiAoY29sdW1uLmV4cGFuZGVyKSByZXR1cm5cbiAgICAgICAgICByb3dbY29sdW1uLmlkXSA9IGNvbHVtbi5hY2Nlc3NvcihkKVxuICAgICAgICB9KVxuICAgICAgICBpZiAocm93W3N1YlJvd3NLZXldKSB7XG4gICAgICAgICAgcm93W3N1YlJvd3NLZXldID0gcm93W3N1YlJvd3NLZXldLm1hcCgoZCwgaSkgPT4gYWNjZXNzUm93KGQsIGksIGxldmVsICsgMSkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd1xuICAgICAgfVxuXG4gICAgICAvLyAvLyBJZiB0aGUgZGF0YSBoYXNuJ3QgY2hhbmdlZCwganVzdCB1c2UgdGhlIGNhY2hlZCBkYXRhXG4gICAgICBsZXQgcmVzb2x2ZWREYXRhID0gdGhpcy5yZXNvbHZlZERhdGFcbiAgICAgIC8vIElmIHRoZSBkYXRhIGhhcyBjaGFuZ2VkLCBydW4gdGhlIGRhdGEgcmVzb2x2ZXIgYW5kIGNhY2hlIHRoZSByZXN1bHRcbiAgICAgIGlmICghdGhpcy5yZXNvbHZlZERhdGEgfHwgZGF0YUNoYW5nZWQpIHtcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzb2x2ZURhdGEoZGF0YSlcbiAgICAgICAgdGhpcy5yZXNvbHZlZERhdGEgPSByZXNvbHZlZERhdGFcbiAgICAgIH1cbiAgICAgIC8vIFVzZSB0aGUgcmVzb2x2ZWQgZGF0YVxuICAgICAgcmVzb2x2ZWREYXRhID0gcmVzb2x2ZWREYXRhLm1hcCgoZCwgaSkgPT4gYWNjZXNzUm93KGQsIGkpKVxuXG4gICAgICAvLyBUT0RPOiBNYWtlIGl0IHBvc3NpYmxlIHRvIGZhYnJpY2F0ZSBuZXN0ZWQgcm93cyB3aXRob3V0IHBpdm90aW5nXG4gICAgICBjb25zdCBhZ2dyZWdhdGluZ0NvbHVtbnMgPSBhbGxWaXNpYmxlQ29sdW1ucy5maWx0ZXIoZCA9PiAhZC5leHBhbmRlciAmJiBkLmFnZ3JlZ2F0ZSlcblxuICAgICAgLy8gSWYgcGl2b3RpbmcsIHJlY3Vyc2l2ZWx5IGdyb3VwIHRoZSBkYXRhXG4gICAgICBjb25zdCBhZ2dyZWdhdGUgPSByb3dzID0+IHtcbiAgICAgICAgY29uc3QgYWdncmVnYXRpb25WYWx1ZXMgPSB7fVxuICAgICAgICBhZ2dyZWdhdGluZ0NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IHJvd3MubWFwKGQgPT4gZFtjb2x1bW4uaWRdKVxuICAgICAgICAgIGFnZ3JlZ2F0aW9uVmFsdWVzW2NvbHVtbi5pZF0gPSBjb2x1bW4uYWdncmVnYXRlKHZhbHVlcywgcm93cylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGFnZ3JlZ2F0aW9uVmFsdWVzXG4gICAgICB9XG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBSZWN1cnNpdmVseSA9IChyb3dzLCBrZXlzLCBpID0gMCkgPT4ge1xuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgbGV2ZWwsIGp1c3QgcmV0dXJuIHRoZSByb3dzXG4gICAgICAgICAgaWYgKGkgPT09IGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcm93c1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBHcm91cCB0aGUgcm93cyB0b2dldGhlciBmb3IgdGhpcyBsZXZlbFxuICAgICAgICAgIGxldCBncm91cGVkUm93cyA9IE9iamVjdC5lbnRyaWVzKF8uZ3JvdXBCeShyb3dzLCBrZXlzW2ldKSkubWFwKChba2V5LCB2YWx1ZV0pID0+ICh7XG4gICAgICAgICAgICBbcGl2b3RJREtleV06IGtleXNbaV0sXG4gICAgICAgICAgICBbcGl2b3RWYWxLZXldOiBrZXksXG4gICAgICAgICAgICBba2V5c1tpXV06IGtleSxcbiAgICAgICAgICAgIFtzdWJSb3dzS2V5XTogdmFsdWUsXG4gICAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogaSxcbiAgICAgICAgICAgIFtncm91cGVkQnlQaXZvdEtleV06IHRydWUsXG4gICAgICAgICAgfSkpXG4gICAgICAgICAgLy8gUmVjdXJzZSBpbnRvIHRoZSBzdWJSb3dzXG4gICAgICAgICAgZ3JvdXBlZFJvd3MgPSBncm91cGVkUm93cy5tYXAocm93R3JvdXAgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3ViUm93cyA9IGdyb3VwUmVjdXJzaXZlbHkocm93R3JvdXBbc3ViUm93c0tleV0sIGtleXMsIGkgKyAxKVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucm93R3JvdXAsXG4gICAgICAgICAgICAgIFtzdWJSb3dzS2V5XTogc3ViUm93cyxcbiAgICAgICAgICAgICAgW2FnZ3JlZ2F0ZWRLZXldOiB0cnVlLFxuICAgICAgICAgICAgICAuLi5hZ2dyZWdhdGUoc3ViUm93cyksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gZ3JvdXBlZFJvd3NcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlZERhdGEgPSBncm91cFJlY3Vyc2l2ZWx5KHJlc29sdmVkRGF0YSwgcGl2b3RCeSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubmV3U3RhdGUsXG4gICAgICAgIHJlc29sdmVkRGF0YSxcbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXG4gICAgICAgIGhlYWRlckdyb3VwcyxcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcbiAgICAgICAgaGFzSGVhZGVyR3JvdXBzLFxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFNvcnRlZERhdGEgKHJlc29sdmVkU3RhdGUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFudWFsLFxuICAgICAgICBzb3J0ZWQsXG4gICAgICAgIGZpbHRlcmVkLFxuICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kLFxuICAgICAgICByZXNvbHZlZERhdGEsXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXG4gICAgICB9ID0gcmVzb2x2ZWRTdGF0ZVxuXG4gICAgICBjb25zdCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fVxuXG4gICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zXG4gICAgICAgIC5maWx0ZXIoY29sID0+IGNvbC5zb3J0TWV0aG9kKVxuICAgICAgICAuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICAgIHNvcnRNZXRob2RzQnlDb2x1bW5JRFtjb2wuaWRdID0gY29sLnNvcnRNZXRob2RcbiAgICAgICAgfSlcblxuICAgICAgLy8gUmVzb2x2ZSB0aGUgZGF0YSBmcm9tIGVpdGhlciBtYW51YWwgZGF0YSBvciBzb3J0ZWQgZGF0YVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc29ydGVkRGF0YTogbWFudWFsXG4gICAgICAgICAgPyByZXNvbHZlZERhdGFcbiAgICAgICAgICA6IHRoaXMuc29ydERhdGEoXG4gICAgICAgICAgICB0aGlzLmZpbHRlckRhdGEocmVzb2x2ZWREYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsRGVjb3JhdGVkQ29sdW1ucyksXG4gICAgICAgICAgICBzb3J0ZWQsXG4gICAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcbiAgICAgICAgICApLFxuICAgICAgfVxuICAgIH1cblxuICAgIGZpcmVGZXRjaERhdGEgKCkge1xuICAgICAgLy8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IHN0YXRlLCBwcmVmZXJyaW5nIGNlcnRhaW4gc3RhdGUgdmFsdWVzIG92ZXIgcHJvcHNcbiAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IHtcbiAgICAgICAgLi4udGhpcy5nZXRSZXNvbHZlZFN0YXRlKCksXG4gICAgICAgIHBhZ2U6IHRoaXMuZ2V0U3RhdGVPclByb3AoJ3BhZ2UnKSxcbiAgICAgICAgcGFnZVNpemU6IHRoaXMuZ2V0U3RhdGVPclByb3AoJ3BhZ2VTaXplJyksXG4gICAgICAgIGZpbHRlcjogdGhpcy5nZXRTdGF0ZU9yUHJvcCgnZmlsdGVyJyksXG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcHMub25GZXRjaERhdGEoY3VycmVudFN0YXRlLCB0aGlzKVxuICAgIH1cblxuICAgIGdldFByb3BPclN0YXRlIChrZXkpIHtcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnByb3BzW2tleV0sIHRoaXMuc3RhdGVba2V5XSlcbiAgICB9XG5cbiAgICBnZXRTdGF0ZU9yUHJvcCAoa2V5KSB7XG4gICAgICByZXR1cm4gXy5nZXRGaXJzdERlZmluZWQodGhpcy5zdGF0ZVtrZXldLCB0aGlzLnByb3BzW2tleV0pXG4gICAgfVxuXG4gICAgZmlsdGVyRGF0YSAoZGF0YSwgZmlsdGVyZWQsIGRlZmF1bHRGaWx0ZXJNZXRob2QsIGFsbFZpc2libGVDb2x1bW5zKSB7XG4gICAgICBsZXQgZmlsdGVyZWREYXRhID0gZGF0YVxuXG4gICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoKSB7XG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkLnJlZHVjZSgoZmlsdGVyZWRTb0ZhciwgbmV4dEZpbHRlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IGFsbFZpc2libGVDb2x1bW5zLmZpbmQoeCA9PiB4LmlkID09PSBuZXh0RmlsdGVyLmlkKVxuXG4gICAgICAgICAgLy8gRG9uJ3QgZmlsdGVyIGhpZGRlbiBjb2x1bW5zIG9yIGNvbHVtbnMgdGhhdCBoYXZlIGhhZCB0aGVpciBmaWx0ZXJzIGRpc2FibGVkXG4gICAgICAgICAgaWYgKCFjb2x1bW4gfHwgY29sdW1uLmZpbHRlcmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWRTb0ZhclxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGZpbHRlck1ldGhvZCA9IGNvbHVtbi5maWx0ZXJNZXRob2QgfHwgZGVmYXVsdEZpbHRlck1ldGhvZFxuXG4gICAgICAgICAgLy8gSWYgJ2ZpbHRlckFsbCcgaXMgc2V0IHRvIHRydWUsIHBhc3MgdGhlIGVudGlyZSBkYXRhc2V0IHRvIHRoZSBmaWx0ZXIgbWV0aG9kXG4gICAgICAgICAgaWYgKGNvbHVtbi5maWx0ZXJBbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJNZXRob2QobmV4dEZpbHRlciwgZmlsdGVyZWRTb0ZhciwgY29sdW1uKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmlsdGVyZWRTb0Zhci5maWx0ZXIocm93ID0+IGZpbHRlck1ldGhvZChuZXh0RmlsdGVyLCByb3csIGNvbHVtbikpXG4gICAgICAgIH0sIGZpbHRlcmVkRGF0YSlcblxuICAgICAgICAvLyBBcHBseSB0aGUgZmlsdGVyIHRvIHRoZSBzdWJyb3dzIGlmIHdlIGFyZSBwaXZvdGluZywgYW5kIHRoZW5cbiAgICAgICAgLy8gZmlsdGVyIGFueSByb3dzIHdpdGhvdXQgc3ViY29sdW1ucyBiZWNhdXNlIGl0IHdvdWxkIGJlIHN0cmFuZ2UgdG8gc2hvd1xuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGFcbiAgICAgICAgICAubWFwKHJvdyA9PiB7XG4gICAgICAgICAgICBpZiAoIXJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldKSB7XG4gICAgICAgICAgICAgIHJldHVybiByb3dcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnJvdyxcbiAgICAgICAgICAgICAgW3RoaXMucHJvcHMuc3ViUm93c0tleV06IHRoaXMuZmlsdGVyRGF0YShcbiAgICAgICAgICAgICAgICByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSxcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZCxcbiAgICAgICAgICAgICAgICBkZWZhdWx0RmlsdGVyTWV0aG9kLFxuICAgICAgICAgICAgICAgIGFsbFZpc2libGVDb2x1bW5zXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKHJvdyA9PiB7XG4gICAgICAgICAgICBpZiAoIXJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0ubGVuZ3RoID4gMFxuICAgICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaWx0ZXJlZERhdGFcbiAgICB9XG5cbiAgICBzb3J0RGF0YSAoZGF0YSwgc29ydGVkLCBzb3J0TWV0aG9kc0J5Q29sdW1uSUQgPSB7fSkge1xuICAgICAgaWYgKCFzb3J0ZWQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNvcnRlZERhdGEgPSAodGhpcy5wcm9wcy5vcmRlckJ5TWV0aG9kIHx8IF8ub3JkZXJCeSkoXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHNvcnRlZC5tYXAoc29ydCA9PiB7XG4gICAgICAgICAgLy8gU3VwcG9ydCBjdXN0b20gc29ydGluZyBtZXRob2RzIGZvciBlYWNoIGNvbHVtblxuICAgICAgICAgIGlmIChzb3J0TWV0aG9kc0J5Q29sdW1uSURbc29ydC5pZF0pIHtcbiAgICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChhLCBiKSA9PiB0aGlzLnByb3BzLmRlZmF1bHRTb3J0TWV0aG9kKGFbc29ydC5pZF0sIGJbc29ydC5pZF0sIHNvcnQuZGVzYylcbiAgICAgICAgfSksXG4gICAgICAgIHNvcnRlZC5tYXAoZCA9PiAhZC5kZXNjKSxcbiAgICAgICAgdGhpcy5wcm9wcy5pbmRleEtleVxuICAgICAgKVxuXG4gICAgICBzb3J0ZWREYXRhLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldID0gdGhpcy5zb3J0RGF0YShcbiAgICAgICAgICByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSxcbiAgICAgICAgICBzb3J0ZWQsXG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEXG4gICAgICAgIClcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBzb3J0ZWREYXRhXG4gICAgfVxuXG4gICAgZ2V0TWluUm93cyAoKSB7XG4gICAgICByZXR1cm4gXy5nZXRGaXJzdERlZmluZWQodGhpcy5wcm9wcy5taW5Sb3dzLCB0aGlzLmdldFN0YXRlT3JQcm9wKCdwYWdlU2l6ZScpKVxuICAgIH1cblxuICAgIC8vIFVzZXIgYWN0aW9uc1xuICAgIG9uUGFnZUNoYW5nZSAocGFnZSkge1xuICAgICAgY29uc3QgeyBvblBhZ2VDaGFuZ2UsIGNvbGxhcHNlT25QYWdlQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBwYWdlIH1cbiAgICAgIGlmIChjb2xsYXBzZU9uUGFnZUNoYW5nZSkge1xuICAgICAgICBuZXdTdGF0ZS5leHBhbmRlZCA9IHt9XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEobmV3U3RhdGUsICgpID0+IG9uUGFnZUNoYW5nZSAmJiBvblBhZ2VDaGFuZ2UocGFnZSkpXG4gICAgfVxuXG4gICAgb25QYWdlU2l6ZUNoYW5nZSAobmV3UGFnZVNpemUpIHtcbiAgICAgIGNvbnN0IHsgb25QYWdlU2l6ZUNoYW5nZSB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgeyBwYWdlU2l6ZSwgcGFnZSB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcblxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBwYWdlIHRvIGRpc3BsYXlcbiAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcbiAgICAgIGNvbnN0IG5ld1BhZ2UgPSBNYXRoLmZsb29yKGN1cnJlbnRSb3cgLyBuZXdQYWdlU2l6ZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZVNpemU6IG5ld1BhZ2VTaXplLFxuICAgICAgICAgIHBhZ2U6IG5ld1BhZ2UsXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IG9uUGFnZVNpemVDaGFuZ2UgJiYgb25QYWdlU2l6ZUNoYW5nZShuZXdQYWdlU2l6ZSwgbmV3UGFnZSlcbiAgICAgIClcbiAgICB9XG5cbiAgICBzb3J0Q29sdW1uIChjb2x1bW4sIGFkZGl0aXZlKSB7XG4gICAgICBjb25zdCB7IHNvcnRlZCwgc2tpcE5leHRTb3J0LCBkZWZhdWx0U29ydERlc2MgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG5cbiAgICAgIGNvbnN0IGZpcnN0U29ydERpcmVjdGlvbiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb2x1bW4sICdkZWZhdWx0U29ydERlc2MnKVxuICAgICAgICA/IGNvbHVtbi5kZWZhdWx0U29ydERlc2NcbiAgICAgICAgOiBkZWZhdWx0U29ydERlc2NcbiAgICAgIGNvbnN0IHNlY29uZFNvcnREaXJlY3Rpb24gPSAhZmlyc3RTb3J0RGlyZWN0aW9uXG5cbiAgICAgIC8vIHdlIGNhbid0IHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gZnJvbSB0aGUgY29sdW1uIHJlc2l6ZSBtb3ZlIGhhbmRsZXJzXG4gICAgICAvLyBhdHRhY2hlZCB0byB0aGUgZG9jdW1lbnQgYmVjYXVzZSBvZiByZWFjdCdzIHN5bnRoZXRpYyBldmVudHNcbiAgICAgIC8vIHNvIHdlIGhhdmUgdG8gcHJldmVudCB0aGUgc29ydCBmdW5jdGlvbiBmcm9tIGFjdHVhbGx5IHNvcnRpbmdcbiAgICAgIC8vIGlmIHdlIGNsaWNrIG9uIHRoZSBjb2x1bW4gcmVzaXplIGVsZW1lbnQgd2l0aGluIGEgaGVhZGVyLlxuICAgICAgaWYgKHNraXBOZXh0U29ydCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoe1xuICAgICAgICAgIHNraXBOZXh0U29ydDogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IG9uU29ydGVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIGxldCBuZXdTb3J0ZWQgPSBfLmNsb25lKHNvcnRlZCB8fCBbXSkubWFwKGQgPT4ge1xuICAgICAgICBkLmRlc2MgPSBfLmlzU29ydGluZ0Rlc2MoZClcbiAgICAgICAgcmV0dXJuIGRcbiAgICAgIH0pXG4gICAgICBpZiAoIV8uaXNBcnJheShjb2x1bW4pKSB7XG4gICAgICAgIC8vIFNpbmdsZS1Tb3J0XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxuICAgICAgICBpZiAoZXhpc3RpbmdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cbiAgICAgICAgICBpZiAoZXhpc3RpbmcuZGVzYyA9PT0gc2Vjb25kU29ydERpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgMSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV4aXN0aW5nLmRlc2MgPSBmaXJzdFNvcnREaXJlY3Rpb25cbiAgICAgICAgICAgICAgbmV3U29ydGVkID0gW2V4aXN0aW5nXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleGlzdGluZy5kZXNjID0gc2Vjb25kU29ydERpcmVjdGlvblxuICAgICAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xuICAgICAgICAgICAgICBuZXdTb3J0ZWQgPSBbZXhpc3RpbmddXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgICAgbmV3U29ydGVkLnB1c2goe1xuICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1NvcnRlZCA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE11bHRpLVNvcnRcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbmRleCA9IG5ld1NvcnRlZC5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBjb2x1bW5bMF0uaWQpXG4gICAgICAgIC8vIEV4aXN0aW5nIFNvcnRlZCBDb2x1bW5cbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbmV3U29ydGVkW2V4aXN0aW5nSW5kZXhdXG4gICAgICAgICAgaWYgKGV4aXN0aW5nLmRlc2MgPT09IHNlY29uZFNvcnREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgICAgICBuZXdTb3J0ZWQuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIGNvbHVtbi5sZW5ndGgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIG5ld1NvcnRlZFtleGlzdGluZ0luZGV4ICsgaV0uZGVzYyA9IGZpcnN0U29ydERpcmVjdGlvblxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2x1bW4uZm9yRWFjaCgoZCwgaSkgPT4ge1xuICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBzZWNvbmRTb3J0RGlyZWN0aW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XG4gICAgICAgICAgICBuZXdTb3J0ZWQgPSBuZXdTb3J0ZWQuc2xpY2UoZXhpc3RpbmdJbmRleCwgY29sdW1uLmxlbmd0aClcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTmV3IFNvcnQgQ29sdW1uXG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBuZXdTb3J0ZWQuY29uY2F0KFxuICAgICAgICAgICAgY29sdW1uLm1hcChkID0+ICh7XG4gICAgICAgICAgICAgIGlkOiBkLmlkLFxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3U29ydGVkID0gY29sdW1uLm1hcChkID0+ICh7XG4gICAgICAgICAgICBpZDogZC5pZCxcbiAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlOiAoIXNvcnRlZC5sZW5ndGggJiYgbmV3U29ydGVkLmxlbmd0aCkgfHwgIWFkZGl0aXZlID8gMCA6IHRoaXMuc3RhdGUucGFnZSxcbiAgICAgICAgICBzb3J0ZWQ6IG5ld1NvcnRlZCxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4gb25Tb3J0ZWRDaGFuZ2UgJiYgb25Tb3J0ZWRDaGFuZ2UobmV3U29ydGVkLCBjb2x1bW4sIGFkZGl0aXZlKVxuICAgICAgKVxuICAgIH1cblxuICAgIGZpbHRlckNvbHVtbiAoY29sdW1uLCB2YWx1ZSkge1xuICAgICAgY29uc3QgeyBmaWx0ZXJlZCB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcbiAgICAgIGNvbnN0IHsgb25GaWx0ZXJlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICAvLyBSZW1vdmUgb2xkIGZpbHRlciBmaXJzdCBpZiBpdCBleGlzdHNcbiAgICAgIGNvbnN0IG5ld0ZpbHRlcmluZyA9IChmaWx0ZXJlZCB8fCBbXSkuZmlsdGVyKHggPT4geC5pZCAhPT0gY29sdW1uLmlkKVxuXG4gICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgIG5ld0ZpbHRlcmluZy5wdXNoKHtcbiAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICBmaWx0ZXJlZDogbmV3RmlsdGVyaW5nLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiBvbkZpbHRlcmVkQ2hhbmdlICYmIG9uRmlsdGVyZWRDaGFuZ2UobmV3RmlsdGVyaW5nLCBjb2x1bW4sIHZhbHVlKVxuICAgICAgKVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbHVtblN0YXJ0IChldmVudCwgY29sdW1uLCBpc1RvdWNoKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgY29uc3QgcGFyZW50V2lkdGggPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXG4gICAgICBsZXQgcGFnZVhcbiAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgIHBhZ2VYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVhcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmFwRXZlbnRzID0gdHJ1ZVxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxuICAgICAgICB7XG4gICAgICAgICAgY3VycmVudGx5UmVzaXppbmc6IHtcbiAgICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgICBzdGFydFg6IHBhZ2VYLFxuICAgICAgICAgICAgcGFyZW50V2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXNpemVDb2x1bW5Nb3ZpbmcgKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UsIGNvbHVtbiB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgeyByZXNpemVkLCBjdXJyZW50bHlSZXNpemluZywgY29sdW1ucyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcbiAgICAgIGNvbnN0IGN1cnJlbnRDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXG4gICAgICAgIGMgPT4gYy5hY2Nlc3NvciA9PT0gY3VycmVudGx5UmVzaXppbmcuaWQgfHwgYy5pZCA9PT0gY3VycmVudGx5UmVzaXppbmcuaWRcbiAgICAgIClcbiAgICAgIGNvbnN0IG1pblJlc2l6ZVdpZHRoID1cbiAgICAgICAgY3VycmVudENvbHVtbiAmJiBjdXJyZW50Q29sdW1uLm1pblJlc2l6ZVdpZHRoICE9IG51bGxcbiAgICAgICAgICA/IGN1cnJlbnRDb2x1bW4ubWluUmVzaXplV2lkdGhcbiAgICAgICAgICA6IGNvbHVtbi5taW5SZXNpemVXaWR0aFxuXG4gICAgICAvLyBEZWxldGUgb2xkIHZhbHVlXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIoeCA9PiB4LmlkICE9PSBjdXJyZW50bHlSZXNpemluZy5pZClcblxuICAgICAgbGV0IHBhZ2VYXG5cbiAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVhcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLm1heChcbiAgICAgICAgY3VycmVudGx5UmVzaXppbmcucGFyZW50V2lkdGggKyBwYWdlWCAtIGN1cnJlbnRseVJlc2l6aW5nLnN0YXJ0WCxcbiAgICAgICAgbWluUmVzaXplV2lkdGhcbiAgICAgIClcblxuICAgICAgbmV3UmVzaXplZC5wdXNoKHtcbiAgICAgICAgaWQ6IGN1cnJlbnRseVJlc2l6aW5nLmlkLFxuICAgICAgICB2YWx1ZTogbmV3V2lkdGgsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICByZXNpemVkOiBuZXdSZXNpemVkLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiBvblJlc2l6ZWRDaGFuZ2UgJiYgb25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQsIGV2ZW50KVxuICAgICAgKVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbHVtbkVuZCAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBjb25zdCBpc1RvdWNoID0gZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudC50eXBlID09PSAndG91Y2hjYW5jZWwnXG5cbiAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdHMgYSB0b3VjaCBldmVudCBjbGVhciB0aGUgbW91c2Ugb25lJ3MgYXMgd2VsbCBiZWNhdXNlIHNvbWV0aW1lc1xuICAgICAgLy8gdGhlIG1vdXNlRG93biBldmVudCBnZXRzIGNhbGxlZCBhcyB3ZWxsLCBidXQgdGhlIG1vdXNlVXAgZXZlbnQgZG9lc24ndFxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG5cbiAgICAgIC8vIFRoZSB0b3VjaCBldmVudHMgZG9uJ3QgcHJvcGFnYXRlIHVwIHRvIHRoZSBzb3J0aW5nJ3Mgb25Nb3VzZURvd24gZXZlbnQgc29cbiAgICAgIC8vIG5vIG5lZWQgdG8gcHJldmVudCBpdCBmcm9tIGhhcHBlbmluZyBvciBlbHNlIHRoZSBmaXJzdCBjbGljayBhZnRlciBhIHRvdWNoXG4gICAgICAvLyBldmVudCByZXNpemUgd2lsbCBub3Qgc29ydCB0aGUgY29sdW1uLlxuICAgICAgaWYgKCFpc1RvdWNoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XG4gICAgICAgICAgc2tpcE5leHRTb3J0OiB0cnVlLFxuICAgICAgICAgIGN1cnJlbnRseVJlc2l6aW5nOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiJdfQ==