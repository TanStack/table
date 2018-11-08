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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */

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
    marginLeft: '0px',
    marginTop: '-5px',
    marginBottom: '-8px',
    float: 'left',
    cursor: 'pointer'
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
      { style: { "textAlign": "left" } },
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

        if (onResizedChange) onResizedChange(resized);else {
          _this.setState(function (p) {
            return { resized: resized };
          });
        }
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
        if (_this.wrappedInstance.getWrappedInstance) return _this.wrappedInstance.getWrappedInstance();
        return _this.wrappedInstance;
      };

      _this.getCopiedKey = function (key) {
        var foldableOriginalKey = _this.props.foldableOriginalKey;

        return '' + foldableOriginalKey + key;
      };

      _this.copyOriginals = function (column) {
        var FoldedColumn = _this.props.FoldedColumn;

        // Stop copy if the column already copied

        if (column.original_Header) return;

        Object.keys(FoldedColumn).forEach(function (k) {
          var copiedKey = _this.getCopiedKey(k);

          if (k === 'Cell') column[copiedKey] = column[k] ? column[k] : function (c) {
            return c.value;
          };else column[copiedKey] = column[k];
        });

        // Copy sub Columns
        if (column.columns && !column.original_Columns) column.original_Columns = column.columns;

        // Copy Header
        if (!column.original_Header) column.original_Header = column.Header;
      };

      _this.restoreToOriginal = function (column) {
        var FoldedColumn = _this.props.FoldedColumn;


        Object.keys(FoldedColumn).forEach(function (k) {
          // ignore header as handling by foldableHeaderRender
          if (k === 'Header') return;

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

        // Remove the Resized if have
        _this.removeResized(col);

        if (onFoldChange) onFoldChange(newFold);else {
          _this.setState(function (previous) {
            return { folded: newFold };
          });
        }
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

        return _react2.default.createElement(FoldButtonComponent, {
          header: column.original_Header,
          collapsed: collapsed,
          icon: icon,
          onClick: onClick
        });
      };

      _this.applyFoldableForColumn = function (column) {
        var collapsed = _this.isFolded(column);
        var FoldedColumn = _this.props.FoldedColumn;

        // Handle Column Header

        if (column.columns) {
          if (collapsed) {
            column.columns = [FoldedColumn];
            column.width = FoldedColumn.width;
            column.style = FoldedColumn.style;
          } else _this.restoreToOriginal(column);
        }
        // Handle Normal Column.
        else if (collapsed) column = Object.assign(column, FoldedColumn);else {
            _this.restoreToOriginal(column);
          }
      };

      _this.applyFoldableForColumns = function (columns) {
        return columns.map(function (col, index) {
          if (!col.foldable) return col;

          // If col don't have id then generate id based on index
          if (!col.id) col.id = 'col_' + index;

          _this.copyOriginals(col);
          // Replace current header with internal header render.
          col.Header = function (c) {
            return _this.foldableHeaderRender(c);
          };
          // apply foldable
          _this.applyFoldableForColumn(col);

          // return the new column out
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
        if (this.state.resized !== newProps.resized) {
          this.setState(function (p) {
            return { resized: newProps.resized };
          });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIndyYXBwZXIiLCJwcm9wcyIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwic2V0U3RhdGUiLCJyZW1vdmVSZXNpemVkIiwiaWQiLCJjb2x1bW4iLCJzdGF0ZSIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJGb2xkQnV0dG9uQ29tcG9uZW50IiwiRm9sZEljb25Db21wb25lbnQiLCJjZWxsIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OzsrZUFKQTs7QUFNQSxJQUFNQSwyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sdUNBQUssS0FBS0csZUFBVixFQUFpQixPQUFPRixLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLHVDQUFLLEtBQUtHLGNBQVYsRUFBZ0IsT0FBT0gsS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNSSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQk4sU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJPLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTVAsUUFBUTtBQUNaUSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9aLEtBQVosRUFBbUIsU0FBU08sT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcsS0FBQ1AsU0FBRCxJQUFjO0FBQUE7QUFBQSxRQUFLLE9BQU8sRUFBQyxhQUFhLE1BQWQsRUFB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O0FBQ0Y7O0FBd0JEOztBQXRDSTtBQUFBO0FBQUEsK0JBaUtLO0FBQUE7O0FBQUEscUJBT0gsS0FBS0gsS0FQRjtBQUFBLFlBRUl3RCxZQUZKLFVBRUx6QixPQUZLO0FBQUEsWUFHTGEsbUJBSEssVUFHTEEsbUJBSEs7QUFBQSxZQUlMQyxpQkFKSyxVQUlMQSxpQkFKSztBQUFBLFlBS0x2QixZQUxLLFVBS0xBLFlBTEs7QUFBQSxZQU1GbUMsSUFORTs7QUFRUCxZQUFNMUIsVUFBVSxLQUFLbUIsdUJBQUwsOEJBQWlDTSxZQUFqQyxHQUFoQjs7QUFFQSxZQUFNRSxRQUFRO0FBQ1ozQiwwQkFEWTtBQUVaN0IsMkJBQWlCLEtBQUtBLGVBRlY7QUFHWkMsbUJBQVMsS0FBS0ssS0FBTCxDQUFXTDtBQUhSLFNBQWQ7O0FBTUEsZUFBTyw4QkFBQyxVQUFELGVBQWdCc0QsSUFBaEIsRUFBMEJDLEtBQTFCLElBQWlDLEtBQUs7QUFBQSxtQkFBTSxPQUFLM0MsZUFBTCxHQUF1QkosQ0FBN0I7QUFBQSxXQUF0QyxJQUFQO0FBQ0Q7QUFsTEc7O0FBQUE7QUFBQSxJQUF3Q29DLGdCQUFNWSxTQUE5QyxDQUFOOztBQXFMQTVELFVBQVE2RCxXQUFSLEdBQXNCLGlCQUF0QjtBQUNBN0QsVUFBUThELFlBQVIsR0FBdUI7QUFDckJoQix1QkFBbUI3RCx3QkFERTtBQUVyQjRELHlCQUFxQnRELDBCQUZBO0FBR3JCNkIseUJBQXFCLFdBSEE7QUFJckJHLGtCQUFjO0FBQ1p3QyxZQUFNO0FBQUEsZUFBSyxFQUFMO0FBQUEsT0FETTtBQUVaM0UsYUFBTyxFQUZLO0FBR1o0RSxnQkFBVSxLQUhFO0FBSVpDLGlCQUFXLEtBSkM7QUFLWkMsa0JBQVk7QUFMQTtBQUpPLEdBQXZCOztBQWFBLFNBQU9sRSxPQUFQO0FBQ0QsQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBsZWZ0IGZyb20gJy4vbGVmdC5zdmcnXHJcbmltcG9ydCByaWdodCBmcm9tICcuL3JpZ2h0LnN2ZydcclxuXHJcbmNvbnN0IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCA9ICh7IGNvbGxhcHNlZCB9KSA9PiB7XHJcbiAgY29uc3Qgc3R5bGUgPSB7IHdpZHRoOiAyNSB9XHJcblxyXG4gIGlmIChjb2xsYXBzZWQpIHJldHVybiA8aW1nIHNyYz17cmlnaHR9IHN0eWxlPXtzdHlsZX0gYWx0PVwicmlnaHRcIiAvPlxyXG4gIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cclxufVxyXG5cclxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XHJcbiAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBtYXJnaW5MZWZ0OiAnMHB4JyxcclxuICAgIG1hcmdpblRvcDogJy01cHgnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAnLThweCcsXHJcbiAgICBmbG9hdDogJ2xlZnQnLFxyXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxyXG4gICAgICAgIHtpY29ufVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgeyFjb2xsYXBzZWQgJiYgPGRpdiBzdHlsZT17e1widGV4dEFsaWduXCI6IFwibGVmdFwifX0gPntoZWFkZXJ9PC9kaXY+fVxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWFjdFRhYmxlID0+IHtcclxuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRGb2xkYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KVxyXG5cclxuICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICBmb2xkZWQ6IHByb3BzLm9uRm9sZENoYW5nZSA/IHVuZGVmaW5lZCA6IHt9LFxyXG4gICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW10sXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLnJlc2l6ZWQgIT09IG5ld1Byb3BzLnJlc2l6ZWQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4gKHsgcmVzaXplZDogbmV3UHJvcHMucmVzaXplZCB9KSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVzaXplZENoYW5nZSA9IHJlc2l6ZWQgPT4ge1xyXG4gICAgICBjb25zdCB7IG9uUmVzaXplZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBpZiAob25SZXNpemVkQ2hhbmdlKSBvblJlc2l6ZWRDaGFuZ2UocmVzaXplZClcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwID0+ICh7IHJlc2l6ZWQgfSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVSZXNpemVkID0gY29sdW1uID0+IHtcclxuICAgICAgY29uc3QgeyBpZCB9ID0gY29sdW1uXHJcbiAgICAgIGlmICghaWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgeyByZXNpemVkIH0gPSB0aGlzLnN0YXRlXHJcbiAgICAgIGlmICghcmVzaXplZCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBycyA9IHJlc2l6ZWQuZmluZChyID0+IHIuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIXJzKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcihyID0+IHIgIT09IHJzKVxyXG4gICAgICB0aGlzLm9uUmVzaXplZENoYW5nZShuZXdSZXNpemVkKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgc28gd2UgY2FuIGV4cG9zZSB0aGUgdW5kZXJseWluZyBSZWFjdFRhYmxlLlxyXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSBjb25zb2xlLndhcm4oJ1JURm9sZGFibGVUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKVxyXG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcclxuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29waWVkS2V5ID0ga2V5ID0+IHtcclxuICAgICAgY29uc3QgeyBmb2xkYWJsZU9yaWdpbmFsS2V5IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIHJldHVybiBgJHtmb2xkYWJsZU9yaWdpbmFsS2V5fSR7a2V5fWBcclxuICAgIH1cclxuXHJcbiAgICBjb3B5T3JpZ2luYWxzID0gY29sdW1uID0+IHtcclxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIC8vIFN0b3AgY29weSBpZiB0aGUgY29sdW1uIGFscmVhZHkgY29waWVkXHJcbiAgICAgIGlmIChjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSByZXR1cm5cclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKEZvbGRlZENvbHVtbikuZm9yRWFjaChrID0+IHtcclxuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxyXG5cclxuICAgICAgICBpZiAoayA9PT0gJ0NlbGwnKSBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXSA/IGNvbHVtbltrXSA6IGMgPT4gYy52YWx1ZVxyXG4gICAgICAgIGVsc2UgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba11cclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIENvcHkgc3ViIENvbHVtbnNcclxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmICFjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucykgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMgPSBjb2x1bW4uY29sdW1uc1xyXG5cclxuICAgICAgLy8gQ29weSBIZWFkZXJcclxuICAgICAgaWYgKCFjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyID0gY29sdW1uLkhlYWRlclxyXG4gICAgfVxyXG5cclxuICAgIHJlc3RvcmVUb09yaWdpbmFsID0gY29sdW1uID0+IHtcclxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKEZvbGRlZENvbHVtbikuZm9yRWFjaChrID0+IHtcclxuICAgICAgICAvLyBpZ25vcmUgaGVhZGVyIGFzIGhhbmRsaW5nIGJ5IGZvbGRhYmxlSGVhZGVyUmVuZGVyXHJcbiAgICAgICAgaWYgKGsgPT09ICdIZWFkZXInKSByZXR1cm5cclxuXHJcbiAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoaylcclxuICAgICAgICBjb2x1bW5ba10gPSBjb2x1bW5bY29waWVkS2V5XVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKSBjb2x1bW4uY29sdW1ucyA9IGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RhdGUgPSAoKSA9PiAodGhpcy5wcm9wcy5vbkZvbGRDaGFuZ2UgPyB0aGlzLnByb3BzLmZvbGRlZCA6IHRoaXMuc3RhdGUuZm9sZGVkKVxyXG5cclxuICAgIGlzRm9sZGVkID0gY29sID0+IHtcclxuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXHJcbiAgICAgIHJldHVybiBmb2xkZWRbY29sLmlkXSA9PT0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIGZvbGRpbmdIYW5kbGVyID0gY29sID0+IHtcclxuICAgICAgaWYgKCFjb2wgfHwgIWNvbC5pZCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCB7IG9uRm9sZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKClcclxuICAgICAgY29uc3QgeyBpZCB9ID0gY29sXHJcblxyXG4gICAgICBjb25zdCBuZXdGb2xkID0gT2JqZWN0LmFzc2lnbih7fSwgZm9sZGVkKVxyXG4gICAgICBuZXdGb2xkW2lkXSA9ICFuZXdGb2xkW2lkXVxyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRoZSBSZXNpemVkIGlmIGhhdmVcclxuICAgICAgdGhpcy5yZW1vdmVSZXNpemVkKGNvbClcclxuXHJcbiAgICAgIGlmIChvbkZvbGRDaGFuZ2UpIG9uRm9sZENoYW5nZShuZXdGb2xkKVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZpb3VzID0+ICh7IGZvbGRlZDogbmV3Rm9sZCB9KSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvbGRhYmxlSGVhZGVyUmVuZGVyID0gY2VsbCA9PiB7XHJcbiAgICAgIGNvbnN0IHsgRm9sZEJ1dHRvbkNvbXBvbmVudCwgRm9sZEljb25Db21wb25lbnQgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IGNlbGxcclxuICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5pc0ZvbGRlZChjb2x1bW4pXHJcbiAgICAgIGNvbnN0IGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRJY29uQ29tcG9uZW50LCB7IGNvbGxhcHNlZCB9KVxyXG4gICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gdGhpcy5mb2xkaW5nSGFuZGxlcihjb2x1bW4pXHJcblxyXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkQnV0dG9uQ29tcG9uZW50LCB7XHJcbiAgICAgICAgaGVhZGVyOiBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyLFxyXG4gICAgICAgIGNvbGxhcHNlZCxcclxuICAgICAgICBpY29uLFxyXG4gICAgICAgIG9uQ2xpY2ssXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbiA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxyXG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgLy8gSGFuZGxlIENvbHVtbiBIZWFkZXJcclxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xyXG4gICAgICAgICAgY29sdW1uLmNvbHVtbnMgPSBbRm9sZGVkQ29sdW1uXVxyXG4gICAgICAgICAgY29sdW1uLndpZHRoID0gRm9sZGVkQ29sdW1uLndpZHRoXHJcbiAgICAgICAgICBjb2x1bW4uc3R5bGUgPSBGb2xkZWRDb2x1bW4uc3R5bGVcclxuICAgICAgICB9IGVsc2UgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pXHJcbiAgICAgIH1cclxuICAgICAgLy8gSGFuZGxlIE5vcm1hbCBDb2x1bW4uXHJcbiAgICAgIGVsc2UgaWYgKGNvbGxhcHNlZCkgY29sdW1uID0gT2JqZWN0LmFzc2lnbihjb2x1bW4sIEZvbGRlZENvbHVtbilcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyA9IGNvbHVtbnMgPT5cclxuICAgICAgY29sdW1ucy5tYXAoKGNvbCwgaW5kZXgpID0+IHtcclxuICAgICAgICBpZiAoIWNvbC5mb2xkYWJsZSkgcmV0dXJuIGNvbFxyXG5cclxuICAgICAgICAvLyBJZiBjb2wgZG9uJ3QgaGF2ZSBpZCB0aGVuIGdlbmVyYXRlIGlkIGJhc2VkIG9uIGluZGV4XHJcbiAgICAgICAgaWYgKCFjb2wuaWQpIGNvbC5pZCA9IGBjb2xfJHtpbmRleH1gXHJcblxyXG4gICAgICAgIHRoaXMuY29weU9yaWdpbmFscyhjb2wpXHJcbiAgICAgICAgLy8gUmVwbGFjZSBjdXJyZW50IGhlYWRlciB3aXRoIGludGVybmFsIGhlYWRlciByZW5kZXIuXHJcbiAgICAgICAgY29sLkhlYWRlciA9IGMgPT4gdGhpcy5mb2xkYWJsZUhlYWRlclJlbmRlcihjKVxyXG4gICAgICAgIC8vIGFwcGx5IGZvbGRhYmxlXHJcbiAgICAgICAgdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1uKGNvbClcclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBuZXcgY29sdW1uIG91dFxyXG4gICAgICAgIHJldHVybiBjb2xcclxuICAgICAgfSlcclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zOiBvcmlnaW5hbENvbHMsXHJcbiAgICAgICAgRm9sZEJ1dHRvbkNvbXBvbmVudCxcclxuICAgICAgICBGb2xkSWNvbkNvbXBvbmVudCxcclxuICAgICAgICBGb2xkZWRDb2x1bW4sXHJcbiAgICAgICAgLi4ucmVzdFxyXG4gICAgICB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1ucyhbLi4ub3JpZ2luYWxDb2xzXSlcclxuXHJcbiAgICAgIGNvbnN0IGV4dHJhID0ge1xyXG4gICAgICAgIGNvbHVtbnMsXHJcbiAgICAgICAgb25SZXNpemVkQ2hhbmdlOiB0aGlzLm9uUmVzaXplZENoYW5nZSxcclxuICAgICAgICByZXNpemVkOiB0aGlzLnN0YXRlLnJlc2l6ZWQsXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiA8UmVhY3RUYWJsZSB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JURm9sZGFibGVUYWJsZSdcclxuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcclxuICAgIEZvbGRJY29uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQsXHJcbiAgICBGb2xkQnV0dG9uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCxcclxuICAgIGZvbGRhYmxlT3JpZ2luYWxLZXk6ICdvcmlnaW5hbF8nLFxyXG4gICAgRm9sZGVkQ29sdW1uOiB7XHJcbiAgICAgIENlbGw6IGMgPT4gJycsXHJcbiAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgICBmaWx0ZXJhYmxlOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgfVxyXG5cclxuICByZXR1cm4gd3JhcHBlclxyXG59XHJcbiJdfQ==