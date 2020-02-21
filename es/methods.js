var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import _ from './utils';

export default (function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'getResolvedState',
      value: function getResolvedState(props, state) {
        var resolvedState = _extends({}, _.compactObject(this.state), _.compactObject(this.props), _.compactObject(state), _.compactObject(props));
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
              return _.get(row, accessorString);
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
              return pivotBy.indexOf(d.id) > -1 ? false : _.getFirstDefined(d.show, true);
            });
            return _extends({}, column, {
              columns: visibleSubColumns
            });
          }
          return column;
        });

        visibleColumns = visibleColumns.filter(function (column) {
          return column.columns ? column.columns.length : pivotBy.indexOf(column.id) > -1 ? false : _.getFirstDefined(column.show, true);
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
            return React.createElement(
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
            var groupedRows = Object.entries(_.groupBy(rows, keys[i])).map(function (_ref) {
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
        return _.getFirstDefined(this.props[key], this.state[key]);
      }
    }, {
      key: 'getStateOrProp',
      value: function getStateOrProp(key) {
        return _.getFirstDefined(this.state[key], this.props[key]);
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

        var sortedData = (this.props.orderByMethod || _.orderBy)(data, sorted.map(function (sort) {
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
        return _.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'));
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


        var newSorted = _.clone(sorted || []).map(function (d) {
          d.desc = _.isSortingDesc(d);
          return d;
        });
        if (!_.isArray(column)) {
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiXyIsInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiY29tcGFjdE9iamVjdCIsIm5ld1N0YXRlIiwiZGF0YUNoYW5nZWQiLCJjb2x1bW5zIiwicGl2b3RCeSIsImRhdGEiLCJyZXNvbHZlRGF0YSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5IiwibmVzdGluZ0xldmVsS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5IiwiU3ViQ29tcG9uZW50IiwiaGFzSGVhZGVyR3JvdXBzIiwiZm9yRWFjaCIsImNvbHVtbiIsImNvbHVtbnNXaXRoRXhwYW5kZXIiLCJleHBhbmRlckNvbHVtbiIsImZpbmQiLCJjb2wiLCJleHBhbmRlciIsInNvbWUiLCJjb2wyIiwibWFrZURlY29yYXRlZENvbHVtbiIsInBhcmVudENvbHVtbiIsImRjb2wiLCJleHBhbmRlckRlZmF1bHRzIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsImdldCIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJhbGxEZWNvcmF0ZWRDb2x1bW5zIiwiZGVjb3JhdGVBbmRBZGRUb0FsbCIsImRlY29yYXRlZENvbHVtbiIsInB1c2giLCJkZWNvcmF0ZWRDb2x1bW5zIiwibWFwIiwiZCIsInZpc2libGVDb2x1bW5zIiwic2xpY2UiLCJhbGxWaXNpYmxlQ29sdW1ucyIsInZpc2libGVTdWJDb2x1bW5zIiwiZmlsdGVyIiwiaW5kZXhPZiIsImdldEZpcnN0RGVmaW5lZCIsInNob3ciLCJsZW5ndGgiLCJwaXZvdEluZGV4IiwiZmluZEluZGV4IiwicGl2b3QiLCJwaXZvdENvbHVtbnMiLCJmb3VuZCIsInBpdm90SUQiLCJQaXZvdFBhcmVudENvbHVtbiIsInJlZHVjZSIsInByZXYiLCJjdXJyZW50IiwiUGl2b3RHcm91cEhlYWRlciIsIkhlYWRlciIsInBpdm90Q29sdW1uR3JvdXAiLCJwaXZvdERlZmF1bHRzIiwicGl2b3RlZCIsInNwbGljZSIsInVuc2hpZnQiLCJoZWFkZXJHcm91cHMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsImNvbmNhdCIsImFjY2Vzc1JvdyIsImkiLCJsZXZlbCIsInJlc29sdmVkRGF0YSIsImFnZ3JlZ2F0aW5nQ29sdW1ucyIsImFnZ3JlZ2F0ZSIsImFnZ3JlZ2F0aW9uVmFsdWVzIiwidmFsdWVzIiwicm93cyIsImdyb3VwUmVjdXJzaXZlbHkiLCJrZXlzIiwiZ3JvdXBlZFJvd3MiLCJPYmplY3QiLCJlbnRyaWVzIiwiZ3JvdXBCeSIsImtleSIsInZhbHVlIiwic3ViUm93cyIsInJvd0dyb3VwIiwibWFudWFsIiwic29ydGVkIiwiZmlsdGVyZWQiLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwic29ydE1ldGhvZHNCeUNvbHVtbklEIiwic29ydE1ldGhvZCIsInNvcnRlZERhdGEiLCJzb3J0RGF0YSIsImZpbHRlckRhdGEiLCJjdXJyZW50U3RhdGUiLCJnZXRSZXNvbHZlZFN0YXRlIiwicGFnZSIsImdldFN0YXRlT3JQcm9wIiwicGFnZVNpemUiLCJvbkZldGNoRGF0YSIsImZpbHRlcmVkRGF0YSIsImZpbHRlcmVkU29GYXIiLCJuZXh0RmlsdGVyIiwieCIsImZpbHRlcmFibGUiLCJmaWx0ZXJNZXRob2QiLCJmaWx0ZXJBbGwiLCJvcmRlckJ5TWV0aG9kIiwib3JkZXJCeSIsInNvcnQiLCJhIiwiYiIsImRlc2MiLCJkZWZhdWx0U29ydE1ldGhvZCIsIm1pblJvd3MiLCJvblBhZ2VDaGFuZ2UiLCJjb2xsYXBzZU9uUGFnZUNoYW5nZSIsImV4cGFuZGVkIiwic2V0U3RhdGVXaXRoRGF0YSIsIm5ld1BhZ2VTaXplIiwib25QYWdlU2l6ZUNoYW5nZSIsImN1cnJlbnRSb3ciLCJuZXdQYWdlIiwiTWF0aCIsImZsb29yIiwiYWRkaXRpdmUiLCJza2lwTmV4dFNvcnQiLCJkZWZhdWx0U29ydERlc2MiLCJmaXJzdFNvcnREaXJlY3Rpb24iLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJzZWNvbmRTb3J0RGlyZWN0aW9uIiwib25Tb3J0ZWRDaGFuZ2UiLCJuZXdTb3J0ZWQiLCJjbG9uZSIsImlzU29ydGluZ0Rlc2MiLCJpc0FycmF5IiwiZXhpc3RpbmdJbmRleCIsImV4aXN0aW5nIiwib25GaWx0ZXJlZENoYW5nZSIsIm5ld0ZpbHRlcmluZyIsImV2ZW50IiwiaXNUb3VjaCIsInN0b3BQcm9wYWdhdGlvbiIsInBhcmVudFdpZHRoIiwidGFyZ2V0IiwicGFyZW50RWxlbWVudCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndpZHRoIiwicGFnZVgiLCJjaGFuZ2VkVG91Y2hlcyIsInRyYXBFdmVudHMiLCJjdXJyZW50bHlSZXNpemluZyIsInN0YXJ0WCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZUNvbHVtbk1vdmluZyIsInJlc2l6ZUNvbHVtbkVuZCIsIm9uUmVzaXplZENoYW5nZSIsInJlc2l6ZWQiLCJjdXJyZW50Q29sdW1uIiwiYyIsIm1pblJlc2l6ZVdpZHRoIiwibmV3UmVzaXplZCIsInR5cGUiLCJuZXdXaWR0aCIsIm1heCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixPQUFsQjtBQUNBLE9BQU9DLENBQVAsTUFBYyxTQUFkOztBQUVBLGdCQUFlO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLHVDQUVPQyxLQUZQLEVBRWNDLEtBRmQsRUFFcUI7QUFDOUIsWUFBTUMsNkJBQ0RILEVBQUVJLGFBQUYsQ0FBZ0IsS0FBS0YsS0FBckIsQ0FEQyxFQUVERixFQUFFSSxhQUFGLENBQWdCLEtBQUtILEtBQXJCLENBRkMsRUFHREQsRUFBRUksYUFBRixDQUFnQkYs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QixJQUREO0FBQUEsQ0FBZiIsImZpbGUiOiJtZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxuICBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICAgIGdldFJlc29sdmVkU3RhdGUgKHByb3BzLCBzdGF0ZSkge1xuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHtcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMuc3RhdGUpLFxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5wcm9wcyksXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChzdGF0ZSksXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChwcm9wcyksXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZWRTdGF0ZVxuICAgIH1cblxuICAgIGdldERhdGFNb2RlbCAobmV3U3RhdGUsIGRhdGFDaGFuZ2VkKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIHBpdm90QnkgPSBbXSxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcmVzb2x2ZURhdGEsXG4gICAgICAgIHBpdm90SURLZXksXG4gICAgICAgIHBpdm90VmFsS2V5LFxuICAgICAgICBzdWJSb3dzS2V5LFxuICAgICAgICBhZ2dyZWdhdGVkS2V5LFxuICAgICAgICBuZXN0aW5nTGV2ZWxLZXksXG4gICAgICAgIG9yaWdpbmFsS2V5LFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZ3JvdXBlZEJ5UGl2b3RLZXksXG4gICAgICAgIFN1YkNvbXBvbmVudCxcbiAgICAgIH0gPSBuZXdTdGF0ZVxuXG4gICAgICAvLyBEZXRlcm1pbmUgSGVhZGVyIEdyb3Vwc1xuICAgICAgbGV0IGhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXG4gICAgICBjb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgICAgaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgY29sdW1uc1dpdGhFeHBhbmRlciA9IFsuLi5jb2x1bW5zXVxuXG4gICAgICBsZXQgZXhwYW5kZXJDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXG4gICAgICAgIGNvbCA9PiBjb2wuZXhwYW5kZXIgfHwgKGNvbC5jb2x1bW5zICYmIGNvbC5jb2x1bW5zLnNvbWUoY29sMiA9PiBjb2wyLmV4cGFuZGVyKSlcbiAgICAgIClcbiAgICAgIC8vIFRoZSBhY3R1YWwgZXhwYW5kZXIgbWlnaHQgYmUgaW4gdGhlIGNvbHVtbnMgZmllbGQgb2YgYSBncm91cCBjb2x1bW5cbiAgICAgIGlmIChleHBhbmRlckNvbHVtbiAmJiAhZXhwYW5kZXJDb2x1bW4uZXhwYW5kZXIpIHtcbiAgICAgICAgZXhwYW5kZXJDb2x1bW4gPSBleHBhbmRlckNvbHVtbi5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5leHBhbmRlcilcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBTdWJDb21wb25lbnQncyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGV4cGFuZGVyIGNvbHVtblxuICAgICAgaWYgKFN1YkNvbXBvbmVudCAmJiAhZXhwYW5kZXJDb2x1bW4pIHtcbiAgICAgICAgZXhwYW5kZXJDb2x1bW4gPSB7IGV4cGFuZGVyOiB0cnVlIH1cbiAgICAgICAgY29sdW1uc1dpdGhFeHBhbmRlciA9IFtleHBhbmRlckNvbHVtbiwgLi4uY29sdW1uc1dpdGhFeHBhbmRlcl1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xuICAgICAgICBsZXQgZGNvbFxuICAgICAgICBpZiAoY29sdW1uLmV4cGFuZGVyKSB7XG4gICAgICAgICAgZGNvbCA9IHtcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5leHBhbmRlckRlZmF1bHRzLFxuICAgICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkY29sID0ge1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlIG1pbldpZHRoIGlzIG5vdCBncmVhdGVyIHRoYW4gbWF4V2lkdGggaWYgc2V0XG4gICAgICAgIGlmIChkY29sLm1heFdpZHRoIDwgZGNvbC5taW5XaWR0aCkge1xuICAgICAgICAgIGRjb2wubWluV2lkdGggPSBkY29sLm1heFdpZHRoXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50Q29sdW1uKSB7XG4gICAgICAgICAgZGNvbC5wYXJlbnRDb2x1bW4gPSBwYXJlbnRDb2x1bW5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGZvciBzdHJpbmcgYWNjZXNzb3JcbiAgICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGRjb2wuaWQgPSBkY29sLmlkIHx8IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgICBjb25zdCBhY2Nlc3NvclN0cmluZyA9IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXG4gICAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBmdW5jdGlvbmFsIGFjY2Vzc29yIChidXQgcmVxdWlyZSBhbiBJRClcbiAgICAgICAgaWYgKGRjb2wuYWNjZXNzb3IgJiYgIWRjb2wuaWQpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQSBjb2x1bW4gaWQgaXMgcmVxdWlyZWQgaWYgdXNpbmcgYSBub24tc3RyaW5nIGFjY2Vzc29yIGZvciBjb2x1bW4gYWJvdmUuJ1xuICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBhbiB1bmRlZmluZWQgYWNjZXNzb3JcbiAgICAgICAgaWYgKCFkY29sLmFjY2Vzc29yKSB7XG4gICAgICAgICAgZGNvbC5hY2Nlc3NvciA9ICgpID0+IHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsRGVjb3JhdGVkQ29sdW1ucyA9IFtdXG5cbiAgICAgIC8vIERlY29yYXRlIHRoZSBjb2x1bW5zXG4gICAgICBjb25zdCBkZWNvcmF0ZUFuZEFkZFRvQWxsID0gKGNvbHVtbiwgcGFyZW50Q29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbiA9IG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uLCBwYXJlbnRDb2x1bW4pXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMucHVzaChkZWNvcmF0ZWRDb2x1bW4pXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZWRDb2x1bW5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoRXhwYW5kZXIubWFwKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW4uY29sdW1ucy5tYXAoZCA9PiBkZWNvcmF0ZUFuZEFkZFRvQWxsKGQsIGNvbHVtbikpLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmRBZGRUb0FsbChjb2x1bW4pXG4gICAgICB9KVxuXG4gICAgICAvLyBCdWlsZCB0aGUgdmlzaWJsZSBjb2x1bW5zLCBoZWFkZXJzIGFuZCBmbGF0IGNvbHVtbiBsaXN0XG4gICAgICBsZXQgdmlzaWJsZUNvbHVtbnMgPSBkZWNvcmF0ZWRDb2x1bW5zLnNsaWNlKClcbiAgICAgIGxldCBhbGxWaXNpYmxlQ29sdW1ucyA9IFtdXG5cbiAgICAgIHZpc2libGVDb2x1bW5zID0gdmlzaWJsZUNvbHVtbnMubWFwKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIGNvbnN0IHZpc2libGVTdWJDb2x1bW5zID0gY29sdW1uLmNvbHVtbnMuZmlsdGVyKGQgPT5cbiAgICAgICAgICAgIHBpdm90QnkuaW5kZXhPZihkLmlkKSA+IC0xID8gZmFsc2UgOiBfLmdldEZpcnN0RGVmaW5lZChkLnNob3csIHRydWUpXG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgICBjb2x1bW5zOiB2aXNpYmxlU3ViQ29sdW1ucyxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHVtblxuICAgICAgfSlcblxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5maWx0ZXIoY29sdW1uID0+XG4gICAgICAgIGNvbHVtbi5jb2x1bW5zXG4gICAgICAgICAgPyBjb2x1bW4uY29sdW1ucy5sZW5ndGhcbiAgICAgICAgICA6IHBpdm90QnkuaW5kZXhPZihjb2x1bW4uaWQpID4gLTFcbiAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgIDogXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLnNob3csIHRydWUpXG4gICAgICApXG5cbiAgICAgIC8vIEZpbmQgYW55IGN1c3RvbSBwaXZvdCBsb2NhdGlvblxuICAgICAgY29uc3QgcGl2b3RJbmRleCA9IHZpc2libGVDb2x1bW5zLmZpbmRJbmRleChjb2wgPT4gY29sLnBpdm90KVxuXG4gICAgICAvLyBIYW5kbGUgUGl2b3QgQ29sdW1uc1xuICAgICAgaWYgKHBpdm90QnkubGVuZ3RoKSB7XG4gICAgICAgIC8vIFJldHJpZXZlIHRoZSBwaXZvdCBjb2x1bW5zIGluIHRoZSBjb3JyZWN0IHBpdm90IG9yZGVyXG4gICAgICAgIGNvbnN0IHBpdm90Q29sdW1ucyA9IFtdXG4gICAgICAgIHBpdm90QnkuZm9yRWFjaChwaXZvdElEID0+IHtcbiAgICAgICAgICBjb25zdCBmb3VuZCA9IGFsbERlY29yYXRlZENvbHVtbnMuZmluZChkID0+IGQuaWQgPT09IHBpdm90SUQpXG4gICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBwaXZvdENvbHVtbnMucHVzaChmb3VuZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgUGl2b3RQYXJlbnRDb2x1bW4gPSBwaXZvdENvbHVtbnMucmVkdWNlKFxuICAgICAgICAgIChwcmV2LCBjdXJyZW50KSA9PiBwcmV2ICYmIHByZXYgPT09IGN1cnJlbnQucGFyZW50Q29sdW1uICYmIGN1cnJlbnQucGFyZW50Q29sdW1uLFxuICAgICAgICAgIHBpdm90Q29sdW1uc1swXS5wYXJlbnRDb2x1bW5cbiAgICAgICAgKVxuXG4gICAgICAgIGxldCBQaXZvdEdyb3VwSGVhZGVyID0gaGFzSGVhZGVyR3JvdXBzICYmIFBpdm90UGFyZW50Q29sdW1uLkhlYWRlclxuICAgICAgICBQaXZvdEdyb3VwSGVhZGVyID0gUGl2b3RHcm91cEhlYWRlciB8fCAoKCkgPT4gPHN0cm9uZz5QaXZvdGVkPC9zdHJvbmc+KVxuXG4gICAgICAgIGxldCBwaXZvdENvbHVtbkdyb3VwID0ge1xuICAgICAgICAgIEhlYWRlcjogUGl2b3RHcm91cEhlYWRlcixcbiAgICAgICAgICBjb2x1bW5zOiBwaXZvdENvbHVtbnMubWFwKGNvbCA9PiAoe1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5waXZvdERlZmF1bHRzLFxuICAgICAgICAgICAgLi4uY29sLFxuICAgICAgICAgICAgcGl2b3RlZDogdHJ1ZSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBQbGFjZSB0aGUgcGl2b3RDb2x1bW5zIGJhY2sgaW50byB0aGUgdmlzaWJsZUNvbHVtbnNcbiAgICAgICAgaWYgKHBpdm90SW5kZXggPj0gMCkge1xuICAgICAgICAgIHBpdm90Q29sdW1uR3JvdXAgPSB7XG4gICAgICAgICAgICAuLi52aXNpYmxlQ29sdW1uc1twaXZvdEluZGV4XSxcbiAgICAgICAgICAgIC4uLnBpdm90Q29sdW1uR3JvdXAsXG4gICAgICAgICAgfVxuICAgICAgICAgIHZpc2libGVDb2x1bW5zLnNwbGljZShwaXZvdEluZGV4LCAxLCBwaXZvdENvbHVtbkdyb3VwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpc2libGVDb2x1bW5zLnVuc2hpZnQocGl2b3RDb2x1bW5Hcm91cClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCBIZWFkZXIgR3JvdXBzXG4gICAgICBjb25zdCBoZWFkZXJHcm91cHMgPSBbXVxuICAgICAgbGV0IGN1cnJlbnRTcGFuID0gW11cblxuICAgICAgLy8gQSBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBhZGQgYSBoZWFkZXIgYW5kIHJlc2V0IHRoZSBjdXJyZW50U3BhblxuICAgICAgY29uc3QgYWRkSGVhZGVyID0gKGNvbHVtbnMsIGNvbHVtbikgPT4ge1xuICAgICAgICBoZWFkZXJHcm91cHMucHVzaCh7XG4gICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXG4gICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgIGNvbHVtbnMsXG4gICAgICAgIH0pXG4gICAgICAgIGN1cnJlbnRTcGFuID0gW11cbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgZmxhc3QgbGlzdCBvZiBhbGxWaXNpYmxlQ29sdW1ucyBhbmQgSGVhZGVyR3JvdXBzXG4gICAgICB2aXNpYmxlQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIGFsbFZpc2libGVDb2x1bW5zID0gYWxsVmlzaWJsZUNvbHVtbnMuY29uY2F0KGNvbHVtbi5jb2x1bW5zKVxuICAgICAgICAgIGlmIChjdXJyZW50U3Bhbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZEhlYWRlcihjb2x1bW4uY29sdW1ucywgY29sdW1uKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLnB1c2goY29sdW1uKVxuICAgICAgICBjdXJyZW50U3Bhbi5wdXNoKGNvbHVtbilcbiAgICAgIH0pXG4gICAgICBpZiAoaGFzSGVhZGVyR3JvdXBzICYmIGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWRkSGVhZGVyKGN1cnJlbnRTcGFuKVxuICAgICAgfVxuXG4gICAgICAvLyBBY2Nlc3MgdGhlIGRhdGFcbiAgICAgIGNvbnN0IGFjY2Vzc1JvdyA9IChkLCBpLCBsZXZlbCA9IDApID0+IHtcbiAgICAgICAgY29uc3Qgcm93ID0ge1xuICAgICAgICAgIFtvcmlnaW5hbEtleV06IGQsXG4gICAgICAgICAgW2luZGV4S2V5XTogaSxcbiAgICAgICAgICBbc3ViUm93c0tleV06IGRbc3ViUm93c0tleV0sXG4gICAgICAgICAgW25lc3RpbmdMZXZlbEtleV06IGxldmVsLFxuICAgICAgICB9XG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgIGlmIChjb2x1bW4uZXhwYW5kZXIpIHJldHVyblxuICAgICAgICAgIHJvd1tjb2x1bW4uaWRdID0gY29sdW1uLmFjY2Vzc29yKGQpXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChyb3dbc3ViUm93c0tleV0pIHtcbiAgICAgICAgICByb3dbc3ViUm93c0tleV0gPSByb3dbc3ViUm93c0tleV0ubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSwgbGV2ZWwgKyAxKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93XG4gICAgICB9XG5cbiAgICAgIC8vIC8vIElmIHRoZSBkYXRhIGhhc24ndCBjaGFuZ2VkLCBqdXN0IHVzZSB0aGUgY2FjaGVkIGRhdGFcbiAgICAgIGxldCByZXNvbHZlZERhdGEgPSB0aGlzLnJlc29sdmVkRGF0YVxuICAgICAgLy8gSWYgdGhlIGRhdGEgaGFzIGNoYW5nZWQsIHJ1biB0aGUgZGF0YSByZXNvbHZlciBhbmQgY2FjaGUgdGhlIHJlc3VsdFxuICAgICAgaWYgKCF0aGlzLnJlc29sdmVkRGF0YSB8fCBkYXRhQ2hhbmdlZCkge1xuICAgICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlRGF0YShkYXRhKVxuICAgICAgICB0aGlzLnJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YVxuICAgICAgfVxuICAgICAgLy8gVXNlIHRoZSByZXNvbHZlZCBkYXRhXG4gICAgICByZXNvbHZlZERhdGEgPSByZXNvbHZlZERhdGEubWFwKChkLCBpKSA9PiBhY2Nlc3NSb3coZCwgaSkpXG5cbiAgICAgIC8vIFRPRE86IE1ha2UgaXQgcG9zc2libGUgdG8gZmFicmljYXRlIG5lc3RlZCByb3dzIHdpdGhvdXQgcGl2b3RpbmdcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0aW5nQ29sdW1ucyA9IGFsbFZpc2libGVDb2x1bW5zLmZpbHRlcihkID0+ICFkLmV4cGFuZGVyICYmIGQuYWdncmVnYXRlKVxuXG4gICAgICAvLyBJZiBwaXZvdGluZywgcmVjdXJzaXZlbHkgZ3JvdXAgdGhlIGRhdGFcbiAgICAgIGNvbnN0IGFnZ3JlZ2F0ZSA9IHJvd3MgPT4ge1xuICAgICAgICBjb25zdCBhZ2dyZWdhdGlvblZhbHVlcyA9IHt9XG4gICAgICAgIGFnZ3JlZ2F0aW5nQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gcm93cy5tYXAoZCA9PiBkW2NvbHVtbi5pZF0pXG4gICAgICAgICAgYWdncmVnYXRpb25WYWx1ZXNbY29sdW1uLmlkXSA9IGNvbHVtbi5hZ2dyZWdhdGUodmFsdWVzLCByb3dzKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gYWdncmVnYXRpb25WYWx1ZXNcbiAgICAgIH1cbiAgICAgIGlmIChwaXZvdEJ5Lmxlbmd0aCkge1xuICAgICAgICBjb25zdCBncm91cFJlY3Vyc2l2ZWx5ID0gKHJvd3MsIGtleXMsIGkgPSAwKSA9PiB7XG4gICAgICAgICAgLy8gVGhpcyBpcyB0aGUgbGFzdCBsZXZlbCwganVzdCByZXR1cm4gdGhlIHJvd3NcbiAgICAgICAgICBpZiAoaSA9PT0ga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiByb3dzXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEdyb3VwIHRoZSByb3dzIHRvZ2V0aGVyIGZvciB0aGlzIGxldmVsXG4gICAgICAgICAgbGV0IGdyb3VwZWRSb3dzID0gT2JqZWN0LmVudHJpZXMoXy5ncm91cEJ5KHJvd3MsIGtleXNbaV0pKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcbiAgICAgICAgICAgIFtwaXZvdElES2V5XToga2V5c1tpXSxcbiAgICAgICAgICAgIFtwaXZvdFZhbEtleV06IGtleSxcbiAgICAgICAgICAgIFtrZXlzW2ldXToga2V5LFxuICAgICAgICAgICAgW3N1YlJvd3NLZXldOiB2YWx1ZSxcbiAgICAgICAgICAgIFtuZXN0aW5nTGV2ZWxLZXldOiBpLFxuICAgICAgICAgICAgW2dyb3VwZWRCeVBpdm90S2V5XTogdHJ1ZSxcbiAgICAgICAgICB9KSlcbiAgICAgICAgICAvLyBSZWN1cnNlIGludG8gdGhlIHN1YlJvd3NcbiAgICAgICAgICBncm91cGVkUm93cyA9IGdyb3VwZWRSb3dzLm1hcChyb3dHcm91cCA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJSb3dzID0gZ3JvdXBSZWN1cnNpdmVseShyb3dHcm91cFtzdWJSb3dzS2V5XSwga2V5cywgaSArIDEpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5yb3dHcm91cCxcbiAgICAgICAgICAgICAgW3N1YlJvd3NLZXldOiBzdWJSb3dzLFxuICAgICAgICAgICAgICBbYWdncmVnYXRlZEtleV06IHRydWUsXG4gICAgICAgICAgICAgIC4uLmFnZ3JlZ2F0ZShzdWJSb3dzKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBncm91cGVkUm93c1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmVkRGF0YSA9IGdyb3VwUmVjdXJzaXZlbHkocmVzb2x2ZWREYXRhLCBwaXZvdEJ5KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5uZXdTdGF0ZSxcbiAgICAgICAgcmVzb2x2ZWREYXRhLFxuICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucyxcbiAgICAgICAgaGVhZGVyR3JvdXBzLFxuICAgICAgICBhbGxEZWNvcmF0ZWRDb2x1bW5zLFxuICAgICAgICBoYXNIZWFkZXJHcm91cHMsXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U29ydGVkRGF0YSAocmVzb2x2ZWRTdGF0ZSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBtYW51YWwsXG4gICAgICAgIHNvcnRlZCxcbiAgICAgICAgZmlsdGVyZWQsXG4gICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXG4gICAgICAgIHJlc29sdmVkRGF0YSxcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcbiAgICAgIH0gPSByZXNvbHZlZFN0YXRlXG5cbiAgICAgIGNvbnN0IHNvcnRNZXRob2RzQnlDb2x1bW5JRCA9IHt9XG5cbiAgICAgIGFsbERlY29yYXRlZENvbHVtbnNcbiAgICAgICAgLmZpbHRlcihjb2wgPT4gY29sLnNvcnRNZXRob2QpXG4gICAgICAgIC5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgICAgc29ydE1ldGhvZHNCeUNvbHVtbklEW2NvbC5pZF0gPSBjb2wuc29ydE1ldGhvZFxuICAgICAgICB9KVxuXG4gICAgICAvLyBSZXNvbHZlIHRoZSBkYXRhIGZyb20gZWl0aGVyIG1hbnVhbCBkYXRhIG9yIHNvcnRlZCBkYXRhXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzb3J0ZWREYXRhOiBtYW51YWxcbiAgICAgICAgICA/IHJlc29sdmVkRGF0YVxuICAgICAgICAgIDogdGhpcy5zb3J0RGF0YShcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyRGF0YShyZXNvbHZlZERhdGEsIGZpbHRlcmVkLCBkZWZhdWx0RmlsdGVyTWV0aG9kLCBhbGxEZWNvcmF0ZWRDb2x1bW5zKSxcbiAgICAgICAgICAgIHNvcnRlZCxcbiAgICAgICAgICAgIHNvcnRNZXRob2RzQnlDb2x1bW5JRFxuICAgICAgICAgICksXG4gICAgICB9XG4gICAgfVxuXG4gICAgZmlyZUZldGNoRGF0YSAoKSB7XG4gICAgICAvLyBkZXRlcm1pbmUgdGhlIGN1cnJlbnQgc3RhdGUsIHByZWZlcnJpbmcgY2VydGFpbiBzdGF0ZSB2YWx1ZXMgb3ZlciBwcm9wc1xuICAgICAgY29uc3QgY3VycmVudFN0YXRlID0ge1xuICAgICAgICAuLi50aGlzLmdldFJlc29sdmVkU3RhdGUoKSxcbiAgICAgICAgcGFnZTogdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZScpLFxuICAgICAgICBwYWdlU2l6ZTogdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZVNpemUnKSxcbiAgICAgICAgZmlsdGVyOiB0aGlzLmdldFN0YXRlT3JQcm9wKCdmaWx0ZXInKSxcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy5vbkZldGNoRGF0YShjdXJyZW50U3RhdGUsIHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0UHJvcE9yU3RhdGUgKGtleSkge1xuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHNba2V5XSwgdGhpcy5zdGF0ZVtrZXldKVxuICAgIH1cblxuICAgIGdldFN0YXRlT3JQcm9wIChrZXkpIHtcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnN0YXRlW2tleV0sIHRoaXMucHJvcHNba2V5XSlcbiAgICB9XG5cbiAgICBmaWx0ZXJEYXRhIChkYXRhLCBmaWx0ZXJlZCwgZGVmYXVsdEZpbHRlck1ldGhvZCwgYWxsVmlzaWJsZUNvbHVtbnMpIHtcbiAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSBkYXRhXG5cbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGgpIHtcbiAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWQucmVkdWNlKChmaWx0ZXJlZFNvRmFyLCBuZXh0RmlsdGVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29sdW1uID0gYWxsVmlzaWJsZUNvbHVtbnMuZmluZCh4ID0+IHguaWQgPT09IG5leHRGaWx0ZXIuaWQpXG5cbiAgICAgICAgICAvLyBEb24ndCBmaWx0ZXIgaGlkZGVuIGNvbHVtbnMgb3IgY29sdW1ucyB0aGF0IGhhdmUgaGFkIHRoZWlyIGZpbHRlcnMgZGlzYWJsZWRcbiAgICAgICAgICBpZiAoIWNvbHVtbiB8fCBjb2x1bW4uZmlsdGVyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZmlsdGVyTWV0aG9kID0gY29sdW1uLmZpbHRlck1ldGhvZCB8fCBkZWZhdWx0RmlsdGVyTWV0aG9kXG5cbiAgICAgICAgICAvLyBJZiAnZmlsdGVyQWxsJyBpcyBzZXQgdG8gdHJ1ZSwgcGFzcyB0aGUgZW50aXJlIGRhdGFzZXQgdG8gdGhlIGZpbHRlciBtZXRob2RcbiAgICAgICAgICBpZiAoY29sdW1uLmZpbHRlckFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlck1ldGhvZChuZXh0RmlsdGVyLCBmaWx0ZXJlZFNvRmFyLCBjb2x1bW4pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmaWx0ZXJlZFNvRmFyLmZpbHRlcihyb3cgPT4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIHJvdywgY29sdW1uKSlcbiAgICAgICAgfSwgZmlsdGVyZWREYXRhKVxuXG4gICAgICAgIC8vIEFwcGx5IHRoZSBmaWx0ZXIgdG8gdGhlIHN1YnJvd3MgaWYgd2UgYXJlIHBpdm90aW5nLCBhbmQgdGhlblxuICAgICAgICAvLyBmaWx0ZXIgYW55IHJvd3Mgd2l0aG91dCBzdWJjb2x1bW5zIGJlY2F1c2UgaXQgd291bGQgYmUgc3RyYW5nZSB0byBzaG93XG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YVxuICAgICAgICAgIC5tYXAocm93ID0+IHtcbiAgICAgICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJvd1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ucm93LFxuICAgICAgICAgICAgICBbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XTogdGhpcy5maWx0ZXJEYXRhKFxuICAgICAgICAgICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLFxuICAgICAgICAgICAgICAgIGZpbHRlcmVkLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXJNZXRob2QsXG4gICAgICAgICAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnNcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIocm93ID0+IHtcbiAgICAgICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XS5sZW5ndGggPiAwXG4gICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpbHRlcmVkRGF0YVxuICAgIH1cblxuICAgIHNvcnREYXRhIChkYXRhLCBzb3J0ZWQsIHNvcnRNZXRob2RzQnlDb2x1bW5JRCA9IHt9KSB7XG4gICAgICBpZiAoIXNvcnRlZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc29ydGVkRGF0YSA9ICh0aGlzLnByb3BzLm9yZGVyQnlNZXRob2QgfHwgXy5vcmRlckJ5KShcbiAgICAgICAgZGF0YSxcbiAgICAgICAgc29ydGVkLm1hcChzb3J0ID0+IHtcbiAgICAgICAgICAvLyBTdXBwb3J0IGN1c3RvbSBzb3J0aW5nIG1ldGhvZHMgZm9yIGVhY2ggY29sdW1uXG4gICAgICAgICAgaWYgKHNvcnRNZXRob2RzQnlDb2x1bW5JRFtzb3J0LmlkXSkge1xuICAgICAgICAgICAgcmV0dXJuIChhLCBiKSA9PiBzb3J0TWV0aG9kc0J5Q29sdW1uSURbc29ydC5pZF0oYVtzb3J0LmlkXSwgYltzb3J0LmlkXSwgc29ydC5kZXNjKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKGEsIGIpID0+IHRoaXMucHJvcHMuZGVmYXVsdFNvcnRNZXRob2QoYVtzb3J0LmlkXSwgYltzb3J0LmlkXSwgc29ydC5kZXNjKVxuICAgICAgICB9KSxcbiAgICAgICAgc29ydGVkLm1hcChkID0+ICFkLmRlc2MpLFxuICAgICAgICB0aGlzLnByb3BzLmluZGV4S2V5XG4gICAgICApXG5cbiAgICAgIHNvcnRlZERhdGEuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICBpZiAoIXJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0gPSB0aGlzLnNvcnREYXRhKFxuICAgICAgICAgIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLFxuICAgICAgICAgIHNvcnRlZCxcbiAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHNvcnRlZERhdGFcbiAgICB9XG5cbiAgICBnZXRNaW5Sb3dzICgpIHtcbiAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZCh0aGlzLnByb3BzLm1pblJvd3MsIHRoaXMuZ2V0U3RhdGVPclByb3AoJ3BhZ2VTaXplJykpXG4gICAgfVxuXG4gICAgLy8gVXNlciBhY3Rpb25zXG4gICAgb25QYWdlQ2hhbmdlIChwYWdlKSB7XG4gICAgICBjb25zdCB7IG9uUGFnZUNoYW5nZSwgY29sbGFwc2VPblBhZ2VDaGFuZ2UgfSA9IHRoaXMucHJvcHNcblxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB7IHBhZ2UgfVxuICAgICAgaWYgKGNvbGxhcHNlT25QYWdlQ2hhbmdlKSB7XG4gICAgICAgIG5ld1N0YXRlLmV4cGFuZGVkID0ge31cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShuZXdTdGF0ZSwgKCkgPT4gb25QYWdlQ2hhbmdlICYmIG9uUGFnZUNoYW5nZShwYWdlKSlcbiAgICB9XG5cbiAgICBvblBhZ2VTaXplQ2hhbmdlIChuZXdQYWdlU2l6ZSkge1xuICAgICAgY29uc3QgeyBvblBhZ2VTaXplQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCB7IHBhZ2VTaXplLCBwYWdlIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuXG4gICAgICAvLyBOb3JtYWxpemUgdGhlIHBhZ2UgdG8gZGlzcGxheVxuICAgICAgY29uc3QgY3VycmVudFJvdyA9IHBhZ2VTaXplICogcGFnZVxuICAgICAgY29uc3QgbmV3UGFnZSA9IE1hdGguZmxvb3IoY3VycmVudFJvdyAvIG5ld1BhZ2VTaXplKVxuXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlU2l6ZTogbmV3UGFnZVNpemUsXG4gICAgICAgICAgcGFnZTogbmV3UGFnZSxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4gb25QYWdlU2l6ZUNoYW5nZSAmJiBvblBhZ2VTaXplQ2hhbmdlKG5ld1BhZ2VTaXplLCBuZXdQYWdlKVxuICAgICAgKVxuICAgIH1cblxuICAgIHNvcnRDb2x1bW4gKGNvbHVtbiwgYWRkaXRpdmUpIHtcbiAgICAgIGNvbnN0IHsgc29ydGVkLCBza2lwTmV4dFNvcnQsIGRlZmF1bHRTb3J0RGVzYyB9ID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcblxuICAgICAgY29uc3QgZmlyc3RTb3J0RGlyZWN0aW9uID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbHVtbiwgJ2RlZmF1bHRTb3J0RGVzYycpXG4gICAgICAgID8gY29sdW1uLmRlZmF1bHRTb3J0RGVzY1xuICAgICAgICA6IGRlZmF1bHRTb3J0RGVzY1xuICAgICAgY29uc3Qgc2Vjb25kU29ydERpcmVjdGlvbiA9ICFmaXJzdFNvcnREaXJlY3Rpb25cblxuICAgICAgLy8gd2UgY2FuJ3Qgc3RvcCBldmVudCBwcm9wYWdhdGlvbiBmcm9tIHRoZSBjb2x1bW4gcmVzaXplIG1vdmUgaGFuZGxlcnNcbiAgICAgIC8vIGF0dGFjaGVkIHRvIHRoZSBkb2N1bWVudCBiZWNhdXNlIG9mIHJlYWN0J3Mgc3ludGhldGljIGV2ZW50c1xuICAgICAgLy8gc28gd2UgaGF2ZSB0byBwcmV2ZW50IHRoZSBzb3J0IGZ1bmN0aW9uIGZyb20gYWN0dWFsbHkgc29ydGluZ1xuICAgICAgLy8gaWYgd2UgY2xpY2sgb24gdGhlIGNvbHVtbiByZXNpemUgZWxlbWVudCB3aXRoaW4gYSBoZWFkZXIuXG4gICAgICBpZiAoc2tpcE5leHRTb3J0KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XG4gICAgICAgICAgc2tpcE5leHRTb3J0OiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgb25Tb3J0ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcblxuICAgICAgbGV0IG5ld1NvcnRlZCA9IF8uY2xvbmUoc29ydGVkIHx8IFtdKS5tYXAoZCA9PiB7XG4gICAgICAgIGQuZGVzYyA9IF8uaXNTb3J0aW5nRGVzYyhkKVxuICAgICAgICByZXR1cm4gZFxuICAgICAgfSlcbiAgICAgIGlmICghXy5pc0FycmF5KGNvbHVtbikpIHtcbiAgICAgICAgLy8gU2luZ2xlLVNvcnRcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbmRleCA9IG5ld1NvcnRlZC5maW5kSW5kZXgoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBleGlzdGluZyA9IG5ld1NvcnRlZFtleGlzdGluZ0luZGV4XVxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICAgICAgbmV3U29ydGVkLnNwbGljZShleGlzdGluZ0luZGV4LCAxKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IGZpcnN0U29ydERpcmVjdGlvblxuICAgICAgICAgICAgICBuZXdTb3J0ZWQgPSBbZXhpc3RpbmddXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4aXN0aW5nLmRlc2MgPSBzZWNvbmRTb3J0RGlyZWN0aW9uXG4gICAgICAgICAgICBpZiAoIWFkZGl0aXZlKSB7XG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICBuZXdTb3J0ZWQucHVzaCh7XG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3U29ydGVkID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTXVsdGktU29ydFxuICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gbmV3U29ydGVkLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtblswXS5pZClcbiAgICAgICAgLy8gRXhpc3RpbmcgU29ydGVkIENvbHVtblxuICAgICAgICBpZiAoZXhpc3RpbmdJbmRleCA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleF1cbiAgICAgICAgICBpZiAoZXhpc3RpbmcuZGVzYyA9PT0gc2Vjb25kU29ydERpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgICAgICAgIG5ld1NvcnRlZC5zcGxpY2UoZXhpc3RpbmdJbmRleCwgY29sdW1uLmxlbmd0aClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbHVtbi5mb3JFYWNoKChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3U29ydGVkW2V4aXN0aW5nSW5kZXggKyBpXS5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbi5mb3JFYWNoKChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgIG5ld1NvcnRlZFtleGlzdGluZ0luZGV4ICsgaV0uZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghYWRkaXRpdmUpIHtcbiAgICAgICAgICAgIG5ld1NvcnRlZCA9IG5ld1NvcnRlZC5zbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBOZXcgU29ydCBDb2x1bW5cbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgIG5ld1NvcnRlZCA9IG5ld1NvcnRlZC5jb25jYXQoXG4gICAgICAgICAgICBjb2x1bW4ubWFwKGQgPT4gKHtcbiAgICAgICAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBjb2x1bW4ubWFwKGQgPT4gKHtcbiAgICAgICAgICAgIGlkOiBkLmlkLFxuICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2U6ICghc29ydGVkLmxlbmd0aCAmJiBuZXdTb3J0ZWQubGVuZ3RoKSB8fCAhYWRkaXRpdmUgPyAwIDogdGhpcy5zdGF0ZS5wYWdlLFxuICAgICAgICAgIHNvcnRlZDogbmV3U29ydGVkLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiBvblNvcnRlZENoYW5nZSAmJiBvblNvcnRlZENoYW5nZShuZXdTb3J0ZWQsIGNvbHVtbiwgYWRkaXRpdmUpXG4gICAgICApXG4gICAgfVxuXG4gICAgZmlsdGVyQ29sdW1uIChjb2x1bW4sIHZhbHVlKSB7XG4gICAgICBjb25zdCB7IGZpbHRlcmVkIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuICAgICAgY29uc3QgeyBvbkZpbHRlcmVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIC8vIFJlbW92ZSBvbGQgZmlsdGVyIGZpcnN0IGlmIGl0IGV4aXN0c1xuICAgICAgY29uc3QgbmV3RmlsdGVyaW5nID0gKGZpbHRlcmVkIHx8IFtdKS5maWx0ZXIoeCA9PiB4LmlkICE9PSBjb2x1bW4uaWQpXG5cbiAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgbmV3RmlsdGVyaW5nLnB1c2goe1xuICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcmVkOiBuZXdGaWx0ZXJpbmcsXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IG9uRmlsdGVyZWRDaGFuZ2UgJiYgb25GaWx0ZXJlZENoYW5nZShuZXdGaWx0ZXJpbmcsIGNvbHVtbiwgdmFsdWUpXG4gICAgICApXG4gICAgfVxuXG4gICAgcmVzaXplQ29sdW1uU3RhcnQgKGV2ZW50LCBjb2x1bW4sIGlzVG91Y2gpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBjb25zdCBwYXJlbnRXaWR0aCA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG5cbiAgICAgIGxldCBwYWdlWFxuICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgcGFnZVggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWFxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyYXBFdmVudHMgPSB0cnVlXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICBjdXJyZW50bHlSZXNpemluZzoge1xuICAgICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICAgIHN0YXJ0WDogcGFnZVgsXG4gICAgICAgICAgICBwYXJlbnRXaWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbHVtbk1vdmluZyAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBjb25zdCB7IG9uUmVzaXplZENoYW5nZSwgY29sdW1uIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCB7IHJlc2l6ZWQsIGN1cnJlbnRseVJlc2l6aW5nLCBjb2x1bW5zIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuICAgICAgY29uc3QgY3VycmVudENvbHVtbiA9IGNvbHVtbnMuZmluZChcbiAgICAgICAgYyA9PiBjLmFjY2Vzc29yID09PSBjdXJyZW50bHlSZXNpemluZy5pZCB8fCBjLmlkID09PSBjdXJyZW50bHlSZXNpemluZy5pZFxuICAgICAgKVxuICAgICAgY29uc3QgbWluUmVzaXplV2lkdGggPVxuICAgICAgICBjdXJyZW50Q29sdW1uICYmIGN1cnJlbnRDb2x1bW4ubWluUmVzaXplV2lkdGggIT0gbnVsbFxuICAgICAgICAgID8gY3VycmVudENvbHVtbi5taW5SZXNpemVXaWR0aFxuICAgICAgICAgIDogY29sdW1uLm1pblJlc2l6ZVdpZHRoXG5cbiAgICAgIC8vIERlbGV0ZSBvbGQgdmFsdWVcbiAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcih4ID0+IHguaWQgIT09IGN1cnJlbnRseVJlc2l6aW5nLmlkKVxuXG4gICAgICBsZXQgcGFnZVhcblxuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaG1vdmUnKSB7XG4gICAgICAgIHBhZ2VYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVhcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcbiAgICAgICAgcGFnZVggPSBldmVudC5wYWdlWFxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdXaWR0aCA9IE1hdGgubWF4KFxuICAgICAgICBjdXJyZW50bHlSZXNpemluZy5wYXJlbnRXaWR0aCArIHBhZ2VYIC0gY3VycmVudGx5UmVzaXppbmcuc3RhcnRYLFxuICAgICAgICBtaW5SZXNpemVXaWR0aFxuICAgICAgKVxuXG4gICAgICBuZXdSZXNpemVkLnB1c2goe1xuICAgICAgICBpZDogY3VycmVudGx5UmVzaXppbmcuaWQsXG4gICAgICAgIHZhbHVlOiBuZXdXaWR0aCxcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcbiAgICAgICAge1xuICAgICAgICAgIHJlc2l6ZWQ6IG5ld1Jlc2l6ZWQsXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IG9uUmVzaXplZENoYW5nZSAmJiBvblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZCwgZXZlbnQpXG4gICAgICApXG4gICAgfVxuXG4gICAgcmVzaXplQ29sdW1uRW5kIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGNvbnN0IGlzVG91Y2ggPSBldmVudC50eXBlID09PSAndG91Y2hlbmQnIHx8IGV2ZW50LnR5cGUgPT09ICd0b3VjaGNhbmNlbCdcblxuICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0cyBhIHRvdWNoIGV2ZW50IGNsZWFyIHRoZSBtb3VzZSBvbmUncyBhcyB3ZWxsIGJlY2F1c2Ugc29tZXRpbWVzXG4gICAgICAvLyB0aGUgbW91c2VEb3duIGV2ZW50IGdldHMgY2FsbGVkIGFzIHdlbGwsIGJ1dCB0aGUgbW91c2VVcCBldmVudCBkb2Vzbid0XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZylcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcblxuICAgICAgLy8gVGhlIHRvdWNoIGV2ZW50cyBkb24ndCBwcm9wYWdhdGUgdXAgdG8gdGhlIHNvcnRpbmcncyBvbk1vdXNlRG93biBldmVudCBzb1xuICAgICAgLy8gbm8gbmVlZCB0byBwcmV2ZW50IGl0IGZyb20gaGFwcGVuaW5nIG9yIGVsc2UgdGhlIGZpcnN0IGNsaWNrIGFmdGVyIGEgdG91Y2hcbiAgICAgIC8vIGV2ZW50IHJlc2l6ZSB3aWxsIG5vdCBzb3J0IHRoZSBjb2x1bW4uXG4gICAgICBpZiAoIWlzVG91Y2gpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHtcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IHRydWUsXG4gICAgICAgICAgY3VycmVudGx5UmVzaXppbmc6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuIl19