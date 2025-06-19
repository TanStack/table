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
import * as React from 'react';
import React__default from 'react';

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");

  return typeof key === "symbol" ? key : String(key);
}

function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}
function makeStateUpdater(key, instance) {
  return function (updater) {
    instance.setState(function (old) {
      var _extends2;

      return _extends({}, old, (_extends2 = {}, _extends2[key] = functionalUpdate(updater, old[key]), _extends2));
    });
  };
} // SSR has issues with useLayoutEffect still, so use useEffect during SSR

typeof document !== 'undefined' ? React__default.useLayoutEffect : React__default.useEffect;
function isFunction(d) {
  return d instanceof Function;
}
function flattenBy(arr, getChildren) {
  var flat = [];

  var recurse = function recurse(subArr) {
    subArr.forEach(function (item) {
      flat.push(item);
      var children = getChildren(item);

      if (children != null && children.length) {
        recurse(children);
      }
    });
  };

  recurse(arr);
  return flat;
}
// @ts-ignore // Just rely on the type, not the implementation
var propGetter = function propGetter(initial, getter) {
  if (isFunction(getter)) {
    return getter(initial);
  }

  return _extends({}, initial, getter != null ? getter : {});
};
function memo(getDeps, fn, key, debug) {
  var deps = [];
  var result;
  return function () {
    var newDeps = getDeps();
    var newSerializedDeps = newDeps;
    var oldSerializedDeps = deps;
    var depsChanged = newSerializedDeps.length !== oldSerializedDeps.length || newSerializedDeps.some(function (dep, index) {
      return oldSerializedDeps[index] !== dep;
    });

    if (depsChanged) {
      if (debug) {
        console.info(key, _extends({
          length: oldSerializedDeps.length + " -> " + newSerializedDeps.length
        }, newSerializedDeps.map(function (_, index) {
          if (oldSerializedDeps[index] !== newSerializedDeps[index]) {
            return [index, oldSerializedDeps[index], newSerializedDeps[index]];
          }

          return false;
        }).filter(Boolean).reduce(function (accu, curr) {
          var _extends3;

          return _extends({}, accu, (_extends3 = {}, _extends3[curr[0]] = curr.slice(1), _extends3));
        }, {}), {
          parent: parent
        }));
      }

      result = fn.apply(void 0, newDeps);
      deps = newSerializedDeps;
    }

    return result;
  };
} // Copied from: https://github.com/jonschlinkert/is-plain-object

function flexRender(Comp, props) {
  return !Comp ? null : isReactComponent(Comp) ? /*#__PURE__*/React__default.createElement(Comp, props) : Comp;
}

function isReactComponent(component) {
  return isClassComponent(component) || typeof component === 'function' || isExoticComponent(component);
}

function isClassComponent(component) {
  return typeof component === 'function' && function () {
    var proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  }();
}

