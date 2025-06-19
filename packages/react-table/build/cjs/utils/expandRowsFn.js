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

var expandRowsFn = function expandRowsFn(instance, _expandedState, sortedRowModel) {
  var expandedRows = [];
  var expandSubRows = instance.options.expandSubRows;

  var handleRow = function handleRow(row) {
    var _row$subRows;

    expandedRows.push(row);

    if (expandSubRows && (_row$subRows = row.subRows) != null && _row$subRows.length && instance.getIsRowExpanded(row.id)) {
      row.subRows.forEach(handleRow);
    }
  };

  sortedRowModel.rows.forEach(handleRow);
  return {
    rows: expandedRows,
    flatRows: sortedRowModel.flatRows,
    rowsById: sortedRowModel.rowsById
  };
};

exports.expandRowsFn = expandRowsFn;
//# sourceMappingURL=expandRowsFn.js.map
