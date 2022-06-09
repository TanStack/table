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

    _createClass(RTFoldableTable, null, [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(props, state) {
        if (state.resized !== props.resized) {
          return {
            resized: props.resized || []
          };
        }

        return null;
      }
    }]);

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

    // this is so we can expose the underlying ReactTable.


    _createClass(RTFoldableTable, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0Rm9sZEljb25Db21wb25lbnQiLCJjb2xsYXBzZWQiLCJzdHlsZSIsIndpZHRoIiwicmlnaHQiLCJsZWZ0IiwiZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQiLCJoZWFkZXIiLCJpY29uIiwib25DbGljayIsIm1hcmdpbkxlZnQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmbG9hdCIsImN1cnNvciIsIndyYXBwZXIiLCJwcm9wcyIsInN0YXRlIiwicmVzaXplZCIsImNvbnRleHQiLCJvblJlc2l6ZWRDaGFuZ2UiLCJzZXRTdGF0ZSIsInJlbW92ZVJlc2l6ZWQiLCJpZCIsImNvbHVtbiIsInJzIiwiZmluZCIsInIiLCJuZXdSZXNpemVkIiwiZmlsdGVyIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRDb3BpZWRLZXkiLCJmb2xkYWJsZU9yaWdpbmFsS2V5Iiwia2V5IiwiY29weU9yaWdpbmFscyIsIkZvbGRlZENvbHVtbiIsIm9yaWdpbmFsX0hlYWRlciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29waWVkS2V5IiwiayIsImMiLCJ2YWx1ZSIsImNvbHVtbnMiLCJvcmlnaW5hbF9Db2x1bW5zIiwiSGVhZGVyIiwicmVzdG9yZVRvT3JpZ2luYWwiLCJnZXRTdGF0ZSIsIm9uRm9sZENoYW5nZSIsImZvbGRlZCIsImlzRm9sZGVkIiwiY29sIiwiZm9sZGluZ0hhbmRsZXIiLCJuZXdGb2xkIiwiYXNzaWduIiwiZm9sZGFibGVIZWFkZXJSZW5kZXIiLCJGb2xkQnV0dG9uQ29tcG9uZW50IiwiRm9sZEljb25Db21wb25lbnQiLCJjZWxsIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7K2VBSkE7O0FBTUEsSUFBTUEsMkJBQTJCLFNBQTNCQSx3QkFBMkIsT0FBbUI7QUFBQSxNQUFoQkMsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUNsRCxNQUFNQyxRQUFRLEVBQUVDLE9BQU8sRUFBVCxFQUFkOztBQUVBLE1BQUlGLFNBQUosRUFBZSxPQUFPLHVDQUFLLEtBQUtHLGVBQVYsRUFBaUIsT0FBT0YsS0FBeEIsRUFBK0IsS0FBSSxPQUFuQyxHQUFQO0FBQ2YsU0FBTyx1Q0FBSyxLQUFLRyxjQUFWLEVBQWdCLE9BQU9ILEtBQXZCLEVBQThCLEtBQUksTUFBbEMsR0FBUDtBQUNELENBTEQ7O0FBT0EsSUFBTUksNkJBQTZCLFNBQTdCQSwwQkFBNkIsUUFBMEM7QUFBQSxNQUF2Q0MsTUFBdUMsU0FBdkNBLE1BQXVDO0FBQUEsTUFBL0JOLFNBQStCLFNBQS9CQSxTQUErQjtBQUFBLE1BQXBCTyxJQUFvQixTQUFwQkEsSUFBb0I7QUFBQSxNQUFkQyxPQUFjLFNBQWRBLE9BQWM7O0FBQzNFLE1BQU1QLFFBQVE7QUFDWlEsZ0JBQVksS0FEQTtBQUVaQyxlQUFXLE1BRkM7QUFHWkMsa0JBQWMsTUFIRjtBQUlaQyxXQUFPLE1BSks7QUFLWkMsWUFBUTtBQUxJLEdBQWQ7O0FBUUEsU0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxPQUFPWixLQUFaLEVBQW1CLFNBQVNPLE9BQTVCO0FBQ0dEO0FBREgsS0FERjtBQUlHLEtBQUNQLFNBQUQsSUFBYztBQUFBO0FBQUE7QUFBTU07QUFBTjtBQUpqQixHQURGO0FBUUQsQ0FqQkQ7O2tCQW1CZSxzQkFBYztBQUMzQixNQUFNUTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQ0FDNEJDLEtBRDVCLEVBQ21DQyxLQURuQyxFQUMwQztBQUM1QyxZQUFJQSxNQUFNQyxPQUFOLEtBQWtCRixNQUFNRSxPQUE1QixFQUFxQztBQUNuQyxpQkFBTztBQUNMQSxxQkFBU0YsTUFBTUUsT0FBTixJQUFpQjtBQURyQixXQUFQO0FBR0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0Q7QUFURzs7QUFXSiw2QkFBWUYsS0FBWixFQUFtQkcsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxvSUFDcEJILEtBRG9CLEVBQ2JHLE9BRGE7O0FBQUEsWUFTNUJDLGVBVDRCLEdBU1YsbUJBQVc7QUFBQSxZQUNuQkEsZUFEbUIsR0FDQyxNQUFLSixLQUROLENBQ25CSSxlQURtQjs7QUFFM0IsWUFBSUEsZUFBSixFQUFxQkEsZ0JBQWdCRixPQUFoQixFQUFyQixLQUNLO0FBQ0gsZ0JBQUtHLFFBQUwsQ0FBYztBQUFBLG1CQUFNLEVBQUVILGdCQUFGLEVBQU47QUFBQSxXQUFkO0FBQ0Q7QUFDRixPQWYyQjs7QUFBQSxZQWlCNUJJLGFBakI0QixHQWlCWixrQkFBVTtBQUFBLFlBQ2hCQyxFQURnQixHQUNUQyxNQURTLENBQ2hCRCxFQURnQjs7QUFFeEIsWUFBSSxDQUFDQSxFQUFMLEVBQVM7O0FBRmUsWUFJaEJMLE9BSmdCLEdBSUosTUFBS0QsS0FKRCxDQUloQkMsT0FKZ0I7O0FBS3hCLFlBQUksQ0FBQ0EsT0FBTCxFQUFjOztBQUVkLFlBQU1PLEtBQUtQLFFBQVFRLElBQVIsQ0FBYTtBQUFBLGlCQUFLQyxFQUFFSixFQUFGLEtBQVNBLEVBQWQ7QUFBQSxTQUFiLENBQVg7QUFDQSxZQUFJLENBQUNFLEVBQUwsRUFBUzs7QUFFVCxZQUFNRyxhQUFhVixRQUFRVyxNQUFSLENBQWU7QUFBQSxpQkFBS0YsTUFBTUYsRUFBWDtBQUFBLFNBQWYsQ0FBbkI7QUFDQSxjQUFLTCxlQUFMLENBQXFCUSxVQUFyQjtBQUNELE9BN0IyQjs7QUFBQSxZQWdDNUJFLGtCQWhDNEIsR0FnQ1AsWUFBTTtBQUN6QixZQUFJLENBQUMsTUFBS0MsZUFBVixFQUEyQkMsUUFBUUMsSUFBUixDQUFhLHVDQUFiO0FBQzNCLFlBQUksTUFBS0YsZUFBTCxDQUFxQkQsa0JBQXpCLEVBQTZDLE9BQU8sTUFBS0MsZUFBTCxDQUFxQkQsa0JBQXJCLEVBQVA7QUFDN0MsZUFBTyxNQUFLQyxlQUFaO0FBQ0QsT0FwQzJCOztBQUFBLFlBc0M1QkcsWUF0QzRCLEdBc0NiLGVBQU87QUFBQSxZQUNaQyxtQkFEWSxHQUNZLE1BQUtuQixLQURqQixDQUNabUIsbUJBRFk7O0FBRXBCLG9CQUFVQSxtQkFBVixHQUFnQ0MsR0FBaEM7QUFDRCxPQXpDMkI7O0FBQUEsWUEyQzVCQyxhQTNDNEIsR0EyQ1osa0JBQVU7QUFBQSxZQUNoQkMsWUFEZ0IsR0FDQyxNQUFLdEIsS0FETixDQUNoQnNCLFlBRGdCOztBQUd4Qjs7QUFDQSxZQUFJZCxPQUFPZSxlQUFYLEVBQTRCOztBQUU1QkMsZUFBT0MsSUFBUCxDQUFZSCxZQUFaLEVBQTBCSSxPQUExQixDQUFrQyxhQUFLO0FBQ3JDLGNBQU1DLFlBQVksTUFBS1QsWUFBTCxDQUFrQlUsQ0FBbEIsQ0FBbEI7O0FBRUEsY0FBSUEsTUFBTSxNQUFWLEVBQWtCcEIsT0FBT21CLFNBQVAsSUFBb0JuQixPQUFPb0IsQ0FBUCxJQUFZcEIsT0FBT29CLENBQVAsQ0FBWixHQUF3QjtBQUFBLG1CQUFLQyxFQUFFQyxLQUFQO0FBQUEsV0FBNUMsQ0FBbEIsS0FDS3RCLE9BQU9tQixTQUFQLElBQW9CbkIsT0FBT29CLENBQVAsQ0FBcEI7QUFDTixTQUxEOztBQU9BO0FBQ0EsWUFBSXBCLE9BQU91QixPQUFQLElBQWtCLENBQUN2QixPQUFPd0IsZ0JBQTlCLEVBQWdEeEIsT0FBT3dCLGdCQUFQLEdBQTBCeEIsT0FBT3VCLE9BQWpDOztBQUVoRDtBQUNBLFlBQUksQ0FBQ3ZCLE9BQU9lLGVBQVosRUFBNkJmLE9BQU9lLGVBQVAsR0FBeUJmLE9BQU95QixNQUFoQztBQUM5QixPQTdEMkI7O0FBQUEsWUErRDVCQyxpQkEvRDRCLEdBK0RSLGtCQUFVO0FBQUEsWUFDcEJaLFlBRG9CLEdBQ0gsTUFBS3RCLEtBREYsQ0FDcEJzQixZQURvQjs7O0FBRzVCRSxlQUFPQyxJQUFQLENBQVlILFlBQVosRUFBMEJJLE9BQTFCLENBQWtDLGFBQUs7QUFDckM7QUFDQSxjQUFJRSxNQUFNLFFBQVYsRUFBb0I7O0FBRXBCLGNBQU1ELFlBQVksTUFBS1QsWUFBTCxDQUFrQlUsQ0FBbEIsQ0FBbEI7QUFDQXBCLGlCQUFPb0IsQ0FBUCxJQUFZcEIsT0FBT21CLFNBQVAsQ0FBWjtBQUNELFNBTkQ7O0FBUUEsWUFBSW5CLE9BQU91QixPQUFQLElBQWtCdkIsT0FBT3dCLGdCQUE3QixFQUErQ3hCLE9BQU91QixPQUFQLEdBQWlCdkIsT0FBT3dCLGdCQUF4QjtBQUNoRCxPQTNFMkI7O0FBQUEsWUE2RTVCRyxRQTdFNEIsR0E2RWpCO0FBQUEsZUFBTyxNQUFLbkMsS0FBTCxDQUFXb0MsWUFBWCxHQUEwQixNQUFLcEMsS0FBTCxDQUFXcUMsTUFBckMsR0FBOEMsTUFBS3BDLEtBQUwsQ0FBV29DLE1BQWhFO0FBQUEsT0E3RWlCOztBQUFBLFlBK0U1QkMsUUEvRTRCLEdBK0VqQixlQUFPO0FBQ2hCLFlBQU1ELFNBQVMsTUFBS0YsUUFBTCxFQUFmO0FBQ0EsZUFBT0UsT0FBT0UsSUFBSWhDLEVBQVgsTUFBbUIsSUFBMUI7QUFDRCxPQWxGMkI7O0FBQUEsWUFvRjVCaUMsY0FwRjRCLEdBb0ZYLGVBQU87QUFDdEIsWUFBSSxDQUFDRCxHQUFELElBQVEsQ0FBQ0EsSUFBSWhDLEVBQWpCLEVBQXFCOztBQURDLFlBR2Q2QixZQUhjLEdBR0csTUFBS3BDLEtBSFIsQ0FHZG9DLFlBSGM7O0FBSXRCLFlBQU1DLFNBQVMsTUFBS0YsUUFBTCxFQUFmO0FBSnNCLFlBS2Q1QixFQUxjLEdBS1BnQyxHQUxPLENBS2RoQyxFQUxjOzs7QUFPdEIsWUFBTWtDLFVBQVVqQixPQUFPa0IsTUFBUCxDQUFjLEVBQWQsRUFBa0JMLE1BQWxCLENBQWhCO0FBQ0FJLGdCQUFRbEMsRUFBUixJQUFjLENBQUNrQyxRQUFRbEMsRUFBUixDQUFmOztBQUVBO0FBQ0EsY0FBS0QsYUFBTCxDQUFtQmlDLEdBQW5COztBQUVBLFlBQUlILFlBQUosRUFBa0JBLGFBQWFLLE9BQWIsRUFBbEIsS0FDSztBQUNILGdCQUFLcEMsUUFBTCxDQUFjO0FBQUEsbUJBQWEsRUFBRWdDLFFBQVFJLE9BQVYsRUFBYjtBQUFBLFdBQWQ7QUFDRDtBQUNGLE9BckcyQjs7QUFBQSxZQXVHNUJFLG9CQXZHNEIsR0F1R0wsZ0JBQVE7QUFBQSwwQkFDc0IsTUFBSzNDLEtBRDNCO0FBQUEsWUFDckI0QyxtQkFEcUIsZUFDckJBLG1CQURxQjtBQUFBLFlBQ0FDLGlCQURBLGVBQ0FBLGlCQURBO0FBQUEsWUFFckJyQyxNQUZxQixHQUVWc0MsSUFGVSxDQUVyQnRDLE1BRnFCOztBQUc3QixZQUFNdkIsWUFBWSxNQUFLcUQsUUFBTCxDQUFjOUIsTUFBZCxDQUFsQjtBQUNBLFlBQU1oQixPQUFPdUQsZ0JBQU1DLGFBQU4sQ0FBb0JILGlCQUFwQixFQUF1QyxFQUFFNUQsb0JBQUYsRUFBdkMsQ0FBYjtBQUNBLFlBQU1RLFVBQVUsU0FBVkEsT0FBVTtBQUFBLGlCQUFNLE1BQUsrQyxjQUFMLENBQW9CaEMsTUFBcEIsQ0FBTjtBQUFBLFNBQWhCOztBQUVBLGVBQU91QyxnQkFBTUMsYUFBTixDQUFvQkosbUJBQXBCLEVBQXlDO0FBQzlDckQsa0JBQVFpQixPQUFPZSxlQUQrQjtBQUU5Q3RDLDhCQUY4QztBQUc5Q08sb0JBSDhDO0FBSTlDQztBQUo4QyxTQUF6QyxDQUFQO0FBTUQsT0FwSDJCOztBQUFBLFlBc0g1QndELHNCQXRINEIsR0FzSEgsa0JBQVU7QUFDakMsWUFBTWhFLFlBQVksTUFBS3FELFFBQUwsQ0FBYzlCLE1BQWQsQ0FBbEI7QUFEaUMsWUFFekJjLFlBRnlCLEdBRVIsTUFBS3RCLEtBRkcsQ0FFekJzQixZQUZ5Qjs7QUFJakM7O0FBQ0EsWUFBSWQsT0FBT3VCLE9BQVgsRUFBb0I7QUFDbEIsY0FBSTlDLFNBQUosRUFBZTtBQUNidUIsbUJBQU91QixPQUFQLEdBQWlCLENBQUNULFlBQUQsQ0FBakI7QUFDQWQsbUJBQU9yQixLQUFQLEdBQWVtQyxhQUFhbkMsS0FBNUI7QUFDQXFCLG1CQUFPdEIsS0FBUCxHQUFlb0MsYUFBYXBDLEtBQTVCO0FBQ0QsV0FKRCxNQUlPLE1BQUtnRCxpQkFBTCxDQUF1QjFCLE1BQXZCO0FBQ1I7QUFDRDtBQVBBLGFBUUssSUFBSXZCLFNBQUosRUFBZXVCLFNBQVNnQixPQUFPa0IsTUFBUCxDQUFjbEMsTUFBZCxFQUFzQmMsWUFBdEIsQ0FBVCxDQUFmLEtBQ0E7QUFDSCxrQkFBS1ksaUJBQUwsQ0FBdUIxQixNQUF2QjtBQUNEO0FBQ0YsT0F2STJCOztBQUFBLFlBeUk1QjBDLHVCQXpJNEIsR0F5SUY7QUFBQSxlQUN4Qm5CLFFBQVFvQixHQUFSLENBQVksVUFBQ1osR0FBRCxFQUFNYSxLQUFOLEVBQWdCO0FBQzFCLGNBQUksQ0FBQ2IsSUFBSWMsUUFBVCxFQUFtQixPQUFPZCxHQUFQOztBQUVuQjtBQUNBLGNBQUksQ0FBQ0EsSUFBSWhDLEVBQVQsRUFBYWdDLElBQUloQyxFQUFKLFlBQWdCNkMsS0FBaEI7O0FBRWIsZ0JBQUsvQixhQUFMLENBQW1Ca0IsR0FBbkI7QUFDQTtBQUNBQSxjQUFJTixNQUFKLEdBQWE7QUFBQSxtQkFBSyxNQUFLVSxvQkFBTCxDQUEwQmQsQ0FBMUIsQ0FBTDtBQUFBLFdBQWI7QUFDQTtBQUNBLGdCQUFLb0Isc0JBQUwsQ0FBNEJWLEdBQTVCOztBQUVBO0FBQ0EsaUJBQU9BLEdBQVA7QUFDRCxTQWRELENBRHdCO0FBQUEsT0F6SUU7O0FBRzFCLFlBQUt0QyxLQUFMLEdBQWE7QUFDWG9DLGdCQUFRckMsTUFBTW9DLFlBQU4sR0FBcUJrQixTQUFyQixHQUFpQyxFQUQ5QjtBQUVYcEQsaUJBQVNGLE1BQU1FLE9BQU4sSUFBaUI7QUFGZixPQUFiO0FBSDBCO0FBTzNCOztBQXdCRDs7O0FBMUNJO0FBQUE7QUFBQSwrQkFxS0s7QUFBQTs7QUFBQSxxQkFPSCxLQUFLRixLQVBGO0FBQUEsWUFFSXVELFlBRkosVUFFTHhCLE9BRks7QUFBQSxZQUdMYSxtQkFISyxVQUdMQSxtQkFISztBQUFBLFlBSUxDLGlCQUpLLFVBSUxBLGlCQUpLO0FBQUEsWUFLTHZCLFlBTEssVUFLTEEsWUFMSztBQUFBLFlBTUZrQyxJQU5FOztBQVFQLFlBQU16QixVQUFVLEtBQUttQix1QkFBTCw4QkFBaUNLLFlBQWpDLEdBQWhCOztBQUVBLFlBQU1FLFFBQVE7QUFDWjFCLDBCQURZO0FBRVozQiwyQkFBaUIsS0FBS0EsZUFGVjtBQUdaRixtQkFBUyxLQUFLRCxLQUFMLENBQVdDO0FBSFIsU0FBZDs7QUFNQSxlQUFPLDhCQUFDLFVBQUQsZUFBZ0JzRCxJQUFoQixFQUEwQkMsS0FBMUIsSUFBaUMsS0FBSztBQUFBLG1CQUFNLE9BQUsxQyxlQUFMLEdBQXVCSixDQUE3QjtBQUFBLFdBQXRDLElBQVA7QUFDRDtBQXRMRzs7QUFBQTtBQUFBLElBQXdDb0MsZ0JBQU1XLFNBQTlDLENBQU47O0FBeUxBM0QsVUFBUTRELFdBQVIsR0FBc0IsaUJBQXRCO0FBQ0E1RCxVQUFRNkQsWUFBUixHQUF1QjtBQUNyQmYsdUJBQW1CN0Qsd0JBREU7QUFFckI0RCx5QkFBcUJ0RCwwQkFGQTtBQUdyQjZCLHlCQUFxQixXQUhBO0FBSXJCRyxrQkFBYztBQUNadUMsWUFBTTtBQUFBLGVBQUssRUFBTDtBQUFBLE9BRE07QUFFWjFFLGFBQU8sRUFGSztBQUdaMkUsZ0JBQVUsS0FIRTtBQUlaQyxpQkFBVyxLQUpDO0FBS1pDLGtCQUFZO0FBTEE7QUFKTyxHQUF2Qjs7QUFhQSxTQUFPakUsT0FBUDtBQUNELEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJ1xuaW1wb3J0IHJpZ2h0IGZyb20gJy4vcmlnaHQuc3ZnJ1xuXG5jb25zdCBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQgPSAoeyBjb2xsYXBzZWQgfSkgPT4ge1xuICBjb25zdCBzdHlsZSA9IHsgd2lkdGg6IDI1IH1cblxuICBpZiAoY29sbGFwc2VkKSByZXR1cm4gPGltZyBzcmM9e3JpZ2h0fSBzdHlsZT17c3R5bGV9IGFsdD1cInJpZ2h0XCIgLz5cbiAgcmV0dXJuIDxpbWcgc3JjPXtsZWZ0fSBzdHlsZT17c3R5bGV9IGFsdD1cImxlZnRcIiAvPlxufVxuXG5jb25zdCBkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCA9ICh7IGhlYWRlciwgY29sbGFwc2VkLCBpY29uLCBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB7XG4gICAgbWFyZ2luTGVmdDogJzBweCcsXG4gICAgbWFyZ2luVG9wOiAnLTVweCcsXG4gICAgbWFyZ2luQm90dG9tOiAnLThweCcsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAge2ljb259XG4gICAgICA8L2Rpdj5cbiAgICAgIHshY29sbGFwc2VkICYmIDxkaXY+e2hlYWRlcn08L2Rpdj59XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3RUYWJsZSA9PiB7XG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVEZvbGRhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGUucmVzaXplZCAhPT0gcHJvcHMucmVzaXplZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW10sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dClcblxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZm9sZGVkOiBwcm9wcy5vbkZvbGRDaGFuZ2UgPyB1bmRlZmluZWQgOiB7fSxcbiAgICAgICAgcmVzaXplZDogcHJvcHMucmVzaXplZCB8fCBbXSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblJlc2l6ZWRDaGFuZ2UgPSByZXNpemVkID0+IHtcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgICBpZiAob25SZXNpemVkQ2hhbmdlKSBvblJlc2l6ZWRDaGFuZ2UocmVzaXplZClcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4gKHsgcmVzaXplZCB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVSZXNpemVkID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbHVtblxuICAgICAgaWYgKCFpZCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZVxuICAgICAgaWYgKCFyZXNpemVkKSByZXR1cm5cblxuICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZClcbiAgICAgIGlmICghcnMpIHJldHVyblxuXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIociA9PiByICE9PSBycylcbiAgICAgIHRoaXMub25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQpXG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUuXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgZ2V0Q29waWVkS2V5ID0ga2V5ID0+IHtcbiAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wc1xuICAgICAgcmV0dXJuIGAke2ZvbGRhYmxlT3JpZ2luYWxLZXl9JHtrZXl9YFxuICAgIH1cblxuICAgIGNvcHlPcmlnaW5hbHMgPSBjb2x1bW4gPT4ge1xuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcblxuICAgICAgLy8gU3RvcCBjb3B5IGlmIHRoZSBjb2x1bW4gYWxyZWFkeSBjb3BpZWRcbiAgICAgIGlmIChjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSByZXR1cm5cblxuICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxuXG4gICAgICAgIGlmIChrID09PSAnQ2VsbCcpIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdID8gY29sdW1uW2tdIDogYyA9PiBjLnZhbHVlXG4gICAgICAgIGVsc2UgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba11cbiAgICAgIH0pXG5cbiAgICAgIC8vIENvcHkgc3ViIENvbHVtbnNcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiAhY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zID0gY29sdW1uLmNvbHVtbnNcblxuICAgICAgLy8gQ29weSBIZWFkZXJcbiAgICAgIGlmICghY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXJcbiAgICB9XG5cbiAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XG4gICAgICAgIC8vIGlnbm9yZSBoZWFkZXIgYXMgaGFuZGxpbmcgYnkgZm9sZGFibGVIZWFkZXJSZW5kZXJcbiAgICAgICAgaWYgKGsgPT09ICdIZWFkZXInKSByZXR1cm5cblxuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxuICAgICAgICBjb2x1bW5ba10gPSBjb2x1bW5bY29waWVkS2V5XVxuICAgICAgfSlcblxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKSBjb2x1bW4uY29sdW1ucyA9IGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zXG4gICAgfVxuXG4gICAgZ2V0U3RhdGUgPSAoKSA9PiAodGhpcy5wcm9wcy5vbkZvbGRDaGFuZ2UgPyB0aGlzLnByb3BzLmZvbGRlZCA6IHRoaXMuc3RhdGUuZm9sZGVkKVxuXG4gICAgaXNGb2xkZWQgPSBjb2wgPT4ge1xuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICByZXR1cm4gZm9sZGVkW2NvbC5pZF0gPT09IHRydWVcbiAgICB9XG5cbiAgICBmb2xkaW5nSGFuZGxlciA9IGNvbCA9PiB7XG4gICAgICBpZiAoIWNvbCB8fCAhY29sLmlkKSByZXR1cm5cblxuICAgICAgY29uc3QgeyBvbkZvbGRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyBpZCB9ID0gY29sXG5cbiAgICAgIGNvbnN0IG5ld0ZvbGQgPSBPYmplY3QuYXNzaWduKHt9LCBmb2xkZWQpXG4gICAgICBuZXdGb2xkW2lkXSA9ICFuZXdGb2xkW2lkXVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIFJlc2l6ZWQgaWYgaGF2ZVxuICAgICAgdGhpcy5yZW1vdmVSZXNpemVkKGNvbClcblxuICAgICAgaWYgKG9uRm9sZENoYW5nZSkgb25Gb2xkQ2hhbmdlKG5ld0ZvbGQpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiAoeyBmb2xkZWQ6IG5ld0ZvbGQgfSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9sZGFibGVIZWFkZXJSZW5kZXIgPSBjZWxsID0+IHtcbiAgICAgIGNvbnN0IHsgRm9sZEJ1dHRvbkNvbXBvbmVudCwgRm9sZEljb25Db21wb25lbnQgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBjZWxsXG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcbiAgICAgIGNvbnN0IGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRJY29uQ29tcG9uZW50LCB7IGNvbGxhcHNlZCB9KVxuICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHRoaXMuZm9sZGluZ0hhbmRsZXIoY29sdW1uKVxuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkQnV0dG9uQ29tcG9uZW50LCB7XG4gICAgICAgIGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlcixcbiAgICAgICAgY29sbGFwc2VkLFxuICAgICAgICBpY29uLFxuICAgICAgICBvbkNsaWNrLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1uID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcblxuICAgICAgLy8gSGFuZGxlIENvbHVtbiBIZWFkZXJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICBpZiAoY29sbGFwc2VkKSB7XG4gICAgICAgICAgY29sdW1uLmNvbHVtbnMgPSBbRm9sZGVkQ29sdW1uXVxuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aFxuICAgICAgICAgIGNvbHVtbi5zdHlsZSA9IEZvbGRlZENvbHVtbi5zdHlsZVxuICAgICAgICB9IGVsc2UgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pXG4gICAgICB9XG4gICAgICAvLyBIYW5kbGUgTm9ybWFsIENvbHVtbi5cbiAgICAgIGVsc2UgaWYgKGNvbGxhcHNlZCkgY29sdW1uID0gT2JqZWN0LmFzc2lnbihjb2x1bW4sIEZvbGRlZENvbHVtbilcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyA9IGNvbHVtbnMgPT5cbiAgICAgIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghY29sLmZvbGRhYmxlKSByZXR1cm4gY29sXG5cbiAgICAgICAgLy8gSWYgY29sIGRvbid0IGhhdmUgaWQgdGhlbiBnZW5lcmF0ZSBpZCBiYXNlZCBvbiBpbmRleFxuICAgICAgICBpZiAoIWNvbC5pZCkgY29sLmlkID0gYGNvbF8ke2luZGV4fWBcblxuICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKVxuICAgICAgICAvLyBSZXBsYWNlIGN1cnJlbnQgaGVhZGVyIHdpdGggaW50ZXJuYWwgaGVhZGVyIHJlbmRlci5cbiAgICAgICAgY29sLkhlYWRlciA9IGMgPT4gdGhpcy5mb2xkYWJsZUhlYWRlclJlbmRlcihjKVxuICAgICAgICAvLyBhcHBseSBmb2xkYWJsZVxuICAgICAgICB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW4oY29sKVxuXG4gICAgICAgIC8vIHJldHVybiB0aGUgbmV3IGNvbHVtbiBvdXRcbiAgICAgICAgcmV0dXJuIGNvbFxuICAgICAgfSlcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1uczogb3JpZ2luYWxDb2xzLFxuICAgICAgICBGb2xkQnV0dG9uQ29tcG9uZW50LFxuICAgICAgICBGb2xkSWNvbkNvbXBvbmVudCxcbiAgICAgICAgRm9sZGVkQ29sdW1uLFxuICAgICAgICAuLi5yZXN0XG4gICAgICB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pXG5cbiAgICAgIGNvbnN0IGV4dHJhID0ge1xuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBvblJlc2l6ZWRDaGFuZ2U6IHRoaXMub25SZXNpemVkQ2hhbmdlLFxuICAgICAgICByZXNpemVkOiB0aGlzLnN0YXRlLnJlc2l6ZWQsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiA8UmVhY3RUYWJsZSB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVEZvbGRhYmxlVGFibGUnXG4gIHdyYXBwZXIuZGVmYXVsdFByb3BzID0ge1xuICAgIEZvbGRJY29uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQsXG4gICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXG4gICAgZm9sZGFibGVPcmlnaW5hbEtleTogJ29yaWdpbmFsXycsXG4gICAgRm9sZGVkQ29sdW1uOiB7XG4gICAgICBDZWxsOiBjID0+ICcnLFxuICAgICAgd2lkdGg6IDMwLFxuICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gd3JhcHBlclxufVxuIl19