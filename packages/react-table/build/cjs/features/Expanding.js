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
var utils = require('../utils.js');

//
function getInitialState() {
  return {
    expanded: {}
  };
}
function getDefaultOptions(instance) {
  return {
    onExpandedChange: utils.makeStateUpdater('expanded', instance),
    autoResetExpanded: true,
    getIsRowExpanded: function getIsRowExpanded(row) {
      return !!(row == null ? void 0 : row.original).expanded;
    },
    expandSubRows: true,
    paginateExpandedRows: true
  };
}
function getInstance(instance) {
  return {
    setExpanded: function setExpanded(updater) {
      return instance.options.onExpandedChange == null ? void 0 : instance.options.onExpandedChange(updater, utils.functionalUpdate(updater, instance.getState().expanded));
    },
    toggleRowExpanded: function toggleRowExpanded(rowId, expanded) {
      if (!rowId) return;
      instance.setExpanded(function (old) {
        var _old, _expanded;

        if (old === void 0) {
          old = {};
        }

        var exists = old === true ? true : !!((_old = old) != null && _old[rowId]);
        var oldExpanded = {};

        if (old === true) {
          Object.keys(instance.getRowsById()).forEach(function (rowId) {
            oldExpanded[rowId] = true;
          });
        } else {
          oldExpanded = old;
        }

        expanded = (_expanded = expanded) != null ? _expanded : !exists;

        if (!exists && expanded) {
          var _extends2;

          return _rollupPluginBabelHelpers["extends"]({}, oldExpanded, (_extends2 = {}, _extends2[rowId] = true, _extends2));
        }

        if (exists && !expanded) {
          var _oldExpanded = oldExpanded;
              _oldExpanded[rowId];
              var rest = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(_oldExpanded, [rowId].map(_rollupPluginBabelHelpers.toPropertyKey));

          return rest;
        }

        return old;
      });
    },
    toggleAllRowsExpanded: function toggleAllRowsExpanded(expanded) {
      if (expanded != null ? expanded : !instance.getIsAllRowsExpanded()) {
        instance.setExpanded(true);
      } else {
        instance.setExpanded({});
      }
    },
    resetExpanded: function resetExpanded() {
      var _instance$options$ini, _instance$options, _instance$options$ini2;

      instance.setExpanded((_instance$options$ini = (_instance$options = instance.options) == null ? void 0 : (_instance$options$ini2 = _instance$options.initialState) == null ? void 0 : _instance$options$ini2.expanded) != null ? _instance$options$ini : {});
    },
    getIsRowExpanded: function getIsRowExpanded(rowId) {
      var _instance$options$get;

      var row = instance.getRow(rowId);

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("[ReactTable] getIsRowExpanded: no row found with id " + rowId);
        }

        throw new Error();
      }

      var expanded = instance.getState().expanded;
      return !!((_instance$options$get = instance.options.getIsRowExpanded == null ? void 0 : instance.options.getIsRowExpanded(row)) != null ? _instance$options$get : expanded || (expanded == null ? void 0 : expanded[rowId]));
    },
    getRowCanExpand: function getRowCanExpand(rowId) {
      var _ref, _ref2, _instance$options$get2, _row$subRows;

      var row = instance.getRow(rowId);

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("[ReactTable] getRowCanExpand: no row found with id " + rowId);
        }

        throw new Error();
      }

      return (_ref = (_ref2 = (_instance$options$get2 = instance.options.getRowCanExpand == null ? void 0 : instance.options.getRowCanExpand(row)) != null ? _instance$options$get2 : instance.options.enableExpanded) != null ? _ref2 : instance.options.defaultCanExpand) != null ? _ref : !!((_row$subRows = row.subRows) != null && _row$subRows.length);
    },
    getToggleExpandedProps: function getToggleExpandedProps(rowId, userProps) {
      var row = instance.getRow(rowId);

      if (!row) {
        return;
      }

      var canExpand = instance.getRowCanExpand(rowId);
      var initialProps = {
        title: canExpand ? 'Toggle Expanded' : undefined,
        onClick: canExpand ? function (e) {
          e.persist();
          instance.toggleRowExpanded(rowId);
        } : undefined
      };
      return utils.propGetter(initialProps, userProps);
    },
    getToggleAllRowsExpandedProps: function getToggleAllRowsExpandedProps(userProps) {
      var initialProps = {
        title: 'Toggle All Expanded',
        onClick: function onClick(e) {
          e.persist();
          instance.toggleAllRowsExpanded();
        }
      };
      return utils.propGetter(initialProps, userProps);
    },
    getIsAllRowsExpanded: function getIsAllRowsExpanded() {
      var expanded = instance.getState().expanded; // If expanded is true, save some cycles and return true

      if (expanded === true) {
        return true;
      } // If any row is not expanded, return false


      if (Object.keys(instance.getRowsById()).some(function (id) {
        return !instance.getIsRowExpanded(id);
      })) {
        return false;
      } // They must all be expanded :shrug:


      return true;
    },
    getExpandedDepth: function getExpandedDepth() {
      var maxDepth = 0;
      var rowIds = instance.getState().expanded === true ? Object.keys(instance.getRowsById()) : Object.keys(instance.getState().expanded);
      rowIds.forEach(function (id) {
        var splitId = id.split('.');
        maxDepth = Math.max(maxDepth, splitId.length);
      });
      return maxDepth;
    },
    getExpandedRowModel: utils.memo(function () {
      return [instance.getState().expanded, instance.getGroupedRowModel(), instance.options.expandRowsFn, instance.options.paginateExpandedRows];
    }, function (expanded, rowModel, expandRowsFn, paginateExpandedRows) {
      if (!expandRowsFn || // Do not expand if rows are not included in pagination
      !paginateExpandedRows || !Object.keys(expanded != null ? expanded : {}).length) {
        return rowModel;
      }

      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Expanding...');
      return expandRowsFn(instance, expanded, rowModel);
    }, 'getExpandedRowModel', instance.options.debug),
    getPreExpandedRows: function getPreExpandedRows() {
      return instance.getGroupedRowModel().rows;
    },
    getPreExpandedFlatRows: function getPreExpandedFlatRows() {
      return instance.getGroupedRowModel().flatRows;
    },
    getPreExpandedRowsById: function getPreExpandedRowsById() {
      return instance.getGroupedRowModel().rowsById;
    },
    getExpandedRows: function getExpandedRows() {
      return instance.getExpandedRowModel().rows;
    },
    getExpandedFlatRows: function getExpandedFlatRows() {
      return instance.getExpandedRowModel().flatRows;
    },
    getExpandedRowsById: function getExpandedRowsById() {
      return instance.getExpandedRowModel().rowsById;
    }
  };
}
function createRow(row, instance) {
  return {
    toggleExpanded: function toggleExpanded(expanded) {
      return void instance.toggleRowExpanded(row.id, expanded);
    },
    getIsExpanded: function getIsExpanded() {
      return instance.getIsRowExpanded(row.id);
    },
    getCanExpand: function getCanExpand() {
      return row.subRows && !!row.subRows.length;
    },
    getToggleExpandedProps: function getToggleExpandedProps(userProps) {
      var initialProps = {
        title: 'Toggle Row Expanded',
        onClick: function onClick(e) {
          e.stopPropagation();
          instance.toggleRowExpanded(row.id);
        }
      };
      return utils.propGetter(initialProps, userProps);
    }
  };
}

exports.createRow = createRow;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
//# sourceMappingURL=Expanding.js.map
