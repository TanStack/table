/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var filterTypes = require('../filterTypes.js');
var utils = require('../utils.js');

//
function getDefaultColumn() {
  return {
    filterType: 'auto'
  };
}
function getInitialState() {
  return {
    columnFilters: [],
    globalFilter: undefined
  };
}
function getDefaultOptions(instance) {
  return {
    onColumnFiltersChange: utils.makeStateUpdater('columnFilters', instance),
    onGlobalFilterChange: utils.makeStateUpdater('globalFilter', instance),
    autoResetColumnFilters: true,
    filterFromChildrenUp: true,
    autoResetGlobalFilter: true,
    globalFilterType: 'auto',
    getColumnCanGlobalFilterFn: function getColumnCanGlobalFilterFn(column) {
      var _instance$getCoreFlat, _instance$getCoreFlat2;

      var value = (_instance$getCoreFlat = instance.getCoreFlatRows()[0]) == null ? void 0 : (_instance$getCoreFlat2 = _instance$getCoreFlat.getAllCellsByColumnId()[column.id]) == null ? void 0 : _instance$getCoreFlat2.value;
      return typeof value === 'string';
    }
  };
}
function createColumn(column, instance) {
  var getFacetInfo = utils.memo(function () {
    return [column.getPreFilteredRows()];
  }, function (rows) {
    var _rows$0$values$column, _rows$, _rows$0$values$column2, _rows$2;

    if (rows === void 0) {
      rows = [];
    }

    var preFilteredUniqueValues = new Map();
    var preFilteredMinMaxValues = [(_rows$0$values$column = (_rows$ = rows[0]) == null ? void 0 : _rows$.values[column.id]) != null ? _rows$0$values$column : null, (_rows$0$values$column2 = (_rows$2 = rows[0]) == null ? void 0 : _rows$2.values[column.id]) != null ? _rows$0$values$column2 : null];

    for (var i = 0; i < rows.length; i++) {
      var _rows$i;

      var _value = (_rows$i = rows[i]) == null ? void 0 : _rows$i.values[column.id];

      if (preFilteredUniqueValues.has(_value)) {
        var _preFilteredUniqueVal;

        preFilteredUniqueValues.set(_value, ((_preFilteredUniqueVal = preFilteredUniqueValues.get(_value)) != null ? _preFilteredUniqueVal : 0) + 1);
      } else {
        preFilteredUniqueValues.set(_value, 1);
      }

      if (_value < preFilteredMinMaxValues[0]) {
        preFilteredMinMaxValues[0] = _value;
      } else if (_value > preFilteredMinMaxValues[1]) {
        preFilteredMinMaxValues[1] = _value;
      }
    }

    return {
      preFilteredUniqueValues: preFilteredUniqueValues,
      preFilteredMinMaxValues: preFilteredMinMaxValues
    };
  }, 'column.getFacetInfo', instance.options.debug);
  return {
    filterType: column.filterType,
    getCanColumnFilter: function getCanColumnFilter() {
      return instance.getColumnCanColumnFilter(column.id);
    },
    getCanGlobalFilter: function getCanGlobalFilter() {
      return instance.getColumnCanGlobalFilter(column.id);
    },
    getColumnFilterIndex: function getColumnFilterIndex() {
      return instance.getColumnFilterIndex(column.id);
    },
    getIsColumnFiltered: function getIsColumnFiltered() {
      return instance.getColumnIsFiltered(column.id);
    },
    getColumnFilterValue: function getColumnFilterValue() {
      return instance.getColumnFilterValue(column.id);
    },
    setColumnFilterValue: function setColumnFilterValue(val) {
      return instance.setColumnFilterValue(column.id, val);
    },
    getPreFilteredUniqueValues: function getPreFilteredUniqueValues() {
      return getFacetInfo().preFilteredUniqueValues;
    },
    getPreFilteredMinMaxValues: function getPreFilteredMinMaxValues() {
      return getFacetInfo().preFilteredMinMaxValues;
    },
    getPreFilteredRows: function getPreFilteredRows() {
      return undefined;
    }
  };
}
function getInstance(instance) {
  return {
    getColumnAutoFilterFn: function getColumnAutoFilterFn(columnId) {
      var firstRow = instance.getCoreFlatRows()[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'string') {
        return filterTypes.filterTypes.includesString;
      }

      if (typeof value === 'number') {
        return filterTypes.filterTypes.betweenNumberRange;
      }

      if (value !== null && typeof value === 'object') {
        return filterTypes.filterTypes.equals;
      }

      if (Array.isArray(value)) {
        return filterTypes.filterTypes.arrIncludes;
      }

      return filterTypes.filterTypes.weakEquals;
    },
    getGlobalAutoFilterFn: function getGlobalAutoFilterFn() {
      return filterTypes.filterTypes.includesString;
    },
    getColumnFilterFn: function getColumnFilterFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userFilterTypes = instance.options.filterTypes;

      if (!column) {
        throw new Error();
      }

      return utils.isFunction(column.filterType) ? column.filterType : column.filterType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userFilterTypes == null ? void 0 : userFilterTypes[column.filterType]) != null ? _ref : filterTypes.filterTypes[column.filterType];
    },
    getGlobalFilterFn: function getGlobalFilterFn() {
      var _ref2;

      var _instance$options = instance.options,
          userFilterTypes = _instance$options.filterTypes,
          globalFilterType = _instance$options.globalFilterType;
      return utils.isFunction(globalFilterType) ? globalFilterType : globalFilterType === 'auto' ? instance.getGlobalAutoFilterFn() : (_ref2 = userFilterTypes == null ? void 0 : userFilterTypes[globalFilterType]) != null ? _ref2 : filterTypes.filterTypes[globalFilterType];
    },
    setColumnFilters: function setColumnFilters(updater) {
      var leafColumns = instance.getAllLeafColumns();

      var updateFn = function updateFn(old) {
        var _functionalUpdate;

        return (_functionalUpdate = utils.functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter(function (filter) {
          var column = leafColumns.find(function (d) {
            return d.id === filter.id;
          });

          if (column) {
            var filterFn = instance.getColumnFilterFn(column.id);

            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false;
            }
          }

          return true;
        });
      };

      instance.options.onColumnFiltersChange == null ? void 0 : instance.options.onColumnFiltersChange(updateFn, updateFn(instance.getState().columnFilters));
    },
    setGlobalFilter: function setGlobalFilter(updater) {
      instance.options.onGlobalFilterChange == null ? void 0 : instance.options.onGlobalFilterChange(updater, utils.functionalUpdate(updater, instance.getState().globalFilter));
    },
    resetGlobalFilter: function resetGlobalFilter() {
      instance.setGlobalFilter(undefined);
    },
    getColumnCanColumnFilter: function getColumnCanColumnFilter(columnId) {
      var _ref3, _ref4, _ref5, _ref6, _ref7, _column$enableAllFilt;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_ref7 = (_column$enableAllFilt = column.enableAllFilters) != null ? _column$enableAllFilt : column.enableColumnFilter) != null ? _ref7 : instance.options.enableFilters) != null ? _ref6 : instance.options.enableColumnFilters) != null ? _ref5 : column.defaultCanFilter) != null ? _ref4 : column.defaultCanColumnFilter) != null ? _ref3 : !!column.accessorFn;
    },
    getColumnCanGlobalFilter: function getColumnCanGlobalFilter(columnId) {
      var _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _instance$options$ena;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref8 = ((_ref9 = (_ref10 = (_ref11 = (_ref12 = (_ref13 = (_instance$options$ena = instance.options.enableFilters) != null ? _instance$options$ena : instance.options.enableGlobalFilter) != null ? _ref13 : column.enableAllFilters) != null ? _ref12 : column.enableGlobalFilter) != null ? _ref11 : column.defaultCanFilter) != null ? _ref10 : column.defaultCanGlobalFilter) != null ? _ref9 : !!column.accessorFn) && (instance.options.getColumnCanGlobalFilterFn == null ? void 0 : instance.options.getColumnCanGlobalFilterFn(column))) != null ? _ref8 : true;
    },
    getColumnIsFiltered: function getColumnIsFiltered(columnId) {
      return instance.getColumnFilterIndex(columnId) > -1;
    },
    getColumnFilterValue: function getColumnFilterValue(columnId) {
      var _instance$getState$co, _instance$getState$co2;

      return (_instance$getState$co = instance.getState().columnFilters) == null ? void 0 : (_instance$getState$co2 = _instance$getState$co.find(function (d) {
        return d.id === columnId;
      })) == null ? void 0 : _instance$getState$co2.value;
    },
    getColumnFilterIndex: function getColumnFilterIndex(columnId) {
      var _instance$getState$co3, _instance$getState$co4;

      return (_instance$getState$co3 = (_instance$getState$co4 = instance.getState().columnFilters) == null ? void 0 : _instance$getState$co4.findIndex(function (d) {
        return d.id === columnId;
      })) != null ? _instance$getState$co3 : -1;
    },
    setColumnFilterValue: function setColumnFilterValue(columnId, value) {
      if (!columnId) return;
      instance.setColumnFilters(function (old) {
        var column = instance.getColumn(columnId);

        if (!column) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn("React-Table: Could not find a column with id: " + columnId);
          }

          throw new Error();
        }

        var filterFn = instance.getColumnFilterFn(column.id);
        var previousfilter = old == null ? void 0 : old.find(function (d) {
          return d.id === columnId;
        });
        var newFilter = utils.functionalUpdate(value, previousfilter ? previousfilter.value : undefined); //

        if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
          var _old$filter;

          return (_old$filter = old == null ? void 0 : old.filter(function (d) {
            return d.id !== columnId;
          })) != null ? _old$filter : [];
        }

        var newFilterObj = {
          id: columnId,
          value: newFilter
        };

        if (previousfilter) {
          var _old$map;

          return (_old$map = old == null ? void 0 : old.map(function (d) {
            if (d.id === columnId) {
              return newFilterObj;
            }

            return d;
          })) != null ? _old$map : [];
        }

        if (old != null && old.length) {
          return [].concat(old, [newFilterObj]);
        }

        return [newFilterObj];
      });
    },
    resetColumnFilters: function resetColumnFilters() {
      var _instance$options$ini, _instance$options2, _instance$options2$in;

      instance.setColumnFilters((_instance$options$ini = (_instance$options2 = instance.options) == null ? void 0 : (_instance$options2$in = _instance$options2.initialState) == null ? void 0 : _instance$options2$in.columnFilters) != null ? _instance$options$ini : []);
    },
    getColumnFilteredRowModel: utils.memo(function () {
      return [instance.getState().columnFilters, instance.getCoreRowModel(), instance.options.columnFilterRowsFn];
    }, function (columnFilters, rowModel, columnFiltersFn) {
      var columnFilteredRowModel = function () {
        if (!(columnFilters != null && columnFilters.length) || !columnFiltersFn) {
          return rowModel;
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Column Filtering...');
        return columnFiltersFn(instance, columnFilters, rowModel);
      }(); // Now that each filtered column has it's partially filtered rows,
      // lets assign the final filtered rows to all of the other columns


      var nonFilteredColumns = instance.getAllLeafColumns().filter(function (column) {
        var _instance$getState$co5;

        return !((_instance$getState$co5 = instance.getState().columnFilters) != null && _instance$getState$co5.find(function (d) {
          return d.id === column.id;
        }));
      }); // This essentially enables faceted filter options to be built easily
      // using every column's preFilteredRows value

      nonFilteredColumns.forEach(function (column) {
        column.getPreFilteredRows = function () {
          return columnFilteredRowModel.rows;
        };
      });
      return columnFilteredRowModel;
    }, 'getColumnFilteredRowModel', instance.options.debug),
    getPreColumnFilteredRows: function getPreColumnFilteredRows() {
      return instance.getCoreRowModel().rows;
    },
    getPreColumnFilteredFlatRows: function getPreColumnFilteredFlatRows() {
      return instance.getCoreRowModel().flatRows;
    },
    getPreColumnFilteredRowsById: function getPreColumnFilteredRowsById() {
      return instance.getCoreRowModel().rowsById;
    },
    getColumnFilteredRows: function getColumnFilteredRows() {
      return instance.getColumnFilteredRowModel().rows;
    },
    getColumnFilteredFlatRows: function getColumnFilteredFlatRows() {
      return instance.getColumnFilteredRowModel().flatRows;
    },
    getColumnFilteredRowsById: function getColumnFilteredRowsById() {
      return instance.getColumnFilteredRowModel().rowsById;
    },
    getGlobalFilteredRowModel: utils.memo(function () {
      return [instance.getState().globalFilter, instance.getColumnFilteredRowModel(), instance.options.globalFilterRowsFn];
    }, function (globalFilterValue, columnFilteredRowModel, globalFiltersFn) {
      var globalFilteredRowModel = function () {
        if (!globalFiltersFn || !globalFilterValue) {
          return columnFilteredRowModel;
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Global Filtering...');
        return globalFiltersFn(instance, globalFilterValue, columnFilteredRowModel);
      }(); // Now that each filtered column has it's partially filtered rows,
      // lets assign the final filtered rows to all of the other columns


      var nonFilteredColumns = instance.getAllLeafColumns().filter(function (column) {
        var _instance$getState$co6;

        return !((_instance$getState$co6 = instance.getState().columnFilters) != null && _instance$getState$co6.find(function (d) {
          return d.id === column.id;
        }));
      }); // This essentially enables faceted filter options to be built easily
      // using every column's preFilteredRows value

      nonFilteredColumns.forEach(function (column) {
        column.getPreFilteredRows = function () {
          return globalFilteredRowModel.rows;
        };
      });
      return globalFilteredRowModel;
    }, 'getGlobalFilteredRowModel', instance.options.debug),
    getPreGlobalFilteredRows: function getPreGlobalFilteredRows() {
      return instance.getColumnFilteredRowModel().rows;
    },
    getPreGlobalFilteredFlatRows: function getPreGlobalFilteredFlatRows() {
      return instance.getColumnFilteredRowModel().flatRows;
    },
    getPreGlobalFilteredRowsById: function getPreGlobalFilteredRowsById() {
      return instance.getColumnFilteredRowModel().rowsById;
    },
    getGlobalFilteredRows: function getGlobalFilteredRows() {
      return instance.getGlobalFilteredRowModel().rows;
    },
    getGlobalFilteredFlatRows: function getGlobalFilteredFlatRows() {
      return instance.getGlobalFilteredRowModel().flatRows;
    },
    getGlobalFilteredRowsById: function getGlobalFilteredRowsById() {
      return instance.getGlobalFilteredRowModel().rowsById;
    }
  };
}
function shouldAutoRemoveFilter(filterFn, value, column) {
  return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === 'undefined' || typeof value === 'string' && !value;
}

exports.createColumn = createColumn;
exports.getDefaultColumn = getDefaultColumn;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
exports.shouldAutoRemoveFilter = shouldAutoRemoveFilter;
//# sourceMappingURL=Filters.js.map
