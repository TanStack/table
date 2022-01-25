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
var React = require('react');
var core = require('./core.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

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
      column = _rollupPluginBabelHelpers["extends"]({}, column, {
        id: column.id
      });

      if (typeof accessor === 'string') {
        var _column$id;

        return _rollupPluginBabelHelpers["extends"]({}, column, {
          id: (_column$id = column.id) != null ? _column$id : accessor,
          accessorKey: accessor,
          __generated: true
        });
      }

      if (typeof accessor === 'function') {
        return _rollupPluginBabelHelpers["extends"]({}, column, {
          accessorFn: accessor,
          __generated: true
        });
      }

      throw new Error('Invalid accessor');
    },
    createGroup: function createGroup(column) {
      return _rollupPluginBabelHelpers["extends"]({}, column, {
        __generated: true
      });
    },
    useTable: function useTable(options) {
      var instanceRef = React__namespace.useRef(undefined);
      var rerender = React__namespace.useReducer(function () {
        return {};
      }, {})[1];

      if (!instanceRef.current) {
        instanceRef.current = core.createTableInstance(options, rerender);
      }

      instanceRef.current.updateOptions(options);
      return instanceRef.current;
    },
    types: undefined
  };
}

exports.createTable = createTable;
//# sourceMappingURL=createTable.js.map
