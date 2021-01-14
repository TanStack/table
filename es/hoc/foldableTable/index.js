var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

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
    marginLeft: '0px',
    marginTop: '-5px',
    marginBottom: '-8px',
    float: 'left',
    cursor: 'pointer'
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
        var icon = React.createElement(FoldIconComponent, { collapsed: collapsed });
        var onClick = function onClick() {
          return _this.foldingHandler(column);
        };

        return React.createElement(FoldButtonComponent, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwid3JhcHBlciIsInByb3BzIiwic3RhdGUiLCJyZXNpemVkIiwiY29udGV4dCIsIm9uUmVzaXplZENoYW5nZSIsInNldFN0YXRlIiwicmVtb3ZlUmVzaXplZCIsImlkIiwiY29sdW1uIiwicnMiLCJmaW5kIiwiciIsIm5ld1Jlc2l6ZWQiLCJmaWx0ZXIiLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldENvcGllZEtleSIsImZvbGRhYmxlT3JpZ2luYWxLZXkiLCJrZXkiLCJjb3B5T3JpZ2luYWxzIiwiRm9sZGVkQ29sdW1uIiwib3JpZ2luYWxfSGVhZGVyIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb3BpZWRLZXkiLCJrIiwiYyIsInZhbHVlIiwiY29sdW1ucyIsIm9yaWdpbmFsX0NvbHVtbnMiLCJIZWFkZXIiLCJyZXN0b3JlVG9PcmlnaW5hbCIsImdldFN0YXRlIiwib25Gb2xkQ2hhbmdlIiwiZm9sZGVkIiwiaXNGb2xkZWQiLCJjb2wiLCJmb2xkaW5nSGFuZGxlciIsIm5ld0ZvbGQiLCJhc3NpZ24iLCJmb2xkYWJsZUhlYWRlclJlbmRlciIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsImNlbGwiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm9yaWdpbmFsQ29scyIsInJlc3QiLCJleHRyYSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwiZGVmYXVsdFByb3BzIiwiQ2VsbCIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwiZmlsdGVyYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsSUFBUCxNQUFpQixZQUFqQjtBQUNBLE9BQU9DLEtBQVAsTUFBa0IsYUFBbEI7O0FBRUEsSUFBTUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsT0FBbUI7QUFBQSxNQUFoQkMsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUNsRCxNQUFNQyxRQUFRLEVBQUVDLE9BQU8sRUFBVCxFQUFkOztBQUVBLE1BQUlGLFNBQUosRUFBZSxPQUFPLDZCQUFLLEtBQUtGLEtBQVYsRUFBaUIsT0FBT0csS0FBeEIsRUFBK0IsS0FBSSxPQUFuQyxHQUFQO0FBQ2YsU0FBTyw2QkFBSyxLQUFLSixJQUFWLEVBQWdCLE9BQU9JLEtBQXZCLEVBQThCLEtBQUksTUFBbEMsR0FBUDtBQUNELENBTEQ7O0FBT0EsSUFBTUUsNkJBQTZCLFNBQTdCQSwwQkFBNkIsUUFBMEM7QUFBQSxNQUF2Q0MsTUFBdUMsU0FBdkNBLE1BQXVDO0FBQUEsTUFBL0JKLFNBQStCLFNBQS9CQSxTQUErQjtBQUFBLE1BQXBCSyxJQUFvQixTQUFwQkEsSUFBb0I7QUFBQSxNQUFkQyxPQUFjLFNBQWRBLE9BQWM7O0FBQzNFLE1BQU1MLFFBQVE7QUFDWk0sZ0JBQVksS0FEQTtBQUVaQyxlQUFXLE1BRkM7QUFHWkMsa0JBQWMsTUFIRjtBQUlaQyxXQUFPLE1BSks7QUFLWkMsWUFBUTtBQUxJLEdBQWQ7O0FBUUEsU0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxPQUFPVixLQUFaLEVBQW1CLFNBQVNLLE9BQTVCO0FBQ0dEO0FBREgsS0FERjtBQUlHLEtBQUNMLFNBQUQs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YjtBQUgwQjtBQU8zQjs7QUF3QkQ7OztBQTFDSTtBQUFBO0FBQUEsK0JBcUtLO0FBQUE7O0FBQUEscUJBT0gsS0FBS0YsS0FQRjtBQUFBLFlBRUlzRCxZQUZKLFVBRUx2QixPQUZLO0FBQUEsWUFHTGEsbUJBSEssVUFHTEEsbUJBSEs7QUFBQSxZQUlMQyxpQkFKSyxVQUlMQSxpQkFKSztBQUFBLFlBS0x2QixZQUxLLFVBS0xBLFlBTEs7QUFBQSxZQU1GaUMsSUFORTs7QUFRUCxZQUFNeEIsVUFBVSxLQUFLa0IsdUJBQUwsOEJBQWlDSyxZQUFqQyxHQUFoQjs7QUFFQSxZQUFNRSxRQUFRO0FBQ1p6QiwwQkFEWTtBQUVaM0IsMkJBQWlCLEtBQUtBLGVBRlY7QUFHWkYsbUJBQVMsS0FBS0QsS0FBTCxDQUFXQztBQUhSLFNBQWQ7O0FBTUEsZUFBTyxvQkFBQyxVQUFELGVBQWdCcUQsSUFBaEIsRUFBMEJDLEtBQTFCLElBQWlDLEtBQUs7QUFBQSxtQkFBTSxPQUFLekMsZUFBTCxHQUF1QkosQ0FBN0I7QUFBQSxXQUF0QyxJQUFQO0FBQ0Q7QUF0TEc7O0FBQUE7QUFBQSxJQUF3QzVCLE1BQU0wRSxTQUE5QyxDQUFOOztBQXlMQTFELFVBQVEyRCxXQUFSLEdBQXNCLGlCQUF0QjtBQUNBM0QsVUFBUTRELFlBQVIsR0FBdUI7QUFDckJkLHVCQUFtQjNELHdCQURFO0FBRXJCMEQseUJBQXFCdEQsMEJBRkE7QUFHckI2Qix5QkFBcUIsV0FIQTtBQUlyQkcsa0JBQWM7QUFDWnNDLFlBQU07QUFBQSxlQUFLLEVBQUw7QUFBQSxPQURNO0FBRVp2RSxhQUFPLEVBRks7QUFHWndFLGdCQUFVLEtBSEU7QUFJWkMsaUJBQVcsS0FKQztBQUtaQyxrQkFBWTtBQUxBO0FBSk8sR0FBdkI7O0FBYUEsU0FBT2hFLE9BQVA7QUFDRCxDQXpNRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBsZWZ0IGZyb20gJy4vbGVmdC5zdmcnXHJcbmltcG9ydCByaWdodCBmcm9tICcuL3JpZ2h0LnN2ZydcclxuXHJcbmNvbnN0IGRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCA9ICh7IGNvbGxhcHNlZCB9KSA9PiB7XHJcbiAgY29uc3Qgc3R5bGUgPSB7IHdpZHRoOiAyNSB9XHJcblxyXG4gIGlmIChjb2xsYXBzZWQpIHJldHVybiA8aW1nIHNyYz17cmlnaHR9IHN0eWxlPXtzdHlsZX0gYWx0PVwicmlnaHRcIiAvPlxyXG4gIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cclxufVxyXG5cclxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XHJcbiAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICBtYXJnaW5MZWZ0OiAnMHB4JyxcclxuICAgIG1hcmdpblRvcDogJy01cHgnLFxyXG4gICAgbWFyZ2luQm90dG9tOiAnLThweCcsXHJcbiAgICBmbG9hdDogJ2xlZnQnLFxyXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBzdHlsZT17c3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxyXG4gICAgICAgIHtpY29ufVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgeyFjb2xsYXBzZWQgJiYgPGRpdj57aGVhZGVyfTwvZGl2Pn1cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVhY3RUYWJsZSA9PiB7XHJcbiAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJURm9sZGFibGVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKHByb3BzLCBzdGF0ZSkge1xyXG4gICAgICBpZiAoc3RhdGUucmVzaXplZCAhPT0gcHJvcHMucmVzaXplZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICByZXNpemVkOiBwcm9wcy5yZXNpemVkIHx8IFtdLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KVxyXG5cclxuICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICBmb2xkZWQ6IHByb3BzLm9uRm9sZENoYW5nZSA/IHVuZGVmaW5lZCA6IHt9LFxyXG4gICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW10sXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJlc2l6ZWRDaGFuZ2UgPSByZXNpemVkID0+IHtcclxuICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgaWYgKG9uUmVzaXplZENoYW5nZSkgb25SZXNpemVkQ2hhbmdlKHJlc2l6ZWQpXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiAoeyByZXNpemVkIH0pKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUmVzaXplZCA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbHVtblxyXG4gICAgICBpZiAoIWlkKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICBpZiAoIXJlc2l6ZWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZClcclxuICAgICAgaWYgKCFycykgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIociA9PiByICE9PSBycylcclxuICAgICAgdGhpcy5vblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZClcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZS5cclxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcclxuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcclxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXHJcbiAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvcGllZEtleSA9IGtleSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICByZXR1cm4gYCR7Zm9sZGFibGVPcmlnaW5hbEtleX0ke2tleX1gXHJcbiAgICB9XHJcblxyXG4gICAgY29weU9yaWdpbmFscyA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICAvLyBTdG9wIGNvcHkgaWYgdGhlIGNvbHVtbiBhbHJlYWR5IGNvcGllZFxyXG4gICAgICBpZiAoY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgcmV0dXJuXHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoaylcclxuXHJcbiAgICAgICAgaWYgKGsgPT09ICdDZWxsJykgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba10gPyBjb2x1bW5ba10gOiBjID0+IGMudmFsdWVcclxuICAgICAgICBlbHNlIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBDb3B5IHN1YiBDb2x1bW5zXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiAhY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zID0gY29sdW1uLmNvbHVtbnNcclxuXHJcbiAgICAgIC8vIENvcHkgSGVhZGVyXHJcbiAgICAgIGlmICghY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXJcclxuICAgIH1cclxuXHJcbiAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgLy8gaWdub3JlIGhlYWRlciBhcyBoYW5kbGluZyBieSBmb2xkYWJsZUhlYWRlclJlbmRlclxyXG4gICAgICAgIGlmIChrID09PSAnSGVhZGVyJykgcmV0dXJuXHJcblxyXG4gICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspXHJcbiAgICAgICAgY29sdW1uW2tdID0gY29sdW1uW2NvcGllZEtleV1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucykgY29sdW1uLmNvbHVtbnMgPSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1uc1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0YXRlID0gKCkgPT4gKHRoaXMucHJvcHMub25Gb2xkQ2hhbmdlID8gdGhpcy5wcm9wcy5mb2xkZWQgOiB0aGlzLnN0YXRlLmZvbGRlZClcclxuXHJcbiAgICBpc0ZvbGRlZCA9IGNvbCA9PiB7XHJcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxyXG4gICAgICByZXR1cm4gZm9sZGVkW2NvbC5pZF0gPT09IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBmb2xkaW5nSGFuZGxlciA9IGNvbCA9PiB7XHJcbiAgICAgIGlmICghY29sIHx8ICFjb2wuaWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgeyBvbkZvbGRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbFxyXG5cclxuICAgICAgY29uc3QgbmV3Rm9sZCA9IE9iamVjdC5hc3NpZ24oe30sIGZvbGRlZClcclxuICAgICAgbmV3Rm9sZFtpZF0gPSAhbmV3Rm9sZFtpZF1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0aGUgUmVzaXplZCBpZiBoYXZlXHJcbiAgICAgIHRoaXMucmVtb3ZlUmVzaXplZChjb2wpXHJcblxyXG4gICAgICBpZiAob25Gb2xkQ2hhbmdlKSBvbkZvbGRDaGFuZ2UobmV3Rm9sZClcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiAoeyBmb2xkZWQ6IG5ld0ZvbGQgfSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb2xkYWJsZUhlYWRlclJlbmRlciA9IGNlbGwgPT4ge1xyXG4gICAgICBjb25zdCB7IEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBjZWxsXHJcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxyXG4gICAgICBjb25zdCBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkSWNvbkNvbXBvbmVudCwgeyBjb2xsYXBzZWQgfSlcclxuICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHRoaXMuZm9sZGluZ0hhbmRsZXIoY29sdW1uKVxyXG5cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEJ1dHRvbkNvbXBvbmVudCwge1xyXG4gICAgICAgIGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlcixcclxuICAgICAgICBjb2xsYXBzZWQsXHJcbiAgICAgICAgaWNvbixcclxuICAgICAgICBvbkNsaWNrLFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW4gPSBjb2x1bW4gPT4ge1xyXG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcclxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIC8vIEhhbmRsZSBDb2x1bW4gSGVhZGVyXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgIGlmIChjb2xsYXBzZWQpIHtcclxuICAgICAgICAgIGNvbHVtbi5jb2x1bW5zID0gW0ZvbGRlZENvbHVtbl1cclxuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aFxyXG4gICAgICAgICAgY29sdW1uLnN0eWxlID0gRm9sZGVkQ29sdW1uLnN0eWxlXHJcbiAgICAgICAgfSBlbHNlIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIEhhbmRsZSBOb3JtYWwgQ29sdW1uLlxyXG4gICAgICBlbHNlIGlmIChjb2xsYXBzZWQpIGNvbHVtbiA9IE9iamVjdC5hc3NpZ24oY29sdW1uLCBGb2xkZWRDb2x1bW4pXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMgPSBjb2x1bW5zID0+XHJcbiAgICAgIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKCFjb2wuZm9sZGFibGUpIHJldHVybiBjb2xcclxuXHJcbiAgICAgICAgLy8gSWYgY29sIGRvbid0IGhhdmUgaWQgdGhlbiBnZW5lcmF0ZSBpZCBiYXNlZCBvbiBpbmRleFxyXG4gICAgICAgIGlmICghY29sLmlkKSBjb2wuaWQgPSBgY29sXyR7aW5kZXh9YFxyXG5cclxuICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKVxyXG4gICAgICAgIC8vIFJlcGxhY2UgY3VycmVudCBoZWFkZXIgd2l0aCBpbnRlcm5hbCBoZWFkZXIgcmVuZGVyLlxyXG4gICAgICAgIGNvbC5IZWFkZXIgPSBjID0+IHRoaXMuZm9sZGFibGVIZWFkZXJSZW5kZXIoYylcclxuICAgICAgICAvLyBhcHBseSBmb2xkYWJsZVxyXG4gICAgICAgIHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbihjb2wpXHJcblxyXG4gICAgICAgIC8vIHJldHVybiB0aGUgbmV3IGNvbHVtbiBvdXRcclxuICAgICAgICByZXR1cm4gY29sXHJcbiAgICAgIH0pXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgY29sdW1uczogb3JpZ2luYWxDb2xzLFxyXG4gICAgICAgIEZvbGRCdXR0b25Db21wb25lbnQsXHJcbiAgICAgICAgRm9sZEljb25Db21wb25lbnQsXHJcbiAgICAgICAgRm9sZGVkQ29sdW1uLFxyXG4gICAgICAgIC4uLnJlc3RcclxuICAgICAgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pXHJcblxyXG4gICAgICBjb25zdCBleHRyYSA9IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgIG9uUmVzaXplZENoYW5nZTogdGhpcy5vblJlc2l6ZWRDaGFuZ2UsXHJcbiAgICAgICAgcmVzaXplZDogdGhpcy5zdGF0ZS5yZXNpemVkLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gPFJlYWN0VGFibGUgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVEZvbGRhYmxlVGFibGUnXHJcbiAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBGb2xkSWNvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50LFxyXG4gICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXHJcbiAgICBmb2xkYWJsZU9yaWdpbmFsS2V5OiAnb3JpZ2luYWxfJyxcclxuICAgIEZvbGRlZENvbHVtbjoge1xyXG4gICAgICBDZWxsOiBjID0+ICcnLFxyXG4gICAgICB3aWR0aDogMzAsXHJcbiAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgICB9LFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHdyYXBwZXJcclxufVxyXG4iXX0=