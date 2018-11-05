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

    var _this = _possibleConstructorReturn(this, (ReactTable.__proto__ || Object.getPrototypeOf(ReactTable)).call(this));

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

    _this.state = {
      page: props.defaultPage,
      pageSize: props.defaultPageSize,
      sorted: props.defaultSorted,
      expanded: props.defaultExpanded,
      filtered: props.defaultFiltered,
      resized: props.defaultResized,
      currentlyResizing: false,
      skipNextSort: false
    };
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
                  return onExpandedChange && onExpandedChange(newExpanded, cellInfo.nestingPath, e);
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
            newExpanded = _.set(newExpanded, cellInfo.nestingPath, false);
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
        var tFootTdProps = _.splitProps(getTfootTdProps(finalState, undefined, undefined, _this2));
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

      var makePagination = function makePagination() {
        var paginationProps = _.splitProps(getPaginationProps(finalState, undefined, undefined, _this2));
        return React.createElement(PaginationComponent, _extends({}, resolvedState, {
          pages: pages,
          canPrevious: canPrevious,
          canNext: canNext,
          onPageChange: _this2.onPageChange,
          onPageSizeChange: _this2.onPageSizeChange,
          className: paginationProps.className,
          style: paginationProps.style
        }, paginationProps.rest));
      };

      var makeTable = function makeTable() {
        var pagination = makePagination();
        return React.createElement(
          'div',
          _extends({
            className: classnames('ReactTable', className, rootProps.className),
            style: _extends({}, style, rootProps.style)
          }, rootProps.rest),
          showPagination && showPaginationTop ? React.createElement(
            'div',
            { className: 'pagination-top' },
            pagination
          ) : null,
          React.createElement(
            TableComponent,
            _extends({
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
            pagination
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsImNsYXNzbmFtZXMiLCJfIiwiTGlmZWN5Y2xlIiwiTWV0aG9kcyIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlJlYWN0VGFibGVEZWZhdWx0cyIsIlJlYWN0VGFibGUiLCJwcm9wcyIsImdldFJlc29sdmVkU3RhdGUiLCJiaW5kIiwiZ2V0RGF0YU1vZGVsIiwiZ2V0U29ydGVkRGF0YSIsImZpcmVGZXRjaERhdGEiLCJnZXRQcm9wT3JTdGF0ZSIsImdldFN0YXRlT3JQcm9wIiwiZmlsdGVyRGF0YSIsInNvcnREYXRhIiwiZ2V0TWluUm93cyIsIm9uUGFnZUNoYW5nZSIsIm9uUGFnZVNpemVDaGFuZ2UiLCJzb3J0Q29sdW1uIiwiZmlsdGVyQ29sdW1uIiwicmVzaXplQ29sdW1uU3RhcnQiLCJyZXNpemVDb2x1bW5FbmQiLCJyZXNpemVDb2x1bW5Nb3ZpbmciLCJzdGF0ZSIsInBhZ2UiLCJkZWZhdWx0UGFnZSIsInBhZ2VTaXplIiwiZGVmYXVsdFBhZ2VTaXplIiwic29ydGVkIiwiZGVmYXVsdFNvcnRlZCIsImV4cGFuZGVkIiwiZGVmYXVsdEV4cGFuZGVkIiwiZmlsdGVyZWQiLCJkZWZhdWx0RmlsdGVyZWQiLCJyZXNpemVkIiwiZGVmYXVsdFJlc2l6ZWQiLCJjdXJyZW50bHlSZXNpemluZyIsInNraXBOZXh0U29ydCIsInJlc29sdmVkU3RhdGUiLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInN0eWxlIiwiZ2V0UHJvcHMiLCJnZXRUYWJsZVByb3BzIiwiZ2V0VGhlYWRHcm91cFByb3BzIiwiZ2V0VGhlYWRHcm91cFRyUHJvcHMiLCJnZXRUaGVhZEdyb3VwVGhQcm9wcyIsImdldFRoZWFkUHJvcHMiLCJnZXRUaGVhZFRyUHJvcHMiLCJnZXRUaGVhZFRoUHJvcHMiLCJnZXRUaGVhZEZpbHRlclByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJUclByb3BzIiwiZ2V0VGhlYWRGaWx0ZXJUaFByb3BzIiwiZ2V0VGJvZHlQcm9wcyIsImdldFRyR3JvdXBQcm9wcyIsImdldFRyUHJvcHMiLCJnZXRUZFByb3BzIiwiZ2V0VGZvb3RQcm9wcyIsImdldFRmb290VHJQcm9wcyIsImdldFRmb290VGRQcm9wcyIsImdldFBhZ2luYXRpb25Qcm9wcyIsImdldExvYWRpbmdQcm9wcyIsImdldE5vRGF0YVByb3BzIiwiZ2V0UmVzaXplclByb3BzIiwic2hvd1BhZ2luYXRpb24iLCJzaG93UGFnaW5hdGlvblRvcCIsInNob3dQYWdpbmF0aW9uQm90dG9tIiwibWFudWFsIiwibG9hZGluZ1RleHQiLCJub0RhdGFUZXh0Iiwic29ydGFibGUiLCJtdWx0aVNvcnQiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIiwicGl2b3RJREtleSIsInBpdm90VmFsS2V5IiwicGl2b3RCeSIsInN1YlJvd3NLZXkiLCJhZ2dyZWdhdGVkS2V5Iiwib3JpZ2luYWxLZXkiLCJpbmRleEtleSIsImdyb3VwZWRCeVBpdm90S2V5IiwibG9hZGluZyIsInBhZ2VzIiwib25FeHBhbmRlZENoYW5nZSIsIlRhYmxlQ29tcG9uZW50IiwiVGhlYWRDb21wb25lbnQiLCJUYm9keUNvbXBvbmVudCIsIlRyR3JvdXBDb21wb25lbnQiLCJUckNvbXBvbmVudCIsIlRoQ29tcG9uZW50IiwiVGRDb21wb25lbnQiLCJUZm9vdENvbXBvbmVudCIsIlBhZ2luYXRpb25Db21wb25lbnQiLCJMb2FkaW5nQ29tcG9uZW50IiwiU3ViQ29tcG9uZW50IiwiTm9EYXRhQ29tcG9uZW50IiwiUmVzaXplckNvbXBvbmVudCIsIkV4cGFuZGVyQ29tcG9uZW50IiwiUGl2b3RWYWx1ZUNvbXBvbmVudCIsIlBpdm90Q29tcG9uZW50IiwiQWdncmVnYXRlZENvbXBvbmVudCIsIkZpbHRlckNvbXBvbmVudCIsIlBhZFJvd0NvbXBvbmVudCIsInJlc29sdmVkRGF0YSIsImFsbFZpc2libGVDb2x1bW5zIiwiaGVhZGVyR3JvdXBzIiwiaGFzSGVhZGVyR3JvdXBzIiwic29ydGVkRGF0YSIsInN0YXJ0Um93IiwiZW5kUm93IiwicGFnZVJvd3MiLCJzbGljZSIsIm1pblJvd3MiLCJwYWRSb3dzIiwicmFuZ2UiLCJNYXRoIiwibWF4IiwibGVuZ3RoIiwiaGFzQ29sdW1uRm9vdGVyIiwic29tZSIsImQiLCJGb290ZXIiLCJoYXNGaWx0ZXJzIiwicmVjdXJzZVJvd3NWaWV3SW5kZXgiLCJyb3dzIiwicGF0aCIsImluZGV4IiwibWFwIiwicm93IiwiaSIsInJvd1dpdGhWaWV3SW5kZXgiLCJfdmlld0luZGV4IiwibmV3UGF0aCIsImNvbmNhdCIsImdldCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsInJvd01pbldpZHRoIiwic3VtIiwicmVzaXplZENvbHVtbiIsImZpbmQiLCJ4IiwiaWQiLCJnZXRGaXJzdERlZmluZWQiLCJ2YWx1ZSIsIndpZHRoIiwibWluV2lkdGgiLCJyb3dJbmRleCIsImZpbmFsU3RhdGUiLCJyb290UHJvcHMiLCJzcGxpdFByb3BzIiwidW5kZWZpbmVkIiwidGFibGVQcm9wcyIsInRCb2R5UHJvcHMiLCJsb2FkaW5nUHJvcHMiLCJub0RhdGFQcm9wcyIsIm1ha2VIZWFkZXJHcm91cCIsImNvbHVtbiIsInJlc2l6ZWRWYWx1ZSIsImNvbCIsImZsZXgiLCJjb2x1bW5zIiwibWF4V2lkdGgiLCJ0aGVhZEdyb3VwVGhQcm9wcyIsImNvbHVtbkhlYWRlclByb3BzIiwiZ2V0SGVhZGVyUHJvcHMiLCJjbGFzc2VzIiwiaGVhZGVyQ2xhc3NOYW1lIiwic3R5bGVzIiwiaGVhZGVyU3R5bGUiLCJyZXN0IiwiZmxleFN0eWxlcyIsImFzUHgiLCJub3JtYWxpemVDb21wb25lbnQiLCJIZWFkZXIiLCJkYXRhIiwibWFrZUhlYWRlckdyb3VwcyIsInRoZWFkR3JvdXBQcm9wcyIsInRoZWFkR3JvdXBUclByb3BzIiwibWFrZUhlYWRlciIsInJlc2l6ZWRDb2wiLCJzb3J0Iiwic2hvdyIsInRoZWFkVGhQcm9wcyIsImlzUmVzaXphYmxlIiwicmVzaXplciIsImUiLCJpc1NvcnRhYmxlIiwiZGVzYyIsImluY2x1ZGVzIiwic2hpZnRLZXkiLCJtYWtlSGVhZGVycyIsInRoZWFkUHJvcHMiLCJ0aGVhZFRyUHJvcHMiLCJtYWtlRmlsdGVyIiwidGhlYWRGaWx0ZXJUaFByb3BzIiwiZmlsdGVyIiwiUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQiLCJGaWx0ZXIiLCJpc0ZpbHRlcmFibGUiLCJvbkNoYW5nZSIsIm1ha2VGaWx0ZXJzIiwidGhlYWRGaWx0ZXJQcm9wcyIsInRoZWFkRmlsdGVyVHJQcm9wcyIsIm1ha2VQYWdlUm93Iiwicm93SW5mbyIsIm9yaWdpbmFsIiwidmlld0luZGV4IiwibGV2ZWwiLCJuZXN0aW5nUGF0aCIsImFnZ3JlZ2F0ZWQiLCJncm91cGVkQnlQaXZvdCIsInN1YlJvd3MiLCJpc0V4cGFuZGVkIiwidHJHcm91cFByb3BzIiwidHJQcm9wcyIsImpvaW4iLCJpMiIsInRkUHJvcHMiLCJjb2x1bW5Qcm9wcyIsImNlbGxJbmZvIiwicGl2b3RlZCIsImV4cGFuZGVyIiwidXNlT25FeHBhbmRlckNsaWNrIiwiaXNCcmFuY2giLCJpc1ByZXZpZXciLCJvbkV4cGFuZGVyQ2xpY2siLCJuZXdFeHBhbmRlZCIsImNsb25lIiwic2V0Iiwic2V0U3RhdGVXaXRoRGF0YSIsInJlc29sdmVkQ2VsbCIsIkNlbGwiLCJSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQiLCJBZ2dyZWdhdGVkIiwiYWdncmVnYXRlIiwiUmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCIsIkV4cGFuZGVyIiwiUmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50IiwiUGl2b3RWYWx1ZSIsIkRlZmF1bHRSZXNvbHZlZFBpdm90Q29tcG9uZW50IiwiUmVzb2x2ZWRQaXZvdENvbXBvbmVudCIsIlBpdm90IiwiZXhwYW5kYWJsZSIsImluZGV4T2YiLCJyZXNvbHZlZE9uRXhwYW5kZXJDbGljayIsImludGVyYWN0aW9uUHJvcHMiLCJvbkNsaWNrIiwibWFrZVBhZENvbHVtbiIsIm1ha2VQYWRSb3ciLCJtYWtlQ29sdW1uRm9vdGVyIiwidEZvb3RUZFByb3BzIiwiY29sdW1uRm9vdGVyUHJvcHMiLCJnZXRGb290ZXJQcm9wcyIsIm1ha2VDb2x1bW5Gb290ZXJzIiwidEZvb3RQcm9wcyIsInRGb290VHJQcm9wcyIsIm1ha2VQYWdpbmF0aW9uIiwicGFnaW5hdGlvblByb3BzIiwibWFrZVRhYmxlIiwicGFnaW5hdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLFlBQXZCO0FBQ0E7QUFDQSxPQUFPQyxDQUFQLE1BQWMsU0FBZDtBQUNBLE9BQU9DLFNBQVAsTUFBc0IsYUFBdEI7QUFDQSxPQUFPQyxPQUFQLE1BQW9CLFdBQXBCO0FBQ0EsT0FBT0MsWUFBUCxNQUF5QixnQkFBekI7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLGFBQXRCOztBQUVBLE9BQU8sSUFBTUMscUJBQXFCRixZQUEzQjs7SUFFY0csVTs7O0FBSW5CLHNCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUE7O0FBR2xCLFVBQUtDLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCQyxJQUF0QixPQUF4QjtBQUNBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkQsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRSxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJGLElBQW5CLE9BQXJCO0FBQ0EsVUFBS0csYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CSCxJQUFuQixPQUFyQjtBQUNBLFVBQUtJLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkosSUFBcEIsT0FBdEI7QUFDQSxVQUFLSyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JMLElBQXBCLE9BQXRCO0FBQ0EsVUFBS00sVUFBTCxHQUFrQixNQUFLQSxVQUFMLENBQWdCTixJQUFoQixPQUFsQjtBQUNBLFVBQUtPLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjUCxJQUFkLE9BQWhC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bkMsV0FwQ0o7QUFzQ0UsOEJBQUMsZ0JBQUQsYUFBa0IsU0FBU2EsT0FBM0IsRUFBb0MsYUFBYWQsV0FBakQsSUFBa0V1RixZQUFsRTtBQXRDRixTQURGO0FBMENELE9BNUNEOztBQThDQTtBQUNBLGFBQU9wSCxXQUFXQSxTQUFTOEcsVUFBVCxFQUFxQitHLFNBQXJCLEVBQWdDLElBQWhDLENBQVgsR0FBbURBLFdBQTFEO0FBQ0Q7Ozs7RUF0MUJxQ3BRLFFBQVFELFVBQVVILFNBQVYsQ0FBUixDOztBQUFuQlEsVSxDQUNaRixTLEdBQVlBLFM7QUFEQUUsVSxDQUVaSCxZLEdBQWVBLFk7ZUFGSEcsVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcclxuLy9cclxuaW1wb3J0IF8gZnJvbSAnLi91dGlscydcclxuaW1wb3J0IExpZmVjeWNsZSBmcm9tICcuL2xpZmVjeWNsZSdcclxuaW1wb3J0IE1ldGhvZHMgZnJvbSAnLi9tZXRob2RzJ1xyXG5pbXBvcnQgZGVmYXVsdFByb3BzIGZyb20gJy4vZGVmYXVsdFByb3BzJ1xyXG5pbXBvcnQgcHJvcFR5cGVzIGZyb20gJy4vcHJvcFR5cGVzJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFJlYWN0VGFibGVEZWZhdWx0cyA9IGRlZmF1bHRQcm9wc1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3RUYWJsZSBleHRlbmRzIE1ldGhvZHMoTGlmZWN5Y2xlKENvbXBvbmVudCkpIHtcclxuICBzdGF0aWMgcHJvcFR5cGVzID0gcHJvcFR5cGVzXHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wc1xyXG5cclxuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcclxuICAgIHN1cGVyKClcclxuXHJcbiAgICB0aGlzLmdldFJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXREYXRhTW9kZWwgPSB0aGlzLmdldERhdGFNb2RlbC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldFNvcnRlZERhdGEgPSB0aGlzLmdldFNvcnRlZERhdGEuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maXJlRmV0Y2hEYXRhID0gdGhpcy5maXJlRmV0Y2hEYXRhLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0UHJvcE9yU3RhdGUgPSB0aGlzLmdldFByb3BPclN0YXRlLmJpbmQodGhpcylcclxuICAgIHRoaXMuZ2V0U3RhdGVPclByb3AgPSB0aGlzLmdldFN0YXRlT3JQcm9wLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyRGF0YSA9IHRoaXMuZmlsdGVyRGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnNvcnREYXRhID0gdGhpcy5zb3J0RGF0YS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldE1pblJvd3MgPSB0aGlzLmdldE1pblJvd3MuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5vblBhZ2VDaGFuZ2UgPSB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLm9uUGFnZVNpemVDaGFuZ2UgPSB0aGlzLm9uUGFnZVNpemVDaGFuZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zb3J0Q29sdW1uID0gdGhpcy5zb3J0Q29sdW1uLmJpbmQodGhpcylcclxuICAgIHRoaXMuZmlsdGVyQ29sdW1uID0gdGhpcy5maWx0ZXJDb2x1bW4uYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5TdGFydCA9IHRoaXMucmVzaXplQ29sdW1uU3RhcnQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5yZXNpemVDb2x1bW5FbmQgPSB0aGlzLnJlc2l6ZUNvbHVtbkVuZC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLnJlc2l6ZUNvbHVtbk1vdmluZyA9IHRoaXMucmVzaXplQ29sdW1uTW92aW5nLmJpbmQodGhpcylcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBwYWdlOiBwcm9wcy5kZWZhdWx0UGFnZSxcclxuICAgICAgcGFnZVNpemU6IHByb3BzLmRlZmF1bHRQYWdlU2l6ZSxcclxuICAgICAgc29ydGVkOiBwcm9wcy5kZWZhdWx0U29ydGVkLFxyXG4gICAgICBleHBhbmRlZDogcHJvcHMuZGVmYXVsdEV4cGFuZGVkLFxyXG4gICAgICBmaWx0ZXJlZDogcHJvcHMuZGVmYXVsdEZpbHRlcmVkLFxyXG4gICAgICByZXNpemVkOiBwcm9wcy5kZWZhdWx0UmVzaXplZCxcclxuICAgICAgY3VycmVudGx5UmVzaXppbmc6IGZhbHNlLFxyXG4gICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGNvbnN0IHJlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG4gICAgY29uc3Qge1xyXG4gICAgICBjaGlsZHJlbixcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBzdHlsZSxcclxuICAgICAgZ2V0UHJvcHMsXHJcbiAgICAgIGdldFRhYmxlUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRHcm91cFRyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkR3JvdXBUaFByb3BzLFxyXG4gICAgICBnZXRUaGVhZFByb3BzLFxyXG4gICAgICBnZXRUaGVhZFRyUHJvcHMsXHJcbiAgICAgIGdldFRoZWFkVGhQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJQcm9wcyxcclxuICAgICAgZ2V0VGhlYWRGaWx0ZXJUclByb3BzLFxyXG4gICAgICBnZXRUaGVhZEZpbHRlclRoUHJvcHMsXHJcbiAgICAgIGdldFRib2R5UHJvcHMsXHJcbiAgICAgIGdldFRyR3JvdXBQcm9wcyxcclxuICAgICAgZ2V0VHJQcm9wcyxcclxuICAgICAgZ2V0VGRQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RQcm9wcyxcclxuICAgICAgZ2V0VGZvb3RUclByb3BzLFxyXG4gICAgICBnZXRUZm9vdFRkUHJvcHMsXHJcbiAgICAgIGdldFBhZ2luYXRpb25Qcm9wcyxcclxuICAgICAgZ2V0TG9hZGluZ1Byb3BzLFxyXG4gICAgICBnZXROb0RhdGFQcm9wcyxcclxuICAgICAgZ2V0UmVzaXplclByb3BzLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbixcclxuICAgICAgc2hvd1BhZ2luYXRpb25Ub3AsXHJcbiAgICAgIHNob3dQYWdpbmF0aW9uQm90dG9tLFxyXG4gICAgICBtYW51YWwsXHJcbiAgICAgIGxvYWRpbmdUZXh0LFxyXG4gICAgICBub0RhdGFUZXh0LFxyXG4gICAgICBzb3J0YWJsZSxcclxuICAgICAgbXVsdGlTb3J0LFxyXG4gICAgICByZXNpemFibGUsXHJcbiAgICAgIGZpbHRlcmFibGUsXHJcbiAgICAgIC8vIFBpdm90aW5nIFN0YXRlXHJcbiAgICAgIHBpdm90SURLZXksXHJcbiAgICAgIHBpdm90VmFsS2V5LFxyXG4gICAgICBwaXZvdEJ5LFxyXG4gICAgICBzdWJSb3dzS2V5LFxyXG4gICAgICBhZ2dyZWdhdGVkS2V5LFxyXG4gICAgICBvcmlnaW5hbEtleSxcclxuICAgICAgaW5kZXhLZXksXHJcbiAgICAgIGdyb3VwZWRCeVBpdm90S2V5LFxyXG4gICAgICAvLyBTdGF0ZVxyXG4gICAgICBsb2FkaW5nLFxyXG4gICAgICBwYWdlU2l6ZSxcclxuICAgICAgcGFnZSxcclxuICAgICAgc29ydGVkLFxyXG4gICAgICBmaWx0ZXJlZCxcclxuICAgICAgcmVzaXplZCxcclxuICAgICAgZXhwYW5kZWQsXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlLFxyXG4gICAgICAvLyBDb21wb25lbnRzXHJcbiAgICAgIFRhYmxlQ29tcG9uZW50LFxyXG4gICAgICBUaGVhZENvbXBvbmVudCxcclxuICAgICAgVGJvZHlDb21wb25lbnQsXHJcbiAgICAgIFRyR3JvdXBDb21wb25lbnQsXHJcbiAgICAgIFRyQ29tcG9uZW50LFxyXG4gICAgICBUaENvbXBvbmVudCxcclxuICAgICAgVGRDb21wb25lbnQsXHJcbiAgICAgIFRmb290Q29tcG9uZW50LFxyXG4gICAgICBQYWdpbmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICBMb2FkaW5nQ29tcG9uZW50LFxyXG4gICAgICBTdWJDb21wb25lbnQsXHJcbiAgICAgIE5vRGF0YUNvbXBvbmVudCxcclxuICAgICAgUmVzaXplckNvbXBvbmVudCxcclxuICAgICAgRXhwYW5kZXJDb21wb25lbnQsXHJcbiAgICAgIFBpdm90VmFsdWVDb21wb25lbnQsXHJcbiAgICAgIFBpdm90Q29tcG9uZW50LFxyXG4gICAgICBBZ2dyZWdhdGVkQ29tcG9uZW50LFxyXG4gICAgICBGaWx0ZXJDb21wb25lbnQsXHJcbiAgICAgIFBhZFJvd0NvbXBvbmVudCxcclxuICAgICAgLy8gRGF0YSBtb2RlbFxyXG4gICAgICByZXNvbHZlZERhdGEsXHJcbiAgICAgIGFsbFZpc2libGVDb2x1bW5zLFxyXG4gICAgICBoZWFkZXJHcm91cHMsXHJcbiAgICAgIGhhc0hlYWRlckdyb3VwcyxcclxuICAgICAgLy8gU29ydGVkIERhdGFcclxuICAgICAgc29ydGVkRGF0YSxcclxuICAgICAgY3VycmVudGx5UmVzaXppbmcsXHJcbiAgICB9ID0gcmVzb2x2ZWRTdGF0ZVxyXG5cclxuICAgIC8vIFBhZ2luYXRpb25cclxuICAgIGNvbnN0IHN0YXJ0Um93ID0gcGFnZVNpemUgKiBwYWdlXHJcbiAgICBjb25zdCBlbmRSb3cgPSBzdGFydFJvdyArIHBhZ2VTaXplXHJcbiAgICBsZXQgcGFnZVJvd3MgPSBtYW51YWwgPyByZXNvbHZlZERhdGEgOiBzb3J0ZWREYXRhLnNsaWNlKHN0YXJ0Um93LCBlbmRSb3cpXHJcbiAgICBjb25zdCBtaW5Sb3dzID0gdGhpcy5nZXRNaW5Sb3dzKClcclxuICAgIGNvbnN0IHBhZFJvd3MgPSBfLnJhbmdlKE1hdGgubWF4KG1pblJvd3MgLSBwYWdlUm93cy5sZW5ndGgsIDApKVxyXG5cclxuICAgIGNvbnN0IGhhc0NvbHVtbkZvb3RlciA9IGFsbFZpc2libGVDb2x1bW5zLnNvbWUoZCA9PiBkLkZvb3RlcilcclxuICAgIGNvbnN0IGhhc0ZpbHRlcnMgPSBmaWx0ZXJhYmxlIHx8IGFsbFZpc2libGVDb2x1bW5zLnNvbWUoZCA9PiBkLmZpbHRlcmFibGUpXHJcblxyXG4gICAgY29uc3QgcmVjdXJzZVJvd3NWaWV3SW5kZXggPSAocm93cywgcGF0aCA9IFtdLCBpbmRleCA9IC0xKSA9PiBbXHJcbiAgICAgIHJvd3MubWFwKChyb3csIGkpID0+IHtcclxuICAgICAgICBpbmRleCArPSAxXHJcbiAgICAgICAgY29uc3Qgcm93V2l0aFZpZXdJbmRleCA9IHtcclxuICAgICAgICAgIC4uLnJvdyxcclxuICAgICAgICAgIF92aWV3SW5kZXg6IGluZGV4LFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5jb25jYXQoW2ldKVxyXG4gICAgICAgIGlmIChyb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldICYmIF8uZ2V0KGV4cGFuZGVkLCBuZXdQYXRoKSkge1xyXG4gICAgICAgICAgW3Jvd1dpdGhWaWV3SW5kZXhbc3ViUm93c0tleV0sIGluZGV4XSA9IHJlY3Vyc2VSb3dzVmlld0luZGV4KFxyXG4gICAgICAgICAgICByb3dXaXRoVmlld0luZGV4W3N1YlJvd3NLZXldLFxyXG4gICAgICAgICAgICBuZXdQYXRoLFxyXG4gICAgICAgICAgICBpbmRleFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93V2l0aFZpZXdJbmRleFxyXG4gICAgICB9KSxcclxuICAgICAgaW5kZXgsXHJcbiAgICBdO1xyXG4gICAgW3BhZ2VSb3dzXSA9IHJlY3Vyc2VSb3dzVmlld0luZGV4KHBhZ2VSb3dzKVxyXG5cclxuICAgIGNvbnN0IGNhblByZXZpb3VzID0gcGFnZSA+IDBcclxuICAgIGNvbnN0IGNhbk5leHQgPSBwYWdlICsgMSA8IHBhZ2VzXHJcblxyXG4gICAgY29uc3Qgcm93TWluV2lkdGggPSBfLnN1bShcclxuICAgICAgYWxsVmlzaWJsZUNvbHVtbnMubWFwKGQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc2l6ZWRDb2x1bW4gPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBkLmlkKSB8fCB7fVxyXG4gICAgICAgIHJldHVybiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sdW1uLnZhbHVlLCBkLndpZHRoLCBkLm1pbldpZHRoKVxyXG4gICAgICB9KVxyXG4gICAgKVxyXG5cclxuICAgIGxldCByb3dJbmRleCA9IC0xXHJcblxyXG4gICAgY29uc3QgZmluYWxTdGF0ZSA9IHtcclxuICAgICAgLi4ucmVzb2x2ZWRTdGF0ZSxcclxuICAgICAgc3RhcnRSb3csXHJcbiAgICAgIGVuZFJvdyxcclxuICAgICAgcGFnZVJvd3MsXHJcbiAgICAgIG1pblJvd3MsXHJcbiAgICAgIHBhZFJvd3MsXHJcbiAgICAgIGhhc0NvbHVtbkZvb3RlcixcclxuICAgICAgY2FuUHJldmlvdXMsXHJcbiAgICAgIGNhbk5leHQsXHJcbiAgICAgIHJvd01pbldpZHRoLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJvb3RQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICBjb25zdCB0YWJsZVByb3BzID0gXy5zcGxpdFByb3BzKGdldFRhYmxlUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgY29uc3QgdEJvZHlQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUYm9keVByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgIGNvbnN0IGxvYWRpbmdQcm9wcyA9IGdldExvYWRpbmdQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgIGNvbnN0IG5vRGF0YVByb3BzID0gZ2V0Tm9EYXRhUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpXHJcblxyXG4gICAgLy8gVmlzdWFsIENvbXBvbmVudHNcclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyR3JvdXAgPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRWYWx1ZSA9IGNvbCA9PiAocmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sLmlkKSB8fCB7fSkudmFsdWVcclxuICAgICAgY29uc3QgZmxleCA9IF8uc3VtKFxyXG4gICAgICAgIGNvbHVtbi5jb2x1bW5zLm1hcChjb2wgPT4gKGNvbC53aWR0aCB8fCByZXNpemVkVmFsdWUoY29sKSA/IDAgOiBjb2wubWluV2lkdGgpKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkVmFsdWUoY29sKSwgY29sLndpZHRoLCBjb2wubWluV2lkdGgpKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5zdW0oXHJcbiAgICAgICAgY29sdW1uLmNvbHVtbnMubWFwKGNvbCA9PiBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkVmFsdWUoY29sKSwgY29sLndpZHRoLCBjb2wubWF4V2lkdGgpKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0aGVhZEdyb3VwVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBnZXRUaGVhZEdyb3VwVGhQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXHJcbiAgICAgICAgY29sdW1uLmhlYWRlckNsYXNzTmFtZSxcclxuICAgICAgICB0aGVhZEdyb3VwVGhQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkR3JvdXBUaFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbkhlYWRlclByb3BzLnN0eWxlLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXN0ID0ge1xyXG4gICAgICAgIC4uLnRoZWFkR3JvdXBUaFByb3BzLnJlc3QsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZmxleFN0eWxlcyA9IHtcclxuICAgICAgICBmbGV4OiBgJHtmbGV4fSAwIGF1dG9gLFxyXG4gICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUaENvbXBvbmVudFxyXG4gICAgICAgICAga2V5PXtgJHtpfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzZXMpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICAuLi5mbGV4U3R5bGVzLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtfLm5vcm1hbGl6ZUNvbXBvbmVudChjb2x1bW4uSGVhZGVyLCB7XHJcbiAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXHJcbiAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvVGhDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlSGVhZGVyR3JvdXBzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0aGVhZEdyb3VwUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRHcm91cFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHRoZWFkR3JvdXBUclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFRoZWFkR3JvdXBUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1oZWFkZXJHcm91cHMnLCB0aGVhZEdyb3VwUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRoZWFkR3JvdXBQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRHcm91cFByb3BzLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPFRyQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhlYWRHcm91cFRyUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgICBzdHlsZT17dGhlYWRHcm91cFRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZEdyb3VwVHJQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aGVhZGVyR3JvdXBzLm1hcChtYWtlSGVhZGVyR3JvdXApfVxyXG4gICAgICAgICAgPC9UckNvbXBvbmVudD5cclxuICAgICAgICA8L1RoZWFkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUhlYWRlciA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgc29ydCA9IHNvcnRlZC5maW5kKGQgPT4gZC5pZCA9PT0gY29sdW1uLmlkKVxyXG4gICAgICBjb25zdCBzaG93ID0gdHlwZW9mIGNvbHVtbi5zaG93ID09PSAnZnVuY3Rpb24nID8gY29sdW1uLnNob3coKSA6IGNvbHVtbi5zaG93XHJcbiAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRoZWFkVGhQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUaGVhZFRoUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpKVxyXG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXJQcm9wcyA9IF8uc3BsaXRQcm9wcyhcclxuICAgICAgICBjb2x1bW4uZ2V0SGVhZGVyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCBjb2x1bW4sIHRoaXMpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbY29sdW1uLmhlYWRlckNsYXNzTmFtZSwgdGhlYWRUaFByb3BzLmNsYXNzTmFtZSwgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICAgIC4uLmNvbHVtbi5oZWFkZXJTdHlsZSxcclxuICAgICAgICAuLi50aGVhZFRoUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3QgPSB7XHJcbiAgICAgICAgLi4udGhlYWRUaFByb3BzLnJlc3QsXHJcbiAgICAgICAgLi4uY29sdW1uSGVhZGVyUHJvcHMucmVzdCxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXNSZXNpemFibGUgPSBfLmdldEZpcnN0RGVmaW5lZChjb2x1bW4ucmVzaXphYmxlLCByZXNpemFibGUsIGZhbHNlKVxyXG4gICAgICBjb25zdCByZXNpemVyID0gaXNSZXNpemFibGUgPyAoXHJcbiAgICAgICAgPFJlc2l6ZXJDb21wb25lbnRcclxuICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMucmVzaXplQ29sdW1uU3RhcnQoZSwgY29sdW1uLCBmYWxzZSl9XHJcbiAgICAgICAgICBvblRvdWNoU3RhcnQ9e2UgPT4gdGhpcy5yZXNpemVDb2x1bW5TdGFydChlLCBjb2x1bW4sIHRydWUpfVxyXG4gICAgICAgICAgey4uLmdldFJlc2l6ZXJQcm9wcygnZmluYWxTdGF0ZScsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICApIDogbnVsbFxyXG5cclxuICAgICAgY29uc3QgaXNTb3J0YWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5zb3J0YWJsZSwgc29ydGFibGUsIGZhbHNlKVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhcclxuICAgICAgICAgICAgY2xhc3NlcyxcclxuICAgICAgICAgICAgaXNSZXNpemFibGUgJiYgJ3J0LXJlc2l6YWJsZS1oZWFkZXInLFxyXG4gICAgICAgICAgICBzb3J0ID8gKHNvcnQuZGVzYyA/ICctc29ydC1kZXNjJyA6ICctc29ydC1hc2MnKSA6ICcnLFxyXG4gICAgICAgICAgICBpc1NvcnRhYmxlICYmICctY3Vyc29yLXBvaW50ZXInLFxyXG4gICAgICAgICAgICAhc2hvdyAmJiAnLWhpZGRlbicsXHJcbiAgICAgICAgICAgIHBpdm90QnkgJiYgcGl2b3RCeS5zbGljZSgwLCAtMSkuaW5jbHVkZXMoY29sdW1uLmlkKSAmJiAncnQtaGVhZGVyLXBpdm90J1xyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnN0eWxlcyxcclxuICAgICAgICAgICAgZmxleDogYCR7d2lkdGh9IDAgYXV0b2AsXHJcbiAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICBtYXhXaWR0aDogXy5hc1B4KG1heFdpZHRoKSxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB0b2dnbGVTb3J0PXtlID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzU29ydGFibGUpIHRoaXMuc29ydENvbHVtbihjb2x1bW4sIG11bHRpU29ydCA/IGUuc2hpZnRLZXkgOiBmYWxzZSlcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhpc1Jlc2l6YWJsZSAmJiAncnQtcmVzaXphYmxlLWhlYWRlci1jb250ZW50Jyl9PlxyXG4gICAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkhlYWRlciwge1xyXG4gICAgICAgICAgICAgIGRhdGE6IHNvcnRlZERhdGEsXHJcbiAgICAgICAgICAgICAgY29sdW1uLFxyXG4gICAgICAgICAgICB9KX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge3Jlc2l6ZXJ9XHJcbiAgICAgICAgPC9UaENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VIZWFkZXJzID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCB0aGVhZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRoZWFkUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICBjb25zdCB0aGVhZFRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGhlYWRUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGhlYWRDb21wb25lbnRcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnLWhlYWRlcicsIHRoZWFkUHJvcHMuY2xhc3NOYW1lKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRoZWFkUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRoZWFkUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXt0aGVhZFRyUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgICBzdHlsZT17dGhlYWRUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udGhlYWRUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUhlYWRlcil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGhlYWRDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlRmlsdGVyID0gKGNvbHVtbiwgaSkgPT4ge1xyXG4gICAgICBjb25zdCByZXNpemVkQ29sID0gcmVzaXplZC5maW5kKHggPT4geC5pZCA9PT0gY29sdW1uLmlkKSB8fCB7fVxyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclRoUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJUaFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlclByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGNvbHVtbi5nZXRIZWFkZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcylcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgY2xhc3NlcyA9IFtcclxuICAgICAgICBjb2x1bW4uaGVhZGVyQ2xhc3NOYW1lLFxyXG4gICAgICAgIHRoZWFkRmlsdGVyVGhQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uSGVhZGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4uY29sdW1uLmhlYWRlclN0eWxlLFxyXG4gICAgICAgIC4uLnRoZWFkRmlsdGVyVGhQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdCA9IHtcclxuICAgICAgICAuLi50aGVhZEZpbHRlclRoUHJvcHMucmVzdCxcclxuICAgICAgICAuLi5jb2x1bW5IZWFkZXJQcm9wcy5yZXN0LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJlZC5maW5kKGZpbHRlciA9PiBmaWx0ZXIuaWQgPT09IGNvbHVtbi5pZClcclxuXHJcbiAgICAgIGNvbnN0IFJlc29sdmVkRmlsdGVyQ29tcG9uZW50ID0gY29sdW1uLkZpbHRlciB8fCBGaWx0ZXJDb21wb25lbnRcclxuXHJcbiAgICAgIGNvbnN0IGlzRmlsdGVyYWJsZSA9IF8uZ2V0Rmlyc3REZWZpbmVkKGNvbHVtbi5maWx0ZXJhYmxlLCBmaWx0ZXJhYmxlLCBmYWxzZSlcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3Nlcyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnJlc3R9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2lzRmlsdGVyYWJsZVxyXG4gICAgICAgICAgICA/IF8ubm9ybWFsaXplQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgUmVzb2x2ZWRGaWx0ZXJDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbHVtbixcclxuICAgICAgICAgICAgICAgICAgZmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdmFsdWUgPT4gdGhpcy5maWx0ZXJDb2x1bW4oY29sdW1uLCB2YWx1ZSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdFByb3BzLmNvbHVtbi5GaWx0ZXJcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICA8L1RoQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUZpbHRlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZWFkRmlsdGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0aGVhZEZpbHRlclRyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgZ2V0VGhlYWRGaWx0ZXJUclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRoZWFkQ29tcG9uZW50XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJy1maWx0ZXJzJywgdGhlYWRGaWx0ZXJQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4udGhlYWRGaWx0ZXJQcm9wcy5zdHlsZSxcclxuICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB7Li4udGhlYWRGaWx0ZXJQcm9wcy5yZXN0fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e3RoZWFkRmlsdGVyVHJQcm9wcy5jbGFzc05hbWV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt0aGVhZEZpbHRlclRyUHJvcHMuc3R5bGV9XHJcbiAgICAgICAgICAgIHsuLi50aGVhZEZpbHRlclRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlRmlsdGVyKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9UaGVhZENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWdlUm93ID0gKHJvdywgaSwgcGF0aCA9IFtdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJvd0luZm8gPSB7XHJcbiAgICAgICAgb3JpZ2luYWw6IHJvd1tvcmlnaW5hbEtleV0sXHJcbiAgICAgICAgcm93LFxyXG4gICAgICAgIGluZGV4OiByb3dbaW5kZXhLZXldLFxyXG4gICAgICAgIHZpZXdJbmRleDogKHJvd0luZGV4ICs9IDEpLFxyXG4gICAgICAgIHBhZ2VTaXplLFxyXG4gICAgICAgIHBhZ2UsXHJcbiAgICAgICAgbGV2ZWw6IHBhdGgubGVuZ3RoLFxyXG4gICAgICAgIG5lc3RpbmdQYXRoOiBwYXRoLmNvbmNhdChbaV0pLFxyXG4gICAgICAgIGFnZ3JlZ2F0ZWQ6IHJvd1thZ2dyZWdhdGVkS2V5XSxcclxuICAgICAgICBncm91cGVkQnlQaXZvdDogcm93W2dyb3VwZWRCeVBpdm90S2V5XSxcclxuICAgICAgICBzdWJSb3dzOiByb3dbc3ViUm93c0tleV0sXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaXNFeHBhbmRlZCA9IF8uZ2V0KGV4cGFuZGVkLCByb3dJbmZvLm5lc3RpbmdQYXRoKVxyXG4gICAgICBjb25zdCB0ckdyb3VwUHJvcHMgPSBnZXRUckdyb3VwUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICBjb25zdCB0clByb3BzID0gXy5zcGxpdFByb3BzKGdldFRyUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VHJHcm91cENvbXBvbmVudCBrZXk9e3Jvd0luZm8ubmVzdGluZ1BhdGguam9pbignXycpfSB7Li4udHJHcm91cFByb3BzfT5cclxuICAgICAgICAgIDxUckNvbXBvbmVudFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModHJQcm9wcy5jbGFzc05hbWUsIHJvdy5fdmlld0luZGV4ICUgMiA/ICctZXZlbicgOiAnLW9kZCcpfVxyXG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRyUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcCgoY29sdW1uLCBpMikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWluV2lkdGgpXHJcbiAgICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5tYXhXaWR0aClcclxuICAgICAgICAgICAgICBjb25zdCB0ZFByb3BzID0gXy5zcGxpdFByb3BzKGdldFRkUHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgY29sdW1uLCB0aGlzKSlcclxuICAgICAgICAgICAgICBjb25zdCBjb2x1bW5Qcm9wcyA9IF8uc3BsaXRQcm9wcyhjb2x1bW4uZ2V0UHJvcHMoZmluYWxTdGF0ZSwgcm93SW5mbywgY29sdW1uLCB0aGlzKSlcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IFt0ZFByb3BzLmNsYXNzTmFtZSwgY29sdW1uLmNsYXNzTmFtZSwgY29sdW1uUHJvcHMuY2xhc3NOYW1lXVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi50ZFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgLi4uY29sdW1uLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBjZWxsSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnJvd0luZm8sXHJcbiAgICAgICAgICAgICAgICBpc0V4cGFuZGVkLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uOiB7IC4uLmNvbHVtbiB9LFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJvd0luZm8ucm93W2NvbHVtbi5pZF0sXHJcbiAgICAgICAgICAgICAgICBwaXZvdGVkOiBjb2x1bW4ucGl2b3RlZCxcclxuICAgICAgICAgICAgICAgIGV4cGFuZGVyOiBjb2x1bW4uZXhwYW5kZXIsXHJcbiAgICAgICAgICAgICAgICByZXNpemVkLFxyXG4gICAgICAgICAgICAgICAgc2hvdyxcclxuICAgICAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0ZFByb3BzLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uUHJvcHMsXHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzLFxyXG4gICAgICAgICAgICAgICAgc3R5bGVzLFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjZWxsSW5mby52YWx1ZVxyXG5cclxuICAgICAgICAgICAgICBsZXQgdXNlT25FeHBhbmRlckNsaWNrXHJcbiAgICAgICAgICAgICAgbGV0IGlzQnJhbmNoXHJcbiAgICAgICAgICAgICAgbGV0IGlzUHJldmlld1xyXG5cclxuICAgICAgICAgICAgICBjb25zdCBvbkV4cGFuZGVyQ2xpY2sgPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdFeHBhbmRlZCA9IF8uY2xvbmUoZXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXdFeHBhbmRlZCA9IF8uc2V0KG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBuZXdFeHBhbmRlZCA9IF8uc2V0KG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwge30pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGVXaXRoRGF0YShcclxuICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkOiBuZXdFeHBhbmRlZCxcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgKCkgPT4gb25FeHBhbmRlZENoYW5nZSAmJiBvbkV4cGFuZGVkQ2hhbmdlKG5ld0V4cGFuZGVkLCBjZWxsSW5mby5uZXN0aW5nUGF0aCwgZSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gYSBzdGFuZGFyZCBjZWxsXHJcbiAgICAgICAgICAgICAgbGV0IHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KGNvbHVtbi5DZWxsLCBjZWxsSW5mbywgdmFsdWUpXHJcblxyXG4gICAgICAgICAgICAgIC8vIFJlc29sdmUgUmVuZGVyZXJzXHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRBZ2dyZWdhdGVkQ29tcG9uZW50ID1cclxuICAgICAgICAgICAgICAgIGNvbHVtbi5BZ2dyZWdhdGVkIHx8ICghY29sdW1uLmFnZ3JlZ2F0ZSA/IEFnZ3JlZ2F0ZWRDb21wb25lbnQgOiBjb2x1bW4uQ2VsbClcclxuICAgICAgICAgICAgICBjb25zdCBSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50ID0gY29sdW1uLkV4cGFuZGVyIHx8IEV4cGFuZGVyQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgY29uc3QgUmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50ID0gY29sdW1uLlBpdm90VmFsdWUgfHwgUGl2b3RWYWx1ZUNvbXBvbmVudFxyXG4gICAgICAgICAgICAgIGNvbnN0IERlZmF1bHRSZXNvbHZlZFBpdm90Q29tcG9uZW50ID1cclxuICAgICAgICAgICAgICAgIFBpdm90Q29tcG9uZW50IHx8XHJcbiAgICAgICAgICAgICAgICAocHJvcHMgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxSZXNvbHZlZEV4cGFuZGVyQ29tcG9uZW50IHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzb2x2ZWRQaXZvdFZhbHVlQ29tcG9uZW50IHsuLi5wcm9wc30gLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICAgIGNvbnN0IFJlc29sdmVkUGl2b3RDb21wb25lbnQgPSBjb2x1bW4uUGl2b3QgfHwgRGVmYXVsdFJlc29sdmVkUGl2b3RDb21wb25lbnRcclxuXHJcbiAgICAgICAgICAgICAgLy8gSXMgdGhpcyBjZWxsIGV4cGFuZGFibGU/XHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgfHwgY2VsbEluZm8uZXhwYW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIE1ha2UgaXQgZXhwYW5kYWJsZSBieSBkZWZ1YWx0XHJcbiAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgdXNlT25FeHBhbmRlckNsaWNrID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgcGl2b3RlZCwgaGFzIG5vIHN1YlJvd3MsIGFuZCBkb2VzIG5vdCBoYXZlIGEgc3ViQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IG1ha2UgZXhwYW5kYWJsZVxyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLnBpdm90ZWQgJiYgIWNlbGxJbmZvLnN1YlJvd3MgJiYgIVN1YkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjZWxsSW5mby5waXZvdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJcyB0aGlzIGNvbHVtbiBhIGJyYW5jaD9cclxuICAgICAgICAgICAgICAgIGlzQnJhbmNoID0gcm93SW5mby5yb3dbcGl2b3RJREtleV0gPT09IGNvbHVtbi5pZCAmJiBjZWxsSW5mby5zdWJSb3dzXHJcbiAgICAgICAgICAgICAgICAvLyBTaG91bGQgdGhpcyBjb2x1bW4gYmUgYmxhbms/XHJcbiAgICAgICAgICAgICAgICBpc1ByZXZpZXcgPVxyXG4gICAgICAgICAgICAgICAgICBwaXZvdEJ5LmluZGV4T2YoY29sdW1uLmlkKSA+IHBpdm90QnkuaW5kZXhPZihyb3dJbmZvLnJvd1twaXZvdElES2V5XSkgJiZcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8uc3ViUm93c1xyXG4gICAgICAgICAgICAgICAgLy8gUGl2b3QgQ2VsbCBSZW5kZXIgT3ZlcnJpZGVcclxuICAgICAgICAgICAgICAgIGlmIChpc0JyYW5jaCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBpc1Bpdm90XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgICAgIFJlc29sdmVkUGl2b3RDb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY2VsbEluZm8sXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcm93W3Bpdm90VmFsS2V5XSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd1twaXZvdFZhbEtleV1cclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1ByZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgLy8gU2hvdyB0aGUgcGl2b3QgcHJldmlld1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChSZXNvbHZlZEFnZ3JlZ2F0ZWRDb21wb25lbnQsIGNlbGxJbmZvLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNlbGxJbmZvLmFnZ3JlZ2F0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IF8ubm9ybWFsaXplQ29tcG9uZW50KFJlc29sdmVkQWdncmVnYXRlZENvbXBvbmVudCwgY2VsbEluZm8sIHZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxJbmZvLmV4cGFuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlZENlbGwgPSBfLm5vcm1hbGl6ZUNvbXBvbmVudChcclxuICAgICAgICAgICAgICAgICAgUmVzb2x2ZWRFeHBhbmRlckNvbXBvbmVudCxcclxuICAgICAgICAgICAgICAgICAgY2VsbEluZm8sXHJcbiAgICAgICAgICAgICAgICAgIHJvd1twaXZvdFZhbEtleV1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIGlmIChwaXZvdEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChjZWxsSW5mby5ncm91cGVkQnlQaXZvdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZiAoIWNlbGxJbmZvLnN1YlJvd3MgJiYgIVN1YkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkQ2VsbCA9IG51bGxcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWRPbkV4cGFuZGVyQ2xpY2sgPSB1c2VPbkV4cGFuZGVyQ2xpY2sgPyBvbkV4cGFuZGVyQ2xpY2sgOiAoKSA9PiB7fVxyXG5cclxuICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgb25DbGljayBldmVudHMsIG1ha2Ugc3VyZSB0aGV5IGRvbid0XHJcbiAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgZWFjaG90aGVyLiBUaGlzIHNob3VsZCBtYXliZSBiZSBleHBhbmRlZCB0byBoYW5kbGUgYWxsXHJcbiAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgIGNvbnN0IGludGVyYWN0aW9uUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayxcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICh0ZFByb3BzLnJlc3Qub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Qcm9wcy5vbkNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRkUHJvcHMucmVzdC5vbkNsaWNrKGUsICgpID0+IHJlc29sdmVkT25FeHBhbmRlckNsaWNrKGUpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKGNvbHVtblByb3BzLnJlc3Qub25DbGljaykge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Qcm9wcy5vbkNsaWNrID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbHVtblByb3BzLnJlc3Qub25DbGljayhlLCAoKSA9PiByZXNvbHZlZE9uRXhwYW5kZXJDbGljayhlKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgY2VsbFxyXG4gICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8VGRDb21wb25lbnRcclxuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxyXG4gICAgICAgICAgICAgICAgICBrZXk9e2Ake2kyfS0ke2NvbHVtbi5pZH1gfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyxcclxuICAgICAgICAgICAgICAgICAgICAhY2VsbEluZm8uZXhwYW5kYWJsZSAmJiAhc2hvdyAmJiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICBjZWxsSW5mby5leHBhbmRhYmxlICYmICdydC1leHBhbmRhYmxlJyxcclxuICAgICAgICAgICAgICAgICAgICAoaXNCcmFuY2ggfHwgaXNQcmV2aWV3KSAmJiAncnQtcGl2b3QnXHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBfLmFzUHgod2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiBfLmFzUHgobWF4V2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICB7Li4udGRQcm9wcy5yZXN0fVxyXG4gICAgICAgICAgICAgICAgICB7Li4uY29sdW1uUHJvcHMucmVzdH1cclxuICAgICAgICAgICAgICAgICAgey4uLmludGVyYWN0aW9uUHJvcHN9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtyZXNvbHZlZENlbGx9XHJcbiAgICAgICAgICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgICAge3Jvd0luZm8uc3ViUm93cyAmJlxyXG4gICAgICAgICAgICBpc0V4cGFuZGVkICYmXHJcbiAgICAgICAgICAgIHJvd0luZm8uc3ViUm93cy5tYXAoKGQsIGkpID0+IG1ha2VQYWdlUm93KGQsIGksIHJvd0luZm8ubmVzdGluZ1BhdGgpKX1cclxuICAgICAgICAgIHtTdWJDb21wb25lbnQgJiYgIXJvd0luZm8uc3ViUm93cyAmJiBpc0V4cGFuZGVkICYmIFN1YkNvbXBvbmVudChyb3dJbmZvLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdFeHBhbmRlZCA9IF8uY2xvbmUoZXhwYW5kZWQpXHJcbiAgICAgICAgICAgIG5ld0V4cGFuZGVkID0gXy5zZXQobmV3RXhwYW5kZWQsIGNlbGxJbmZvLm5lc3RpbmdQYXRoLCBmYWxzZSlcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvVHJHcm91cENvbXBvbmVudD5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1ha2VQYWRDb2x1bW4gPSAoY29sdW1uLCBpKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc2l6ZWRDb2wgPSByZXNpemVkLmZpbmQoeCA9PiB4LmlkID09PSBjb2x1bW4uaWQpIHx8IHt9XHJcbiAgICAgIGNvbnN0IHNob3cgPSB0eXBlb2YgY29sdW1uLnNob3cgPT09ICdmdW5jdGlvbicgPyBjb2x1bW4uc2hvdygpIDogY29sdW1uLnNob3dcclxuICAgICAgY29uc3Qgd2lkdGggPSBfLmdldEZpcnN0RGVmaW5lZChyZXNpemVkQ29sLnZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5taW5XaWR0aClcclxuICAgICAgY29uc3QgZmxleCA9IHdpZHRoXHJcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gXy5nZXRGaXJzdERlZmluZWQocmVzaXplZENvbC52YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4ubWF4V2lkdGgpXHJcbiAgICAgIGNvbnN0IHRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcbiAgICAgIGNvbnN0IGNvbHVtblByb3BzID0gXy5zcGxpdFByb3BzKGNvbHVtbi5nZXRQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIGNvbHVtbiwgdGhpcykpXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW3RkUHJvcHMuY2xhc3NOYW1lLCBjb2x1bW4uY2xhc3NOYW1lLCBjb2x1bW5Qcm9wcy5jbGFzc05hbWVdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4udGRQcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW4uc3R5bGUsXHJcbiAgICAgICAgLi4uY29sdW1uUHJvcHMuc3R5bGUsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRkQ29tcG9uZW50XHJcbiAgICAgICAgICBrZXk9e2Ake2l9LSR7Y29sdW1uLmlkfWB9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NlcywgIXNob3cgJiYgJ2hpZGRlbicpfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgLi4uc3R5bGVzLFxyXG4gICAgICAgICAgICBmbGV4OiBgJHtmbGV4fSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRkUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoUGFkUm93Q29tcG9uZW50KX1cclxuICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVBhZFJvdyA9IChyb3csIGkpID0+IHtcclxuICAgICAgY29uc3QgdHJHcm91cFByb3BzID0gZ2V0VHJHcm91cFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKVxyXG4gICAgICBjb25zdCB0clByb3BzID0gXy5zcGxpdFByb3BzKGdldFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUckdyb3VwQ29tcG9uZW50IGtleT17YHBhZC0ke2l9YH0gey4uLnRyR3JvdXBQcm9wc30+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxyXG4gICAgICAgICAgICAgICctcGFkUm93JyxcclxuICAgICAgICAgICAgICAocGFnZVJvd3MubGVuZ3RoICsgaSkgJSAyID8gJy1ldmVuJyA6ICctb2RkJyxcclxuICAgICAgICAgICAgICB0clByb3BzLmNsYXNzTmFtZVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICBzdHlsZT17dHJQcm9wcy5zdHlsZSB8fCB7fX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2FsbFZpc2libGVDb2x1bW5zLm1hcChtYWtlUGFkQ29sdW1uKX1cclxuICAgICAgICAgIDwvVHJDb21wb25lbnQ+XHJcbiAgICAgICAgPC9Uckdyb3VwQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUNvbHVtbkZvb3RlciA9IChjb2x1bW4sIGkpID0+IHtcclxuICAgICAgY29uc3QgcmVzaXplZENvbCA9IHJlc2l6ZWQuZmluZCh4ID0+IHguaWQgPT09IGNvbHVtbi5pZCkgfHwge31cclxuICAgICAgY29uc3Qgc2hvdyA9IHR5cGVvZiBjb2x1bW4uc2hvdyA9PT0gJ2Z1bmN0aW9uJyA/IGNvbHVtbi5zaG93KCkgOiBjb2x1bW4uc2hvd1xyXG4gICAgICBjb25zdCB3aWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1pbldpZHRoKVxyXG4gICAgICBjb25zdCBtYXhXaWR0aCA9IF8uZ2V0Rmlyc3REZWZpbmVkKHJlc2l6ZWRDb2wudmFsdWUsIGNvbHVtbi53aWR0aCwgY29sdW1uLm1heFdpZHRoKVxyXG4gICAgICBjb25zdCB0Rm9vdFRkUHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RUZFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uUHJvcHMgPSBfLnNwbGl0UHJvcHMoY29sdW1uLmdldFByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKSlcclxuICAgICAgY29uc3QgY29sdW1uRm9vdGVyUHJvcHMgPSBfLnNwbGl0UHJvcHMoXHJcbiAgICAgICAgY29sdW1uLmdldEZvb3RlclByb3BzKGZpbmFsU3RhdGUsIHVuZGVmaW5lZCwgY29sdW1uLCB0aGlzKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBjbGFzc2VzID0gW1xyXG4gICAgICAgIHRGb290VGRQcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uLmNsYXNzTmFtZSxcclxuICAgICAgICBjb2x1bW5Qcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgICAgY29sdW1uRm9vdGVyUHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgICBdXHJcblxyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgLi4udEZvb3RUZFByb3BzLnN0eWxlLFxyXG4gICAgICAgIC4uLmNvbHVtbi5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5Qcm9wcy5zdHlsZSxcclxuICAgICAgICAuLi5jb2x1bW5Gb290ZXJQcm9wcy5zdHlsZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGRDb21wb25lbnRcclxuICAgICAgICAgIGtleT17YCR7aX0tJHtjb2x1bW4uaWR9YH1cclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc2VzLCAhc2hvdyAmJiAnaGlkZGVuJyl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZXMsXHJcbiAgICAgICAgICAgIGZsZXg6IGAke3dpZHRofSAwIGF1dG9gLFxyXG4gICAgICAgICAgICB3aWR0aDogXy5hc1B4KHdpZHRoKSxcclxuICAgICAgICAgICAgbWF4V2lkdGg6IF8uYXNQeChtYXhXaWR0aCksXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLmNvbHVtblByb3BzLnJlc3R9XHJcbiAgICAgICAgICB7Li4udEZvb3RUZFByb3BzLnJlc3R9XHJcbiAgICAgICAgICB7Li4uY29sdW1uRm9vdGVyUHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7Xy5ub3JtYWxpemVDb21wb25lbnQoY29sdW1uLkZvb3Rlciwge1xyXG4gICAgICAgICAgICBkYXRhOiBzb3J0ZWREYXRhLFxyXG4gICAgICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICA8L1RkQ29tcG9uZW50PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZUNvbHVtbkZvb3RlcnMgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRGb290UHJvcHMgPSBfLnNwbGl0UHJvcHMoZ2V0VGZvb3RQcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcykpXHJcbiAgICAgIGNvbnN0IHRGb290VHJQcm9wcyA9IF8uc3BsaXRQcm9wcyhnZXRUZm9vdFRyUHJvcHMoZmluYWxTdGF0ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRoaXMpKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxUZm9vdENvbXBvbmVudFxyXG4gICAgICAgICAgY2xhc3NOYW1lPXt0Rm9vdFByb3BzLmNsYXNzTmFtZX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIC4uLnRGb290UHJvcHMuc3R5bGUsXHJcbiAgICAgICAgICAgIG1pbldpZHRoOiBgJHtyb3dNaW5XaWR0aH1weGAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgey4uLnRGb290UHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8VHJDb21wb25lbnRcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHRGb290VHJQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgICBzdHlsZT17dEZvb3RUclByb3BzLnN0eWxlfVxyXG4gICAgICAgICAgICB7Li4udEZvb3RUclByb3BzLnJlc3R9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHthbGxWaXNpYmxlQ29sdW1ucy5tYXAobWFrZUNvbHVtbkZvb3Rlcil9XHJcbiAgICAgICAgICA8L1RyQ29tcG9uZW50PlxyXG4gICAgICAgIDwvVGZvb3RDb21wb25lbnQ+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtYWtlUGFnaW5hdGlvbiA9ICgpID0+IHtcclxuICAgICAgY29uc3QgcGFnaW5hdGlvblByb3BzID0gXy5zcGxpdFByb3BzKFxyXG4gICAgICAgIGdldFBhZ2luYXRpb25Qcm9wcyhmaW5hbFN0YXRlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdGhpcylcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQYWdpbmF0aW9uQ29tcG9uZW50XHJcbiAgICAgICAgICB7Li4ucmVzb2x2ZWRTdGF0ZX1cclxuICAgICAgICAgIHBhZ2VzPXtwYWdlc31cclxuICAgICAgICAgIGNhblByZXZpb3VzPXtjYW5QcmV2aW91c31cclxuICAgICAgICAgIGNhbk5leHQ9e2Nhbk5leHR9XHJcbiAgICAgICAgICBvblBhZ2VDaGFuZ2U9e3RoaXMub25QYWdlQ2hhbmdlfVxyXG4gICAgICAgICAgb25QYWdlU2l6ZUNoYW5nZT17dGhpcy5vblBhZ2VTaXplQ2hhbmdlfVxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtwYWdpbmF0aW9uUHJvcHMuY2xhc3NOYW1lfVxyXG4gICAgICAgICAgc3R5bGU9e3BhZ2luYXRpb25Qcm9wcy5zdHlsZX1cclxuICAgICAgICAgIHsuLi5wYWdpbmF0aW9uUHJvcHMucmVzdH1cclxuICAgICAgICAvPlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWFrZVRhYmxlID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBwYWdpbmF0aW9uID0gbWFrZVBhZ2luYXRpb24oKVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnUmVhY3RUYWJsZScsIGNsYXNzTmFtZSwgcm9vdFByb3BzLmNsYXNzTmFtZSl9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgICAgICAgLi4ucm9vdFByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHsuLi5yb290UHJvcHMucmVzdH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7c2hvd1BhZ2luYXRpb24gJiYgc2hvd1BhZ2luYXRpb25Ub3AgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnaW5hdGlvbi10b3BcIj57cGFnaW5hdGlvbn08L2Rpdj5cclxuICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgPFRhYmxlQ29tcG9uZW50XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh0YWJsZVByb3BzLmNsYXNzTmFtZSwgY3VycmVudGx5UmVzaXppbmcgPyAncnQtcmVzaXppbmcnIDogJycpfVxyXG4gICAgICAgICAgICBzdHlsZT17dGFibGVQcm9wcy5zdHlsZX1cclxuICAgICAgICAgICAgey4uLnRhYmxlUHJvcHMucmVzdH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2hhc0hlYWRlckdyb3VwcyA/IG1ha2VIZWFkZXJHcm91cHMoKSA6IG51bGx9XHJcbiAgICAgICAgICAgIHttYWtlSGVhZGVycygpfVxyXG4gICAgICAgICAgICB7aGFzRmlsdGVycyA/IG1ha2VGaWx0ZXJzKCkgOiBudWxsfVxyXG4gICAgICAgICAgICA8VGJvZHlDb21wb25lbnRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXModEJvZHlQcm9wcy5jbGFzc05hbWUpfVxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAuLi50Qm9keVByb3BzLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgbWluV2lkdGg6IGAke3Jvd01pbldpZHRofXB4YCxcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIHsuLi50Qm9keVByb3BzLnJlc3R9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7cGFnZVJvd3MubWFwKChkLCBpKSA9PiBtYWtlUGFnZVJvdyhkLCBpKSl9XHJcbiAgICAgICAgICAgICAge3BhZFJvd3MubWFwKG1ha2VQYWRSb3cpfVxyXG4gICAgICAgICAgICA8L1Rib2R5Q29tcG9uZW50PlxyXG4gICAgICAgICAgICB7aGFzQ29sdW1uRm9vdGVyID8gbWFrZUNvbHVtbkZvb3RlcnMoKSA6IG51bGx9XHJcbiAgICAgICAgICA8L1RhYmxlQ29tcG9uZW50PlxyXG4gICAgICAgICAge3Nob3dQYWdpbmF0aW9uICYmIHNob3dQYWdpbmF0aW9uQm90dG9tID8gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2luYXRpb24tYm90dG9tXCI+e3BhZ2luYXRpb259PC9kaXY+XHJcbiAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgIHshcGFnZVJvd3MubGVuZ3RoICYmIChcclxuICAgICAgICAgICAgPE5vRGF0YUNvbXBvbmVudCB7Li4ubm9EYXRhUHJvcHN9PntfLm5vcm1hbGl6ZUNvbXBvbmVudChub0RhdGFUZXh0KX08L05vRGF0YUNvbXBvbmVudD5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgICA8TG9hZGluZ0NvbXBvbmVudCBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkaW5nVGV4dD17bG9hZGluZ1RleHR9IHsuLi5sb2FkaW5nUHJvcHN9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGlsZFByb3BzIGFyZSBvcHRpb25hbGx5IHBhc3NlZCB0byBhIGZ1bmN0aW9uLWFzLWEtY2hpbGRcclxuICAgIHJldHVybiBjaGlsZHJlbiA/IGNoaWxkcmVuKGZpbmFsU3RhdGUsIG1ha2VUYWJsZSwgdGhpcykgOiBtYWtlVGFibGUoKVxyXG4gIH1cclxufVxyXG4iXX0=