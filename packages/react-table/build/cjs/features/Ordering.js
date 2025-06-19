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
var Grouping = require('./Grouping.js');

//
function getInitialState() {
  return {
    columnOrder: []
  };
}
function getDefaultOptions(instance) {
  return {
    onColumnOrderChange: utils.makeStateUpdater('columnOrder', instance)
  };
}
function getInstance(instance) {
  return {
    setColumnOrder: function setColumnOrder(updater) {
      return instance.options.onColumnOrderChange == null ? void 0 : instance.options.onColumnOrderChange(updater, utils.functionalUpdate(updater, instance.getState().columnOrder));
    },
    resetColumnOrder: function resetColumnOrder() {
      var _instance$initialStat;

      instance.setColumnOrder((_instance$initialStat = instance.initialState.columnOrder) != null ? _instance$initialStat : []);
    },
    getOrderColumnsFn: utils.memo(function () {
      return [instance.getState().columnOrder, instance.getState().grouping, instance.options.groupedColumnMode];
    }, function (columnOrder, grouping, groupedColumnMode) {
      return function (columns) {
        // Sort grouped columns to the start of the column list
        // before the headers are built
        var orderedColumns = []; // If there is no order, return the normal columns

        if (!(columnOrder != null && columnOrder.length)) {
          orderedColumns = columns;
        } else {
          var columnOrderCopy = [].concat(columnOrder); // If there is an order, make a copy of the columns

          var columnsCopy = [].concat(columns); // And make a new ordered array of the columns
          // Loop over the columns and place them in order into the new array

          var _loop = function _loop() {
            var targetColumnId = columnOrderCopy.shift();
            var foundIndex = columnsCopy.findIndex(function (d) {
              return d.id === targetColumnId;
            });

            if (foundIndex > -1) {
              orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
            }
          };

          while (columnsCopy.length && columnOrderCopy.length) {
            _loop();
          } // If there are any columns left, add them to the end


          orderedColumns = [].concat(orderedColumns, columnsCopy);
        }

        return Grouping.orderColumns(orderedColumns, grouping, groupedColumnMode);
      };
    }, 'getOrderColumnsFn', instance.options.debug)
  };
}

exports.getDefaultOptions = getDefaultOptions;
exports.getInitialState = getInitialState;
exports.getInstance = getInstance;
//# sourceMappingURL=Ordering.js.map
