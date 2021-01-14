var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import classnames from 'classnames';
//
import _ from './utils';
import Lifecycle from './lifecycle';
import Methods from './methods';
import defaultProps from './defaultProps';
import propTypes from './propTypes';

export var ReactTableDefaults = defaultProps;

var ReactTable = function (_Methods) {
  _inherits(ReactTable, _Methods);

  function ReactTable(props) {
    _classCallCheck(this, ReactTable);

    var _this = _possibleConstructorReturn(this, (ReactTable.__proto__ || Object.getPrototypeOf(ReactTable)).call(this, props));

    _this.tableRef = React.createRef();
    _this.fakeScrollRef = React.createRef();

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
      var padRows = _.range(Math.max(minRows - pageRows.length, 0));

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
          if (rowWithViewIndex[subRowsKey] && _.get(expanded, newPath)) {
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

      var rowMinWidth = _.sum(allVisibleColumns.map(function (d) {
        var resizedColumn = resized.find(function (x) {
          return x.id === d.id;
        }) || {};
        return _.getFirstDefined(resizedColumn.value, d.width, d.minWidth);
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

      var rootProps = _.splitProps(getProps(finalState, undefined, undefined, this));
      var tableProps = _.splitProps(getTableProps(finalState, undefined, undefined, this));
      var tBodyProps = _.splitProps(getTbodyProps(finalState, undefined, undefined, this));
      var loadingProps = getLoadingProps(finalState, undefined, undefined, this);
      var noDataProps = getNoDataProps(finalState, undefined, undefined, this);

      // Visual Components

      var makeHeaderGroup = function makeHeaderGroup(column, i) {
        var resizedValue = function resizedValue(col) {
          return (resized.find(function (x) {
            return x.id === col.id;
          }) || {}).value;
        };
        var flex = _.sum(column.columns.map(function (col) {
          return col.width || resizedValue(col) ? 0 : col.minWidth;
        }));
        var width = _.sum(column.columns.map(function (col) {
          return _.getFirstDefined(resizedValue(col), col.width, col.minWidth);
        }));
        var maxWidth = _.sum(column.columns.map(function (col) {
          return _.getFirstDefined(resizedValue(col), col.width, col.maxWidth);
        }));

        var theadGroupThProps = _.splitProps(getTheadGroupThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadGroupThProps.className, columnHeaderProps.className];

        var styles = _extends({}, column.headerStyle, theadGroupThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadGroupThProps.rest, columnHeaderProps.rest);

        var flexStyles = {
          flex: flex + ' 0 auto',
          width: _.asPx(width),
          maxWidth: _.asPx(maxWidth)
        };

        return React.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: classnames(classes),
            style: _extends({}, styles, flexStyles)
          }, rest),
          _.normalizeComponent(column.Header, {
            data: sortedData,
            column: column
          })
        );
      };

      var makeHeaderGroups = function makeHeaderGroups() {
        var theadGroupProps = _.splitProps(getTheadGroupProps(finalState, undefined, undefined, _this2));
        var theadGroupTrProps = _.splitProps(getTheadGroupTrProps(finalState, undefined, undefined, _this2));
        return React.createElement(
          TheadComponent,
          _extends({
            className: classnames('-headerGroups', theadGroupProps.className),
            style: _extends({}, theadGroupProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadGroupProps.rest),
          React.createElement(
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
        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var theadThProps = _.splitProps(getTheadThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadThProps.className, columnHeaderProps.className];

        var styles = _extends({}, column.headerStyle, theadThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadThProps.rest, columnHeaderProps.rest);

        var isResizable = _.getFirstDefined(column.resizable, resizable, false);
        var resizer = isResizable ? React.createElement(ResizerComponent, _extends({
          onMouseDown: function onMouseDown(e) {
            return _this2.resizeColumnStart(e, column, false);
          },
          onTouchStart: function onTouchStart(e) {
            return _this2.resizeColumnStart(e, column, true);
          }
        }, getResizerProps('finalState', undefined, column, _this2))) : null;

        var isSortable = _.getFirstDefined(column.sortable, sortable, false);

        return React.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: classnames(classes, isResizable && 'rt-resizable-header', sort ? sort.desc ? '-sort-desc' : '-sort-asc' : '', isSortable && '-cursor-pointer', !show && '-hidden', pivotBy && pivotBy.slice(0, -1).includes(column.id) && 'rt-header-pivot'),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _.asPx(width),
              maxWidth: _.asPx(maxWidth)
            }),
            toggleSort: function toggleSort(e) {
              if (isSortable) _this2.sortColumn(column, multiSort ? e.shiftKey : false);
            }
          }, rest),
          React.createElement(
            'div',
            { className: classnames(isResizable && 'rt-resizable-header-content') },
            _.normalizeComponent(column.Header, {
              data: sortedData,
              column: column
            })
          ),
          resizer
        );
      };

      var makeHeaders = function makeHeaders() {
        var theadProps = _.splitProps(getTheadProps(finalState, undefined, undefined, _this2));
        var theadTrProps = _.splitProps(getTheadTrProps(finalState, undefined, undefined, _this2));
        return React.createElement(
          TheadComponent,
          _extends({
            className: classnames('-header', theadProps.className),
            style: _extends({}, theadProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadProps.rest),
          React.createElement(
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
        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var theadFilterThProps = _.splitProps(getTheadFilterThProps(finalState, undefined, column, _this2));
        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this2));

        var classes = [column.headerClassName, theadFilterThProps.className, columnHeaderProps.className];

        var styles = _extends({}, column.headerStyle, theadFilterThProps.style, columnHeaderProps.style);

        var rest = _extends({}, theadFilterThProps.rest, columnHeaderProps.rest);

        var filter = filtered.find(function (filter) {
          return filter.id === column.id;
        });

        var ResolvedFilterComponent = column.Filter || FilterComponent;

        var isFilterable = _.getFirstDefined(column.filterable, filterable, false);

        return React.createElement(
          ThComponent,
          _extends({
            key: i + '-' + column.id,
            className: classnames(classes),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _.asPx(width),
              maxWidth: _.asPx(maxWidth)
            })
          }, rest),
          isFilterable ? _.normalizeComponent(ResolvedFilterComponent, {
            column: column,
            filter: filter,
            onChange: function onChange(value) {
              return _this2.filterColumn(column, value);
            }
          }, defaultProps.column.Filter) : null
        );
      };

      var makeFilters = function makeFilters() {
        var theadFilterProps = _.splitProps(getTheadFilterProps(finalState, undefined, undefined, _this2));
        var theadFilterTrProps = _.splitProps(getTheadFilterTrProps(finalState, undefined, undefined, _this2));
        return React.createElement(
          TheadComponent,
          _extends({
            className: classnames('-filters', theadFilterProps.className),
            style: _extends({}, theadFilterProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, theadFilterProps.rest),
          React.createElement(
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
        var isExpanded = _.get(expanded, rowInfo.nestingPath);
        var trGroupProps = getTrGroupProps(finalState, rowInfo, undefined, _this2);
        var trProps = _.splitProps(getTrProps(finalState, rowInfo, undefined, _this2));
        return React.createElement(
          TrGroupComponent,
          _extends({ key: rowInfo.nestingPath.join('_') }, trGroupProps),
          React.createElement(
            TrComponent,
            _extends({
              className: classnames(trProps.className, row._viewIndex % 2 ? '-even' : '-odd'),
              style: trProps.style
            }, trProps.rest),
            allVisibleColumns.map(function (column, i2) {
              var resizedCol = resized.find(function (x) {
                return x.id === column.id;
              }) || {};
              var show = typeof column.show === 'function' ? column.show() : column.show;
              var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);
              var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
              var tdProps = _.splitProps(getTdProps(finalState, rowInfo, column, _this2));
              var columnProps = _.splitProps(column.getProps(finalState, rowInfo, column, _this2));

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
                var newExpanded = _.clone(expanded);
                if (isExpanded) {
                  newExpanded = _.set(newExpanded, cellInfo.nestingPath, false);
                } else {
                  newExpanded = _.set(newExpanded, cellInfo.nestingPath, {});
                }

                return _this2.setStateWithData({
                  expanded: newExpanded
                }, function () {
                  return onExpandedChange && onExpandedChange(newExpanded, cellInfo.nestingPath, e, cellInfo);
                });
              };

              // Default to a standard cell
              var resolvedCell = _.normalizeComponent(column.Cell, cellInfo, value);

              // Resolve Renderers
              var ResolvedAggregatedComponent = column.Aggregated || (!column.aggregate ? AggregatedComponent : column.Cell);
              var ResolvedExpanderComponent = column.Expander || ExpanderComponent;
              var ResolvedPivotValueComponent = column.PivotValue || PivotValueComponent;
              var DefaultResolvedPivotComponent = PivotComponent || function (props) {
                return React.createElement(
                  'div',
                  null,
                  React.createElement(ResolvedExpanderComponent, props),
                  React.createElement(ResolvedPivotValueComponent, props)
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
                  resolvedCell = _.normalizeComponent(ResolvedPivotComponent, _extends({}, cellInfo, {
                    value: row[pivotValKey]
                  }), row[pivotValKey]);
                } else if (isPreview) {
                  // Show the pivot preview
                  resolvedCell = _.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
                } else {
                  resolvedCell = null;
                }
              } else if (cellInfo.aggregated) {
                resolvedCell = _.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
              }

              if (cellInfo.expander) {
                resolvedCell = _.normalizeComponent(ResolvedExpanderComponent, cellInfo, row[pivotValKey]);
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
              return React.createElement(
                TdComponent
                // eslint-disable-next-line react/no-array-index-key
                ,
                _extends({ key: i2 + '-' + column.id,
                  className: classnames(classes, !cellInfo.expandable && !show && 'hidden', cellInfo.expandable && 'rt-expandable', (isBranch || isPreview) && 'rt-pivot'),
                  style: _extends({}, styles, {
                    flex: width + ' 0 auto',
                    width: _.asPx(width),
                    maxWidth: _.asPx(maxWidth)
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
            var newExpanded = _.clone(expanded);

            _.set(newExpanded, rowInfo.nestingPath, false);
          })
        );
      };

      var makePadColumn = function makePadColumn(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var show = typeof column.show === 'function' ? column.show() : column.show;
        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var flex = width;
        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var tdProps = _.splitProps(getTdProps(finalState, undefined, column, _this2));
        var columnProps = _.splitProps(column.getProps(finalState, undefined, column, _this2));

        var classes = [tdProps.className, column.className, columnProps.className];

        var styles = _extends({}, tdProps.style, column.style, columnProps.style);

        return React.createElement(
          TdComponent,
          _extends({
            key: i + '-' + column.id,
            className: classnames(classes, !show && 'hidden'),
            style: _extends({}, styles, {
              flex: flex + ' 0 auto',
              width: _.asPx(width),
              maxWidth: _.asPx(maxWidth)
            })
          }, tdProps.rest),
          _.normalizeComponent(PadRowComponent)
        );
      };

      var makePadRow = function makePadRow(row, i) {
        var trGroupProps = getTrGroupProps(finalState, undefined, undefined, _this2);
        var trProps = _.splitProps(getTrProps(finalState, undefined, undefined, _this2));
        return React.createElement(
          TrGroupComponent,
          _extends({ key: 'pad-' + i }, trGroupProps),
          React.createElement(
            TrComponent,
            {
              className: classnames('-padRow', (pageRows.length + i) % 2 ? '-even' : '-odd', trProps.className),
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
        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);
        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);
        var tFootTdProps = _.splitProps(getTfootTdProps(finalState, undefined, column, _this2));
        var columnProps = _.splitProps(column.getProps(finalState, undefined, column, _this2));
        var columnFooterProps = _.splitProps(column.getFooterProps(finalState, undefined, column, _this2));

        var classes = [tFootTdProps.className, column.className, columnProps.className, columnFooterProps.className];

        var styles = _extends({}, tFootTdProps.style, column.style, columnProps.style, columnFooterProps.style);

        return React.createElement(
          TdComponent,
          _extends({
            key: i + '-' + column.id,
            className: classnames(classes, !show && 'hidden'),
            style: _extends({}, styles, {
              flex: width + ' 0 auto',
              width: _.asPx(width),
              maxWidth: _.asPx(maxWidth)
            })
          }, columnProps.rest, tFootTdProps.rest, columnFooterProps.rest),
          _.normalizeComponent(column.Footer, {
            data: sortedData,
            column: column
          })
        );
      };

      var makeColumnFooters = function makeColumnFooters() {
        var tFootProps = _.splitProps(getTfootProps(finalState, undefined, undefined, _this2));
        var tFootTrProps = _.splitProps(getTfootTrProps(finalState, undefined, undefined, _this2));
        return React.createElement(
          TfootComponent,
          _extends({
            className: tFootProps.className,
            style: _extends({}, tFootProps.style, {
              minWidth: rowMinWidth + 'px'
            })
          }, tFootProps.rest),
          React.createElement(
            TrComponent,
            _extends({
              className: classnames(tFootTrProps.className),
              style: tFootTrProps.style
            }, tFootTrProps.rest),
            allVisibleColumns.map(makeColumnFooter)
          )
        );
      };

      var makePagination = function makePagination(isTop) {
        var paginationProps = _.splitProps(getPaginationProps(finalState, undefined, undefined, _this2));
        return React.createElement(PaginationComponent, _extends({}, resolvedState, {
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
        return React.createElement(
          'div',
          _extends({
            className: classnames('ReactTable', className, rootProps.className),
            style: _extends({}, style, rootProps.style)
          }, rootProps.rest),
          showPagination && showPaginationTop ? React.createElement(
            'div',
            { className: 'pagination-top' },
            makePagination(true)
          ) : null,
          React.createElement(
            'div',
            {
              ref: _this2.fakeScrollRef,
              style: { overflowX: "auto", overflowY: "hidden" },
              onScroll: function onScroll() {
                return scroll('fakeScroll');
              }
            },
            React.createElement(
              'div',
              { style: { width: rowMinWidth + 'px', height: 0 } },
              '\xA0'
            )
          ),
          React.createElement(
            TableComponent,
            _extends({
              onScroll: function onScroll() {
                return scroll('table');
              },
              ref: _this2.tableRef,
              className: classnames(tableProps.className, currentlyResizing ? 'rt-resizing' : ''),
              style: tableProps.style
            }, tableProps.rest),
            hasHeaderGroups ? makeHeaderGroups() : null,
            makeHeaders(),
            hasFilters ? makeFilters() : null,
            React.createElement(
              TbodyComponent,
              _extends({
                className: classnames(tBodyProps.className),
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
          showPagination && showPaginationBottom ? React.createElement(
            'div',
            { className: 'pagination-bottom' },
            makePagination(false)
          ) : null,
          !pageRows.length && React.createElement(
            NoDataComponent,
            noDataProps,
            _.normalizeComponent(noDataText)
          ),
          React.createElement(LoadingComponent, _extends({ loading: loading, loadingText: loadingText }, loadingProps))
        );
      };

      // childProps are optionally passed to a function-as-a-child
      return children ? children(finalState, makeTable, this) : makeTable();
    }
  }]);

  return ReactTable;
}(Methods(Lifecycle(Component)));

ReactTable.propTypes = propTypes;
ReactTable.defaultProps = defaultProps;
export default ReactTable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNsYXNzbmFtZXMiLCJfIiwiTGlmZWN5Y2xlIiwiTWV0aG9kcyIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlJlYWN0VGFibGVEZWZhdWx0cyIsIlJlYWN0VGFibGUiLCJwcm9wcyIsInRhYmxlUmVmIiwiY3JlYXRlUmVmIiwiZmFrZVNjcm9sbFJlZiIsImdldFJlc29sdmVkU3RhdGUiLCJiaW5kIiwiZ2V0RGF0YU1vZGVsIiwiZ2V0U29ydGVkRGF0YSIsImZpcmVGZXRjaERhdGEiLCJnZXRQcm9wT3JTdGF0ZSIsImdldFN0YXRlT3JQcm9wIiwiZmlsdGVyRGF0YSIsInNvcnREYXRhIiwiZ2V0TWluUm93cyIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJzb3J0Q29sdW1uIiwiZmlsdGVyQ29sdW1uIiwicmVzaXplQ29sdW1uU3RhcnQiLCJyZXNpemVDb2x1bW5FbmQiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNvbHZlZFN0YXRlIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsInNob3dQYWdpbmF0aW9uIiwic2hvd1BhZ2luYXRpb25Ub3AiLCJzaG93UGFnaW5hdGlvbkJvdHRvbSIsIm1hbnVhbCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInNvcnRhYmxlIiwibXVsdGlTb3J0IiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInBpdm90QnkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsImxvYWRpbmciLCJwYWdlU2l6ZSIsInBhZ2UiLCJzb3J0ZWQiLCJmaWx0ZXJlZCIsInJlc2l6ZWQiLCJleHBhbmRlZCIsInBhZ2VzIiwib25FeHBhbmRlZENoYW5nZSIsIlRhYmxlQ29tcG9uZW50IiwiVGhlYWRDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiU3ViQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90Q29tcG9uZW50IiwiQWdncmVnYXRlZENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCIsInJlc29sdmVkRGF0YSIsImFsbFZpc2libGVDb2x1bW5zIiwiaGVhZGVyR3JvdXBzIiwiaGFzSGVhZGVyR3JvdXBzIiwic29ydGVkRGF0YSIsImN1cnJlbnRseVJlc2l6aW5nIiwiZmFrZVNjcm9sbExlZnQiLCJ0YWJsZVNjcm9sbExlZnQiLCJzdGFydFJvdyIsImVuZFJvdyIsInBhZ2VSb3dzIiwic2xpY2UiLCJtaW5Sb3dzIiwicGFkUm93cyIsInJhbmdlIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImhhc0NvbHVtbkZvb3RlciIsInNvbWUiLCJkIiwiRm9vdGVyIiwiaGFzRmlsdGVycyIsInJlY3Vyc2VSb3dzVmlld0luZGV4Iiwicm93cyIsInBhdGgiLCJpbmRleCIsIm1hcCIsInJvdyIsImkiLCJyb3dXaXRoVmlld0luZGV4IiwiX3ZpZXdJbmRleCIsIm5ld1BhdGgiLCJjb25jYXQiLCJnZXQiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJyb3dNaW5XaWR0aCIsInN1bSIsInJlc2l6ZWRDb2x1bW4iLCJmaW5kIiwieCIsImlkIiwiZ2V0Rmlyc3REZWZpbmVkIiwidmFsdWUiLCJ3aWR0aCIsIm1pbldpZHRoIiwicm93SW5kZXgiLCJmaW5hbFN0YXRlIiwicm9vdFByb3BzIiwic3BsaXRQcm9wcyIsInVuZGVmaW5lZCIsInRhYmxlUHJvcHMiLCJ0Qm9keVByb3BzIiwibG9hZGluZ1Byb3BzIiwibm9EYXRhUHJvcHMiLCJtYWtlSGVhZGVyR3JvdXAiLCJjb2x1bW4iLCJyZXNpemVkVmFsdWUiLCJjb2wiLCJmbGV4IiwiY29sdW1ucyIsIm1heFdpZHRoIiwidGhlYWRHcm91cFRoUHJvcHMiLCJjb2x1bW5IZWFkZXJQcm9wcyIsImdldEhlYWRlclByb3BzIiwiY2xhc3NlcyIsImhlYWRlckNsYXNzTmFtZSIsInN0eWxlcyIsImhlYWRlclN0eWxlIiwicmVzdCIsImZsZXhTdHlsZXMiLCJhc1B4Iiwibm9ybWFsaXplQ29tcG9uZW50IiwiSGVhZGVyIiwiZGF0YSIsIm1ha2VIZWFkZXJHcm91cHMiLCJ0aGVhZEdyb3VwUHJvcHMiLCJ0aGVhZEdyb3VwVHJQcm9wcyIsIm1ha2VIZWFkZXIiLCJyZXNpemVkQ29sIiwic29ydCIsInNob3ciLCJ0aGVhZFRoUHJvcHMiLCJpc1Jlc2l6YWJsZSIsInJlc2l6ZXIiLCJlIiwiaXNTb3J0YWJsZSIsImRlc2MiLCJpbmNsdWRlcyIsInNoaWZ0S2V5IiwibWFrZUhlYWRlcnMiLCJ0aGVhZFByb3BzIiwidGhlYWRUclByb3BzIiwibWFrZUZpbHRlciIsInRoZWFkRmlsdGVyVGhQcm9wcyIsImZpbHRlciIsIlJlc29sdmVkRmlsdGVyQ29tcG9uZW50IiwiRmlsdGVyIiwiaXNGaWx0ZXJhYmxlIiwib25DaGFuZ2UiLCJtYWtlRmlsdGVycyIsInRoZWFkRmlsdGVyUHJvcHMiLCJ0aGVhZEZpbHRlclRyUHJvcHMiLCJtYWtlUGFnZVJvdyIsInJvd0luZm8iLCJvcmlnaW5hbCIsInZpZXdJbmRleCIsImxldmVsIiwibmVzdGluZ1BhdGgiLCJhZ2dyZWdhdGVkIiwiZ3JvdXBlZEJ5UGl2b3QiLCJzdWJSb3dzIiwiaXNFeHBhbmRlZCIsInRyR3JvdXBQcm9wcyIsInRyUHJvcHMiLCJqb2luIiwiaTIiLCJ0ZFByb3BzIiwiY29sdW1uUHJvcHMiLCJjZWxsSW5mbyIsInBpdm90ZWQiLCJleHBhbmRlciIsInVzZU9uRXhwYW5kZXJDbGljayIsImlzQnJhbmNoIiwiaXNQcmV2aWV3Iiwib25FeHBhbmRlckNsaWNrIiwibmV3RXhwYW5kZWQiLCJjbG9uZSIsInNldCIsInNldFN0YXRlV2l0aERhdGEiLCJyZXNvbHZlZENlbGwiLCJDZWxsIiwiUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50IiwiQWdncmVnYXRlZCIsImFnZ3JlZ2F0ZSIsIlJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQiLCJFeHBhbmRlciIsIlJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90VmFsdWUiLCJEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCIsIlJlc29sdmVkUGl2b3RDb21wb25lbnQiLCJQaXZvdCIsImV4cGFuZGFibGUiLCJpbmRleE9mIiwicmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2siLCJpbnRlcmFjdGlvblByb3BzIiwib25DbGljayIsIm1ha2VQYWRDb2x1bW4iLCJtYWtlUGFkUm93IiwibWFrZUNvbHVtbkZvb3RlciIsInRGb290VGRQcm9wcyIsImNvbHVtbkZvb3RlclByb3BzIiwiZ2V0Rm9vdGVyUHJvcHMiLCJtYWtlQ29sdW1uRm9vdGVycyIsInRGb290UHJvcHMiLCJ0Rm9vdFRyUHJvcHMiLCJtYWtlUGFnaW5hdGlvbiIsInBhZ2luYXRpb25Qcm9wcyIsImlzVG9wIiwic2Nyb2xsIiwidHlwZSIsImN1cnJlbnQiLCJzY3JvbGxMZWZ0IiwibWFrZVRhYmxlIiwib3ZlcmZsb3dYIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFVBQVAsTUFBdUIsWUFBdkI7QUFDQTtBQUNBLE9BQU9DLENBQVAsTUFBYyxTQUFkO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixhQUF0QjtBQUNBLE9BQU9DLE9BQVAsTUFBb0IsV0FBcEI7QUFDQSxPQUFPQyxZQUFQLE1BQXlCLGdCQUF6QjtBQUNBLE9BQU9DLFNBQVAsTUFBc0IsYUFBdEI7O0FBRUEsT0FBTyxJQUFNQyxxQkFBcUJGLFlBQTNCOztJQUVjRyxVOzs7QUFJbkIsc0JBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSx3SEFDWkEsS0FEWTs7QUFHbEIsVUFBS0MsUUFBTCxHQUFnQlgsTUFBTVksU0FBTixFQUFoQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUJiLE1BQU1ZLFNBQU4sRUFBckI7O0FBRUEsVUFBS0UsZ0JBQUwsR0FBd0IsTUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLE9BQXhCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCRCxJQUFsQixPQUFwQjtBQUNBLFVBQUtFLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkYsSUFBbkIsT0FBckI7QUFDQSxVQUFLRyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJILElBQW5CLE9BQXJCO0FBQ0EsVUFBS0ksY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CSixJQUFwQixPQUF0QjtBQUNBLFVBQUtLLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkwsSUFB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O0FBdEIzQyxXQWxCRjtBQTBDR3hNLDRCQUFrQkUsb0JBQWxCLEdBQ0M7QUFBQTtBQUFBLGNBQUssV0FBVSxtQkFBZjtBQUFvQ3lNLDJCQUFlLEtBQWY7QUFBcEMsV0FERCxHQUVHLElBNUNOO0FBNkNHLFdBQUNuSixTQUFTTyxNQUFWLElBQ0M7QUFBQywyQkFBRDtBQUFxQnNDLHVCQUFyQjtBQUFtQzNKLGNBQUU2SyxrQkFBRixDQUFxQmxILFVBQXJCO0FBQW5DLFdBOUNKO0FBZ0RFLDhCQUFDLGdCQUFELGFBQWtCLFNBQVNhLE9BQTNCLEVBQW9DLGFBQWFkLFdBQWpELElBQWtFZ0csWUFBbEU7QUFoREYsU0FEZ0I7QUFBQSxPQUFsQjs7QUFxREE7QUFDQSxhQUFPN0gsV0FBV0EsU0FBU3VILFVBQVQsRUFBcUJvSCxTQUFyQixFQUFnQyxJQUFoQyxDQUFYLEdBQW1EQSxXQUExRDtBQUNEOzs7O0VBMTJCcUN0USxRQUFRRCxVQUFVSCxTQUFWLENBQVIsQzs7QUFBbkJRLFUsQ0FDWkYsUyxHQUFZQSxTO0FBREFFLFUsQ0FFWkgsWSxHQUFlQSxZO2VBRkhHLFUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXHJcbi8vXHJcbmltcG9ydCBfIGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCBMaWZlY3ljbGUgZnJvbSAnLi9saWZlY3ljbGUnXHJcbmltcG9ydCBNZXRob2RzIGZyb20gJy4vbWV0aG9kcydcclxuaW1wb3J0IGRlZmF1bHRQcm9wcyBmcm9tICcuL2RlZmF1bHRQcm9wcydcclxuaW1wb3J0IHByb3BUeXBlcyBmcm9tICcuL3Byb3BUeXBlcydcclxuXHJcbmV4cG9ydCBjb25zdCBSZWFjdFRhYmxlRGVmYXVsdHMgPSBkZWZhdWx0UHJvcHNcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0VGFibGUgZXh0ZW5kcyBNZXRob2RzKExpZmVjeWNsZShDb21wb25lbnQpKSB7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHByb3BUeXBlc1xyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHNcclxuXHJcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuXHJcbiAgICB0aGlzLnRhYmxlUmVmID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLmZha2VTY3JvbGxSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuXHJcbiAgICB0aGlzLmdldFJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXREYXRhTW9kZWwgPSB0aGlzLmdldERhdGFNb2RlbC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldFNvcnRlZERhdGEgPSB0aGlzLmdldFNvcnRlZERhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maXJlRmV0Y2hEYXRhID0gdGhpcy5maXJlRmV0Y2hEYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0UHJvcE9yU3RhdGUgPSB0aGlzLmdldFByb3BPclN0YXRlLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0U3RhdGVPclByb3AgPSB0aGlzLmdldFN0YXRlT3JQcm9wLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyRGF0YSA9IHRoaXMuZmlsdGVyRGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnNvcnREYXRhID0gdGhpcy5zb3J0RGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldE1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5vblBhZ2VDaGFuZ2UgPSB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLm9uUGFnZVNpemVDaGFuZ2UgPSB0aGlzLm9uUGFnZVNpemVDaGFuZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zb3J0Q29sdW1uID0gdGhpcy5zb3J0Q29sdW1uLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyQ29sdW1uID0gdGhpcy5maWx0ZXJDb2x1bW4uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5TdGFydCA9IHRoaXMucmVzaXplQ29sdW1uU3RhcnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5FbmQgPSB0aGlzLnJlc2l6ZUNvbHVtbkVuZC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZyA9IHRoaXMucmVzaXplQ29sdW1uTW92aW5nLmJpbmQodGhpcylcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBjb25zdCByZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgIGNvbnN0IHtcclxuICAgICAgY2hpbGRyZW4sXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgc3R5bGUsXHJcbiAgICAgIGdldFByb3BzLFxyXG4gICAgICBnZXRUYWJsZVByb3BzLFxyXG4gICAgICBnZXRUaGVhZEdyb3VwUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZEdyb3VwVGhQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZFRoUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkRmlsdGVyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkRmlsdGVyVHJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJUaFByb3BzLFxyXG4gICAgICBnZXRUYm9keVByb3BzLFxyXG4gICAgICBnZXRUckdyb3VwUHJvcHMsXHJcbiAgICAgIGdldFRyUHJvcHMsXHJcbiAgICAgIGdldFRkUHJvcHMsXHJcbiAgICAgIGdldFRmb290UHJvcHMsXHJcbiAgICAgIGdldFRmb290VHJQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RUZFByb3BzLFxyXG4gICAgICBnZXRQYWdpbmF0aW9uUHJvcHMsXHJcbiAgICAgIGdldExvYWRpbmdQcm9wcyxcclxuICAgICAgZ2V0Tm9EYXRhUHJvcHMsXHJcbiAgICAgIGdldFJlc2l6ZXJQcm9wcyxcclxuICAgICAgc2hvd1BhZ2luYXRpb24sXHJcbiAgICAgIHNob3dQYWdpbmF0aW9uVG9wLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbkJvdHRvbSxcclxuICAgICAgbWFudWFsLFxyXG4gICAgICBsb2FkaW5nVGV4dCxcclxuICAgICAgbm9EYXRhVGV4dCxcclxuICAgICAgc29ydGFibGUsXHJcbiAgICAgIG11bHRpU29ydCxcclxuICAgICAgcmVzaXphYmxlLFxyXG4gICAgICBmaWx0ZXJhYmxlLFxyXG4gICAgICAvLyBQaXZvdGluZyBTdGF0ZVxyXG4gICAgICBwaXZvdElES2V5LFxyXG4gICAgICBwaXZvdFZhbEtleSxcclxuICAgICAgcGl2b3RCeSxcclxuICAgICAgc3ViUm93c0tleSxcclxuICAgICAgYWdncmVnYXRlZEtleSxcclxuICAgICAgb3JpZ2luYWxLZXksXHJcbiAgICAgIGluZGV4S2V5LFxyXG4gICAgICBncm91cGVkQnlQaXZvdEtleSxcclxuICAgICAgLy8gU3RhdGVcclxuICAgICAgbG9hZGluZyxcclxuICAgICAgcGFnZVNpemUsXHJcbiAgICAgIHBhZ2UsXHJcbiAgICAgIHNvcnRlZCxcclxuICAgICAgZmlsdGVyZWQsXHJcbiAgICAgIHJlc2l6ZWQsXHJcbiAgICAgIGV4cGFuZGVkLFxyXG4gICAgICBwYWdlcyxcclxuICAgICAgb25FeHBhbmRlZENoYW5nZSxcclxuICAgICAgLy8gQ29tcG9uZW50c1xyXG4gICAgICBUYWJsZUNvbXBvbmVudCxcclxuICAgICAgVGhlYWRDb21wb25lbnQsXHJcbiAgICAgIFRib2R5Q29tcG9uZW50LFxyXG4gICAgICBUckdyb3VwQ29tcG9uZW50LFxyXG4gICAgICBUckNvbXBvbmVudCxcclxuICAgICAgVGhDb21wb25lbnQsXHJcbiAgICAgIFRkQ29tcG9uZW50LFxyXG4gICAgICBUZm9vdENvbXBvbmVudCxcclxuICAgICAgUGFnaW5hdGlvbkNvbXBvbmVudCxcclxuICAgICAgTG9hZGluZ0NvbXBvbmVudCxcclxuICAgICAgU3ViQ29tcG9uZW50LFxyXG4gICAgICBOb0RhdGFDb21wb25lbnQsXHJcbiAgICAgIFJlc2l6ZXJDb21wb25lbnQsXHJcbiAgICAgIEV4cGFuZGVyQ29tcG9uZW50LFxyXG4gICAgICBQaXZvdFZhbHVlQ29tcG9uZW50LFxyXG4gICAgICBQaXZvdENvbXBvbmVudCxcclxuICAgICAgQWdncmVnYXRlZENvbXBvbmVudCxcclxuICAgICAgRmlsdGVyQ29tcG9uZW50LFxyXG4gICAgICBQYWRSb3dDb21wb25lbnQsXHJcbiAgICAgIC8vIERhdGEgbW9kZWxcclxuICAgICAgcmVzb2x2ZWREYXRhLFxyXG4gICAgICBhbGxWaXNpYmxlQ29sdW1ucyxcclxuICAgICAgaGVhZGVyR3JvdXBzLFxyXG4gICAgICBoYXNIZWFkZXJHcm91cHMsXHJcbiAgICAgIC8vIFNvcnRlZCBEYXRhXHJcbiAgICAgIHNvcnRlZERhdGEsXHJcbiAgICAgIGN1cnJlbnRseVJlc2l6aW5nLFxyXG4gICAgfSA9IHJlc29sdmVkU3RhdGVcclxuXHJcbiAgICBsZXQgZmFrZVNjcm9sbExlZnQgPSAwO1xyXG4gICAgbGV0IHRhYmxlU2Nyb2xsTGVmdCA9IDA7XHJcblxyXG4gICAgLy8gUGFnaW5hdGlvblxyXG4gICAgY29uc3Qgc3RhcnRSb3cgPSBwYWdlU2l6ZSAqIHBhZ2VcclxuICAgIGNvbnN0IGVuZFJvdyA9IHN0YXJ0Um93ICsgcGFnZVNpemVcclxuICAgIGxldCBwYWdlUm93cyA9IG1hbnVhbCA/IHJlc29sdmVkRGF0YSA6IHNvcnRlZERhdGEuc2xpY2Uoc3RhcnRSb3csIGVuZFJvdylcclxuICAgIGNvbnN0IG1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MoKVxyXG4gICAgY29uc3QgcGFkUm93cyA9IF8ucmFuZ2UoTWF0aC5tYXgobWluUm93cyAtIHBhZ2VSb3dzLmxlbmd0aCwgMCkpXHJcblxyXG4gICAgY29uc3QgaGFzQ29sdW1uRm9vdGVyID0gYWxsVmlzaWJsZUNvbHVtbnMuc29tZShkID0+IGQuRm9vdGVyKVxyXG4gICAgY29uc3QgaGFzRmlsdGVycyA9IGZpbHRlcmFibGUgfHwgYWxsVmlzaWJsZUNvbHVtbnMuc29tZShkID0+IGQuZmlsdGVyYWJsZSlcclxuXHJcbiAgICBjb25zdCByZWN1cnNlUm93c1ZpZXdJbmRleCA9IChyb3dzLCBwYXRoID0gW10sIGluZGV4ID0gLTEpID0+IFtcclxuICAgICAgcm93cy5tYXAoKHJvdywgaSkgPT4ge1xyXG4gICAgICAgIGluZGV4ICs9IDFcclxuICAgICAgICBjb25zdCByb3dXaXRoVmlld0luZGV4ID0ge1xyXG4gICAgICAgICAgLi4ucm93LFxyXG4gICAgICAgICAgX3ZpZXdJbmRleDogaW5kZXgsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLmNvbmNhdChbaV0pXHJcbiAgICAgICAgaWYgKHJvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0gJiYgXy5nZXQoZXhwYW5kZWQsIG5ld1BhdGgpKSB7XHJcbiAgICAgICAgICBbcm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSwgaW5kZXhdID0gcmVjdXJzZVJvd3NWaWV3SW5kZXgoXHJcbiAgICAgICAgICAgIHJvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0sXHJcbiAgICAgICAgICAgIG5ld1BhdGgsXHJcbiAgICAgICAgICAgIGluZGV4XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByb3dXaXRoVmlld0luZGV4XHJcbiAgICAgIH0pLFxyXG4gICAgICBpbmRleCxcclxuICAgIF07XHJcbiAgICBbcGFnZVJvd3NdID0gcmVjdXJzZVJvd3NWaWV3SW5kZXgocGFnZVJvd3MpXHJcblxyXG4gICAgY29uc3QgY2FuUHJldmlvdXMgPSBwYWdlID4gMFxyXG4gICAgY29uc3QgY2FuTmV4dCA9IHBhZ2UgKyAxIDwgcGFnZXNcclxuXHJcbiAgICBjb25zdCByb3dNaW5XaWR0aCA9IF8uc3VtKFxyXG4gICAgICBhbGxWaXNpYmxlQ29sdW1ucy5tYXAoZCA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzaXplZENvbHVtbiA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGQuaWQpIHx8IHt9XHJcbiAgICAgICAgcmV0dXJuIF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2x1bW4udmFsdWUsIGQud2lkdGgsIGQubWluV2lkdGgpXHJcbiAgICAgIH0pXHJcbiAgICApXHJcblxyXG4gICAgbGV0IHJvd0luZGV4ID0gLTFcclxuXHJcbiAgICBjb25zdCBmaW5hbFN0YXRlID0ge1xyXG4gICAgICAuLi5yZXNvbHZlZFN0YXRlLFxyXG4gICAgICBzdGFydFJvdyxcclxuICAgICAgZW5kUm93LFxyXG4gICAgICBwYWdlUm93cyxcclxuICAgICAgbWluUm93cyxcclxuICAgICAgcGFkUm93cyxcclxuICAgICAgaGFzQ29sdW1uRm9vdGVyLFxyXG4gICAgICBjYW5QcmV2aW91cyxcclxuICAgICAgY2FuTmV4dCxcclxuICAgICAgcm93TWluV2lkdGgsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm9vdFByb3BzID0gXy5zcGxpdFByb3BzKGdldFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgIGNvbnN0IHRhYmxlUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGFibGVQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICBjb25zdCB0Qm9keVByb3BzID0gXy5zcGxpdFByb3BzKGdldFRib2R5UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgY29uc3QgbG9hZGluZ1Byb3BzID0gZ2V0TG9hZGluZ1Byb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgY29uc3Qgbm9EYXRhUHJvcHMgPSBnZXROb0RhdGFQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuXHJcbiAgICAvLyBWaXN1YWwgQ29tcG9uZW50c1xyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cCA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZFZhbHVlID0gY29sID0+IChyZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2wuaWQpIHx8IHt9KS52YWx1ZVxyXG4gICAgICBjb25zdCBmbGV4ID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiAoY29sLndpZHRoIHx8IHJlc2l6ZWRWYWx1ZShjb2wpID8gMCA6IGNvbC5taW5XaWR0aCkpXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLnN1bShcclxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5taW5XaWR0aCkpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLnN1bShcclxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRWYWx1ZShjb2wpLCBjb2wud2lkdGgsIGNvbC5tYXhXaWR0aCkpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUaFByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkR3JvdXBUaFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLFxyXG4gICAgICAgIHRoZWFkR3JvdXBUaFByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXHJcbiAgICAgICAgLi4udGhlYWRHcm91cFRoUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3QgPSB7XHJcbiAgICAgICAgLi4udGhlYWRHcm91cFRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmbGV4U3R5bGVzID0ge1xyXG4gICAgICAgIGZsZXg6IGAke2ZsZXh9IDAgYXV0b2AsXHJcbiAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIC4uLmZsZXhTdHlsZXMsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5IZWFkZXIsIHtcclxuICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9UaENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJHcm91cHMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdGhlYWRHcm91cFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRHcm91cFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWhlYWRlckdyb3VwcycsIHRoZWFkR3JvdXBQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRHcm91cFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50aGVhZEdyb3VwUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVhZEdyb3VwVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEdyb3VwVHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRoZWFkR3JvdXBUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtoZWFkZXJHcm91cHMubWFwKG1ha2VIZWFkZXJHcm91cCl9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCBzb3J0ID0gc29ydGVkLmZpbmQoZCA9PiBkLmlkID09PSBjb2x1bW4uaWQpXHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdGhlYWRUaFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLCB0aGVhZFRoUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkVGhQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdCA9IHtcclxuICAgICAgICAuLi50aGVhZFRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBpc1Jlc2l6YWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5yZXNpemFibGUsIHJlc2l6YWJsZSwgZmFsc2UpXHJcbiAgICAgIGNvbnN0IHJlc2l6ZXIgPSBpc1Jlc2l6YWJsZSA/IChcclxuICAgICAgICA8UmVzaXplckNvbXBvbmVudFxyXG4gICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5yZXNpemVDb2x1bW5TdGFydChlLCBjb2x1bW4sIGZhbHNlKX1cclxuICAgICAgICAgIG9uVG91Y2hTdGFydD17ZSA9PiB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0KGUsIGNvbHVtbiwgdHJ1ZSl9XHJcbiAgICAgICAgICB7Li4uZ2V0UmVzaXplclByb3BzKCdmaW5hbFN0YXRlJywgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICkgOiBudWxsXHJcblxyXG4gICAgICBjb25zdCBpc1NvcnRhYmxlID0gXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLnNvcnRhYmxlLCBzb3J0YWJsZSwgZmFsc2UpXHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICBjbGFzc2VzLFxyXG4gICAgICAgICAgICBpc1Jlc2l6YWJsZSAmJiAncnQtcmVzaXphYmxlLWhlYWRlcicsXHJcbiAgICAgICAgICAgIHNvcnQgPyAoc29ydC5kZXNjID8gJy1zb3J0LWRlc2MnIDogJy1zb3J0LWFzYycpIDogJycsXHJcbiAgICAgICAgICAgIGlzU29ydGFibGUgJiYgJy1jdXJzb3ItcG9pbnRlcicsXHJcbiAgICAgICAgICAgICFzaG93ICYmICctaGlkZGVuJyxcclxuICAgICAgICAgICAgcGl2b3RCeSAmJiBwaXZvdEJ5LnNsaWNlKDAsIC0xKS5pbmNsdWRlcyhjb2x1bW4uaWQpICYmICdydC1oZWFkZXItcGl2b3QnXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHRvZ2dsZVNvcnQ9e2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNTb3J0YWJsZSkgdGhpcy5zb3J0Q29sdW1uKGNvbHVtbiwgbXVsdGlTb3J0ID8gZS5zaGlmdEtleSA6IGZhbHNlKVxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGlzUmVzaXphYmxlICYmICdydC1yZXNpemFibGUtaGVhZGVyLWNvbnRlbnQnKX0+XHJcbiAgICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XHJcbiAgICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7cmVzaXplcn1cclxuICAgICAgICA8L1RoQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGhlYWRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIGNvbnN0IHRoZWFkVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaGVhZENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctaGVhZGVyJywgdGhlYWRQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZFRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZFRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlSGVhZGVyKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VGaWx0ZXIgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclRoUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgY29sdW1uSGVhZGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEhlYWRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAgIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUsXHJcbiAgICAgICAgdGhlYWRGaWx0ZXJUaFByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5IZWFkZXJQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXHJcbiAgICAgICAgLi4udGhlYWRGaWx0ZXJUaFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXN0ID0ge1xyXG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5yZXN0LFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnJlc3QsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcmVkLmZpbmQoZmlsdGVyID0+IGZpbHRlci5pZCA9PT0gY29sdW1uLmlkKVxyXG5cclxuICAgICAgY29uc3QgUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQgPSBjb2x1bW4uRmlsdGVyIHx8IEZpbHRlckNvbXBvbmVudFxyXG5cclxuICAgICAgY29uc3QgaXNGaWx0ZXJhYmxlID0gXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLmZpbHRlcmFibGUsIGZpbHRlcmFibGUsIGZhbHNlKVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7aXNGaWx0ZXJhYmxlXHJcbiAgICAgICAgICAgID8gXy5ub3JtYWxpemVDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICBSZXNvbHZlZEZpbHRlckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgICAgICAgICBmaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB2YWx1ZSA9PiB0aGlzLmZpbHRlckNvbHVtbihjb2x1bW4sIHZhbHVlKSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0UHJvcHMuY29sdW1uLkZpbHRlclxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgOiBudWxsfVxyXG4gICAgICAgIDwvVGhDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlRmlsdGVycyA9ICgpID0+IHtcclxuICAgICAgY29uc3QgdGhlYWRGaWx0ZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEZpbHRlclRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWZpbHRlcnMnLCB0aGVhZEZpbHRlclByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50aGVhZEZpbHRlclByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50aGVhZEZpbHRlclByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRGaWx0ZXJUclByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgICAgc3R5bGU9e3RoZWFkRmlsdGVyVHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRoZWFkRmlsdGVyVHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VGaWx0ZXIpfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZ2VSb3cgPSAocm93LCBpLCBwYXRoID0gW10pID0+IHtcclxuICAgICAgY29uc3Qgcm93SW5mbyA9IHtcclxuICAgICAgICBvcmlnaW5hbDogcm93W29yaWdpbmFsS2V5XSxcclxuICAgICAgICByb3csXHJcbiAgICAgICAgaW5kZXg6IHJvd1tpbmRleEtleV0sXHJcbiAgICAgICAgdmlld0luZGV4OiAocm93SW5kZXggKz0gMSksXHJcbiAgICAgICAgcGFnZVNpemUsXHJcbiAgICAgICAgcGFnZSxcclxuICAgICAgICBsZXZlbDogcGF0aC5sZW5ndGgsXHJcbiAgICAgICAgbmVzdGluZ1BhdGg6IHBhdGguY29uY2F0KFtpXSksXHJcbiAgICAgICAgYWdncmVnYXRlZDogcm93W2FnZ3JlZ2F0ZWRLZXldLFxyXG4gICAgICAgIGdyb3VwZWRCeVBpdm90OiByb3dbZ3JvdXBlZEJ5UGl2b3RLZXldLFxyXG4gICAgICAgIHN1YlJvd3M6IHJvd1tzdWJSb3dzS2V5XSxcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpc0V4cGFuZGVkID0gXy5nZXQoZXhwYW5kZWQsIHJvd0luZm8ubmVzdGluZ1BhdGgpXHJcbiAgICAgIGNvbnN0IHRyR3JvdXBQcm9wcyA9IGdldFRyR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIGNvbnN0IHRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VHJQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUckdyb3VwQ29tcG9uZW50IGtleT17cm93SW5mby5uZXN0aW5nUGF0aC5qb2luKCdfJyl9IHsuLi50ckdyb3VwUHJvcHN9PlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0clByb3BzLmNsYXNzTmFtZSwgcm93Ll92aWV3SW5kZXggJSAyID8gJy1ldmVuJyA6ICctb2RkJyl9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0clByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKChjb2x1bW4sIGkyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgICAgICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICAgICAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCByb3dJbmZvLCBjb2x1bW4sIHRoaXMpKVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnRkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IGNlbGxJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ucm93SW5mbyxcclxuICAgICAgICAgICAgICAgIGlzRXhwYW5kZWQsXHJcbiAgICAgICAgICAgICAgICBjb2x1bW46IHsgLi4uY29sdW1uIH0sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcm93SW5mby5yb3dbY29sdW1uLmlkXSxcclxuICAgICAgICAgICAgICAgIHBpdm90ZWQ6IGNvbHVtbi5waXZvdGVkLFxyXG4gICAgICAgICAgICAgICAgZXhwYW5kZXI6IGNvbHVtbi5leHBhbmRlcixcclxuICAgICAgICAgICAgICAgIHJlc2l6ZWQsXHJcbiAgICAgICAgICAgICAgICBzaG93LFxyXG4gICAgICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCxcclxuICAgICAgICAgICAgICAgIHRkUHJvcHMsXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5Qcm9wcyxcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMsXHJcbiAgICAgICAgICAgICAgICBzdHlsZXMsXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNlbGxJbmZvLnZhbHVlXHJcblxyXG4gICAgICAgICAgICAgIGxldCB1c2VPbkV4cGFuZGVyQ2xpY2tcclxuICAgICAgICAgICAgICBsZXQgaXNCcmFuY2hcclxuICAgICAgICAgICAgICBsZXQgaXNQcmV2aWV3XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IG9uRXhwYW5kZXJDbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0V4cGFuZGVkID0gXy5jbG9uZShleHBhbmRlZClcclxuICAgICAgICAgICAgICAgIGlmIChpc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCBmYWxzZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCB7fSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKFxyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWQ6IG5ld0V4cGFuZGVkLFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIG9uRXhwYW5kZWRDaGFuZ2UgJiZcclxuICAgICAgICAgICAgICAgICAgICBvbkV4cGFuZGVkQ2hhbmdlKG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZSwgY2VsbEluZm8pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGEgc3RhbmRhcmQgY2VsbFxyXG4gICAgICAgICAgICAgIGxldCByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uQ2VsbCwgY2VsbEluZm8sIHZhbHVlKVxyXG5cclxuICAgICAgICAgICAgICAvLyBSZXNvbHZlIFJlbmRlcmVyc1xyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCA9XHJcbiAgICAgICAgICAgICAgICBjb2x1bW4uQWdncmVnYXRlZCB8fCAoIWNvbHVtbi5hZ2dyZWdhdGUgPyBBZ2dyZWdhdGVkQ29tcG9uZW50IDogY29sdW1uLkNlbGwpXHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCA9IGNvbHVtbi5FeHBhbmRlciB8fCBFeHBhbmRlckNvbXBvbmVudFxyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCA9IGNvbHVtbi5QaXZvdFZhbHVlIHx8IFBpdm90VmFsdWVDb21wb25lbnRcclxuICAgICAgICAgICAgICBjb25zdCBEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCA9XHJcbiAgICAgICAgICAgICAgICBQaXZvdENvbXBvbmVudCB8fFxyXG4gICAgICAgICAgICAgICAgKHByb3BzID0+IChcclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCB7Li4ucHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCB7Li4ucHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZFBpdm90Q29tcG9uZW50ID0gY29sdW1uLlBpdm90IHx8IERlZmF1bHRSZXNvbHZlZFBpdm90Q29tcG9uZW50XHJcblxyXG4gICAgICAgICAgICAgIC8vIElzIHRoaXMgY2VsbCBleHBhbmRhYmxlP1xyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkIHx8IGNlbGxJbmZvLmV4cGFuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGl0IGV4cGFuZGFibGUgYnkgZGVmdWFsdFxyXG4gICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIHVzZU9uRXhwYW5kZXJDbGljayA9IHRydWVcclxuICAgICAgICAgICAgICAgIC8vIElmIHBpdm90ZWQsIGhhcyBubyBzdWJSb3dzLCBhbmQgZG9lcyBub3QgaGF2ZSBhIHN1YkNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBtYWtlIGV4cGFuZGFibGVcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkICYmICFjZWxsSW5mby5zdWJSb3dzICYmICFTdWJDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoY2VsbEluZm8ucGl2b3RlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSXMgdGhpcyBjb2x1bW4gYSBicmFuY2g/XHJcbiAgICAgICAgICAgICAgICBpc0JyYW5jaCA9IHJvd0luZm8ucm93W3Bpdm90SURLZXldID09PSBjb2x1bW4uaWQgJiYgY2VsbEluZm8uc3ViUm93c1xyXG4gICAgICAgICAgICAgICAgLy8gU2hvdWxkIHRoaXMgY29sdW1uIGJlIGJsYW5rP1xyXG4gICAgICAgICAgICAgICAgaXNQcmV2aWV3ID1cclxuICAgICAgICAgICAgICAgICAgcGl2b3RCeS5pbmRleE9mKGNvbHVtbi5pZCkgPiBwaXZvdEJ5LmluZGV4T2Yocm93SW5mby5yb3dbcGl2b3RJREtleV0pICYmXHJcbiAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLnN1YlJvd3NcclxuICAgICAgICAgICAgICAgIC8vIFBpdm90IENlbGwgUmVuZGVyIE92ZXJyaWRlXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNCcmFuY2gpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gaXNQaXZvdFxyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZFBpdm90Q29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmNlbGxJbmZvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJvd1twaXZvdFZhbEtleV0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByb3dbcGl2b3RWYWxLZXldXHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNQcmV2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIFNob3cgdGhlIHBpdm90IHByZXZpZXdcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50LCBjZWxsSW5mbywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChjZWxsSW5mby5hZ2dyZWdhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQsIGNlbGxJbmZvLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5leHBhbmRlcikge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRDZWxsID0gXy5ub3JtYWxpemVDb21wb25lbnQoXHJcbiAgICAgICAgICAgICAgICAgIFJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgIGNlbGxJbmZvLFxyXG4gICAgICAgICAgICAgICAgICByb3dbcGl2b3RWYWxLZXldXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBpZiAocGl2b3RCeSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoY2VsbEluZm8uZ3JvdXBlZEJ5UGl2b3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsSW5mby5zdWJSb3dzICYmICFTdWJDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkT25FeHBhbmRlckNsaWNrID0gdXNlT25FeHBhbmRlckNsaWNrID8gb25FeHBhbmRlckNsaWNrIDogKCkgPT4ge31cclxuXHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIG9uQ2xpY2sgZXZlbnRzLCBtYWtlIHN1cmUgdGhleSBkb24ndFxyXG4gICAgICAgICAgICAgIC8vIG92ZXJyaWRlIGVhY2hvdGhlci4gVGhpcyBzaG91bGQgbWF5YmUgYmUgZXhwYW5kZWQgdG8gaGFuZGxlIGFsbFxyXG4gICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICBjb25zdCBpbnRlcmFjdGlvblByb3BzID0ge1xyXG4gICAgICAgICAgICAgICAgb25DbGljazogcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2ssXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAodGRQcm9wcy5yZXN0Lm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uUHJvcHMub25DbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0ZFByb3BzLnJlc3Qub25DbGljayhlLCAoKSA9PiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayhlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjb2x1bW5Qcm9wcy5yZXN0Lm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uUHJvcHMub25DbGljayA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb2x1bW5Qcm9wcy5yZXN0Lm9uQ2xpY2soZSwgKCkgPT4gcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2soZSkpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGNlbGxcclxuICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgICAgICAgICAgICAga2V5PXtgJHtpMn0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgIWNlbGxJbmZvLmV4cGFuZGFibGUgJiYgIXNob3cgJiYgJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbEluZm8uZXhwYW5kYWJsZSAmJiAncnQtZXhwYW5kYWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgKGlzQnJhbmNoIHx8IGlzUHJldmlldykgJiYgJ3J0LXBpdm90J1xyXG4gICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgey4uLnRkUHJvcHMucmVzdH1cclxuICAgICAgICAgICAgICAgICAgey4uLmNvbHVtblByb3BzLnJlc3R9XHJcbiAgICAgICAgICAgICAgICAgIHsuLi5pbnRlcmFjdGlvblByb3BzfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7cmVzb2x2ZWRDZWxsfVxyXG4gICAgICAgICAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICAgIHtyb3dJbmZvLnN1YlJvd3MgJiZcclxuICAgICAgICAgICAgaXNFeHBhbmRlZCAmJlxyXG4gICAgICAgICAgICByb3dJbmZvLnN1YlJvd3MubWFwKChkLCBpKSA9PiBtYWtlUGFnZVJvdyhkLCBpLCByb3dJbmZvLm5lc3RpbmdQYXRoKSl9XHJcbiAgICAgICAgICB7U3ViQ29tcG9uZW50ICYmXHJcbiAgICAgICAgICAgICFyb3dJbmZvLnN1YlJvd3MgJiZcclxuICAgICAgICAgICAgaXNFeHBhbmRlZCAmJlxyXG4gICAgICAgICAgICBTdWJDb21wb25lbnQocm93SW5mbywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0gXy5jbG9uZShleHBhbmRlZClcclxuXHJcbiAgICAgICAgICAgICAgXy5zZXQobmV3RXhwYW5kZWQsIHJvd0luZm8ubmVzdGluZ1BhdGgsIGZhbHNlKVxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICA8L1RyR3JvdXBDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFkQ29sdW1uID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IGZsZXggPSB3aWR0aFxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0ZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRkUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFt0ZFByb3BzLmNsYXNzTmFtZSwgY29sdW1uLmNsYXNzTmFtZSwgY29sdW1uUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLnRkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUZENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMsICFzaG93ICYmICdoaWRkZW4nKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7ZmxleH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50ZFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KFBhZFJvd0NvbXBvbmVudCl9XHJcbiAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWRSb3cgPSAocm93LCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyR3JvdXBQcm9wcyA9IGdldFRyR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgY29uc3QgdHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VHJHcm91cENvbXBvbmVudCBrZXk9e2BwYWQtJHtpfWB9IHsuLi50ckdyb3VwUHJvcHN9PlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcclxuICAgICAgICAgICAgICAnLXBhZFJvdycsXHJcbiAgICAgICAgICAgICAgKHBhZ2VSb3dzLmxlbmd0aCArIGkpICUgMiA/ICctZXZlbicgOiAnLW9kZCcsXHJcbiAgICAgICAgICAgICAgdHJQcm9wcy5jbGFzc05hbWVcclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgc3R5bGU9e3RyUHJvcHMuc3R5bGUgfHwge319XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZVBhZENvbHVtbil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVHJHcm91cENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VDb2x1bW5Gb290ZXIgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdEZvb3RUZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtbkZvb3RlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRGb290ZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICB0Rm9vdFRkUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbi5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbkZvb3RlclByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLnRGb290VGRQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uRm9vdGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NlcywgIXNob3cgJiYgJ2hpZGRlbicpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5jb2x1bW5Qcm9wcy5yZXN0fVxyXG4gICAgICAgICAgey4uLnRGb290VGRQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgey4uLmNvbHVtbkZvb3RlclByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5Gb290ZXIsIHtcclxuICAgICAgICAgICAgZGF0YTogc29ydGVkRGF0YSxcclxuICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9UZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VDb2x1bW5Gb290ZXJzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0Rm9vdFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRmb290UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICBjb25zdCB0Rm9vdFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGZvb3RDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17dEZvb3RQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50Rm9vdFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50Rm9vdFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0Rm9vdFRyUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgICAgc3R5bGU9e3RGb290VHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRGb290VHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VDb2x1bW5Gb290ZXIpfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1Rmb290Q29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZ2luYXRpb24gPSBpc1RvcCA9PiB7XHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb25Qcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRQYWdpbmF0aW9uUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8UGFnaW5hdGlvbkNvbXBvbmVudFxyXG4gICAgICAgICAgey4uLnJlc29sdmVkU3RhdGV9XHJcbiAgICAgICAgICBwYWdlcz17cGFnZXN9XHJcbiAgICAgICAgICBjYW5QcmV2aW91cz17Y2FuUHJldmlvdXN9XHJcbiAgICAgICAgICBjYW5OZXh0PXtjYW5OZXh0fVxyXG4gICAgICAgICAgb25QYWdlQ2hhbmdlPXt0aGlzLm9uUGFnZUNoYW5nZX1cclxuICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2U9e3RoaXMub25QYWdlU2l6ZUNoYW5nZX1cclxuICAgICAgICAgIGNsYXNzTmFtZT17cGFnaW5hdGlvblByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgIHN0eWxlPXtwYWdpbmF0aW9uUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICBpc1RvcD17aXNUb3B9XHJcbiAgICAgICAgICB7Li4ucGFnaW5hdGlvblByb3BzLnJlc3R9XHJcbiAgICAgICAgLz5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNjcm9sbCA9ICh0eXBlKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlID09PSAnZmFrZVNjcm9sbCcgJiYgdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCAhPT0gdGFibGVTY3JvbGxMZWZ0KSB7XHJcbiAgICAgICAgZmFrZVNjcm9sbExlZnQgPSB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIHRoaXMudGFibGVSZWYuY3VycmVudC5zY3JvbGxMZWZ0ID0gdGhpcy5mYWtlU2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJyAmJiB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdCAhPT0gZmFrZVNjcm9sbExlZnQpIHtcclxuICAgICAgICB0YWJsZVNjcm9sbExlZnQgPSB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0ID0gdGhpcy50YWJsZVJlZi5jdXJyZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlVGFibGUgPSAoKSA9PiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ1JlYWN0VGFibGUnLCBjbGFzc05hbWUsIHJvb3RQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgICAgIC4uLnJvb3RQcm9wcy5zdHlsZSxcclxuICAgICAgICB9fVxyXG4gICAgICAgIHsuLi5yb290UHJvcHMucmVzdH1cclxuICAgICAgPlxyXG4gICAgICAgIHtzaG93UGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvblRvcCA/IChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi10b3BcIj57bWFrZVBhZ2luYXRpb24odHJ1ZSl9PC9kaXY+XHJcbiAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgcmVmPXt0aGlzLmZha2VTY3JvbGxSZWZ9XHJcbiAgICAgICAgICBzdHlsZT17eyBvdmVyZmxvd1g6IFwiYXV0b1wiLCBvdmVyZmxvd1k6IFwiaGlkZGVuXCIgfX1cclxuICAgICAgICAgIG9uU2Nyb2xsPXsoKSA9PiBzY3JvbGwoJ2Zha2VTY3JvbGwnKX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsIGhlaWdodDogMCB9fT4mbmJzcDs8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8VGFibGVDb21wb25lbnRcclxuICAgICAgICAgIG9uU2Nyb2xsPXsoKSA9PiBzY3JvbGwoJ3RhYmxlJyl9XHJcbiAgICAgICAgICByZWY9e3RoaXMudGFibGVSZWZ9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGFibGVQcm9wcy5jbGFzc05hbWUsIGN1cnJlbnRseVJlc2l6aW5nID8gJ3J0LXJlc2l6aW5nJyA6ICcnKX1cclxuICAgICAgICAgIHN0eWxlPXt0YWJsZVByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgey4uLnRhYmxlUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7aGFzSGVhZGVyR3JvdXBzID8gbWFrZUhlYWRlckdyb3VwcygpIDogbnVsbH1cclxuICAgICAgICAgIHttYWtlSGVhZGVycygpfVxyXG4gICAgICAgICAge2hhc0ZpbHRlcnMgPyBtYWtlRmlsdGVycygpIDogbnVsbH1cclxuXHJcbiAgICAgICAgICA8VGJvZHlDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRCb2R5UHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAuLi50Qm9keVByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIHsuLi50Qm9keVByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtwYWdlUm93cy5tYXAoKGQsIGkpID0+IG1ha2VQYWdlUm93KGQsIGkpKX1cclxuICAgICAgICAgICAge3BhZFJvd3MubWFwKG1ha2VQYWRSb3cpfVxyXG4gICAgICAgICAgPC9UYm9keUNvbXBvbmVudD5cclxuICAgICAgICAgIHtoYXNDb2x1bW5Gb290ZXIgPyBtYWtlQ29sdW1uRm9vdGVycygpIDogbnVsbH1cclxuICAgICAgICA8L1RhYmxlQ29tcG9uZW50PlxyXG4gICAgICAgIHtzaG93UGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvbkJvdHRvbSA/IChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi1ib3R0b21cIj57bWFrZVBhZ2luYXRpb24oZmFsc2UpfTwvZGl2PlxyXG4gICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgIHshcGFnZVJvd3MubGVuZ3RoICYmIChcclxuICAgICAgICAgIDxOb0RhdGFDb21wb25lbnQgey4uLm5vRGF0YVByb3BzfT57Xy5ub3JtYWxpemVDb21wb25lbnQobm9EYXRhVGV4dCl9PC9Ob0RhdGFDb21wb25lbnQ+XHJcbiAgICAgICAgKX1cclxuICAgICAgICA8TG9hZGluZ0NvbXBvbmVudCBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkaW5nVGV4dD17bG9hZGluZ1RleHR9IHsuLi5sb2FkaW5nUHJvcHN9IC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG5cclxuICAgIC8vIGNoaWxkUHJvcHMgYXJlIG9wdGlvbmFsbHkgcGFzc2VkIHRvIGEgZnVuY3Rpb24tYXMtYS1jaGlsZFxyXG4gICAgcmV0dXJuIGNoaWxkcmVuID8gY2hpbGRyZW4oZmluYWxTdGF0ZSwgbWFrZVRhYmxlLCB0aGlzKSA6IG1ha2VUYWJsZSgpXHJcbiAgfVxyXG59XHJcbiJdfQ==