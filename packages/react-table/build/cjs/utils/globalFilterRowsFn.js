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

var globalFilterRowsFn = function globalFilterRowsFn(instance, globalFilter, rowModel) {
  var newFilteredFlatRows = [];
  var newFilteredRowsById = {};
  var filterFromChildrenUp = instance.options.filterFromChildrenUp;
  var filterFn = instance.getGlobalFilterFn();

  if (!filterFn) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Could not find a valid 'globalFilterType'");
    }

    return rowModel;
  }

  var filterableColumns = instance.getAllLeafColumns().filter(function (column) {
    return column.getCanGlobalFilter();
  });
  var filterableColumnIds = filterableColumns.map(function (d) {
    return d.id;
  });

  if (filterFromChildrenUp) {
    var _recurseFilterRows = function _recurseFilterRows(rowsToFilter, depth) {

      // Filter from children up
      rowsToFilter = rowsToFilter.filter(function (row) {
        var _row$subRows;

        if (!((_row$subRows = row.subRows) != null && _row$subRows.length)) {
          return true;
        }

        row.subRows = _recurseFilterRows(row.subRows);
        return row.subRows.length;
      });
      rowsToFilter = filterFn(rowsToFilter, filterableColumnIds, globalFilter); // Apply the filter to any subRows

      rowsToFilter.forEach(function (row) {
        newFilteredFlatRows.push(row);
        newFilteredRowsById[row.id] = row;
      });
      return rowsToFilter;
    };

    return {
      rows: _recurseFilterRows(rowModel.rows),
      flatRows: newFilteredFlatRows,
      rowsById: newFilteredRowsById
    };
  } // Filters top level and nested rows


  var recurseFilterRows = function recurseFilterRows(rowsToFilter, depth) {

    // Filter from parents downward
    rowsToFilter = filterFn(rowsToFilter, filterableColumnIds, globalFilter); // Apply the filter to any subRows
    // We technically could do this recursively in the above loop,
    // but that would severely hinder the API for the user, since they
    // would be required to do that recursion in some scenarios

    rowsToFilter.forEach(function (row) {
      newFilteredFlatRows.push(row);
      newFilteredRowsById[row.id] = row;

      if (!filterFromChildrenUp) {
        var _row$subRows2;

        if (!((_row$subRows2 = row.subRows) != null && _row$subRows2.length)) {
          return;
        }

        row.subRows = recurseFilterRows(row.subRows);
      }
    });
    return rowsToFilter;
  };

  return {
    rows: recurseFilterRows(rowModel.rows),
    flatRows: newFilteredFlatRows,
    rowsById: newFilteredRowsById
  };
};

exports.globalFilterRowsFn = globalFilterRowsFn;
//# sourceMappingURL=globalFilterRowsFn.js.map
