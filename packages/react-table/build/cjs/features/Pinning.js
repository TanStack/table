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

var utils = require('../utils.js');

//
function getInitialState() {
  return {
    columnPinning: {
      left: [],
      right: []
    }
  };
}
function getDefaultOptions(instance) {
  return {
    onColumnPinningChange: utils.makeStateUpdater('columnPinning', instance)
  };
}
function createColumn(column, instance) {
  return {
    getCanPin: function getCanPin() {
      return instance.getColumnCanPin(column.id);
    },
    getPinnedIndex: function getPinnedIndex() {
      return instance.getColumnPinnedIndex(column.id);
    },
    getIsPinned: function getIsPinned() {
      return instance.getColumnIsPinned(column.id);
    },
    pin: function pin(position) {
      return instance.pinColumn(column.id, position);
    }
  };
}
function getInstance(instance) {
  return {
    setColumnPinning: function setColumnPinning(updater) {
      return instance.options.onColumnPinningChange == null ? void 0 : instance.options.onColumnPinningChange(updater, utils.functionalUpdate(updater, instance.getState().columnPinning));
    },
    resetColumnPinning: function resetColumnPinning() {
      var _instance$options$ini, _instance$options$ini2;

      return instance.setColumnPinning((_instance$options$ini = (_instance$options$ini2 = instance.options.initialState) == null ? void 0 : _instance$options$ini2.columnPinning) != null ? _instance$options$ini : {});
    },
    pinColumn: function pinColumn(columnId, position) {
      var column = instance.getColumn(columnId);
      var columnIds = column == null ? void 0 : column.getLeafColumns().map(function (d) {
        return d.id;
      }).filter(Boolean);
      instance.setColumnPinning(function (old) {
        var _old$left3, _old$right3;

        if (position === 'right') {
          var _old$left, _old$right;

          return {
            left: ((_old$left = old == null ? void 0 : old.left) != null ? _old$left : []).filter(function (d) {
              return !(columnIds != null && columnIds.includes(d));
            }),
            right: [].concat(((_old$right = old == null ? void 0 : old.right) != null ? _old$right : []).filter(function (d) {
              return !(columnIds != null && columnIds.includes(d));
            }), columnIds)
          };
        }

        if (position === 'left') {
          var _old$left2, _old$right2;

          return {
            left: [].concat(((_old$left2 = old == null ? void 0 : old.left) != null ? _old$left2 : []).filter(function (d) {
              return !(columnIds != null && columnIds.includes(d));
            }), columnIds),
            right: ((_old$right2 = old == null ? void 0 : old.right) != null ? _old$right2 : []).filter(function (d) {
              return !(columnIds != null && columnIds.includes(d));
            })
          };
        }

        return {
          left: ((_old$left3 = old == null ? void 0 : old.left) != null ? _old$left3 : []).filter(function (d) {
            return !(columnIds != null && columnIds.includes(d));
          }),
          right: ((_old$right3 = old == null ? void 0 : old.right) != null ? _old$right3 : []).filter(function (d) {
            return !(columnIds != null && columnIds.includes(d));
          })
        };
      });
    },
    getColumnCanPin: function getColumnCanPin(columnId) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      var leafColumns = column.getLeafColumns();
      return leafColumns.some(function (d) {
        var _ref, _ref2, _d$enablePinning;

        return (_ref = (_ref2 = (_d$enablePinning = d.enablePinning) != null ? _d$enablePinning : instance.options.enablePinning) != null ? _ref2 : d.defaultCanPin) != null ? _ref : !!d.accessorFn;
      });
    },
    getColumnIsPinned: function getColumnIsPinned(columnId) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      var leafColumnIds = column.getLeafColumns().map(function (d) {
        return d.id;
      });
      var _instance$getState$co = instance.getState().columnPinning,
          left = _instance$getState$co.left,
          right = _instance$getState$co.right;
      var isLeft = leafColumnIds.some(function (d) {
        return left == null ? void 0 : left.includes(d);
      });
      var isRight = leafColumnIds.some(function (d) {
        return right == null ? void 0 : right.includes(d);
      });

      if (isLeft && isRight) {
        return 'both';
      }

      return isLeft ? 'left' : isRight ? 'right' : false;
    },
    getColumnPinnedIndex: function getColumnPinnedIndex(columnId) {
      var _instance$getState$co2, _instance$getState$co3, _instance$getState$co4;

      var position = instance.getColumnIsPinned(columnId);

      if (position === 'both') {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("Column " + columnId + " has leaf columns that are pinned on both sides");
        }

        throw new Error();
      }

      return position ? (_instance$getState$co2 = (_instance$getState$co3 = instance.getState().columnPinning) == null ? void 0 : (_instance$getState$co4 = _instance$getState$co3[position]) == null ? void 0 : _instance$getState$co4.indexOf(columnId)) != null ? _instance$getState$co2 : -1 : 0;
    }
  };
}

exports.createColumn = createColumn;
exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
//# sourceMappingURL=Pinning.js.map
