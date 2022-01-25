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
function createRow(row, instance) {
  return {
    _getAllVisibleCells: utils.memo(function () {
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
    getVisibleCells: utils.memo(function () {
      return [row.getLeftVisibleCells(), row.getCenterVisibleCells(), row.getRightVisibleCells()];
    }, function (left, center, right) {
      return [].concat(left, center, right);
    }, 'row.getVisibleCells', instance.options.debug),
    getCenterVisibleCells: utils.memo(function () {
      return [row._getAllVisibleCells(), instance.getState().columnPinning.left, instance.getState().columnPinning.right];
    }, function (allCells, left, right) {
      var leftAndRight = [].concat(left != null ? left : [], right != null ? right : []);
      return allCells.filter(function (d) {
        return !leftAndRight.includes(d.columnId);
      });
    }, 'row.getCenterVisibleCells', instance.options.debug),
    getLeftVisibleCells: utils.memo(function () {
      return [row._getAllVisibleCells(), instance.getState().columnPinning.left,,];
    }, function (allCells, left) {
      var cells = (left != null ? left : []).map(function (columnId) {
        return allCells.find(function (cell) {
          return cell.columnId === columnId;
        });
      }).filter(Boolean);
      return cells;
    }, 'row.getLeftVisibleCells', instance.options.debug),
    getRightVisibleCells: utils.memo(function () {
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
function getInstance(instance) {
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
          return utils.flexRender(column.header, {
            header: header,
            column: column
          });
        },
        renderFooter: function renderFooter() {
          return utils.flexRender(column.footer, {
            header: header,
            column: column
          });
        }
      };
      return header;
    },
    // Header Groups
    getHeaderGroups: utils.memo(function () {
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
    getCenterHeaderGroups: utils.memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left, instance.getState().columnPinning.right];
    }, function (allColumns, leafColumns, left, right) {
      leafColumns = leafColumns.filter(function (column) {
        return !(left != null && left.includes(column.id)) && !(right != null && right.includes(column.id));
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'center');
    }, 'getCenterHeaderGroups', instance.options.debug),
    getLeftHeaderGroups: utils.memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.left];
    }, function (allColumns, leafColumns, left) {
      leafColumns = leafColumns.filter(function (column) {
        return left == null ? void 0 : left.includes(column.id);
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'left');
    }, 'getLeftHeaderGroups', instance.options.debug),
    getRightHeaderGroups: utils.memo(function () {
      return [instance.getAllColumns(), instance.getVisibleLeafColumns(), instance.getState().columnPinning.right];
    }, function (allColumns, leafColumns, right) {
      leafColumns = leafColumns.filter(function (column) {
        return right == null ? void 0 : right.includes(column.id);
      });
      return buildHeaderGroups(allColumns, leafColumns, instance, 'right');
    }, 'getRightHeaderGroups', instance.options.debug),
    // Footer Groups
    getFooterGroups: utils.memo(function () {
      return [instance.getHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getFooterGroups', instance.options.debug),
    getLeftFooterGroups: utils.memo(function () {
      return [instance.getLeftHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getLeftFooterGroups', instance.options.debug),
    getCenterFooterGroups: utils.memo(function () {
      return [instance.getCenterHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getCenterFooterGroups', instance.options.debug),
    getRightFooterGroups: utils.memo(function () {
      return [instance.getRightHeaderGroups()];
    }, function (headerGroups) {
      return [].concat(headerGroups).reverse();
    }, 'getRightFooterGroups', instance.options.debug),
    // Flat Headers
    getFlatHeaders: utils.memo(function () {
      return [instance.getHeaderGroups()];
    }, function (headerGroups) {
      return headerGroups.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getFlatHeaders', instance.options.debug),
    getLeftFlatHeaders: utils.memo(function () {
      return [instance.getLeftHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getLeftFlatHeaders', instance.options.debug),
    getCenterFlatHeaders: utils.memo(function () {
      return [instance.getCenterHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getCenterFlatHeaders', instance.options.debug),
    getRightFlatHeaders: utils.memo(function () {
      return [instance.getRightHeaderGroups()];
    }, function (left) {
      return left.map(function (headerGroup) {
        return headerGroup.headers;
      }).flat();
    }, 'getRightFlatHeaders', instance.options.debug),
    // Leaf Headers
    getCenterLeafHeaders: utils.memo(function () {
      return [instance.getCenterFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders;

        return !((_header$subHeaders = header.subHeaders) != null && _header$subHeaders.length);
      });
    }, 'getCenterLeafHeaders', instance.options.debug),
    getLeftLeafHeaders: utils.memo(function () {
      return [instance.getLeftFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders2;

        return !((_header$subHeaders2 = header.subHeaders) != null && _header$subHeaders2.length);
      });
    }, 'getLeftLeafHeaders', instance.options.debug),
    getRightLeafHeaders: utils.memo(function () {
      return [instance.getRightFlatHeaders()];
    }, function (flatHeaders) {
      return flatHeaders.filter(function (header) {
        var _header$subHeaders3;

        return !((_header$subHeaders3 = header.subHeaders) != null && _header$subHeaders3.length);
      });
    }, 'getRightLeafHeaders', instance.options.debug),
    getLeafHeaders: utils.memo(function () {
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

      return utils.propGetter({
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
      return utils.propGetter(initialProps, userProps);
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
      return utils.propGetter(initialProps, userProps);
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
      return utils.propGetter(initialProps, userProps);
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

exports.buildHeaderGroups = buildHeaderGroups;
exports.createRow = createRow;
exports.getInstance = getInstance;
//# sourceMappingURL=Headers.js.map
