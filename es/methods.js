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
        var onResizedChange = this.props.onResizedChange;

        var _getResolvedState4 = this.getResolvedState(),
            resized = _getResolvedState4.resized,
            currentlyResizing = _getResolvedState4.currentlyResizing;

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

        // Set the min size to 10 to account for margin and border or else the
        // group headers don't line up correctly
        var newWidth = Math.max(currentlyResizing.parentWidth + pageX - currentlyResizing.startX, 11);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2RzLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiXyIsInByb3BzIiwic3RhdGUiLCJyZXNvbHZlZFN0YXRlIiwiY29tcGFjdE9iamVjdCIsIm5ld1N0YXRlIiwiZGF0YUNoYW5nZWQiLCJjb2x1bW5zIiwicGl2b3RCeSIsImRhdGEiLCJyZXNvbHZlRGF0YSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5IiwibmVzdGluZ0xldmVsS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5IiwiU3ViQ29tcG9uZW50IiwiaGFzSGVhZGVyR3JvdXBzIiwiZm9yRWFjaCIsImNvbHVtbiIsImNvbHVtbnNXaXRoRXhwYW5kZXIiLCJleHBhbmRlckNvbHVtbiIsImZpbmQiLCJjb2wiLCJleHBhbmRlciIsInNvbWUiLCJjb2wyIiwibWFrZURlY29yYXRlZENvbHVtbiIsInBhcmVudENvbHVtbiIsImRjb2wiLCJleHBhbmRlckRlZmF1bHRzIiwibWF4V2lkdGgiLCJtaW5XaWR0aCIsImFjY2Vzc29yIiwiaWQiLCJhY2Nlc3NvclN0cmluZyIsImdldCIsInJvdyIsImNvbnNvbGUiLCJ3YXJuIiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJhbGxEZWNvcmF0ZWRDb2x1bW5zIiwiZGVjb3JhdGVBbmRBZGRUb0FsbCIsImRlY29yYXRlZENvbHVtbiIsInB1c2giLCJkZWNvcmF0ZWRDb2x1bW5zIiwibWFwIiwiZCIsInZpc2libGVDb2x1bW5zIiwic2xpY2UiLCJhbGxWaXNpYmxlQ29sdW1ucyIsInZpc2libGVTdWJDb2x1bW5zIiwiZmlsdGVyIiwiaW5kZXhPZiIsImdldEZpcnN0RGVmaW5lZCIsInNob3ciLCJsZW5ndGgiLCJwaXZvdEluZGV4IiwiZmluZEluZGV4IiwicGl2b3QiLCJwaXZvdENvbHVtbnMiLCJmb3VuZCIsInBpdm90SUQiLCJQaXZvdFBhcmVudENvbHVtbiIsInJlZHVjZSIsInByZXYiLCJjdXJyZW50IiwiUGl2b3RHcm91cEhlYWRlciIsIkhlYWRlciIsInBpdm90Q29sdW1uR3JvdXAiLCJwaXZvdERlZmF1bHRzIiwicGl2b3RlZCIsInNwbGljZSIsInVuc2hpZnQiLCJoZWFkZXJHcm91cHMiLCJjdXJyZW50U3BhbiIsImFkZEhlYWRlciIsImNvbmNhdCIsImFjY2Vzc1JvdyIsImkiLCJsZXZlbCIsInJlc29sdmVkRGF0YSIsImFnZ3JlZ2F0aW5nQ29sdW1ucyIsImFnZ3JlZ2F0ZSIsImFnZ3JlZ2F0aW9uVmFsdWVzIiwidmFsdWVzIiwicm93cyIsImdyb3VwUmVjdXJzaXZlbHkiLCJrZXlzIiwiZ3JvdXBlZFJvd3MiLCJPYmplY3QiLCJlbnRyaWVzIiwiZ3JvdXBCeSIsImtleSIsInZhbHVlIiwic3ViUm93cyIsInJvd0dyb3VwIiwibWFudWFsIiwic29ydGVkIiwiZmlsdGVyZWQiLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwic29ydE1ldGhvZHNCeUNvbHVtbklEIiwic29ydE1ldGhvZCIsInNvcnRlZERhdGEiLCJzb3J0RGF0YSIsImZpbHRlckRhdGEiLCJvbkZldGNoRGF0YSIsImdldFJlc29sdmVkU3RhdGUiLCJmaWx0ZXJlZERhdGEiLCJmaWx0ZXJlZFNvRmFyIiwibmV4dEZpbHRlciIsIngiLCJmaWx0ZXJhYmxlIiwiZmlsdGVyTWV0aG9kIiwiZmlsdGVyQWxsIiwib3JkZXJCeU1ldGhvZCIsIm9yZGVyQnkiLCJzb3J0IiwiYSIsImIiLCJkZXNjIiwiZGVmYXVsdFNvcnRNZXRob2QiLCJtaW5Sb3dzIiwiZ2V0U3RhdGVPclByb3AiLCJwYWdlIiwib25QYWdlQ2hhbmdlIiwiY29sbGFwc2VPblBhZ2VDaGFuZ2UiLCJleHBhbmRlZCIsInNldFN0YXRlV2l0aERhdGEiLCJuZXdQYWdlU2l6ZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJwYWdlU2l6ZSIsImN1cnJlbnRSb3ciLCJuZXdQYWdlIiwiTWF0aCIsImZsb29yIiwiYWRkaXRpdmUiLCJza2lwTmV4dFNvcnQiLCJkZWZhdWx0U29ydERlc2MiLCJmaXJzdFNvcnREaXJlY3Rpb24iLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJzZWNvbmRTb3J0RGlyZWN0aW9uIiwib25Tb3J0ZWRDaGFuZ2UiLCJuZXdTb3J0ZWQiLCJjbG9uZSIsImlzU29ydGluZ0Rlc2MiLCJpc0FycmF5IiwiZXhpc3RpbmdJbmRleCIsImV4aXN0aW5nIiwib25GaWx0ZXJlZENoYW5nZSIsIm5ld0ZpbHRlcmluZyIsImV2ZW50IiwiaXNUb3VjaCIsInN0b3BQcm9wYWdhdGlvbiIsInBhcmVudFdpZHRoIiwidGFyZ2V0IiwicGFyZW50RWxlbWVudCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndpZHRoIiwicGFnZVgiLCJjaGFuZ2VkVG91Y2hlcyIsInRyYXBFdmVudHMiLCJjdXJyZW50bHlSZXNpemluZyIsInN0YXJ0WCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2l6ZUNvbHVtbk1vdmluZyIsInJlc2l6ZUNvbHVtbkVuZCIsIm9uUmVzaXplZENoYW5nZSIsInJlc2l6ZWQiLCJuZXdSZXNpemVkIiwidHlwZSIsIm5ld1dpZHRoIiwibWF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsQ0FBUCxNQUFjLFNBQWQ7O0FBRUEsZ0JBQWU7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsdUNBRU9DLEtBRlAsRUFFY0MsS0FGZCxFQUVxQjtBQUM5QixZQUFNQyw2QkFDREgsRUFBRUksYUFBRixDQUFnQixLQUFLRixLQUFyQixDQURDLEVBRURGLEVBQUVJLGFBQUYsQ0FBZ0IsS0FBS0gsS0FBckIsQ0FGQyxFQUdERCxFQUFFSSxhQUFGLENBQWdCRixLQUFoQixDQUhDLEVBSURGLEVBQUVJLGFBQUYsQ0FBZ0JILEtBQWhCLENBSkMsQ0FBTjtB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U1UsbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEMsS0FBS1Isa0JBQS9DO0FBQ0FGLG1CQUFTVSxtQkFBVCxDQUE2QixhQUE3QixFQUE0QyxLQUFLUCxlQUFqRDtBQUNBSCxtQkFBU1UsbUJBQVQsQ0FBNkIsVUFBN0IsRUFBeUMsS0FBS1AsZUFBOUM7QUFDRDs7QUFFRDtBQUNBO0FBQ0FILGlCQUFTVSxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxLQUFLUixrQkFBL0M7QUFDQUYsaUJBQVNVLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUtQLGVBQTdDO0FBQ0FILGlCQUFTVSxtQkFBVCxDQUE2QixZQUE3QixFQUEyQyxLQUFLUCxlQUFoRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUNmLE9BQUwsRUFBYztBQUNaLGVBQUsxQixnQkFBTCxDQUFzQjtBQUNwQlMsMEJBQWMsSUFETTtBQUVwQjJCLCtCQUFtQjtBQUZDLFdBQXRCO0FBSUQ7QUFDRjtBQWxxQlU7O0FBQUE7QUFBQSxJQUNDYSxJQUREO0FBQUEsQ0FBZiIsImZpbGUiOiJtZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcblxuZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxuICBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICAgIGdldFJlc29sdmVkU3RhdGUgKHByb3BzLCBzdGF0ZSkge1xuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHtcbiAgICAgICAgLi4uXy5jb21wYWN0T2JqZWN0KHRoaXMuc3RhdGUpLFxuICAgICAgICAuLi5fLmNvbXBhY3RPYmplY3QodGhpcy5wcm9wcyksXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChzdGF0ZSksXG4gICAgICAgIC4uLl8uY29tcGFjdE9iamVjdChwcm9wcyksXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZWRTdGF0ZVxuICAgIH1cblxuICAgIGdldERhdGFNb2RlbCAobmV3U3RhdGUsIGRhdGFDaGFuZ2VkKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIHBpdm90QnkgPSBbXSxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgcmVzb2x2ZURhdGEsXG4gICAgICAgIHBpdm90SURLZXksXG4gICAgICAgIHBpdm90VmFsS2V5LFxuICAgICAgICBzdWJSb3dzS2V5LFxuICAgICAgICBhZ2dyZWdhdGVkS2V5LFxuICAgICAgICBuZXN0aW5nTGV2ZWxLZXksXG4gICAgICAgIG9yaWdpbmFsS2V5LFxuICAgICAgICBpbmRleEtleSxcbiAgICAgICAgZ3JvdXBlZEJ5UGl2b3RLZXksXG4gICAgICAgIFN1YkNvbXBvbmVudCxcbiAgICAgIH0gPSBuZXdTdGF0ZVxuXG4gICAgICAvLyBEZXRlcm1pbmUgSGVhZGVyIEdyb3Vwc1xuICAgICAgbGV0IGhhc0hlYWRlckdyb3VwcyA9IGZhbHNlXG4gICAgICBjb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgICAgaGFzSGVhZGVyR3JvdXBzID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgY29sdW1uc1dpdGhFeHBhbmRlciA9IFsuLi5jb2x1bW5zXVxuXG4gICAgICBsZXQgZXhwYW5kZXJDb2x1bW4gPSBjb2x1bW5zLmZpbmQoXG4gICAgICAgIGNvbCA9PiBjb2wuZXhwYW5kZXIgfHwgKGNvbC5jb2x1bW5zICYmIGNvbC5jb2x1bW5zLnNvbWUoY29sMiA9PiBjb2wyLmV4cGFuZGVyKSlcbiAgICAgIClcbiAgICAgIC8vIFRoZSBhY3R1YWwgZXhwYW5kZXIgbWlnaHQgYmUgaW4gdGhlIGNvbHVtbnMgZmllbGQgb2YgYSBncm91cCBjb2x1bW5cbiAgICAgIGlmIChleHBhbmRlckNvbHVtbiAmJiAhZXhwYW5kZXJDb2x1bW4uZXhwYW5kZXIpIHtcbiAgICAgICAgZXhwYW5kZXJDb2x1bW4gPSBleHBhbmRlckNvbHVtbi5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5leHBhbmRlcilcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBTdWJDb21wb25lbnQncyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGFuIGV4cGFuZGVyIGNvbHVtblxuICAgICAgaWYgKFN1YkNvbXBvbmVudCAmJiAhZXhwYW5kZXJDb2x1bW4pIHtcbiAgICAgICAgZXhwYW5kZXJDb2x1bW4gPSB7IGV4cGFuZGVyOiB0cnVlIH1cbiAgICAgICAgY29sdW1uc1dpdGhFeHBhbmRlciA9IFtleHBhbmRlckNvbHVtbiwgLi4uY29sdW1uc1dpdGhFeHBhbmRlcl1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFrZURlY29yYXRlZENvbHVtbiA9IChjb2x1bW4sIHBhcmVudENvbHVtbikgPT4ge1xuICAgICAgICBsZXQgZGNvbFxuICAgICAgICBpZiAoY29sdW1uLmV4cGFuZGVyKSB7XG4gICAgICAgICAgZGNvbCA9IHtcbiAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY29sdW1uLFxuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5leHBhbmRlckRlZmF1bHRzLFxuICAgICAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkY29sID0ge1xuICAgICAgICAgICAgLi4udGhpcy5wcm9wcy5jb2x1bW4sXG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlIG1pbldpZHRoIGlzIG5vdCBncmVhdGVyIHRoYW4gbWF4V2lkdGggaWYgc2V0XG4gICAgICAgIGlmIChkY29sLm1heFdpZHRoIDwgZGNvbC5taW5XaWR0aCkge1xuICAgICAgICAgIGRjb2wubWluV2lkdGggPSBkY29sLm1heFdpZHRoXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50Q29sdW1uKSB7XG4gICAgICAgICAgZGNvbC5wYXJlbnRDb2x1bW4gPSBwYXJlbnRDb2x1bW5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGZvciBzdHJpbmcgYWNjZXNzb3JcbiAgICAgICAgaWYgKHR5cGVvZiBkY29sLmFjY2Vzc29yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGRjb2wuaWQgPSBkY29sLmlkIHx8IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgICBjb25zdCBhY2Nlc3NvclN0cmluZyA9IGRjb2wuYWNjZXNzb3JcbiAgICAgICAgICBkY29sLmFjY2Vzc29yID0gcm93ID0+IF8uZ2V0KHJvdywgYWNjZXNzb3JTdHJpbmcpXG4gICAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBmdW5jdGlvbmFsIGFjY2Vzc29yIChidXQgcmVxdWlyZSBhbiBJRClcbiAgICAgICAgaWYgKGRjb2wuYWNjZXNzb3IgJiYgIWRjb2wuaWQpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oZGNvbClcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQSBjb2x1bW4gaWQgaXMgcmVxdWlyZWQgaWYgdXNpbmcgYSBub24tc3RyaW5nIGFjY2Vzc29yIGZvciBjb2x1bW4gYWJvdmUuJ1xuICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhbGwgYmFjayB0byBhbiB1bmRlZmluZWQgYWNjZXNzb3JcbiAgICAgICAgaWYgKCFkY29sLmFjY2Vzc29yKSB7XG4gICAgICAgICAgZGNvbC5hY2Nlc3NvciA9ICgpID0+IHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRjb2xcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsRGVjb3JhdGVkQ29sdW1ucyA9IFtdXG5cbiAgICAgIC8vIERlY29yYXRlIHRoZSBjb2x1bW5zXG4gICAgICBjb25zdCBkZWNvcmF0ZUFuZEFkZFRvQWxsID0gKGNvbHVtbiwgcGFyZW50Q29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlY29yYXRlZENvbHVtbiA9IG1ha2VEZWNvcmF0ZWRDb2x1bW4oY29sdW1uLCBwYXJlbnRDb2x1bW4pXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMucHVzaChkZWNvcmF0ZWRDb2x1bW4pXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZWRDb2x1bW5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVjb3JhdGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoRXhwYW5kZXIubWFwKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW4uY29sdW1ucy5tYXAoZCA9PiBkZWNvcmF0ZUFuZEFkZFRvQWxsKGQsIGNvbHVtbikpLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVjb3JhdGVBbmRBZGRUb0FsbChjb2x1bW4pXG4gICAgICB9KVxuXG4gICAgICAvLyBCdWlsZCB0aGUgdmlzaWJsZSBjb2x1bW5zLCBoZWFkZXJzIGFuZCBmbGF0IGNvbHVtbiBsaXN0XG4gICAgICBsZXQgdmlzaWJsZUNvbHVtbnMgPSBkZWNvcmF0ZWRDb2x1bW5zLnNsaWNlKClcbiAgICAgIGxldCBhbGxWaXNpYmxlQ29sdW1ucyA9IFtdXG5cbiAgICAgIHZpc2libGVDb2x1bW5zID0gdmlzaWJsZUNvbHVtbnMubWFwKGNvbHVtbiA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICAgIGNvbnN0IHZpc2libGVTdWJDb2x1bW5zID0gY29sdW1uLmNvbHVtbnMuZmlsdGVyKFxuICAgICAgICAgICAgZCA9PiAocGl2b3RCeS5pbmRleE9mKGQuaWQpID4gLTEgPyBmYWxzZSA6IF8uZ2V0Rmlyc3REZWZpbmVkKGQuc2hvdywgdHJ1ZSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgICBjb2x1bW5zOiB2aXNpYmxlU3ViQ29sdW1ucyxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbHVtblxuICAgICAgfSlcblxuICAgICAgdmlzaWJsZUNvbHVtbnMgPSB2aXNpYmxlQ29sdW1ucy5maWx0ZXIoXG4gICAgICAgIGNvbHVtbiA9PlxuICAgICAgICAgIGNvbHVtbi5jb2x1bW5zXG4gICAgICAgICAgICA/IGNvbHVtbi5jb2x1bW5zLmxlbmd0aFxuICAgICAgICAgICAgOiBwaXZvdEJ5LmluZGV4T2YoY29sdW1uLmlkKSA+IC0xXG4gICAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgICAgOiBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4uc2hvdywgdHJ1ZSlcbiAgICAgIClcblxuICAgICAgLy8gRmluZCBhbnkgY3VzdG9tIHBpdm90IGxvY2F0aW9uXG4gICAgICBjb25zdCBwaXZvdEluZGV4ID0gdmlzaWJsZUNvbHVtbnMuZmluZEluZGV4KGNvbCA9PiBjb2wucGl2b3QpXG5cbiAgICAgIC8vIEhhbmRsZSBQaXZvdCBDb2x1bW5zXG4gICAgICBpZiAocGl2b3RCeS5sZW5ndGgpIHtcbiAgICAgICAgLy8gUmV0cmlldmUgdGhlIHBpdm90IGNvbHVtbnMgaW4gdGhlIGNvcnJlY3QgcGl2b3Qgb3JkZXJcbiAgICAgICAgY29uc3QgcGl2b3RDb2x1bW5zID0gW11cbiAgICAgICAgcGl2b3RCeS5mb3JFYWNoKHBpdm90SUQgPT4ge1xuICAgICAgICAgIGNvbnN0IGZvdW5kID0gYWxsRGVjb3JhdGVkQ29sdW1ucy5maW5kKGQgPT4gZC5pZCA9PT0gcGl2b3RJRClcbiAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIHBpdm90Q29sdW1ucy5wdXNoKGZvdW5kKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCBQaXZvdFBhcmVudENvbHVtbiA9IHBpdm90Q29sdW1ucy5yZWR1Y2UoXG4gICAgICAgICAgKHByZXYsIGN1cnJlbnQpID0+IHByZXYgJiYgcHJldiA9PT0gY3VycmVudC5wYXJlbnRDb2x1bW4gJiYgY3VycmVudC5wYXJlbnRDb2x1bW4sXG4gICAgICAgICAgcGl2b3RDb2x1bW5zWzBdLnBhcmVudENvbHVtblxuICAgICAgICApXG5cbiAgICAgICAgbGV0IFBpdm90R3JvdXBIZWFkZXIgPSBoYXNIZWFkZXJHcm91cHMgJiYgUGl2b3RQYXJlbnRDb2x1bW4uSGVhZGVyXG4gICAgICAgIFBpdm90R3JvdXBIZWFkZXIgPSBQaXZvdEdyb3VwSGVhZGVyIHx8ICgoKSA9PiA8c3Ryb25nPlBpdm90ZWQ8L3N0cm9uZz4pXG5cbiAgICAgICAgbGV0IHBpdm90Q29sdW1uR3JvdXAgPSB7XG4gICAgICAgICAgSGVhZGVyOiBQaXZvdEdyb3VwSGVhZGVyLFxuICAgICAgICAgIGNvbHVtbnM6IHBpdm90Q29sdW1ucy5tYXAoY29sID0+ICh7XG4gICAgICAgICAgICAuLi50aGlzLnByb3BzLnBpdm90RGVmYXVsdHMsXG4gICAgICAgICAgICAuLi5jb2wsXG4gICAgICAgICAgICBwaXZvdGVkOiB0cnVlLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBsYWNlIHRoZSBwaXZvdENvbHVtbnMgYmFjayBpbnRvIHRoZSB2aXNpYmxlQ29sdW1uc1xuICAgICAgICBpZiAocGl2b3RJbmRleCA+PSAwKSB7XG4gICAgICAgICAgcGl2b3RDb2x1bW5Hcm91cCA9IHtcbiAgICAgICAgICAgIC4uLnZpc2libGVDb2x1bW5zW3Bpdm90SW5kZXhdLFxuICAgICAgICAgICAgLi4ucGl2b3RDb2x1bW5Hcm91cCxcbiAgICAgICAgICB9XG4gICAgICAgICAgdmlzaWJsZUNvbHVtbnMuc3BsaWNlKHBpdm90SW5kZXgsIDEsIHBpdm90Q29sdW1uR3JvdXApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlzaWJsZUNvbHVtbnMudW5zaGlmdChwaXZvdENvbHVtbkdyb3VwKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJ1aWxkIEhlYWRlciBHcm91cHNcbiAgICAgIGNvbnN0IGhlYWRlckdyb3VwcyA9IFtdXG4gICAgICBsZXQgY3VycmVudFNwYW4gPSBbXVxuXG4gICAgICAvLyBBIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGFkZCBhIGhlYWRlciBhbmQgcmVzZXQgdGhlIGN1cnJlbnRTcGFuXG4gICAgICBjb25zdCBhZGRIZWFkZXIgPSAoY29sdW1ucywgY29sdW1uKSA9PiB7XG4gICAgICAgIGhlYWRlckdyb3Vwcy5wdXNoKHtcbiAgICAgICAgICAuLi50aGlzLnByb3BzLmNvbHVtbixcbiAgICAgICAgICAuLi5jb2x1bW4sXG4gICAgICAgICAgY29sdW1ucyxcbiAgICAgICAgfSlcbiAgICAgICAgY3VycmVudFNwYW4gPSBbXVxuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCBmbGFzdCBsaXN0IG9mIGFsbFZpc2libGVDb2x1bW5zIGFuZCBIZWFkZXJHcm91cHNcbiAgICAgIHZpc2libGVDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMgPSBhbGxWaXNpYmxlQ29sdW1ucy5jb25jYXQoY29sdW1uLmNvbHVtbnMpXG4gICAgICAgICAgaWYgKGN1cnJlbnRTcGFuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFkZEhlYWRlcihjdXJyZW50U3BhbilcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkSGVhZGVyKGNvbHVtbi5jb2x1bW5zLCBjb2x1bW4pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgYWxsVmlzaWJsZUNvbHVtbnMucHVzaChjb2x1bW4pXG4gICAgICAgIGN1cnJlbnRTcGFuLnB1c2goY29sdW1uKVxuICAgICAgfSlcbiAgICAgIGlmIChoYXNIZWFkZXJHcm91cHMgJiYgY3VycmVudFNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgICBhZGRIZWFkZXIoY3VycmVudFNwYW4pXG4gICAgICB9XG5cbiAgICAgIC8vIEFjY2VzcyB0aGUgZGF0YVxuICAgICAgY29uc3QgYWNjZXNzUm93ID0gKGQsIGksIGxldmVsID0gMCkgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSB7XG4gICAgICAgICAgW29yaWdpbmFsS2V5XTogZCxcbiAgICAgICAgICBbaW5kZXhLZXldOiBpLFxuICAgICAgICAgIFtzdWJSb3dzS2V5XTogZFtzdWJSb3dzS2V5XSxcbiAgICAgICAgICBbbmVzdGluZ0xldmVsS2V5XTogbGV2ZWwsXG4gICAgICAgIH1cbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgaWYgKGNvbHVtbi5leHBhbmRlcikgcmV0dXJuXG4gICAgICAgICAgcm93W2NvbHVtbi5pZF0gPSBjb2x1bW4uYWNjZXNzb3IoZClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHJvd1tzdWJSb3dzS2V5XSkge1xuICAgICAgICAgIHJvd1tzdWJSb3dzS2V5XSA9IHJvd1tzdWJSb3dzS2V5XS5tYXAoKGQsIGkpID0+IGFjY2Vzc1JvdyhkLCBpLCBsZXZlbCArIDEpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dcbiAgICAgIH1cblxuICAgICAgLy8gLy8gSWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIGp1c3QgdXNlIHRoZSBjYWNoZWQgZGF0YVxuICAgICAgbGV0IHJlc29sdmVkRGF0YSA9IHRoaXMucmVzb2x2ZWREYXRhXG4gICAgICAvLyBJZiB0aGUgZGF0YSBoYXMgY2hhbmdlZCwgcnVuIHRoZSBkYXRhIHJlc29sdmVyIGFuZCBjYWNoZSB0aGUgcmVzdWx0XG4gICAgICBpZiAoIXRoaXMucmVzb2x2ZWREYXRhIHx8IGRhdGFDaGFuZ2VkKSB7XG4gICAgICAgIHJlc29sdmVkRGF0YSA9IHJlc29sdmVEYXRhKGRhdGEpXG4gICAgICAgIHRoaXMucmVzb2x2ZWREYXRhID0gcmVzb2x2ZWREYXRhXG4gICAgICB9XG4gICAgICAvLyBVc2UgdGhlIHJlc29sdmVkIGRhdGFcbiAgICAgIHJlc29sdmVkRGF0YSA9IHJlc29sdmVkRGF0YS5tYXAoKGQsIGkpID0+IGFjY2Vzc1JvdyhkLCBpKSlcblxuICAgICAgLy8gVE9ETzogTWFrZSBpdCBwb3NzaWJsZSB0byBmYWJyaWNhdGUgbmVzdGVkIHJvd3Mgd2l0aG91dCBwaXZvdGluZ1xuICAgICAgY29uc3QgYWdncmVnYXRpbmdDb2x1bW5zID0gYWxsVmlzaWJsZUNvbHVtbnMuZmlsdGVyKGQgPT4gIWQuZXhwYW5kZXIgJiYgZC5hZ2dyZWdhdGUpXG5cbiAgICAgIC8vIElmIHBpdm90aW5nLCByZWN1cnNpdmVseSBncm91cCB0aGUgZGF0YVxuICAgICAgY29uc3QgYWdncmVnYXRlID0gcm93cyA9PiB7XG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9uVmFsdWVzID0ge31cbiAgICAgICAgYWdncmVnYXRpbmdDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICBjb25zdCB2YWx1ZXMgPSByb3dzLm1hcChkID0+IGRbY29sdW1uLmlkXSlcbiAgICAgICAgICBhZ2dyZWdhdGlvblZhbHVlc1tjb2x1bW4uaWRdID0gY29sdW1uLmFnZ3JlZ2F0ZSh2YWx1ZXMsIHJvd3MpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBhZ2dyZWdhdGlvblZhbHVlc1xuICAgICAgfVxuICAgICAgaWYgKHBpdm90QnkubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGdyb3VwUmVjdXJzaXZlbHkgPSAocm93cywga2V5cywgaSA9IDApID0+IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGxldmVsLCBqdXN0IHJldHVybiB0aGUgcm93c1xuICAgICAgICAgIGlmIChpID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvd3NcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gR3JvdXAgdGhlIHJvd3MgdG9nZXRoZXIgZm9yIHRoaXMgbGV2ZWxcbiAgICAgICAgICBsZXQgZ3JvdXBlZFJvd3MgPSBPYmplY3QuZW50cmllcyhfLmdyb3VwQnkocm93cywga2V5c1tpXSkpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiAoe1xuICAgICAgICAgICAgW3Bpdm90SURLZXldOiBrZXlzW2ldLFxuICAgICAgICAgICAgW3Bpdm90VmFsS2V5XToga2V5LFxuICAgICAgICAgICAgW2tleXNbaV1dOiBrZXksXG4gICAgICAgICAgICBbc3ViUm93c0tleV06IHZhbHVlLFxuICAgICAgICAgICAgW25lc3RpbmdMZXZlbEtleV06IGksXG4gICAgICAgICAgICBbZ3JvdXBlZEJ5UGl2b3RLZXldOiB0cnVlLFxuICAgICAgICAgIH0pKVxuICAgICAgICAgIC8vIFJlY3Vyc2UgaW50byB0aGUgc3ViUm93c1xuICAgICAgICAgIGdyb3VwZWRSb3dzID0gZ3JvdXBlZFJvd3MubWFwKHJvd0dyb3VwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1YlJvd3MgPSBncm91cFJlY3Vyc2l2ZWx5KHJvd0dyb3VwW3N1YlJvd3NLZXldLCBrZXlzLCBpICsgMSlcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLnJvd0dyb3VwLFxuICAgICAgICAgICAgICBbc3ViUm93c0tleV06IHN1YlJvd3MsXG4gICAgICAgICAgICAgIFthZ2dyZWdhdGVkS2V5XTogdHJ1ZSxcbiAgICAgICAgICAgICAgLi4uYWdncmVnYXRlKHN1YlJvd3MpLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIGdyb3VwZWRSb3dzXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZWREYXRhID0gZ3JvdXBSZWN1cnNpdmVseShyZXNvbHZlZERhdGEsIHBpdm90QnkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLm5ld1N0YXRlLFxuICAgICAgICByZXNvbHZlZERhdGEsXG4gICAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxuICAgICAgICBoZWFkZXJHcm91cHMsXG4gICAgICAgIGFsbERlY29yYXRlZENvbHVtbnMsXG4gICAgICAgIGhhc0hlYWRlckdyb3VwcyxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTb3J0ZWREYXRhIChyZXNvbHZlZFN0YXRlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1hbnVhbCxcbiAgICAgICAgc29ydGVkLFxuICAgICAgICBmaWx0ZXJlZCxcbiAgICAgICAgZGVmYXVsdEZpbHRlck1ldGhvZCxcbiAgICAgICAgcmVzb2x2ZWREYXRhLFxuICAgICAgICBhbGxWaXNpYmxlQ29sdW1ucyxcbiAgICAgICAgYWxsRGVjb3JhdGVkQ29sdW1ucyxcbiAgICAgIH0gPSByZXNvbHZlZFN0YXRlXG5cbiAgICAgIGNvbnN0IHNvcnRNZXRob2RzQnlDb2x1bW5JRCA9IHt9XG5cbiAgICAgIGFsbERlY29yYXRlZENvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wuc29ydE1ldGhvZCkuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURbY29sLmlkXSA9IGNvbC5zb3J0TWV0aG9kXG4gICAgICB9KVxuXG4gICAgICAvLyBSZXNvbHZlIHRoZSBkYXRhIGZyb20gZWl0aGVyIG1hbnVhbCBkYXRhIG9yIHNvcnRlZCBkYXRhXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzb3J0ZWREYXRhOiBtYW51YWxcbiAgICAgICAgICA/IHJlc29sdmVkRGF0YVxuICAgICAgICAgIDogdGhpcy5zb3J0RGF0YShcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyRGF0YShyZXNvbHZlZERhdGEsIGZpbHRlcmVkLCBkZWZhdWx0RmlsdGVyTWV0aG9kLCBhbGxWaXNpYmxlQ29sdW1ucyksXG4gICAgICAgICAgICBzb3J0ZWQsXG4gICAgICAgICAgICBzb3J0TWV0aG9kc0J5Q29sdW1uSURcbiAgICAgICAgICApLFxuICAgICAgfVxuICAgIH1cblxuICAgIGZpcmVGZXRjaERhdGEgKCkge1xuICAgICAgdGhpcy5wcm9wcy5vbkZldGNoRGF0YSh0aGlzLmdldFJlc29sdmVkU3RhdGUoKSwgdGhpcylcbiAgICB9XG5cbiAgICBnZXRQcm9wT3JTdGF0ZSAoa2V5KSB7XG4gICAgICByZXR1cm4gXy5nZXRGaXJzdERlZmluZWQodGhpcy5wcm9wc1trZXldLCB0aGlzLnN0YXRlW2tleV0pXG4gICAgfVxuXG4gICAgZ2V0U3RhdGVPclByb3AgKGtleSkge1xuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMuc3RhdGVba2V5XSwgdGhpcy5wcm9wc1trZXldKVxuICAgIH1cblxuICAgIGZpbHRlckRhdGEgKGRhdGEsIGZpbHRlcmVkLCBkZWZhdWx0RmlsdGVyTWV0aG9kLCBhbGxWaXNpYmxlQ29sdW1ucykge1xuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IGRhdGFcblxuICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCkge1xuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZC5yZWR1Y2UoKGZpbHRlcmVkU29GYXIsIG5leHRGaWx0ZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBjb2x1bW4gPSBhbGxWaXNpYmxlQ29sdW1ucy5maW5kKHggPT4geC5pZCA9PT0gbmV4dEZpbHRlci5pZClcblxuICAgICAgICAgIC8vIERvbid0IGZpbHRlciBoaWRkZW4gY29sdW1ucyBvciBjb2x1bW5zIHRoYXQgaGF2ZSBoYWQgdGhlaXIgZmlsdGVycyBkaXNhYmxlZFxuICAgICAgICAgIGlmICghY29sdW1uIHx8IGNvbHVtbi5maWx0ZXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkU29GYXJcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBmaWx0ZXJNZXRob2QgPSBjb2x1bW4uZmlsdGVyTWV0aG9kIHx8IGRlZmF1bHRGaWx0ZXJNZXRob2RcblxuICAgICAgICAgIC8vIElmICdmaWx0ZXJBbGwnIGlzIHNldCB0byB0cnVlLCBwYXNzIHRoZSBlbnRpcmUgZGF0YXNldCB0byB0aGUgZmlsdGVyIG1ldGhvZFxuICAgICAgICAgIGlmIChjb2x1bW4uZmlsdGVyQWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTWV0aG9kKG5leHRGaWx0ZXIsIGZpbHRlcmVkU29GYXIsIGNvbHVtbilcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZpbHRlcmVkU29GYXIuZmlsdGVyKHJvdyA9PiBmaWx0ZXJNZXRob2QobmV4dEZpbHRlciwgcm93LCBjb2x1bW4pKVxuICAgICAgICB9LCBmaWx0ZXJlZERhdGEpXG5cbiAgICAgICAgLy8gQXBwbHkgdGhlIGZpbHRlciB0byB0aGUgc3Vicm93cyBpZiB3ZSBhcmUgcGl2b3RpbmcsIGFuZCB0aGVuXG4gICAgICAgIC8vIGZpbHRlciBhbnkgcm93cyB3aXRob3V0IHN1YmNvbHVtbnMgYmVjYXVzZSBpdCB3b3VsZCBiZSBzdHJhbmdlIHRvIHNob3dcbiAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhXG4gICAgICAgICAgLm1hcChyb3cgPT4ge1xuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xuICAgICAgICAgICAgICByZXR1cm4gcm93XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5yb3csXG4gICAgICAgICAgICAgIFt0aGlzLnByb3BzLnN1YlJvd3NLZXldOiB0aGlzLmZpbHRlckRhdGEoXG4gICAgICAgICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQsXG4gICAgICAgICAgICAgICAgZGVmYXVsdEZpbHRlck1ldGhvZCxcbiAgICAgICAgICAgICAgICBhbGxWaXNpYmxlQ29sdW1uc1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihyb3cgPT4ge1xuICAgICAgICAgICAgaWYgKCFyb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJvd1t0aGlzLnByb3BzLnN1YlJvd3NLZXldLmxlbmd0aCA+IDBcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmlsdGVyZWREYXRhXG4gICAgfVxuXG4gICAgc29ydERhdGEgKGRhdGEsIHNvcnRlZCwgc29ydE1ldGhvZHNCeUNvbHVtbklEID0ge30pIHtcbiAgICAgIGlmICghc29ydGVkLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzb3J0ZWREYXRhID0gKHRoaXMucHJvcHMub3JkZXJCeU1ldGhvZCB8fCBfLm9yZGVyQnkpKFxuICAgICAgICBkYXRhLFxuICAgICAgICBzb3J0ZWQubWFwKHNvcnQgPT4ge1xuICAgICAgICAgIC8vIFN1cHBvcnQgY3VzdG9tIHNvcnRpbmcgbWV0aG9kcyBmb3IgZWFjaCBjb2x1bW5cbiAgICAgICAgICBpZiAoc29ydE1ldGhvZHNCeUNvbHVtbklEW3NvcnQuaWRdKSB7XG4gICAgICAgICAgICByZXR1cm4gKGEsIGIpID0+IHNvcnRNZXRob2RzQnlDb2x1bW5JRFtzb3J0LmlkXShhW3NvcnQuaWRdLCBiW3NvcnQuaWRdLCBzb3J0LmRlc2MpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAoYSwgYikgPT4gdGhpcy5wcm9wcy5kZWZhdWx0U29ydE1ldGhvZChhW3NvcnQuaWRdLCBiW3NvcnQuaWRdLCBzb3J0LmRlc2MpXG4gICAgICAgIH0pLFxuICAgICAgICBzb3J0ZWQubWFwKGQgPT4gIWQuZGVzYyksXG4gICAgICAgIHRoaXMucHJvcHMuaW5kZXhLZXlcbiAgICAgIClcblxuICAgICAgc29ydGVkRGF0YS5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgIGlmICghcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0pIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICByb3dbdGhpcy5wcm9wcy5zdWJSb3dzS2V5XSA9IHRoaXMuc29ydERhdGEoXG4gICAgICAgICAgcm93W3RoaXMucHJvcHMuc3ViUm93c0tleV0sXG4gICAgICAgICAgc29ydGVkLFxuICAgICAgICAgIHNvcnRNZXRob2RzQnlDb2x1bW5JRFxuICAgICAgICApXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gc29ydGVkRGF0YVxuICAgIH1cblxuICAgIGdldE1pblJvd3MgKCkge1xuICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHRoaXMucHJvcHMubWluUm93cywgdGhpcy5nZXRTdGF0ZU9yUHJvcCgncGFnZVNpemUnKSlcbiAgICB9XG5cbiAgICAvLyBVc2VyIGFjdGlvbnNcbiAgICBvblBhZ2VDaGFuZ2UgKHBhZ2UpIHtcbiAgICAgIGNvbnN0IHsgb25QYWdlQ2hhbmdlLCBjb2xsYXBzZU9uUGFnZUNoYW5nZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHsgcGFnZSB9XG4gICAgICBpZiAoY29sbGFwc2VPblBhZ2VDaGFuZ2UpIHtcbiAgICAgICAgbmV3U3RhdGUuZXhwYW5kZWQgPSB7fVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKG5ld1N0YXRlLCAoKSA9PiBvblBhZ2VDaGFuZ2UgJiYgb25QYWdlQ2hhbmdlKHBhZ2UpKVxuICAgIH1cblxuICAgIG9uUGFnZVNpemVDaGFuZ2UgKG5ld1BhZ2VTaXplKSB7XG4gICAgICBjb25zdCB7IG9uUGFnZVNpemVDaGFuZ2UgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUsIHBhZ2UgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG5cbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGFnZSB0byBkaXNwbGF5XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gcGFnZVNpemUgKiBwYWdlXG4gICAgICBjb25zdCBuZXdQYWdlID0gTWF0aC5mbG9vcihjdXJyZW50Um93IC8gbmV3UGFnZVNpemUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VTaXplOiBuZXdQYWdlU2l6ZSxcbiAgICAgICAgICBwYWdlOiBuZXdQYWdlLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiBvblBhZ2VTaXplQ2hhbmdlICYmIG9uUGFnZVNpemVDaGFuZ2UobmV3UGFnZVNpemUsIG5ld1BhZ2UpXG4gICAgICApXG4gICAgfVxuXG4gICAgc29ydENvbHVtbiAoY29sdW1uLCBhZGRpdGl2ZSkge1xuICAgICAgY29uc3QgeyBzb3J0ZWQsIHNraXBOZXh0U29ydCwgZGVmYXVsdFNvcnREZXNjIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuXG4gICAgICBjb25zdCBmaXJzdFNvcnREaXJlY3Rpb24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29sdW1uLCAnZGVmYXVsdFNvcnREZXNjJylcbiAgICAgICAgPyBjb2x1bW4uZGVmYXVsdFNvcnREZXNjXG4gICAgICAgIDogZGVmYXVsdFNvcnREZXNjXG4gICAgICBjb25zdCBzZWNvbmRTb3J0RGlyZWN0aW9uID0gIWZpcnN0U29ydERpcmVjdGlvblxuXG4gICAgICAvLyB3ZSBjYW4ndCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIGZyb20gdGhlIGNvbHVtbiByZXNpemUgbW92ZSBoYW5kbGVyc1xuICAgICAgLy8gYXR0YWNoZWQgdG8gdGhlIGRvY3VtZW50IGJlY2F1c2Ugb2YgcmVhY3QncyBzeW50aGV0aWMgZXZlbnRzXG4gICAgICAvLyBzbyB3ZSBoYXZlIHRvIHByZXZlbnQgdGhlIHNvcnQgZnVuY3Rpb24gZnJvbSBhY3R1YWxseSBzb3J0aW5nXG4gICAgICAvLyBpZiB3ZSBjbGljayBvbiB0aGUgY29sdW1uIHJlc2l6ZSBlbGVtZW50IHdpdGhpbiBhIGhlYWRlci5cbiAgICAgIGlmIChza2lwTmV4dFNvcnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHtcbiAgICAgICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBvblNvcnRlZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBsZXQgbmV3U29ydGVkID0gXy5jbG9uZShzb3J0ZWQgfHwgW10pLm1hcChkID0+IHtcbiAgICAgICAgZC5kZXNjID0gXy5pc1NvcnRpbmdEZXNjKGQpXG4gICAgICAgIHJldHVybiBkXG4gICAgICB9KVxuICAgICAgaWYgKCFfLmlzQXJyYXkoY29sdW1uKSkge1xuICAgICAgICAvLyBTaW5nbGUtU29ydFxuICAgICAgICBjb25zdCBleGlzdGluZ0luZGV4ID0gbmV3U29ydGVkLmZpbmRJbmRleChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbmV3U29ydGVkW2V4aXN0aW5nSW5kZXhdXG4gICAgICAgICAgaWYgKGV4aXN0aW5nLmRlc2MgPT09IHNlY29uZFNvcnREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgICAgICBuZXdTb3J0ZWQuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBleGlzdGluZy5kZXNjID0gZmlyc3RTb3J0RGlyZWN0aW9uXG4gICAgICAgICAgICAgIG5ld1NvcnRlZCA9IFtleGlzdGluZ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhpc3RpbmcuZGVzYyA9IHNlY29uZFNvcnREaXJlY3Rpb25cbiAgICAgICAgICAgIGlmICghYWRkaXRpdmUpIHtcbiAgICAgICAgICAgICAgbmV3U29ydGVkID0gW2V4aXN0aW5nXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhZGRpdGl2ZSkge1xuICAgICAgICAgIG5ld1NvcnRlZC5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdTb3J0ZWQgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgICAgICAgIGRlc2M6IGZpcnN0U29ydERpcmVjdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBNdWx0aS1Tb3J0XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5kZXggPSBuZXdTb3J0ZWQuZmluZEluZGV4KGQgPT4gZC5pZCA9PT0gY29sdW1uWzBdLmlkKVxuICAgICAgICAvLyBFeGlzdGluZyBTb3J0ZWQgQ29sdW1uXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBleGlzdGluZyA9IG5ld1NvcnRlZFtleGlzdGluZ0luZGV4XVxuICAgICAgICAgIGlmIChleGlzdGluZy5kZXNjID09PSBzZWNvbmRTb3J0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoYWRkaXRpdmUpIHtcbiAgICAgICAgICAgICAgbmV3U29ydGVkLnNwbGljZShleGlzdGluZ0luZGV4LCBjb2x1bW4ubGVuZ3RoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29sdW1uLmZvckVhY2goKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBuZXdTb3J0ZWRbZXhpc3RpbmdJbmRleCArIGldLmRlc2MgPSBmaXJzdFNvcnREaXJlY3Rpb25cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sdW1uLmZvckVhY2goKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgbmV3U29ydGVkW2V4aXN0aW5nSW5kZXggKyBpXS5kZXNjID0gc2Vjb25kU29ydERpcmVjdGlvblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFhZGRpdGl2ZSkge1xuICAgICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLnNsaWNlKGV4aXN0aW5nSW5kZXgsIGNvbHVtbi5sZW5ndGgpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIE5ldyBTb3J0IENvbHVtblxuICAgICAgICB9IGVsc2UgaWYgKGFkZGl0aXZlKSB7XG4gICAgICAgICAgbmV3U29ydGVkID0gbmV3U29ydGVkLmNvbmNhdChcbiAgICAgICAgICAgIGNvbHVtbi5tYXAoZCA9PiAoe1xuICAgICAgICAgICAgICBpZDogZC5pZCxcbiAgICAgICAgICAgICAgZGVzYzogZmlyc3RTb3J0RGlyZWN0aW9uLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1NvcnRlZCA9IGNvbHVtbi5tYXAoZCA9PiAoe1xuICAgICAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgICAgICBkZXNjOiBmaXJzdFNvcnREaXJlY3Rpb24sXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxuICAgICAgICB7XG4gICAgICAgICAgcGFnZTogKCFzb3J0ZWQubGVuZ3RoICYmIG5ld1NvcnRlZC5sZW5ndGgpIHx8ICFhZGRpdGl2ZSA/IDAgOiB0aGlzLnN0YXRlLnBhZ2UsXG4gICAgICAgICAgc29ydGVkOiBuZXdTb3J0ZWQsXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IG9uU29ydGVkQ2hhbmdlICYmIG9uU29ydGVkQ2hhbmdlKG5ld1NvcnRlZCwgY29sdW1uLCBhZGRpdGl2ZSlcbiAgICAgIClcbiAgICB9XG5cbiAgICBmaWx0ZXJDb2x1bW4gKGNvbHVtbiwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IHsgZmlsdGVyZWQgfSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG4gICAgICBjb25zdCB7IG9uRmlsdGVyZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcblxuICAgICAgLy8gUmVtb3ZlIG9sZCBmaWx0ZXIgZmlyc3QgaWYgaXQgZXhpc3RzXG4gICAgICBjb25zdCBuZXdGaWx0ZXJpbmcgPSAoZmlsdGVyZWQgfHwgW10pLmZpbHRlcih4ID0+IHguaWQgIT09IGNvbHVtbi5pZClcblxuICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xuICAgICAgICBuZXdGaWx0ZXJpbmcucHVzaCh7XG4gICAgICAgICAgaWQ6IGNvbHVtbi5pZCxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyZWQ6IG5ld0ZpbHRlcmluZyxcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4gb25GaWx0ZXJlZENoYW5nZSAmJiBvbkZpbHRlcmVkQ2hhbmdlKG5ld0ZpbHRlcmluZywgY29sdW1uLCB2YWx1ZSlcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXNpemVDb2x1bW5TdGFydCAoZXZlbnQsIGNvbHVtbiwgaXNUb3VjaCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGNvbnN0IHBhcmVudFdpZHRoID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcblxuICAgICAgbGV0IHBhZ2VYXG4gICAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJhcEV2ZW50cyA9IHRydWVcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcbiAgICAgICAge1xuICAgICAgICAgIGN1cnJlbnRseVJlc2l6aW5nOiB7XG4gICAgICAgICAgICBpZDogY29sdW1uLmlkLFxuICAgICAgICAgICAgc3RhcnRYOiBwYWdlWCxcbiAgICAgICAgICAgIHBhcmVudFdpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnJlc2l6ZUNvbHVtbkVuZClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuXG4gICAgcmVzaXplQ29sdW1uTW92aW5nIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCB7IHJlc2l6ZWQsIGN1cnJlbnRseVJlc2l6aW5nIH0gPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuXG4gICAgICAvLyBEZWxldGUgb2xkIHZhbHVlXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIoeCA9PiB4LmlkICE9PSBjdXJyZW50bHlSZXNpemluZy5pZClcblxuICAgICAgbGV0IHBhZ2VYXG5cbiAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICBwYWdlWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVhcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBtaW4gc2l6ZSB0byAxMCB0byBhY2NvdW50IGZvciBtYXJnaW4gYW5kIGJvcmRlciBvciBlbHNlIHRoZVxuICAgICAgLy8gZ3JvdXAgaGVhZGVycyBkb24ndCBsaW5lIHVwIGNvcnJlY3RseVxuICAgICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLm1heChcbiAgICAgICAgY3VycmVudGx5UmVzaXppbmcucGFyZW50V2lkdGggKyBwYWdlWCAtIGN1cnJlbnRseVJlc2l6aW5nLnN0YXJ0WCxcbiAgICAgICAgMTFcbiAgICAgIClcblxuICAgICAgbmV3UmVzaXplZC5wdXNoKHtcbiAgICAgICAgaWQ6IGN1cnJlbnRseVJlc2l6aW5nLmlkLFxuICAgICAgICB2YWx1ZTogbmV3V2lkdGgsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEoXG4gICAgICAgIHtcbiAgICAgICAgICByZXNpemVkOiBuZXdSZXNpemVkLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiBvblJlc2l6ZWRDaGFuZ2UgJiYgb25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQsIGV2ZW50KVxuICAgICAgKVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbHVtbkVuZCAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBjb25zdCBpc1RvdWNoID0gZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudC50eXBlID09PSAndG91Y2hjYW5jZWwnXG5cbiAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMucmVzaXplQ29sdW1uTW92aW5nKVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMucmVzaXplQ29sdW1uRW5kKVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdHMgYSB0b3VjaCBldmVudCBjbGVhciB0aGUgbW91c2Ugb25lJ3MgYXMgd2VsbCBiZWNhdXNlIHNvbWV0aW1lc1xuICAgICAgLy8gdGhlIG1vdXNlRG93biBldmVudCBnZXRzIGNhbGxlZCBhcyB3ZWxsLCBidXQgdGhlIG1vdXNlVXAgZXZlbnQgZG9lc24ndFxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5yZXNpemVDb2x1bW5FbmQpXG5cbiAgICAgIC8vIFRoZSB0b3VjaCBldmVudHMgZG9uJ3QgcHJvcGFnYXRlIHVwIHRvIHRoZSBzb3J0aW5nJ3Mgb25Nb3VzZURvd24gZXZlbnQgc29cbiAgICAgIC8vIG5vIG5lZWQgdG8gcHJldmVudCBpdCBmcm9tIGhhcHBlbmluZyBvciBlbHNlIHRoZSBmaXJzdCBjbGljayBhZnRlciBhIHRvdWNoXG4gICAgICAvLyBldmVudCByZXNpemUgd2lsbCBub3Qgc29ydCB0aGUgY29sdW1uLlxuICAgICAgaWYgKCFpc1RvdWNoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh7XG4gICAgICAgICAgc2tpcE5leHRTb3J0OiB0cnVlLFxuICAgICAgICAgIGN1cnJlbnRseVJlc2l6aW5nOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiJdfQ==