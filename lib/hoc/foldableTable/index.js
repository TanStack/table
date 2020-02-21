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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIndyYXBwZXIiLCJwcm9wcyIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwic2V0U3RhdGUiLCJyZW1vdmVSZXNpemVkIiwiaWQiLCJjb2x1bW4iLCJzdGF0ZSIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJGb2xkQnV0dG9uQ29tcG9uZW50IiwiRm9sZEljb25Db21wb25lbnQiLCJjZWxsIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OzsrZUFKQTs7QUFNQSxJQUFNQSwyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sdUNBQUssS0FBS0csZUFBVixFQUFpQixPQUFPRixLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLHVDQUFLLEtBQUtHLGNBQVYsRUFBZ0IsT0FBT0gsS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNSSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQk4sU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJPLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTVAsUUFBUTtBQUNaUSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9aLEtBQVosRUFBbUIsU0FBU08sT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcsS0FBQ1AsU0FBRCxJQUFjO0FBQUE7QUFBQTtBQUFNTTtBQUFOO0FBSmpCLEdBREY7QUFRRCxD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QWlLSztBQUFBOztBQUFBLHFCQU9ILEtBQUtILEtBUEY7QUFBQSxZQUVJd0QsWUFGSixVQUVMekIsT0FGSztBQUFBLFlBR0xhLG1CQUhLLFVBR0xBLG1CQUhLO0FBQUEsWUFJTEMsaUJBSkssVUFJTEEsaUJBSks7QUFBQSxZQUtMdkIsWUFMSyxVQUtMQSxZQUxLO0FBQUEsWUFNRm1DLElBTkU7O0FBUVAsWUFBTTFCLFVBQVUsS0FBS21CLHVCQUFMLDhCQUFpQ00sWUFBakMsR0FBaEI7O0FBRUEsWUFBTUUsUUFBUTtBQUNaM0IsMEJBRFk7QUFFWjdCLDJCQUFpQixLQUFLQSxlQUZWO0FBR1pDLG1CQUFTLEtBQUtLLEtBQUwsQ0FBV0w7QUFIUixTQUFkOztBQU1BLGVBQU8sOEJBQUMsVUFBRCxlQUFnQnNELElBQWhCLEVBQTBCQyxLQUExQixJQUFpQyxLQUFLO0FBQUEsbUJBQU0sT0FBSzNDLGVBQUwsR0FBdUJKLENBQTdCO0FBQUEsV0FBdEMsSUFBUDtBQUNEO0FBbExHOztBQUFBO0FBQUEsSUFBd0NvQyxnQkFBTVksU0FBOUMsQ0FBTjs7QUFxTEE1RCxVQUFRNkQsV0FBUixHQUFzQixpQkFBdEI7QUFDQTdELFVBQVE4RCxZQUFSLEdBQXVCO0FBQ3JCaEIsdUJBQW1CN0Qsd0JBREU7QUFFckI0RCx5QkFBcUJ0RCwwQkFGQTtBQUdyQjZCLHlCQUFxQixXQUhBO0FBSXJCRyxrQkFBYztBQUNad0MsWUFBTTtBQUFBLGVBQUssRUFBTDtBQUFBLE9BRE07QUFFWjNFLGFBQU8sRUFGSztBQUdaNEUsZ0JBQVUsS0FIRTtBQUlaQyxpQkFBVyxLQUpDO0FBS1pDLGtCQUFZO0FBTEE7QUFKTyxHQUF2Qjs7QUFhQSxTQUFPbEUsT0FBUDtBQUNELEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJ1xuaW1wb3J0IHJpZ2h0IGZyb20gJy4vcmlnaHQuc3ZnJ1xuXG5jb25zdCBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQgPSAoeyBjb2xsYXBzZWQgfSkgPT4ge1xuICBjb25zdCBzdHlsZSA9IHsgd2lkdGg6IDI1IH1cblxuICBpZiAoY29sbGFwc2VkKSByZXR1cm4gPGltZyBzcmM9e3JpZ2h0fSBzdHlsZT17c3R5bGV9IGFsdD1cInJpZ2h0XCIgLz5cbiAgcmV0dXJuIDxpbWcgc3JjPXtsZWZ0fSBzdHlsZT17c3R5bGV9IGFsdD1cImxlZnRcIiAvPlxufVxuXG5jb25zdCBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCA9ICh7IGhlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB7XG4gICAgbWFyZ2luTGVmdDogJzBweCcsXG4gICAgbWFyZ2luVG9wOiAnLTVweCcsXG4gICAgbWFyZ2luQm90dG9tOiAnLThweCcsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAge2ljb259XG4gICAgICA8L2Rpdj5cbiAgICAgIHshY29sbGFwc2VkICYmIDxkaXY+e2hlYWRlcn08L2Rpdj59XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RUYWJsZSA9PiB7XG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVEZvbGRhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dClcblxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZm9sZGVkOiBwcm9wcy5vbkZvbGRDaGFuZ2UgPyB1bmRlZmluZWQgOiB7fSxcbiAgICAgICAgcmVzaXplZDogcHJvcHMucmVzaXplZCB8fCBbXSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5yZXNpemVkICE9PSBuZXdQcm9wcy5yZXNpemVkKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiAoeyByZXNpemVkOiBuZXdQcm9wcy5yZXNpemVkIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uUmVzaXplZENoYW5nZSA9IHJlc2l6ZWQgPT4ge1xuICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcbiAgICAgIGlmIChvblJlc2l6ZWRDaGFuZ2UpIG9uUmVzaXplZENoYW5nZShyZXNpemVkKVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiAoeyByZXNpemVkIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVJlc2l6ZWQgPSBjb2x1bW4gPT4ge1xuICAgICAgY29uc3QgeyBpZCB9ID0gY29sdW1uXG4gICAgICBpZiAoIWlkKSByZXR1cm5cblxuICAgICAgY29uc3QgeyByZXNpemVkIH0gPSB0aGlzLnN0YXRlXG4gICAgICBpZiAoIXJlc2l6ZWQpIHJldHVyblxuXG4gICAgICBjb25zdCBycyA9IHJlc2l6ZWQuZmluZChyID0+IHIuaWQgPT09IGlkKVxuICAgICAgaWYgKCFycykgcmV0dXJuXG5cbiAgICAgIGNvbnN0IG5ld1Jlc2l6ZWQgPSByZXNpemVkLmZpbHRlcihyID0+IHIgIT09IHJzKVxuICAgICAgdGhpcy5vblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZClcbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZS5cbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSBjb25zb2xlLndhcm4oJ1JURm9sZGFibGVUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKVxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICB9XG5cbiAgICBnZXRDb3BpZWRLZXkgPSBrZXkgPT4ge1xuICAgICAgY29uc3QgeyBmb2xkYWJsZU9yaWdpbmFsS2V5IH0gPSB0aGlzLnByb3BzXG4gICAgICByZXR1cm4gYCR7Zm9sZGFibGVPcmlnaW5hbEtleX0ke2tleX1gXG4gICAgfVxuXG4gICAgY29weU9yaWdpbmFscyA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICAvLyBTdG9wIGNvcHkgaWYgdGhlIGNvbHVtbiBhbHJlYWR5IGNvcGllZFxuICAgICAgaWYgKGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIHJldHVyblxuXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XG4gICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspXG5cbiAgICAgICAgaWYgKGsgPT09ICdDZWxsJykgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba10gPyBjb2x1bW5ba10gOiBjID0+IGMudmFsdWVcbiAgICAgICAgZWxzZSBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXVxuICAgICAgfSlcblxuICAgICAgLy8gQ29weSBzdWIgQ29sdW1uc1xuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmICFjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucykgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMgPSBjb2x1bW4uY29sdW1uc1xuXG4gICAgICAvLyBDb3B5IEhlYWRlclxuICAgICAgaWYgKCFjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyID0gY29sdW1uLkhlYWRlclxuICAgIH1cblxuICAgIHJlc3RvcmVUb09yaWdpbmFsID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIE9iamVjdC5rZXlzKEZvbGRlZENvbHVtbikuZm9yRWFjaChrID0+IHtcbiAgICAgICAgLy8gaWdub3JlIGhlYWRlciBhcyBoYW5kbGluZyBieSBmb2xkYWJsZUhlYWRlclJlbmRlclxuICAgICAgICBpZiAoayA9PT0gJ0hlYWRlcicpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspXG4gICAgICAgIGNvbHVtbltrXSA9IGNvbHVtbltjb3BpZWRLZXldXG4gICAgICB9KVxuXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5jb2x1bW5zID0gY29sdW1uLm9yaWdpbmFsX0NvbHVtbnNcbiAgICB9XG5cbiAgICBnZXRTdGF0ZSA9ICgpID0+ICh0aGlzLnByb3BzLm9uRm9sZENoYW5nZSA/IHRoaXMucHJvcHMuZm9sZGVkIDogdGhpcy5zdGF0ZS5mb2xkZWQpXG5cbiAgICBpc0ZvbGRlZCA9IGNvbCA9PiB7XG4gICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKClcbiAgICAgIHJldHVybiBmb2xkZWRbY29sLmlkXSA9PT0gdHJ1ZVxuICAgIH1cblxuICAgIGZvbGRpbmdIYW5kbGVyID0gY29sID0+IHtcbiAgICAgIGlmICghY29sIHx8ICFjb2wuaWQpIHJldHVyblxuXG4gICAgICBjb25zdCB7IG9uRm9sZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICBjb25zdCB7IGlkIH0gPSBjb2xcblxuICAgICAgY29uc3QgbmV3Rm9sZCA9IE9iamVjdC5hc3NpZ24oe30sIGZvbGRlZClcbiAgICAgIG5ld0ZvbGRbaWRdID0gIW5ld0ZvbGRbaWRdXG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgUmVzaXplZCBpZiBoYXZlXG4gICAgICB0aGlzLnJlbW92ZVJlc2l6ZWQoY29sKVxuXG4gICAgICBpZiAob25Gb2xkQ2hhbmdlKSBvbkZvbGRDaGFuZ2UobmV3Rm9sZClcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZpb3VzID0+ICh7IGZvbGRlZDogbmV3Rm9sZCB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb2xkYWJsZUhlYWRlclJlbmRlciA9IGNlbGwgPT4ge1xuICAgICAgY29uc3QgeyBGb2xkQnV0dG9uQ29tcG9uZW50LCBGb2xkSWNvbkNvbXBvbmVudCB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IGNlbGxcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxuICAgICAgY29uc3QgaWNvbiA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEljb25Db21wb25lbnQsIHsgY29sbGFwc2VkIH0pXG4gICAgICBjb25zdCBvbkNsaWNrID0gKCkgPT4gdGhpcy5mb2xkaW5nSGFuZGxlcihjb2x1bW4pXG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRCdXR0b25Db21wb25lbnQsIHtcbiAgICAgICAgaGVhZGVyOiBjb2x1bW4ub3JpZ2luYWxfSGVhZGVyLFxuICAgICAgICBjb2xsYXBzZWQsXG4gICAgICAgIGljb24sXG4gICAgICAgIG9uQ2xpY2ssXG4gICAgICB9KVxuICAgIH1cblxuICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW4gPSBjb2x1bW4gPT4ge1xuICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5pc0ZvbGRlZChjb2x1bW4pXG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICAvLyBIYW5kbGUgQ29sdW1uIEhlYWRlclxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgIGlmIChjb2xsYXBzZWQpIHtcbiAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IFtGb2xkZWRDb2x1bW5dXG4gICAgICAgICAgY29sdW1uLndpZHRoID0gRm9sZGVkQ29sdW1uLndpZHRoXG4gICAgICAgICAgY29sdW1uLnN0eWxlID0gRm9sZGVkQ29sdW1uLnN0eWxlXG4gICAgICAgIH0gZWxzZSB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbilcbiAgICAgIH1cbiAgICAgIC8vIEhhbmRsZSBOb3JtYWwgQ29sdW1uLlxuICAgICAgZWxzZSBpZiAoY29sbGFwc2VkKSBjb2x1bW4gPSBPYmplY3QuYXNzaWduKGNvbHVtbiwgRm9sZGVkQ29sdW1uKVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zID0gY29sdW1ucyA9PlxuICAgICAgY29sdW1ucy5tYXAoKGNvbCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKCFjb2wuZm9sZGFibGUpIHJldHVybiBjb2xcblxuICAgICAgICAvLyBJZiBjb2wgZG9uJ3QgaGF2ZSBpZCB0aGVuIGdlbmVyYXRlIGlkIGJhc2VkIG9uIGluZGV4XG4gICAgICAgIGlmICghY29sLmlkKSBjb2wuaWQgPSBgY29sXyR7aW5kZXh9YFxuXG4gICAgICAgIHRoaXMuY29weU9yaWdpbmFscyhjb2wpXG4gICAgICAgIC8vIFJlcGxhY2UgY3VycmVudCBoZWFkZXIgd2l0aCBpbnRlcm5hbCBoZWFkZXIgcmVuZGVyLlxuICAgICAgICBjb2wuSGVhZGVyID0gYyA9PiB0aGlzLmZvbGRhYmxlSGVhZGVyUmVuZGVyKGMpXG4gICAgICAgIC8vIGFwcGx5IGZvbGRhYmxlXG4gICAgICAgIHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbihjb2wpXG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBuZXcgY29sdW1uIG91dFxuICAgICAgICByZXR1cm4gY29sXG4gICAgICB9KVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zOiBvcmlnaW5hbENvbHMsXG4gICAgICAgIEZvbGRCdXR0b25Db21wb25lbnQsXG4gICAgICAgIEZvbGRJY29uQ29tcG9uZW50LFxuICAgICAgICBGb2xkZWRDb2x1bW4sXG4gICAgICAgIC4uLnJlc3RcbiAgICAgIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1ucyhbLi4ub3JpZ2luYWxDb2xzXSlcblxuICAgICAgY29uc3QgZXh0cmEgPSB7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICAgIG9uUmVzaXplZENoYW5nZTogdGhpcy5vblJlc2l6ZWRDaGFuZ2UsXG4gICAgICAgIHJlc2l6ZWQ6IHRoaXMuc3RhdGUucmVzaXplZCxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDxSZWFjdFRhYmxlIHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiAodGhpcy53cmFwcGVkSW5zdGFuY2UgPSByKX0gLz5cbiAgICB9XG4gIH1cblxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JURm9sZGFibGVUYWJsZSdcbiAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPSB7XG4gICAgRm9sZEljb25Db21wb25lbnQ6IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCxcbiAgICBGb2xkQnV0dG9uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCxcbiAgICBmb2xkYWJsZU9yaWdpbmFsS2V5OiAnb3JpZ2luYWxfJyxcbiAgICBGb2xkZWRDb2x1bW46IHtcbiAgICAgIENlbGw6IGMgPT4gJycsXG4gICAgICB3aWR0aDogMzAsXG4gICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXG4gICAgfSxcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVyXG59XG4iXX0=