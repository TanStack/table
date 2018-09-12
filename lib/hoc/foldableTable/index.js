'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _left = require('./left.svg');

var _left2 = _interopRequireDefault(_left);

var _right = require('./right.svg');

var _right2 = _interopRequireDefault(_right);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultFoldIconComponent = function defaultFoldIconComponent(_ref) {
    var collapsed = _ref.collapsed;

    var style = { width: 25 };

    if (collapsed) return _react2.default.createElement('img', { src: _right2.default, style: style, alt: 'right' });
    return _react2.default.createElement('img', { src: _left2.default, style: style, alt: 'left' });
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

    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { style: style, onClick: onClick },
            icon
        ),
        !collapsed && _react2.default.createElement(
            'div',
            null,
            header
        )
    );
};

exports.default = function (ReactTable) {

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
                var icon = _react2.default.createElement(FoldIconComponent, { collapsed: collapsed });
                var onClick = function onClick() {
                    return _this.foldingHandler(column);
                };

                return _react2.default.createElement(FoldButtonComponent, { header: column.original_Header, collapsed: collapsed, icon: icon, onClick: onClick });
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

                return _react2.default.createElement(ReactTable, _extends({}, rest, extra, { ref: function ref(r) {
                        return _this2.wrappedInstance = r;
                    } }));
            }
        }]);

        return RTFoldableTable;
    }(_react2.default.Component);

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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIlJlYWN0VGFibGUiLCJ3cmFwcGVyIiwicHJvcHMiLCJjb250ZXh0Iiwib25SZXNpemVkQ2hhbmdlIiwicmVzaXplZCIsInNldFN0YXRlIiwicmVtb3ZlUmVzaXplZCIsImlkIiwiY29sdW1uIiwic3RhdGUiLCJycyIsImZpbmQiLCJyIiwibmV3UmVzaXplZCIsImZpbHRlciIsImdldFdyYXBwZWRJbnN0YW5jZSIsIndyYXBwZWRJbnN0YW5jZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0Q29waWVkS2V5IiwiZm9sZGFibGVPcmlnaW5hbEtleSIsImtleSIsImNvcHlPcmlnaW5hbHMiLCJGb2xkZWRDb2x1bW4iLCJvcmlnaW5hbF9IZWFkZXIiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImNvcGllZEtleSIsImsiLCJjIiwidmFsdWUiLCJjb2x1bW5zIiwib3JpZ2luYWxfQ29sdW1ucyIsIkhlYWRlciIsInJlc3RvcmVUb09yaWdpbmFsIiwiZ2V0U3RhdGUiLCJvbkZvbGRDaGFuZ2UiLCJmb2xkZWQiLCJpc0ZvbGRlZCIsImNvbCIsImZvbGRpbmdIYW5kbGVyIiwibmV3Rm9sZCIsImFzc2lnbiIsImZvbGRhYmxlSGVhZGVyUmVuZGVyIiwiY2VsbCIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW4iLCJhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyIsIm1hcCIsImluZGV4IiwiZm9sZGFibGUiLCJ1bmRlZmluZWQiLCJuZXdQcm9wcyIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDJCQUEyQixTQUEzQkEsd0JBQTJCLE9BQW1CO0FBQUEsUUFBaEJDLFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDaEQsUUFBTUMsUUFBUSxFQUFFQyxPQUFPLEVBQVQsRUFBZDs7QUFFQSxRQUFJRixTQUFKLEVBQ0ksT0FBTyx1Q0FBSyxLQUFLRyxlQUFWLEVBQWlCLE9BQU9GLEtBQXhCLEVBQStCLEtBQUksT0FBbkMsR0FBUDtBQUNKLFdBQU8sdUNBQUssS0FBS0csY0FBVixFQUFnQixPQUFPSCxLQUF2QixFQUE4QixLQUFJLE1BQWxDLEdBQVA7QUFDSCxDQU5EOztBQVFBLElBQU1JLDZCQUE2QixTQUE3QkEsMEJBQTZCLFFBQTBDO0FBQUEsUUFBdkNDLE1BQXVDLFNBQXZDQSxNQUF1QztBQUFBLFFBQS9CTixTQUErQixTQUEvQkEsU0FBK0I7QUFBQSxRQUFwQk8sSUFBb0IsU0FBcEJBLElBQW9CO0FBQUEsUUFBZEMsT0FBYyxTQUFkQSxPQUFjOztBQUN6RSxRQUFNUCxRQUFRO0FBQ1ZRLG9CQUFZLEtBREY7QUFFVkMsbUJBQVcsTUFGRDtBQUdWQyxzQkFBYyxNQUhKO0FBSVZDLGVBQU8sTUFKRztBQUtWQyxnQkFBUTtBQUxFLEtBQWQ7O0FBUUEsV0FBUTtBQUFBO0FBQUE7QUFDSjtBQUFBO0FBQUEsY0FBSyxPQUFPWixLQUFaLEVBQW1CLFNBQVNPLE9BQTVCO0FBQ0tEO0FBREwsU0FESTtBQUlILFNBQUNQLFNBQUQsSUFBYztBQUFBO0FBQUE7QUFBTU07QUFBTjtBQUpYLEtB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dCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJztcbmltcG9ydCByaWdodCBmcm9tICcuL3JpZ2h0LnN2Zyc7XG5cbmNvbnN0IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCA9ICh7IGNvbGxhcHNlZCB9KSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB7IHdpZHRoOiAyNSB9O1xuXG4gICAgaWYgKGNvbGxhcHNlZClcbiAgICAgICAgcmV0dXJuIDxpbWcgc3JjPXtyaWdodH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJyaWdodFwiIC8+XG4gICAgcmV0dXJuIDxpbWcgc3JjPXtsZWZ0fSBzdHlsZT17c3R5bGV9IGFsdD1cImxlZnRcIiAvPlxufVxuXG5jb25zdCBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCA9ICh7IGhlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pID0+IHtcbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICAgbWFyZ2luTGVmdDogXCIwcHhcIixcbiAgICAgICAgbWFyZ2luVG9wOiBcIi01cHhcIixcbiAgICAgICAgbWFyZ2luQm90dG9tOiBcIi04cHhcIixcbiAgICAgICAgZmxvYXQ6IFwibGVmdFwiLFxuICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiXG4gICAgfTtcblxuICAgIHJldHVybiAoPGRpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICAgICAge2ljb259XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IWNvbGxhcHNlZCAmJiA8ZGl2PntoZWFkZXJ9PC9kaXY+fVxuICAgIDwvZGl2Pik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChSZWFjdFRhYmxlKSA9PiB7XG5cbiAgICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRGb2xkYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBmb2xkZWQ6IHByb3BzLm9uRm9sZENoYW5nZSA/IHVuZGVmaW5lZCA6IHt9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5yZXNpemVkICE9PSBuZXdQcm9wcy5yZXNpemVkKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiB7IHJldHVybiB7IHJlc2l6ZWQ6IG5ld1Byb3BzLnJlc2l6ZWQgfSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVzaXplZENoYW5nZSA9IHJlc2l6ZWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBpZiAob25SZXNpemVkQ2hhbmdlKVxuICAgICAgICAgICAgICAgIG9uUmVzaXplZENoYW5nZShyZXNpemVkKTtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zZXRTdGF0ZShwID0+IHsgcmV0dXJuIHsgcmVzaXplZCB9IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlUmVzaXplZCA9IGNvbHVtbiA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSBjb2x1bW47XG4gICAgICAgICAgICBpZiAoIWlkKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghcmVzaXplZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBycyA9IHJlc2l6ZWQuZmluZChyID0+IHIuaWQgPT09IGlkKTtcbiAgICAgICAgICAgIGlmICghcnMpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHIgPT4gciAhPT0gcnMpO1xuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZS5cbiAgICAgICAgZ2V0V3JhcHBlZEluc3RhbmNlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJyk7XG4gICAgICAgICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKCk7XG4gICAgICAgICAgICBlbHNlIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxuICAgICAgICB9XG5cbiAgICAgICAgZ2V0Q29waWVkS2V5ID0ga2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIHJldHVybiBgJHtmb2xkYWJsZU9yaWdpbmFsS2V5fSR7a2V5fWA7XG4gICAgICAgIH1cblxuICAgICAgICBjb3B5T3JpZ2luYWxzID0gY29sdW1uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgICAgICAvL1N0b3AgY29weSBpZiB0aGUgY29sdW1uIGFscmVhZHkgY29waWVkXG4gICAgICAgICAgICBpZiAoY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgcmV0dXJuO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoayA9PT0gXCJDZWxsXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdID8gY29sdW1uW2tdIDogYyA9PiBjLnZhbHVlO1xuICAgICAgICAgICAgICAgIGVsc2UgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba107XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9Db3B5IHN1YiBDb2x1bW5zXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgIWNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKVxuICAgICAgICAgICAgICAgIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zID0gY29sdW1uLmNvbHVtbnM7XG5cbiAgICAgICAgICAgIC8vQ29weSBIZWFkZXJcbiAgICAgICAgICAgIGlmICghY29sdW1uLm9yaWdpbmFsX0hlYWRlcilcbiAgICAgICAgICAgICAgICBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyID0gY29sdW1uLkhlYWRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3RvcmVUb09yaWdpbmFsID0gY29sdW1uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XG4gICAgICAgICAgICAgICAgLy9pZ25vcmUgaGVhZGVyIGFzIGhhbmRsaW5nIGJ5IGZvbGRhYmxlSGVhZGVyUmVuZGVyXG4gICAgICAgICAgICAgICAgaWYgKGsgPT09IFwiSGVhZGVyXCIpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspO1xuICAgICAgICAgICAgICAgIGNvbHVtbltrXSA9IGNvbHVtbltjb3BpZWRLZXldO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucylcbiAgICAgICAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U3RhdGUgPSAoKSA9PiB0aGlzLnByb3BzLm9uRm9sZENoYW5nZSA/IHRoaXMucHJvcHMuZm9sZGVkIDogdGhpcy5zdGF0ZS5mb2xkZWQ7XG5cbiAgICAgICAgaXNGb2xkZWQgPSBjb2wgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZvbGRlZFtjb2wuaWRdID09PSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9sZGluZ0hhbmRsZXIgPSBjb2wgPT4ge1xuICAgICAgICAgICAgaWYgKCFjb2wgfHwgIWNvbC5pZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB7IG9uRm9sZENoYW5nZSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbDtcblxuICAgICAgICAgICAgbGV0IG5ld0ZvbGQgPSBPYmplY3QuYXNzaWduKHt9LCBmb2xkZWQpO1xuICAgICAgICAgICAgbmV3Rm9sZFtpZF0gPSAhbmV3Rm9sZFtpZF07XG5cbiAgICAgICAgICAgIC8vUmVtb3ZlIHRoZSBSZXNpemVkIGlmIGhhdmVcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUmVzaXplZChjb2wpO1xuXG4gICAgICAgICAgICBpZiAob25Gb2xkQ2hhbmdlKVxuICAgICAgICAgICAgICAgIG9uRm9sZENoYW5nZShuZXdGb2xkKTtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiB7IHJldHVybiB7IGZvbGRlZDogbmV3Rm9sZCB9OyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvbGRhYmxlSGVhZGVyUmVuZGVyID0gKGNlbGwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZEJ1dHRvbkNvbXBvbmVudCwgRm9sZEljb25Db21wb25lbnQgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCB7IGNvbHVtbiB9ID0gY2VsbDtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKTtcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRJY29uQ29tcG9uZW50LCB7IGNvbGxhcHNlZCB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB0aGlzLmZvbGRpbmdIYW5kbGVyKGNvbHVtbik7XG5cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRCdXR0b25Db21wb25lbnQsIHsgaGVhZGVyOiBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyLCBjb2xsYXBzZWQsIGljb24sIG9uQ2xpY2sgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1uID0gY29sdW1uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKTtcbiAgICAgICAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgICAgICAvL0hhbmRsZSBDb2x1bW4gSGVhZGVyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5jb2x1bW5zID0gW0ZvbGRlZENvbHVtbl07XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLnN0eWxlID0gRm9sZGVkQ29sdW1uLnN0eWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vSGFuZGxlIE5vcm1hbCBDb2x1bW4uXG4gICAgICAgICAgICBlbHNlIGlmIChjb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgY29sdW1uID0gT2JqZWN0LmFzc2lnbihjb2x1bW4sIEZvbGRlZENvbHVtbik7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyA9IGNvbHVtbnMgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb2wuZm9sZGFibGUpIHJldHVybiBjb2w7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGNvbCBkb24ndCBoYXZlIGlkIHRoZW4gZ2VuZXJhdGUgaWQgYmFzZWQgb24gaW5kZXhcbiAgICAgICAgICAgICAgICBpZiAoIWNvbC5pZClcbiAgICAgICAgICAgICAgICAgICAgY29sLmlkID0gYGNvbF8ke2luZGV4fWA7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKTtcbiAgICAgICAgICAgICAgICAvL1JlcGxhY2UgY3VycmVudCBoZWFkZXIgd2l0aCBpbnRlcm5hbCBoZWFkZXIgcmVuZGVyLlxuICAgICAgICAgICAgICAgIGNvbC5IZWFkZXIgPSBjID0+IHRoaXMuZm9sZGFibGVIZWFkZXJSZW5kZXIoYyk7XG4gICAgICAgICAgICAgICAgLy9hcHBseSBmb2xkYWJsZVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbihjb2wpO1xuXG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gdGhlIG5ldyBjb2x1bW4gb3V0XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgY29uc3QgeyBjb2x1bW5zOiBvcmlnaW5hbENvbHMsIEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50LCBGb2xkZWRDb2x1bW4sIC4uLnJlc3QgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1ucyhbLi4ub3JpZ2luYWxDb2xzXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4dHJhID0ge1xuICAgICAgICAgICAgICAgIGNvbHVtbnMsXG4gICAgICAgICAgICAgICAgb25SZXNpemVkQ2hhbmdlOiB0aGlzLm9uUmVzaXplZENoYW5nZSxcbiAgICAgICAgICAgICAgICByZXNpemVkOiB0aGlzLnN0YXRlLnJlc2l6ZWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFJlYWN0VGFibGUgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+IHRoaXMud3JhcHBlZEluc3RhbmNlID0gcn0gLz5cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyYXBwZXIuZGlzcGxheU5hbWUgPSAnUlRGb2xkYWJsZVRhYmxlJztcbiAgICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIEZvbGRJY29uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQsXG4gICAgICAgICAgICBGb2xkQnV0dG9uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCxcbiAgICAgICAgICAgIGZvbGRhYmxlT3JpZ2luYWxLZXk6ICdvcmlnaW5hbF8nLFxuICAgICAgICAgICAgRm9sZGVkQ29sdW1uOiB7XG4gICAgICAgICAgICAgICAgQ2VsbDogYyA9PiAnJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIHJldHVybiB3cmFwcGVyO1xufSJdfQ==