function isExoticComponent(component) {
  return typeof component === 'object' && typeof component.$$typeof === 'symbol' && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description);
} // export function hashString(str: string, seed = 0): string {
//   let h1 = 0xdeadbeef ^ seed,
//     h2 = 0x41c6ce57 ^ seed
//   for (let i = 0, ch; i < str.length; i++) {
//     ch = str.charCodeAt(i)
//     h1 = Math.imul(h1 ^ ch, 2654435761)
//     h2 = Math.imul(h2 ^ ch, 1597334677)
//   }
//   h1 =
//     Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
//     Math.imul(h2 ^ (h2 >>> 13), 3266489909)
//   h2 =
//     Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
//     Math.imul(h1 ^ (h1 >>> 13), 3266489909)
//   return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString()
// }

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

      var leafRows = depth ? flattenBy(groupedRows, function (row) {
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

//
function getInitialState$6() {
  return {
    columnVisibility: {}
  };
}
function getDefaultOptions$6(instance) {
  return {
    onColumnVisibilityChange: makeStateUpdater('columnVisibility', instance)
  };
}
function getDefaultColumn$3() {
  return {
    defaultIsVisible: true
  };
}
function createColumn$4(column, instance) {
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
      return propGetter(props, userProps);
    }
  };
}
function getInstance$7(instance) {
  return {
    getVisibleFlatColumns: memo(function () {
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
    getVisibleLeafColumns: memo(function () {
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
      return instance.options.onColumnVisibilityChange == null ? void 0 : instance.options.onColumnVisibilityChange(updater, functionalUpdate(updater, instance.getState().columnVisibility));
    },
    toggleColumnVisibility: function toggleColumnVisibility(columnId, value) {
      if (!columnId) return;

      if (instance.getColumnCanHide(columnId)) {
        instance.setColumnVisibility(function (old) {
          var _extends2;

          return _extends({}, old, (_extends2 = {}, _extends2[columnId] = value != null ? value : !instance.getColumnIsVisible(columnId), _extends2));
        });
      }
    },
    toggleAllColumnsVisible: function toggleAllColumnsVisible(value) {
      var _value;

      value = (_value = value) != null ? _value : !instance.getIsAllColumnsVisible();
      instance.setColumnVisibility(instance.getAllLeafColumns().reduce(function (obj, column) {
        var _extends3;

        return _extends({}, obj, (_extends3 = {}, _extends3[column.id] = !value ? !(column.getCanHide != null && column.getCanHide()) : value, _extends3));
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
      return propGetter(props, userProps);
    }
  };
}

var aggregationTypes = {
  sum: sum,
  min: min,
  max: max,
  extent: extent,
  mean: mean,
  median: median,
  unique: unique,
  uniqueCount: uniqueCount,
  count: count
};

function sum(_leafValues, childValues) {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return childValues.reduce(function (sum, next) {
    return sum + (typeof next === 'number' ? next : 0);
  }, 0);
}

function min(_leafValues, childValues) {
  var min;

  for (var _iterator = _createForOfIteratorHelperLoose(childValues), _step; !(_step = _iterator()).done;) {
    var value = _step.value;

    if (value != null && (min > value || min === undefined && value >= value)) {
      min = value;
    }
  }

  return min;
}

function max(_leafValues, childValues) {
  var max;

  for (var _iterator2 = _createForOfIteratorHelperLoose(childValues), _step2; !(_step2 = _iterator2()).done;) {
    var value = _step2.value;

    if (value != null && (max < value || max === undefined && value >= value)) {
      max = value;
    }
  }

  return max;
}

function extent(_leafValues, childValues) {
  var min;
  var max;

  for (var _iterator3 = _createForOfIteratorHelperLoose(childValues), _step3; !(_step3 = _iterator3()).done;) {
    var value = _step3.value;

    if (value != null) {
      if (min === undefined) {
        if (value >= value) min = max = value;
      } else {
        if (min > value) min = value;
        if (max < value) max = value;
      }
    }
  }

  return [min, max];
}

function mean(leafValues) {
  var count = 0;
  var sum = 0;

  for (var _iterator4 = _createForOfIteratorHelperLoose(leafValues), _step4; !(_step4 = _iterator4()).done;) {
    var value = _step4.value;

    if (value != null && (value = +value) >= value) {
      ++count, sum += value;
    }
  }

  if (count) return sum / count;
  return;
}

function median(values) {
  if (!values.length) {
    return;
  }

  var min = 0;
  var max = 0;
  values.forEach(function (value) {
    if (typeof value === 'number') {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  });
  return (min + max) / 2;
}

function unique(values) {
  return Array.from(new Set(values).values());
}

function uniqueCount(values) {
  return new Set(values).size;
}

function count(values) {
  return values.length;
}

//
function getDefaultColumn$2() {
  return {
    aggregationType: 'auto'
  };
}
function getInitialState$5() {
  return {
    grouping: []
  };
}
function getDefaultOptions$5(instance) {
  return {
    onGroupingChange: makeStateUpdater('grouping', instance),
    autoResetGrouping: true,
    groupedColumnMode: 'reorder'
  };
}
function createColumn$3(column, instance) {
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
function getInstance$6(instance) {
  return {
    getColumnAutoAggregationFn: function getColumnAutoAggregationFn(columnId) {
      var firstRow = instance.getCoreFlatRows()[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'number') {
        return aggregationTypes.sum;
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return aggregationTypes.extent;
      }

      return aggregationTypes.count;
    },
    getColumnAggregationFn: function getColumnAggregationFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userAggregationTypes = instance.options.aggregationTypes;

      if (!column) {
        throw new Error();
      }

      return isFunction(column.aggregationType) ? column.aggregationType : column.aggregationType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userAggregationTypes == null ? void 0 : userAggregationTypes[column.aggregationType]) != null ? _ref : aggregationTypes[column.aggregationType];
    },
    setGrouping: function setGrouping(updater) {
      return instance.options.onGroupingChange == null ? void 0 : instance.options.onGroupingChange(updater, functionalUpdate(updater, instance.getState().grouping));
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
      return propGetter(initialProps, userProps);
    },
    getRowIsGrouped: function getRowIsGrouped(rowId) {
      var _instance$getRow;

      return !!((_instance$getRow = instance.getRow(rowId)) != null && _instance$getRow.groupingColumnId);
    },
    getGroupedRowModel: memo(function () {
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
function createRow$2(row, instance) {
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

//
function getInitialState$4() {
  return {
    columnOrder: []
  };
}
function getDefaultOptions$4(instance) {
  return {
    onColumnOrderChange: makeStateUpdater('columnOrder', instance)
  };
}
function getInstance$5(instance) {
  return {
    setColumnOrder: function setColumnOrder(updater) {
      return instance.options.onColumnOrderChange == null ? void 0 : instance.options.onColumnOrderChange(updater, functionalUpdate(updater, instance.getState().columnOrder));
    },
    resetColumnOrder: function resetColumnOrder() {
      var _instance$initialStat;

      instance.setColumnOrder((_instance$initialStat = instance.initialState.columnOrder) != null ? _instance$initialStat : []);
    },
    getOrderColumnsFn: memo(function () {
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

        return orderColumns(orderedColumns, grouping, groupedColumnMode);
      };
    }, 'getOrderColumnsFn', instance.options.debug)
  };
}

//
function getInitialState$3() {
  return {
    columnPinning: {
      left: [],
      right: []
    }
  };
}
function getDefaultOptions$3(instance) {
  return {
    onColumnPinningChange: makeStateUpdater('columnPinning', instance)
  };
}
function createColumn$2(column, instance) {
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
function getInstance$4(instance) {
  return {
    setColumnPinning: function setColumnPinning(updater) {
      return instance.options.onColumnPinningChange == null ? void 0 : instance.options.onColumnPinningChange(updater, functionalUpdate(updater, instance.getState().columnPinning));
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

//
function createRow$1(row, instance) {
  return {
    _getAllVisibleCells: memo(function () {
      return [row.getAllCells().filter(function (cell) {
        return cell.column.getIsVisible();
      }).map(function (d) {
        return d.id;
      }).join('_')];
    }, function (_) {
      return row.getAllCells().filter(function (cell) {
        return cell.column.getIsVisible();
      });
    }, 'row._getAllVisibleCells', instance.options.debug),
    getVisibleCells: memo(function () {
      return [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()];
    }, function (left, center, right) {
      return [].concat(left, center, right);
    }, 'row.getVisibleCells', instance.options.debug),
    getCenterVisibleCells: memo(function () {
      return [row._getAllVisibleCells(), instance.getState().columnPinning.left, instance.getState().columnPinning.right];
    }, function (allCells, left, right) {
      var leftAndRight = [].concat(left != null ? left : [], right != null ? right : []);
      return allCells.filter(function (d) {
        return !leftAndRight.includes(d.columnId);
      });
    }, 'row.getCenterVisibleCells', instance.options.debug),
    getLeftVisibleCells: memo(function () {
      return [row._getAllVisibleCells(), instance.getState().columnPinning.left,,];
    }, function (allCells, left) {
      var cells = (left != null ? left : []).map(function (columnId) {
        return allCells.find(function (cell) {
          return cell.columnId === columnId;
        });
      }).filter(Boolean);
      return cells;
    }, 'row.getLeftVisibleCells', instance.options.debug),
    getRightVisibleCells: memo(function () {
      return [row._getAllVisibleCells(), instance.getState().columnPinning.right];
    }, function (allCells, right) {
      var cells = (right != null ? right : []).map(function (columnId) {
        return allCells.find(function (cell) {
          return cell.columnId === columnId;
        });
      }).filter(Boolean);
      return cells;
    }, 'row.getRightVisibleCells', instance.options.debug)
  };
}
function getInstance$3(instance) {
  return {
    createHeader: function createHeader(column, options) {
      var _options$id;

      var id = (_options$id = options.id) != null ? _options$id : column.id;
      var header = {
        id: id,
        column: column,
        isPlaceholder: options.isPlaceholder,
        placeholderId: options.placeholderId,
        depth: options.depth,
        subHeaders: [],
        colSpan: 0,
        rowSpan: 0,
        getWidth: function getWidth() {
          var sum = 0;

          var recurse = function recurse(header) {
            if (header.subHeaders.length) {
              header.subHeaders.forEach(recurse);
            } else {
              var _header$column$getWid;

              sum += (_header$column$getWid = header.column.getWidth()) != null ? _header$column$getWid : 0;
            }
          };

          recurse(header);
          return sum;
        },
        getLeafHeaders: function getLeafHeaders() {
          var leafHeaders = [];

          var recurseHeader = function recurseHeader(h) {
            if (h.subHeaders && h.subHeaders.length) {
              h.subHeaders.map(recurseHeader);
            }

            leafHeaders.push(h);
          };

          recurseHeader(header);
          return leafHeaders;
        },
        getHeaderProps: function getHeaderProps(userProps) {
          return instance.getHeaderProps(header.id, userProps);
        },
        getFooterProps: function getFooterProps(userProps) {
          return instance.getFooterProps(header.id, userProps);
        },
        renderHeader: function renderHeader() {
          return flexRender(column.header, {
            header: header,
            column: column
          });
        },
        renderFooter: function renderFooter() {
          return flexRender(column.footer, {
            header: header,
            column: column
          });
        }
      };
      return header;
    },
    // Header Groups
    getHeaderGroups: memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right];
    }, function (allColumns, leafColumns, left, right) {
      var leftColumns = leafColumns.filter(function (column) {
        return left == null ? void 0 : left.includes(column.id);
      });
      var rightColumns = leafColumns.filter(function (column) {
        return right == null ? void 0 : right.includes(column.id);
      });
      var centerColumns = leafColumns.filter(function (column) {
        return !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id));
      });
      var headerGroups = buildHeaderGroups(allColumns, [].concat(leftColumns, centerColumns, rightColumns), instance);
      return headerGroups;
    }, 'getHeaderGroups', instance.options.debug),
    getCenterHeaderGroups: memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right];
    }, function (allColumns, leafColumns, left, right) {
      leafColumns = leafColumns.filter(function (column) {
        return !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id));
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'center');
    }, 'getCenterHeaderGroups', instance.options.debug),
    getLeftHeaderGroups: memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left];
    }, function (allColumns, leafColumns, left) {
      leafColumns = leafColumns.filter(function (column) {
        return left == null ? void 0 : left.includes(column.id);
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'left');
    }, 'getLeftHeaderGroups', instance.options.debug),
    getRightHeaderGroups: memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.right];
    }, function (allColumns, leafColumns, right) {
      leafColumns = leafColumns.filter(function (column) {
        return right == null ? void 0 : right.includes(column.id);
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'right');
    }, 'getRightHeaderGroups', instance.options.debug),
    // Footer Groups
    getFooterGroups: memo(function () {
      return [instance.getHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getFooterGroups', instance.options.debug),
    getLeftFooterGroups: memo(function () {
      return [instance.getLeftHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getLeftFooterGroups', instance.options.debug),
    getCenterFooterGroups: memo(function () {
      return [instance.getCenterHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getCenterFooterGroups', instance.options.debug),
    getRightFooterGroups: memo(function () {
      return [instance.getRightHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getRightFooterGroups', instance.options.debug),
    // Flat Headers
    getFlatHeaders: memo(function () {
      return [instance.getHeaderGroups()];
    }, function (headerGroups) {
      return headerGroups.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getFlatHeaders', instance.options.debug),
    getLeftFlatHeaders: memo(function () {
      return [instance.getLeftHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getLeftFlatHeaders', instance.options.debug),
    getCenterFlatHeaders: memo(function () {
      return [instance.getCenterHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getCenterFlatHeaders', instance.options.debug),
    getRightFlatHeaders: memo(function () {
      return [instance.getRightHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getRightFlatHeaders', instance.options.debug),
    // Leaf Headers
    getCenterLeafHeaders: memo(function () {
      return [instance.getCenterFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders;

        return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
      });
    }, 'getCenterLeafHeaders', instance.options.debug),
    getLeftLeafHeaders: memo(function () {
      return [instance.getLeftFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders2;

        return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
      });
    }, 'getLeftLeafHeaders', instance.options.debug),
    getRightLeafHeaders: memo(function () {
      return [instance.getRightFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders3;

        return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
      });
    }, 'getRightLeafHeaders', instance.options.debug),
    getLeafHeaders: memo(function () {
      return [instance.getLeftHeaderGroups(), instance.getCenterHeaderGroups(), instance.getRightHeaderGroups()];
    }, function (left, center, right) {
      var _left$0$headers, _left$, _center$0$headers, _center$, _right$0$headers, _right$;

      return [].concat((_left$0$headers = (_left$ = left[0]) == null ? void 0 : _left$.headers) != null ? _left$0$headers : [], (_center$0$headers = (_center$ = center[0]) == null ? void 0 : _center$.headers) != null ? _center$0$headers : [], (_right$0$headers = (_right$ = right[0]) == null ? void 0 : _right$.headers) != null ? _right$0$headers : []).map(function (header) {
        return header.getLeafHeaders();
      }).flat();
    }, 'getLeafHeaders', instance.options.debug),
    getHeader: function getHeader(id) {
      var header = [].concat(instance.getFlatHeaders(), instance.getCenterFlatHeaders(), instance.getLeftFlatHeaders(), instance.getRightFlatHeaders()).find(function (d) {
        return d.id === id;
      });

      if (!header) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("Could not find header with id: " + id);
        }

        throw new Error();
      }

      return header;
    },
    getHeaderGroupProps: function getHeaderGroupProps(id, userProps) {
      var headerGroup = instance.getHeaderGroups().find(function (d) {
        return d.id === id;
      });

      if (!headerGroup) {
        return;
      }

      return propGetter({
        key: headerGroup.id,
        role: 'row'
      }, userProps);
    },
    getFooterGroupProps: function getFooterGroupProps(id, userProps) {
      var headerGroup = instance.getFooterGroups().find(function (d) {
        return d.id === id;
      });

      if (!headerGroup) {
        return;
      }

      var initialProps = {
        key: headerGroup.id,
        role: 'row'
      };
      return propGetter(initialProps, userProps);
    },
    getHeaderProps: function getHeaderProps(id, userProps) {
      var header = instance.getHeader(id);

      if (!header) {
        throw new Error();
      }

      var initialProps = {
        key: header.id,
        role: 'columnheader',
        colSpan: header.colSpan,
        rowSpan: header.rowSpan
      };
      return propGetter(initialProps, userProps);
    },
    getFooterProps: function getFooterProps(id, userProps) {
      var header = instance.getHeader(id);

      if (!header) {
        return;
      }

      var initialProps = {
        key: header.id,
        role: 'columnfooter',
        colSpan: header.colSpan,
        rowSpan: header.rowSpan
      };
      return propGetter(initialProps, userProps);
    },
    getTotalWidth: function getTotalWidth() {
      var width = 0;
      instance.getVisibleLeafColumns().forEach(function (column) {
        var _column$getWidth;

        width += (_column$getWidth = column.getWidth()) != null ? _column$getWidth : 0;
      });
      return width;
    }
  };
}
function buildHeaderGroups(allColumns, columnsToGroup, instance, headerFamily) {
  var _headerGroups$0$heade, _headerGroups$;

  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level
  var maxDepth = 0;

  var findMaxDepth = function findMaxDepth(columns, depth) {
    if (depth === void 0) {
      depth = 1;
    }

    maxDepth = Math.max(maxDepth, depth);
    columns.filter(function (column) {
      return column.getIsVisible();
    }).forEach(function (column) {
      var _column$columns;

      if ((_column$columns = column.columns) != null && _column$columns.length) {
        findMaxDepth(column.columns, depth + 1);
      }
    }, 0);
  };

  findMaxDepth(allColumns);
  var headerGroups = [];

  var createHeaderGroup = function createHeaderGroup(headersToGroup, depth) {
    // The header group we are creating
    var headerGroup = {
      depth: depth,
      id: [headerFamily, "" + depth].filter(Boolean).join('_'),
      headers: [],
      getHeaderGroupProps: function getHeaderGroupProps(getterValue) {
        return instance.getHeaderGroupProps("" + depth, getterValue);
      },
      getFooterGroupProps: function getFooterGroupProps(getterValue) {
        return instance.getFooterGroupProps("" + depth, getterValue);
      }
    }; // The parent columns we're going to scan next

    var parentHeaders = []; // Scan each column for parents

    headersToGroup.forEach(function (headerToGroup) {
      // What is the latest (last) parent column?
      var latestParentHeader = [].concat(parentHeaders).reverse()[0];
      var isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
      var column;
      var isPlaceholder = false;

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent;
      } else {
        // The parent header is repeated
        column = headerToGroup.column;
        isPlaceholder = true;
      }

      var header = instance.createHeader(column, {
        id: [headerFamily, depth, column.id, headerToGroup == null ? void 0 : headerToGroup.id].filter(Boolean).join('_'),
        isPlaceholder: isPlaceholder,
        placeholderId: isPlaceholder ? "" + parentHeaders.filter(function (d) {
          return d.column === column;
        }).length : undefined,
        depth: depth
      });

      if (!latestParentHeader || latestParentHeader.column !== header.column) {
        header.subHeaders.push(headerToGroup);
        parentHeaders.push(header);
      } else {
        latestParentHeader.subHeaders.push(headerToGroup);
      } // if (!headerToGroup.isPlaceholder) {
      //   headerToGroup.column.header = headerToGroup;
      // }


      headerGroup.headers.push(headerToGroup);
    });
    headerGroups.push(headerGroup);

    if (depth > 0) {
      createHeaderGroup(parentHeaders, depth - 1);
    }
  };

  var bottomHeaders = columnsToGroup.map(function (column) {
    return instance.createHeader(column, {
      depth: maxDepth
    });
  });
  createHeaderGroup(bottomHeaders, maxDepth - 1);
  headerGroups.reverse(); // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  var recurseHeadersForSpans = function recurseHeadersForSpans(headers) {
    var filteredHeaders = headers.filter(function (header) {
      return header.column.getIsVisible();
    });
    return filteredHeaders.map(function (header) {
      var colSpan = 0;
      var rowSpan = 0;
      var childRowSpans = [0];

      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = [];
        recurseHeadersForSpans(header.subHeaders).forEach(function (_ref) {
          var childColSpan = _ref.colSpan,
              childRowSpan = _ref.rowSpan;
          colSpan += childColSpan;
          childRowSpans.push(childRowSpan);
        });
      } else {
        colSpan = 1;
      }

      var minChildRowSpan = Math.min.apply(Math, childRowSpans);
      rowSpan = rowSpan + minChildRowSpan;
      header.colSpan = colSpan > 0 ? colSpan : undefined;
      header.rowSpan = rowSpan > 0 ? rowSpan : undefined;
      return {
        colSpan: colSpan,
        rowSpan: rowSpan
      };
    });
  };

  recurseHeadersForSpans((_headerGroups$0$heade = (_headerGroups$ = headerGroups[0]) == null ? void 0 : _headerGroups$.headers) != null ? _headerGroups$0$heade : []);
  return headerGroups;
}

var filterTypes = {
  includesString: includesString,
  includesStringSensitive: includesStringSensitive,
  equalsString: equalsString,
  equalsStringSensitive: equalsStringSensitive,
  arrIncludes: arrIncludes,
  arrIncludesAll: arrIncludesAll,
  equals: equals,
  weakEquals: weakEquals,
  betweenNumberRange: betweenNumberRange
};

function includesString(rows, columnIds, filterValue) {
  var search = String(filterValue).toLowerCase();
  rows = rows.filter(function (row) {
    return columnIds.some(function (id) {
      return String(row.values[id]).toLowerCase().includes(search);
    });
  });
  return rows;
}

includesString.autoRemove = function (val) {
  return testFalsey(val);
};

function includesStringSensitive(rows, columnIds, filterValue) {
  var search = String(filterValue);
  rows = rows.filter(function (row) {
    return columnIds.some(function (id) {
      return String(row.values[id]).includes(search);
    });
  });
  return rows;
}

includesStringSensitive.autoRemove = function (val) {
  return testFalsey(val);
};

function equalsString(rows, columnIds, filterValue) {
  var search = String(filterValue).toLowerCase();
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue !== undefined ? String(rowValue).toLowerCase() === search : true;
    });
  });
}

equalsString.autoRemove = function (val) {
  return testFalsey(val);
};

function equalsStringSensitive(rows, columnIds, filterValue) {
  var search = String(filterValue);
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue !== undefined ? String(rowValue) === search : true;
    });
  });
}

equalsStringSensitive.autoRemove = function (val) {
  return testFalsey(val);
};

function arrIncludes(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue.includes(filterValue);
    });
  });
}

arrIncludes.autoRemove = function (val) {
  return testFalsey(val) || !(val != null && val.length);
};

function arrIncludesAll(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue && rowValue.length && filterValue.every(function (val) {
        return rowValue.includes(val);
      });
    });
  });
}

