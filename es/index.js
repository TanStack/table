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
              { style: { paddingBottom: '1px', width: rowMinWidth + 'px', height: 0 } },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNsYXNzbmFtZXMiLCJfIiwiTGlmZWN5Y2xlIiwiTWV0aG9kcyIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlJlYWN0VGFibGVEZWZhdWx0cyIsIlJlYWN0VGFibGUiLCJwcm9wcyIsInRhYmxlUmVmIiwiY3JlYXRlUmVmIiwiZmFrZVNjcm9sbFJlZiIsImdldFJlc29sdmVkU3RhdGUiLCJiaW5kIiwiZ2V0RGF0YU1vZGVsIiwiZ2V0U29ydGVkRGF0YSIsImZpcmVGZXRjaERhdGEiLCJnZXRQcm9wT3JTdGF0ZSIsImdldFN0YXRlT3JQcm9wIiwiZmlsdGVyRGF0YSIsInNvcnREYXRhIiwiZ2V0TWluUm93cyIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJzb3J0Q29sdW1uIiwiZmlsdGVyQ29sdW1uIiwicmVzaXplQ29sdW1uU3RhcnQiLCJyZXNpemVDb2x1bW5FbmQiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJyZXNvbHZlZFN0YXRlIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzdHlsZSIsImdldFByb3BzIiwiZ2V0VGFibGVQcm9wcyIsImdldFRoZWFkR3JvdXBQcm9wcyIsImdldFRoZWFkR3JvdXBUclByb3BzIiwiZ2V0VGhlYWRHcm91cFRoUHJvcHMiLCJnZXRUaGVhZFByb3BzIiwiZ2V0VGhlYWRUclByb3BzIiwiZ2V0VGhlYWRUaFByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJQcm9wcyIsImdldFRoZWFkRmlsdGVyVHJQcm9wcyIsImdldFRoZWFkRmlsdGVyVGhQcm9wcyIsImdldFRib2R5UHJvcHMiLCJnZXRUckdyb3VwUHJvcHMiLCJnZXRUclByb3BzIiwiZ2V0VGRQcm9wcyIsImdldFRmb290UHJvcHMiLCJnZXRUZm9vdFRyUHJvcHMiLCJnZXRUZm9vdFRkUHJvcHMiLCJnZXRQYWdpbmF0aW9uUHJvcHMiLCJnZXRMb2FkaW5nUHJvcHMiLCJnZXROb0RhdGFQcm9wcyIsImdldFJlc2l6ZXJQcm9wcyIsInNob3dQYWdpbmF0aW9uIiwic2hvd1BhZ2luYXRpb25Ub3AiLCJzaG93UGFnaW5hdGlvbkJvdHRvbSIsIm1hbnVhbCIsImxvYWRpbmdUZXh0Iiwibm9EYXRhVGV4dCIsInNvcnRhYmxlIiwibXVsdGlTb3J0IiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSIsInBpdm90SURLZXkiLCJwaXZvdFZhbEtleSIsInBpdm90QnkiLCJzdWJSb3dzS2V5IiwiYWdncmVnYXRlZEtleSIsIm9yaWdpbmFsS2V5IiwiaW5kZXhLZXkiLCJncm91cGVkQnlQaXZvdEtleSIsImxvYWRpbmciLCJwYWdlU2l6ZSIsInBhZ2UiLCJzb3J0ZWQiLCJmaWx0ZXJlZCIsInJlc2l6ZWQiLCJleHBhbmRlZCIsInBhZ2VzIiwib25FeHBhbmRlZENoYW5nZSIsIlRhYmxlQ29tcG9uZW50IiwiVGhlYWRDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiU3ViQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90Q29tcG9uZW50IiwiQWdncmVnYXRlZENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCIsInJlc29sdmVkRGF0YSIsImFsbFZpc2libGVDb2x1bW5zIiwiaGVhZGVyR3JvdXBzIiwiaGFzSGVhZGVyR3JvdXBzIiwic29ydGVkRGF0YSIsImN1cnJlbnRseVJlc2l6aW5nIiwiZmFrZVNjcm9sbExlZnQiLCJ0YWJsZVNjcm9sbExlZnQiLCJzdGFydFJvdyIsImVuZFJvdyIsInBhZ2VSb3dzIiwic2xpY2UiLCJtaW5Sb3dzIiwicGFkUm93cyIsInJhbmdlIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImhhc0NvbHVtbkZvb3RlciIsInNvbWUiLCJkIiwiRm9vdGVyIiwiaGFzRmlsdGVycyIsInJlY3Vyc2VSb3dzVmlld0luZGV4Iiwicm93cyIsInBhdGgiLCJpbmRleCIsIm1hcCIsInJvdyIsImkiLCJyb3dXaXRoVmlld0luZGV4IiwiX3ZpZXdJbmRleCIsIm5ld1BhdGgiLCJjb25jYXQiLCJnZXQiLCJjYW5QcmV2aW91cyIsImNhbk5leHQiLCJyb3dNaW5XaWR0aCIsInN1bSIsInJlc2l6ZWRDb2x1bW4iLCJmaW5kIiwieCIsImlkIiwiZ2V0Rmlyc3REZWZpbmVkIiwidmFsdWUiLCJ3aWR0aCIsIm1pbldpZHRoIiwicm93SW5kZXgiLCJmaW5hbFN0YXRlIiwicm9vdFByb3BzIiwic3BsaXRQcm9wcyIsInVuZGVmaW5lZCIsInRhYmxlUHJvcHMiLCJ0Qm9keVByb3BzIiwibG9hZGluZ1Byb3BzIiwibm9EYXRhUHJvcHMiLCJtYWtlSGVhZGVyR3JvdXAiLCJjb2x1bW4iLCJyZXNpemVkVmFsdWUiLCJjb2wiLCJmbGV4IiwiY29sdW1ucyIsIm1heFdpZHRoIiwidGhlYWRHcm91cFRoUHJvcHMiLCJjb2x1bW5IZWFkZXJQcm9wcyIsImdldEhlYWRlclByb3BzIiwiY2xhc3NlcyIsImhlYWRlckNsYXNzTmFtZSIsInN0eWxlcyIsImhlYWRlclN0eWxlIiwicmVzdCIsImZsZXhTdHlsZXMiLCJhc1B4Iiwibm9ybWFsaXplQ29tcG9uZW50IiwiSGVhZGVyIiwiZGF0YSIsIm1ha2VIZWFkZXJHcm91cHMiLCJ0aGVhZEdyb3VwUHJvcHMiLCJ0aGVhZEdyb3VwVHJQcm9wcyIsIm1ha2VIZWFkZXIiLCJyZXNpemVkQ29sIiwic29ydCIsInNob3ciLCJ0aGVhZFRoUHJvcHMiLCJpc1Jlc2l6YWJsZSIsInJlc2l6ZXIiLCJlIiwiaXNTb3J0YWJsZSIsImRlc2MiLCJpbmNsdWRlcyIsInNoaWZ0S2V5IiwibWFrZUhlYWRlcnMiLCJ0aGVhZFByb3BzIiwidGhlYWRUclByb3BzIiwibWFrZUZpbHRlciIsInRoZWFkRmlsdGVyVGhQcm9wcyIsImZpbHRlciIsIlJlc29sdmVkRmlsdGVyQ29tcG9uZW50IiwiRmlsdGVyIiwiaXNGaWx0ZXJhYmxlIiwib25DaGFuZ2UiLCJtYWtlRmlsdGVycyIsInRoZWFkRmlsdGVyUHJvcHMiLCJ0aGVhZEZpbHRlclRyUHJvcHMiLCJtYWtlUGFnZVJvdyIsInJvd0luZm8iLCJvcmlnaW5hbCIsInZpZXdJbmRleCIsImxldmVsIiwibmVzdGluZ1BhdGgiLCJhZ2dyZWdhdGVkIiwiZ3JvdXBlZEJ5UGl2b3QiLCJzdWJSb3dzIiwiaXNFeHBhbmRlZCIsInRyR3JvdXBQcm9wcyIsInRyUHJvcHMiLCJqb2luIiwiaTIiLCJ0ZFByb3BzIiwiY29sdW1uUHJvcHMiLCJjZWxsSW5mbyIsInBpdm90ZWQiLCJleHBhbmRlciIsInVzZU9uRXhwYW5kZXJDbGljayIsImlzQnJhbmNoIiwiaXNQcmV2aWV3Iiwib25FeHBhbmRlckNsaWNrIiwibmV3RXhwYW5kZWQiLCJjbG9uZSIsInNldCIsInNldFN0YXRlV2l0aERhdGEiLCJyZXNvbHZlZENlbGwiLCJDZWxsIiwiUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50IiwiQWdncmVnYXRlZCIsImFnZ3JlZ2F0ZSIsIlJlc29sdmVkRXhwYW5kZXJDb21wb25lbnQiLCJFeHBhbmRlciIsIlJlc29sdmVkUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90VmFsdWUiLCJEZWZhdWx0UmVzb2x2ZWRQaXZvdENvbXBvbmVudCIsIlJlc29sdmVkUGl2b3RDb21wb25lbnQiLCJQaXZvdCIsImV4cGFuZGFibGUiLCJpbmRleE9mIiwicmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2siLCJpbnRlcmFjdGlvblByb3BzIiwib25DbGljayIsIm1ha2VQYWRDb2x1bW4iLCJtYWtlUGFkUm93IiwibWFrZUNvbHVtbkZvb3RlciIsInRGb290VGRQcm9wcyIsImNvbHVtbkZvb3RlclByb3BzIiwiZ2V0Rm9vdGVyUHJvcHMiLCJtYWtlQ29sdW1uRm9vdGVycyIsInRGb290UHJvcHMiLCJ0Rm9vdFRyUHJvcHMiLCJtYWtlUGFnaW5hdGlvbiIsInBhZ2luYXRpb25Qcm9wcyIsImlzVG9wIiwic2Nyb2xsIiwidHlwZSIsImN1cnJlbnQiLCJzY3JvbGxMZWZ0IiwibWFrZVRhYmxlIiwib3ZlcmZsb3dYIiwib3ZlcmZsb3dZIiwicGFkZGluZ0JvdHRvbSIsImhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLFlBQXZCO0FBQ0E7QUFDQSxPQUFPQyxDQUFQLE1BQWMsU0FBZDtBQUNBLE9BQU9DLFNBQVAsTUFBc0IsYUFBdEI7QUFDQSxPQUFPQyxPQUFQLE1BQW9CLFdBQXBCO0FBQ0EsT0FBT0MsWUFBUCxNQUF5QixnQkFBekI7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCOztBQUVBLE9BQU8sSUFBTUMscUJBQXFCRixZQUEzQjs7SUFFY0csVTs7O0FBSW5CLHNCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsd0hBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLFFBQUwsR0FBZ0JYLE1BQU1ZLFNBQU4sRUFBaEI7QUFDQSxVQUFLQyxhQUFMLEdBQXFCYixNQUFNWSxTQUFOLEVBQXJCOztBQUVBLFVBQUtFLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCQyxJQUF0QixPQUF4QjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkQsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRSxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJGLElBQW5CLE9BQXJCO0FBQ0EsVUFBS0csYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CSCxJQUFuQixPQUFyQjtBQUNBLFVBQUtJLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkosSUFBcEIsT0FBdEI7QUFDQSxVQUFLSyxjQUFMLEdBQXNCLE1BQUtB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LGFBWEY7QUFzQkduSSw4QkFBa0J3SSxtQkFBbEIsR0FBd0M7QUF0QjNDLFdBbEJGO0FBMENHeE0sNEJBQWtCRSxvQkFBbEIsR0FDQztBQUFBO0FBQUEsY0FBSyxXQUFVLG1CQUFmO0FBQW9DeU0sMkJBQWUsS0FBZjtBQUFwQyxXQURELEdBRUcsSUE1Q047QUE2Q0csV0FBQ25KLFNBQVNPLE1BQVYsSUFDQztBQUFDLDJCQUFEO0FBQXFCc0MsdUJBQXJCO0FBQW1DM0osY0FBRTZLLGtCQUFGLENBQXFCbEgsVUFBckI7QUFBbkMsV0E5Q0o7QUFnREUsOEJBQUMsZ0JBQUQsYUFBa0IsU0FBU2EsT0FBM0IsRUFBb0MsYUFBYWQsV0FBakQsSUFBa0VnRyxZQUFsRTtBQWhERixTQURnQjtBQUFBLE9BQWxCOztBQXFEQTtBQUNBLGFBQU83SCxXQUFXQSxTQUFTdUgsVUFBVCxFQUFxQm9ILFNBQXJCLEVBQWdDLElBQWhDLENBQVgsR0FBbURBLFdBQTFEO0FBQ0Q7Ozs7RUExMkJxQ3RRLFFBQVFELFVBQVVILFNBQVYsQ0FBUixDOztBQUFuQlEsVSxDQUNaRixTLEdBQVlBLFM7QUFEQUUsVSxDQUVaSCxZLEdBQWVBLFk7ZUFGSEcsVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcclxuLy9cclxuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IExpZmVjeWNsZSBmcm9tICcuL2xpZmVjeWNsZSdcclxuaW1wb3J0IE1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJ1xyXG5pbXBvcnQgZGVmYXVsdFByb3BzIGZyb20gJy4vZGVmYXVsdFByb3BzJ1xyXG5pbXBvcnQgcHJvcFR5cGVzIGZyb20gJy4vcHJvcFR5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFJlYWN0VGFibGVEZWZhdWx0cyA9IGRlZmF1bHRQcm9wc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3RUYWJsZSBleHRlbmRzIE1ldGhvZHMoTGlmZWN5Y2xlKENvbXBvbmVudCkpIHtcclxuICBzdGF0aWMgcHJvcFR5cGVzID0gcHJvcFR5cGVzXHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wc1xyXG5cclxuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKVxyXG5cclxuICAgIHRoaXMudGFibGVSZWYgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuICAgIHRoaXMuZmFrZVNjcm9sbFJlZiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG5cclxuICAgIHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldERhdGFNb2RlbCA9IHRoaXMuZ2V0RGF0YU1vZGVsLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0U29ydGVkRGF0YSA9IHRoaXMuZ2V0U29ydGVkRGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmZpcmVGZXRjaERhdGEgPSB0aGlzLmZpcmVGZXRjaERhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXRQcm9wT3JTdGF0ZSA9IHRoaXMuZ2V0UHJvcE9yU3RhdGUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXRTdGF0ZU9yUHJvcCA9IHRoaXMuZ2V0U3RhdGVPclByb3AuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maWx0ZXJEYXRhID0gdGhpcy5maWx0ZXJEYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuc29ydERhdGEgPSB0aGlzLnNvcnREYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0TWluUm93cyA9IHRoaXMuZ2V0TWluUm93cy5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLm9uUGFnZUNoYW5nZSA9IHRoaXMub25QYWdlQ2hhbmdlLmJpbmQodGhpcylcclxuICAgIHRoaXMub25QYWdlU2l6ZUNoYW5nZSA9IHRoaXMub25QYWdlU2l6ZUNoYW5nZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnNvcnRDb2x1bW4gPSB0aGlzLnNvcnRDb2x1bW4uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maWx0ZXJDb2x1bW4gPSB0aGlzLmZpbHRlckNvbHVtbi5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0ID0gdGhpcy5yZXNpemVDb2x1bW5TdGFydC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbkVuZCA9IHRoaXMucmVzaXplQ29sdW1uRW5kLmJpbmQodGhpcylcclxuICAgIHRoaXMucmVzaXplQ29sdW1uTW92aW5nID0gdGhpcy5yZXNpemVDb2x1bW5Nb3ZpbmcuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGNvbnN0IHJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG4gICAgY29uc3Qge1xyXG4gICAgICBjaGlsZHJlbixcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgZ2V0UHJvcHMsXHJcbiAgICAgIGdldFRhYmxlUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRHcm91cFRyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBUaFByb3BzLFxyXG4gICAgICBnZXRUaGVhZFByb3BzLFxyXG4gICAgICBnZXRUaGVhZFRyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkVGhQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZEZpbHRlclRoUHJvcHMsXHJcbiAgICAgIGdldFRib2R5UHJvcHMsXHJcbiAgICAgIGdldFRyR3JvdXBQcm9wcyxcclxuICAgICAgZ2V0VHJQcm9wcyxcclxuICAgICAgZ2V0VGRQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RUclByb3BzLFxyXG4gICAgICBnZXRUZm9vdFRkUHJvcHMsXHJcbiAgICAgIGdldFBhZ2luYXRpb25Qcm9wcyxcclxuICAgICAgZ2V0TG9hZGluZ1Byb3BzLFxyXG4gICAgICBnZXROb0RhdGFQcm9wcyxcclxuICAgICAgZ2V0UmVzaXplclByb3BzLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbixcclxuICAgICAgc2hvd1BhZ2luYXRpb25Ub3AsXHJcbiAgICAgIHNob3dQYWdpbmF0aW9uQm90dG9tLFxyXG4gICAgICBtYW51YWwsXHJcbiAgICAgIGxvYWRpbmdUZXh0LFxyXG4gICAgICBub0RhdGFUZXh0LFxyXG4gICAgICBzb3J0YWJsZSxcclxuICAgICAgbXVsdGlTb3J0LFxyXG4gICAgICByZXNpemFibGUsXHJcbiAgICAgIGZpbHRlcmFibGUsXHJcbiAgICAgIC8vIFBpdm90aW5nIFN0YXRlXHJcbiAgICAgIHBpdm90SURLZXksXHJcbiAgICAgIHBpdm90VmFsS2V5LFxyXG4gICAgICBwaXZvdEJ5LFxyXG4gICAgICBzdWJSb3dzS2V5LFxyXG4gICAgICBhZ2dyZWdhdGVkS2V5LFxyXG4gICAgICBvcmlnaW5hbEtleSxcclxuICAgICAgaW5kZXhLZXksXHJcbiAgICAgIGdyb3VwZWRCeVBpdm90S2V5LFxyXG4gICAgICAvLyBTdGF0ZVxyXG4gICAgICBsb2FkaW5nLFxyXG4gICAgICBwYWdlU2l6ZSxcclxuICAgICAgcGFnZSxcclxuICAgICAgc29ydGVkLFxyXG4gICAgICBmaWx0ZXJlZCxcclxuICAgICAgcmVzaXplZCxcclxuICAgICAgZXhwYW5kZWQsXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlLFxyXG4gICAgICAvLyBDb21wb25lbnRzXHJcbiAgICAgIFRhYmxlQ29tcG9uZW50LFxyXG4gICAgICBUaGVhZENvbXBvbmVudCxcclxuICAgICAgVGJvZHlDb21wb25lbnQsXHJcbiAgICAgIFRyR3JvdXBDb21wb25lbnQsXHJcbiAgICAgIFRyQ29tcG9uZW50LFxyXG4gICAgICBUaENvbXBvbmVudCxcclxuICAgICAgVGRDb21wb25lbnQsXHJcbiAgICAgIFRmb290Q29tcG9uZW50LFxyXG4gICAgICBQYWdpbmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICBMb2FkaW5nQ29tcG9uZW50LFxyXG4gICAgICBTdWJDb21wb25lbnQsXHJcbiAgICAgIE5vRGF0YUNvbXBvbmVudCxcclxuICAgICAgUmVzaXplckNvbXBvbmVudCxcclxuICAgICAgRXhwYW5kZXJDb21wb25lbnQsXHJcbiAgICAgIFBpdm90VmFsdWVDb21wb25lbnQsXHJcbiAgICAgIFBpdm90Q29tcG9uZW50LFxyXG4gICAgICBBZ2dyZWdhdGVkQ29tcG9uZW50LFxyXG4gICAgICBGaWx0ZXJDb21wb25lbnQsXHJcbiAgICAgIFBhZFJvd0NvbXBvbmVudCxcclxuICAgICAgLy8gRGF0YSBtb2RlbFxyXG4gICAgICByZXNvbHZlZERhdGEsXHJcbiAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxyXG4gICAgICBoZWFkZXJHcm91cHMsXHJcbiAgICAgIGhhc0hlYWRlckdyb3VwcyxcclxuICAgICAgLy8gU29ydGVkIERhdGFcclxuICAgICAgc29ydGVkRGF0YSxcclxuICAgICAgY3VycmVudGx5UmVzaXppbmcsXHJcbiAgICB9ID0gcmVzb2x2ZWRTdGF0ZVxyXG5cclxuICAgIGxldCBmYWtlU2Nyb2xsTGVmdCA9IDA7XHJcbiAgICBsZXQgdGFibGVTY3JvbGxMZWZ0ID0gMDtcclxuXHJcbiAgICAvLyBQYWdpbmF0aW9uXHJcbiAgICBjb25zdCBzdGFydFJvdyA9IHBhZ2VTaXplICogcGFnZVxyXG4gICAgY29uc3QgZW5kUm93ID0gc3RhcnRSb3cgKyBwYWdlU2l6ZVxyXG4gICAgbGV0IHBhZ2VSb3dzID0gbWFudWFsID8gcmVzb2x2ZWREYXRhIDogc29ydGVkRGF0YS5zbGljZShzdGFydFJvdywgZW5kUm93KVxyXG4gICAgY29uc3QgbWluUm93cyA9IHRoaXMuZ2V0TWluUm93cygpXHJcbiAgICBjb25zdCBwYWRSb3dzID0gXy5yYW5nZShNYXRoLm1heChtaW5Sb3dzIC0gcGFnZVJvd3MubGVuZ3RoLCAwKSlcclxuXHJcbiAgICBjb25zdCBoYXNDb2x1bW5Gb290ZXIgPSBhbGxWaXNpYmxlQ29sdW1ucy5zb21lKGQgPT4gZC5Gb290ZXIpXHJcbiAgICBjb25zdCBoYXNGaWx0ZXJzID0gZmlsdGVyYWJsZSB8fCBhbGxWaXNpYmxlQ29sdW1ucy5zb21lKGQgPT4gZC5maWx0ZXJhYmxlKVxyXG5cclxuICAgIGNvbnN0IHJlY3Vyc2VSb3dzVmlld0luZGV4ID0gKHJvd3MsIHBhdGggPSBbXSwgaW5kZXggPSAtMSkgPT4gW1xyXG4gICAgICByb3dzLm1hcCgocm93LCBpKSA9PiB7XHJcbiAgICAgICAgaW5kZXggKz0gMVxyXG4gICAgICAgIGNvbnN0IHJvd1dpdGhWaWV3SW5kZXggPSB7XHJcbiAgICAgICAgICAuLi5yb3csXHJcbiAgICAgICAgICBfdmlld0luZGV4OiBpbmRleCxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGguY29uY2F0KFtpXSlcclxuICAgICAgICBpZiAocm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSAmJiBfLmdldChleHBhbmRlZCwgbmV3UGF0aCkpIHtcclxuICAgICAgICAgIFtyb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldLCBpbmRleF0gPSByZWN1cnNlUm93c1ZpZXdJbmRleChcclxuICAgICAgICAgICAgcm93V2l0aFZpZXdJbmRleFtzdWJSb3dzS2V5XSxcclxuICAgICAgICAgICAgbmV3UGF0aCxcclxuICAgICAgICAgICAgaW5kZXhcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd1dpdGhWaWV3SW5kZXhcclxuICAgICAgfSksXHJcbiAgICAgIGluZGV4LFxyXG4gICAgXTtcclxuICAgIFtwYWdlUm93c10gPSByZWN1cnNlUm93c1ZpZXdJbmRleChwYWdlUm93cylcclxuXHJcbiAgICBjb25zdCBjYW5QcmV2aW91cyA9IHBhZ2UgPiAwXHJcbiAgICBjb25zdCBjYW5OZXh0ID0gcGFnZSArIDEgPCBwYWdlc1xyXG5cclxuICAgIGNvbnN0IHJvd01pbldpZHRoID0gXy5zdW0oXHJcbiAgICAgIGFsbFZpc2libGVDb2x1bW5zLm1hcChkID0+IHtcclxuICAgICAgICBjb25zdCByZXNpemVkQ29sdW1uID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gZC5pZCkgfHwge31cclxuICAgICAgICByZXR1cm4gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbHVtbi52YWx1ZSwgZC53aWR0aCwgZC5taW5XaWR0aClcclxuICAgICAgfSlcclxuICAgIClcclxuXHJcbiAgICBsZXQgcm93SW5kZXggPSAtMVxyXG5cclxuICAgIGNvbnN0IGZpbmFsU3RhdGUgPSB7XHJcbiAgICAgIC4uLnJlc29sdmVkU3RhdGUsXHJcbiAgICAgIHN0YXJ0Um93LFxyXG4gICAgICBlbmRSb3csXHJcbiAgICAgIHBhZ2VSb3dzLFxyXG4gICAgICBtaW5Sb3dzLFxyXG4gICAgICBwYWRSb3dzLFxyXG4gICAgICBoYXNDb2x1bW5Gb290ZXIsXHJcbiAgICAgIGNhblByZXZpb3VzLFxyXG4gICAgICBjYW5OZXh0LFxyXG4gICAgICByb3dNaW5XaWR0aCxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByb290UHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0UHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgY29uc3QgdGFibGVQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUYWJsZVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgIGNvbnN0IHRCb2R5UHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGJvZHlQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICBjb25zdCBsb2FkaW5nUHJvcHMgPSBnZXRMb2FkaW5nUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICBjb25zdCBub0RhdGFQcm9wcyA9IGdldE5vRGF0YVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG5cclxuICAgIC8vIFZpc3VhbCBDb21wb25lbnRzXHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlckdyb3VwID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkVmFsdWUgPSBjb2wgPT4gKHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbC5pZCkgfHwge30pLnZhbHVlXHJcbiAgICAgIGNvbnN0IGZsZXggPSBfLnN1bShcclxuICAgICAgICBjb2x1bW4uY29sdW1ucy5tYXAoY29sID0+IChjb2wud2lkdGggfHwgcmVzaXplZFZhbHVlKGNvbCkgPyAwIDogY29sLm1pbldpZHRoKSlcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uc3VtKFxyXG4gICAgICAgIGNvbHVtbi5jb2x1bW5zLm1hcChjb2wgPT4gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZFZhbHVlKGNvbCksIGNvbC53aWR0aCwgY29sLm1pbldpZHRoKSlcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uc3VtKFxyXG4gICAgICAgIGNvbHVtbi5jb2x1bW5zLm1hcChjb2wgPT4gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZFZhbHVlKGNvbCksIGNvbC53aWR0aCwgY29sLm1heFdpZHRoKSlcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdGhlYWRHcm91cFRoUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRHcm91cFRoUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgY29sdW1uSGVhZGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEhlYWRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAgIGNvbHVtbi5oZWFkZXJDbGFzc05hbWUsXHJcbiAgICAgICAgdGhlYWRHcm91cFRoUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbkhlYWRlclByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLmNvbHVtbi5oZWFkZXJTdHlsZSxcclxuICAgICAgICAuLi50aGVhZEdyb3VwVGhQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdCA9IHtcclxuICAgICAgICAuLi50aGVhZEdyb3VwVGhQcm9wcy5yZXN0LFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnJlc3QsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGZsZXhTdHlsZXMgPSB7XHJcbiAgICAgICAgZmxleDogYCR7ZmxleH0gMCBhdXRvYCxcclxuICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgLi4uZmxleFN0eWxlcyxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkhlYWRlciwge1xyXG4gICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxyXG4gICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICA8L1RoQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlckdyb3VwcyA9ICgpID0+IHtcclxuICAgICAgY29uc3QgdGhlYWRHcm91cFByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkR3JvdXBQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0aGVhZEdyb3VwVHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEdyb3VwVHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaGVhZENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctaGVhZGVyR3JvdXBzJywgdGhlYWRHcm91cFByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50aGVhZEdyb3VwUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRoZWFkR3JvdXBQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkR3JvdXBUclByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgICAgc3R5bGU9e3RoZWFkR3JvdXBUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udGhlYWRHcm91cFRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2hlYWRlckdyb3Vwcy5tYXAobWFrZUhlYWRlckdyb3VwKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXIgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHNvcnQgPSBzb3J0ZWQuZmluZChkID0+IGQuaWQgPT09IGNvbHVtbi5pZClcclxuICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0aGVhZFRoUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGhlYWRUaFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uSGVhZGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEhlYWRlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW2NvbHVtbi5oZWFkZXJDbGFzc05hbWUsIHRoZWFkVGhQcm9wcy5jbGFzc05hbWUsIGNvbHVtbkhlYWRlclByb3BzLmNsYXNzTmFtZV1cclxuXHJcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgICAuLi5jb2x1bW4uaGVhZGVyU3R5bGUsXHJcbiAgICAgICAgLi4udGhlYWRUaFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXN0ID0ge1xyXG4gICAgICAgIC4uLnRoZWFkVGhQcm9wcy5yZXN0LFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnJlc3QsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGlzUmVzaXphYmxlID0gXy5nZXRGaXJzdERlZmluZWQoY29sdW1uLnJlc2l6YWJsZSwgcmVzaXphYmxlLCBmYWxzZSlcclxuICAgICAgY29uc3QgcmVzaXplciA9IGlzUmVzaXphYmxlID8gKFxyXG4gICAgICAgIDxSZXNpemVyQ29tcG9uZW50XHJcbiAgICAgICAgICBvbk1vdXNlRG93bj17ZSA9PiB0aGlzLnJlc2l6ZUNvbHVtblN0YXJ0KGUsIGNvbHVtbiwgZmFsc2UpfVxyXG4gICAgICAgICAgb25Ub3VjaFN0YXJ0PXtlID0+IHRoaXMucmVzaXplQ29sdW1uU3RhcnQoZSwgY29sdW1uLCB0cnVlKX1cclxuICAgICAgICAgIHsuLi5nZXRSZXNpemVyUHJvcHMoJ2ZpbmFsU3RhdGUnLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgKSA6IG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGlzU29ydGFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4uc29ydGFibGUsIHNvcnRhYmxlLCBmYWxzZSlcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXHJcbiAgICAgICAgICAgIGNsYXNzZXMsXHJcbiAgICAgICAgICAgIGlzUmVzaXphYmxlICYmICdydC1yZXNpemFibGUtaGVhZGVyJyxcclxuICAgICAgICAgICAgc29ydCA/IChzb3J0LmRlc2MgPyAnLXNvcnQtZGVzYycgOiAnLXNvcnQtYXNjJykgOiAnJyxcclxuICAgICAgICAgICAgaXNTb3J0YWJsZSAmJiAnLWN1cnNvci1wb2ludGVyJyxcclxuICAgICAgICAgICAgIXNob3cgJiYgJy1oaWRkZW4nLFxyXG4gICAgICAgICAgICBwaXZvdEJ5ICYmIHBpdm90Qnkuc2xpY2UoMCwgLTEpLmluY2x1ZGVzKGNvbHVtbi5pZCkgJiYgJ3J0LWhlYWRlci1waXZvdCdcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgdG9nZ2xlU29ydD17ZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc1NvcnRhYmxlKSB0aGlzLnNvcnRDb2x1bW4oY29sdW1uLCBtdWx0aVNvcnQgPyBlLnNoaWZ0S2V5IDogZmFsc2UpXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoaXNSZXNpemFibGUgJiYgJ3J0LXJlc2l6YWJsZS1oZWFkZXItY29udGVudCcpfT5cclxuICAgICAgICAgICAge18ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5IZWFkZXIsIHtcclxuICAgICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxyXG4gICAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIHtyZXNpemVyfVxyXG4gICAgICAgIDwvVGhDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVycyA9ICgpID0+IHtcclxuICAgICAgY29uc3QgdGhlYWRQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgY29uc3QgdGhlYWRUclByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkVHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1oZWFkZXInLCB0aGVhZFByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi50aGVhZFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogYCR7cm93TWluV2lkdGh9cHhgLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi50aGVhZFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRUclByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgICAgc3R5bGU9e3RoZWFkVHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRoZWFkVHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7YWxsVmlzaWJsZUNvbHVtbnMubWFwKG1ha2VIZWFkZXIpfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUZpbHRlciA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgY29uc3QgdGhlYWRGaWx0ZXJUaFByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkRmlsdGVyVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXHJcbiAgICAgICAgY29sdW1uLmhlYWRlckNsYXNzTmFtZSxcclxuICAgICAgICB0aGVhZEZpbHRlclRoUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICAgIGNvbHVtbkhlYWRlclByb3BzLmNsYXNzTmFtZSxcclxuICAgICAgXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLmNvbHVtbi5oZWFkZXJTdHlsZSxcclxuICAgICAgICAuLi50aGVhZEZpbHRlclRoUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3QgPSB7XHJcbiAgICAgICAgLi4udGhlYWRGaWx0ZXJUaFByb3BzLnJlc3QsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZmlsdGVyID0gZmlsdGVyZWQuZmluZChmaWx0ZXIgPT4gZmlsdGVyLmlkID09PSBjb2x1bW4uaWQpXHJcblxyXG4gICAgICBjb25zdCBSZXNvbHZlZEZpbHRlckNvbXBvbmVudCA9IGNvbHVtbi5GaWx0ZXIgfHwgRmlsdGVyQ29tcG9uZW50XHJcblxyXG4gICAgICBjb25zdCBpc0ZpbHRlcmFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4uZmlsdGVyYWJsZSwgZmlsdGVyYWJsZSwgZmFsc2UpXHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHt3aWR0aH0gMCBhdXRvYCxcclxuICAgICAgICAgICAgd2lkdGg6IF8uYXNQeCh3aWR0aCksXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtpc0ZpbHRlcmFibGVcclxuICAgICAgICAgICAgPyBfLm5vcm1hbGl6ZUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgIFJlc29sdmVkRmlsdGVyQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICAgICAgICAgIGZpbHRlcixcclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U6IHZhbHVlID0+IHRoaXMuZmlsdGVyQ29sdW1uKGNvbHVtbiwgdmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRQcm9wcy5jb2x1bW4uRmlsdGVyXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgPC9UaENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VGaWx0ZXJzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkRmlsdGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdGhlYWRGaWx0ZXJUclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkRmlsdGVyVHJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaGVhZENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCctZmlsdGVycycsIHRoZWFkRmlsdGVyUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRoZWFkRmlsdGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRoZWFkRmlsdGVyUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVhZEZpbHRlclRyUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgICBzdHlsZT17dGhlYWRGaWx0ZXJUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udGhlYWRGaWx0ZXJUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUZpbHRlcil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFnZVJvdyA9IChyb3csIGksIHBhdGggPSBbXSkgPT4ge1xyXG4gICAgICBjb25zdCByb3dJbmZvID0ge1xyXG4gICAgICAgIG9yaWdpbmFsOiByb3dbb3JpZ2luYWxLZXldLFxyXG4gICAgICAgIHJvdyxcclxuICAgICAgICBpbmRleDogcm93W2luZGV4S2V5XSxcclxuICAgICAgICB2aWV3SW5kZXg6IChyb3dJbmRleCArPSAxKSxcclxuICAgICAgICBwYWdlU2l6ZSxcclxuICAgICAgICBwYWdlLFxyXG4gICAgICAgIGxldmVsOiBwYXRoLmxlbmd0aCxcclxuICAgICAgICBuZXN0aW5nUGF0aDogcGF0aC5jb25jYXQoW2ldKSxcclxuICAgICAgICBhZ2dyZWdhdGVkOiByb3dbYWdncmVnYXRlZEtleV0sXHJcbiAgICAgICAgZ3JvdXBlZEJ5UGl2b3Q6IHJvd1tncm91cGVkQnlQaXZvdEtleV0sXHJcbiAgICAgICAgc3ViUm93czogcm93W3N1YlJvd3NLZXldLFxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSBfLmdldChleHBhbmRlZCwgcm93SW5mby5uZXN0aW5nUGF0aClcclxuICAgICAgY29uc3QgdHJHcm91cFByb3BzID0gZ2V0VHJHcm91cFByb3BzKGZpbmFsU3RhdGUsIHJvd0luZm8sIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgY29uc3QgdHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUclByb3BzKGZpbmFsU3RhdGUsIHJvd0luZm8sIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRyR3JvdXBDb21wb25lbnQga2V5PXtyb3dJbmZvLm5lc3RpbmdQYXRoLmpvaW4oJ18nKX0gey4uLnRyR3JvdXBQcm9wc30+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRyUHJvcHMuY2xhc3NOYW1lLCByb3cuX3ZpZXdJbmRleCAlIDIgPyAnLWV2ZW4nIDogJy1vZGQnKX1cclxuICAgICAgICAgICAgc3R5bGU9e3RyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50clByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAoKGNvbHVtbiwgaTIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICAgICAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgICAgICAgICAgY29uc3QgdGRQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZFByb3BzKGZpbmFsU3RhdGUsIHJvd0luZm8sIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgICAgICAgICAgY29uc3QgY29sdW1uUHJvcHMgPSBfLnNwbGl0UHJvcHMoY29sdW1uLmdldFByb3BzKGZpbmFsU3RhdGUsIHJvd0luZm8sIGNvbHVtbiwgdGhpcykpXHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBbdGRQcm9wcy5jbGFzc05hbWUsIGNvbHVtbi5jbGFzc05hbWUsIGNvbHVtblByb3BzLmNsYXNzTmFtZV1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgICAgICAgICAgLi4udGRQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgICAgIC4uLmNvbHVtbi5zdHlsZSxcclxuICAgICAgICAgICAgICAgIC4uLmNvbHVtblByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgY2VsbEluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICAuLi5yb3dJbmZvLFxyXG4gICAgICAgICAgICAgICAgaXNFeHBhbmRlZCxcclxuICAgICAgICAgICAgICAgIGNvbHVtbjogeyAuLi5jb2x1bW4gfSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiByb3dJbmZvLnJvd1tjb2x1bW4uaWRdLFxyXG4gICAgICAgICAgICAgICAgcGl2b3RlZDogY29sdW1uLnBpdm90ZWQsXHJcbiAgICAgICAgICAgICAgICBleHBhbmRlcjogY29sdW1uLmV4cGFuZGVyLFxyXG4gICAgICAgICAgICAgICAgcmVzaXplZCxcclxuICAgICAgICAgICAgICAgIHNob3csXHJcbiAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGRQcm9wcyxcclxuICAgICAgICAgICAgICAgIGNvbHVtblByb3BzLFxyXG4gICAgICAgICAgICAgICAgY2xhc3NlcyxcclxuICAgICAgICAgICAgICAgIHN0eWxlcyxcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY2VsbEluZm8udmFsdWVcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHVzZU9uRXhwYW5kZXJDbGlja1xyXG4gICAgICAgICAgICAgIGxldCBpc0JyYW5jaFxyXG4gICAgICAgICAgICAgIGxldCBpc1ByZXZpZXdcclxuXHJcbiAgICAgICAgICAgICAgY29uc3Qgb25FeHBhbmRlckNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3RXhwYW5kZWQgPSBfLmNsb25lKGV4cGFuZGVkKVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgbmV3RXhwYW5kZWQgPSBfLnNldChuZXdFeHBhbmRlZCwgY2VsbEluZm8ubmVzdGluZ1BhdGgsIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbmV3RXhwYW5kZWQgPSBfLnNldChuZXdFeHBhbmRlZCwgY2VsbEluZm8ubmVzdGluZ1BhdGgsIHt9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlV2l0aERhdGEoXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZDogbmV3RXhwYW5kZWQsXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgb25FeHBhbmRlZENoYW5nZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIG9uRXhwYW5kZWRDaGFuZ2UobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCBlLCBjZWxsSW5mbylcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gYSBzdGFuZGFyZCBjZWxsXHJcbiAgICAgICAgICAgICAgbGV0IHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5DZWxsLCBjZWxsSW5mbywgdmFsdWUpXHJcblxyXG4gICAgICAgICAgICAgIC8vIFJlc29sdmUgUmVuZGVyZXJzXHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50ID1cclxuICAgICAgICAgICAgICAgIGNvbHVtbi5BZ2dyZWdhdGVkIHx8ICghY29sdW1uLmFnZ3JlZ2F0ZSA/IEFnZ3JlZ2F0ZWRDb21wb25lbnQgOiBjb2x1bW4uQ2VsbClcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50ID0gY29sdW1uLkV4cGFuZGVyIHx8IEV4cGFuZGVyQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50ID0gY29sdW1uLlBpdm90VmFsdWUgfHwgUGl2b3RWYWx1ZUNvbXBvbmVudFxyXG4gICAgICAgICAgICAgIGNvbnN0IERlZmF1bHRSZXNvbHZlZFBpdm90Q29tcG9uZW50ID1cclxuICAgICAgICAgICAgICAgIFBpdm90Q29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAgICAocHJvcHMgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50IHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50IHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkUGl2b3RDb21wb25lbnQgPSBjb2x1bW4uUGl2b3QgfHwgRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnRcclxuXHJcbiAgICAgICAgICAgICAgLy8gSXMgdGhpcyBjZWxsIGV4cGFuZGFibGU/XHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgfHwgY2VsbEluZm8uZXhwYW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgaXQgZXhwYW5kYWJsZSBieSBkZWZ1YWx0XHJcbiAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgdXNlT25FeHBhbmRlckNsaWNrID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgcGl2b3RlZCwgaGFzIG5vIHN1YlJvd3MsIGFuZCBkb2VzIG5vdCBoYXZlIGEgc3ViQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG1ha2UgZXhwYW5kYWJsZVxyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgJiYgIWNlbGxJbmZvLnN1YlJvd3MgJiYgIVN1YkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIGNvbHVtbiBhIGJyYW5jaD9cclxuICAgICAgICAgICAgICAgIGlzQnJhbmNoID0gcm93SW5mby5yb3dbcGl2b3RJREtleV0gPT09IGNvbHVtbi5pZCAmJiBjZWxsSW5mby5zdWJSb3dzXHJcbiAgICAgICAgICAgICAgICAvLyBTaG91bGQgdGhpcyBjb2x1bW4gYmUgYmxhbms/XHJcbiAgICAgICAgICAgICAgICBpc1ByZXZpZXcgPVxyXG4gICAgICAgICAgICAgICAgICBwaXZvdEJ5LmluZGV4T2YoY29sdW1uLmlkKSA+IHBpdm90QnkuaW5kZXhPZihyb3dJbmZvLnJvd1twaXZvdElES2V5XSkgJiZcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8uc3ViUm93c1xyXG4gICAgICAgICAgICAgICAgLy8gUGl2b3QgQ2VsbCBSZW5kZXIgT3ZlcnJpZGVcclxuICAgICAgICAgICAgICAgIGlmIChpc0JyYW5jaCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBpc1Bpdm90XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIFJlc29sdmVkUGl2b3RDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY2VsbEluZm8sXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcm93W3Bpdm90VmFsS2V5XSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd1twaXZvdFZhbEtleV1cclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1ByZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gU2hvdyB0aGUgcGl2b3QgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQsIGNlbGxJbmZvLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNlbGxJbmZvLmFnZ3JlZ2F0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCwgY2VsbEluZm8sIHZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLmV4cGFuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgICAgUmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8sXHJcbiAgICAgICAgICAgICAgICAgIHJvd1twaXZvdFZhbEtleV1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIGlmIChwaXZvdEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChjZWxsSW5mby5ncm91cGVkQnlQaXZvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZiAoIWNlbGxJbmZvLnN1YlJvd3MgJiYgIVN1YkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2sgPSB1c2VPbkV4cGFuZGVyQ2xpY2sgPyBvbkV4cGFuZGVyQ2xpY2sgOiAoKSA9PiB7fVxyXG5cclxuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgb25DbGljayBldmVudHMsIG1ha2Ugc3VyZSB0aGV5IGRvbid0XHJcbiAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgZWFjaG90aGVyLiBUaGlzIHNob3VsZCBtYXliZSBiZSBleHBhbmRlZCB0byBoYW5kbGUgYWxsXHJcbiAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayxcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICh0ZFByb3BzLnJlc3Qub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Qcm9wcy5vbkNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRkUHJvcHMucmVzdC5vbkNsaWNrKGUsICgpID0+IHJlc29sdmVkT25FeHBhbmRlckNsaWNrKGUpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNvbHVtblByb3BzLnJlc3Qub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Qcm9wcy5vbkNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbHVtblByb3BzLnJlc3Qub25DbGljayhlLCAoKSA9PiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayhlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgY2VsbFxyXG4gICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8VGRDb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICAgICAgICAgICAgICBrZXk9e2Ake2kyfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyxcclxuICAgICAgICAgICAgICAgICAgICAhY2VsbEluZm8uZXhwYW5kYWJsZSAmJiAhc2hvdyAmJiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlICYmICdydC1leHBhbmRhYmxlJyxcclxuICAgICAgICAgICAgICAgICAgICAoaXNCcmFuY2ggfHwgaXNQcmV2aWV3KSAmJiAncnQtcGl2b3QnXHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICB7Li4udGRQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgICAgICAgICB7Li4uY29sdW1uUHJvcHMucmVzdH1cclxuICAgICAgICAgICAgICAgICAgey4uLmludGVyYWN0aW9uUHJvcHN9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtyZXNvbHZlZENlbGx9XHJcbiAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgICAge3Jvd0luZm8uc3ViUm93cyAmJlxyXG4gICAgICAgICAgICBpc0V4cGFuZGVkICYmXHJcbiAgICAgICAgICAgIHJvd0luZm8uc3ViUm93cy5tYXAoKGQsIGkpID0+IG1ha2VQYWdlUm93KGQsIGksIHJvd0luZm8ubmVzdGluZ1BhdGgpKX1cclxuICAgICAgICAgIHtTdWJDb21wb25lbnQgJiZcclxuICAgICAgICAgICAgIXJvd0luZm8uc3ViUm93cyAmJlxyXG4gICAgICAgICAgICBpc0V4cGFuZGVkICYmXHJcbiAgICAgICAgICAgIFN1YkNvbXBvbmVudChyb3dJbmZvLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbmV3RXhwYW5kZWQgPSBfLmNsb25lKGV4cGFuZGVkKVxyXG5cclxuICAgICAgICAgICAgICBfLnNldChuZXdFeHBhbmRlZCwgcm93SW5mby5uZXN0aW5nUGF0aCwgZmFsc2UpXHJcbiAgICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvVHJHcm91cENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWRDb2x1bW4gPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgZmxleCA9IHdpZHRoXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4udGRQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NlcywgIXNob3cgJiYgJ2hpZGRlbicpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHtmbGV4fSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRkUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoUGFkUm93Q29tcG9uZW50KX1cclxuICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZFJvdyA9IChyb3csIGkpID0+IHtcclxuICAgICAgY29uc3QgdHJHcm91cFByb3BzID0gZ2V0VHJHcm91cFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICBjb25zdCB0clByb3BzID0gXy5zcGxpdFByb3BzKGdldFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUckdyb3VwQ29tcG9uZW50IGtleT17YHBhZC0ke2l9YH0gey4uLnRyR3JvdXBQcm9wc30+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICAgICctcGFkUm93JyxcclxuICAgICAgICAgICAgICAocGFnZVJvd3MubGVuZ3RoICsgaSkgJSAyID8gJy1ldmVuJyA6ICctb2RkJyxcclxuICAgICAgICAgICAgICB0clByb3BzLmNsYXNzTmFtZVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZSB8fCB7fX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlUGFkQ29sdW1uKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9Uckdyb3VwQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUNvbHVtbkZvb3RlciA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0Rm9vdFRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RUZFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uUHJvcHMgPSBfLnNwbGl0UHJvcHMoY29sdW1uLmdldFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uRm9vdGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEZvb3RlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAgIHRGb290VGRQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5Qcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uRm9vdGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4udEZvb3RUZFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbi5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5Gb290ZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGRDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzLCAhc2hvdyAmJiAnaGlkZGVuJyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLmNvbHVtblByb3BzLnJlc3R9XHJcbiAgICAgICAgICB7Li4udEZvb3RUZFByb3BzLnJlc3R9XHJcbiAgICAgICAgICB7Li4uY29sdW1uRm9vdGVyUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkZvb3Rlciwge1xyXG4gICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxyXG4gICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUNvbHVtbkZvb3RlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRGb290UHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIGNvbnN0IHRGb290VHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUZm9vdENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXt0Rm9vdFByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRGb290UHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRGb290UHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRGb290VHJQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgICBzdHlsZT17dEZvb3RUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udEZvb3RUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUNvbHVtbkZvb3Rlcil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGZvb3RDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFnaW5hdGlvbiA9IGlzVG9wID0+IHtcclxuICAgICAgY29uc3QgcGFnaW5hdGlvblByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFBhZ2luYXRpb25Qcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQYWdpbmF0aW9uQ29tcG9uZW50XHJcbiAgICAgICAgICB7Li4ucmVzb2x2ZWRTdGF0ZX1cclxuICAgICAgICAgIHBhZ2VzPXtwYWdlc31cclxuICAgICAgICAgIGNhblByZXZpb3VzPXtjYW5QcmV2aW91c31cclxuICAgICAgICAgIGNhbk5leHQ9e2Nhbk5leHR9XHJcbiAgICAgICAgICBvblBhZ2VDaGFuZ2U9e3RoaXMub25QYWdlQ2hhbmdlfVxyXG4gICAgICAgICAgb25QYWdlU2l6ZUNoYW5nZT17dGhpcy5vblBhZ2VTaXplQ2hhbmdlfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtwYWdpbmF0aW9uUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgc3R5bGU9e3BhZ2luYXRpb25Qcm9wcy5zdHlsZX1cclxuICAgICAgICAgIGlzVG9wPXtpc1RvcH1cclxuICAgICAgICAgIHsuLi5wYWdpbmF0aW9uUHJvcHMucmVzdH1cclxuICAgICAgICAvPlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsID0gKHR5cGUpID0+IHtcclxuICAgICAgaWYgKHR5cGUgPT09ICdmYWtlU2Nyb2xsJyAmJiB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0ICE9PSB0YWJsZVNjcm9sbExlZnQpIHtcclxuICAgICAgICBmYWtlU2Nyb2xsTGVmdCA9IHRoaXMuZmFrZVNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgdGhpcy50YWJsZVJlZi5jdXJyZW50LnNjcm9sbExlZnQgPSB0aGlzLmZha2VTY3JvbGxSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlID09PSAndGFibGUnICYmIHRoaXMudGFibGVSZWYuY3VycmVudC5zY3JvbGxMZWZ0ICE9PSBmYWtlU2Nyb2xsTGVmdCkge1xyXG4gICAgICAgIHRhYmxlU2Nyb2xsTGVmdCA9IHRoaXMudGFibGVSZWYuY3VycmVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIHRoaXMuZmFrZVNjcm9sbFJlZi5jdXJyZW50LnNjcm9sbExlZnQgPSB0aGlzLnRhYmxlUmVmLmN1cnJlbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VUYWJsZSA9ICgpID0+IChcclxuICAgICAgPGRpdlxyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnUmVhY3RUYWJsZScsIGNsYXNzTmFtZSwgcm9vdFByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIC4uLnN0eWxlLFxyXG4gICAgICAgICAgLi4ucm9vdFByb3BzLnN0eWxlLFxyXG4gICAgICAgIH19XHJcbiAgICAgICAgey4uLnJvb3RQcm9wcy5yZXN0fVxyXG4gICAgICA+XHJcbiAgICAgICAge3Nob3dQYWdpbmF0aW9uICYmIHNob3dQYWdpbmF0aW9uVG9wID8gKFxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdpbmF0aW9uLXRvcFwiPnttYWtlUGFnaW5hdGlvbih0cnVlKX08L2Rpdj5cclxuICAgICAgICApIDogbnVsbH1cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICByZWY9e3RoaXMuZmFrZVNjcm9sbFJlZn1cclxuICAgICAgICAgIHN0eWxlPXt7IG92ZXJmbG93WDogXCJhdXRvXCIsIG92ZXJmbG93WTogXCJoaWRkZW5cIiB9fVxyXG4gICAgICAgICAgb25TY3JvbGw9eygpID0+IHNjcm9sbCgnZmFrZVNjcm9sbCcpfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ0JvdHRvbTogJzFweCcsIHdpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsIGhlaWdodDogMCB9fT4mbmJzcDs8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8VGFibGVDb21wb25lbnRcclxuICAgICAgICAgIG9uU2Nyb2xsPXsoKSA9PiBzY3JvbGwoJ3RhYmxlJyl9XHJcbiAgICAgICAgICByZWY9e3RoaXMudGFibGVSZWZ9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModGFibGVQcm9wcy5jbGFzc05hbWUsIGN1cnJlbnRseVJlc2l6aW5nID8gJ3J0LXJlc2l6aW5nJyA6ICcnKX1cclxuICAgICAgICAgIHN0eWxlPXt0YWJsZVByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgey4uLnRhYmxlUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7aGFzSGVhZGVyR3JvdXBzID8gbWFrZUhlYWRlckdyb3VwcygpIDogbnVsbH1cclxuICAgICAgICAgIHttYWtlSGVhZGVycygpfVxyXG4gICAgICAgICAge2hhc0ZpbHRlcnMgPyBtYWtlRmlsdGVycygpIDogbnVsbH1cclxuXHJcbiAgICAgICAgICA8VGJvZHlDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRCb2R5UHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAuLi50Qm9keVByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIHsuLi50Qm9keVByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtwYWdlUm93cy5tYXAoKGQsIGkpID0+IG1ha2VQYWdlUm93KGQsIGkpKX1cclxuICAgICAgICAgICAge3BhZFJvd3MubWFwKG1ha2VQYWRSb3cpfVxyXG4gICAgICAgICAgPC9UYm9keUNvbXBvbmVudD5cclxuICAgICAgICAgIHtoYXNDb2x1bW5Gb290ZXIgPyBtYWtlQ29sdW1uRm9vdGVycygpIDogbnVsbH1cclxuICAgICAgICA8L1RhYmxlQ29tcG9uZW50PlxyXG4gICAgICAgIHtzaG93UGFnaW5hdGlvbiAmJiBzaG93UGFnaW5hdGlvbkJvdHRvbSA/IChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi1ib3R0b21cIj57bWFrZVBhZ2luYXRpb24oZmFsc2UpfTwvZGl2PlxyXG4gICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgIHshcGFnZVJvd3MubGVuZ3RoICYmIChcclxuICAgICAgICAgIDxOb0RhdGFDb21wb25lbnQgey4uLm5vRGF0YVByb3BzfT57Xy5ub3JtYWxpemVDb21wb25lbnQobm9EYXRhVGV4dCl9PC9Ob0RhdGFDb21wb25lbnQ+XHJcbiAgICAgICAgKX1cclxuICAgICAgICA8TG9hZGluZ0NvbXBvbmVudCBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkaW5nVGV4dD17bG9hZGluZ1RleHR9IHsuLi5sb2FkaW5nUHJvcHN9IC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG5cclxuICAgIC8vIGNoaWxkUHJvcHMgYXJlIG9wdGlvbmFsbHkgcGFzc2VkIHRvIGEgZnVuY3Rpb24tYXMtYS1jaGlsZFxyXG4gICAgcmV0dXJuIGNoaWxkcmVuID8gY2hpbGRyZW4oZmluYWxTdGF0ZSwgbWFrZVRhYmxlLCB0aGlzKSA6IG1ha2VUYWJsZSgpXHJcbiAgfVxyXG59XHJcbiJdfQ==