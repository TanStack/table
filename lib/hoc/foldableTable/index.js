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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIndyYXBwZXIiLCJwcm9wcyIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJyZXNpemVkIiwic2V0U3RhdGUiLCJyZW1vdmVSZXNpemVkIiwiaWQiLCJjb2x1bW4iLCJzdGF0ZSIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJGb2xkQnV0dG9uQ29tcG9uZW50IiwiRm9sZEljb25Db21wb25lbnQiLCJjZWxsIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OzsrZUFKQTs7QUFNQSxJQUFNQSwyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sdUNBQUssS0FBS0csZUFBVixFQUFpQixPQUFPRixLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLHVDQUFLLEtBQUtHLGNBQVYsRUFBZ0IsT0FBT0gsS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNSSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQk4sU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJPLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTVAsUUFBUTtBQUNaUSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9aLEtBQVosRUFBbUIsU0FBU08sT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcsS0FBQ1AsU0FBRCxJQUFjO0FBQUE7QUFBQTtBQUFNTTtBQUFOO0FBSmpCLEdBREY7QUFRRCxD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QWlLSztBQUFBOztBQUFBLHFCQU9ILEtBQUtILEtBUEY7QUFBQSxZQUVJd0QsWUFGSixVQUVMekIsT0FGSztBQUFBLFlBR0xhLG1CQUhLLFVBR0xBLG1CQUhLO0FBQUEsWUFJTEMsaUJBSkssVUFJTEEsaUJBSks7QUFBQSxZQUtMdkIsWUFMSyxVQUtMQSxZQUxLO0FBQUEsWUFNRm1DLElBTkU7O0FBUVAsWUFBTTFCLFVBQVUsS0FBS21CLHVCQUFMLDhCQUFpQ00sWUFBakMsR0FBaEI7O0FBRUEsWUFBTUUsUUFBUTtBQUNaM0IsMEJBRFk7QUFFWjdCLDJCQUFpQixLQUFLQSxlQUZWO0FBR1pDLG1CQUFTLEtBQUtLLEtBQUwsQ0FBV0w7QUFIUixTQUFkOztBQU1BLGVBQU8sOEJBQUMsVUFBRCxlQUFnQnNELElBQWhCLEVBQTBCQyxLQUExQixJQUFpQyxLQUFLO0FBQUEsbUJBQU0sT0FBSzNDLGVBQUwsR0FBdUJKLENBQTdCO0FBQUEsV0FBdEMsSUFBUDtBQUNEO0FBbExHOztBQUFBO0FBQUEsSUFBd0NvQyxnQkFBTVksU0FBOUMsQ0FBTjs7QUFxTEE1RCxVQUFRNkQsV0FBUixHQUFzQixpQkFBdEI7QUFDQTdELFVBQVE4RCxZQUFSLEdBQXVCO0FBQ3JCaEIsdUJBQW1CN0Qsd0JBREU7QUFFckI0RCx5QkFBcUJ0RCwwQkFGQTtBQUdyQjZCLHlCQUFxQixXQUhBO0FBSXJCRyxrQkFBYztBQUNad0MsWUFBTTtBQUFBLGVBQUssRUFBTDtBQUFBLE9BRE07QUFFWjNFLGFBQU8sRUFGSztBQUdaNEUsZ0JBQVUsS0FIRTtBQUlaQyxpQkFBVyxLQUpDO0FBS1pDLGtCQUFZO0FBTEE7QUFKTyxHQUF2Qjs7QUFhQSxTQUFPbEUsT0FBUDtBQUNELEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJ1xyXG5pbXBvcnQgcmlnaHQgZnJvbSAnLi9yaWdodC5zdmcnXHJcblxyXG5jb25zdCBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQgPSAoeyBjb2xsYXBzZWQgfSkgPT4ge1xyXG4gIGNvbnN0IHN0eWxlID0geyB3aWR0aDogMjUgfVxyXG5cclxuICBpZiAoY29sbGFwc2VkKSByZXR1cm4gPGltZyBzcmM9e3JpZ2h0fSBzdHlsZT17c3R5bGV9IGFsdD1cInJpZ2h0XCIgLz5cclxuICByZXR1cm4gPGltZyBzcmM9e2xlZnR9IHN0eWxlPXtzdHlsZX0gYWx0PVwibGVmdFwiIC8+XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRGb2xkQnV0dG9uQ29tcG9uZW50ID0gKHsgaGVhZGVyLCBjb2xsYXBzZWQsIGljb24sIG9uQ2xpY2sgfSkgPT4ge1xyXG4gIGNvbnN0IHN0eWxlID0ge1xyXG4gICAgbWFyZ2luTGVmdDogJzBweCcsXHJcbiAgICBtYXJnaW5Ub3A6ICctNXB4JyxcclxuICAgIG1hcmdpbkJvdHRvbTogJy04cHgnLFxyXG4gICAgZmxvYXQ6ICdsZWZ0JyxcclxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfT5cclxuICAgICAgICB7aWNvbn1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIHshY29sbGFwc2VkICYmIDxkaXY+e2hlYWRlcn08L2Rpdj59XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlYWN0VGFibGUgPT4ge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVEZvbGRhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXHJcblxyXG4gICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgIGZvbGRlZDogcHJvcHMub25Gb2xkQ2hhbmdlID8gdW5kZWZpbmVkIDoge30sXHJcbiAgICAgICAgcmVzaXplZDogcHJvcHMucmVzaXplZCB8fCBbXSxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcclxuICAgICAgaWYgKHRoaXMuc3RhdGUucmVzaXplZCAhPT0gbmV3UHJvcHMucmVzaXplZCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiAoeyByZXNpemVkOiBuZXdQcm9wcy5yZXNpemVkIH0pKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25SZXNpemVkQ2hhbmdlID0gcmVzaXplZCA9PiB7XHJcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGlmIChvblJlc2l6ZWRDaGFuZ2UpIG9uUmVzaXplZENoYW5nZShyZXNpemVkKVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4gKHsgcmVzaXplZCB9KSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVJlc2l6ZWQgPSBjb2x1bW4gPT4ge1xyXG4gICAgICBjb25zdCB7IGlkIH0gPSBjb2x1bW5cclxuICAgICAgaWYgKCFpZCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCB7IHJlc2l6ZWQgfSA9IHRoaXMuc3RhdGVcclxuICAgICAgaWYgKCFyZXNpemVkKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHJzID0gcmVzaXplZC5maW5kKHIgPT4gci5pZCA9PT0gaWQpXHJcbiAgICAgIGlmICghcnMpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHIgPT4gciAhPT0gcnMpXHJcbiAgICAgIHRoaXMub25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUuXHJcbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UgPSAoKSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRGb2xkYWJsZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXHJcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxyXG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb3BpZWRLZXkgPSBrZXkgPT4ge1xyXG4gICAgICBjb25zdCB7IGZvbGRhYmxlT3JpZ2luYWxLZXkgfSA9IHRoaXMucHJvcHNcclxuICAgICAgcmV0dXJuIGAke2ZvbGRhYmxlT3JpZ2luYWxLZXl9JHtrZXl9YFxyXG4gICAgfVxyXG5cclxuICAgIGNvcHlPcmlnaW5hbHMgPSBjb2x1bW4gPT4ge1xyXG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgLy8gU3RvcCBjb3B5IGlmIHRoZSBjb2x1bW4gYWxyZWFkeSBjb3BpZWRcclxuICAgICAgaWYgKGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIHJldHVyblxyXG5cclxuICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspXHJcblxyXG4gICAgICAgIGlmIChrID09PSAnQ2VsbCcpIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdID8gY29sdW1uW2tdIDogYyA9PiBjLnZhbHVlXHJcbiAgICAgICAgZWxzZSBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gQ29weSBzdWIgQ29sdW1uc1xyXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgIWNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zXHJcblxyXG4gICAgICAvLyBDb3B5IEhlYWRlclxyXG4gICAgICBpZiAoIWNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIgPSBjb2x1bW4uSGVhZGVyXHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZVRvT3JpZ2luYWwgPSBjb2x1bW4gPT4ge1xyXG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgIC8vIGlnbm9yZSBoZWFkZXIgYXMgaGFuZGxpbmcgYnkgZm9sZGFibGVIZWFkZXJSZW5kZXJcclxuICAgICAgICBpZiAoayA9PT0gJ0hlYWRlcicpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxyXG4gICAgICAgIGNvbHVtbltrXSA9IGNvbHVtbltjb3BpZWRLZXldXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5jb2x1bW5zID0gY29sdW1uLm9yaWdpbmFsX0NvbHVtbnNcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdGF0ZSA9ICgpID0+ICh0aGlzLnByb3BzLm9uRm9sZENoYW5nZSA/IHRoaXMucHJvcHMuZm9sZGVkIDogdGhpcy5zdGF0ZS5mb2xkZWQpXHJcblxyXG4gICAgaXNGb2xkZWQgPSBjb2wgPT4ge1xyXG4gICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKClcclxuICAgICAgcmV0dXJuIGZvbGRlZFtjb2wuaWRdID09PSB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgZm9sZGluZ0hhbmRsZXIgPSBjb2wgPT4ge1xyXG4gICAgICBpZiAoIWNvbCB8fCAhY29sLmlkKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHsgb25Gb2xkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxyXG4gICAgICBjb25zdCB7IGlkIH0gPSBjb2xcclxuXHJcbiAgICAgIGNvbnN0IG5ld0ZvbGQgPSBPYmplY3QuYXNzaWduKHt9LCBmb2xkZWQpXHJcbiAgICAgIG5ld0ZvbGRbaWRdID0gIW5ld0ZvbGRbaWRdXHJcblxyXG4gICAgICAvLyBSZW1vdmUgdGhlIFJlc2l6ZWQgaWYgaGF2ZVxyXG4gICAgICB0aGlzLnJlbW92ZVJlc2l6ZWQoY29sKVxyXG5cclxuICAgICAgaWYgKG9uRm9sZENoYW5nZSkgb25Gb2xkQ2hhbmdlKG5ld0ZvbGQpXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldmlvdXMgPT4gKHsgZm9sZGVkOiBuZXdGb2xkIH0pKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9sZGFibGVIZWFkZXJSZW5kZXIgPSBjZWxsID0+IHtcclxuICAgICAgY29uc3QgeyBGb2xkQnV0dG9uQ29tcG9uZW50LCBGb2xkSWNvbkNvbXBvbmVudCB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gY2VsbFxyXG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcclxuICAgICAgY29uc3QgaWNvbiA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEljb25Db21wb25lbnQsIHsgY29sbGFwc2VkIH0pXHJcbiAgICAgIGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB0aGlzLmZvbGRpbmdIYW5kbGVyKGNvbHVtbilcclxuXHJcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRCdXR0b25Db21wb25lbnQsIHtcclxuICAgICAgICBoZWFkZXI6IGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIsXHJcbiAgICAgICAgY29sbGFwc2VkLFxyXG4gICAgICAgIGljb24sXHJcbiAgICAgICAgb25DbGljayxcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1uID0gY29sdW1uID0+IHtcclxuICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5pc0ZvbGRlZChjb2x1bW4pXHJcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICAvLyBIYW5kbGUgQ29sdW1uIEhlYWRlclxyXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcclxuICAgICAgICBpZiAoY29sbGFwc2VkKSB7XHJcbiAgICAgICAgICBjb2x1bW4uY29sdW1ucyA9IFtGb2xkZWRDb2x1bW5dXHJcbiAgICAgICAgICBjb2x1bW4ud2lkdGggPSBGb2xkZWRDb2x1bW4ud2lkdGhcclxuICAgICAgICAgIGNvbHVtbi5zdHlsZSA9IEZvbGRlZENvbHVtbi5zdHlsZVxyXG4gICAgICAgIH0gZWxzZSB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbilcclxuICAgICAgfVxyXG4gICAgICAvLyBIYW5kbGUgTm9ybWFsIENvbHVtbi5cclxuICAgICAgZWxzZSBpZiAoY29sbGFwc2VkKSBjb2x1bW4gPSBPYmplY3QuYXNzaWduKGNvbHVtbiwgRm9sZGVkQ29sdW1uKVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbilcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zID0gY29sdW1ucyA9PlxyXG4gICAgICBjb2x1bW5zLm1hcCgoY29sLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICghY29sLmZvbGRhYmxlKSByZXR1cm4gY29sXHJcblxyXG4gICAgICAgIC8vIElmIGNvbCBkb24ndCBoYXZlIGlkIHRoZW4gZ2VuZXJhdGUgaWQgYmFzZWQgb24gaW5kZXhcclxuICAgICAgICBpZiAoIWNvbC5pZCkgY29sLmlkID0gYGNvbF8ke2luZGV4fWBcclxuXHJcbiAgICAgICAgdGhpcy5jb3B5T3JpZ2luYWxzKGNvbClcclxuICAgICAgICAvLyBSZXBsYWNlIGN1cnJlbnQgaGVhZGVyIHdpdGggaW50ZXJuYWwgaGVhZGVyIHJlbmRlci5cclxuICAgICAgICBjb2wuSGVhZGVyID0gYyA9PiB0aGlzLmZvbGRhYmxlSGVhZGVyUmVuZGVyKGMpXHJcbiAgICAgICAgLy8gYXBwbHkgZm9sZGFibGVcclxuICAgICAgICB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW4oY29sKVxyXG5cclxuICAgICAgICAvLyByZXR1cm4gdGhlIG5ldyBjb2x1bW4gb3V0XHJcbiAgICAgICAgcmV0dXJuIGNvbFxyXG4gICAgICB9KVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGNvbHVtbnM6IG9yaWdpbmFsQ29scyxcclxuICAgICAgICBGb2xkQnV0dG9uQ29tcG9uZW50LFxyXG4gICAgICAgIEZvbGRJY29uQ29tcG9uZW50LFxyXG4gICAgICAgIEZvbGRlZENvbHVtbixcclxuICAgICAgICAuLi5yZXN0XHJcbiAgICAgIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zKFsuLi5vcmlnaW5hbENvbHNdKVxyXG5cclxuICAgICAgY29uc3QgZXh0cmEgPSB7XHJcbiAgICAgICAgY29sdW1ucyxcclxuICAgICAgICBvblJlc2l6ZWRDaGFuZ2U6IHRoaXMub25SZXNpemVkQ2hhbmdlLFxyXG4gICAgICAgIHJlc2l6ZWQ6IHRoaXMuc3RhdGUucmVzaXplZCxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIDxSZWFjdFRhYmxlIHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiAodGhpcy53cmFwcGVkSW5zdGFuY2UgPSByKX0gLz5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdyYXBwZXIuZGlzcGxheU5hbWUgPSAnUlRGb2xkYWJsZVRhYmxlJ1xyXG4gIHdyYXBwZXIuZGVmYXVsdFByb3BzID0ge1xyXG4gICAgRm9sZEljb25Db21wb25lbnQ6IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCxcclxuICAgIEZvbGRCdXR0b25Db21wb25lbnQ6IGRlZmF1bHRGb2xkQnV0dG9uQ29tcG9uZW50LFxyXG4gICAgZm9sZGFibGVPcmlnaW5hbEtleTogJ29yaWdpbmFsXycsXHJcbiAgICBGb2xkZWRDb2x1bW46IHtcclxuICAgICAgQ2VsbDogYyA9PiAnJyxcclxuICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9XHJcblxyXG4gIHJldHVybiB3cmFwcGVyXHJcbn1cclxuIl19