arrIncludesAll.autoRemove = function (val) {
  return testFalsey(val) || !(val != null && val.length);
};

function equals(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue === filterValue;
    });
  });
}

equals.autoRemove = function (val) {
  return testFalsey(val);
};

function weakEquals(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id]; // eslint-disable-next-line eqeqeq

      return rowValue == filterValue;
    });
  });
}

weakEquals.autoRemove = function (val) {
  return testFalsey(val);
};

function betweenNumberRange(rows, columnIds, filterValue) {
  var _ref = filterValue || [],
      unsafeMin = _ref[0],
      unsafeMax = _ref[1];

  var parsedMin = typeof unsafeMin !== 'number' ? parseFloat(unsafeMin) : unsafeMin;
  var parsedMax = typeof unsafeMax !== 'number' ? parseFloat(unsafeMax) : unsafeMax;
  var min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  var max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;

  if (min > max) {
    var temp = min;
    min = max;
    max = temp;
  }

  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue >= min && rowValue <= max;
    });
  });
}

betweenNumberRange.autoRemove = function (val) {
  return testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
}; // Utils


function testFalsey(val) {
  return val === undefined || val === null || val === '';
}

//
function getDefaultColumn$1() {
  return {
    filterType: 'auto'
  };
}
function getInitialState$2() {
  return {
    columnFilters: [],
    globalFilter: undefined
  };
}
function getDefaultOptions$2(instance) {
  return {
    onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
    onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
    autoResetColumnFilters: true,
    filterFromChildrenUp: true,
    autoResetGlobalFilter: true,
    globalFilterType: 'auto',
    getColumnCanGlobalFilterFn: function getColumnCanGlobalFilterFn(column) {
      var _instance$getCoreFlat, _instance$getCoreFlat2;

      var value = (_instance$getCoreFlat = instance.getCoreFlatRows()[0]) == null ? void 0 : (_instance$getCoreFlat2 = _instance$getCoreFlat.getAllCellsByColumnId()[column.id]) == null ? void 0 : _instance$getCoreFlat2.value;
      return typeof value === 'string';
    }
  };
}
function createColumn$1(column, instance) {
  var getFacetInfo = memo(function () {
    return [column.getPreFilteredRows()];
  }, function (rows) {
    var _rows$0$values$column, _rows$, _rows$0$values$column2, _rows$2;

    if (rows === void 0) {
      rows = [];
    }

    var preFilteredUniqueValues = new Map();
    var preFilteredMinMaxValues = [(_rows$0$values$column = (_rows$ = rows[0]) == null ? void 0 : _rows$.values[column.id]) != null ? _rows$0$values$column : null, (_rows$0$values$column2 = (_rows$2 = rows[0]) == null ? void 0 : _rows$2.values[column.id]) != null ? _rows$0$values$column2 : null];

    for (var i = 0; i < rows.length; i++) {
      var _rows$i;

      var _value = (_rows$i = rows[i]) == null ? void 0 : _rows$i.values[column.id];

      if (preFilteredUniqueValues.has(_value)) {
        var _preFilteredUniqueVal;

        preFilteredUniqueValues.set(_value, ((_preFilteredUniqueVal = preFilteredUniqueValues.get(_value)) != null ? _preFilteredUniqueVal : 0) + 1);
      } else {
        preFilteredUniqueValues.set(_value, 1);
      }

      if (_value < preFilteredMinMaxValues[0]) {
        preFilteredMinMaxValues[0] = _value;
      } else if (_value > preFilteredMinMaxValues[1]) {
        preFilteredMinMaxValues[1] = _value;
      }
    }

    return {
      preFilteredUniqueValues: preFilteredUniqueValues,
      preFilteredMinMaxValues: preFilteredMinMaxValues
    };
  }, 'column.getFacetInfo', instance.options.debug);
  return {
    filterType: column.filterType,
    getCanColumnFilter: function getCanColumnFilter() {
      return instance.getColumnCanColumnFilter(column.id);
    },
    getCanGlobalFilter: function getCanGlobalFilter() {
      return instance.getColumnCanGlobalFilter(column.id);
    },
    getColumnFilterIndex: function getColumnFilterIndex() {
      return instance.getColumnFilterIndex(column.id);
    },
    getIsColumnFiltered: function getIsColumnFiltered() {
      return instance.getColumnIsFiltered(column.id);
    },
    getColumnFilterValue: function getColumnFilterValue() {
      return instance.getColumnFilterValue(column.id);
    },
    setColumnFilterValue: function setColumnFilterValue(val) {
      return instance.setColumnFilterValue(column.id, val);
    },
    getPreFilteredUniqueValues: function getPreFilteredUniqueValues() {
      return getFacetInfo().preFilteredUniqueValues;
    },
    getPreFilteredMinMaxValues: function getPreFilteredMinMaxValues() {
      return getFacetInfo().preFilteredMinMaxValues;
    },
    getPreFilteredRows: function getPreFilteredRows() {
      return undefined;
    }
  };
}
function getInstance$2(instance) {
  return {
    getColumnAutoFilterFn: function getColumnAutoFilterFn(columnId) {
      var firstRow = instance.getCoreFlatRows()[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'string') {
        return filterTypes.includesString;
      }

      if (typeof value === 'number') {
        return filterTypes.betweenNumberRange;
      }

      if (value !== null && typeof value === 'object') {
        return filterTypes.equals;
      }

      if (Array.isArray(value)) {
        return filterTypes.arrIncludes;
      }

      return filterTypes.weakEquals;
    },
    getGlobalAutoFilterFn: function getGlobalAutoFilterFn() {
      return filterTypes.includesString;
    },
    getColumnFilterFn: function getColumnFilterFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userFilterTypes = instance.options.filterTypes;

      if (!column) {
        throw new Error();
      }

      return isFunction(column.filterType) ? column.filterType : column.filterType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userFilterTypes == null ? void 0 : userFilterTypes[column.filterType]) != null ? _ref : filterTypes[column.filterType];
    },
    getGlobalFilterFn: function getGlobalFilterFn() {
      var _ref2;

      var _instance$options = instance.options,
          userFilterTypes = _instance$options.filterTypes,
          globalFilterType = _instance$options.globalFilterType;
      return isFunction(globalFilterType) ? globalFilterType : globalFilterType === 'auto' ? instance.getGlobalAutoFilterFn() : (_ref2 = userFilterTypes == null ? void 0 : userFilterTypes[globalFilterType]) != null ? _ref2 : filterTypes[globalFilterType];
    },
    setColumnFilters: function setColumnFilters(updater) {
      var leafColumns = instance.getAllLeafColumns();

      var updateFn = function updateFn(old) {
        var _functionalUpdate;

        return (_functionalUpdate = functionalUpdate(updater, old)) == null ? void 0 : _functionalUpdate.filter(function (filter) {
          var column = leafColumns.find(function (d) {
            return d.id === filter.id;
          });

          if (column) {
            var filterFn = instance.getColumnFilterFn(column.id);

            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false;
            }
          }

          return true;
        });
      };

      instance.options.onColumnFiltersChange == null ? void 0 : instance.options.onColumnFiltersChange(updateFn, updateFn(instance.getState().columnFilters));
    },
    setGlobalFilter: function setGlobalFilter(updater) {
      instance.options.onGlobalFilterChange == null ? void 0 : instance.options.onGlobalFilterChange(updater, functionalUpdate(updater, instance.getState().globalFilter));
    },
    resetGlobalFilter: function resetGlobalFilter() {
      instance.setGlobalFilter(undefined);
    },
    getColumnCanColumnFilter: function getColumnCanColumnFilter(columnId) {
      var _ref3, _ref4, _ref5, _ref6, _ref7, _column$enableAllFilt;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_ref7 = (_column$enableAllFilt = column.enableAllFilters) != null ? _column$enableAllFilt : column.enableColumnFilter) != null ? _ref7 : instance.options.enableFilters) != null ? _ref6 : instance.options.enableColumnFilters) != null ? _ref5 : column.defaultCanFilter) != null ? _ref4 : column.defaultCanColumnFilter) != null ? _ref3 : !!column.accessorFn;
    },
    getColumnCanGlobalFilter: function getColumnCanGlobalFilter(columnId) {
      var _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _instance$options$ena;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref8 = ((_ref9 = (_ref10 = (_ref11 = (_ref12 = (_ref13 = (_instance$options$ena = instance.options.enableFilters) != null ? _instance$options$ena : instance.options.enableGlobalFilter) != null ? _ref13 : column.enableAllFilters) != null ? _ref12 : column.enableGlobalFilter) != null ? _ref11 : column.defaultCanFilter) != null ? _ref10 : column.defaultCanGlobalFilter) != null ? _ref9 : !!column.accessorFn) && (instance.options.getColumnCanGlobalFilterFn == null ? void 0 : instance.options.getColumnCanGlobalFilterFn(column))) != null ? _ref8 : true;
    },
    getColumnIsFiltered: function getColumnIsFiltered(columnId) {
      return instance.getColumnFilterIndex(columnId) > -1;
    },
    getColumnFilterValue: function getColumnFilterValue(columnId) {
      var _instance$getState$co, _instance$getState$co2;

      return (_instance$getState$co = instance.getState().columnFilters) == null ? void 0 : (_instance$getState$co2 = _instance$getState$co.find(function (d) {
        return d.id === columnId;
      })) == null ? void 0 : _instance$getState$co2.value;
    },
    getColumnFilterIndex: function getColumnFilterIndex(columnId) {
      var _instance$getState$co3, _instance$getState$co4;

      return (_instance$getState$co3 = (_instance$getState$co4 = instance.getState().columnFilters) == null ? void 0 : _instance$getState$co4.findIndex(function (d) {
        return d.id === columnId;
      })) != null ? _instance$getState$co3 : -1;
    },
    setColumnFilterValue: function setColumnFilterValue(columnId, value) {
      if (!columnId) return;
      instance.setColumnFilters(function (old) {
        var column = instance.getColumn(columnId);

        if (!column) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn("React-Table: Could not find a column with id: " + columnId);
          }

          throw new Error();
        }

        var filterFn = instance.getColumnFilterFn(column.id);
        var previousfilter = old == null ? void 0 : old.find(function (d) {
          return d.id === columnId;
        });
        var newFilter = functionalUpdate(value, previousfilter ? previousfilter.value : undefined); //

        if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
          var _old$filter;

          return (_old$filter = old == null ? void 0 : old.filter(function (d) {
            return d.id !== columnId;
          })) != null ? _old$filter : [];
        }

        var newFilterObj = {
          id: columnId,
          value: newFilter
        };

        if (previousfilter) {
          var _old$map;

          return (_old$map = old == null ? void 0 : old.map(function (d) {
            if (d.id === columnId) {
              return newFilterObj;
            }

            return d;
          })) != null ? _old$map : [];
        }

        if (old != null && old.length) {
          return [].concat(old, [newFilterObj]);
        }

        return [newFilterObj];
      });
    },
    resetColumnFilters: function resetColumnFilters() {
      var _instance$options$ini, _instance$options2, _instance$options2$in;

      instance.setColumnFilters((_instance$options$ini = (_instance$options2 = instance.options) == null ? void 0 : (_instance$options2$in = _instance$options2.initialState) == null ? void 0 : _instance$options2$in.columnFilters) != null ? _instance$options$ini : []);
    },
    getColumnFilteredRowModel: memo(function () {
      return [instance.getState().columnFilters, instance.getCoreRowModel(), instance.options.columnFilterRowsFn];
    }, function (columnFilters, rowModel, columnFiltersFn) {
      var columnFilteredRowModel = function () {
        if (!(columnFilters != null && columnFilters.length) || !columnFiltersFn) {
          return rowModel;
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Column Filtering...');
        return columnFiltersFn(instance, columnFilters, rowModel);
      }(); // Now that each filtered column has it's partially filtered rows,
      // lets assign the final filtered rows to all of the other columns


      var nonFilteredColumns = instance.getAllLeafColumns().filter(function (column) {
        var _instance$getState$co5;

        return !((_instance$getState$co5 = instance.getState().columnFilters) != null && _instance$getState$co5.find(function (d) {
          return d.id === column.id;
        }));
      }); // This essentially enables faceted filter options to be built easily
      // using every column's preFilteredRows value

      nonFilteredColumns.forEach(function (column) {
        column.getPreFilteredRows = function () {
          return columnFilteredRowModel.rows;
        };
      });
      return columnFilteredRowModel;
    }, 'getColumnFilteredRowModel', instance.options.debug),
    getPreColumnFilteredRows: function getPreColumnFilteredRows() {
      return instance.getCoreRowModel().rows;
    },
    getPreColumnFilteredFlatRows: function getPreColumnFilteredFlatRows() {
      return instance.getCoreRowModel().flatRows;
    },
    getPreColumnFilteredRowsById: function getPreColumnFilteredRowsById() {
      return instance.getCoreRowModel().rowsById;
    },
    getColumnFilteredRows: function getColumnFilteredRows() {
      return instance.getColumnFilteredRowModel().rows;
    },
    getColumnFilteredFlatRows: function getColumnFilteredFlatRows() {
      return instance.getColumnFilteredRowModel().flatRows;
    },
    getColumnFilteredRowsById: function getColumnFilteredRowsById() {
      return instance.getColumnFilteredRowModel().rowsById;
    },
    getGlobalFilteredRowModel: memo(function () {
      return [instance.getState().globalFilter, instance.getColumnFilteredRowModel(), instance.options.globalFilterRowsFn];
    }, function (globalFilterValue, columnFilteredRowModel, globalFiltersFn) {
      var globalFilteredRowModel = function () {
        if (!globalFiltersFn || !globalFilterValue) {
          return columnFilteredRowModel;
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Global Filtering...');
        return globalFiltersFn(instance, globalFilterValue, columnFilteredRowModel);
      }(); // Now that each filtered column has it's partially filtered rows,
      // lets assign the final filtered rows to all of the other columns


      var nonFilteredColumns = instance.getAllLeafColumns().filter(function (column) {
        var _instance$getState$co6;

        return !((_instance$getState$co6 = instance.getState().columnFilters) != null && _instance$getState$co6.find(function (d) {
          return d.id === column.id;
        }));
      }); // This essentially enables faceted filter options to be built easily
      // using every column's preFilteredRows value

      nonFilteredColumns.forEach(function (column) {
        column.getPreFilteredRows = function () {
          return globalFilteredRowModel.rows;
        };
      });
      return globalFilteredRowModel;
    }, 'getGlobalFilteredRowModel', instance.options.debug),
    getPreGlobalFilteredRows: function getPreGlobalFilteredRows() {
      return instance.getColumnFilteredRowModel().rows;
    },
    getPreGlobalFilteredFlatRows: function getPreGlobalFilteredFlatRows() {
      return instance.getColumnFilteredRowModel().flatRows;
    },
    getPreGlobalFilteredRowsById: function getPreGlobalFilteredRowsById() {
      return instance.getColumnFilteredRowModel().rowsById;
    },
    getGlobalFilteredRows: function getGlobalFilteredRows() {
      return instance.getGlobalFilteredRowModel().rows;
    },
    getGlobalFilteredFlatRows: function getGlobalFilteredFlatRows() {
      return instance.getGlobalFilteredRowModel().flatRows;
    },
    getGlobalFilteredRowsById: function getGlobalFilteredRowsById() {
      return instance.getGlobalFilteredRowModel().rowsById;
    }
  };
}
function shouldAutoRemoveFilter(filterFn, value, column) {
  return (filterFn && filterFn.autoRemove ? filterFn.autoRemove(value, column) : false) || typeof value === 'undefined' || typeof value === 'string' && !value;
}

