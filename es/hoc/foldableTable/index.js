var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import left from './left.svg';
import right from './right.svg';

var defaultFoldIconComponent = function defaultFoldIconComponent(_ref) {
    var collapsed = _ref.collapsed;

    var style = { width: 25 };

    if (collapsed) return React.createElement('img', { src: right, style: style, alt: 'right' });
    return React.createElement('img', { src: left, style: style, alt: 'left' });
};

var defaultFoldButtonComponent = function defaultFoldButtonComponent(_ref2) {
    var header = _ref2.header,
        collapsed = _ref2.collapsed,
        icon = _ref2.icon,
        onClick = _ref2.onClick;

    var style = {
        marginLeft: "0px",
        marginTop: "-5px",
        marginBottom: "-8px",
        float: "left",
        cursor: "pointer"
    };

    return React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { style: style, onClick: onClick },
            icon
        ),
        !collapsed && React.createElement(
            'div',
            null,
            header
        )
    );
};

export default (function (ReactTable) {

    var wrapper = function (_React$Component) {
        _inherits(RTFoldableTable, _React$Component);

        function RTFoldableTable(props, context) {
            _classCallCheck(this, RTFoldableTable);

            var _this = _possibleConstructorReturn(this, (RTFoldableTable.__proto__ || Object.getPrototypeOf(RTFoldableTable)).call(this, props, context));

            _this.onResizedChange = function (resized) {
                var onResizedChange = _this.props.onResizedChange;

                if (onResizedChange) onResizedChange(resized);else _this.setState(function (p) {
                    return { resized: resized };
                });
            };

            _this.removeResized = function (column) {
                var id = column.id;

                if (!id) return;

                var resized = _this.state.resized;

                if (!resized) return;

                var rs = resized.find(function (r) {
                    return r.id === id;
                });
                if (!rs) return;

                var newResized = resized.filter(function (r) {
                    return r !== rs;
                });
                _this.onResizedChange(newResized);
            };

            _this.getWrappedInstance = function () {
                if (!_this.wrappedInstance) console.warn('RTFoldableTable - No wrapped instance');
                if (_this.wrappedInstance.getWrappedInstance) return _this.wrappedInstance.getWrappedInstance();else return _this.wrappedInstance;
            };

            _this.getCopiedKey = function (key) {
                var foldableOriginalKey = _this.props.foldableOriginalKey;

                return '' + foldableOriginalKey + key;
            };

            _this.copyOriginals = function (column) {
                var FoldedColumn = _this.props.FoldedColumn;

                //Stop copy if the column already copied

                if (column.original_Header) return;

                Object.keys(FoldedColumn).forEach(function (k) {
                    var copiedKey = _this.getCopiedKey(k);

                    if (k === "Cell") column[copiedKey] = column[k] ? column[k] : function (c) {
                        return c.value;
                    };else column[copiedKey] = column[k];
                });

                //Copy sub Columns
                if (column.columns && !column.original_Columns) column.original_Columns = column.columns;

                //Copy Header
                if (!column.original_Header) column.original_Header = column.Header;
            };

            _this.restoreToOriginal = function (column) {
                var FoldedColumn = _this.props.FoldedColumn;


                Object.keys(FoldedColumn).forEach(function (k) {
                    //ignore header as handling by foldableHeaderRender
                    if (k === "Header") return;

                    var copiedKey = _this.getCopiedKey(k);
                    column[k] = column[copiedKey];
                });

                if (column.columns && column.original_Columns) column.columns = column.original_Columns;
            };

            _this.getState = function () {
                return _this.props.onFoldChange ? _this.props.folded : _this.state.folded;
            };

            _this.isFolded = function (col) {
                var folded = _this.getState();
                return folded[col.id] === true;
            };

            _this.foldingHandler = function (col) {
                if (!col || !col.id) return;

                var onFoldChange = _this.props.onFoldChange;

                var folded = _this.getState();
                var id = col.id;


                var newFold = Object.assign({}, folded);
                newFold[id] = !newFold[id];

                //Remove the Resized if have
                _this.removeResized(col);

                if (onFoldChange) onFoldChange(newFold);else _this.setState(function (previous) {
                    return { folded: newFold };
                });
            };

            _this.foldableHeaderRender = function (cell) {
                var _this$props = _this.props,
                    FoldButtonComponent = _this$props.FoldButtonComponent,
                    FoldIconComponent = _this$props.FoldIconComponent;
                var column = cell.column;

                var collapsed = _this.isFolded(column);
                var icon = React.createElement(FoldIconComponent, { collapsed: collapsed });
                var onClick = function onClick() {
                    return _this.foldingHandler(column);
                };

                return React.createElement(FoldButtonComponent, { header: column.original_Header, collapsed: collapsed, icon: icon, onClick: onClick });
            };

            _this.applyFoldableForColumn = function (column) {
                var collapsed = _this.isFolded(column);
                var FoldedColumn = _this.props.FoldedColumn;

                //Handle Column Header

                if (column.columns) {
                    if (collapsed) {
                        column.columns = [FoldedColumn];
                        column.width = FoldedColumn.width;
                        column.style = FoldedColumn.style;
                    } else _this.restoreToOriginal(column);
                }
                //Handle Normal Column.
                else if (collapsed) column = Object.assign(column, FoldedColumn);else {
                        _this.restoreToOriginal(column);
                    }
            };

            _this.applyFoldableForColumns = function (columns) {
                return columns.map(function (col, index) {
                    if (!col.foldable) return col;

                    //If col don't have id then generate id based on index
                    if (!col.id) col.id = 'col_' + index;

                    _this.copyOriginals(col);
                    //Replace current header with internal header render.
                    col.Header = function (c) {
                        return _this.foldableHeaderRender(c);
                    };
                    //apply foldable
                    _this.applyFoldableForColumn(col);

                    //return the new column out
                    return col;
                });
            };

            _this.state = {
                folded: props.onFoldChange ? undefined : {},
                resized: props.resized || []
            };
            return _this;
        }

        _createClass(RTFoldableTable, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(newProps) {
                if (this.state.resized !== newProps.resized) this.setState(function (p) {
                    return { resized: newProps.resized };
                });
            }

            // this is so we can expose the underlying ReactTable.

        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    originalCols = _props.columns,
                    FoldButtonComponent = _props.FoldButtonComponent,
                    FoldIconComponent = _props.FoldIconComponent,
                    FoldedColumn = _props.FoldedColumn,
                    rest = _objectWithoutProperties(_props, ['columns', 'FoldButtonComponent', 'FoldIconComponent', 'FoldedColumn']);

                var columns = this.applyFoldableForColumns([].concat(_toConsumableArray(originalCols)));

                var extra = {
                    columns: columns,
                    onResizedChange: this.onResizedChange,
                    resized: this.state.resized
                };

                return React.createElement(ReactTable, _extends({}, rest, extra, { ref: function ref(r) {
                        return _this2.wrappedInstance = r;
                    } }));
            }
        }]);

        return RTFoldableTable;
    }(React.Component);

    wrapper.displayName = 'RTFoldableTable';
    wrapper.defaultProps = {
        FoldIconComponent: defaultFoldIconComponent,
        FoldButtonComponent: defaultFoldButtonComponent,
        foldableOriginalKey: 'original_',
        FoldedColumn: {
            Cell: function Cell(c) {
                return '';
            },
            width: 30,
            sortable: false,
            resizable: false,
            filterable: false
        }
    };

    return wrapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwiUmVhY3RUYWJsZSIsIndyYXBwZXIiLCJwcm9wcyIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwic2V0U3RhdGUiLCJyZW1vdmVSZXNpemVkIiwiaWQiLCJjb2x1bW4iLCJzdGF0ZSIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJjZWxsIiwiRm9sZEJ1dHRvbkNvbXBvbmVudCIsIkZvbGRJY29uQ29tcG9uZW50IiwiY3JlYXRlRWxlbWVudCIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW4iLCJhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyIsIm1hcCIsImluZGV4IiwiZm9sZGFibGUiLCJ1bmRlZmluZWQiLCJuZXdQcm9wcyIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsSUFBUCxNQUFpQixZQUFqQjtBQUNBLE9BQU9DLEtBQVAsTUFBa0IsYUFBbEI7O0FBRUEsSUFBTUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsT0FBbUI7QUFBQSxRQUFoQkMsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUNoRCxRQUFNQyxRQUFRLEVBQUVDLE9BQU8sRUFBVCxFQUFkOztBQUVBLFFBQUlGLFNBQUosRUFDSSxPQUFPLDZCQUFLLEtBQUtGLEtBQVYsRUFBaUIsT0FBT0csS0FBeEIsRUFBK0IsS0FBSSxPQUFuQyxHQUFQO0FBQ0osV0FBTyw2QkFBSyxLQUFLSixJQUFWLEVBQWdCLE9BQU9JLEtBQXZCLEVBQThCLEtBQUksTUFBbEMsR0FBUDtBQUNILENBTkQ7O0FBUUEsSUFBTUUsNkJBQTZCLFNBQTdCQSwwQkFBNkIsUUFBMEM7QUFBQSxRQUF2Q0MsTUFBdUMsU0FBdkNBLE1BQXVDO0FBQUEsUUFBL0JKLFNBQStCLFNBQS9CQSxTQUErQjtBQUFBLFFBQXBCSyxJQUFvQixTQUFwQkEsSUFBb0I7QUFBQSxRQUFkQyxPQUFjLFNBQWRBLE9BQWM7O0FBQ3pFLFFBQU1MLFFBQVE7QUFDVk0sb0JBQVksS0FERjtBQUVWQyxtQkFBVyxNQUZEO0FBR1ZDLHNCQUFjLE1BSEo7QUFJVkMsZUFBTyxNQUpHO0FBS1ZDLGdCQUFRO0FBTEUsS0FBZDs7QUFRQSxXQUFRO0FBQUE7QUFBQTtBQUNKO0FBQUE7QUFBQSxjQUFLLE9BQU9WLEtBQVosRUFBbUIsU0FBU0ssT0FBNUI7QUFDS0Q7QUFETCxT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RSxPQUFQO0FBQ0gsQ0FuTUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGxlZnQgZnJvbSAnLi9sZWZ0LnN2Zyc7XG5pbXBvcnQgcmlnaHQgZnJvbSAnLi9yaWdodC5zdmcnO1xuXG5jb25zdCBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQgPSAoeyBjb2xsYXBzZWQgfSkgPT4ge1xuICAgIGNvbnN0IHN0eWxlID0geyB3aWR0aDogMjUgfTtcblxuICAgIGlmIChjb2xsYXBzZWQpXG4gICAgICAgIHJldHVybiA8aW1nIHNyYz17cmlnaHR9IHN0eWxlPXtzdHlsZX0gYWx0PVwicmlnaHRcIiAvPlxuICAgIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cbn1cblxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgIG1hcmdpbkxlZnQ6IFwiMHB4XCIsXG4gICAgICAgIG1hcmdpblRvcDogXCItNXB4XCIsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogXCItOHB4XCIsXG4gICAgICAgIGZsb2F0OiBcImxlZnRcIixcbiAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIlxuICAgIH07XG5cbiAgICByZXR1cm4gKDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAgICAgIHtpY29ufVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyFjb2xsYXBzZWQgJiYgPGRpdj57aGVhZGVyfTwvZGl2Pn1cbiAgICA8L2Rpdj4pO1xufVxuXG5leHBvcnQgZGVmYXVsdCAoUmVhY3RUYWJsZSkgPT4ge1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJURm9sZGFibGVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgZm9sZGVkOiBwcm9wcy5vbkZvbGRDaGFuZ2UgPyB1bmRlZmluZWQgOiB7fSxcbiAgICAgICAgICAgICAgICByZXNpemVkOiBwcm9wcy5yZXNpemVkIHx8IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUucmVzaXplZCAhPT0gbmV3UHJvcHMucmVzaXplZClcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4geyByZXR1cm4geyByZXNpemVkOiBuZXdQcm9wcy5yZXNpemVkIH0gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvblJlc2l6ZWRDaGFuZ2UgPSByZXNpemVkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgaWYgKG9uUmVzaXplZENoYW5nZSlcbiAgICAgICAgICAgICAgICBvblJlc2l6ZWRDaGFuZ2UocmVzaXplZCk7XG4gICAgICAgICAgICBlbHNlIHRoaXMuc2V0U3RhdGUocCA9PiB7IHJldHVybiB7IHJlc2l6ZWQgfSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVJlc2l6ZWQgPSBjb2x1bW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBpZCB9ID0gY29sdW1uO1xuICAgICAgICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB7IHJlc2l6ZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICBpZiAoIXJlc2l6ZWQpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZCk7XG4gICAgICAgICAgICBpZiAoIXJzKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcihyID0+IHIgIT09IHJzKTtcbiAgICAgICAgICAgIHRoaXMub25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUuXG4gICAgICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRGb2xkYWJsZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpO1xuICAgICAgICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICAgICAgfVxuXG4gICAgICAgIGdldENvcGllZEtleSA9IGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZvbGRhYmxlT3JpZ2luYWxLZXkgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICByZXR1cm4gYCR7Zm9sZGFibGVPcmlnaW5hbEtleX0ke2tleX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29weU9yaWdpbmFscyA9IGNvbHVtbiA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAgICAgLy9TdG9wIGNvcHkgaWYgdGhlIGNvbHVtbiBhbHJlYWR5IGNvcGllZFxuICAgICAgICAgICAgaWYgKGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIHJldHVybjtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspO1xuXG4gICAgICAgICAgICAgICAgaWYgKGsgPT09IFwiQ2VsbFwiKVxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXSA/IGNvbHVtbltrXSA6IGMgPT4gYy52YWx1ZTtcbiAgICAgICAgICAgICAgICBlbHNlIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vQ29weSBzdWIgQ29sdW1uc1xuICAgICAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmICFjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucylcbiAgICAgICAgICAgICAgICBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zO1xuXG4gICAgICAgICAgICAvL0NvcHkgSGVhZGVyXG4gICAgICAgICAgICBpZiAoIWNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpXG4gICAgICAgICAgICAgICAgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgICAgIC8vaWdub3JlIGhlYWRlciBhcyBoYW5kbGluZyBieSBmb2xkYWJsZUhlYWRlclJlbmRlclxuICAgICAgICAgICAgICAgIGlmIChrID09PSBcIkhlYWRlclwiKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKTtcbiAgICAgICAgICAgICAgICBjb2x1bW5ba10gPSBjb2x1bW5bY29waWVkS2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpXG4gICAgICAgICAgICAgICAgY29sdW1uLmNvbHVtbnMgPSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFN0YXRlID0gKCkgPT4gdGhpcy5wcm9wcy5vbkZvbGRDaGFuZ2UgPyB0aGlzLnByb3BzLmZvbGRlZCA6IHRoaXMuc3RhdGUuZm9sZGVkO1xuXG4gICAgICAgIGlzRm9sZGVkID0gY29sID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiBmb2xkZWRbY29sLmlkXSA9PT0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvbGRpbmdIYW5kbGVyID0gY29sID0+IHtcbiAgICAgICAgICAgIGlmICghY29sIHx8ICFjb2wuaWQpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgeyBvbkZvbGRDaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKCk7XG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSBjb2w7XG5cbiAgICAgICAgICAgIGxldCBuZXdGb2xkID0gT2JqZWN0LmFzc2lnbih7fSwgZm9sZGVkKTtcbiAgICAgICAgICAgIG5ld0ZvbGRbaWRdID0gIW5ld0ZvbGRbaWRdO1xuXG4gICAgICAgICAgICAvL1JlbW92ZSB0aGUgUmVzaXplZCBpZiBoYXZlXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVJlc2l6ZWQoY29sKTtcblxuICAgICAgICAgICAgaWYgKG9uRm9sZENoYW5nZSlcbiAgICAgICAgICAgICAgICBvbkZvbGRDaGFuZ2UobmV3Rm9sZCk7XG4gICAgICAgICAgICBlbHNlIHRoaXMuc2V0U3RhdGUocHJldmlvdXMgPT4geyByZXR1cm4geyBmb2xkZWQ6IG5ld0ZvbGQgfTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb2xkYWJsZUhlYWRlclJlbmRlciA9IChjZWxsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50IH0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IGNlbGw7XG4gICAgICAgICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbik7XG4gICAgICAgICAgICBjb25zdCBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkSWNvbkNvbXBvbmVudCwgeyBjb2xsYXBzZWQgfSk7XG4gICAgICAgICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gdGhpcy5mb2xkaW5nSGFuZGxlcihjb2x1bW4pO1xuXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkQnV0dG9uQ29tcG9uZW50LCB7IGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbiA9IGNvbHVtbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbik7XG4gICAgICAgICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAgICAgLy9IYW5kbGUgQ29sdW1uIEhlYWRlclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IFtGb2xkZWRDb2x1bW5dO1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW4ud2lkdGggPSBGb2xkZWRDb2x1bW4ud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5zdHlsZSA9IEZvbGRlZENvbHVtbi5zdHlsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL0hhbmRsZSBOb3JtYWwgQ29sdW1uLlxuICAgICAgICAgICAgZWxzZSBpZiAoY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IE9iamVjdC5hc3NpZ24oY29sdW1uLCBGb2xkZWRDb2x1bW4pO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMgPSBjb2x1bW5zID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW5zLm1hcCgoY29sLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY29sLmZvbGRhYmxlKSByZXR1cm4gY29sO1xuXG4gICAgICAgICAgICAgICAgLy9JZiBjb2wgZG9uJ3QgaGF2ZSBpZCB0aGVuIGdlbmVyYXRlIGlkIGJhc2VkIG9uIGluZGV4XG4gICAgICAgICAgICAgICAgaWYgKCFjb2wuaWQpXG4gICAgICAgICAgICAgICAgICAgIGNvbC5pZCA9IGBjb2xfJHtpbmRleH1gO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5T3JpZ2luYWxzKGNvbCk7XG4gICAgICAgICAgICAgICAgLy9SZXBsYWNlIGN1cnJlbnQgaGVhZGVyIHdpdGggaW50ZXJuYWwgaGVhZGVyIHJlbmRlci5cbiAgICAgICAgICAgICAgICBjb2wuSGVhZGVyID0gYyA9PiB0aGlzLmZvbGRhYmxlSGVhZGVyUmVuZGVyKGMpO1xuICAgICAgICAgICAgICAgIC8vYXBwbHkgZm9sZGFibGVcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW4oY29sKTtcblxuICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRoZSBuZXcgY29sdW1uIG91dFxuICAgICAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29sdW1uczogb3JpZ2luYWxDb2xzLCBGb2xkQnV0dG9uQ29tcG9uZW50LCBGb2xkSWNvbkNvbXBvbmVudCwgRm9sZGVkQ29sdW1uLCAuLi5yZXN0IH0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pO1xuXG4gICAgICAgICAgICBjb25zdCBleHRyYSA9IHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLFxuICAgICAgICAgICAgICAgIG9uUmVzaXplZENoYW5nZTogdGhpcy5vblJlc2l6ZWRDaGFuZ2UsXG4gICAgICAgICAgICAgICAgcmVzaXplZDogdGhpcy5zdGF0ZS5yZXNpemVkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxSZWFjdFRhYmxlIHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiB0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHJ9IC8+XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JURm9sZGFibGVUYWJsZSc7XG4gICAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPVxuICAgICAgICB7XG4gICAgICAgICAgICBGb2xkSWNvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50LFxuICAgICAgICAgICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXG4gICAgICAgICAgICBmb2xkYWJsZU9yaWdpbmFsS2V5OiAnb3JpZ2luYWxfJyxcbiAgICAgICAgICAgIEZvbGRlZENvbHVtbjoge1xuICAgICAgICAgICAgICAgIENlbGw6IGMgPT4gJycsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICByZXR1cm4gd3JhcHBlcjtcbn0iXX0=