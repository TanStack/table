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

var groupRowsFn = function groupRowsFn(instance, groupingState, sortedRowModel) {
  // Filter the grouping list down to columns that exist
  var existingGrouping = groupingState.filter(function (columnId) {
    return instance.getColumn(columnId);
  }); // Find the columns that can or are aggregating
  // Uses each column to aggregate rows into a single value

  var aggregateRowsToValues = function aggregateRowsToValues(leafRows, groupedRows, depth) {
    var values = {};
    instance.getAllLeafColumns().forEach(function (column) {
      // Don't aggregate columns that are in the grouping
      if (existingGrouping.includes(column.id)) {
        values[column.id] = groupedRows[0] ? groupedRows[0].values[column.id] : null;
        return;
      } // Aggregate the values


      var aggregateFn = instance.getColumnAggregationFn(column.id);

      if (aggregateFn) {
        // Get the columnValues to aggregate
        var groupedValues = groupedRows.map(function (row) {
          return row.values[column.id];
        }); // Get the columnValues to aggregate

        var leafValues = leafRows.map(function (row) {
          var columnValue = row.values[column.id];

          if (!depth && column.aggregateValue) {
            columnValue = column.aggregateValue(columnValue);
          }

          return columnValue;
        });
        values[column.id] = aggregateFn(leafValues, groupedValues);
      } else if (column.aggregationType) {
        console.info({
          column: column
        });
        throw new Error(process.env.NODE_ENV !== 'production' ? "React Table: Invalid column.aggregateType option for column listed above" : '');
      } else {
        values[column.id] = null;
      }
    });
    return values;
  };

  var groupedFlatRows = [];
  var groupedRowsById = {}; // const onlyGroupedFlatRows: Row[] = [];
  // const onlyGroupedRowsById: Record<RowId, Row> = {};
  // const nonGroupedFlatRows: Row[] = [];
  // const nonGroupedRowsById: Record<RowId, Row> = {};
  // Recursively group the data

  var groupUpRecursively = function groupUpRecursively(rows, depth, parentId) {
    if (depth === void 0) {
      depth = 0;
    }

    // This is the last level, just return the rows
    if (depth === existingGrouping.length) {
      return rows;
    }

    var columnId = existingGrouping[depth]; // Group the rows together for this level

    var rowGroupsMap = groupBy(rows, columnId); // Peform aggregations for each group

    var aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(function (_ref, index) {
      var groupingValue = _ref[0],
          groupedRows = _ref[1];
      var id = columnId + ":" + groupingValue;
      id = parentId ? parentId + ">" + id : id; // First, Recurse to group sub rows before aggregation

      var subRows = groupUpRecursively(groupedRows, depth + 1, id); // Flatten the leaf rows of the rows in this group

      var leafRows = depth ? utils.flattenBy(groupedRows, function (row) {
        return row.leafRows;
      }) : groupedRows;
      var values = aggregateRowsToValues(leafRows, groupedRows, depth);
      var row = instance.createRow(id, undefined, index, depth, values);
      Object.assign(row, {
        groupingColumnId: columnId,
        groupingValue: groupingValue,
        subRows: subRows,
        leafRows: leafRows
      });
      subRows.forEach(function (subRow) {
        groupedFlatRows.push(subRow);
        groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
        //   onlyGroupedFlatRows.push(subRow);
        //   onlyGroupedRowsById[subRow.id] = subRow;
        // } else {
        //   nonGroupedFlatRows.push(subRow);
        //   nonGroupedRowsById[subRow.id] = subRow;
        // }
      });
      return row;
    });
    return aggregatedGroupedRows;
  };

  var groupedRows = groupUpRecursively(sortedRowModel.rows, 0, '');
  groupedRows.forEach(function (subRow) {
    groupedFlatRows.push(subRow);
    groupedRowsById[subRow.id] = subRow; // if (subRow.getIsGrouped?.()) {
    //   onlyGroupedFlatRows.push(subRow);
    //   onlyGroupedRowsById[subRow.id] = subRow;
    // } else {
    //   nonGroupedFlatRows.push(subRow);
    //   nonGroupedRowsById[subRow.id] = subRow;
    // }
  });
  return {
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById
  };
};

function groupBy(rows, columnId) {
  var groupMap = new Map();
  return rows.reduce(function (map, row) {
    var resKey = "" + row.values[columnId];
    var previous = map.get(resKey);

    if (!previous) {
      map.set(resKey, [row]);
    } else {
      map.set(resKey, [].concat(previous, [row]));
    }

    return map;
  }, groupMap);
}

exports.groupRowsFn = groupRowsFn;
//# sourceMappingURL=groupRowsFn.js.map
