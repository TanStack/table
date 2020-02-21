'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactTableDefaults = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _lifecycle = require('./lifecycle');

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _defaultProps = require('./defaultProps');

var _defaultProps2 = _interopRequireDefault(_defaultProps);

var _propTypes = require('./propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//


var ReactTableDefaults = exports.ReactTableDefaults = _defaultProps2.default;

var ReactTable = function (_Methods) {
  _inherits(ReactTable, _Methods);

  function ReactTable(props) {
    _classCallCheck(this, ReactTable);

    var _this = _possibleConstructorReturn(this, (ReactTable.__proto__ || Object.getPrototypeOf(ReactTable)).call(this, props));

    _this.getResolvedState = _this.getResolvedState.bind(_this);
    _this.getDataModel = _this.getDataModel.bind(_this);
    _this.getSortedData = _this.getSortedData.bind(_this);
    _this.fireFetchData = _this.fireFetchData.bind(_this);
    _this.getPropOrState = _this.getPropOrState.bind(_this);
    _this.getStateOrProp = _this.getStateOrProp.bind(_this);
    _this.filterData = _this.filterData.bind(_this);
    _this.sortData = _this.sortData.bind(_this);
    _this.getMinRows = _this.getMinRows.bind(_this);
    _this.onPageChange = _this.onPageChange.bind(_this);
    _this.onPageSizeChange = _this.onPageSizeChange.bind(_this);
    _this.sortColumn = _this.sortColumn.bind(_this);
    _this.filterColumn = _this.filterColumn.bind(_this);
    _this.resizeColumnStart = _this.resizeColumnStart.bind(_this);
    _this.resizeColumnEnd = _this.resizeColumnEnd.bind(_this);
    _this.resizeColumnMoving = _this.resizeColumnMoving.bind(_this);
    return _this;
  }

  _createClass(ReactTable, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var resolvedState = this.getResolvedState();
      var children = resolvedState.children,
          className = resolvedState.className,
          style = resolvedState.style,
          getProps = resolvedState.getProps,
          getTableProps = resolvedState.getTableProps,
          getTheadGroupProps = resolvedState.getTheadGroupProps,
          getTheadGroupTrProps = resolvedState.getTheadGroupTrProps,
          getTheadGroupThProps = resolvedState.getTheadGroupThProps,
          getTheadProps = resolvedState.getTheadProps,
          getTheadTrProps = resolvedState.getTheadTrProps,
          getTheadThProps = resolvedState.getTheadThProps,
          getTheadFilterProps = resolvedState.getTheadFilterProps,
          getTheadFilterTrProps = resolvedState.getTheadFilterTrProps,
          getTheadFilterThProps = resolvedState.getTheadFilterThProps,
          getTbodyProps = resolvedState.getTbodyProps,
          getTrGroupProps = resolvedState.getTrGroupProps,
          getTrProps = resolvedState.getTrProps,
          getTdProps = resolvedState.getTdProps,
          getTfootProps = resolvedState.getTfootProps,
          getTfootTrProps = resolvedState.getTfootTrProps,
          getTfootTdProps = resolvedState.getTfootTdProps,
          getPaginationProps = resolvedState.getPaginationProps,
          getLoadingProps = resolvedState.getLoadingProps,
          getNoDataProps = resolvedState.getNoDataProps,
          getResizerProps = resolvedState.getResizerProps,
          showPagination = resolvedState.showPagination,
          showPaginationTop = resolvedState.showPaginationTop,
          showPaginationBottom = resolvedState.showPaginationBottom,
          manual = resolvedState.manual,
          loadingText = resolvedState.loadingText,
          noDataText = resolvedState.noDataText,
          sortable = resolvedState.sortable,
          multiSort = resolvedState.multiSort,
          resizable = resolvedState.resizable,
          filterable = resolvedState.filterable,
          pivotIDKey = resolvedState.pivotIDKey,
          pivotValKey = resolvedState.pivotValKey,
          pivotBy = resolvedState.pivotBy,
          subRowsKey = resolvedState.subRowsKey,
          aggregatedKey = resolvedState.aggregatedKey,
          originalKey = resolvedState.originalKey,
          indexKey = resolvedState.indexKey,
          groupedByPivotKey = resolvedState.groupedByPivotKey,
          loading = resolvedState.loading,
          pageSize = resolvedState.pageSize,
          page = resolvedState.page,
          sorted = resolvedState.sorted,
          filtered = resolvedState.filtered,
          resized = resolvedState.resized,
          expanded = resolvedState.expanded,
          pages = resolvedState.pages,
          onExpandedChange = resolvedState.onExpandedChange,
          TableComponent = resolvedState.TableComponent,
          TheadComponent = resolvedState.TheadComponent,
          TbodyComponent = resolvedState.TbodyComponent,
          TrGroupComponent = resolvedState.TrGroupComponent,
          TrComponent = resolvedState.TrComponent,
          ThComponent = resolvedState.ThComponent,
          TdComponent = resolvedState.TdComponent,
          TfootComponent = resolvedState.TfootComponent,
          PaginationComponent = resolvedState.PaginationComponent,
          LoadingComponent = resolvedState.LoadingComponent,
          SubComponent = resolvedState.SubComponent,
          NoDataComponent = resolvedState.NoDataComponent,
          ResizerComponent = resolvedState.ResizerComponent,
          ExpanderComponent = resolvedState.ExpanderComponent,
          PivotValueComponent = resolvedState.PivotValueComponent,
          PivotComponent = resolvedState.PivotComponent,
          AggregatedComponent = resolvedState.AggregatedComponent,
          FilterComponent = resolvedState.FilterComponent,
          PadRowComponent = resolvedState.PadRowComponent,
          resolvedData = resolvedState.resolvedData,
          allVisibleColumns = resolvedState.allVisibleColumns,
          headerGroups = resolvedState.headerGroups,
          hasHeaderGroups = resolvedState.hasHeaderGroups,
          sortedData = resolvedState.sortedData,
          currentlyResizing = resolvedState.currentlyResizing;

      // Pagination

      var startRow = pageSize * page;
      var endRow = startRow + pageSize;
      var pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow);
      var minRows = this.getMinRows();
      var padRows = _utils2.default.range(Math.max(minRows - pageRows.length, 0));

      var hasColumnFooter = allVisibleColumns.some(function (d) {
        return d.Footer;
      });
      var hasFilters = filterable || allVisibleColumns.some(function (d) {
        return d.filterable;
      });

      var recurseRowsViewIndex = function recurseRowsViewIndex(rows) {
        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
        return [rows.map(function (row, i) {
          index += 1;
          var rowWithViewIndex = _extends({}, row, {
            _viewIndex: index
          });
          var newPath = path.concat([i]);
          if (rowWithViewIndex[subRowsKey] && _utils2.default.get(expanded, newPath)) {
            var _recurseRowsViewIndex = recurseRowsViewIndex(rowWithViewIndex[subRowsKey], newPath, index);

            var _recurseRowsViewIndex2 = _slicedToArray(_recurseRowsViewIndex, 2);

            rowWithViewIndex[subRowsKey] = _recurseRowsViewIndex2[0];
            index = _recurseRowsViewIndex2[1];
          }
          return rowWithViewIndex;
        }), index];
      };

      var _recurseRowsViewIndex3 = recurseRowsViewIndex(pageRows);

      var _recurseRowsViewIndex4 = _slicedToArray(_recurseRowsViewIndex3, 1);

      pageRows = _recurseRowsViewIndex4[0];


      var canPrevious = page > 0;
      var canNext = page + 1 < pages;

      var rowMinWidth = _utils2.default.sum(allVisibleColumns.map(function (d) {
        var resizedColumn = resized.find(function (x) {
          return x.id === d.id;
        }) || {};
        return _utils2.default.getFirstDefined(resizedColumn.value, d.width, d.minWidth);
      }));

      var rowIndex = -1;

      var finalState = _extends({}, resolvedState, {
        startRow: startRow,
        endRow: endRow,
        pageRows: pageRows,
        minRows: minRows,
        padRows: padRows,
        hasColumnFooter: hasColumnFooter,
        canPrevious: canPrevious,
        canNext: canNext,
        rowMinWidth: rowMinWidth
      });

      var rootProps = _utils2.default.splitProps(getProps(finalState, undefined, undefined, this));
      var tableProps = _utils2.default.splitProps(getTableProps(finalState, undefined, undefined, this));
      var tBodyProps = _utils2.default.splitProps(getTbodyProps(finalState, undefined, undefined, this));
      var loadingProps = getLoadingProps(finalState, undefined, undefined, this);
      var noDataProps = getNoDataProps(finalState, undefined, undefined, this);

      // Visual Components

      var makeHeaderGroup = function makeHeaderGroup(column, i) {
        var resizedValue = function resizedValue(col) {
          return (resized.find(function (x) {
            return x.id === col.id;
          }) || {}).value;
        };
        var flex = _utils2.default.sum(column.columns.map(function (col) {
          return col.width || resizedValue(col) ? 0 : col.minWidth;
        }));
        var width = _utils2.default.sum(column.columns.map(function (col) {
          return _utils2.default.getFirstDefined(resizedValue(col), col.width, col.minWidth);
        }));
        var maxWidth = _utils2.default.sum(column.columns.map(function (col) {
          return _utils2.default.getFirstDefined(resizedValue(col), col.width, col.maxWidth);
        }));

        var theadGroupThProps = _utils2.default.splitProps(getTheadGroupThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _utils2.default.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadGroupThProps.className, columnHeaderProps.className];

        var styles = _extends({}, column.headerStyle, theadGroupThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadGroupThProps.rest, columnHeaderProps.rest);

        var flexStyles = {
          flex: flex + ' 0 auto',
          width: _utils2.default.asPx(width),
          maxWidth: _utils2.default.asPx(maxWidth)
        };

        return _react2.default.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: (0, _classnames2.default)(classes),
            style: _extends({}, styles, flexStyles)
          }, rest),
          _utils2.default.normalizeComponent(column.Header, {
            data: sortedData,
            column: column
          })
        );
      };

      var makeHeaderGroups = function makeHeaderGroups() {
        var theadGroupProps = _utils2.default.splitProps(getTheadGroupProps(finalState, undefined, undefined, _this2));
        var theadGroupTrProps = _utils2.default.splitProps(getTheadGroupTrProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(
          TheadComponent,
          _extends({
            className: (0, _classnames2.default)('-headerGroups', theadGroupProps.className),
            style: _extends({}, theadGroupProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadGroupProps.rest),
          _react2.default.createElement(
            TrComponent,
            _extends({
              className: theadGroupTrProps.className,
              style: theadGroupTrProps.style
            }, theadGroupTrProps.rest),
            headerGroups.map(makeHeaderGroup)
          )
        );
      };

      var makeHeader = function makeHeader(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var sort = sorted.find(function (d) {
          return d.id === column.id;
        });
        var show = typeof column.show === 'function' ? column.show() : column.show;
        var width = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var theadThProps = _utils2.default.splitProps(getTheadThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _utils2.default.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadThProps.className, columnHeaderProps.className];
        var styles = _extends({}, column.headerStyle, theadThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadThProps.rest, columnHeaderProps.rest);

        var isResizable = _utils2.default.getFirstDefined(column.resizable, resizable, false);
        var resizer = isResizable ? _react2.default.createElement(ResizerComponent, _extends({
          onMouseDown: function onMouseDown(e) {
            return _this2.resizeColumnStart(e, column, false);
          },
          onTouchStart: function onTouchStart(e) {
            return _this2.resizeColumnStart(e, column, true);
          }
        }, getResizerProps('finalState', undefined, column, _this2))) : null;

        var isSortable = _utils2.default.getFirstDefined(column.sortable, sortable, false);

        return _react2.default.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: (0, _classnames2.default)(classes, isResizable && 'rt-resizable-header', sort ? sort.desc ? '-sort-desc' : '-sort-asc' : '', !show && '-hidden', [].concat(_toConsumableArray(resized)).pop().value === column.id && currentlyResizing && 'rt-resizing-header', pivotBy && pivotBy.slice(0, -1).includes(column.id) && 'rt-header-pivot'),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _utils2.default.asPx(width),
              maxWidth: _utils2.default.asPx(maxWidth)
            }),
            toggleSort: function toggleSort(e) {
              if (isSortable) _this2.sortColumn(column, multiSort ? e.shiftKey : false);
            }
          }, rest),
          _react2.default.createElement(
            'div',
            { className: (0, _classnames2.default)(isResizable && 'rt-resizable-header-content') },
            _utils2.default.normalizeComponent(column.Header, {
              data: sortedData,
              column: column
            })
          ),
          resizer
        );
      };

      var makeHeaders = function makeHeaders() {
        var theadProps = _utils2.default.splitProps(getTheadProps(finalState, undefined, undefined, _this2));
        var theadTrProps = _utils2.default.splitProps(getTheadTrProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(
          TheadComponent,
          _extends({
            className: (0, _classnames2.default)('-header', theadProps.className),
            style: _extends({}, theadProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadProps.rest),
          _react2.default.createElement(
            TrComponent,
            _extends({
              className: theadTrProps.className,
              style: theadTrProps.style
            }, theadTrProps.rest),
            allVisibleColumns.map(makeHeader)
          )
        );
      };

      var makeFilter = function makeFilter(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var width = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var theadFilterThProps = _utils2.default.splitProps(getTheadFilterThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _utils2.default.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadFilterThProps.className, columnHeaderProps.className];

        var styles = _extends({}, column.headerStyle, theadFilterThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadFilterThProps.rest, columnHeaderProps.rest);

        var filter = filtered.find(function (filter) {
          return filter.id === column.id;
        });

        var ResolvedFilterComponent = column.Filter || FilterComponent;

        var isFilterable = _utils2.default.getFirstDefined(column.filterable, filterable, false);

        return _react2.default.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: (0, _classnames2.default)(classes),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _utils2.default.asPx(width),
              maxWidth: _utils2.default.asPx(maxWidth)
            })
          }, rest),
          isFilterable ? _utils2.default.normalizeComponent(ResolvedFilterComponent, {
            column: column,
            filter: filter,
            onChange: function onChange(value) {
              return _this2.filterColumn(column, value);
            }
          }, _defaultProps2.default.column.Filter) : null
        );
      };

      var makeFilters = function makeFilters() {
        var theadFilterProps = _utils2.default.splitProps(getTheadFilterProps(finalState, undefined, undefined, _this2));
        var theadFilterTrProps = _utils2.default.splitProps(getTheadFilterTrProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(
          TheadComponent,
          _extends({
            className: (0, _classnames2.default)('-filters', theadFilterProps.className),
            style: _extends({}, theadFilterProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadFilterProps.rest),
          _react2.default.createElement(
            TrComponent,
            _extends({
              className: theadFilterTrProps.className,
              style: theadFilterTrProps.style
            }, theadFilterTrProps.rest),
            allVisibleColumns.map(makeFilter)
          )
        );
      };

      var makePageRow = function makePageRow(row, i) {
        var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var rowInfo = {
          original: row[originalKey],
          row: row,
          index: row[indexKey],
          viewIndex: rowIndex += 1,
          pageSize: pageSize,
          page: page,
          level: path.length,
          nestingPath: path.concat([i]),
          aggregated: row[aggregatedKey],
          groupedByPivot: row[groupedByPivotKey],
          subRows: row[subRowsKey]
        };
        var isExpanded = _utils2.default.get(expanded, rowInfo.nestingPath);
        var trGroupProps = getTrGroupProps(finalState, rowInfo, undefined, _this2);
        var trProps = _utils2.default.splitProps(getTrProps(finalState, rowInfo, undefined, _this2));
        return _react2.default.createElement(
          TrGroupComponent,
          _extends({ key: rowInfo.nestingPath.join('_') }, trGroupProps),
          _react2.default.createElement(
            TrComponent,
            _extends({
              className: (0, _classnames2.default)(trProps.className, row._viewIndex % 2 ? '-even' : '-odd'),
              style: trProps.style
            }, trProps.rest),
            allVisibleColumns.map(function (column, i2) {
              var resizedCol = resized.find(function (x) {
                return x.id === column.id;
              }) || {};
              var show = typeof column.show === 'function' ? column.show() : column.show;
              var width = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.minWidth);
              var maxWidth = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
              var tdProps = _utils2.default.splitProps(getTdProps(finalState, rowInfo, column, _this2));
              var columnProps = _utils2.default.splitProps(column.getProps(finalState, rowInfo, column, _this2));

              var classes = [tdProps.className, column.className, columnProps.className];

              var styles = _extends({}, tdProps.style, column.style, columnProps.style);

              var cellInfo = _extends({}, rowInfo, {
                isExpanded: isExpanded,
                column: _extends({}, column),
                value: rowInfo.row[column.id],
                pivoted: column.pivoted,
                expander: column.expander,
                resized: resized,
                show: show,
                width: width,
                maxWidth: maxWidth,
                tdProps: tdProps,
                columnProps: columnProps,
                classes: classes,
                styles: styles
              });

              var value = cellInfo.value;

              var useOnExpanderClick = void 0;
              var isBranch = void 0;
              var isPreview = void 0;

              var onExpanderClick = function onExpanderClick(e) {
                var newExpanded = _utils2.default.clone(expanded);
                if (isExpanded) {
                  newExpanded = _utils2.default.set(newExpanded, cellInfo.nestingPath, false);
                } else {
                  newExpanded = _utils2.default.set(newExpanded, cellInfo.nestingPath, {});
                }

                return _this2.setStateWithData({
                  expanded: newExpanded
                }, function () {
                  return onExpandedChange && onExpandedChange(newExpanded, cellInfo.nestingPath, e, cellInfo);
                });
              };

              // Default to a standard cell
              var resolvedCell = _utils2.default.normalizeComponent(column.Cell, cellInfo, value);

              // Resolve Renderers
              var ResolvedAggregatedComponent = column.Aggregated || (!column.aggregate ? AggregatedComponent : column.Cell);
              var ResolvedExpanderComponent = column.Expander || ExpanderComponent;
              var ResolvedPivotValueComponent = column.PivotValue || PivotValueComponent;
              var DefaultResolvedPivotComponent = PivotComponent || function (props) {
                return _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(ResolvedExpanderComponent, props),
                  _react2.default.createElement(ResolvedPivotValueComponent, props)
                );
              };
              var ResolvedPivotComponent = column.Pivot || DefaultResolvedPivotComponent;

              // Is this cell expandable?
              if (cellInfo.pivoted || cellInfo.expander) {
                // Make it expandable by defualt
                cellInfo.expandable = true;
                useOnExpanderClick = true;
                // If pivoted, has no subRows, and does not have a subComponent,
                // do not make expandable
                if (cellInfo.pivoted && !cellInfo.subRows && !SubComponent) {
                  cellInfo.expandable = false;
                }
              }

              if (cellInfo.pivoted) {
                // Is this column a branch?
                isBranch = rowInfo.row[pivotIDKey] === column.id && cellInfo.subRows;
                // Should this column be blank?
                isPreview = pivotBy.indexOf(column.id) > pivotBy.indexOf(rowInfo.row[pivotIDKey]) && cellInfo.subRows;
                // Pivot Cell Render Override
                if (isBranch) {
                  // isPivot
                  resolvedCell = _utils2.default.normalizeComponent(ResolvedPivotComponent, _extends({}, cellInfo, {
                    value: row[pivotValKey]
                  }), row[pivotValKey]);
                } else if (isPreview) {
                  // Show the pivot preview
                  resolvedCell = _utils2.default.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
                } else {
                  resolvedCell = null;
                }
              } else if (cellInfo.aggregated) {
                resolvedCell = _utils2.default.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
              }

              if (cellInfo.expander) {
                resolvedCell = _utils2.default.normalizeComponent(ResolvedExpanderComponent, cellInfo, row[pivotValKey]);
                if (pivotBy) {
                  if (cellInfo.groupedByPivot) {
                    resolvedCell = null;
                  }
                  if (!cellInfo.subRows && !SubComponent) {
                    resolvedCell = null;
                  }
                }
              }

              var resolvedOnExpanderClick = useOnExpanderClick ? onExpanderClick : function () {};

              // If there are multiple onClick events, make sure they don't
              // override eachother. This should maybe be expanded to handle all
              // function attributes
              var interactionProps = {
                onClick: resolvedOnExpanderClick
              };

              if (tdProps.rest.onClick) {
                interactionProps.onClick = function (e) {
                  tdProps.rest.onClick(e, function () {
                    return resolvedOnExpanderClick(e);
                  });
                };
              }

              if (columnProps.rest.onClick) {
                interactionProps.onClick = function (e) {
                  columnProps.rest.onClick(e, function () {
                    return resolvedOnExpanderClick(e);
                  });
                };
              }

              // Return the cell
              return _react2.default.createElement(
                TdComponent
                // eslint-disable-next-line react/no-array-index-key
                ,
                _extends({ key: i2 + '-' + column.id,
                  className: (0, _classnames2.default)(classes, !cellInfo.expandable && !show && 'hidden', cellInfo.expandable && 'rt-expandable', (isBranch || isPreview) && 'rt-pivot'),
                  style: _extends({}, styles, {
                    flex: width + ' 0 auto',
                    width: _utils2.default.asPx(width),
                    maxWidth: _utils2.default.asPx(maxWidth)
                  })
                }, tdProps.rest, columnProps.rest, interactionProps),
                resolvedCell
              );
            })
          ),
          rowInfo.subRows && isExpanded && rowInfo.subRows.map(function (d, i) {
            return makePageRow(d, i, rowInfo.nestingPath);
          }),
          SubComponent && !rowInfo.subRows && isExpanded && SubComponent(rowInfo, function () {
            var newExpanded = _utils2.default.clone(expanded);

            _utils2.default.set(newExpanded, rowInfo.nestingPath, false);
          })
        );
      };

      var makePadColumn = function makePadColumn(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var show = typeof column.show === 'function' ? column.show() : column.show;
        var width = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var flex = width;
        var maxWidth = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var tdProps = _utils2.default.splitProps(getTdProps(finalState, undefined, column, _this2));
        var columnProps = _utils2.default.splitProps(column.getProps(finalState, undefined, column, _this2));

        var classes = [tdProps.className, column.className, columnProps.className];

        var styles = _extends({}, tdProps.style, column.style, columnProps.style);

        return _react2.default.createElement(
          TdComponent,
          _extends({
            key: i + '-' + column.id,
            className: (0, _classnames2.default)(classes, !show && 'hidden'),
            style: _extends({}, styles, {
              flex: flex + ' 0 auto',
              width: _utils2.default.asPx(width),
              maxWidth: _utils2.default.asPx(maxWidth)
            })
          }, tdProps.rest),
          _utils2.default.normalizeComponent(PadRowComponent)
        );
      };

      var makePadRow = function makePadRow(row, i) {
        var trGroupProps = getTrGroupProps(finalState, undefined, undefined, _this2);
        var trProps = _utils2.default.splitProps(getTrProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(
          TrGroupComponent,
          _extends({ key: 'pad-' + i }, trGroupProps),
          _react2.default.createElement(
            TrComponent,
            {
              className: (0, _classnames2.default)('-padRow', (pageRows.length + i) % 2 ? '-even' : '-odd', trProps.className),
              style: trProps.style || {}
            },
            allVisibleColumns.map(makePadColumn)
          )
        );
      };

      var makeColumnFooter = function makeColumnFooter(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var show = typeof column.show === 'function' ? column.show() : column.show;
        var width = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _utils2.default.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var tFootTdProps = _utils2.default.splitProps(getTfootTdProps(finalState, undefined, column, _this2));
        var columnProps = _utils2.default.splitProps(column.getProps(finalState, undefined, column, _this2));
        var columnFooterProps = _utils2.default.splitProps(column.getFooterProps(finalState, undefined, column, _this2));

        var classes = [tFootTdProps.className, column.className, columnProps.className, columnFooterProps.className];

        var styles = _extends({}, tFootTdProps.style, column.style, columnProps.style, columnFooterProps.style);

        return _react2.default.createElement(
          TdComponent,
          _extends({
            key: i + '-' + column.id,
            className: (0, _classnames2.default)(classes, !show && 'hidden'),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _utils2.default.asPx(width),
              maxWidth: _utils2.default.asPx(maxWidth)
            })
          }, columnProps.rest, tFootTdProps.rest, columnFooterProps.rest),
          _utils2.default.normalizeComponent(column.Footer, {
            data: sortedData,
            column: column
          })
        );
      };

      var makeColumnFooters = function makeColumnFooters() {
        var tFootProps = _utils2.default.splitProps(getTfootProps(finalState, undefined, undefined, _this2));
        var tFootTrProps = _utils2.default.splitProps(getTfootTrProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(
          TfootComponent,
          _extends({
            className: tFootProps.className,
            style: _extends({}, tFootProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, tFootProps.rest),
          _react2.default.createElement(
            TrComponent,
            _extends({
              className: (0, _classnames2.default)(tFootTrProps.className),
              style: tFootTrProps.style
            }, tFootTrProps.rest),
            allVisibleColumns.map(makeColumnFooter)
          )
        );
      };

      var makePagination = function makePagination(isTop) {
        var paginationProps = _utils2.default.splitProps(getPaginationProps(finalState, undefined, undefined, _this2));
        return _react2.default.createElement(PaginationComponent, _extends({}, resolvedState, {
          pages: pages,
          canPrevious: canPrevious,
          canNext: canNext,
          onPageChange: _this2.onPageChange,
          onPageSizeChange: _this2.onPageSizeChange,
          className: paginationProps.className,
          style: paginationProps.style,
          isTop: isTop
        }, paginationProps.rest));
      };

      var makeTable = function makeTable() {
        return _react2.default.createElement(
          'div',
          _extends({
            className: (0, _classnames2.default)('ReactTable', className, rootProps.className),
            style: _extends({}, style, rootProps.style)
          }, rootProps.rest),
          showPagination && showPaginationTop ? _react2.default.createElement(
            'div',
            { className: 'pagination-top' },
            makePagination(true)
          ) : null,
          _react2.default.createElement(
            TableComponent,
            _extends({
              className: (0, _classnames2.default)(tableProps.className, currentlyResizing ? 'rt-resizing' : ''),
              style: tableProps.style
            }, tableProps.rest),
            hasHeaderGroups ? makeHeaderGroups() : null,
            makeHeaders(),
            hasFilters ? makeFilters() : null,
            _react2.default.createElement(
              TbodyComponent,
              _extends({
                className: (0, _classnames2.default)(tBodyProps.className),
                style: _extends({}, tBodyProps.style, {
                  minWidth: rowMinWidth + 'px'
                })
              }, tBodyProps.rest),
              pageRows.map(function (d, i) {
                return makePageRow(d, i);
              }),
              padRows.map(makePadRow)
            ),
            hasColumnFooter ? makeColumnFooters() : null
          ),
          showPagination && showPaginationBottom ? _react2.default.createElement(
            'div',
            { className: 'pagination-bottom' },
            makePagination(false)
          ) : null,
          !pageRows.length && _react2.default.createElement(
            NoDataComponent,
            noDataProps,
            _utils2.default.normalizeComponent(noDataText)
          ),
          _react2.default.createElement(LoadingComponent, _extends({ loading: loading, loadingText: loadingText }, loadingProps))
        );
      };

      // childProps are optionally passed to a function-as-a-child
      return children ? children(finalState, makeTable, this) : makeTable();
    }
  }]);

  return ReactTable;
}((0, _methods2.default)((0, _lifecycle2.default)(_react.Component)));