var reSplitAlphaNumeric = /([0-9]+)/gm;
var sortTypes = {
  alphanumeric: alphanumeric,
  alphanumericCaseSensitive: alphanumericCaseSensitive,
  text: text,
  textCaseSensitive: textCaseSensitive,
  datetime: datetime,
  basic: basic
};

function alphanumeric(rowA, rowB, columnId) {
  return compareAlphanumeric(toString(rowA.values[columnId]).toLowerCase(), toString(rowB.values[columnId]).toLowerCase());
}

function alphanumericCaseSensitive(rowA, rowB, columnId) {
  return compareAlphanumeric(toString(rowA.values[columnId]), toString(rowB.values[columnId]));
} // Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity


function compareAlphanumeric(aStr, bStr) {
  // Split on number groups, but keep the delimiter
  // Then remove falsey split values
  var a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
  var b = bStr.split(reSplitAlphaNumeric).filter(Boolean); // While

  while (a.length && b.length) {
    var aa = a.shift();
    var bb = b.shift();
    var an = parseInt(aa, 10);
    var bn = parseInt(bb, 10);
    var combo = [an, bn].sort(); // Both are string

    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }

      if (bb > aa) {
        return -1;
      }

      continue;
    } // One is a string, one is a number


    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    } // Both are numbers


    if (an > bn) {
      return 1;
    }

    if (bn > an) {
      return -1;
    }
  }

  return a.length - b.length;
} // The text filter is more basic (less numeric support)
// but is much faster


