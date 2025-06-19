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

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');
var sortTypes = require('../sortTypes.js');
var utils = require('../utils.js');

//
function getDefaultColumn() {
  return {
    sortType: 'auto'
  };
}
function getInitialState() {
  return {
    sorting: []
  };
}
function getDefaultOptions(instance) {
  return {
    onSortingChange: utils.makeStateUpdater('sorting', instance),
    autoResetSorting: true
  };
}
function createColumn(column, instance) {
  return {
    sortType: column.sortType,
    getCanSort: function getCanSort() {
      return instance.getColumnCanSort(column.id);
    },
    getCanMultiSort: function getCanMultiSort() {
      return instance.getColumnCanMultiSort(column.id);
    },
    getSortIndex: function getSortIndex() {
      return instance.getColumnSortIndex(column.id);
    },
    getIsSorted: function getIsSorted() {
      return instance.getColumnIsSorted(column.id);
    },
    toggleSorting: function toggleSorting(desc, isMulti) {
      return instance.toggleColumnSorting(column.id, desc, isMulti);
    },
    getToggleSortingProps: function getToggleSortingProps(userProps) {
      return instance.getToggleSortingProps(column.id, userProps);
    }
  };
}
function getInstance(instance) {
  return {
    getColumnAutoSortingFn: function getColumnAutoSortingFn(columnId) {
      var firstRow = instance.getGlobalFilteredRowModel().flatRows[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'string') {
        return sortTypes.sortTypes.alphanumeric;
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return sortTypes.sortTypes.datetime;
      }

      return sortTypes.sortTypes.basic;
    },
    getColumnSortingFn: function getColumnSortingFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userSortTypes = instance.options.sortTypes;

      if (!column) {
        throw new Error();
      }

      return utils.isFunction(column.sortType) ? column.sortType : column.sortType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userSortTypes == null ? void 0 : userSortTypes[column.sortType]) != null ? _ref : sortTypes.sortTypes[column.sortType];
    },
    setSorting: function setSorting(updater) {
      return instance.options.onSortingChange == null ? void 0 : instance.options.onSortingChange(updater, utils.functionalUpdate(updater, instance.getState().sorting));
    },
    toggleColumnSorting: function toggleColumnSorting(columnId, desc, multi) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      instance.setSorting(function (old) {
        var _column$sortDescFirst, _instance$options$ena, _instance$options$ena2;

        // Find any existing sorting for this column
        var existingSorting = old == null ? void 0 : old.find(function (d) {
          return d.id === columnId;
        });
        var existingIndex = old == null ? void 0 : old.findIndex(function (d) {
          return d.id === columnId;
        });
        var hasDescDefined = typeof desc !== 'undefined' && desc !== null;
        var newSorting = []; // What should we do with this sort action?

        var sortAction;

        if (!column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = 'toggle';
          } else {
            sortAction = 'add';
          }
        } else {
          // Normal mode
          if (old != null && old.length && existingIndex !== old.length - 1) {
            sortAction = 'replace';
          } else if (existingSorting) {
            sortAction = 'toggle';
          } else {
            sortAction = 'replace';
          }
        }

        var sortDescFirst = (_column$sortDescFirst = column.sortDescFirst) != null ? _column$sortDescFirst : instance.options.sortDescFirst; // Handle toggle states that will remove the sorting

        if (sortAction === 'toggle' && ( // Must be toggling
        (_instance$options$ena = instance.options.enableSortingRemoval) != null ? _instance$options$ena : true) && // If enableSortRemove, enable in general
        !hasDescDefined && ( // Must not be setting desc
        multi ? (_instance$options$ena2 = instance.options.enableMultiRemove) != null ? _instance$options$ena2 : true : true) && ( // If multi, don't allow if enableMultiRemove
        existingSorting != null && existingSorting.desc // Finally, detect if it should indeed be removed
        ? !sortDescFirst : sortDescFirst)) {
          sortAction = 'remove';
        }

        if (sortAction === 'replace') {
          newSorting = [{
            id: columnId,
            desc: hasDescDefined ? desc : !!sortDescFirst
          }];
        } else if (sortAction === 'add' && old != null && old.length) {
          var _instance$options$max;

          newSorting = [].concat(old, [{
            id: columnId,
            desc: hasDescDefined ? desc : !!sortDescFirst
          }]); // Take latest n columns

          newSorting.splice(0, newSorting.length - ((_instance$options$max = instance.options.maxMultiSortColCount) != null ? _instance$options$max : Number.MAX_SAFE_INTEGER));
        } else if (sortAction === 'toggle' && old != null && old.length) {
          // This flips (or sets) the
          newSorting = old.map(function (d) {
            if (d.id === columnId) {
              return _rollupPluginBabelHelpers["extends"]({}, d, {
                desc: hasDescDefined ? desc : !(existingSorting != null && existingSorting.desc)
              });
            }

            return d;
          });
        } else if (sortAction === 'remove' && old != null && old.length) {
          newSorting = old.filter(function (d) {
            return d.id !== columnId;
          });
        }

        return newSorting;
      });
    },
    getColumnCanSort: function getColumnCanSort(columnId) {
      var _ref2, _ref3, _column$enableSorting;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref2 = (_ref3 = (_column$enableSorting = column.enableSorting) != null ? _column$enableSorting : instance.options.enableSorting) != null ? _ref3 : column.defaultCanSort) != null ? _ref2 : !!column.accessorFn;
    },
    getColumnCanMultiSort: function getColumnCanMultiSort(columnId) {
      var _ref4, _column$enableMultiSo;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref4 = (_column$enableMultiSo = column.enableMultiSort) != null ? _column$enableMultiSo : instance.options.enableMultiSort) != null ? _ref4 : !!column.accessorFn;
    },
    getColumnIsSorted: function getColumnIsSorted(columnId) {
      var _instance$getState$so;

      var columnSort = (_instance$getState$so = instance.getState().sorting) == null ? void 0 : _instance$getState$so.find(function (d) {
        return d.id === columnId;
      });
      return !columnSort ? false : columnSort.desc ? 'desc' : 'asc';
    },
    getColumnSortIndex: function getColumnSortIndex(columnId) {
      var _instance$getState$so2, _instance$getState$so3;

      return (_instance$getState$so2 = (_instance$getState$so3 = instance.getState().sorting) == null ? void 0 : _instance$getState$so3.findIndex(function (d) {
        return d.id === columnId;
      })) != null ? _instance$getState$so2 : -1;
    },
    resetSorting: function resetSorting() {
      var _instance$options$ini, _instance$options, _instance$options$ini2;

      instance.setSorting((_instance$options$ini = (_instance$options = instance.options) == null ? void 0 : (_instance$options$ini2 = _instance$options.initialState) == null ? void 0 : _instance$options$ini2.sorting) != null ? _instance$options$ini : []);
    },
    getToggleSortingProps: function getToggleSortingProps(columnId, userProps) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      var canSort = column.getCanSort();
      var initialProps = {
        title: canSort ? 'Toggle Sorting' : undefined,
        onClick: canSort ? function (e) {
          e.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(undefined, column.getCanMultiSort() ? instance.options.isMultiSortEvent == null ? void 0 : instance.options.isMultiSortEvent(e) : false);
        } : undefined
      };
      return utils.propGetter(initialProps, userProps);
    },
    getSortedRowModel: utils.memo(function () {
      return [instance.getState().sorting, instance.getGlobalFilteredRowModel(), instance.options.sortRowsFn];
    }, function (sorting, rowModel, sortingFn) {
      if (!sortingFn || !(sorting != null && sorting.length)) {
        return rowModel;
      }

      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Sorting...');
      return sortingFn(instance, sorting, rowModel);
    }, 'getSortedRowModel', instance.options.debug),
    getPreSortedRows: function getPreSortedRows() {
      return instance.getGlobalFilteredRowModel().rows;
    },
    getPreSortedFlatRows: function getPreSortedFlatRows() {
      return instance.getGlobalFilteredRowModel().flatRows;
    },
    getPreSortedRowsById: function getPreSortedRowsById() {
      return instance.getGlobalFilteredRowModel().rowsById;
    },
    getSortedRows: function getSortedRows() {
      return instance.getSortedRowModel().rows;
    },
    getSortedFlatRows: function getSortedFlatRows() {
      return instance.getSortedRowModel().flatRows;
    },
    getSortedRowsById: function getSortedRowsById() {
      return instance.getSortedRowModel().rowsById;
    }
  };
}

exports.createColumn = createColumn;
exports.getDefaultColumn = getDefaultColumn;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
//# sourceMappingURL=Sorting.js.map