ReactTable.propTypes = _propTypes2.default;
ReactTable.defaultProps = _defaultProps2.default;
exports.default = ReactTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdFRhYmxlRGVmYXVsdHMiLCJkZWZhdWx0UHJvcHMiLCJSZWFjdFRhYmxlIiwicHJvcHMiLCJnZXRSZXNvbHZlZFN0YXRlIiwiYmluZCIsImdldERhdGFNb2RlbCIsImdldFNvcnRlZERhdGEiLCJmaXJlRmV0Y2hEYXRhIiwiZ2V0UHJvcE9yU3RhdGUiLCJnZXRTdGF0ZU9yUHJvcCIsImZpbHRlckRhdGEiLCJzb3J0RGF0YSIsImdldE1pblJvd3MiLCJvblBhZ2VDaGFuZ2UiLCJvblBhZ2VTaXplQ2hhbmdlIiwic29ydENvbHVtbiIsImZpbHRlckNvbHVtbiIsInJlc2l6ZUNvbHVtblN0YXJ0IiwicmVzaXplQ29sdW1uRW5kIiwicmVzaXplQ29sdW1uTW92aW5nIiwicmVzb2x2ZWRTdGF0ZSIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJnZXRQcm9wcyIsImdldFRhYmxlUHJvcHMiLCJnZXRUaGVhZEdyb3VwUHJvcHMiLCJnZXRUaGVhZEdyb3VwVHJQcm9wcyIsImdldFRoZWFkR3JvdXBUaFByb3BzIiwiZ2V0VGhlYWRQcm9wcyIsImdldFRoZWFkVHJQcm9wcyIsImdldFRoZWFkVGhQcm9wcyIsImdldFRoZWFkRmlsdGVyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRyUHJvcHMiLCJnZXRUaGVhZEZpbHRlclRoUHJvcHMiLCJnZXRUYm9keVByb3BzIiwiZ2V0VHJHcm91cFByb3BzIiwiZ2V0VHJQcm9wcyIsImdldFRkUHJvcHMiLCJnZXRUZm9vdFByb3BzIiwiZ2V0VGZvb3RUclByb3BzIiwiZ2V0VGZvb3RUZFByb3BzIiwiZ2V0UGFnaW5hdGlvblByb3BzIiwiZ2V0TG9hZGluZ1Byb3BzIiwiZ2V0Tm9EYXRhUHJvcHMiLCJnZXRSZXNpemVyUHJvcHMiLCJzaG93UGFnaW5hdGlvbiIsInNob3dQYWdpbmF0aW9uVG9wIiwic2hvd1BhZ2luYXRpb25Cb3R0b20iLCJtYW51YWwiLCJsb2FkaW5nVGV4dCIsIm5vRGF0YVRleHQiLCJzb3J0YWJsZSIsIm11bHRpU29ydCIsInJlc2l6YWJsZSIsImZpbHRlcmFibGUiLCJwaXZvdElES2V5IiwicGl2b3RWYWxLZXkiLCJwaXZvdEJ5Iiwic3ViUm93c0tleSIsImFnZ3JlZ2F0ZWRLZXkiLCJvcmlnaW5hbEtleSIsImluZGV4S2V5IiwiZ3JvdXBlZEJ5UGl2b3RLZXkiLCJsb2FkaW5nIiwicGFnZVNpemUiLCJwYWdlIiwic29ydGVkIiwiZmlsdGVyZWQiLCJyZXNpemVkIiwiZXhwYW5kZWQiLCJwYWdlcyIsIm9uRXhwYW5kZWRDaGFuZ2UiLCJUYWJsZUNvbXBvbmVudCIsIlRoZWFkQ29tcG9uZW50IiwiVGJvZHlDb21wb25lbnQiLCJUckdyb3VwQ29tcG9uZW50IiwiVHJDb21wb25lbnQiLCJUaENvbXBvbmVudCIsIlRkQ29tcG9uZW50IiwiVGZvb3RDb21wb25lbnQiLCJQYWdpbmF0aW9uQ29tcG9uZW50IiwiTG9hZGluZ0NvbXBvbmVudCIsIlN1YkNvbXBvbmVudCIsIk5vRGF0YUNvbXBvbmVudCIsIlJlc2l6ZXJDb21wb25lbnQiLCJFeHBhbmRlckNvbXBvbmVudCIsIlBpdm90VmFsdWVDb21wb25lbnQiLCJQaXZvdENvbXBvbmVudCIsIkFnZ3JlZ2F0ZWRDb21wb25lbnQiLCJGaWx0ZXJDb21wb25lbnQiLCJQYWRSb3dDb21wb25lbnQiLCJyZXNvbHZlZERhdGEiLCJhbGxWaXNpYmxlQ29sdW1ucyIsImhlYWRlckdyb3VwcyIsImhhc0hlYWRlckdyb3VwcyIsInNvcnRlZERhdGEiLCJjdXJyZW50bHlSZXNpemluZyIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsIm1pblJvd3MiLCJwYWRSb3dzIiwiXyIsInJhbmdlIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImhhc0NvbHVtbkZvb3RlciIsInNvbWUiLCJkIiwiRm9vdGVyIiwiaGFzRmlsdGVycyIsInJlY3Vyc2VSb3dzVmlld0luZGV4Iiwicm93cyIsInBhdGgiLCJpbmRleCIsIm1hcCIsInJvdyIsImkiLCJyb3dXaXRoVmlld0luZGV4IiwiX3ZpZXdJbmRleCIsIm5ld1BhdGgiLCJjb25jYXQiLCJnZXQiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJyb3dNaW5XaWR0aCIsInN1bSIsInJlc2l6ZWRDb2x1bW4iLCJmaW5kIiwieCIsImlkIiwiZ2V0Rmlyc3REZWZpbmVkIiwidmFsdWUiLCJ3aWR0aCIsIm1pbldpZHRoIiwicm93SW5kZXgiLCJmaW5hbFN0YXRlIiwicm9vdFByb3BzIiwic3BsaXRQcm9wcyIsInVuZGVmaW5lZCIsInRhYmxlUHJvcHMiLCJ0Qm9keVByb3BzIiwibG9hZGluZ1Byb3BzIiwibm9EYXRhUHJvcHMiLCJtYWtlSGVhZGVyR3JvdXAiLCJjb2x1bW4iLCJyZXNpemVkVmFsdWUiLCJjb2wiLCJmbGV4IiwiY29sdW1ucyIsIm1heFdpZHRoIiwidGhlYWRHcm91cFRoUHJvcHMiLCJjb2x1bW5IZWFkZXJQcm9wcyIsImdldEhlYWRlclByb3BzIiwiY2xhc3NlcyIsImhlYWRlckNsYXNzTmFtZSIsInN0eWxlcyIsImhlYWRlclN0eWxlIiwicmVzdCIsImZsZXhTdHlsZXMiLCJhc1B4Iiwibm9ybWFsaXplQ29tcG9uZW50IiwiSGVhZGVyIiwiZGF0YSIsIm1ha2VIZWFkZXJHcm91cHMiLCJ0aGVhZEdyb3VwUHJvcHMiLCJ0aGVhZEdyb3VwVHJQcm9wcyIsIm1ha2VIZWFkZXIiLCJyZXNpemVkQ29sIiwic29ydCIsInNob3ciLCJ0aGVhZFRoUHJvcHMiLCJpc1Jlc2l6YWJsZSIsInJlc2l6ZXIiLCJlIiwiaXNTb3J0YWJsZSIsImRlc2MiLCJwb3AiLCJpbmNsdWRlcyIsInNoaWZ0S2V5IiwibWFrZUhlYWRlcnMiLCJ0aGVhZFByb3BzIiwidGhlYWRUclByb3BzIiwibWFrZUZpbHRlciIsInRoZWFkRmlsdGVyVGhQcm9wcyIsImZpbHRlciIsIlJlc29sdmVkRmlsdGVyQ29tcG9uZW50IiwiRmlsdGVyIiwiaXNGaWx0ZXJhYmxlIiwib25DaGFuZ2UiLCJtYWtlRmlsdGVycyIsInRoZWFkRmlsdGVyUHJvcHMiLCJ0aGVhZEZpbHRlclRyUHJvcHMiLCJtYWtlUGFnZVJvdyIsInJvd0luZm8iLCJvcmlnaW5hbCIsInZpZXdJbmRleCIsImxldmVsIiwibmVzdGluZ1BhdGgiLCJhZ2dyZWdhdGVkIiwiZ3JvdXBlZEJ5UGl2b3QiLCJzdWJSb3dzIiwiaXNFeHBhbmRlZCIsInRyR3JvdXBQcm9wcyIsInRyUHJvcHMiLCJqb2luIiwiaTIiLCJ0ZFByb3BzIiwiY29sdW1uUHJvcHMiLCJjZWxsSW5mbyIsInBpdm90ZWQiLCJleHBhbmRlciIsInVzZU9uRXhwYW5kZXJDbGljayIsImlzQnJhbmNoIiwiaXNQcmV2aWV3Iiwib25FeHBhbmRlckNsaWNrIiwibmV3RXhwYW5kZWQiLCJjbG9uZSIsInNldCIsInNldFN0YXRlV2l0aERhdGEiLCJyZXNvbHZlZENlbGwiLCJDZWxsIiwiUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50IiwiQWdncmVnYXRlZCIsImFnZ3JlZ2F0ZSIsIlJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQiLCJFeHBhbmRlciIsIlJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90VmFsdWUiLCJEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCIsIlJlc29sdmVkUGl2b3RDb21wb25lbnQiLCJQaXZvdCIsImV4cGFuZGFibGUiLCJpbmRleE9mIiwicmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2siLCJpbnRlcmFjdGlvblByb3BzIiwib25DbGljayIsIm1ha2VQYWRDb2x1bW4iLCJtYWtlUGFkUm93IiwibWFrZUNvbHVtbkZvb3RlciIsInRGb290VGRQcm9wcyIsImNvbHVtbkZvb3RlclByb3BzIiwiZ2V0Rm9vdGVyUHJvcHMiLCJtYWtlQ29sdW1uRm9vdGVycyIsInRGb290UHJvcHMiLCJ0Rm9vdFRyUHJvcHMiLCJtYWtlUGFnaW5hdGlvbiIsInBhZ2luYXRpb25Qcm9wcyIsImlzVG9wIiwibWFrZVRhYmxlIiwiQ29tcG9uZW50IiwicHJvcFR5cGVz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LHlCQUFhZ0YsYUFBYixHQUE2QixJQVBoQztBQVFFO0FBQUMsNEJBQUQ7QUFBQTtBQUNFLDJCQUFXLDBCQUFXakQsV0FBVzFILFNBQXRCLENBRGI7QUFFRSxvQ0FDSzBILFdBQVd6SCxLQURoQjtBQUVFa0gsNEJBQWFULFdBQWI7QUFGRjtBQUZGLGlCQU1NZ0IsV0FBV2lCLElBTmpCO0FBUUc3RCx1QkFBU2tCLEdBQVQsQ0FBYSxVQUFDUCxDQUFELEVBQUlTLENBQUo7QUFBQSx1QkFBVTRFLFlBQVlyRixDQUFaLEVBQWVTLENBQWYsQ0FBVjtBQUFBLGVBQWIsQ0FSSDtBQVNHakIsc0JBQVFlLEdBQVIsQ0FBWTJILFVBQVo7QUFUSCxhQVJGO0FBbUJHcEksOEJBQWtCeUksbUJBQWxCLEdBQXdDO0FBbkIzQyxXQVhGO0FBZ0NHeE0sNEJBQWtCRSxvQkFBbEIsR0FDQztBQUFBO0FBQUEsY0FBSyxXQUFVLG1CQUFmO0FBQW9DeU0sMkJBQWUsS0FBZjtBQUFwQyxXQURELEdBRUcsSUFsQ047QUFtQ0csV0FBQ3JKLFNBQVNRLE1BQVYsSUFDQztBQUFDLDJCQUFEO0FBQXFCc0MsdUJBQXJCO0FBQW1DMUMsNEJBQUU0RCxrQkFBRixDQUFxQmpILFVBQXJCO0FBQW5DLFdBcENKO0FBc0NFLHdDQUFDLGdCQUFELGFBQWtCLFNBQVNhLE9BQTNCLEVBQW9DLGFBQWFkLFdBQWpELElBQWtFK0YsWUFBbEU7QUF0Q0YsU0FEZ0I7QUFBQSxPQUFsQjs7QUEyQ0E7QUFDQSxhQUFPNUgsV0FBV0EsU0FBU3NILFVBQVQsRUFBcUJpSCxTQUFyQixFQUFnQyxJQUFoQyxDQUFYLEdBQW1EQSxXQUExRDtBQUNEOzs7O0VBOTBCcUMsdUJBQVEseUJBQVVDLGdCQUFWLENBQVIsQzs7QUFBbkI1UCxVLENBQ1o2UCxTLEdBQVlBLG1CO0FBREE3UCxVLENBRVpELFksR0FBZUEsc0I7a0JBRkhDLFUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuLy9cbmltcG9ydCBfIGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgTGlmZWN5Y2xlIGZyb20gJy4vbGlmZWN5Y2xlJ1xuaW1wb3J0IE1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJ1xuaW1wb3J0IGRlZmF1bHRQcm9wcyBmcm9tICcuL2RlZmF1bHRQcm9wcydcbmltcG9ydCBwcm9wVHlwZXMgZnJvbSAnLi9wcm9wVHlwZXMnXG5cbmV4cG9ydCBjb25zdCBSZWFjdFRhYmxlRGVmYXVsdHMgPSBkZWZhdWx0UHJvcHNcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3RUYWJsZSBleHRlbmRzIE1ldGhvZHMoTGlmZWN5Y2xlKENvbXBvbmVudCkpIHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHByb3BUeXBlc1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzXG5cbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLmdldFJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuZ2V0RGF0YU1vZGVsID0gdGhpcy5nZXREYXRhTW9kZWwuYmluZCh0aGlzKVxuICAgIHRoaXMuZ2V0U29ydGVkRGF0YSA9IHRoaXMuZ2V0U29ydGVkRGF0YS5iaW5kKHRoaXMpXG4gICAgdGhpcy5maXJlRmV0Y2hEYXRhID0gdGhpcy5maXJlRmV0Y2hEYXRhLmJpbmQodGhpcylcbiAgICB0aGlzLmdldFByb3BPclN0YXRlID0gdGhpcy5nZXRQcm9wT3JTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5nZXRTdGF0ZU9yUHJvcCA9IHRoaXMuZ2V0U3RhdGVPclByb3AuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsdGVyRGF0YSA9IHRoaXMuZmlsdGVyRGF0YS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zb3J0RGF0YSA9IHRoaXMuc29ydERhdGEuYmluZCh0aGlzKVxuICAgIHRoaXMuZ2V0TWluUm93cyA9IHRoaXMuZ2V0TWluUm93cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5vblBhZ2VDaGFuZ2UgPSB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vblBhZ2VTaXplQ2hhbmdlID0gdGhpcy5vblBhZ2VTaXplQ2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLnNvcnRDb2x1bW4gPSB0aGlzLnNvcnRDb2x1bW4uYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsdGVyQ29sdW1uID0gdGhpcy5maWx0ZXJDb2x1bW4uYmluZCh0aGlzKVxuICAgIHRoaXMucmVzaXplQ29sdW1uU3RhcnQgPSB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbkVuZCA9IHRoaXMucmVzaXplQ29sdW1uRW5kLmJpbmQodGhpcylcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZyA9IHRoaXMucmVzaXplQ29sdW1uTW92aW5nLmJpbmQodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGdldFByb3BzLFxuICAgICAgZ2V0VGFibGVQcm9wcyxcbiAgICAgIGdldFRoZWFkR3JvdXBQcm9wcyxcbiAgICAgIGdldFRoZWFkR3JvdXBUclByb3BzLFxuICAgICAgZ2V0VGhlYWRHcm91cFRoUHJvcHMsXG4gICAgICBnZXRUaGVhZFByb3BzLFxuICAgICAgZ2V0VGhlYWRUclByb3BzLFxuICAgICAgZ2V0VGhlYWRUaFByb3BzLFxuICAgICAgZ2V0VGhlYWRGaWx0ZXJQcm9wcyxcbiAgICAgIGdldFRoZWFkRmlsdGVyVHJQcm9wcyxcbiAgICAgIGdldFRoZWFkRmlsdGVyVGhQcm9wcyxcbiAgICAgIGdldFRib2R5UHJvcHMsXG4gICAgICBnZXRUckdyb3VwUHJvcHMsXG4gICAgICBnZXRUclByb3BzLFxuICAgICAgZ2V0VGRQcm9wcyxcbiAgICAgIGdldFRmb290UHJvcHMsXG4gICAgICBnZXRUZm9vdFRyUHJvcHMsXG4gICAgICBnZXRUZm9vdFRkUHJvcHMsXG4gICAgICBnZXRQYWdpbmF0aW9uUHJvcHMsXG4gICAgICBnZXRMb2FkaW5nUHJvcHMsXG4gICAgICBnZXROb0RhdGFQcm9wcyxcbiAgICAgIGdldFJlc2l6ZXJQcm9wcyxcbiAgICAgIHNob3dQYWdpbmF0aW9uLFxuICAgICAgc2hvd1BhZ2luYXRpb25Ub3AsXG4gICAgICBzaG93UGFnaW5hdGlvbkJvdHRvbSxcbiAgICAgIG1hbnVhbCxcbiAgICAgIGxvYWRpbmdUZXh0LFxuICAgICAgbm9EYXRhVGV4dCxcbiAgICAgIHNvcnRhYmxlLFxuICAgICAgbXVsdGlTb3J0LFxuICAgICAgcmVzaXphYmxlLFxuICAgICAgZmlsdGVyYWJsZSxcbiAgICAgIC8vIFBpdm90aW5nIFN0YXRlXG4gICAgICBwaXZvdElES2V5LFxuICAgICAgcGl2b3RWYWxLZXksXG4gICAgICBwaXZvdEJ5LFxuICAgICAgc3ViUm93c0tleSxcbiAgICAgIGFnZ3JlZ2F0ZWRLZXksXG4gICAgICBvcmlnaW5hbEtleSxcbiAgICAgIGluZGV4S2V5LFxuICAgICAgZ3JvdXBlZEJ5UGl2b3RLZXksXG4gICAgICAvLyBTdGF0ZVxuICAgICAgbG9hZGluZyxcbiAgICAgIHBhZ2VTaXplLFxuICAgICAgcGFnZSxcbiAgICAgIHNvcnRlZCxcbiAgICAgIGZpbHRlcmVkLFxuICAgICAgcmVzaXplZCxcbiAgICAgIGV4cGFuZGVkLFxuICAgICAgcGFnZXMsXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlLFxuICAgICAgLy8gQ29tcG9uZW50c1xuICAgICAgVGFibGVDb21wb25lbnQsXG4gICAgICBUaGVhZENvbXBvbmVudCxcbiAgICAgIFRib2R5Q29tcG9uZW50LFxuICAgICAgVHJHcm91cENvbXBvbmVudCxcbiAgICAgIFRyQ29tcG9uZW50LFxuICAgICAgVGhDb21wb25lbnQsXG4gICAgICBUZENvbXBvbmVudCxcbiAgICAgIFRmb290Q29tcG9uZW50LFxuICAgICAgUGFnaW5hdGlvbkNvbXBvbmVudCxcbiAgICAgIExvYWRpbmdDb21wb25lbnQsXG4gICAgICBTdWJDb21wb25lbnQsXG4gICAgICBOb0RhdGFDb21wb25lbnQsXG4gICAgICBSZXNpemVyQ29tcG9uZW50LFxuICAgICAgRXhwYW5kZXJDb21wb25lbnQsXG4gICAgICBQaXZvdFZhbHVlQ29tcG9uZW50LFxuICAgICAgUGl2b3RDb21wb25lbnQsXG4gICAgICBBZ2dyZWdhdGVkQ29tcG9uZW50LFxuICAgICAgRmlsdGVyQ29tcG9uZW50LFxuICAgICAgUGFkUm93Q29tcG9uZW50LFxuICAgICAgLy8gRGF0YSBtb2RlbFxuICAgICAgcmVzb2x2ZWREYXRhLFxuICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXG4gICAgICBoZWFkZXJHcm91cHMsXG4gICAgICBoYXNIZWFkZXJHcm91cHMsXG4gICAgICAvLyBTb3J0ZWQgRGF0YVxuICAgICAgc29ydGVkRGF0YSxcbiAgICAgIGN1cnJlbnRseVJlc2l6aW5nLFxuICAgIH0gPSByZXNvbHZlZFN0YXRlXG5cbiAgICAvLyBQYWdpbmF0aW9uXG4gICAgY29uc3Qgc3RhcnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHBhZ2VTaXplXG4gICAgbGV0IHBhZ2VSb3dzID0gbWFudWFsID8gcmVzb2x2ZWREYXRhIDogc29ydGVkRGF0YS5zbGljZShzdGFydFJvdywgZW5kUm93KVxuICAgIGNvbnN0IG1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MoKVxuICAgIGNvbnN0IHBhZFJvd3MgPSBfLnJhbmdlKE1hdGgubWF4KG1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxuXG4gICAgY29uc3QgaGFzQ29sdW1uRm9vdGVyID0gYWxsVmlzaWJsZUNvbHVtbnMuc29tZShkID0+IGQuRm9vdGVyKVxuICAgIGNvbnN0IGhhc0ZpbHRlcnMgPSBmaWx0ZXJhYmxlIHx8IGFsbFZpc2libGVDb2x1bW5zLnNvbWUoZCA9PiBkLmZpbHRlcmFibGUpXG5cbiAgICBjb25zdCByZWN1cnNlUm93c1ZpZXdJbmRleCA9IChyb3dzLCBwYXRoID0gW10sIGluZGV4ID0gLTEpID0+IFtcbiAgICAgIHJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgaW5kZXggKz0gMVxuICAgICAgICBjb25zdCByb3dXaXRoVmlld0luZGV4ID0ge1xuICAgICAgICAgIC4uLnJvdyxcbiAgICAgICAgICBfdmlld0luZGV4OiBpbmRleCxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5jb25jYXQoW2ldKVxuICAgICAgICBpZiAocm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSAmJiBfLmdldChleHBhbmRlZCwgbmV3UGF0aCkpIHtcbiAgICAgICAgICBbcm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSwgaW5kZXhdID0gcmVjdXJzZVJvd3NWaWV3SW5kZXgoXG4gICAgICAgICAgICByb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldLFxuICAgICAgICAgICAgbmV3UGF0aCxcbiAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dXaXRoVmlld0luZGV4XG4gICAgICB9KSxcbiAgICAgIGluZGV4LFxuICAgIF07XG4gICAgW3BhZ2VSb3dzXSA9IHJlY3Vyc2VSb3dzVmlld0luZGV4KHBhZ2VSb3dzKVxuXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSBwYWdlID4gMFxuICAgIGNvbnN0IGNhbk5leHQgPSBwYWdlICsgMSA8IHBhZ2VzXG5cbiAgICBjb25zdCByb3dNaW5XaWR0aCA9IF8uc3VtKFxuICAgICAgYWxsVmlzaWJsZUNvbHVtbnMubWFwKGQgPT4ge1xuICAgICAgICBjb25zdCByZXNpemVkQ29sdW1uID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gZC5pZCkgfHwge31cbiAgICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2x1bW4udmFsdWUsIGQud2lkdGgsIGQubWluV2lkdGgpXG4gICAgICB9KVxuICAgIClcblxuICAgIGxldCByb3dJbmRleCA9IC0xXG5cbiAgICBjb25zdCBmaW5hbFN0YXRlID0ge1xuICAgICAgLi4ucmVzb2x2ZWRTdGF0ZSxcbiAgICAgIHN0YXJ0Um93LFxuICAgICAgZW5kUm93LFxuICAgICAgcGFnZVJvd3MsXG4gICAgICBtaW5Sb3dzLFxuICAgICAgcGFkUm93cyxcbiAgICAgIGhhc0NvbHVtbkZvb3RlcixcbiAgICAgIGNhblByZXZpb3VzLFxuICAgICAgY2FuTmV4dCxcbiAgICAgIHJvd01pbldpZHRoLFxuICAgIH1cblxuICAgIGNvbnN0IHJvb3RQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXG4gICAgY29uc3QgdGFibGVQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUYWJsZVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcbiAgICBjb25zdCB0Qm9keVByb3BzID0gXy5zcGxpdFByb3BzKGdldFRib2R5UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxuICAgIGNvbnN0IGxvYWRpbmdQcm9wcyA9IGdldExvYWRpbmdQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcbiAgICBjb25zdCBub0RhdGFQcm9wcyA9IGdldE5vRGF0YVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxuXG4gICAgLy8gVmlzdWFsIENvbXBvbmVudHNcblxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cCA9IChjb2x1bW4sIGkpID0+IHtcbiAgICAgIGNvbnN0IHJlc2l6ZWRWYWx1ZSA9IGNvbCA9PiAocmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sLmlkKSB8fCB7fSkudmFsdWVcbiAgICAgIGNvbnN0IGZsZXggPSBfLnN1bShcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiAoY29sLndpZHRoIHx8IHJlc2l6ZWRWYWx1ZShjb2wpID8gMCA6IGNvbC5taW5XaWR0aCkpXG4gICAgICApXG4gICAgICBjb25zdCB3aWR0aCA9IF8uc3VtKFxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5taW5XaWR0aCkpXG4gICAgICApXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uc3VtKFxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5tYXhXaWR0aCkpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUaFByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBnZXRUaGVhZEdyb3VwVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcbiAgICAgIClcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXG4gICAgICAgIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUsXG4gICAgICAgIHRoZWFkR3JvdXBUaFByb3BzLmNsYXNzTmFtZSxcbiAgICAgICAgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lLFxuICAgICAgXVxuXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XG4gICAgICAgIC4uLmNvbHVtbi5oZWFkZXJTdHlsZSxcbiAgICAgICAgLi4udGhlYWRHcm91cFRoUHJvcHMuc3R5bGUsXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN0ID0ge1xuICAgICAgICAuLi50aGVhZEdyb3VwVGhQcm9wcy5yZXN0LFxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBmbGV4U3R5bGVzID0ge1xuICAgICAgICBmbGV4OiBgJHtmbGV4fSAwIGF1dG9gLFxuICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcbiAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgIC4uLmZsZXhTdHlsZXMsXG4gICAgICAgICAgfX1cbiAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgPlxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XG4gICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cHMgPSAoKSA9PiB7XG4gICAgICBjb25zdCB0aGVhZEdyb3VwUHJvcHMgPSBfLnNwbGl0UHJvcHMoXG4gICAgICAgIGdldFRoZWFkR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcbiAgICAgIClcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUclByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBnZXRUaGVhZEdyb3VwVHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcbiAgICAgIClcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUaGVhZENvbXBvbmVudFxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWhlYWRlckdyb3VwcycsIHRoZWFkR3JvdXBQcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi50aGVhZEdyb3VwUHJvcHMuc3R5bGUsXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxuICAgICAgICAgIH19XG4gICAgICAgICAgey4uLnRoZWFkR3JvdXBQcm9wcy5yZXN0fVxuICAgICAgICA+XG4gICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkR3JvdXBUclByb3BzLmNsYXNzTmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEdyb3VwVHJQcm9wcy5zdHlsZX1cbiAgICAgICAgICAgIHsuLi50aGVhZEdyb3VwVHJQcm9wcy5yZXN0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtoZWFkZXJHcm91cHMubWFwKG1ha2VIZWFkZXJHcm91cCl9XG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlSGVhZGVyID0gKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cbiAgICAgIGNvbnN0IHNvcnQgPSBzb3J0ZWQuZmluZChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxuICAgICAgY29uc3QgdGhlYWRUaFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcbiAgICAgICAgY29sdW1uLmdldEhlYWRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBjbGFzc2VzID0gW2NvbHVtbi5oZWFkZXJDbGFzc05hbWUsIHRoZWFkVGhQcm9wcy5jbGFzc05hbWUsIGNvbHVtbkhlYWRlclByb3BzLmNsYXNzTmFtZV1cbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxuICAgICAgICAuLi50aGVhZFRoUHJvcHMuc3R5bGUsXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN0ID0ge1xuICAgICAgICAuLi50aGVhZFRoUHJvcHMucmVzdCxcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNSZXNpemFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4ucmVzaXphYmxlLCByZXNpemFibGUsIGZhbHNlKVxuICAgICAgY29uc3QgcmVzaXplciA9IGlzUmVzaXphYmxlID8gKFxuICAgICAgICA8UmVzaXplckNvbXBvbmVudFxuICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMucmVzaXplQ29sdW1uU3RhcnQoZSwgY29sdW1uLCBmYWxzZSl9XG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXtlID0+IHRoaXMucmVzaXplQ29sdW1uU3RhcnQoZSwgY29sdW1uLCB0cnVlKX1cbiAgICAgICAgICB7Li4uZ2V0UmVzaXplclByb3BzKCdmaW5hbFN0YXRlJywgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpfVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGxcblxuICAgICAgY29uc3QgaXNTb3J0YWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zb3J0YWJsZSwgc29ydGFibGUsIGZhbHNlKVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGhDb21wb25lbnRcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxuICAgICAgICAgICAgY2xhc3NlcyxcbiAgICAgICAgICAgIGlzUmVzaXphYmxlICYmICdydC1yZXNpemFibGUtaGVhZGVyJyxcbiAgICAgICAgICAgIHNvcnQgPyAoc29ydC5kZXNjID8gJy1zb3J0LWRlc2MnIDogJy1zb3J0LWFzYycpIDogJycsXG4gICAgICAgICAgICAhc2hvdyAmJiAnLWhpZGRlbicsXG4gICAgICAgICAgICBbLi4ucmVzaXplZF0ucG9wKCkudmFsdWUgPT09IGNvbHVtbi5pZCAmJiBjdXJyZW50bHlSZXNpemluZyAmJiAncnQtcmVzaXppbmctaGVhZGVyJyxcbiAgICAgICAgICAgIHBpdm90QnkgJiYgcGl2b3RCeS5zbGljZSgwLCAtMSkuaW5jbHVkZXMoY29sdW1uLmlkKSAmJiAncnQtaGVhZGVyLXBpdm90J1xuICAgICAgICAgICl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHRvZ2dsZVNvcnQ9e2UgPT4ge1xuICAgICAgICAgICAgaWYgKGlzU29ydGFibGUpIHRoaXMuc29ydENvbHVtbihjb2x1bW4sIG11bHRpU29ydCA/IGUuc2hpZnRLZXkgOiBmYWxzZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHsuLi5yZXN0fVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoaXNSZXNpemFibGUgJiYgJ3J0LXJlc2l6YWJsZS1oZWFkZXItY29udGVudCcpfT5cbiAgICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XG4gICAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXG4gICAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtyZXNpemVyfVxuICAgICAgICA8L1RoQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VIZWFkZXJzID0gKCkgPT4ge1xuICAgICAgY29uc3QgdGhlYWRQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcbiAgICAgIGNvbnN0IHRoZWFkVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctaGVhZGVyJywgdGhlYWRQcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi50aGVhZFByb3BzLnN0eWxlLFxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHsuLi50aGVhZFByb3BzLnJlc3R9XG4gICAgICAgID5cbiAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRUclByb3BzLmNsYXNzTmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZFRyUHJvcHMuc3R5bGV9XG4gICAgICAgICAgICB7Li4udGhlYWRUclByb3BzLnJlc3R9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlSGVhZGVyKX1cbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VGaWx0ZXIgPSAoY29sdW1uLCBpKSA9PiB7XG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclRoUHJvcHMgPSBfLnNwbGl0UHJvcHMoXG4gICAgICAgIGdldFRoZWFkRmlsdGVyVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcbiAgICAgIClcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXG4gICAgICAgIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUsXG4gICAgICAgIHRoZWFkRmlsdGVyVGhQcm9wcy5jbGFzc05hbWUsXG4gICAgICAgIGNvbHVtbkhlYWRlclByb3BzLmNsYXNzTmFtZSxcbiAgICAgIF1cblxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5zdHlsZSxcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3QgPSB7XG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5yZXN0LFxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJlZC5maW5kKGZpbHRlciA9PiBmaWx0ZXIuaWQgPT09IGNvbHVtbi5pZClcblxuICAgICAgY29uc3QgUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQgPSBjb2x1bW4uRmlsdGVyIHx8IEZpbHRlckNvbXBvbmVudFxuXG4gICAgICBjb25zdCBpc0ZpbHRlcmFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4uZmlsdGVyYWJsZSwgZmlsdGVyYWJsZSwgZmFsc2UpXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUaENvbXBvbmVudFxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHsuLi5yZXN0fVxuICAgICAgICA+XG4gICAgICAgICAge2lzRmlsdGVyYWJsZVxuICAgICAgICAgICAgPyBfLm5vcm1hbGl6ZUNvbXBvbmVudChcbiAgICAgICAgICAgICAgICBSZXNvbHZlZEZpbHRlckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdmFsdWUgPT4gdGhpcy5maWx0ZXJDb2x1bW4oY29sdW1uLCB2YWx1ZSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0UHJvcHMuY29sdW1uLkZpbHRlclxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IG51bGx9XG4gICAgICAgIDwvVGhDb21wb25lbnQ+XG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgbWFrZUZpbHRlcnMgPSAoKSA9PiB7XG4gICAgICBjb25zdCB0aGVhZEZpbHRlclByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBnZXRUaGVhZEZpbHRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxuICAgICAgKVxuICAgICAgY29uc3QgdGhlYWRGaWx0ZXJUclByb3BzID0gXy5zcGxpdFByb3BzKFxuICAgICAgICBnZXRUaGVhZEZpbHRlclRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXG4gICAgICApXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGhlYWRDb21wb25lbnRcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1maWx0ZXJzJywgdGhlYWRGaWx0ZXJQcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi50aGVhZEZpbHRlclByb3BzLnN0eWxlLFxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHsuLi50aGVhZEZpbHRlclByb3BzLnJlc3R9XG4gICAgICAgID5cbiAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRGaWx0ZXJUclByb3BzLmNsYXNzTmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEZpbHRlclRyUHJvcHMuc3R5bGV9XG4gICAgICAgICAgICB7Li4udGhlYWRGaWx0ZXJUclByb3BzLnJlc3R9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlRmlsdGVyKX1cbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VQYWdlUm93ID0gKHJvdywgaSwgcGF0aCA9IFtdKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmZvID0ge1xuICAgICAgICBvcmlnaW5hbDogcm93W29yaWdpbmFsS2V5XSxcbiAgICAgICAgcm93LFxuICAgICAgICBpbmRleDogcm93W2luZGV4S2V5XSxcbiAgICAgICAgdmlld0luZGV4OiAocm93SW5kZXggKz0gMSksXG4gICAgICAgIHBhZ2VTaXplLFxuICAgICAgICBwYWdlLFxuICAgICAgICBsZXZlbDogcGF0aC5sZW5ndGgsXG4gICAgICAgIG5lc3RpbmdQYXRoOiBwYXRoLmNvbmNhdChbaV0pLFxuICAgICAgICBhZ2dyZWdhdGVkOiByb3dbYWdncmVnYXRlZEtleV0sXG4gICAgICAgIGdyb3VwZWRCeVBpdm90OiByb3dbZ3JvdXBlZEJ5UGl2b3RLZXldLFxuICAgICAgICBzdWJSb3dzOiByb3dbc3ViUm93c0tleV0sXG4gICAgICB9XG4gICAgICBjb25zdCBpc0V4cGFuZGVkID0gXy5nZXQoZXhwYW5kZWQsIHJvd0luZm8ubmVzdGluZ1BhdGgpXG4gICAgICBjb25zdCB0ckdyb3VwUHJvcHMgPSBnZXRUckdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgdW5kZWZpbmVkLCB0aGlzKVxuICAgICAgY29uc3QgdHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUclByb3BzKGZpbmFsU3RhdGUsIHJvd0luZm8sIHVuZGVmaW5lZCwgdGhpcykpXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VHJHcm91cENvbXBvbmVudCBrZXk9e3Jvd0luZm8ubmVzdGluZ1BhdGguam9pbignXycpfSB7Li4udHJHcm91cFByb3BzfT5cbiAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0clByb3BzLmNsYXNzTmFtZSwgcm93Ll92aWV3SW5kZXggJSAyID8gJy1ldmVuJyA6ICctb2RkJyl9XG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZX1cbiAgICAgICAgICAgIHsuLi50clByb3BzLnJlc3R9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxuICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XG4gICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXG4gICAgICAgICAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXG4gICAgICAgICAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCBjb2x1bW4sIHRoaXMpKVxuICAgICAgICAgICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgY29sdW1uLCB0aGlzKSlcblxuICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXG5cbiAgICAgICAgICAgICAgY29uc3Qgc3R5bGVzID0ge1xuICAgICAgICAgICAgICAgIC4uLnRkUHJvcHMuc3R5bGUsXG4gICAgICAgICAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxuICAgICAgICAgICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgY2VsbEluZm8gPSB7XG4gICAgICAgICAgICAgICAgLi4ucm93SW5mbyxcbiAgICAgICAgICAgICAgICBpc0V4cGFuZGVkLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogeyAuLi5jb2x1bW4gfSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcm93SW5mby5yb3dbY29sdW1uLmlkXSxcbiAgICAgICAgICAgICAgICBwaXZvdGVkOiBjb2x1bW4ucGl2b3RlZCxcbiAgICAgICAgICAgICAgICBleHBhbmRlcjogY29sdW1uLmV4cGFuZGVyLFxuICAgICAgICAgICAgICAgIHJlc2l6ZWQsXG4gICAgICAgICAgICAgICAgc2hvdyxcbiAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCxcbiAgICAgICAgICAgICAgICB0ZFByb3BzLFxuICAgICAgICAgICAgICAgIGNvbHVtblByb3BzLFxuICAgICAgICAgICAgICAgIGNsYXNzZXMsXG4gICAgICAgICAgICAgICAgc3R5bGVzLFxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjZWxsSW5mby52YWx1ZVxuXG4gICAgICAgICAgICAgIGxldCB1c2VPbkV4cGFuZGVyQ2xpY2tcbiAgICAgICAgICAgICAgbGV0IGlzQnJhbmNoXG4gICAgICAgICAgICAgIGxldCBpc1ByZXZpZXdcblxuICAgICAgICAgICAgICBjb25zdCBvbkV4cGFuZGVyQ2xpY2sgPSBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3RXhwYW5kZWQgPSBfLmNsb25lKGV4cGFuZGVkKVxuICAgICAgICAgICAgICAgIGlmIChpc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgICBuZXdFeHBhbmRlZCA9IF8uc2V0KG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZmFsc2UpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCB7fSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZDogbmV3RXhwYW5kZWQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgb25FeHBhbmRlZENoYW5nZSAmJlxuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZGVkQ2hhbmdlKG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZSwgY2VsbEluZm8pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBhIHN0YW5kYXJkIGNlbGxcbiAgICAgICAgICAgICAgbGV0IHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5DZWxsLCBjZWxsSW5mbywgdmFsdWUpXG5cbiAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBSZW5kZXJlcnNcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50ID1cbiAgICAgICAgICAgICAgICBjb2x1bW4uQWdncmVnYXRlZCB8fCAoIWNvbHVtbi5hZ2dyZWdhdGUgPyBBZ2dyZWdhdGVkQ29tcG9uZW50IDogY29sdW1uLkNlbGwpXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQgPSBjb2x1bW4uRXhwYW5kZXIgfHwgRXhwYW5kZXJDb21wb25lbnRcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50ID0gY29sdW1uLlBpdm90VmFsdWUgfHwgUGl2b3RWYWx1ZUNvbXBvbmVudFxuICAgICAgICAgICAgICBjb25zdCBEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCA9XG4gICAgICAgICAgICAgICAgUGl2b3RDb21wb25lbnQgfHxcbiAgICAgICAgICAgICAgICAocHJvcHMgPT4gKFxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQgey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgICAgICAgICA8UmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50IHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkUGl2b3RDb21wb25lbnQgPSBjb2x1bW4uUGl2b3QgfHwgRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnRcblxuICAgICAgICAgICAgICAvLyBJcyB0aGlzIGNlbGwgZXhwYW5kYWJsZT9cbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgfHwgY2VsbEluZm8uZXhwYW5kZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGl0IGV4cGFuZGFibGUgYnkgZGVmdWFsdFxuICAgICAgICAgICAgICAgIGNlbGxJbmZvLmV4cGFuZGFibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgdXNlT25FeHBhbmRlckNsaWNrID0gdHJ1ZVxuICAgICAgICAgICAgICAgIC8vIElmIHBpdm90ZWQsIGhhcyBubyBzdWJSb3dzLCBhbmQgZG9lcyBub3QgaGF2ZSBhIHN1YkNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgbWFrZSBleHBhbmRhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgJiYgIWNlbGxJbmZvLnN1YlJvd3MgJiYgIVN1YkNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIGNvbHVtbiBhIGJyYW5jaD9cbiAgICAgICAgICAgICAgICBpc0JyYW5jaCA9IHJvd0luZm8ucm93W3Bpdm90SURLZXldID09PSBjb2x1bW4uaWQgJiYgY2VsbEluZm8uc3ViUm93c1xuICAgICAgICAgICAgICAgIC8vIFNob3VsZCB0aGlzIGNvbHVtbiBiZSBibGFuaz9cbiAgICAgICAgICAgICAgICBpc1ByZXZpZXcgPVxuICAgICAgICAgICAgICAgICAgcGl2b3RCeS5pbmRleE9mKGNvbHVtbi5pZCkgPiBwaXZvdEJ5LmluZGV4T2Yocm93SW5mby5yb3dbcGl2b3RJREtleV0pICYmXG4gICAgICAgICAgICAgICAgICBjZWxsSW5mby5zdWJSb3dzXG4gICAgICAgICAgICAgICAgLy8gUGl2b3QgQ2VsbCBSZW5kZXIgT3ZlcnJpZGVcbiAgICAgICAgICAgICAgICBpZiAoaXNCcmFuY2gpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGlzUGl2b3RcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFxuICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZFBpdm90Q29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY2VsbEluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJvd1twaXZvdFZhbEtleV0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJvd1twaXZvdFZhbEtleV1cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzUHJldmlldykge1xuICAgICAgICAgICAgICAgICAgLy8gU2hvdyB0aGUgcGl2b3QgcHJldmlld1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50LCBjZWxsSW5mbywgdmFsdWUpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2VsbEluZm8uYWdncmVnYXRlZCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCwgY2VsbEluZm8sIHZhbHVlKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLmV4cGFuZGVyKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoXG4gICAgICAgICAgICAgICAgICBSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8sXG4gICAgICAgICAgICAgICAgICByb3dbcGl2b3RWYWxLZXldXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGlmIChwaXZvdEJ5KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoY2VsbEluZm8uZ3JvdXBlZEJ5UGl2b3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsSW5mby5zdWJSb3dzICYmICFTdWJDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkT25FeHBhbmRlckNsaWNrID0gdXNlT25FeHBhbmRlckNsaWNrID8gb25FeHBhbmRlckNsaWNrIDogKCkgPT4ge31cblxuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgb25DbGljayBldmVudHMsIG1ha2Ugc3VyZSB0aGV5IGRvbid0XG4gICAgICAgICAgICAgIC8vIG92ZXJyaWRlIGVhY2hvdGhlci4gVGhpcyBzaG91bGQgbWF5YmUgYmUgZXhwYW5kZWQgdG8gaGFuZGxlIGFsbFxuICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgb25DbGljazogcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2ssXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGRQcm9wcy5yZXN0Lm9uQ2xpY2spIHtcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvblByb3BzLm9uQ2xpY2sgPSBlID0+IHtcbiAgICAgICAgICAgICAgICAgIHRkUHJvcHMucmVzdC5vbkNsaWNrKGUsICgpID0+IHJlc29sdmVkT25FeHBhbmRlckNsaWNrKGUpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChjb2x1bW5Qcm9wcy5yZXN0Lm9uQ2xpY2spIHtcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvblByb3BzLm9uQ2xpY2sgPSBlID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbHVtblByb3BzLnJlc3Qub25DbGljayhlLCAoKSA9PiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayhlKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGNlbGxcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8VGRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcbiAgICAgICAgICAgICAgICAgIGtleT17YCR7aTJ9LSR7Y29sdW1uLmlkfWB9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMsXG4gICAgICAgICAgICAgICAgICAgICFjZWxsSW5mby5leHBhbmRhYmxlICYmICFzaG93ICYmICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlICYmICdydC1leHBhbmRhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgKGlzQnJhbmNoIHx8IGlzUHJldmlldykgJiYgJ3J0LXBpdm90J1xuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICB7Li4udGRQcm9wcy5yZXN0fVxuICAgICAgICAgICAgICAgICAgey4uLmNvbHVtblByb3BzLnJlc3R9XG4gICAgICAgICAgICAgICAgICB7Li4uaW50ZXJhY3Rpb25Qcm9wc31cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7cmVzb2x2ZWRDZWxsfVxuICAgICAgICAgICAgICAgIDwvVGRDb21wb25lbnQ+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgICAge3Jvd0luZm8uc3ViUm93cyAmJlxuICAgICAgICAgICAgaXNFeHBhbmRlZCAmJlxuICAgICAgICAgICAgcm93SW5mby5zdWJSb3dzLm1hcCgoZCwgaSkgPT4gbWFrZVBhZ2VSb3coZCwgaSwgcm93SW5mby5uZXN0aW5nUGF0aCkpfVxuICAgICAgICAgIHtTdWJDb21wb25lbnQgJiZcbiAgICAgICAgICAgICFyb3dJbmZvLnN1YlJvd3MgJiZcbiAgICAgICAgICAgIGlzRXhwYW5kZWQgJiZcbiAgICAgICAgICAgIFN1YkNvbXBvbmVudChyb3dJbmZvLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0gXy5jbG9uZShleHBhbmRlZClcblxuICAgICAgICAgICAgICBfLnNldChuZXdFeHBhbmRlZCwgcm93SW5mby5uZXN0aW5nUGF0aCwgZmFsc2UpXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgPC9Uckdyb3VwQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VQYWRDb2x1bW4gPSAoY29sdW1uLCBpKSA9PiB7XG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxuICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcbiAgICAgIGNvbnN0IGZsZXggPSB3aWR0aFxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcbiAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXG4gICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxuXG4gICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXG5cbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgICAgLi4udGRQcm9wcy5zdHlsZSxcbiAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxuICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzLCAhc2hvdyAmJiAnaGlkZGVuJyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgIGZsZXg6IGAke2ZsZXh9IDAgYXV0b2AsXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxuICAgICAgICAgIH19XG4gICAgICAgICAgey4uLnRkUHJvcHMucmVzdH1cbiAgICAgICAgPlxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChQYWRSb3dDb21wb25lbnQpfVxuICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VQYWRSb3cgPSAocm93LCBpKSA9PiB7XG4gICAgICBjb25zdCB0ckdyb3VwUHJvcHMgPSBnZXRUckdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXG4gICAgICBjb25zdCB0clByb3BzID0gXy5zcGxpdFByb3BzKGdldFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRyR3JvdXBDb21wb25lbnQga2V5PXtgcGFkLSR7aX1gfSB7Li4udHJHcm91cFByb3BzfT5cbiAgICAgICAgICA8VHJDb21wb25lbnRcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcbiAgICAgICAgICAgICAgJy1wYWRSb3cnLFxuICAgICAgICAgICAgICAocGFnZVJvd3MubGVuZ3RoICsgaSkgJSAyID8gJy1ldmVuJyA6ICctb2RkJyxcbiAgICAgICAgICAgICAgdHJQcm9wcy5jbGFzc05hbWVcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZSB8fCB7fX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VQYWRDb2x1bW4pfVxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XG4gICAgICAgIDwvVHJHcm91cENvbXBvbmVudD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlQ29sdW1uRm9vdGVyID0gKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxuICAgICAgY29uc3QgdEZvb3RUZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXG4gICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxuICAgICAgY29uc3QgY29sdW1uRm9vdGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXG4gICAgICAgIGNvbHVtbi5nZXRGb290ZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcbiAgICAgIClcblxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcbiAgICAgICAgdEZvb3RUZFByb3BzLmNsYXNzTmFtZSxcbiAgICAgICAgY29sdW1uLmNsYXNzTmFtZSxcbiAgICAgICAgY29sdW1uUHJvcHMuY2xhc3NOYW1lLFxuICAgICAgICBjb2x1bW5Gb290ZXJQcm9wcy5jbGFzc05hbWUsXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgICAgLi4udEZvb3RUZFByb3BzLnN0eWxlLFxuICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXG4gICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxuICAgICAgICAuLi5jb2x1bW5Gb290ZXJQcm9wcy5zdHlsZSxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRkQ29tcG9uZW50XG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzLCAhc2hvdyAmJiAnaGlkZGVuJyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIHsuLi5jb2x1bW5Qcm9wcy5yZXN0fVxuICAgICAgICAgIHsuLi50Rm9vdFRkUHJvcHMucmVzdH1cbiAgICAgICAgICB7Li4uY29sdW1uRm9vdGVyUHJvcHMucmVzdH1cbiAgICAgICAgPlxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uRm9vdGVyLCB7XG4gICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0pfVxuICAgICAgICA8L1RkQ29tcG9uZW50PlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VDb2x1bW5Gb290ZXJzID0gKCkgPT4ge1xuICAgICAgY29uc3QgdEZvb3RQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcbiAgICAgIGNvbnN0IHRGb290VHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRmb290Q29tcG9uZW50XG4gICAgICAgICAgY2xhc3NOYW1lPXt0Rm9vdFByb3BzLmNsYXNzTmFtZX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4udEZvb3RQcm9wcy5zdHlsZSxcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXG4gICAgICAgICAgfX1cbiAgICAgICAgICB7Li4udEZvb3RQcm9wcy5yZXN0fVxuICAgICAgICA+XG4gICAgICAgICAgPFRyQ29tcG9uZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModEZvb3RUclByb3BzLmNsYXNzTmFtZSl9XG4gICAgICAgICAgICBzdHlsZT17dEZvb3RUclByb3BzLnN0eWxlfVxuICAgICAgICAgICAgey4uLnRGb290VHJQcm9wcy5yZXN0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUNvbHVtbkZvb3Rlcil9XG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cbiAgICAgICAgPC9UZm9vdENvbXBvbmVudD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlUGFnaW5hdGlvbiA9IGlzVG9wID0+IHtcbiAgICAgIGNvbnN0IHBhZ2luYXRpb25Qcm9wcyA9IF8uc3BsaXRQcm9wcyhcbiAgICAgICAgZ2V0UGFnaW5hdGlvblByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxuICAgICAgKVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBhZ2luYXRpb25Db21wb25lbnRcbiAgICAgICAgICB7Li4ucmVzb2x2ZWRTdGF0ZX1cbiAgICAgICAgICBwYWdlcz17cGFnZXN9XG4gICAgICAgICAgY2FuUHJldmlvdXM9e2NhblByZXZpb3VzfVxuICAgICAgICAgIGNhbk5leHQ9e2Nhbk5leHR9XG4gICAgICAgICAgb25QYWdlQ2hhbmdlPXt0aGlzLm9uUGFnZUNoYW5nZX1cbiAgICAgICAgICBvblBhZ2VTaXplQ2hhbmdlPXt0aGlzLm9uUGFnZVNpemVDaGFuZ2V9XG4gICAgICAgICAgY2xhc3NOYW1lPXtwYWdpbmF0aW9uUHJvcHMuY2xhc3NOYW1lfVxuICAgICAgICAgIHN0eWxlPXtwYWdpbmF0aW9uUHJvcHMuc3R5bGV9XG4gICAgICAgICAgaXNUb3A9e2lzVG9wfVxuICAgICAgICAgIHsuLi5wYWdpbmF0aW9uUHJvcHMucmVzdH1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlVGFibGUgPSAoKSA9PiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnUmVhY3RUYWJsZScsIGNsYXNzTmFtZSwgcm9vdFByb3BzLmNsYXNzTmFtZSl9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgLi4ucm9vdFByb3BzLnN0eWxlLFxuICAgICAgICB9fVxuICAgICAgICB7Li4ucm9vdFByb3BzLnJlc3R9XG4gICAgICA+XG4gICAgICAgIHtzaG93UGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvblRvcCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2luYXRpb24tdG9wXCI+e21ha2VQYWdpbmF0aW9uKHRydWUpfTwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRhYmxlUHJvcHMuY2xhc3NOYW1lLCBjdXJyZW50bHlSZXNpemluZyA/ICdydC1yZXNpemluZycgOiAnJyl9XG4gICAgICAgICAgc3R5bGU9e3RhYmxlUHJvcHMuc3R5bGV9XG4gICAgICAgICAgey4uLnRhYmxlUHJvcHMucmVzdH1cbiAgICAgICAgPlxuICAgICAgICAgIHtoYXNIZWFkZXJHcm91cHMgPyBtYWtlSGVhZGVyR3JvdXBzKCkgOiBudWxsfVxuICAgICAgICAgIHttYWtlSGVhZGVycygpfVxuICAgICAgICAgIHtoYXNGaWx0ZXJzID8gbWFrZUZpbHRlcnMoKSA6IG51bGx9XG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModEJvZHlQcm9wcy5jbGFzc05hbWUpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgLi4udEJvZHlQcm9wcy5zdHlsZSxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICB7Li4udEJvZHlQcm9wcy5yZXN0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwYWdlUm93cy5tYXAoKGQsIGkpID0+IG1ha2VQYWdlUm93KGQsIGkpKX1cbiAgICAgICAgICAgIHtwYWRSb3dzLm1hcChtYWtlUGFkUm93KX1cbiAgICAgICAgICA8L1Rib2R5Q29tcG9uZW50PlxuICAgICAgICAgIHtoYXNDb2x1bW5Gb290ZXIgPyBtYWtlQ29sdW1uRm9vdGVycygpIDogbnVsbH1cbiAgICAgICAgPC9UYWJsZUNvbXBvbmVudD5cbiAgICAgICAge3Nob3dQYWdpbmF0aW9uICYmIHNob3dQYWdpbmF0aW9uQm90dG9tID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi1ib3R0b21cIj57bWFrZVBhZ2luYXRpb24oZmFsc2UpfTwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgeyFwYWdlUm93cy5sZW5ndGggJiYgKFxuICAgICAgICAgIDxOb0RhdGFDb21wb25lbnQgey4uLm5vRGF0YVByb3BzfT57Xy5ub3JtYWxpemVDb21wb25lbnQobm9EYXRhVGV4dCl9PC9Ob0RhdGFDb21wb25lbnQ+XG4gICAgICAgICl9XG4gICAgICAgIDxMb2FkaW5nQ29tcG9uZW50IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRpbmdUZXh0PXtsb2FkaW5nVGV4dH0gey4uLmxvYWRpbmdQcm9wc30gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcblxuICAgIC8vIGNoaWxkUHJvcHMgYXJlIG9wdGlvbmFsbHkgcGFzc2VkIHRvIGEgZnVuY3Rpb24tYXMtYS1jaGlsZFxuICAgIHJldHVybiBjaGlsZHJlbiA/IGNoaWxkcmVuKGZpbmFsU3RhdGUsIG1ha2VUYWJsZSwgdGhpcykgOiBtYWtlVGFibGUoKVxuICB9XG59XG4iXX0=