function text(rowA, rowB, columnId) {
  return compareBasic(toString(rowA.values[columnId]).toLowerCase(), toString(rowB.values[columnId]).toLowerCase());
} // The text filter is more basic (less numeric support)
// but is much faster


function textCaseSensitive(rowA, rowB, columnId) {
  return compareBasic(toString(rowA.values[columnId]), toString(rowB.values[columnId]));
}

function datetime(rowA, rowB, columnId) {
  return compareBasic(rowA.values[columnId].getTime(), rowB.values[columnId].getTime());
}

function basic(rowA, rowB, columnId) {
  return compareBasic(rowA.values[columnId], rowB.values[columnId]);
} // Utils


function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

function toString(a) {
  if (typeof a === 'number') {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return '';
    }

    return String(a);
  }

  if (typeof a === 'string') {
    return a;
  }

  return '';
}

//
function getDefaultColumn() {
  return {
    sortType: 'auto'
  };
}
function getInitialState$1() {
  return {
    sorting: []
  };
}
function getDefaultOptions$1(instance) {
  return {
    onSortingChange: makeStateUpdater('sorting', instance),
    autoResetSorting: true
  };
}
function createColumn(column, instance) {
  return {
    sortType: column.sortType,
    getCanSort: function getCanSort() {
      return instance.getColumnCanSort(column.id);
    },
    getCanMultiSort: function getCanMultiSort() {
      return instance.getColumnCanMultiSort(column.id);
    },
    getSortIndex: function getSortIndex() {
      return instance.getColumnSortIndex(column.id);
    },
    getIsSorted: function getIsSorted() {
      return instance.getColumnIsSorted(column.id);
    },
    toggleSorting: function toggleSorting(desc, isMulti) {
      return instance.toggleColumnSorting(column.id, desc, isMulti);
    },
    getToggleSortingProps: function getToggleSortingProps(userProps) {
      return instance.getToggleSortingProps(column.id, userProps);
    }
  };
}
function getInstance$1(instance) {
  return {
    getColumnAutoSortingFn: function getColumnAutoSortingFn(columnId) {
      var firstRow = instance.getGlobalFilteredRowModel().flatRows[0];
      var value = firstRow == null ? void 0 : firstRow.values[columnId];

      if (typeof value === 'string') {
        return sortTypes.alphanumeric;
      }

      if (Object.prototype.toString.call(value) === '[object Date]') {
        return sortTypes.datetime;
      }

      return sortTypes.basic;
    },
    getColumnSortingFn: function getColumnSortingFn(columnId) {
      var _ref;

      var column = instance.getColumn(columnId);
      var userSortTypes = instance.options.sortTypes;

      if (!column) {
        throw new Error();
      }

      return isFunction(column.sortType) ? column.sortType : column.sortType === 'auto' ? instance.getColumnAutoFilterFn(columnId) : (_ref = userSortTypes == null ? void 0 : userSortTypes[column.sortType]) != null ? _ref : sortTypes[column.sortType];
    },
    setSorting: function setSorting(updater) {
      return instance.options.onSortingChange == null ? void 0 : instance.options.onSortingChange(updater, functionalUpdate(updater, instance.getState().sorting));
    },
    toggleColumnSorting: function toggleColumnSorting(columnId, desc, multi) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      instance.setSorting(function (old) {
        var _column$sortDescFirst, _instance$options$ena, _instance$options$ena2;

        // Find any existing sorting for this column
        var existingSorting = old == null ? void 0 : old.find(function (d) {
          return d.id === columnId;
        });
        var existingIndex = old == null ? void 0 : old.findIndex(function (d) {
          return d.id === columnId;
        });
        var hasDescDefined = typeof desc !== 'undefined' && desc !== null;
        var newSorting = []; // What should we do with this sort action?

        var sortAction;

        if (!column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = 'toggle';
          } else {
            sortAction = 'add';
          }
        } else {
          // Normal mode
          if (old != null && old.length && existingIndex !== old.length - 1) {
            sortAction = 'replace';
          } else if (existingSorting) {
            sortAction = 'toggle';
          } else {
            sortAction = 'replace';
          }
        }

        var sortDescFirst = (_column$sortDescFirst = column.sortDescFirst) != null ? _column$sortDescFirst : instance.options.sortDescFirst; // Handle toggle states that will remove the sorting

        if (sortAction === 'toggle' && ( // Must be toggling
        (_instance$options$ena = instance.options.enableSortingRemoval) != null ? _instance$options$ena : true) && // If enableSortRemove, enable in general
        !hasDescDefined && ( // Must not be setting desc
        multi ? (_instance$options$ena2 = instance.options.enableMultiRemove) != null ? _instance$options$ena2 : true : true) && ( // If multi, don't allow if enableMultiRemove
        existingSorting != null && existingSorting.desc // Finally, detect if it should indeed be removed
        ? !sortDescFirst : sortDescFirst)) {
          sortAction = 'remove';
        }

        if (sortAction === 'replace') {
          newSorting = [{
            id: columnId,
            desc: hasDescDefined ? desc : !!sortDescFirst
          }];
        } else if (sortAction === 'add' && old != null && old.length) {
          var _instance$options$max;

          newSorting = [].concat(old, [{
            id: columnId,
            desc: hasDescDefined ? desc : !!sortDescFirst
          }]); // Take latest n columns

          newSorting.splice(0, newSorting.length - ((_instance$options$max = instance.options.maxMultiSortColCount) != null ? _instance$options$max : Number.MAX_SAFE_INTEGER));
        } else if (sortAction === 'toggle' && old != null && old.length) {
          // This flips (or sets) the
          newSorting = old.map(function (d) {
            if (d.id === columnId) {
              return _extends({}, d, {
                desc: hasDescDefined ? desc : !(existingSorting != null && existingSorting.desc)
              });
            }

            return d;
          });
        } else if (sortAction === 'remove' && old != null && old.length) {
          newSorting = old.filter(function (d) {
            return d.id !== columnId;
          });
        }

        return newSorting;
      });
    },
    getColumnCanSort: function getColumnCanSort(columnId) {
      var _ref2, _ref3, _column$enableSorting;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref2 = (_ref3 = (_column$enableSorting = column.enableSorting) != null ? _column$enableSorting : instance.options.enableSorting) != null ? _ref3 : column.defaultCanSort) != null ? _ref2 : !!column.accessorFn;
    },
    getColumnCanMultiSort: function getColumnCanMultiSort(columnId) {
      var _ref4, _column$enableMultiSo;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return (_ref4 = (_column$enableMultiSo = column.enableMultiSort) != null ? _column$enableMultiSo : instance.options.enableMultiSort) != null ? _ref4 : !!column.accessorFn;
    },
    getColumnIsSorted: function getColumnIsSorted(columnId) {
      var _instance$getState$so;

      var columnSort = (_instance$getState$so = instance.getState().sorting) == null ? void 0 : _instance$getState$so.find(function (d) {
        return d.id === columnId;
      });
      return !columnSort ? false : columnSort.desc ? 'desc' : 'asc';
    },
    getColumnSortIndex: function getColumnSortIndex(columnId) {
      var _instance$getState$so2, _instance$getState$so3;

      return (_instance$getState$so2 = (_instance$getState$so3 = instance.getState().sorting) == null ? void 0 : _instance$getState$so3.findIndex(function (d) {
        return d.id === columnId;
      })) != null ? _instance$getState$so2 : -1;
    },
    resetSorting: function resetSorting() {
      var _instance$options$ini, _instance$options, _instance$options$ini2;

      instance.setSorting((_instance$options$ini = (_instance$options = instance.options) == null ? void 0 : (_instance$options$ini2 = _instance$options.initialState) == null ? void 0 : _instance$options$ini2.sorting) != null ? _instance$options$ini : []);
    },
    getToggleSortingProps: function getToggleSortingProps(columnId, userProps) {
      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      var canSort = column.getCanSort();
      var initialProps = {
        title: canSort ? 'Toggle Sorting' : undefined,
        onClick: canSort ? function (e) {
          e.persist();
          column.toggleSorting == null ? void 0 : column.toggleSorting(undefined, column.getCanMultiSort() ? instance.options.isMultiSortEvent == null ? void 0 : instance.options.isMultiSortEvent(e) : false);
        } : undefined
      };
      return propGetter(initialProps, userProps);
    },
    getSortedRowModel: memo(function () {
      return [instance.getState().sorting, instance.getGlobalFilteredRowModel(), instance.options.sortRowsFn];
    }, function (sorting, rowModel, sortingFn) {
      if (!sortingFn || !(sorting != null && sorting.length)) {
        return rowModel;
      }

      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Sorting...');
      return sortingFn(instance, sorting, rowModel);
    }, 'getSortedRowModel', instance.options.debug),
    getPreSortedRows: function getPreSortedRows() {
      return instance.getGlobalFilteredRowModel().rows;
    },
    getPreSortedFlatRows: function getPreSortedFlatRows() {
      return instance.getGlobalFilteredRowModel().flatRows;
    },
    getPreSortedRowsById: function getPreSortedRowsById() {
      return instance.getGlobalFilteredRowModel().rowsById;
    },
    getSortedRows: function getSortedRows() {
      return instance.getSortedRowModel().rows;
    },
    getSortedFlatRows: function getSortedFlatRows() {
      return instance.getSortedRowModel().flatRows;
    },
    getSortedRowsById: function getSortedRowsById() {
      return instance.getSortedRowModel().rowsById;
    }
  };
}

