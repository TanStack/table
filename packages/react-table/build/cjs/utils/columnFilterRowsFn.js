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

var columnFilterRowsFn = function columnFilterRowsFn(instance, columnFilters, rowModel) {
  var newFilteredFlatRows = [];
  var newFilteredRowsById = {};
  var filterFromChildrenUp = instance.options.filterFromChildrenUp;

  var filterRows = function filterRows(rowsToFilter, depth) {
    columnFilters.forEach(function (_ref) {
      var columnId = _ref.id,
          filterValue = _ref.value;
      // Find the columnFilters column
      var column = instance.getColumn(columnId);

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("React-Table: Could not find a column with id: " + columnId);
        }

        throw new Error();
      }

      if (depth === 0) {
        var preFilteredRows = [].concat(rowsToFilter);

        column.getPreFilteredRows = function () {
          return preFilteredRows;
        };
      }

      var filterFn = instance.getColumnFilterFn(column.id);

      if (!filterFn) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("Could not find a valid 'column.filterType' for column with the ID: " + column.id + ".");
        }

        return;
      } // Pass the rows, id, filterValue and column to the filterFn
      // to get the filtered rows back


      rowsToFilter = filterFn(rowsToFilter, [columnId], filterValue);
    });
    return rowsToFilter;
  };

  if (filterFromChildrenUp) {
    var _recurseFilterRows = function _recurseFilterRows(rowsToFilter, depth) {
      if (depth === void 0) {
        depth = 0;
      }

      // Filter from children up
      rowsToFilter = rowsToFilter.filter(function (row) {
        var _row$subRows;

        if (!((_row$subRows = row.subRows) != null && _row$subRows.length)) {
          return true;
        }

        row.subRows = _recurseFilterRows(row.subRows, depth + 1);
        return row.subRows.length;
      });
      rowsToFilter = filterRows(rowsToFilter, depth); // Apply the filter to any subRows

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
    if (depth === void 0) {
      depth = 0;
    }

    // Filter from parents downward
    rowsToFilter = filterRows(rowsToFilter, depth); // Apply the filter to any subRows
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

        row.subRows = recurseFilterRows(row.subRows, depth + 1);
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

exports.columnFilterRowsFn = columnFilterRowsFn;
//# sourceMappingURL=columnFilterRowsFn.js.map
