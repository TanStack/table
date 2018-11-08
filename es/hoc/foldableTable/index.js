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
      { style: { "textAlign": "left" } },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwid3JhcHBlciIsInByb3BzIiwiY29udGV4dCIsIm9uUmVzaXplZENoYW5nZSIsInJlc2l6ZWQiLCJzZXRTdGF0ZSIsInJlbW92ZVJlc2l6ZWQiLCJpZCIsImNvbHVtbiIsInN0YXRlIiwicnMiLCJmaW5kIiwiciIsIm5ld1Jlc2l6ZWQiLCJmaWx0ZXIiLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldENvcGllZEtleSIsImZvbGRhYmxlT3JpZ2luYWxLZXkiLCJrZXkiLCJjb3B5T3JpZ2luYWxzIiwiRm9sZGVkQ29sdW1uIiwib3JpZ2luYWxfSGVhZGVyIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb3BpZWRLZXkiLCJrIiwiYyIsInZhbHVlIiwiY29sdW1ucyIsIm9yaWdpbmFsX0NvbHVtbnMiLCJIZWFkZXIiLCJyZXN0b3JlVG9PcmlnaW5hbCIsImdldFN0YXRlIiwib25Gb2xkQ2hhbmdlIiwiZm9sZGVkIiwiaXNGb2xkZWQiLCJjb2wiLCJmb2xkaW5nSGFuZGxlciIsIm5ld0ZvbGQiLCJhc3NpZ24iLCJmb2xkYWJsZUhlYWRlclJlbmRlciIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsImNlbGwiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxPQUFPQyxJQUFQLE1BQWlCLFlBQWpCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixhQUFsQjs7QUFFQSxJQUFNQywyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sNkJBQUssS0FBS0YsS0FBVixFQUFpQixPQUFPRyxLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLDZCQUFLLEtBQUtKLElBQVYsRUFBZ0IsT0FBT0ksS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNRSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQkosU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJLLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTUwsUUFBUTtBQUNaTSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9WLEtBQVosRUFBbUIsU0FBU0ssT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcs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L1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgbGVmdCBmcm9tICcuL2xlZnQuc3ZnJ1xyXG5pbXBvcnQgcmlnaHQgZnJvbSAnLi9yaWdodC5zdmcnXHJcblxyXG5jb25zdCBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQgPSAoeyBjb2xsYXBzZWQgfSkgPT4ge1xyXG4gIGNvbnN0IHN0eWxlID0geyB3aWR0aDogMjUgfVxyXG5cclxuICBpZiAoY29sbGFwc2VkKSByZXR1cm4gPGltZyBzcmM9e3JpZ2h0fSBzdHlsZT17c3R5bGV9IGFsdD1cInJpZ2h0XCIgLz5cclxuICByZXR1cm4gPGltZyBzcmM9e2xlZnR9IHN0eWxlPXtzdHlsZX0gYWx0PVwibGVmdFwiIC8+XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRGb2xkQnV0dG9uQ29tcG9uZW50ID0gKHsgaGVhZGVyLCBjb2xsYXBzZWQsIGljb24sIG9uQ2xpY2sgfSkgPT4ge1xyXG4gIGNvbnN0IHN0eWxlID0ge1xyXG4gICAgbWFyZ2luTGVmdDogJzBweCcsXHJcbiAgICBtYXJnaW5Ub3A6ICctNXB4JyxcclxuICAgIG1hcmdpbkJvdHRvbTogJy04cHgnLFxyXG4gICAgZmxvYXQ6ICdsZWZ0JyxcclxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfT5cclxuICAgICAgICB7aWNvbn1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIHshY29sbGFwc2VkICYmIDxkaXYgc3R5bGU9e3tcInRleHRBbGlnblwiOiBcImxlZnRcIn19ID57aGVhZGVyfTwvZGl2Pn1cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVhY3RUYWJsZSA9PiB7XHJcbiAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJURm9sZGFibGVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dClcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgZm9sZGVkOiBwcm9wcy5vbkZvbGRDaGFuZ2UgPyB1bmRlZmluZWQgOiB7fSxcclxuICAgICAgICByZXNpemVkOiBwcm9wcy5yZXNpemVkIHx8IFtdLFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5yZXNpemVkICE9PSBuZXdQcm9wcy5yZXNpemVkKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwID0+ICh7IHJlc2l6ZWQ6IG5ld1Byb3BzLnJlc2l6ZWQgfSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJlc2l6ZWRDaGFuZ2UgPSByZXNpemVkID0+IHtcclxuICAgICAgY29uc3QgeyBvblJlc2l6ZWRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgaWYgKG9uUmVzaXplZENoYW5nZSkgb25SZXNpemVkQ2hhbmdlKHJlc2l6ZWQpXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUocCA9PiAoeyByZXNpemVkIH0pKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUmVzaXplZCA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbHVtblxyXG4gICAgICBpZiAoIWlkKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZVxyXG4gICAgICBpZiAoIXJlc2l6ZWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZClcclxuICAgICAgaWYgKCFycykgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIociA9PiByICE9PSBycylcclxuICAgICAgdGhpcy5vblJlc2l6ZWRDaGFuZ2UobmV3UmVzaXplZClcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZS5cclxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcclxuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcclxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXHJcbiAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvcGllZEtleSA9IGtleSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICByZXR1cm4gYCR7Zm9sZGFibGVPcmlnaW5hbEtleX0ke2tleX1gXHJcbiAgICB9XHJcblxyXG4gICAgY29weU9yaWdpbmFscyA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICAvLyBTdG9wIGNvcHkgaWYgdGhlIGNvbHVtbiBhbHJlYWR5IGNvcGllZFxyXG4gICAgICBpZiAoY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgcmV0dXJuXHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoaylcclxuXHJcbiAgICAgICAgaWYgKGsgPT09ICdDZWxsJykgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba10gPyBjb2x1bW5ba10gOiBjID0+IGMudmFsdWVcclxuICAgICAgICBlbHNlIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBDb3B5IHN1YiBDb2x1bW5zXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiAhY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zID0gY29sdW1uLmNvbHVtbnNcclxuXHJcbiAgICAgIC8vIENvcHkgSGVhZGVyXHJcbiAgICAgIGlmICghY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXJcclxuICAgIH1cclxuXHJcbiAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgLy8gaWdub3JlIGhlYWRlciBhcyBoYW5kbGluZyBieSBmb2xkYWJsZUhlYWRlclJlbmRlclxyXG4gICAgICAgIGlmIChrID09PSAnSGVhZGVyJykgcmV0dXJuXHJcblxyXG4gICAgICAgIGNvbnN0IGNvcGllZEtleSA9IHRoaXMuZ2V0Q29waWVkS2V5KGspXHJcbiAgICAgICAgY29sdW1uW2tdID0gY29sdW1uW2NvcGllZEtleV1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucykgY29sdW1uLmNvbHVtbnMgPSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1uc1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0YXRlID0gKCkgPT4gKHRoaXMucHJvcHMub25Gb2xkQ2hhbmdlID8gdGhpcy5wcm9wcy5mb2xkZWQgOiB0aGlzLnN0YXRlLmZvbGRlZClcclxuXHJcbiAgICBpc0ZvbGRlZCA9IGNvbCA9PiB7XHJcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxyXG4gICAgICByZXR1cm4gZm9sZGVkW2NvbC5pZF0gPT09IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBmb2xkaW5nSGFuZGxlciA9IGNvbCA9PiB7XHJcbiAgICAgIGlmICghY29sIHx8ICFjb2wuaWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgeyBvbkZvbGRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbFxyXG5cclxuICAgICAgY29uc3QgbmV3Rm9sZCA9IE9iamVjdC5hc3NpZ24oe30sIGZvbGRlZClcclxuICAgICAgbmV3Rm9sZFtpZF0gPSAhbmV3Rm9sZFtpZF1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0aGUgUmVzaXplZCBpZiBoYXZlXHJcbiAgICAgIHRoaXMucmVtb3ZlUmVzaXplZChjb2wpXHJcblxyXG4gICAgICBpZiAob25Gb2xkQ2hhbmdlKSBvbkZvbGRDaGFuZ2UobmV3Rm9sZClcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiAoeyBmb2xkZWQ6IG5ld0ZvbGQgfSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb2xkYWJsZUhlYWRlclJlbmRlciA9IGNlbGwgPT4ge1xyXG4gICAgICBjb25zdCB7IEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBjZWxsXHJcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxyXG4gICAgICBjb25zdCBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkSWNvbkNvbXBvbmVudCwgeyBjb2xsYXBzZWQgfSlcclxuICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHRoaXMuZm9sZGluZ0hhbmRsZXIoY29sdW1uKVxyXG5cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEJ1dHRvbkNvbXBvbmVudCwge1xyXG4gICAgICAgIGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlcixcclxuICAgICAgICBjb2xsYXBzZWQsXHJcbiAgICAgICAgaWNvbixcclxuICAgICAgICBvbkNsaWNrLFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5Rm9sZGFibGVGb3JDb2x1bW4gPSBjb2x1bW4gPT4ge1xyXG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcclxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIC8vIEhhbmRsZSBDb2x1bW4gSGVhZGVyXHJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICAgIGlmIChjb2xsYXBzZWQpIHtcclxuICAgICAgICAgIGNvbHVtbi5jb2x1bW5zID0gW0ZvbGRlZENvbHVtbl1cclxuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aFxyXG4gICAgICAgICAgY29sdW1uLnN0eWxlID0gRm9sZGVkQ29sdW1uLnN0eWxlXHJcbiAgICAgICAgfSBlbHNlIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxyXG4gICAgICB9XHJcbiAgICAgIC8vIEhhbmRsZSBOb3JtYWwgQ29sdW1uLlxyXG4gICAgICBlbHNlIGlmIChjb2xsYXBzZWQpIGNvbHVtbiA9IE9iamVjdC5hc3NpZ24oY29sdW1uLCBGb2xkZWRDb2x1bW4pXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMgPSBjb2x1bW5zID0+XHJcbiAgICAgIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKCFjb2wuZm9sZGFibGUpIHJldHVybiBjb2xcclxuXHJcbiAgICAgICAgLy8gSWYgY29sIGRvbid0IGhhdmUgaWQgdGhlbiBnZW5lcmF0ZSBpZCBiYXNlZCBvbiBpbmRleFxyXG4gICAgICAgIGlmICghY29sLmlkKSBjb2wuaWQgPSBgY29sXyR7aW5kZXh9YFxyXG5cclxuICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKVxyXG4gICAgICAgIC8vIFJlcGxhY2UgY3VycmVudCBoZWFkZXIgd2l0aCBpbnRlcm5hbCBoZWFkZXIgcmVuZGVyLlxyXG4gICAgICAgIGNvbC5IZWFkZXIgPSBjID0+IHRoaXMuZm9sZGFibGVIZWFkZXJSZW5kZXIoYylcclxuICAgICAgICAvLyBhcHBseSBmb2xkYWJsZVxyXG4gICAgICAgIHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbihjb2wpXHJcblxyXG4gICAgICAgIC8vIHJldHVybiB0aGUgbmV3IGNvbHVtbiBvdXRcclxuICAgICAgICByZXR1cm4gY29sXHJcbiAgICAgIH0pXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgY29sdW1uczogb3JpZ2luYWxDb2xzLFxyXG4gICAgICAgIEZvbGRCdXR0b25Db21wb25lbnQsXHJcbiAgICAgICAgRm9sZEljb25Db21wb25lbnQsXHJcbiAgICAgICAgRm9sZGVkQ29sdW1uLFxyXG4gICAgICAgIC4uLnJlc3RcclxuICAgICAgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pXHJcblxyXG4gICAgICBjb25zdCBleHRyYSA9IHtcclxuICAgICAgICBjb2x1bW5zLFxyXG4gICAgICAgIG9uUmVzaXplZENoYW5nZTogdGhpcy5vblJlc2l6ZWRDaGFuZ2UsXHJcbiAgICAgICAgcmVzaXplZDogdGhpcy5zdGF0ZS5yZXNpemVkLFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gPFJlYWN0VGFibGUgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVEZvbGRhYmxlVGFibGUnXHJcbiAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBGb2xkSWNvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50LFxyXG4gICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXHJcbiAgICBmb2xkYWJsZU9yaWdpbmFsS2V5OiAnb3JpZ2luYWxfJyxcclxuICAgIEZvbGRlZENvbHVtbjoge1xyXG4gICAgICBDZWxsOiBjID0+ICcnLFxyXG4gICAgICB3aWR0aDogMzAsXHJcbiAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgICB9LFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHdyYXBwZXJcclxufVxyXG4iXX0=