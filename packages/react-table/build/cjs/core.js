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

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var utils = require('./utils.js');
var Visibility = require('./features/Visibility.js');
var Ordering = require('./features/Ordering.js');
var Pinning = require('./features/Pinning.js');
var Headers = require('./features/Headers.js');
var Filters = require('./features/Filters.js');
var Sorting = require('./features/Sorting.js');
var Grouping = require('./features/Grouping.js');
var Expanding = require('./features/Expanding.js');

function createTableInstance(options, rerender) {
  var _options$initialState;

  if (process.env.NODE_ENV !== 'production' && options.debug) {
    console.info('Creating React Table Instance...');
  }

  var instance = {};

  var defaultOptions = _rollupPluginBabelHelpers["extends"]({}, Visibility.getDefaultOptions(instance), Ordering.getDefaultOptions(instance), Pinning.getDefaultOptions(instance), Filters.getDefaultOptions(instance), Sorting.getDefaultOptions(instance), Grouping.getDefaultOptions(instance), Expanding.getDefaultOptions(instance));

  var defaultState = {};

  var buildOptions = function buildOptions(options) {
    return _rollupPluginBabelHelpers["extends"]({
      state: defaultState
    }, defaultOptions, options);
  };

  instance.options = buildOptions(options);

  var initialState = _rollupPluginBabelHelpers["extends"]({}, Visibility.getInitialState(), Ordering.getInitialState(), Pinning.getInitialState(), Filters.getInitialState(), Sorting.getInitialState(), Grouping.getInitialState(), Expanding.getInitialState(), (_options$initialState = options.initialState) != null ? _options$initialState : {});

  var finalInstance = _rollupPluginBabelHelpers["extends"]({}, instance, Visibility.getInstance(instance), Ordering.getInstance(instance), Pinning.getInstance(instance), Headers.getInstance(instance), Filters.getInstance(instance), Sorting.getInstance(instance), Grouping.getInstance(instance), Expanding.getInstance(instance), {
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
      return _rollupPluginBabelHelpers["extends"]({}, instance.internalState, instance.options.state);
    },
    setState: function setState(updater, shouldRerender) {
      if (shouldRerender === void 0) {
        shouldRerender = true;
      }

      var newState = utils.functionalUpdate(updater, instance.internalState);
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
    getDefaultColumn: utils.memo(function () {
      return [instance.options.defaultColumn];
    }, function (defaultColumn) {
      var _defaultColumn;

      defaultColumn = (_defaultColumn = defaultColumn) != null ? _defaultColumn : {};
      return _rollupPluginBabelHelpers["extends"]({
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
      }, Visibility.getDefaultColumn(), Filters.getDefaultColumn(), Sorting.getDefaultColumn(), Grouping.getDefaultColumn(), defaultColumn);
    }, 'getDefaultColumn', instance.options.debug),
    getColumnDefs: function getColumnDefs() {
      return instance.options.columns;
    },
    createColumn: function createColumn(columnDef, depth, parent) {
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

      var column = _rollupPluginBabelHelpers["extends"]({
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
        getFlatColumns: utils.memo(function () {
          return [true];
        }, function () {
          var _column$columns;

          return [column].concat((_column$columns = column.columns) == null ? void 0 : _column$columns.flatMap(function (d) {
            return d.getFlatColumns();
          }));
        }, 'column.getFlatColumns', instance.options.debug),
        getLeafColumns: utils.memo(function () {
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

      column = Object.assign(column, Visibility.createColumn(column, instance), Pinning.createColumn(column, instance), Filters.createColumn(column, instance), Sorting.createColumn(column, instance), Grouping.createColumn(column, instance)); // Yes, we have to convert instance to uknown, because we know more than the compiler here.

      return column;
    },
    getAllColumns: utils.memo(function () {
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
    getAllFlatColumns: utils.memo(function () {
      return [instance.getAllColumns()];
    }, function (allColumns) {
      return allColumns.flatMap(function (column) {
        return column.getFlatColumns();
      });
    }, 'getAllFlatColumns', instance.options.debug),
    getAllFlatColumnsById: utils.memo(function () {
      return [instance.getAllFlatColumns()];
    }, function (flatColumns) {
      return flatColumns.reduce(function (acc, column) {
        acc[column.id] = column;
        return acc;
      }, {});
    }, 'getAllFlatColumnsById', instance.options.debug),
    getAllLeafColumns: utils.memo(function () {
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
    createCell: function createCell(row, column, value) {
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
          return utils.flexRender(column.cell, {
            column: column,
            cell: cell,
            value: value
          });
        }
      };
      Object.assign(cell, _rollupPluginBabelHelpers["extends"]({}, Grouping.createCell(cell, column, row)));
      return cell;
    },
    createRow: function createRow(id, original, rowIndex, depth, values) {
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
      row.getAllCells = utils.memo(function () {
        return [instance.getAllLeafColumns()];
      }, function (leafColumns) {
        return leafColumns.map(function (column) {
          return instance.createCell(row, column, row.values[column.id]);
        });
      }, process.env.NODE_ENV !== 'production' ? 'row.getAllCells' : '', instance.options.debug);
      row.getAllCellsByColumnId = utils.memo(function () {
        return [row.getAllCells()];
      }, function (allCells) {
        return allCells.reduce(function (acc, cell) {
          acc[cell.columnId] = cell;
          return acc;
        }, {});
      }, 'row.getAllCellsByColumnId', instance.options.debug);
      row = Object.assign(row, Headers.createRow(row, instance), Grouping.createRow(row, instance), Expanding.createRow(row, instance));
      return row;
    },
    getCoreRowModel: utils.memo(function () {
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
            row.leafRows = utils.flattenBy(subRows, function (d) {
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
      return utils.propGetter({
        role: 'table'
      }, userProps);
    },
    getTableBodyProps: function getTableBodyProps(userProps) {
      return utils.propGetter({
        role: 'rowgroup'
      }, userProps);
    },
    getRowProps: function getRowProps(rowId, userProps) {
      var row = instance.getRow(rowId);

      if (!row) {
        return;
      }

      return utils.propGetter({
        key: row.id,
        role: 'row'
      }, userProps);
    },
    getCellProps: function getCellProps(rowId, columnId, userProps) {
      var cell = instance.getCell(rowId, columnId);

      if (!cell) {
        return;
      }

      return utils.propGetter({
        key: cell.id,
        role: 'gridcell'
      }, userProps);
    }
  });

  return Object.assign(instance, finalInstance);
}

exports.createTableInstance = createTableInstance;
//# sourceMappingURL=core.js.map
