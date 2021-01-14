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
              { style: { paddingBottom: '1px', width: rowMinWidth + 'px', height: 0 } },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdFRhYmxlRGVmYXVsdHMiLCJkZWZhdWx0UHJvcHMiLCJSZWFjdFRhYmxlIiwicHJvcHMiLCJ0YWJsZVJlZiIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiZmFrZVNjcm9sbFJlZiIsImdldFJlc29sdmVkU3RhdGUiLCJiaW5kIiwiZ2V0RGF0YU1vZGVsIiwiZ2V0U29ydGVkRGF0YSIsImZpcmVGZXRjaERhdGEiLCJnZXRQcm9wT3JTdGF0ZSIsImdldFN0YXRlT3JQcm9wIiwiZmlsdGVyRGF0YSIsInNvcnREYXRhIiwiZ2V0TWluUm93cyIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJzb3J0Q29sdW1uIiwiZmlsdGVyQ29sdW1uIiwicmVzaXplQ29sdW1uU3RhcnQiLCJyZXNpemVDb2x1bW5FbmQiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNvbHZlZFN0YXRlIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsInNob3dQYWdpbmF0aW9uIiwic2hvd1BhZ2luYXRpb25Ub3AiLCJzaG93UGFnaW5hdGlvbkJvdHRvbSIsIm1hbnVhbCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInNvcnRhYmxlIiwibXVsdGlTb3J0IiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInBpdm90QnkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsImxvYWRpbmciLCJwYWdlU2l6ZSIsInBhZ2UiLCJzb3J0ZWQiLCJmaWx0ZXJlZCIsInJlc2l6ZWQiLCJleHBhbmRlZCIsInBhZ2VzIiwib25FeHBhbmRlZENoYW5nZSIsIlRhYmxlQ29tcG9uZW50IiwiVGhlYWRDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiU3ViQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90Q29tcG9uZW50IiwiQWdncmVnYXRlZENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCIsInJlc29sdmVkRGF0YSIsImFsbFZpc2libGVDb2x1bW5zIiwiaGVhZGVyR3JvdXBzIiwiaGFzSGVhZGVyR3JvdXBzIiwic29ydGVkRGF0YSIsImN1cnJlbnRseVJlc2l6aW5nIiwiZmFrZVNjcm9sbExlZnQiLCJ0YWJsZVNjcm9sbExlZnQiLCJzdGFydFJvdyIsImVuZFJvdyIsInBhZ2VSb3dzIiwic2xpY2UiLCJtaW5Sb3dzIiwicGFkUm93cyIsIl8iLCJyYW5nZSIsIk1hdGgiLCJtYXgiLCJsZW5ndGgiLCJoYXNDb2x1bW5Gb290ZXIiLCJzb21lIiwiZCIsIkZvb3RlciIsImhhc0ZpbHRlcnMiLCJyZWN1cnNlUm93c1ZpZXdJbmRleCIsInJvd3MiLCJwYXRoIiwiaW5kZXgiLCJtYXAiLCJyb3ciLCJpIiwicm93V2l0aFZpZXdJbmRleCIsIl92aWV3SW5kZXgiLCJuZXdQYXRoIiwiY29uY2F0IiwiZ2V0IiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwicm93TWluV2lkdGgiLCJzdW0iLCJyZXNpemVkQ29sdW1uIiwiZmluZCIsIngiLCJpZCIsImdldEZpcnN0RGVmaW5lZCIsInZhbHVlIiwid2lkdGgiLCJtaW5XaWR0aCIsInJvd0luZGV4IiwiZmluYWxTdGF0ZSIsInJvb3RQcm9wcyIsInNwbGl0UHJvcHMiLCJ1bmRlZmluZWQiLCJ0YWJsZVByb3BzIiwidEJvZHlQcm9wcyIsImxvYWRpbmdQcm9wcyIsIm5vRGF0YVByb3BzIiwibWFrZUhlYWRlckdyb3VwIiwiY29sdW1uIiwicmVzaXplZFZhbHVlIiwiY29sIiwiZmxleCIsImNvbHVtbnMiLCJtYXhXaWR0aCIsInRoZWFkR3JvdXBUaFByb3BzIiwiY29sdW1uSGVhZGVyUHJvcHMiLCJnZXRIZWFkZXJQcm9wcyIsImNsYXNzZXMiLCJoZWFkZXJDbGFzc05hbWUiLCJzdHlsZXMiLCJoZWFkZXJTdHlsZSIsInJlc3QiLCJmbGV4U3R5bGVzIiwiYXNQeCIsIm5vcm1hbGl6ZUNvbXBvbmVudCIsIkhlYWRlciIsImRhdGEiLCJtYWtlSGVhZGVyR3JvdXBzIiwidGhlYWRHcm91cFByb3BzIiwidGhlYWRHcm91cFRyUHJvcHMiLCJtYWtlSGVhZGVyIiwicmVzaXplZENvbCIsInNvcnQiLCJzaG93IiwidGhlYWRUaFByb3BzIiwiaXNSZXNpemFibGUiLCJyZXNpemVyIiwiZSIsImlzU29ydGFibGUiLCJkZXNjIiwiaW5jbHVkZXMiLCJzaGlmdEtleSIsIm1ha2VIZWFkZXJzIiwidGhlYWRQcm9wcyIsInRoZWFkVHJQcm9wcyIsIm1ha2VGaWx0ZXIiLCJ0aGVhZEZpbHRlclRoUHJvcHMiLCJmaWx0ZXIiLCJSZXNvbHZlZEZpbHRlckNvbXBvbmVudCIsIkZpbHRlciIsImlzRmlsdGVyYWJsZSIsIm9uQ2hhbmdlIiwibWFrZUZpbHRlcnMiLCJ0aGVhZEZpbHRlclByb3BzIiwidGhlYWRGaWx0ZXJUclByb3BzIiwibWFrZVBhZ2VSb3ciLCJyb3dJbmZvIiwib3JpZ2luYWwiLCJ2aWV3SW5kZXgiLCJsZXZlbCIsIm5lc3RpbmdQYXRoIiwiYWdncmVnYXRlZCIsImdyb3VwZWRCeVBpdm90Iiwic3ViUm93cyIsImlzRXhwYW5kZWQiLCJ0ckdyb3VwUHJvcHMiLCJ0clByb3BzIiwiam9pbiIsImkyIiwidGRQcm9wcyIsImNvbHVtblByb3BzIiwiY2VsbEluZm8iLCJwaXZvdGVkIiwiZXhwYW5kZXIiLCJ1c2VPbkV4cGFuZGVyQ2xpY2siLCJpc0JyYW5jaCIsImlzUHJldmlldyIsIm9uRXhwYW5kZXJDbGljayIsIm5ld0V4cGFuZGVkIiwiY2xvbmUiLCJzZXQiLCJzZXRTdGF0ZVdpdGhEYXRhIiwicmVzb2x2ZWRDZWxsIiwiQ2VsbCIsIlJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCIsIkFnZ3JlZ2F0ZWQiLCJhZ2dyZWdhdGUiLCJSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50IiwiRXhwYW5kZXIiLCJSZXNvbHZlZFBpdm90VmFsdWVDb21wb25lbnQiLCJQaXZvdFZhbHVlIiwiRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnQiLCJSZXNvbHZlZFBpdm90Q29tcG9uZW50IiwiUGl2b3QiLCJleHBhbmRhYmxlIiwiaW5kZXhPZiIsInJlc29sdmVkT25FeHBhbmRlckNsaWNrIiwiaW50ZXJhY3Rpb25Qcm9wcyIsIm9uQ2xpY2siLCJtYWtlUGFkQ29sdW1uIiwibWFrZVBhZFJvdyIsIm1ha2VDb2x1bW5Gb290ZXIiLCJ0Rm9vdFRkUHJvcHMiLCJjb2x1bW5Gb290ZXJQcm9wcyIsImdldEZvb3RlclByb3BzIiwibWFrZUNvbHVtbkZvb3RlcnMiLCJ0Rm9vdFByb3BzIiwidEZvb3RUclByb3BzIiwibWFrZVBhZ2luYXRpb24iLCJwYWdpbmF0aW9uUHJvcHMiLCJpc1RvcCIsInNjcm9sbCIsInR5cGUiLCJjdXJyZW50Iiwic2Nyb2xsTGVmdCIsIm1ha2VUYWJsZSIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsInBhZGRpbmdCb3R0b20iLCJoZWlnaHQiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7QUFMQTs7O0FBT08sSUFBTUEsa0RBQXFCQyxzQkFBM0I7O0lBRWNDLFU7OztBQUluQixzQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLHdIQUNaQSxLQURZOztBQUdsQixVQUFLQyxRQUFMLEdBQWdCQyxnQkFBTUMsU0FBTixFQUFoQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUJGLGdCQUFNQyxTQUFOLEVBQXJCOztBQUVBLFVBQUtFLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCQyxJQUF0QixPQUF4QjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkQsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRSxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJGLElBQW5CLE9BQXJCO0FBQ0EsVUFBS0csYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CSCxJQUFuQixPQUFyQjtBQUNBLFVBQUtJLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkosSUFBcEIsT0FBdEI7QUFDQSxVQUFLSyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JMLElBQXBCLE9BQXRCO0FBQ0EsVUFBS00sVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdCTixJQUFoQixPQUFsQjtBQUNBLFVBQUtPLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjUCxJQUFkLE9BQWhCO0FBQ0EsVUFBS1EsVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdCUixJQUFoQixPQUFsQjtB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QUFwQyxXQURELEdBRUcsSUE1Q047QUE2Q0csV0FBQ3BKLFNBQVNRLE1BQVYsSUFDQztBQUFDLDJCQUFEO0FBQXFCc0MsdUJBQXJCO0FBQW1DMUMsNEJBQUU0RCxrQkFBRixDQUFxQm5ILFVBQXJCO0FBQW5DLFdBOUNKO0FBZ0RFLHdDQUFDLGdCQUFELGFBQWtCLFNBQVNhLE9BQTNCLEVBQW9DLGFBQWFkLFdBQWpELElBQWtFaUcsWUFBbEU7QUFoREYsU0FEZ0I7QUFBQSxPQUFsQjs7QUFxREE7QUFDQSxhQUFPOUgsV0FBV0EsU0FBU3dILFVBQVQsRUFBcUJvSCxTQUFyQixFQUFnQyxJQUFoQyxDQUFYLEdBQW1EQSxXQUExRDtBQUNEOzs7O0VBMTJCcUMsdUJBQVEseUJBQVVLLGdCQUFWLENBQVIsQzs7QUFBbkJ6USxVLENBQ1owUSxTLEdBQVlBLG1CO0FBREExUSxVLENBRVpELFksR0FBZUEsc0I7a0JBRkhDLFUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXHJcbi8vXHJcbmltcG9ydCBfIGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCBMaWZlY3ljbGUgZnJvbSAnLi9saWZlY3ljbGUnXHJcbmltcG9ydCBNZXRob2RzIGZyb20gJy4vbWV0aG9kcydcclxuaW1wb3J0IGRlZmF1bHRQcm9wcyBmcm9tICcuL2RlZmF1bHRQcm9wcydcclxuaW1wb3J0IHByb3BUeXBlcyBmcm9tICcuL3Byb3BUeXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCBSZWFjdFRhYmxlRGVmYXVsdHMgPSBkZWZhdWx0UHJvcHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0VGFibGUgZXh0ZW5kcyBNZXRob2RzKExpZmVjeWNsZShDb21wb25lbnQpKSB7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHByb3BUeXBlc1xyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHNcclxuXHJcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICB0aGlzLnRhYmxlUmVmID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLmZha2VTY3JvbGxSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuXHJcbiAgICB0aGlzLmdldFJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXREYXRhTW9kZWwgPSB0aGlzLmdldERhdGFNb2RlbC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldFNvcnRlZERhdGEgPSB0aGlzLmdldFNvcnRlZERhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maXJlRmV0Y2hEYXRhID0gdGhpcy5maXJlRmV0Y2hEYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0UHJvcE9yU3RhdGUgPSB0aGlzLmdldFByb3BPclN0YXRlLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0U3RhdGVPclByb3AgPSB0aGlzLmdldFN0YXRlT3JQcm9wLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyRGF0YSA9IHRoaXMuZmlsdGVyRGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnNvcnREYXRhID0gdGhpcy5zb3J0RGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldE1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5vblBhZ2VDaGFuZ2UgPSB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLm9uUGFnZVNpemVDaGFuZ2UgPSB0aGlzLm9uUGFnZVNpemVDaGFuZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zb3J0Q29sdW1uID0gdGhpcy5zb3J0Q29sdW1uLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyQ29sdW1uID0gdGhpcy5maWx0ZXJDb2x1bW4uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5TdGFydCA9IHRoaXMucmVzaXplQ29sdW1uU3RhcnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5FbmQgPSB0aGlzLnJlc2l6ZUNvbHVtbkVuZC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZyA9IHRoaXMucmVzaXplQ29sdW1uTW92aW5nLmJpbmQodGhpcylcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBjb25zdCByZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgIGNvbnN0IHtcclxuICAgICAgY2hpbGRyZW4sXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgc3R5bGUsXHJcbiAgICAgIGdldFByb3BzLFxyXG4gICAgICBnZXRUYWJsZVByb3BzLFxyXG4gICAgICBnZXRUaGVhZEdyb3VwUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZEdyb3VwVGhQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZFRoUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkRmlsdGVyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkRmlsdGVyVHJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJUaFByb3BzLFxyXG4gICAgICBnZXRUYm9keVByb3BzLFxyXG4gICAgICBnZXRUckdyb3VwUHJvcHMsXHJcbiAgICAgIGdldFRyUHJvcHMsXHJcbiAgICAgIGdldFRkUHJvcHMsXHJcbiAgICAgIGdldFRmb290UHJvcHMsXHJcbiAgICAgIGdldFRmb290VHJQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RUZFByb3BzLFxyXG4gICAgICBnZXRQYWdpbmF0aW9uUHJvcHMsXHJcbiAgICAgIGdldExvYWRpbmdQcm9wcyxcclxuICAgICAgZ2V0Tm9EYXRhUHJvcHMsXHJcbiAgICAgIGdldFJlc2l6ZXJQcm9wcyxcclxuICAgICAgc2hvd1BhZ2luYXRpb24sXHJcbiAgICAgIHNob3dQYWdpbmF0aW9uVG9wLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbkJvdHRvbSxcclxuICAgICAgbWFudWFsLFxyXG4gICAgICBsb2FkaW5nVGV4dCxcclxuICAgICAgbm9EYXRhVGV4dCxcclxuICAgICAgc29ydGFibGUsXHJcbiAgICAgIG11bHRpU29ydCxcclxuICAgICAgcmVzaXphYmxlLFxyXG4gICAgICBmaWx0ZXJhYmxlLFxyXG4gICAgICAvLyBQaXZvdGluZyBTdGF0ZVxyXG4gICAgICBwaXZvdElES2V5LFxyXG4gICAgICBwaXZvdFZhbEtleSxcclxuICAgICAgcGl2b3RCeSxcclxuICAgICAgc3ViUm93c0tleSxcclxuICAgICAgYWdncmVnYXRlZEtleSxcclxuICAgICAgb3JpZ2luYWxLZXksXHJcbiAgICAgIGluZGV4S2V5LFxyXG4gICAgICBncm91cGVkQnlQaXZvdEtleSxcclxuICAgICAgLy8gU3RhdGVcclxuICAgICAgbG9hZGluZyxcclxuICAgICAgcGFnZVNpemUsXHJcbiAgICAgIHBhZ2UsXHJcbiAgICAgIHNvcnRlZCxcclxuICAgICAgZmlsdGVyZWQsXHJcbiAgICAgIHJlc2l6ZWQsXHJcbiAgICAgIGV4cGFuZGVkLFxyXG4gICAgICBwYWdlcyxcclxuICAgICAgb25FeHBhbmRlZENoYW5nZSxcclxuICAgICAgLy8gQ29tcG9uZW50c1xyXG4gICAgICBUYWJsZUNvbXBvbmVudCxcclxuICAgICAgVGhlYWRDb21wb25lbnQsXHJcbiAgICAgIFRib2R5Q29tcG9uZW50LFxyXG4gICAgICBUckdyb3VwQ29tcG9uZW50LFxyXG4gICAgICBUckNvbXBvbmVudCxcclxuICAgICAgVGhDb21wb25lbnQsXHJcbiAgICAgIFRkQ29tcG9uZW50LFxyXG4gICAgICBUZm9vdENvbXBvbmVudCxcclxuICAgICAgUGFnaW5hdGlvbkNvbXBvbmVudCxcclxuICAgICAgTG9hZGluZ0NvbXBvbmVudCxcclxuICAgICAgU3ViQ29tcG9uZW50LFxyXG4gICAgICBOb0RhdGFDb21wb25lbnQsXHJcbiAgICAgIFJlc2l6ZXJDb21wb25lbnQsXHJcbiAgICAgIEV4cGFuZGVyQ29tcG9uZW50LFxyXG4gICAgICBQaXZvdFZhbHVlQ29tcG9uZW50LFxyXG4gICAgICBQaXZvdENvbXBvbmVudCxcclxuICAgICAgQWdncmVnYXRlZENvbXBvbmVudCxcclxuICAgICAgRmlsdGVyQ29tcG9uZW50LFxyXG4gICAgICBQYWRSb3dDb21wb25lbnQsXHJcbiAgICAgIC8vIERhdGEgbW9kZWxcclxuICAgICAgcmVzb2x2ZWREYXRhLFxyXG4gICAgICBhbGxWaXNpYmxlQ29sdW1ucyxcclxuICAgICAgaGVhZGVyR3JvdXBzLFxyXG4gICAgICBoYXNIZWFkZXJHcm91cHMsXHJcbiAgICAgIC8vIFNvcnRlZCBEYXRhXHJcbiAgICAgIHNvcnRlZERhdGEsXHJcbiAgICAgIGN1cnJlbnRseVJlc2l6aW5nLFxyXG4gICAgfSA9IHJlc29sdmVkU3RhdGVcclxuXHJcbiAgICBsZXQgZmFrZVNjcm9sbExlZnQgPSAwO1xyXG4gICAgbGV0IHRhYmxlU2Nyb2xsTGVmdCA9IDA7XHJcblxyXG4gICAgLy8gUGFnaW5hdGlvblxyXG4gICAgY29uc3Qgc3RhcnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcclxuICAgIGNvbnN0IGVuZFJvdyA9IHN0YXJ0Um93ICsgcGFnZVNpemVcclxuICAgIGxldCBwYWdlUm93cyA9IG1hbnVhbCA/IHJlc29sdmVkRGF0YSA6IHNvcnRlZERhdGEuc2xpY2Uoc3RhcnRSb3csIGVuZFJvdylcclxuICAgIGNvbnN0IG1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MoKVxyXG4gICAgY29uc3QgcGFkUm93cyA9IF8ucmFuZ2UoTWF0aC5tYXgobWluUm93cyAtIHBhZ2VSb3dzLmxlbmd0aCwgMCkpXHJcblxyXG4gICAgY29uc3QgaGFzQ29sdW1uRm9vdGVyID0gYWxsVmlzaWJsZUNvbHVtbnMuc29tZShkID0+IGQuRm9vdGVyKVxyXG4gICAgY29uc3QgaGFzRmlsdGVycyA9IGZpbHRlcmFibGUgfHwgYWxsVmlzaWJsZUNvbHVtbnMuc29tZShkID0+IGQuZmlsdGVyYWJsZSlcclxuXHJcbiAgICBjb25zdCByZWN1cnNlUm93c1ZpZXdJbmRleCA9IChyb3dzLCBwYXRoID0gW10sIGluZGV4ID0gLTEpID0+IFtcclxuICAgICAgcm93cy5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBjb25zdCByb3dXaXRoVmlld0luZGV4ID0ge1xyXG4gICAgICAgICAgLi4ucm93LFxyXG4gICAgICAgICAgX3ZpZXdJbmRleDogaW5kZXgsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLmNvbmNhdChbaV0pXHJcbiAgICAgICAgaWYgKHJvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0gJiYgXy5nZXQoZXhwYW5kZWQsIG5ld1BhdGgpKSB7XHJcbiAgICAgICAgICBbcm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSwgaW5kZXhdID0gcmVjdXJzZVJvd3NWaWV3SW5kZXgoXHJcbiAgICAgICAgICAgIHJvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0sXHJcbiAgICAgICAgICAgIG5ld1BhdGgsXHJcbiAgICAgICAgICAgIGluZGV4XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3dXaXRoVmlld0luZGV4XHJcbiAgICAgIH0pLFxyXG4gICAgICBpbmRleCxcclxuICAgIF07XHJcbiAgICBbcGFnZVJvd3NdID0gcmVjdXJzZVJvd3NWaWV3SW5kZXgocGFnZVJvd3MpXHJcblxyXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSBwYWdlID4gMFxyXG4gICAgY29uc3QgY2FuTmV4dCA9IHBhZ2UgKyAxIDwgcGFnZXNcclxuXHJcbiAgICBjb25zdCByb3dNaW5XaWR0aCA9IF8uc3VtKFxyXG4gICAgICBhbGxWaXNpYmxlQ29sdW1ucy5tYXAoZCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzaXplZENvbHVtbiA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGQuaWQpIHx8IHt9XHJcbiAgICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2x1bW4udmFsdWUsIGQud2lkdGgsIGQubWluV2lkdGgpXHJcbiAgICAgIH0pXHJcbiAgICApXHJcblxyXG4gICAgbGV0IHJvd0luZGV4ID0gLTFcclxuXHJcbiAgICBjb25zdCBmaW5hbFN0YXRlID0ge1xyXG4gICAgICAuLi5yZXNvbHZlZFN0YXRlLFxyXG4gICAgICBzdGFydFJvdyxcclxuICAgICAgZW5kUm93LFxyXG4gICAgICBwYWdlUm93cyxcclxuICAgICAgbWluUm93cyxcclxuICAgICAgcGFkUm93cyxcclxuICAgICAgaGFzQ29sdW1uRm9vdGVyLFxyXG4gICAgICBjYW5QcmV2aW91cyxcclxuICAgICAgY2FuTmV4dCxcclxuICAgICAgcm93TWluV2lkdGgsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm9vdFByb3BzID0gXy5zcGxpdFByb3BzKGdldFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgIGNvbnN0IHRhYmxlUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGFibGVQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICBjb25zdCB0Qm9keVByb3BzID0gXy5zcGxpdFByb3BzKGdldFRib2R5UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgY29uc3QgbG9hZGluZ1Byb3BzID0gZ2V0TG9hZGluZ1Byb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgY29uc3Qgbm9EYXRhUHJvcHMgPSBnZXROb0RhdGFQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuXHJcbiAgICAvLyBWaXN1YWwgQ29tcG9uZW50c1xyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cCA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZFZhbHVlID0gY29sID0+IChyZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2wuaWQpIHx8IHt9KS52YWx1ZVxyXG4gICAgICBjb25zdCBmbGV4ID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiAoY29sLndpZHRoIHx8IHJlc2l6ZWRWYWx1ZShjb2wpID8gMCA6IGNvbC5taW5XaWR0aCkpXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLnN1bShcclxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5taW5XaWR0aCkpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLnN1bShcclxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5tYXhXaWR0aCkpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUaFByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkR3JvdXBUaFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLFxyXG4gICAgICAgIHRoZWFkR3JvdXBUaFByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXHJcbiAgICAgICAgLi4udGhlYWRHcm91cFRoUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3QgPSB7XHJcbiAgICAgICAgLi4udGhlYWRHcm91cFRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmbGV4U3R5bGVzID0ge1xyXG4gICAgICAgIGZsZXg6IGAke2ZsZXh9IDAgYXV0b2AsXHJcbiAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIC4uLmZsZXhTdHlsZXMsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5IZWFkZXIsIHtcclxuICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9UaENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cHMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdGhlYWRHcm91cFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRHcm91cFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWhlYWRlckdyb3VwcycsIHRoZWFkR3JvdXBQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRHcm91cFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50aGVhZEdyb3VwUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVhZEdyb3VwVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEdyb3VwVHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRoZWFkR3JvdXBUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtoZWFkZXJHcm91cHMubWFwKG1ha2VIZWFkZXJHcm91cCl9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCBzb3J0ID0gc29ydGVkLmZpbmQoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdGhlYWRUaFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLCB0aGVhZFRoUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkVGhQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdCA9IHtcclxuICAgICAgICAuLi50aGVhZFRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBpc1Jlc2l6YWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5yZXNpemFibGUsIHJlc2l6YWJsZSwgZmFsc2UpXHJcbiAgICAgIGNvbnN0IHJlc2l6ZXIgPSBpc1Jlc2l6YWJsZSA/IChcclxuICAgICAgICA8UmVzaXplckNvbXBvbmVudFxyXG4gICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5yZXNpemVDb2x1bW5TdGFydChlLCBjb2x1bW4sIGZhbHNlKX1cclxuICAgICAgICAgIG9uVG91Y2hTdGFydD17ZSA9PiB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0KGUsIGNvbHVtbiwgdHJ1ZSl9XHJcbiAgICAgICAgICB7Li4uZ2V0UmVzaXplclByb3BzKCdmaW5hbFN0YXRlJywgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICkgOiBudWxsXHJcblxyXG4gICAgICBjb25zdCBpc1NvcnRhYmxlID0gXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLnNvcnRhYmxlLCBzb3J0YWJsZSwgZmFsc2UpXHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICBjbGFzc2VzLFxyXG4gICAgICAgICAgICBpc1Jlc2l6YWJsZSAmJiAncnQtcmVzaXphYmxlLWhlYWRlcicsXHJcbiAgICAgICAgICAgIHNvcnQgPyAoc29ydC5kZXNjID8gJy1zb3J0LWRlc2MnIDogJy1zb3J0LWFzYycpIDogJycsXHJcbiAgICAgICAgICAgIGlzU29ydGFibGUgJiYgJy1jdXJzb3ItcG9pbnRlcicsXHJcbiAgICAgICAgICAgICFzaG93ICYmICctaGlkZGVuJyxcclxuICAgICAgICAgICAgcGl2b3RCeSAmJiBwaXZvdEJ5LnNsaWNlKDAsIC0xKS5pbmNsdWRlcyhjb2x1bW4uaWQpICYmICdydC1oZWFkZXItcGl2b3QnXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHRvZ2dsZVNvcnQ9e2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNTb3J0YWJsZSkgdGhpcy5zb3J0Q29sdW1uKGNvbHVtbiwgbXVsdGlTb3J0ID8gZS5zaGlmdEtleSA6IGZhbHNlKVxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGlzUmVzaXphYmxlICYmICdydC1yZXNpemFibGUtaGVhZGVyLWNvbnRlbnQnKX0+XHJcbiAgICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XHJcbiAgICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7cmVzaXplcn1cclxuICAgICAgICA8L1RoQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGhlYWRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIGNvbnN0IHRoZWFkVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaGVhZENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctaGVhZGVyJywgdGhlYWRQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZFRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZFRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlSGVhZGVyKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VGaWx0ZXIgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclRoUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgY29sdW1uSGVhZGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEhlYWRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAgIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUsXHJcbiAgICAgICAgdGhlYWRGaWx0ZXJUaFByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXHJcbiAgICAgICAgLi4udGhlYWRGaWx0ZXJUaFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXN0ID0ge1xyXG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5yZXN0LFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnJlc3QsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcmVkLmZpbmQoZmlsdGVyID0+IGZpbHRlci5pZCA9PT0gY29sdW1uLmlkKVxyXG5cclxuICAgICAgY29uc3QgUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQgPSBjb2x1bW4uRmlsdGVyIHx8IEZpbHRlckNvbXBvbmVudFxyXG5cclxuICAgICAgY29uc3QgaXNGaWx0ZXJhYmxlID0gXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLmZpbHRlcmFibGUsIGZpbHRlcmFibGUsIGZhbHNlKVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7aXNGaWx0ZXJhYmxlXHJcbiAgICAgICAgICAgID8gXy5ub3JtYWxpemVDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICBSZXNvbHZlZEZpbHRlckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgICAgICAgICBmaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB2YWx1ZSA9PiB0aGlzLmZpbHRlckNvbHVtbihjb2x1bW4sIHZhbHVlKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0UHJvcHMuY29sdW1uLkZpbHRlclxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgIDwvVGhDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlRmlsdGVycyA9ICgpID0+IHtcclxuICAgICAgY29uc3QgdGhlYWRGaWx0ZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWZpbHRlcnMnLCB0aGVhZEZpbHRlclByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50aGVhZEZpbHRlclByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50aGVhZEZpbHRlclByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRGaWx0ZXJUclByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgICAgc3R5bGU9e3RoZWFkRmlsdGVyVHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRoZWFkRmlsdGVyVHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VGaWx0ZXIpfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZ2VSb3cgPSAocm93LCBpLCBwYXRoID0gW10pID0+IHtcclxuICAgICAgY29uc3Qgcm93SW5mbyA9IHtcclxuICAgICAgICBvcmlnaW5hbDogcm93W29yaWdpbmFsS2V5XSxcclxuICAgICAgICByb3csXHJcbiAgICAgICAgaW5kZXg6IHJvd1tpbmRleEtleV0sXHJcbiAgICAgICAgdmlld0luZGV4OiAocm93SW5kZXggKz0gMSksXHJcbiAgICAgICAgcGFnZVNpemUsXHJcbiAgICAgICAgcGFnZSxcclxuICAgICAgICBsZXZlbDogcGF0aC5sZW5ndGgsXHJcbiAgICAgICAgbmVzdGluZ1BhdGg6IHBhdGguY29uY2F0KFtpXSksXHJcbiAgICAgICAgYWdncmVnYXRlZDogcm93W2FnZ3JlZ2F0ZWRLZXldLFxyXG4gICAgICAgIGdyb3VwZWRCeVBpdm90OiByb3dbZ3JvdXBlZEJ5UGl2b3RLZXldLFxyXG4gICAgICAgIHN1YlJvd3M6IHJvd1tzdWJSb3dzS2V5XSxcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpc0V4cGFuZGVkID0gXy5nZXQoZXhwYW5kZWQsIHJvd0luZm8ubmVzdGluZ1BhdGgpXHJcbiAgICAgIGNvbnN0IHRyR3JvdXBQcm9wcyA9IGdldFRyR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIGNvbnN0IHRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VHJQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUckdyb3VwQ29tcG9uZW50IGtleT17cm93SW5mby5uZXN0aW5nUGF0aC5qb2luKCdfJyl9IHsuLi50ckdyb3VwUHJvcHN9PlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0clByb3BzLmNsYXNzTmFtZSwgcm93Ll92aWV3SW5kZXggJSAyID8gJy1ldmVuJyA6ICctb2RkJyl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0clByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKChjb2x1bW4sIGkyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICAgICAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCBjb2x1bW4sIHRoaXMpKVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnRkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IGNlbGxJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ucm93SW5mbyxcclxuICAgICAgICAgICAgICAgIGlzRXhwYW5kZWQsXHJcbiAgICAgICAgICAgICAgICBjb2x1bW46IHsgLi4uY29sdW1uIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcm93SW5mby5yb3dbY29sdW1uLmlkXSxcclxuICAgICAgICAgICAgICAgIHBpdm90ZWQ6IGNvbHVtbi5waXZvdGVkLFxyXG4gICAgICAgICAgICAgICAgZXhwYW5kZXI6IGNvbHVtbi5leHBhbmRlcixcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWQsXHJcbiAgICAgICAgICAgICAgICBzaG93LFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHRkUHJvcHMsXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Qcm9wcyxcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMsXHJcbiAgICAgICAgICAgICAgICBzdHlsZXMsXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNlbGxJbmZvLnZhbHVlXHJcblxyXG4gICAgICAgICAgICAgIGxldCB1c2VPbkV4cGFuZGVyQ2xpY2tcclxuICAgICAgICAgICAgICBsZXQgaXNCcmFuY2hcclxuICAgICAgICAgICAgICBsZXQgaXNQcmV2aWV3XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IG9uRXhwYW5kZXJDbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0V4cGFuZGVkID0gXy5jbG9uZShleHBhbmRlZClcclxuICAgICAgICAgICAgICAgIGlmIChpc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCBmYWxzZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCB7fSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWQ6IG5ld0V4cGFuZGVkLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIG9uRXhwYW5kZWRDaGFuZ2UgJiZcclxuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZGVkQ2hhbmdlKG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZSwgY2VsbEluZm8pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGEgc3RhbmRhcmQgY2VsbFxyXG4gICAgICAgICAgICAgIGxldCByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uQ2VsbCwgY2VsbEluZm8sIHZhbHVlKVxyXG5cclxuICAgICAgICAgICAgICAvLyBSZXNvbHZlIFJlbmRlcmVyc1xyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCA9XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4uQWdncmVnYXRlZCB8fCAoIWNvbHVtbi5hZ2dyZWdhdGUgPyBBZ2dyZWdhdGVkQ29tcG9uZW50IDogY29sdW1uLkNlbGwpXHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCA9IGNvbHVtbi5FeHBhbmRlciB8fCBFeHBhbmRlckNvbXBvbmVudFxyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCA9IGNvbHVtbi5QaXZvdFZhbHVlIHx8IFBpdm90VmFsdWVDb21wb25lbnRcclxuICAgICAgICAgICAgICBjb25zdCBEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCA9XHJcbiAgICAgICAgICAgICAgICBQaXZvdENvbXBvbmVudCB8fFxyXG4gICAgICAgICAgICAgICAgKHByb3BzID0+IChcclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCB7Li4ucHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCB7Li4ucHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZFBpdm90Q29tcG9uZW50ID0gY29sdW1uLlBpdm90IHx8IERlZmF1bHRSZXNvbHZlZFBpdm90Q29tcG9uZW50XHJcblxyXG4gICAgICAgICAgICAgIC8vIElzIHRoaXMgY2VsbCBleHBhbmRhYmxlP1xyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkIHx8IGNlbGxJbmZvLmV4cGFuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGl0IGV4cGFuZGFibGUgYnkgZGVmdWFsdFxyXG4gICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIHVzZU9uRXhwYW5kZXJDbGljayA9IHRydWVcclxuICAgICAgICAgICAgICAgIC8vIElmIHBpdm90ZWQsIGhhcyBubyBzdWJSb3dzLCBhbmQgZG9lcyBub3QgaGF2ZSBhIHN1YkNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBtYWtlIGV4cGFuZGFibGVcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkICYmICFjZWxsSW5mby5zdWJSb3dzICYmICFTdWJDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoY2VsbEluZm8ucGl2b3RlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSXMgdGhpcyBjb2x1bW4gYSBicmFuY2g/XHJcbiAgICAgICAgICAgICAgICBpc0JyYW5jaCA9IHJvd0luZm8ucm93W3Bpdm90SURLZXldID09PSBjb2x1bW4uaWQgJiYgY2VsbEluZm8uc3ViUm93c1xyXG4gICAgICAgICAgICAgICAgLy8gU2hvdWxkIHRoaXMgY29sdW1uIGJlIGJsYW5rP1xyXG4gICAgICAgICAgICAgICAgaXNQcmV2aWV3ID1cclxuICAgICAgICAgICAgICAgICAgcGl2b3RCeS5pbmRleE9mKGNvbHVtbi5pZCkgPiBwaXZvdEJ5LmluZGV4T2Yocm93SW5mby5yb3dbcGl2b3RJREtleV0pICYmXHJcbiAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLnN1YlJvd3NcclxuICAgICAgICAgICAgICAgIC8vIFBpdm90IENlbGwgUmVuZGVyIE92ZXJyaWRlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNCcmFuY2gpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gaXNQaXZvdFxyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZFBpdm90Q29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmNlbGxJbmZvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJvd1twaXZvdFZhbEtleV0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByb3dbcGl2b3RWYWxLZXldXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNQcmV2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIFNob3cgdGhlIHBpdm90IHByZXZpZXdcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50LCBjZWxsSW5mbywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChjZWxsSW5mby5hZ2dyZWdhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQsIGNlbGxJbmZvLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5leHBhbmRlcikge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICAgIFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLFxyXG4gICAgICAgICAgICAgICAgICByb3dbcGl2b3RWYWxLZXldXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBpZiAocGl2b3RCeSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoY2VsbEluZm8uZ3JvdXBlZEJ5UGl2b3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsSW5mby5zdWJSb3dzICYmICFTdWJDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkT25FeHBhbmRlckNsaWNrID0gdXNlT25FeHBhbmRlckNsaWNrID8gb25FeHBhbmRlckNsaWNrIDogKCkgPT4ge31cclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIG9uQ2xpY2sgZXZlbnRzLCBtYWtlIHN1cmUgdGhleSBkb24ndFxyXG4gICAgICAgICAgICAgIC8vIG92ZXJyaWRlIGVhY2hvdGhlci4gVGhpcyBzaG91bGQgbWF5YmUgYmUgZXhwYW5kZWQgdG8gaGFuZGxlIGFsbFxyXG4gICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICBjb25zdCBpbnRlcmFjdGlvblByb3BzID0ge1xyXG4gICAgICAgICAgICAgICAgb25DbGljazogcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2ssXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAodGRQcm9wcy5yZXN0Lm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uUHJvcHMub25DbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0ZFByb3BzLnJlc3Qub25DbGljayhlLCAoKSA9PiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayhlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjb2x1bW5Qcm9wcy5yZXN0Lm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uUHJvcHMub25DbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb2x1bW5Qcm9wcy5yZXN0Lm9uQ2xpY2soZSwgKCkgPT4gcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2soZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGNlbGxcclxuICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgICAgICAgICAgICAga2V5PXtgJHtpMn0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgIWNlbGxJbmZvLmV4cGFuZGFibGUgJiYgIXNob3cgJiYgJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSAmJiAncnQtZXhwYW5kYWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgKGlzQnJhbmNoIHx8IGlzUHJldmlldykgJiYgJ3J0LXBpdm90J1xyXG4gICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgey4uLnRkUHJvcHMucmVzdH1cclxuICAgICAgICAgICAgICAgICAgey4uLmNvbHVtblByb3BzLnJlc3R9XHJcbiAgICAgICAgICAgICAgICAgIHsuLi5pbnRlcmFjdGlvblByb3BzfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7cmVzb2x2ZWRDZWxsfVxyXG4gICAgICAgICAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICAgIHtyb3dJbmZvLnN1YlJvd3MgJiZcclxuICAgICAgICAgICAgaXNFeHBhbmRlZCAmJlxyXG4gICAgICAgICAgICByb3dJbmZvLnN1YlJvd3MubWFwKChkLCBpKSA9PiBtYWtlUGFnZVJvdyhkLCBpLCByb3dJbmZvLm5lc3RpbmdQYXRoKSl9XHJcbiAgICAgICAgICB7U3ViQ29tcG9uZW50ICYmXHJcbiAgICAgICAgICAgICFyb3dJbmZvLnN1YlJvd3MgJiZcclxuICAgICAgICAgICAgaXNFeHBhbmRlZCAmJlxyXG4gICAgICAgICAgICBTdWJDb21wb25lbnQocm93SW5mbywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0gXy5jbG9uZShleHBhbmRlZClcclxuXHJcbiAgICAgICAgICAgICAgXy5zZXQobmV3RXhwYW5kZWQsIHJvd0luZm8ubmVzdGluZ1BhdGgsIGZhbHNlKVxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICA8L1RyR3JvdXBDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFkQ29sdW1uID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IGZsZXggPSB3aWR0aFxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0ZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRkUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFt0ZFByb3BzLmNsYXNzTmFtZSwgY29sdW1uLmNsYXNzTmFtZSwgY29sdW1uUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLnRkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUZENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMsICFzaG93ICYmICdoaWRkZW4nKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7ZmxleH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50ZFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KFBhZFJvd0NvbXBvbmVudCl9XHJcbiAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWRSb3cgPSAocm93LCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyR3JvdXBQcm9wcyA9IGdldFRyR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgY29uc3QgdHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VHJHcm91cENvbXBvbmVudCBrZXk9e2BwYWQtJHtpfWB9IHsuLi50ckdyb3VwUHJvcHN9PlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcclxuICAgICAgICAgICAgICAnLXBhZFJvdycsXHJcbiAgICAgICAgICAgICAgKHBhZ2VSb3dzLmxlbmd0aCArIGkpICUgMiA/ICctZXZlbicgOiAnLW9kZCcsXHJcbiAgICAgICAgICAgICAgdHJQcm9wcy5jbGFzc05hbWVcclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgc3R5bGU9e3RyUHJvcHMuc3R5bGUgfHwge319XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZVBhZENvbHVtbil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVHJHcm91cENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VDb2x1bW5Gb290ZXIgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdEZvb3RUZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtbkZvb3RlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRGb290ZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICB0Rm9vdFRkUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbi5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbkZvb3RlclByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLnRGb290VGRQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uRm9vdGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NlcywgIXNob3cgJiYgJ2hpZGRlbicpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5jb2x1bW5Qcm9wcy5yZXN0fVxyXG4gICAgICAgICAgey4uLnRGb290VGRQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgey4uLmNvbHVtbkZvb3RlclByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5Gb290ZXIsIHtcclxuICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VDb2x1bW5Gb290ZXJzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0Rm9vdFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICBjb25zdCB0Rm9vdFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGZvb3RDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17dEZvb3RQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50Rm9vdFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50Rm9vdFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0Rm9vdFRyUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgICAgc3R5bGU9e3RGb290VHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRGb290VHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VDb2x1bW5Gb290ZXIpfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1Rmb290Q29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZ2luYXRpb24gPSBpc1RvcCA9PiB7XHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb25Qcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRQYWdpbmF0aW9uUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8UGFnaW5hdGlvbkNvbXBvbmVudFxyXG4gICAgICAgICAgey4uLnJlc29sdmVkU3RhdGV9XHJcbiAgICAgICAgICBwYWdlcz17cGFnZXN9XHJcbiAgICAgICAgICBjYW5QcmV2aW91cz17Y2FuUHJldmlvdXN9XHJcbiAgICAgICAgICBjYW5OZXh0PXtjYW5OZXh0fVxyXG4gICAgICAgICAgb25QYWdlQ2hhbmdlPXt0aGlzLm9uUGFnZUNoYW5nZX1cclxuICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2U9e3RoaXMub25QYWdlU2l6ZUNoYW5nZX1cclxuICAgICAgICAgIGNsYXNzTmFtZT17cGFnaW5hdGlvblByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgIHN0eWxlPXtwYWdpbmF0aW9uUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICBpc1RvcD17aXNUb3B9XHJcbiAgICAgICAgICB7Li4ucGFnaW5hdGlvblByb3BzLnJlc3R9XHJcbiAgICAgICAgLz5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNjcm9sbCA9ICh0eXBlKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlID09PSAnZmFrZVNjcm9sbCcgJiYgdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCAhPT0gdGFibGVTY3JvbGxMZWZ0KSB7XHJcbiAgICAgICAgZmFrZVNjcm9sbExlZnQgPSB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIHRoaXMudGFibGVSZWYuY3VycmVudC5zY3JvbGxMZWZ0ID0gdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJyAmJiB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCAhPT0gZmFrZVNjcm9sbExlZnQpIHtcclxuICAgICAgICB0YWJsZVNjcm9sbExlZnQgPSB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0ID0gdGhpcy50YWJsZVJlZi5jdXJyZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlVGFibGUgPSAoKSA9PiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ1JlYWN0VGFibGUnLCBjbGFzc05hbWUsIHJvb3RQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgICAgIC4uLnJvb3RQcm9wcy5zdHlsZSxcclxuICAgICAgICB9fVxyXG4gICAgICAgIHsuLi5yb290UHJvcHMucmVzdH1cclxuICAgICAgPlxyXG4gICAgICAgIHtzaG93UGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvblRvcCA/IChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi10b3BcIj57bWFrZVBhZ2luYXRpb24odHJ1ZSl9PC9kaXY+XHJcbiAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgcmVmPXt0aGlzLmZha2VTY3JvbGxSZWZ9XHJcbiAgICAgICAgICBzdHlsZT17eyBvdmVyZmxvd1g6IFwiYXV0b1wiLCBvdmVyZmxvd1k6IFwiaGlkZGVuXCIgfX1cclxuICAgICAgICAgIG9uU2Nyb2xsPXsoKSA9PiBzY3JvbGwoJ2Zha2VTY3JvbGwnKX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdCb3R0b206ICcxcHgnLCB3aWR0aDogYCR7cm93TWluV2lkdGh9cHhgLCBoZWlnaHQ6IDAgfX0+Jm5ic3A7PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XHJcbiAgICAgICAgICBvblNjcm9sbD17KCkgPT4gc2Nyb2xsKCd0YWJsZScpfVxyXG4gICAgICAgICAgcmVmPXt0aGlzLnRhYmxlUmVmfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRhYmxlUHJvcHMuY2xhc3NOYW1lLCBjdXJyZW50bHlSZXNpemluZyA/ICdydC1yZXNpemluZycgOiAnJyl9XHJcbiAgICAgICAgICBzdHlsZT17dGFibGVQcm9wcy5zdHlsZX1cclxuICAgICAgICAgIHsuLi50YWJsZVByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2hhc0hlYWRlckdyb3VwcyA/IG1ha2VIZWFkZXJHcm91cHMoKSA6IG51bGx9XHJcbiAgICAgICAgICB7bWFrZUhlYWRlcnMoKX1cclxuICAgICAgICAgIHtoYXNGaWx0ZXJzID8gbWFrZUZpbHRlcnMoKSA6IG51bGx9XHJcblxyXG4gICAgICAgICAgPFRib2R5Q29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0Qm9keVByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgLi4udEJvZHlQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICB7Li4udEJvZHlQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7cGFnZVJvd3MubWFwKChkLCBpKSA9PiBtYWtlUGFnZVJvdyhkLCBpKSl9XHJcbiAgICAgICAgICAgIHtwYWRSb3dzLm1hcChtYWtlUGFkUm93KX1cclxuICAgICAgICAgIDwvVGJvZHlDb21wb25lbnQ+XHJcbiAgICAgICAgICB7aGFzQ29sdW1uRm9vdGVyID8gbWFrZUNvbHVtbkZvb3RlcnMoKSA6IG51bGx9XHJcbiAgICAgICAgPC9UYWJsZUNvbXBvbmVudD5cclxuICAgICAgICB7c2hvd1BhZ2luYXRpb24gJiYgc2hvd1BhZ2luYXRpb25Cb3R0b20gPyAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2luYXRpb24tYm90dG9tXCI+e21ha2VQYWdpbmF0aW9uKGZhbHNlKX08L2Rpdj5cclxuICAgICAgICApIDogbnVsbH1cclxuICAgICAgICB7IXBhZ2VSb3dzLmxlbmd0aCAmJiAoXHJcbiAgICAgICAgICA8Tm9EYXRhQ29tcG9uZW50IHsuLi5ub0RhdGFQcm9wc30+e18ubm9ybWFsaXplQ29tcG9uZW50KG5vRGF0YVRleHQpfTwvTm9EYXRhQ29tcG9uZW50PlxyXG4gICAgICAgICl9XHJcbiAgICAgICAgPExvYWRpbmdDb21wb25lbnQgbG9hZGluZz17bG9hZGluZ30gbG9hZGluZ1RleHQ9e2xvYWRpbmdUZXh0fSB7Li4ubG9hZGluZ1Byb3BzfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuXHJcbiAgICAvLyBjaGlsZFByb3BzIGFyZSBvcHRpb25hbGx5IHBhc3NlZCB0byBhIGZ1bmN0aW9uLWFzLWEtY2hpbGRcclxuICAgIHJldHVybiBjaGlsZHJlbiA/IGNoaWxkcmVuKGZpbmFsU3RhdGUsIG1ha2VUYWJsZSwgdGhpcykgOiBtYWtlVGFibGUoKVxyXG4gIH1cclxufVxyXG4iXX0=