//
function getInitialState() {
  return {
    expanded: {}
  };
}
function getDefaultOptions(instance) {
  return {
    onExpandedChange: makeStateUpdater('expanded', instance),
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
      return instance.options.onExpandedChange == null ? void 0 : instance.options.onExpandedChange(updater, functionalUpdate(updater, instance.getState().expanded));
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

          return _extends({}, oldExpanded, (_extends2 = {}, _extends2[rowId] = true, _extends2));
        }

        if (exists && !expanded) {
          var _oldExpanded = oldExpanded;
              _oldExpanded[rowId];
              var rest = _objectWithoutPropertiesLoose(_oldExpanded, [rowId].map(_toPropertyKey));

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
      return propGetter(initialProps, userProps);
    },
    getToggleAllRowsExpandedProps: function getToggleAllRowsExpandedProps(userProps) {
      var initialProps = {
        title: 'Toggle All Expanded',
        onClick: function onClick(e) {
          e.persist();
          instance.toggleAllRowsExpanded();
        }
      };
      return propGetter(initialProps, userProps);
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
    getExpandedRowModel: memo(function () {
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
      return propGetter(initialProps, userProps);
    }
  };
}

function createTableInstance(options, rerender) {
  var _options$initialState;

  if (process.env.NODE_ENV !== 'production' && options.debug) {
    console.info('Creating React Table Instance...');
  }

  var instance = {};

  var defaultOptions = _extends({}, getDefaultOptions$6(instance), getDefaultOptions$4(instance), getDefaultOptions$3(instance), getDefaultOptions$2(instance), getDefaultOptions$1(instance), getDefaultOptions$5(instance), getDefaultOptions(instance));

  var defaultState = {};

  var buildOptions = function buildOptions(options) {
    return _extends({
      state: defaultState
    }, defaultOptions, options);
  };

  instance.options = buildOptions(options);

  var initialState = _extends({}, getInitialState$6(), getInitialState$4(), getInitialState$3(), getInitialState$2(), getInitialState$1(), getInitialState$5(), getInitialState(), (_options$initialState = options.initialState) != null ? _options$initialState : {});

  var finalInstance = _extends({}, instance, getInstance$7(instance), getInstance$5(instance), getInstance$4(instance), getInstance$3(instance), getInstance$2(instance), getInstance$1(instance), getInstance$6(instance), getInstance(instance), {
    rerender: rerender,
    initialState: initialState,
    internalState: initialState,
    reset: function reset() {
      instance.setState(instance.initialState);
    },
    updateOptions: function updateOptions(newOptions) {
      instance.options = buildOptions(newOptions);
    },
    getRowId: function getRowId(_, index, parent) {
      return "" + (parent ? [parent.id, index].join('.') : index);
    },
    getState: function getState() {
      return _extends({}, instance.internalState, instance.options.state);
    },
    setState: function setState(updater, shouldRerender) {
      if (shouldRerender === void 0) {
        shouldRerender = true;
      }

      var newState = functionalUpdate(updater, instance.internalState);
      var onStateChange = instance.options.onStateChange;
      instance.internalState = newState;

      if (onStateChange) {
        onStateChange(newState);
        return;
      }

      if (shouldRerender) {
        instance.rerender();
      }
    },
    getDefaultColumn: memo(function () {
      return [instance.options.defaultColumn];
    }, function (defaultColumn) {
      var _defaultColumn;

      defaultColumn = (_defaultColumn = defaultColumn) != null ? _defaultColumn : {};
      return _extends({
        header: function header(props) {
          return props.header.column.id;
        },
        footer: function footer(props) {
          return props.header.column.id;
        },
        cell: function cell(_ref) {
          var _ref$value = _ref.value,
              value = _ref$value === void 0 ? '' : _ref$value;
          return typeof value === 'boolean' ? value.toString() : value;
        }
      }, getDefaultColumn$3(), getDefaultColumn$1(), getDefaultColumn(), getDefaultColumn$2(), defaultColumn);
    }, 'getDefaultColumn', instance.options.debug),
    getColumnDefs: function getColumnDefs() {
      return instance.options.columns;
    },
    createColumn: function createColumn$5(columnDef, depth, parent) {
      var _ref2, _columnDef$id;

      var defaultColumn = instance.getDefaultColumn();
      var id = (_ref2 = (_columnDef$id = columnDef.id) != null ? _columnDef$id : columnDef.accessorKey) != null ? _ref2 : typeof columnDef.header === 'string' ? columnDef.header : undefined;
      var accessorFn;

      if (columnDef.accessorFn) {
        accessorFn = columnDef.accessorFn;
      } else if (columnDef.accessorKey) {
        accessorFn = function accessorFn(originalRow) {
          return originalRow[columnDef.accessorKey];
        };
      }

      if (!id) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(columnDef.accessorFn ? "Columns require an id when using an accessorFn" : "Columns require an id when using a non-string header");
        }

        throw new Error();
      }

      var column = _extends({
        width: 150,
        minWidth: 20,
        maxWidth: Number.MAX_SAFE_INTEGER
      }, defaultColumn, columnDef, {
        id: "" + id,
        accessorFn: accessorFn,
        parent: parent,
        depth: depth,
        columnDef: columnDef,
        columns: [],
        getWidth: function getWidth() {
          return instance.getColumnWidth(column.id);
        },
        getFlatColumns: memo(function () {
          return [true];
        }, function () {
          var _column$columns;

          return [column].concat((_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap(function (d) {
            return d.getFlatColumns();
          }));
        }, 'column.getFlatColumns', instance.options.debug),
        getLeafColumns: memo(function () {
          return [instance.getOrderColumnsFn()];
        }, function (orderColumns) {
          var _column$columns2;

          if ((_column$columns2 = column.columns) != null && _column$columns2.length) {
            var leafColumns = column.columns.flatMap(function (column) {
              return column.getLeafColumns();
            });
            return orderColumns(leafColumns);
          }

          return [column];
        }, 'column.getLeafColumns', instance.options.debug)
      });

      column = Object.assign(column, createColumn$4(column, instance), createColumn$2(column, instance), createColumn$1(column, instance), createColumn(column, instance), createColumn$3(column, instance)); // Yes, we have to convert instance to uknown, because we know more than the compiler here.

      return column;
    },
    getAllColumns: memo(function () {
      return [instance.getColumnDefs()];
    }, function (columnDefs) {
      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Building Columns...');

      var recurseColumns = function recurseColumns(columnDefs, parent, depth) {
        if (depth === void 0) {
          depth = 0;
        }

        return columnDefs.map(function (columnDef) {
          var column = instance.createColumn(columnDef, depth, parent);
          column.columns = columnDef.columns ? recurseColumns(columnDef.columns, column, depth + 1) : [];
          return column;
        });
      };

      return recurseColumns(columnDefs);
    }, 'getAllColumns', instance.options.debug),
    getAllFlatColumns: memo(function () {
      return [instance.getAllColumns()];
    }, function (allColumns) {
      return allColumns.flatMap(function (column) {
        return column.getFlatColumns();
      });
    }, 'getAllFlatColumns', instance.options.debug),
    getAllFlatColumnsById: memo(function () {
      return [instance.getAllFlatColumns()];
    }, function (flatColumns) {
      return flatColumns.reduce(function (acc, column) {
        acc[column.id] = column;
        return acc;
      }, {});
    }, 'getAllFlatColumnsById', instance.options.debug),
    getAllLeafColumns: memo(function () {
      return [instance.getAllColumns(), instance.getOrderColumnsFn()];
    }, function (allColumns, orderColumns) {
      var leafColumns = allColumns.flatMap(function (column) {
        return column.getLeafColumns();
      });
      return orderColumns(leafColumns);
    }, 'getAllLeafColumns', instance.options.debug),
    getColumn: function getColumn(columnId) {
      var column = instance.getAllFlatColumnsById()[columnId];

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("[React Table] Column with id " + columnId + " does not exist.");
        }

        throw new Error();
      }

      return column;
    },
    getColumnWidth: function getColumnWidth(columnId) {
      var _column$minWidth, _column$width, _column$maxWidth;

      var column = instance.getColumn(columnId);

      if (!column) {
        throw new Error();
      }

      return Math.min(Math.max((_column$minWidth = column.minWidth) != null ? _column$minWidth : 0, (_column$width = column.width) != null ? _column$width : 0), (_column$maxWidth = column.maxWidth) != null ? _column$maxWidth : 0);
    },
    createCell: function createCell$1(row, column, value) {
      var cell = {
        id: row.id + "_" + column.id,
        rowId: row.id,
        columnId: column.id,
        row: row,
        column: column,
        value: value,
        getCellProps: function getCellProps(userProps) {
          return instance.getCellProps(row.id, column.id, userProps);
        },
        renderCell: function renderCell() {
          return flexRender(column.cell, {
            column: column,
            cell: cell,
            value: value
          });
        }
      };
      Object.assign(cell, _extends({}, createCell(cell, column, row)));
      return cell;
    },
    createRow: function createRow$3(id, original, rowIndex, depth, values) {
      var row = {
        id: id,
        index: rowIndex,
        original: original,
        depth: depth,
        values: values,
        subRows: [],
        leafRows: [],
        getRowProps: function getRowProps(userProps) {
          return instance.getRowProps(row.id, userProps);
        },
        getAllCells: undefined,
        getAllCellsByColumnId: undefined
      };
      row.getAllCells = memo(function () {
        return [instance.getAllLeafColumns()];
      }, function (leafColumns) {
        return leafColumns.map(function (column) {
          return instance.createCell(row, column, row.values[column.id]);
        });
      }, process.env.NODE_ENV !== 'production' ? 'row.getAllCells' : '', instance.options.debug);
      row.getAllCellsByColumnId = memo(function () {
        return [row.getAllCells()];
      }, function (allCells) {
        return allCells.reduce(function (acc, cell) {
          acc[cell.columnId] = cell;
          return acc;
        }, {});
      }, 'row.getAllCellsByColumnId', instance.options.debug);
      row = Object.assign(row, createRow$1(row, instance), createRow$2(row, instance), createRow(row, instance));
      return row;
    },
    getCoreRowModel: memo(function () {
      return [instance.options.data];
    }, function (data) {
      if (process.env.NODE_ENV !== 'production' && instance.options.debug) console.info('Accessing...'); // Auto-reset data-dependent states if configured

      if (instance.options.autoResetColumnFilters && // @ts-ignore
      instance.getRowModelNonFirst) {
        instance.resetColumnFilters();
      }

      if (instance.options.autoResetGlobalFilter && // @ts-ignore
      instance.getRowModelNonFirst) {
        instance.resetGlobalFilter();
      }

      if (instance.options.autoResetSorting && // @ts-ignore
      instance.getRowModelNonFirst) {
        instance.resetSorting();
      }

      if (instance.options.autoResetGrouping && // @ts-ignore
      instance.getRowModelNonFirst) {
        instance.resetGrouping();
      }

      if (instance.options.autoResetExpanded && // @ts-ignore
      instance.getRowModelNonFirst) {
        instance.resetExpanded();
      } // @ts-ignore


      instance.getRowModelNonFirst = true; // Access the row model using initial columns

      var rows = [];
      var flatRows = [];
      var rowsById = {};
      var leafColumns = instance.getAllLeafColumns();

      var accessRow = function accessRow(originalRow, rowIndex, depth, parentRows, parent) {
        if (depth === void 0) {
          depth = 0;
        }

        var id = instance.getRowId(originalRow, rowIndex, parent);

        if (!id) {
          if (process.env.NODE_ENV !== 'production') {
            throw new Error("getRowId expected an ID, but got " + id);
          }
        }

        var values = {};

        for (var i = 0; i < leafColumns.length; i++) {
          var _column = leafColumns[i];

          if (_column && _column.accessorFn) {
            values[_column.id] = _column.accessorFn(originalRow, rowIndex);
          }
        } // Make the row


        var row = instance.createRow(id, originalRow, rowIndex, depth, values); // Push instance row into the parentRows array

        parentRows.push(row); // Keep track of every row in a flat array

        flatRows.push(row); // Also keep track of every row by its ID

        rowsById[id] = row; // Get the original subrows

        if (instance.options.getSubRows) {
          var originalSubRows = instance.options.getSubRows(originalRow, rowIndex); // Then recursively access them

          if (originalSubRows != null && originalSubRows.length) {
            row.originalSubRows = originalSubRows;
            var subRows = [];

            for (var _i = 0; _i < row.originalSubRows.length; _i++) {
              accessRow(row.originalSubRows[_i], _i, depth + 1, subRows, row);
            } // Keep the new subRows array on the row


            row.subRows = subRows;
            row.leafRows = flattenBy(subRows, function (d) {
              return d.leafRows;
            });
          }
        }
      };

      for (var i = 0; i < data.length; i++) {
        accessRow(data[i], i, 0, rows);
      }

      return {
        rows: rows,
        flatRows: flatRows,
        rowsById: rowsById
      };
    }, 'getRowModel', instance.options.debug),
    // The standard
    getCoreRows: function getCoreRows() {
      return instance.getCoreRowModel().rows;
    },
    getCoreFlatRows: function getCoreFlatRows() {
      return instance.getCoreRowModel().flatRows;
    },
    getCoreRowsById: function getCoreRowsById() {
      return instance.getCoreRowModel().rowsById;
    },
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: function getRowModel() {
      return instance.getExpandedRowModel();
    },
    getRows: function getRows() {
      return instance.getRowModel().rows;
    },
    getFlatRows: function getFlatRows() {
      return instance.getRowModel().flatRows;
    },
    getRowsById: function getRowsById() {
      return instance.getRowModel().rowsById;
    },
    getRow: function getRow(id) {
      var row = instance.getRowsById()[id];

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error("getRow expected an ID, but got " + id);
        }

        throw new Error();
      }

      return row;
    },
    getCell: function getCell(rowId, columnId) {
      var row = instance.getRow(rowId);

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error("[React Table] could not find row with id " + rowId);
        }

        throw new Error();
      }

      var cell = row.getAllCellsByColumnId()[columnId];

      if (!cell) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error("[React Table] could not find cell " + columnId + " in row " + rowId);
        }

        throw new Error();
      }

      return cell;
    },
    getTableProps: function getTableProps(userProps) {
      return propGetter({
        role: 'table'
      }, userProps);
    },
    getTableBodyProps: function getTableBodyProps(userProps) {
      return propGetter({
        role: 'rowgroup'
      }, userProps);
    },
    getRowProps: function getRowProps(rowId, userProps) {
      var row = instance.getRow(rowId);

      if (!row) {
        return;
      }

      return propGetter({
        key: row.id,
        role: 'row'
      }, userProps);
    },
    getCellProps: function getCellProps(rowId, columnId, userProps) {
      var cell = instance.getCell(rowId, columnId);

      if (!cell) {
        return;
      }

      return propGetter({
        key: cell.id,
        role: 'gridcell'
      }, userProps);
    }
  });

  return Object.assign(instance, finalInstance);
}

