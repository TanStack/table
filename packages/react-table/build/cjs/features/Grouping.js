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

var aggregationTypes = require('../aggregationTypes.js');
var utils = require('../utils.js');

//
function getDefaultColumn() {
  return {
    aggregationType: 'auto'
  };
}
function getInitialState() {
  return {
    grouping: []
  };
}
function getDefaultOptions(instance) {
  return {
    onGroupingChange: utils.makeStateUpdater('grouping', instance),
    autoResetGrouping: true,
    groupedColumnMode: 'reorder'
  };
}
function createColumn(column, instance) {
  return {
    aggregationType: column.aggregationType,
    getCanGroup: function getCanGroup() {
      return instance.getColumnCanGroup(column.id);
    },
    getGroupedIndex: function getGroupedIndex() {
      return instance.getColumnGroupedIndex(column.id);
    },
    getIsGrouped: function getIsGrouped() {
      return instance.getColumnIsGrouped(column.id);
    },
    toggleGrouping: function toggleGrouping() {
      return instance.toggleColumnGrouping(column.id);
    },
    getToggleGroupingProps: function getToggleGroupingProps(userProps) {
      return instance.getToggleGroupingProps(column.id, userProps);
    }
  };
}
function getInstance(instance) {
  return {
    getColumnAutoAggregationFn: function getColumnAutoAggregationFn(columnId) {
      var firstRow = instance.getCoreFlatRows()[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'number') {
        return aggregationTypes.aggregationTypes.sum;
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return aggregationTypes.aggregationTypes.extent;
      }

      return aggregationTypes.aggregationTypes.count;
    },
    getColumnAggregationFn: function getColumnAggregationFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userAggregationTypes = instance.options.aggregationTypes;

      if (!column) {
        throw new Error();
      }

      return utils.isFunction(column.aggregationType) ? column.aggregationType : column.aggregationType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userAggregationTypes == null ? void 0 : userAggregationTypes[column.aggregationType]) != null ? _ref : aggregationTypes.aggregationTypes[column.aggregationType];
    },
    setGrouping: function setGrouping(updater) {
      return instance.options.onGroupingChange == null ? void 0 : instance.options.onGroupingChange(updater, utils.functionalUpdate(updater, instance.getState().grouping));
    },
    toggleColumnGrouping: function toggleColumnGrouping(columnId) {
      instance.setGrouping(function (old) {
        // Find any existing grouping for this column
        if (old != null && old.includes(columnId)) {
          return old.filter(function (d) {
            return d !== columnId;
          });
        }

        return [].concat(old != null ? old : [], [columnId]);
      });
    },
    getColumnCanGroup: function getColumnCanGroup(columnId) {
      var _ref2, _ref3, _column$enableGroupin;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref2 = (_ref3 = (_column$enableGroupin = column.enableGrouping) != null ? _column$enableGroupin : instance.options.enableGrouping) != null ? _ref3 : column.defaultCanGroup) != null ? _ref2 : !!column.accessorFn;
    },
    getColumnIsGrouped: function getColumnIsGrouped(columnId) {
      var _instance$getState$gr;

      return (_instance$getState$gr = instance.getState().grouping) == null ? void 0 : _instance$getState$gr.includes(columnId);
    },
    getColumnGroupedIndex: function getColumnGroupedIndex(columnId) {
      var _instance$getState$gr2;

      return (_instance$getState$gr2 = instance.getState().grouping) == null ? void 0 : _instance$getState$gr2.indexOf(columnId);
    },
    resetGrouping: function resetGrouping() {
      var _instance$options$ini, _instance$options, _instance$options$ini2;

      instance.setGrouping((_instance$options$ini = (_instance$options = instance.options) == null ? void 0 : (_instance$options$ini2 = _instance$options.initialState) == null ? void 0 : _instance$options$ini2.grouping) != null ? _instance$options$ini : []);
    },
    getToggleGroupingProps: function getToggleGroupingProps(columnId, userProps) {
      var column = instance.getColumn(columnId);

      if (!column) {
        return;
      }

      var canGroup = column.getCanGroup();
      var initialProps = {
        title: canGroup ? 'Toggle Grouping' : undefined,
        onClick: canGroup ? function (e) {
          e.persist();
          column.toggleGrouping == null ? void 0 : column.toggleGrouping();
        } : undefined
      };
      return utils.propGetter(initialProps, userProps);
    },
    getRowIsGrouped: function getRowIsGrouped(rowId) {
      var _instance$getRow;

      return !!((_instance$getRow = instance.getRow(rowId)) != null && _instance$getRow.groupingColumnId);
    },
    getGroupedRowModel: utils.memo(function () {
      return [instance.getState().grouping, instance.getSortedRowModel(), instance.options.groupRowsFn];
    }, function (grouping, rowModel, groupRowsFn) {
      if (!groupRowsFn || !grouping.length) {
        return rowModel;
      }

      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Grouping...');
      return groupRowsFn(instance, grouping, rowModel);
    }, 'getGroupedRowModel', instance.options.debug),
    getPreGroupedRows: function getPreGroupedRows() {
      return instance.getSortedRowModel().rows;
    },
    getPreGroupedFlatRows: function getPreGroupedFlatRows() {
      return instance.getSortedRowModel().flatRows;
    },
    getPreGroupedRowsById: function getPreGroupedRowsById() {
      return instance.getSortedRowModel().rowsById;
    },
    getGroupedRows: function getGroupedRows() {
      return instance.getGroupedRowModel().rows;
    },
    getGroupedFlatRows: function getGroupedFlatRows() {
      return instance.getGroupedRowModel().flatRows;
    },
    getGroupedRowsById: function getGroupedRowsById() {
      return instance.getGroupedRowModel().rowsById;
    }
  };
}
function createRow(row, instance) {
  return {
    getIsGrouped: function getIsGrouped() {
      return instance.getRowIsGrouped(row.id);
    }
  };
}
function createCell(cell, column, row, _instance) {
  return {
    getIsGrouped: function getIsGrouped() {
      return column.getIsGrouped() && column.id === row.groupingColumnId;
    },
    getIsPlaceholder: function getIsPlaceholder() {
      return !cell.getIsGrouped() && column.getIsGrouped();
    },
    getIsAggregated: function getIsAggregated() {
      var _row$subRows;

      return !cell.getIsGrouped() && !cell.getIsPlaceholder() && ((_row$subRows = row.subRows) == null ? void 0 : _row$subRows.length) > 1;
    }
  };
}
function orderColumns(leafColumns, grouping, groupedColumnMode) {
  if (!(grouping != null && grouping.length) || !groupedColumnMode) {
    return leafColumns;
  }

  var nonGroupingColumns = leafColumns.filter(function (col) {
    return !grouping.includes(col.id);
  });

  if (groupedColumnMode === 'remove') {
    return nonGroupingColumns;
  }

  var groupingColumns = grouping.map(function (g) {
    return leafColumns.find(function (col) {
      return col.id === g;
    });
  }).filter(Boolean);
  return [].concat(groupingColumns, nonGroupingColumns);
}

exports.createCell = createCell;
exports.createColumn = createColumn;
exports.createRow = createRow;
exports.getDefaultColumn = getDefaultColumn;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
exports.orderColumns = orderColumns;
//# sourceMappingURL=Grouping.js.map
