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

    _this.tableRef = _react2.default.createRef();
    _this.fakeScrollRef = _react2.default.createRef();

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


      var fakeScrollLeft = 0;
      var tableScrollLeft = 0;

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
            className: (0, _classnames2.default)(classes, isResizable && 'rt-resizable-header', sort ? sort.desc ? '-sort-desc' : '-sort-asc' : '', isSortable && '-cursor-pointer', !show && '-hidden', pivotBy && pivotBy.slice(0, -1).includes(column.id) && 'rt-header-pivot'),
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

      var scroll = function scroll(type) {
        if (type === 'fakeScroll' && _this2.fakeScrollRef.current.scrollLeft !== tableScrollLeft) {
          fakeScrollLeft = _this2.fakeScrollRef.current.scrollLeft;
          _this2.tableRef.current.scrollLeft = _this2.fakeScrollRef.current.scrollLeft;
        }
        if (type === 'table' && _this2.tableRef.current.scrollLeft !== fakeScrollLeft) {
          tableScrollLeft = _this2.tableRef.current.scrollLeft;
          _this2.fakeScrollRef.current.scrollLeft = _this2.tableRef.current.scrollLeft;
        }
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
            'div',
            {
              ref: _this2.fakeScrollRef,
              style: { overflowX: "auto", overflowY: "hidden" },
              onScroll: function onScroll() {
                return scroll('fakeScroll');
              }
            },
            _react2.default.createElement(
              'div',
              { style: { width: rowMinWidth + 'px', height: 0 } },
              '\xA0'
            )
          ),
          _react2.default.createElement(
            TableComponent,
            _extends({
              onScroll: function onScroll() {
                return scroll('table');
              },
              ref: _this2.tableRef,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdFRhYmxlRGVmYXVsdHMiLCJkZWZhdWx0UHJvcHMiLCJSZWFjdFRhYmxlIiwicHJvcHMiLCJ0YWJsZVJlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiZmFrZVNjcm9sbFJlZiIsImdldFJlc29sdmVkU3RhdGUiLCJiaW5kIiwiZ2V0RGF0YU1vZGVsIiwiZ2V0U29ydGVkRGF0YSIsImZpcmVGZXRjaERhdGEiLCJnZXRQcm9wT3JTdGF0ZSIsImdldFN0YXRlT3JQcm9wIiwiZmlsdGVyRGF0YSIsInNvcnREYXRhIiwiZ2V0TWluUm93cyIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJzb3J0Q29sdW1uIiwiZmlsdGVyQ29sdW1uIiwicmVzaXplQ29sdW1uU3RhcnQiLCJyZXNpemVDb2x1bW5FbmQiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNvbHZlZFN0YXRlIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsInNob3dQYWdpbmF0aW9uIiwic2hvd1BhZ2luYXRpb25Ub3AiLCJzaG93UGFnaW5hdGlvbkJvdHRvbSIsIm1hbnVhbCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInNvcnRhYmxlIiwibXVsdGlTb3J0IiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInBpdm90QnkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsImxvYWRpbmciLCJwYWdlU2l6ZSIsInBhZ2UiLCJzb3J0ZWQiLCJmaWx0ZXJlZCIsInJlc2l6ZWQiLCJleHBhbmRlZCIsInBhZ2VzIiwib25FeHBhbmRlZENoYW5nZSIsIlRhYmxlQ29tcG9uZW50IiwiVGhlYWRDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiU3ViQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90Q29tcG9uZW50IiwiQWdncmVnYXRlZENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCIsInJlc29sdmVkRGF0YSIsImFsbFZpc2libGVDb2x1bW5zIiwiaGVhZGVyR3JvdXBzIiwiaGFzSGVhZGVyR3JvdXBzIiwic29ydGVkRGF0YSIsImN1cnJlbnRseVJlc2l6aW5nIiwiZmFrZVNjcm9sbExlZnQiLCJ0YWJsZVNjcm9sbExlZnQiLCJzdGFydFJvdyIsImVuZFJvdyIsInBhZ2VSb3dzIiwic2xpY2UiLCJtaW5Sb3dzIiwicGFkUm93cyIsIl8iLCJyYW5nZSIsIk1hdGgiLCJtYXgiLCJsZW5ndGgiLCJoYXNDb2x1bW5Gb290ZXIiLCJzb21lIiwiZCIsIkZvb3RlciIsImhhc0ZpbHRlcnMiLCJyZWN1cnNlUm93c1ZpZXdJbmRleCIsInJvd3MiLCJwYXRoIiwiaW5kZXgiLCJtYXAiLCJyb3ciLCJpIiwicm93V2l0aFZpZXdJbmRleCIsIl92aWV3SW5kZXgiLCJuZXdQYXRoIiwiY29uY2F0IiwiZ2V0IiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwicm93TWluV2lkdGgiLCJzdW0iLCJyZXNpemVkQ29sdW1uIiwiZmluZCIsIngiLCJpZCIsImdldEZpcnN0RGVmaW5lZCIsInZhbHVlIiwid2lkdGgiLCJtaW5XaWR0aCIsInJvd0luZGV4IiwiZmluYWxTdGF0ZSIsInJvb3RQcm9wcyIsInNwbGl0UHJvcHMiLCJ1bmRlZmluZWQiLCJ0YWJsZVByb3BzIiwidEJvZHlQcm9wcyIsImxvYWRpbmdQcm9wcyIsIm5vRGF0YVByb3BzIiwibWFrZUhlYWRlckdyb3VwIiwiY29sdW1uIiwicmVzaXplZFZhbHVlIiwiY29sIiwiZmxleCIsImNvbHVtbnMiLCJtYXhXaWR0aCIsInRoZWFkR3JvdXBUaFByb3BzIiwiY29sdW1uSGVhZGVyUHJvcHMiLCJnZXRIZWFkZXJQcm9wcyIsImNsYXNzZXMiLCJoZWFkZXJDbGFzc05hbWUiLCJzdHlsZXMiLCJoZWFkZXJTdHlsZSIsInJlc3QiLCJmbGV4U3R5bGVzIiwiYXNQeCIsIm5vcm1hbGl6ZUNvbXBvbmVudCIsIkhlYWRlciIsImRhdGEiLCJtYWtlSGVhZGVyR3JvdXBzIiwidGhlYWRHcm91cFByb3BzIiwidGhlYWRHcm91cFRyUHJvcHMiLCJtYWtlSGVhZGVyIiwicmVzaXplZENvbCIsInNvcnQiLCJzaG93IiwidGhlYWRUaFByb3BzIiwiaXNSZXNpemFibGUiLCJyZXNpemVyIiwiZSIsImlzU29ydGFibGUiLCJkZXNjIiwiaW5jbHVkZXMiLCJzaGlmdEtleSIsIm1ha2VIZWFkZXJzIiwidGhlYWRQcm9wcyIsInRoZWFkVHJQcm9wcyIsIm1ha2VGaWx0ZXIiLCJ0aGVhZEZpbHRlclRoUHJvcHMiLCJmaWx0ZXIiLCJSZXNvbHZlZEZpbHRlckNvbXBvbmVudCIsIkZpbHRlciIsImlzRmlsdGVyYWJsZSIsIm9uQ2hhbmdlIiwibWFrZUZpbHRlcnMiLCJ0aGVhZEZpbHRlclByb3BzIiwidGhlYWRGaWx0ZXJUclByb3BzIiwibWFrZVBhZ2VSb3ciLCJyb3dJbmZvIiwib3JpZ2luYWwiLCJ2aWV3SW5kZXgiLCJsZXZlbCIsIm5lc3RpbmdQYXRoIiwiYWdncmVnYXRlZCIsImdyb3VwZWRCeVBpdm90Iiwic3ViUm93cyIsImlzRXhwYW5kZWQiLCJ0ckdyb3VwUHJvcHMiLCJ0clByb3BzIiwiam9pbiIsImkyIiwidGRQcm9wcyIsImNvbHVtblByb3BzIiwiY2VsbEluZm8iLCJwaXZvdGVkIiwiZXhwYW5kZXIiLCJ1c2VPbkV4cGFuZGVyQ2xpY2siLCJpc0JyYW5jaCIsImlzUHJldmlldyIsIm9uRXhwYW5kZXJDbGljayIsIm5ld0V4cGFuZGVkIiwiY2xvbmUiLCJzZXQiLCJzZXRTdGF0ZVdpdGhEYXRhIiwicmVzb2x2ZWRDZWxsIiwiQ2VsbCIsIlJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCIsIkFnZ3JlZ2F0ZWQiLCJhZ2dyZWdhdGUiLCJSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50IiwiRXhwYW5kZXIiLCJSZXNvbHZlZFBpdm90VmFsdWVDb21wb25lbnQiLCJQaXZvdFZhbHVlIiwiRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnQiLCJSZXNvbHZlZFBpdm90Q29tcG9uZW50IiwiUGl2b3QiLCJleHBhbmRhYmxlIiwiaW5kZXhPZiIsInJlc29sdmVkT25FeHBhbmRlckNsaWNrIiwiaW50ZXJhY3Rpb25Qcm9wcyIsIm9uQ2xpY2siLCJtYWtlUGFkQ29sdW1uIiwibWFrZVBhZFJvdyIsIm1ha2VDb2x1bW5Gb290ZXIiLCJ0Rm9vdFRkUHJvcHMiLCJjb2x1bW5Gb290ZXJQcm9wcyIsImdldEZvb3RlclByb3BzIiwibWFrZUNvbHVtbkZvb3RlcnMiLCJ0Rm9vdFByb3BzIiwidEZvb3RUclByb3BzIiwibWFrZVBhZ2luYXRpb24iLCJwYWdpbmF0aW9uUHJvcHMiLCJpc1RvcCIsInNjcm9sbCIsInR5cGUiLCJjdXJyZW50Iiwic2Nyb2xsTGVmdCIsIm1ha2VUYWJsZSIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsImhlaWdodCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztBQUxBOzs7QUFPTyxJQUFNQSxrREFBcUJDLHNCQUEzQjs7SUFFY0MsVTs7O0FBSW5CLHNCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsd0hBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLFFBQUwsR0FBZ0JDLGdCQUFNQyxTQUFOLEVBQWhCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQkYsZ0JBQU1DLFNBQU4sRUFBckI7O0FBRUEsVUFBS0UsZ0JBQUwsR0FBd0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXhCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCRCxJQUFsQixPQUFwQjtBQUNBLFVBQUtFLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkYsSUFBbkIsT0FBckI7QUFDQSxVQUFLRyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJILElBQW5CLE9BQXJCO0FBQ0EsVUFBS0ksY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CSixJQUFwQixPQUF0QjtBQUNBLFVBQUtLLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkwsSUFBcEIsT0FBdEI7QUFDQSxVQUFLTSxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JOLElBQWhCLE9BQWxCO0FBQ0EsVUFBS08sUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNQLElBQWQsT0FBaEI7QUFDQSxVQUFLUSxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FBZ0JSLElBQWhCLE9BQWxCO0FBQ0EsVUFBS1MsWUFBTCxH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QUFTUSxNQUFWLElBQ0M7QUFBQywyQkFBRDtBQUFxQnNDLHVCQUFyQjtBQUFtQzFDLDRCQUFFNEQsa0JBQUYsQ0FBcUJuSCxVQUFyQjtBQUFuQyxXQTlDSjtBQWdERSx3Q0FBQyxnQkFBRCxhQUFrQixTQUFTYSxPQUEzQixFQUFvQyxhQUFhZCxXQUFqRCxJQUFrRWlHLFlBQWxFO0FBaERGLFNBRGdCO0FBQUEsT0FBbEI7O0FBcURBO0FBQ0EsYUFBTzlILFdBQVdBLFNBQVN3SCxVQUFULEVBQXFCb0gsU0FBckIsRUFBZ0MsSUFBaEMsQ0FBWCxHQUFtREEsV0FBMUQ7QUFDRDs7OztFQTEyQnFDLHVCQUFRLHlCQUFVSSxnQkFBVixDQUFSLEM7O0FBQW5CeFEsVSxDQUNaeVEsUyxHQUFZQSxtQjtBQURBelEsVSxDQUVaRCxZLEdBQWVBLHNCO2tCQUZIQyxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG4vL1xyXG5pbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgTGlmZWN5Y2xlIGZyb20gJy4vbGlmZWN5Y2xlJ1xyXG5pbXBvcnQgTWV0aG9kcyBmcm9tICcuL21ldGhvZHMnXHJcbmltcG9ydCBkZWZhdWx0UHJvcHMgZnJvbSAnLi9kZWZhdWx0UHJvcHMnXHJcbmltcG9ydCBwcm9wVHlwZXMgZnJvbSAnLi9wcm9wVHlwZXMnXHJcblxyXG5leHBvcnQgY29uc3QgUmVhY3RUYWJsZURlZmF1bHRzID0gZGVmYXVsdFByb3BzXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlIGV4dGVuZHMgTWV0aG9kcyhMaWZlY3ljbGUoQ29tcG9uZW50KSkge1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSBwcm9wVHlwZXNcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzXHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcblxyXG4gICAgdGhpcy50YWJsZVJlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG4gICAgdGhpcy5mYWtlU2Nyb2xsUmVmID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcblxyXG4gICAgdGhpcy5nZXRSZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0RGF0YU1vZGVsID0gdGhpcy5nZXREYXRhTW9kZWwuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXRTb3J0ZWREYXRhID0gdGhpcy5nZXRTb3J0ZWREYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlyZUZldGNoRGF0YSA9IHRoaXMuZmlyZUZldGNoRGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldFByb3BPclN0YXRlID0gdGhpcy5nZXRQcm9wT3JTdGF0ZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldFN0YXRlT3JQcm9wID0gdGhpcy5nZXRTdGF0ZU9yUHJvcC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmZpbHRlckRhdGEgPSB0aGlzLmZpbHRlckRhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zb3J0RGF0YSA9IHRoaXMuc29ydERhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXRNaW5Sb3dzID0gdGhpcy5nZXRNaW5Sb3dzLmJpbmQodGhpcylcclxuICAgIHRoaXMub25QYWdlQ2hhbmdlID0gdGhpcy5vblBhZ2VDaGFuZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5vblBhZ2VTaXplQ2hhbmdlID0gdGhpcy5vblBhZ2VTaXplQ2hhbmdlLmJpbmQodGhpcylcclxuICAgIHRoaXMuc29ydENvbHVtbiA9IHRoaXMuc29ydENvbHVtbi5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmZpbHRlckNvbHVtbiA9IHRoaXMuZmlsdGVyQ29sdW1uLmJpbmQodGhpcylcclxuICAgIHRoaXMucmVzaXplQ29sdW1uU3RhcnQgPSB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0LmJpbmQodGhpcylcclxuICAgIHRoaXMucmVzaXplQ29sdW1uRW5kID0gdGhpcy5yZXNpemVDb2x1bW5FbmQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcgPSB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZy5iaW5kKHRoaXMpXHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGNoaWxkcmVuLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIHN0eWxlLFxyXG4gICAgICBnZXRQcm9wcyxcclxuICAgICAgZ2V0VGFibGVQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRHcm91cFByb3BzLFxyXG4gICAgICBnZXRUaGVhZEdyb3VwVHJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRHcm91cFRoUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkVHJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRUaFByb3BzLFxyXG4gICAgICBnZXRUaGVhZEZpbHRlclByb3BzLFxyXG4gICAgICBnZXRUaGVhZEZpbHRlclRyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkRmlsdGVyVGhQcm9wcyxcclxuICAgICAgZ2V0VGJvZHlQcm9wcyxcclxuICAgICAgZ2V0VHJHcm91cFByb3BzLFxyXG4gICAgICBnZXRUclByb3BzLFxyXG4gICAgICBnZXRUZFByb3BzLFxyXG4gICAgICBnZXRUZm9vdFByb3BzLFxyXG4gICAgICBnZXRUZm9vdFRyUHJvcHMsXHJcbiAgICAgIGdldFRmb290VGRQcm9wcyxcclxuICAgICAgZ2V0UGFnaW5hdGlvblByb3BzLFxyXG4gICAgICBnZXRMb2FkaW5nUHJvcHMsXHJcbiAgICAgIGdldE5vRGF0YVByb3BzLFxyXG4gICAgICBnZXRSZXNpemVyUHJvcHMsXHJcbiAgICAgIHNob3dQYWdpbmF0aW9uLFxyXG4gICAgICBzaG93UGFnaW5hdGlvblRvcCxcclxuICAgICAgc2hvd1BhZ2luYXRpb25Cb3R0b20sXHJcbiAgICAgIG1hbnVhbCxcclxuICAgICAgbG9hZGluZ1RleHQsXHJcbiAgICAgIG5vRGF0YVRleHQsXHJcbiAgICAgIHNvcnRhYmxlLFxyXG4gICAgICBtdWx0aVNvcnQsXHJcbiAgICAgIHJlc2l6YWJsZSxcclxuICAgICAgZmlsdGVyYWJsZSxcclxuICAgICAgLy8gUGl2b3RpbmcgU3RhdGVcclxuICAgICAgcGl2b3RJREtleSxcclxuICAgICAgcGl2b3RWYWxLZXksXHJcbiAgICAgIHBpdm90QnksXHJcbiAgICAgIHN1YlJvd3NLZXksXHJcbiAgICAgIGFnZ3JlZ2F0ZWRLZXksXHJcbiAgICAgIG9yaWdpbmFsS2V5LFxyXG4gICAgICBpbmRleEtleSxcclxuICAgICAgZ3JvdXBlZEJ5UGl2b3RLZXksXHJcbiAgICAgIC8vIFN0YXRlXHJcbiAgICAgIGxvYWRpbmcsXHJcbiAgICAgIHBhZ2VTaXplLFxyXG4gICAgICBwYWdlLFxyXG4gICAgICBzb3J0ZWQsXHJcbiAgICAgIGZpbHRlcmVkLFxyXG4gICAgICByZXNpemVkLFxyXG4gICAgICBleHBhbmRlZCxcclxuICAgICAgcGFnZXMsXHJcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2UsXHJcbiAgICAgIC8vIENvbXBvbmVudHNcclxuICAgICAgVGFibGVDb21wb25lbnQsXHJcbiAgICAgIFRoZWFkQ29tcG9uZW50LFxyXG4gICAgICBUYm9keUNvbXBvbmVudCxcclxuICAgICAgVHJHcm91cENvbXBvbmVudCxcclxuICAgICAgVHJDb21wb25lbnQsXHJcbiAgICAgIFRoQ29tcG9uZW50LFxyXG4gICAgICBUZENvbXBvbmVudCxcclxuICAgICAgVGZvb3RDb21wb25lbnQsXHJcbiAgICAgIFBhZ2luYXRpb25Db21wb25lbnQsXHJcbiAgICAgIExvYWRpbmdDb21wb25lbnQsXHJcbiAgICAgIFN1YkNvbXBvbmVudCxcclxuICAgICAgTm9EYXRhQ29tcG9uZW50LFxyXG4gICAgICBSZXNpemVyQ29tcG9uZW50LFxyXG4gICAgICBFeHBhbmRlckNvbXBvbmVudCxcclxuICAgICAgUGl2b3RWYWx1ZUNvbXBvbmVudCxcclxuICAgICAgUGl2b3RDb21wb25lbnQsXHJcbiAgICAgIEFnZ3JlZ2F0ZWRDb21wb25lbnQsXHJcbiAgICAgIEZpbHRlckNvbXBvbmVudCxcclxuICAgICAgUGFkUm93Q29tcG9uZW50LFxyXG4gICAgICAvLyBEYXRhIG1vZGVsXHJcbiAgICAgIHJlc29sdmVkRGF0YSxcclxuICAgICAgYWxsVmlzaWJsZUNvbHVtbnMsXHJcbiAgICAgIGhlYWRlckdyb3VwcyxcclxuICAgICAgaGFzSGVhZGVyR3JvdXBzLFxyXG4gICAgICAvLyBTb3J0ZWQgRGF0YVxyXG4gICAgICBzb3J0ZWREYXRhLFxyXG4gICAgICBjdXJyZW50bHlSZXNpemluZyxcclxuICAgIH0gPSByZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgbGV0IGZha2VTY3JvbGxMZWZ0ID0gMDtcclxuICAgIGxldCB0YWJsZVNjcm9sbExlZnQgPSAwO1xyXG5cclxuICAgIC8vIFBhZ2luYXRpb25cclxuICAgIGNvbnN0IHN0YXJ0Um93ID0gcGFnZVNpemUgKiBwYWdlXHJcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHBhZ2VTaXplXHJcbiAgICBsZXQgcGFnZVJvd3MgPSBtYW51YWwgPyByZXNvbHZlZERhdGEgOiBzb3J0ZWREYXRhLnNsaWNlKHN0YXJ0Um93LCBlbmRSb3cpXHJcbiAgICBjb25zdCBtaW5Sb3dzID0gdGhpcy5nZXRNaW5Sb3dzKClcclxuICAgIGNvbnN0IHBhZFJvd3MgPSBfLnJhbmdlKE1hdGgubWF4KG1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxyXG5cclxuICAgIGNvbnN0IGhhc0NvbHVtbkZvb3RlciA9IGFsbFZpc2libGVDb2x1bW5zLnNvbWUoZCA9PiBkLkZvb3RlcilcclxuICAgIGNvbnN0IGhhc0ZpbHRlcnMgPSBmaWx0ZXJhYmxlIHx8IGFsbFZpc2libGVDb2x1bW5zLnNvbWUoZCA9PiBkLmZpbHRlcmFibGUpXHJcblxyXG4gICAgY29uc3QgcmVjdXJzZVJvd3NWaWV3SW5kZXggPSAocm93cywgcGF0aCA9IFtdLCBpbmRleCA9IC0xKSA9PiBbXHJcbiAgICAgIHJvd3MubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgY29uc3Qgcm93V2l0aFZpZXdJbmRleCA9IHtcclxuICAgICAgICAgIC4uLnJvdyxcclxuICAgICAgICAgIF92aWV3SW5kZXg6IGluZGV4LFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5jb25jYXQoW2ldKVxyXG4gICAgICAgIGlmIChyb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldICYmIF8uZ2V0KGV4cGFuZGVkLCBuZXdQYXRoKSkge1xyXG4gICAgICAgICAgW3Jvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0sIGluZGV4XSA9IHJlY3Vyc2VSb3dzVmlld0luZGV4KFxyXG4gICAgICAgICAgICByb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldLFxyXG4gICAgICAgICAgICBuZXdQYXRoLFxyXG4gICAgICAgICAgICBpbmRleFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93V2l0aFZpZXdJbmRleFxyXG4gICAgICB9KSxcclxuICAgICAgaW5kZXgsXHJcbiAgICBdO1xyXG4gICAgW3BhZ2VSb3dzXSA9IHJlY3Vyc2VSb3dzVmlld0luZGV4KHBhZ2VSb3dzKVxyXG5cclxuICAgIGNvbnN0IGNhblByZXZpb3VzID0gcGFnZSA+IDBcclxuICAgIGNvbnN0IGNhbk5leHQgPSBwYWdlICsgMSA8IHBhZ2VzXHJcblxyXG4gICAgY29uc3Qgcm93TWluV2lkdGggPSBfLnN1bShcclxuICAgICAgYWxsVmlzaWJsZUNvbHVtbnMubWFwKGQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZWRDb2x1bW4gPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBkLmlkKSB8fCB7fVxyXG4gICAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sdW1uLnZhbHVlLCBkLndpZHRoLCBkLm1pbldpZHRoKVxyXG4gICAgICB9KVxyXG4gICAgKVxyXG5cclxuICAgIGxldCByb3dJbmRleCA9IC0xXHJcblxyXG4gICAgY29uc3QgZmluYWxTdGF0ZSA9IHtcclxuICAgICAgLi4ucmVzb2x2ZWRTdGF0ZSxcclxuICAgICAgc3RhcnRSb3csXHJcbiAgICAgIGVuZFJvdyxcclxuICAgICAgcGFnZVJvd3MsXHJcbiAgICAgIG1pblJvd3MsXHJcbiAgICAgIHBhZFJvd3MsXHJcbiAgICAgIGhhc0NvbHVtbkZvb3RlcixcclxuICAgICAgY2FuUHJldmlvdXMsXHJcbiAgICAgIGNhbk5leHQsXHJcbiAgICAgIHJvd01pbldpZHRoLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvb3RQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICBjb25zdCB0YWJsZVByb3BzID0gXy5zcGxpdFByb3BzKGdldFRhYmxlUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgY29uc3QgdEJvZHlQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUYm9keVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgIGNvbnN0IGxvYWRpbmdQcm9wcyA9IGdldExvYWRpbmdQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgIGNvbnN0IG5vRGF0YVByb3BzID0gZ2V0Tm9EYXRhUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcblxyXG4gICAgLy8gVmlzdWFsIENvbXBvbmVudHNcclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyR3JvdXAgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRWYWx1ZSA9IGNvbCA9PiAocmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sLmlkKSB8fCB7fSkudmFsdWVcclxuICAgICAgY29uc3QgZmxleCA9IF8uc3VtKFxyXG4gICAgICAgIGNvbHVtbi5jb2x1bW5zLm1hcChjb2wgPT4gKGNvbC53aWR0aCB8fCByZXNpemVkVmFsdWUoY29sKSA/IDAgOiBjb2wubWluV2lkdGgpKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkVmFsdWUoY29sKSwgY29sLndpZHRoLCBjb2wubWluV2lkdGgpKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkVmFsdWUoY29sKSwgY29sLndpZHRoLCBjb2wubWF4V2lkdGgpKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0aGVhZEdyb3VwVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEdyb3VwVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXHJcbiAgICAgICAgY29sdW1uLmhlYWRlckNsYXNzTmFtZSxcclxuICAgICAgICB0aGVhZEdyb3VwVGhQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkR3JvdXBUaFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXN0ID0ge1xyXG4gICAgICAgIC4uLnRoZWFkR3JvdXBUaFByb3BzLnJlc3QsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZmxleFN0eWxlcyA9IHtcclxuICAgICAgICBmbGV4OiBgJHtmbGV4fSAwIGF1dG9gLFxyXG4gICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICAuLi5mbGV4U3R5bGVzLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XHJcbiAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXHJcbiAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvVGhDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyR3JvdXBzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0aGVhZEdyb3VwUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRHcm91cFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkR3JvdXBUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1oZWFkZXJHcm91cHMnLCB0aGVhZEdyb3VwUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRoZWFkR3JvdXBQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRHcm91cFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRHcm91cFRyUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgICBzdHlsZT17dGhlYWRHcm91cFRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZEdyb3VwVHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aGVhZGVyR3JvdXBzLm1hcChtYWtlSGVhZGVyR3JvdXApfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlciA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgc29ydCA9IHNvcnRlZC5maW5kKGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxyXG4gICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRoZWFkVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFRoUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbY29sdW1uLmhlYWRlckNsYXNzTmFtZSwgdGhlYWRUaFByb3BzLmNsYXNzTmFtZSwgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLmNvbHVtbi5oZWFkZXJTdHlsZSxcclxuICAgICAgICAuLi50aGVhZFRoUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3QgPSB7XHJcbiAgICAgICAgLi4udGhlYWRUaFByb3BzLnJlc3QsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXNSZXNpemFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4ucmVzaXphYmxlLCByZXNpemFibGUsIGZhbHNlKVxyXG4gICAgICBjb25zdCByZXNpemVyID0gaXNSZXNpemFibGUgPyAoXHJcbiAgICAgICAgPFJlc2l6ZXJDb21wb25lbnRcclxuICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMucmVzaXplQ29sdW1uU3RhcnQoZSwgY29sdW1uLCBmYWxzZSl9XHJcbiAgICAgICAgICBvblRvdWNoU3RhcnQ9e2UgPT4gdGhpcy5yZXNpemVDb2x1bW5TdGFydChlLCBjb2x1bW4sIHRydWUpfVxyXG4gICAgICAgICAgey4uLmdldFJlc2l6ZXJQcm9wcygnZmluYWxTdGF0ZScsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICApIDogbnVsbFxyXG5cclxuICAgICAgY29uc3QgaXNTb3J0YWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zb3J0YWJsZSwgc29ydGFibGUsIGZhbHNlKVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcclxuICAgICAgICAgICAgY2xhc3NlcyxcclxuICAgICAgICAgICAgaXNSZXNpemFibGUgJiYgJ3J0LXJlc2l6YWJsZS1oZWFkZXInLFxyXG4gICAgICAgICAgICBzb3J0ID8gKHNvcnQuZGVzYyA/ICctc29ydC1kZXNjJyA6ICctc29ydC1hc2MnKSA6ICcnLFxyXG4gICAgICAgICAgICBpc1NvcnRhYmxlICYmICctY3Vyc29yLXBvaW50ZXInLFxyXG4gICAgICAgICAgICAhc2hvdyAmJiAnLWhpZGRlbicsXHJcbiAgICAgICAgICAgIHBpdm90QnkgJiYgcGl2b3RCeS5zbGljZSgwLCAtMSkuaW5jbHVkZXMoY29sdW1uLmlkKSAmJiAncnQtaGVhZGVyLXBpdm90J1xyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB0b2dnbGVTb3J0PXtlID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzU29ydGFibGUpIHRoaXMuc29ydENvbHVtbihjb2x1bW4sIG11bHRpU29ydCA/IGUuc2hpZnRLZXkgOiBmYWxzZSlcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhpc1Jlc2l6YWJsZSAmJiAncnQtcmVzaXphYmxlLWhlYWRlci1jb250ZW50Jyl9PlxyXG4gICAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkhlYWRlciwge1xyXG4gICAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXHJcbiAgICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge3Jlc2l6ZXJ9XHJcbiAgICAgICAgPC9UaENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0aGVhZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICBjb25zdCB0aGVhZFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGhlYWRUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWhlYWRlcicsIHRoZWFkUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRoZWFkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRoZWFkUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVhZFRyUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgICBzdHlsZT17dGhlYWRUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udGhlYWRUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUhlYWRlcil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlRmlsdGVyID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclRoUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJUaFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLFxyXG4gICAgICAgIHRoZWFkRmlsdGVyVGhQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdCA9IHtcclxuICAgICAgICAuLi50aGVhZEZpbHRlclRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJlZC5maW5kKGZpbHRlciA9PiBmaWx0ZXIuaWQgPT09IGNvbHVtbi5pZClcclxuXHJcbiAgICAgIGNvbnN0IFJlc29sdmVkRmlsdGVyQ29tcG9uZW50ID0gY29sdW1uLkZpbHRlciB8fCBGaWx0ZXJDb21wb25lbnRcclxuXHJcbiAgICAgIGNvbnN0IGlzRmlsdGVyYWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5maWx0ZXJhYmxlLCBmaWx0ZXJhYmxlLCBmYWxzZSlcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2lzRmlsdGVyYWJsZVxyXG4gICAgICAgICAgICA/IF8ubm9ybWFsaXplQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgICAgICAgICAgZmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdmFsdWUgPT4gdGhpcy5maWx0ZXJDb2x1bW4oY29sdW1uLCB2YWx1ZSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdFByb3BzLmNvbHVtbi5GaWx0ZXJcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICA8L1RoQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUZpbHRlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1maWx0ZXJzJywgdGhlYWRGaWx0ZXJQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRGaWx0ZXJQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRGaWx0ZXJQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkRmlsdGVyVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEZpbHRlclRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZEZpbHRlclRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlRmlsdGVyKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWdlUm93ID0gKHJvdywgaSwgcGF0aCA9IFtdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJvd0luZm8gPSB7XHJcbiAgICAgICAgb3JpZ2luYWw6IHJvd1tvcmlnaW5hbEtleV0sXHJcbiAgICAgICAgcm93LFxyXG4gICAgICAgIGluZGV4OiByb3dbaW5kZXhLZXldLFxyXG4gICAgICAgIHZpZXdJbmRleDogKHJvd0luZGV4ICs9IDEpLFxyXG4gICAgICAgIHBhZ2VTaXplLFxyXG4gICAgICAgIHBhZ2UsXHJcbiAgICAgICAgbGV2ZWw6IHBhdGgubGVuZ3RoLFxyXG4gICAgICAgIG5lc3RpbmdQYXRoOiBwYXRoLmNvbmNhdChbaV0pLFxyXG4gICAgICAgIGFnZ3JlZ2F0ZWQ6IHJvd1thZ2dyZWdhdGVkS2V5XSxcclxuICAgICAgICBncm91cGVkQnlQaXZvdDogcm93W2dyb3VwZWRCeVBpdm90S2V5XSxcclxuICAgICAgICBzdWJSb3dzOiByb3dbc3ViUm93c0tleV0sXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaXNFeHBhbmRlZCA9IF8uZ2V0KGV4cGFuZGVkLCByb3dJbmZvLm5lc3RpbmdQYXRoKVxyXG4gICAgICBjb25zdCB0ckdyb3VwUHJvcHMgPSBnZXRUckdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICBjb25zdCB0clByb3BzID0gXy5zcGxpdFByb3BzKGdldFRyUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VHJHcm91cENvbXBvbmVudCBrZXk9e3Jvd0luZm8ubmVzdGluZ1BhdGguam9pbignXycpfSB7Li4udHJHcm91cFByb3BzfT5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModHJQcm9wcy5jbGFzc05hbWUsIHJvdy5fdmlld0luZGV4ICUgMiA/ICctZXZlbicgOiAnLW9kZCcpfVxyXG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgICAgICAgICBjb25zdCB0ZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRkUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgY29sdW1uLCB0aGlzKSlcclxuICAgICAgICAgICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgY29sdW1uLCB0aGlzKSlcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IFt0ZFByb3BzLmNsYXNzTmFtZSwgY29sdW1uLmNsYXNzTmFtZSwgY29sdW1uUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi50ZFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBjZWxsSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnJvd0luZm8sXHJcbiAgICAgICAgICAgICAgICBpc0V4cGFuZGVkLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uOiB7IC4uLmNvbHVtbiB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJvd0luZm8ucm93W2NvbHVtbi5pZF0sXHJcbiAgICAgICAgICAgICAgICBwaXZvdGVkOiBjb2x1bW4ucGl2b3RlZCxcclxuICAgICAgICAgICAgICAgIGV4cGFuZGVyOiBjb2x1bW4uZXhwYW5kZXIsXHJcbiAgICAgICAgICAgICAgICByZXNpemVkLFxyXG4gICAgICAgICAgICAgICAgc2hvdyxcclxuICAgICAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0ZFByb3BzLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uUHJvcHMsXHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzLFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzLFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjZWxsSW5mby52YWx1ZVxyXG5cclxuICAgICAgICAgICAgICBsZXQgdXNlT25FeHBhbmRlckNsaWNrXHJcbiAgICAgICAgICAgICAgbGV0IGlzQnJhbmNoXHJcbiAgICAgICAgICAgICAgbGV0IGlzUHJldmlld1xyXG5cclxuICAgICAgICAgICAgICBjb25zdCBvbkV4cGFuZGVyQ2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdFeHBhbmRlZCA9IF8uY2xvbmUoZXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXdFeHBhbmRlZCA9IF8uc2V0KG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBuZXdFeHBhbmRlZCA9IF8uc2V0KG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwge30pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkOiBuZXdFeHBhbmRlZCxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZGVkQ2hhbmdlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgb25FeHBhbmRlZENoYW5nZShuZXdFeHBhbmRlZCwgY2VsbEluZm8ubmVzdGluZ1BhdGgsIGUsIGNlbGxJbmZvKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBhIHN0YW5kYXJkIGNlbGxcclxuICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkNlbGwsIGNlbGxJbmZvLCB2YWx1ZSlcclxuXHJcbiAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBSZW5kZXJlcnNcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQgPVxyXG4gICAgICAgICAgICAgICAgY29sdW1uLkFnZ3JlZ2F0ZWQgfHwgKCFjb2x1bW4uYWdncmVnYXRlID8gQWdncmVnYXRlZENvbXBvbmVudCA6IGNvbHVtbi5DZWxsKVxyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQgPSBjb2x1bW4uRXhwYW5kZXIgfHwgRXhwYW5kZXJDb21wb25lbnRcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZFBpdm90VmFsdWVDb21wb25lbnQgPSBjb2x1bW4uUGl2b3RWYWx1ZSB8fCBQaXZvdFZhbHVlQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgY29uc3QgRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnQgPVxyXG4gICAgICAgICAgICAgICAgUGl2b3RDb21wb25lbnQgfHxcclxuICAgICAgICAgICAgICAgIChwcm9wcyA9PiAoXHJcbiAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxSZXNvbHZlZFBpdm90VmFsdWVDb21wb25lbnQgey4uLnByb3BzfSAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRQaXZvdENvbXBvbmVudCA9IGNvbHVtbi5QaXZvdCB8fCBEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudFxyXG5cclxuICAgICAgICAgICAgICAvLyBJcyB0aGlzIGNlbGwgZXhwYW5kYWJsZT9cclxuICAgICAgICAgICAgICBpZiAoY2VsbEluZm8ucGl2b3RlZCB8fCBjZWxsSW5mby5leHBhbmRlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBpdCBleHBhbmRhYmxlIGJ5IGRlZnVhbHRcclxuICAgICAgICAgICAgICAgIGNlbGxJbmZvLmV4cGFuZGFibGUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB1c2VPbkV4cGFuZGVyQ2xpY2sgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBwaXZvdGVkLCBoYXMgbm8gc3ViUm93cywgYW5kIGRvZXMgbm90IGhhdmUgYSBzdWJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgbWFrZSBleHBhbmRhYmxlXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbEluZm8ucGl2b3RlZCAmJiAhY2VsbEluZm8uc3ViUm93cyAmJiAhU3ViQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLmV4cGFuZGFibGUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIElzIHRoaXMgY29sdW1uIGEgYnJhbmNoP1xyXG4gICAgICAgICAgICAgICAgaXNCcmFuY2ggPSByb3dJbmZvLnJvd1twaXZvdElES2V5XSA9PT0gY29sdW1uLmlkICYmIGNlbGxJbmZvLnN1YlJvd3NcclxuICAgICAgICAgICAgICAgIC8vIFNob3VsZCB0aGlzIGNvbHVtbiBiZSBibGFuaz9cclxuICAgICAgICAgICAgICAgIGlzUHJldmlldyA9XHJcbiAgICAgICAgICAgICAgICAgIHBpdm90QnkuaW5kZXhPZihjb2x1bW4uaWQpID4gcGl2b3RCeS5pbmRleE9mKHJvd0luZm8ucm93W3Bpdm90SURLZXldKSAmJlxyXG4gICAgICAgICAgICAgICAgICBjZWxsSW5mby5zdWJSb3dzXHJcbiAgICAgICAgICAgICAgICAvLyBQaXZvdCBDZWxsIFJlbmRlciBPdmVycmlkZVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQnJhbmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGlzUGl2b3RcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWRQaXZvdENvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jZWxsSW5mbyxcclxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByb3dbcGl2b3RWYWxLZXldLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcm93W3Bpdm90VmFsS2V5XVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzUHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgICAvLyBTaG93IHRoZSBwaXZvdCBwcmV2aWV3XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCwgY2VsbEluZm8sIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2VsbEluZm8uYWdncmVnYXRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50LCBjZWxsSW5mbywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoY2VsbEluZm8uZXhwYW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgICBSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICBjZWxsSW5mbyxcclxuICAgICAgICAgICAgICAgICAgcm93W3Bpdm90VmFsS2V5XVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgaWYgKHBpdm90QnkpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLmdyb3VwZWRCeVBpdm90KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmICghY2VsbEluZm8uc3ViUm93cyAmJiAhU3ViQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCByZXNvbHZlZE9uRXhwYW5kZXJDbGljayA9IHVzZU9uRXhwYW5kZXJDbGljayA/IG9uRXhwYW5kZXJDbGljayA6ICgpID0+IHt9XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBvbkNsaWNrIGV2ZW50cywgbWFrZSBzdXJlIHRoZXkgZG9uJ3RcclxuICAgICAgICAgICAgICAvLyBvdmVycmlkZSBlYWNob3RoZXIuIFRoaXMgc2hvdWxkIG1heWJlIGJlIGV4cGFuZGVkIHRvIGhhbmRsZSBhbGxcclxuICAgICAgICAgICAgICAvLyBmdW5jdGlvbiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25Qcm9wcyA9IHtcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IHJlc29sdmVkT25FeHBhbmRlckNsaWNrLFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRkUHJvcHMucmVzdC5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvblByb3BzLm9uQ2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgdGRQcm9wcy5yZXN0Lm9uQ2xpY2soZSwgKCkgPT4gcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2soZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoY29sdW1uUHJvcHMucmVzdC5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvblByb3BzLm9uQ2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29sdW1uUHJvcHMucmVzdC5vbkNsaWNrKGUsICgpID0+IHJlc29sdmVkT25FeHBhbmRlckNsaWNrKGUpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBjZWxsXHJcbiAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxUZENvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3Qvbm8tYXJyYXktaW5kZXgta2V5XHJcbiAgICAgICAgICAgICAgICAgIGtleT17YCR7aTJ9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLFxyXG4gICAgICAgICAgICAgICAgICAgICFjZWxsSW5mby5leHBhbmRhYmxlICYmICFzaG93ICYmICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLmV4cGFuZGFibGUgJiYgJ3J0LWV4cGFuZGFibGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIChpc0JyYW5jaCB8fCBpc1ByZXZpZXcpICYmICdydC1waXZvdCdcclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgIHsuLi50ZFByb3BzLnJlc3R9XHJcbiAgICAgICAgICAgICAgICAgIHsuLi5jb2x1bW5Qcm9wcy5yZXN0fVxyXG4gICAgICAgICAgICAgICAgICB7Li4uaW50ZXJhY3Rpb25Qcm9wc31cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge3Jlc29sdmVkQ2VsbH1cclxuICAgICAgICAgICAgICAgIDwvVGRDb21wb25lbnQ+XHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgICB7cm93SW5mby5zdWJSb3dzICYmXHJcbiAgICAgICAgICAgIGlzRXhwYW5kZWQgJiZcclxuICAgICAgICAgICAgcm93SW5mby5zdWJSb3dzLm1hcCgoZCwgaSkgPT4gbWFrZVBhZ2VSb3coZCwgaSwgcm93SW5mby5uZXN0aW5nUGF0aCkpfVxyXG4gICAgICAgICAge1N1YkNvbXBvbmVudCAmJlxyXG4gICAgICAgICAgICAhcm93SW5mby5zdWJSb3dzICYmXHJcbiAgICAgICAgICAgIGlzRXhwYW5kZWQgJiZcclxuICAgICAgICAgICAgU3ViQ29tcG9uZW50KHJvd0luZm8sICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBuZXdFeHBhbmRlZCA9IF8uY2xvbmUoZXhwYW5kZWQpXHJcblxyXG4gICAgICAgICAgICAgIF8uc2V0KG5ld0V4cGFuZGVkLCByb3dJbmZvLm5lc3RpbmdQYXRoLCBmYWxzZSlcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9Uckdyb3VwQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZENvbHVtbiA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBmbGV4ID0gd2lkdGhcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdGRQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uUHJvcHMgPSBfLnNwbGl0UHJvcHMoY29sdW1uLmdldFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbdGRQcm9wcy5jbGFzc05hbWUsIGNvbHVtbi5jbGFzc05hbWUsIGNvbHVtblByb3BzLmNsYXNzTmFtZV1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi50ZFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbi5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGRDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzLCAhc2hvdyAmJiAnaGlkZGVuJyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke2ZsZXh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGRQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChQYWRSb3dDb21wb25lbnQpfVxyXG4gICAgICAgIDwvVGRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFkUm93ID0gKHJvdywgaSkgPT4ge1xyXG4gICAgICBjb25zdCB0ckdyb3VwUHJvcHMgPSBnZXRUckdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIGNvbnN0IHRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRyR3JvdXBDb21wb25lbnQga2V5PXtgcGFkLSR7aX1gfSB7Li4udHJHcm91cFByb3BzfT5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXHJcbiAgICAgICAgICAgICAgJy1wYWRSb3cnLFxyXG4gICAgICAgICAgICAgIChwYWdlUm93cy5sZW5ndGggKyBpKSAlIDIgPyAnLWV2ZW4nIDogJy1vZGQnLFxyXG4gICAgICAgICAgICAgIHRyUHJvcHMuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0clByb3BzLnN0eWxlIHx8IHt9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VQYWRDb2x1bW4pfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RyR3JvdXBDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlQ29sdW1uRm9vdGVyID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRGb290VGRQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFRkUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5Gb290ZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0Rm9vdGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXHJcbiAgICAgICAgdEZvb3RUZFByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW4uY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtblByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5Gb290ZXJQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi50Rm9vdFRkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkZvb3RlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUZENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMsICFzaG93ICYmICdoaWRkZW4nKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4uY29sdW1uUHJvcHMucmVzdH1cclxuICAgICAgICAgIHsuLi50Rm9vdFRkUHJvcHMucmVzdH1cclxuICAgICAgICAgIHsuLi5jb2x1bW5Gb290ZXJQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uRm9vdGVyLCB7XHJcbiAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXHJcbiAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvVGRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlQ29sdW1uRm9vdGVycyA9ICgpID0+IHtcclxuICAgICAgY29uc3QgdEZvb3RQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgY29uc3QgdEZvb3RUclByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290VHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRmb290Q29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e3RGb290UHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udEZvb3RQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udEZvb3RQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModEZvb3RUclByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0Rm9vdFRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50Rm9vdFRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlQ29sdW1uRm9vdGVyKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UZm9vdENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWdpbmF0aW9uID0gaXNUb3AgPT4ge1xyXG4gICAgICBjb25zdCBwYWdpbmF0aW9uUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0UGFnaW5hdGlvblByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFBhZ2luYXRpb25Db21wb25lbnRcclxuICAgICAgICAgIHsuLi5yZXNvbHZlZFN0YXRlfVxyXG4gICAgICAgICAgcGFnZXM9e3BhZ2VzfVxyXG4gICAgICAgICAgY2FuUHJldmlvdXM9e2NhblByZXZpb3VzfVxyXG4gICAgICAgICAgY2FuTmV4dD17Y2FuTmV4dH1cclxuICAgICAgICAgIG9uUGFnZUNoYW5nZT17dGhpcy5vblBhZ2VDaGFuZ2V9XHJcbiAgICAgICAgICBvblBhZ2VTaXplQ2hhbmdlPXt0aGlzLm9uUGFnZVNpemVDaGFuZ2V9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e3BhZ2luYXRpb25Qcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICBzdHlsZT17cGFnaW5hdGlvblByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgaXNUb3A9e2lzVG9wfVxyXG4gICAgICAgICAgey4uLnBhZ2luYXRpb25Qcm9wcy5yZXN0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzY3JvbGwgPSAodHlwZSkgPT4ge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ2Zha2VTY3JvbGwnICYmIHRoaXMuZmFrZVNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbExlZnQgIT09IHRhYmxlU2Nyb2xsTGVmdCkge1xyXG4gICAgICAgIGZha2VTY3JvbGxMZWZ0ID0gdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCA9IHRoaXMuZmFrZVNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHR5cGUgPT09ICd0YWJsZScgJiYgdGhpcy50YWJsZVJlZi5jdXJyZW50LnNjcm9sbExlZnQgIT09IGZha2VTY3JvbGxMZWZ0KSB7XHJcbiAgICAgICAgdGFibGVTY3JvbGxMZWZ0ID0gdGhpcy50YWJsZVJlZi5jdXJyZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCA9IHRoaXMudGFibGVSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVRhYmxlID0gKCkgPT4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdSZWFjdFRhYmxlJywgY2xhc3NOYW1lLCByb290UHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgICAgICAuLi5yb290UHJvcHMuc3R5bGUsXHJcbiAgICAgICAgfX1cclxuICAgICAgICB7Li4ucm9vdFByb3BzLnJlc3R9XHJcbiAgICAgID5cclxuICAgICAgICB7c2hvd1BhZ2luYXRpb24gJiYgc2hvd1BhZ2luYXRpb25Ub3AgPyAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2luYXRpb24tdG9wXCI+e21ha2VQYWdpbmF0aW9uKHRydWUpfTwvZGl2PlxyXG4gICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHJlZj17dGhpcy5mYWtlU2Nyb2xsUmVmfVxyXG4gICAgICAgICAgc3R5bGU9e3sgb3ZlcmZsb3dYOiBcImF1dG9cIiwgb3ZlcmZsb3dZOiBcImhpZGRlblwiIH19XHJcbiAgICAgICAgICBvblNjcm9sbD17KCkgPT4gc2Nyb2xsKCdmYWtlU2Nyb2xsJyl9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogYCR7cm93TWluV2lkdGh9cHhgLCBoZWlnaHQ6IDAgfX0+Jm5ic3A7PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XHJcbiAgICAgICAgICBvblNjcm9sbD17KCkgPT4gc2Nyb2xsKCd0YWJsZScpfVxyXG4gICAgICAgICAgcmVmPXt0aGlzLnRhYmxlUmVmfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRhYmxlUHJvcHMuY2xhc3NOYW1lLCBjdXJyZW50bHlSZXNpemluZyA/ICdydC1yZXNpemluZycgOiAnJyl9XHJcbiAgICAgICAgICBzdHlsZT17dGFibGVQcm9wcy5zdHlsZX1cclxuICAgICAgICAgIHsuLi50YWJsZVByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2hhc0hlYWRlckdyb3VwcyA/IG1ha2VIZWFkZXJHcm91cHMoKSA6IG51bGx9XHJcbiAgICAgICAgICB7bWFrZUhlYWRlcnMoKX1cclxuICAgICAgICAgIHtoYXNGaWx0ZXJzID8gbWFrZUZpbHRlcnMoKSA6IG51bGx9XHJcblxyXG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0Qm9keVByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgLi4udEJvZHlQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICB7Li4udEJvZHlQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7cGFnZVJvd3MubWFwKChkLCBpKSA9PiBtYWtlUGFnZVJvdyhkLCBpKSl9XHJcbiAgICAgICAgICAgIHtwYWRSb3dzLm1hcChtYWtlUGFkUm93KX1cclxuICAgICAgICAgIDwvVGJvZHlDb21wb25lbnQ+XHJcbiAgICAgICAgICB7aGFzQ29sdW1uRm9vdGVyID8gbWFrZUNvbHVtbkZvb3RlcnMoKSA6IG51bGx9XHJcbiAgICAgICAgPC9UYWJsZUNvbXBvbmVudD5cclxuICAgICAgICB7c2hvd1BhZ2luYXRpb24gJiYgc2hvd1BhZ2luYXRpb25Cb3R0b20gPyAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2luYXRpb24tYm90dG9tXCI+e21ha2VQYWdpbmF0aW9uKGZhbHNlKX08L2Rpdj5cclxuICAgICAgICApIDogbnVsbH1cclxuICAgICAgICB7IXBhZ2VSb3dzLmxlbmd0aCAmJiAoXHJcbiAgICAgICAgICA8Tm9EYXRhQ29tcG9uZW50IHsuLi5ub0RhdGFQcm9wc30+e18ubm9ybWFsaXplQ29tcG9uZW50KG5vRGF0YVRleHQpfTwvTm9EYXRhQ29tcG9uZW50PlxyXG4gICAgICAgICl9XHJcbiAgICAgICAgPExvYWRpbmdDb21wb25lbnQgbG9hZGluZz17bG9hZGluZ30gbG9hZGluZ1RleHQ9e2xvYWRpbmdUZXh0fSB7Li4ubG9hZGluZ1Byb3BzfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuXHJcbiAgICAvLyBjaGlsZFByb3BzIGFyZSBvcHRpb25hbGx5IHBhc3NlZCB0byBhIGZ1bmN0aW9uLWFzLWEtY2hpbGRcclxuICAgIHJldHVybiBjaGlsZHJlbiA/IGNoaWxkcmVuKGZpbmFsU3RhdGUsIG1ha2VUYWJsZSwgdGhpcykgOiBtYWtlVGFibGUoKVxyXG4gIH1cclxufVxyXG4iXX0=