function createTable() {
  return {
    RowType: function RowType() {
      return createTable();
    },
    FilterFns: function FilterFns() {
      return createTable();
    },
    SortingFns: function SortingFns() {
      return createTable();
    },
    AggregationFns: function AggregationFns() {
      return createTable();
    },
    createColumns: function createColumns(columns) {
      return columns;
    },
    createColumn: function createColumn(accessor, column) {
      column = _extends({}, column, {
        id: column.id
      });

      if (typeof accessor === 'string') {
        var _column$id;

        return _extends({}, column, {
          id: (_column$id = column.id) != null ? _column$id : accessor,
          accessorKey: accessor,
          __generated: true
        });
      }

      if (typeof accessor === 'function') {
        return _extends({}, column, {
          accessorFn: accessor,
          __generated: true
        });
      }

      throw new Error('Invalid accessor');
    },
    createGroup: function createGroup(column) {
      return _extends({}, column, {
        __generated: true
      });
    },
    useTable: function useTable(options) {
      var instanceRef = React.useRef(undefined);
      var rerender = React.useReducer(function () {
        return {};
      }, {})[1];

      if (!instanceRef.current) {
        instanceRef.current = createTableInstance(options, rerender);
      }

      instanceRef.current.updateOptions(options);
      return instanceRef.current;
    },
    types: undefined
  };
}

export { columnFilterRowsFn, createTable, expandRowsFn, globalFilterRowsFn, groupRowsFn, sortRowsFn };
//# sourceMappingURL=index.js.map
