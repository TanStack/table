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

var sortRowsFn = function sortRowsFn(instance, sortingState, rowModel) {
  var sortedFlatRows = []; // Filter out sortings that correspond to non existing columns

  var availableSorting = sortingState.filter(function (sort) {
    return instance.getColumnCanSort(sort.id);
  });
  var columnInfoById = {};
  availableSorting.forEach(function (sortEntry) {
    var column = instance.getColumn(sortEntry.id);
    columnInfoById[sortEntry.id] = {
      sortUndefined: column.sortUndefined,
      invertSorting: column.invertSorting,
      sortingFn: instance.getColumnSortingFn(sortEntry.id)
    };
  });

  var sortData = function sortData(rows) {
    // This will also perform a stable sorting using the row index
    // if needed.
    var sortedData = rows.slice();
    sortedData.sort(function (rowA, rowB) {
      for (var i = 0; i < availableSorting.length; i += 1) {
        var _sortEntry$desc;

        var sortEntry = availableSorting[i];
        var columnInfo = columnInfoById[sortEntry.id];
        var isDesc = (_sortEntry$desc = sortEntry == null ? void 0 : sortEntry.desc) != null ? _sortEntry$desc : false;

        if (columnInfo.sortUndefined) {
          var aValue = rowA.values[sortEntry.id];
          var bValue = rowB.values[sortEntry.id];
          var aUndefined = typeof aValue === 'undefined';
          var bUndefined = typeof bValue === 'undefined';

          if (aUndefined || bUndefined) {
            return aUndefined && bUndefined ? 0 : aUndefined ? 1 : -1;
          }
        } // This function should always return in ascending order


        var sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id);

        if (sortInt !== 0) {
          if (isDesc) {
            sortInt *= -1;
          }

          if (columnInfo.invertSorting) {
            sortInt *= -1;
          }

          return sortInt;
        }
      }

      return rowA.index - rowB.index;
    }); // If there are sub-rows, sort them

    sortedData.forEach(function (row) {
      sortedFlatRows.push(row);

      if (!row.subRows || row.subRows.length <= 1) {
        return;
      }

      row.subRows = sortData(row.subRows);
    });
    return sortedData;
  };

  return {
    rows: sortData(rowModel.rows),
    flatRows: sortedFlatRows,
    rowsById: rowModel.rowsById
  };
};

exports.sortRowsFn = sortRowsFn;
//# sourceMappingURL=sortRowsFn.js.map
