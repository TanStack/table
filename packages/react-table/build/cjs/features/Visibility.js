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
    columnVisibility: {}
  };
}
function getDefaultOptions(instance) {
  return {
    onColumnVisibilityChange: utils.makeStateUpdater('columnVisibility', instance)
  };
}
function getDefaultColumn() {
  return {
    defaultIsVisible: true
  };
}
function createColumn(column, instance) {
  return {
    getCanHide: function getCanHide() {
      return instance.getColumnCanHide(column.id);
    },
    getIsVisible: function getIsVisible() {
      return instance.getColumnIsVisible(column.id);
    },
    toggleVisibility: function toggleVisibility(value) {
      return instance.toggleColumnVisibility(column.id, value);
    },
    getToggleVisibilityProps: function getToggleVisibilityProps(userProps) {
      var props = {
        type: 'checkbox',
        checked: column.getIsVisible == null ? void 0 : column.getIsVisible(),
        title: 'Toggle Column Visibility',
        onChange: function onChange(e) {
          column.toggleVisibility == null ? void 0 : column.toggleVisibility(e.target.checked);
        }
      };
      return utils.propGetter(props, userProps);
    }
  };
}
function getInstance(instance) {
  return {
    getVisibleFlatColumns: utils.memo(function () {
      return [instance.getAllFlatColumns(), instance.getAllFlatColumns().filter(function (d) {
        return d.getIsVisible == null ? void 0 : d.getIsVisible();
      }).map(function (d) {
        return d.id;
      }).join('_')];
    }, function (allFlatColumns) {
      return allFlatColumns.filter(function (d) {
        return d.getIsVisible == null ? void 0 : d.getIsVisible();
      });
    }, 'getVisibleFlatColumns', instance.options.debug),
    getVisibleLeafColumns: utils.memo(function () {
      return [instance.getAllLeafColumns(), instance.getAllLeafColumns().filter(function (d) {
        return d.getIsVisible == null ? void 0 : d.getIsVisible();
      }).map(function (d) {
        return d.id;
      }).join('_')];
    }, function (allFlatColumns) {
      return allFlatColumns.filter(function (d) {
        return d.getIsVisible == null ? void 0 : d.getIsVisible();
      });
    }, 'getVisibleLeafColumns', instance.options.debug),
    setColumnVisibility: function setColumnVisibility(updater) {
      return instance.options.onColumnVisibilityChange == null ? void 0 : instance.options.onColumnVisibilityChange(updater, utils.functionalUpdate(updater, instance.getState().columnVisibility));
    },
    toggleColumnVisibility: function toggleColumnVisibility(columnId, value) {
      if (!columnId) return;

      if (instance.getColumnCanHide(columnId)) {
        instance.setColumnVisibility(function (old) {
          var _extends2;

          return _rollupPluginBabelHelpers["extends"]({}, old, (_extends2 = {}, _extends2[columnId] = value != null ? value : !instance.getColumnIsVisible(columnId), _extends2));
        });
      }
    },
    toggleAllColumnsVisible: function toggleAllColumnsVisible(value) {
      var _value;

      value = (_value = value) != null ? _value : !instance.getIsAllColumnsVisible();
      instance.setColumnVisibility(instance.getAllLeafColumns().reduce(function (obj, column) {
        var _extends3;

        return _rollupPluginBabelHelpers["extends"]({}, obj, (_extends3 = {}, _extends3[column.id] = !value ? !(column.getCanHide != null && column.getCanHide()) : value, _extends3));
      }, {}));
    },
    getColumnIsVisible: function getColumnIsVisible(columnId) {
      var _ref, _instance$getState$co, _instance$getState$co2;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref = (_instance$getState$co = (_instance$getState$co2 = instance.getState().columnVisibility) == null ? void 0 : _instance$getState$co2[columnId]) != null ? _instance$getState$co : column.defaultIsVisible) != null ? _ref : true;
    },
    getColumnCanHide: function getColumnCanHide(columnId) {
      var _ref2, _ref3, _instance$options$ena;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref2 = (_ref3 = (_instance$options$ena = instance.options.enableHiding) != null ? _instance$options$ena : column.enableHiding) != null ? _ref3 : column.defaultCanHide) != null ? _ref2 : true;
    },
    getIsAllColumnsVisible: function getIsAllColumnsVisible() {
      return !instance.getAllLeafColumns().some(function (column) {
        return !(column.getIsVisible != null && column.getIsVisible());
      });
    },
    getIsSomeColumnsVisible: function getIsSomeColumnsVisible() {
      return instance.getAllLeafColumns().some(function (column) {
        return column.getIsVisible == null ? void 0 : column.getIsVisible();
      });
    },
    getToggleAllColumnsVisibilityProps: function getToggleAllColumnsVisibilityProps(userProps) {
      var props = {
        onChange: function onChange(e) {
          var _e$target;

          instance.toggleAllColumnsVisible((_e$target = e.target) == null ? void 0 : _e$target.checked);
        },
        type: 'checkbox',
        title: 'Toggle visibility for all columns',
        checked: instance.getIsAllColumnsVisible(),
        indeterminate: !instance.getIsAllColumnsVisible() && instance.getIsSomeColumnsVisible() ? 'indeterminate' : undefined
      };
      return utils.propGetter(props, userProps);
    }
  };
}

exports.createColumn = createColumn;
exports.getDefaultColumn = getDefaultColumn;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
//# sourceMappingURL=Visibility.js.map
