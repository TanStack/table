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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwid3JhcHBlciIsInByb3BzIiwiY29udGV4dCIsIm9uUmVzaXplZENoYW5nZSIsInJlc2l6ZWQiLCJzZXRTdGF0ZSIsInJlbW92ZVJlc2l6ZWQiLCJpZCIsImNvbHVtbiIsInN0YXRlIiwicnMiLCJmaW5kIiwiciIsIm5ld1Jlc2l6ZWQiLCJmaWx0ZXIiLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldENvcGllZEtleSIsImZvbGRhYmxlT3JpZ2luYWxLZXkiLCJrZXkiLCJjb3B5T3JpZ2luYWxzIiwiRm9sZGVkQ29sdW1uIiwib3JpZ2luYWxfSGVhZGVyIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb3BpZWRLZXkiLCJrIiwiYyIsInZhbHVlIiwiY29sdW1ucyIsIm9yaWdpbmFsX0NvbHVtbnMiLCJIZWFkZXIiLCJyZXN0b3JlVG9PcmlnaW5hbCIsImdldFN0YXRlIiwib25Gb2xkQ2hhbmdlIiwiZm9sZGVkIiwiaXNGb2xkZWQiLCJjb2wiLCJmb2xkaW5nSGFuZGxlciIsIm5ld0ZvbGQiLCJhc3NpZ24iLCJmb2xkYWJsZUhlYWRlclJlbmRlciIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsImNlbGwiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxPQUFPQyxJQUFQLE1BQWlCLFlBQWpCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixhQUFsQjs7QUFFQSxJQUFNQywyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sNkJBQUssS0FBS0YsS0FBVixFQUFpQixPQUFPRyxLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLDZCQUFLLEtBQUtKLElBQVYsRUFBZ0IsT0FBT0ksS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNRSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQkosU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJLLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTUwsUUFBUTtBQUNaTSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9WLEtBQVosRUFBbUIsU0FBU0ssT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcs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LE9BQXBCLEVBQU47QUFBQSxXQUFkO0FBQ0Q7QUFDRjs7QUF3QkQ7O0FBdENJO0FBQUE7QUFBQSwrQkFpS0s7QUFBQTs7QUFBQSxxQkFPSCxLQUFLSCxLQVBGO0FBQUEsWUFFSXVELFlBRkosVUFFTHhCLE9BRks7QUFBQSxZQUdMYSxtQkFISyxVQUdMQSxtQkFISztBQUFBLFlBSUxDLGlCQUpLLFVBSUxBLGlCQUpLO0FBQUEsWUFLTHZCLFlBTEssVUFLTEEsWUFMSztBQUFBLFlBTUZrQyxJQU5FOztBQVFQLFlBQU16QixVQUFVLEtBQUtrQix1QkFBTCw4QkFBaUNNLFlBQWpDLEdBQWhCOztBQUVBLFlBQU1FLFFBQVE7QUFDWjFCLDBCQURZO0FBRVo3QiwyQkFBaUIsS0FBS0EsZUFGVjtBQUdaQyxtQkFBUyxLQUFLSyxLQUFMLENBQVdMO0FBSFIsU0FBZDs7QUFNQSxlQUFPLG9CQUFDLFVBQUQsZUFBZ0JxRCxJQUFoQixFQUEwQkMsS0FBMUIsSUFBaUMsS0FBSztBQUFBLG1CQUFNLE9BQUsxQyxlQUFMLEdBQXVCSixDQUE3QjtBQUFBLFdBQXRDLElBQVA7QUFDRDtBQWxMRzs7QUFBQTtBQUFBLElBQXdDNUIsTUFBTTJFLFNBQTlDLENBQU47O0FBcUxBM0QsVUFBUTRELFdBQVIsR0FBc0IsaUJBQXRCO0FBQ0E1RCxVQUFRNkQsWUFBUixHQUF1QjtBQUNyQmYsdUJBQW1CM0Qsd0JBREU7QUFFckIwRCx5QkFBcUJ0RCwwQkFGQTtBQUdyQjZCLHlCQUFxQixXQUhBO0FBSXJCRyxrQkFBYztBQUNadUMsWUFBTTtBQUFBLGVBQUssRUFBTDtBQUFBLE9BRE07QUFFWnhFLGFBQU8sRUFGSztBQUdaeUUsZ0JBQVUsS0FIRTtBQUlaQyxpQkFBVyxLQUpDO0FBS1pDLGtCQUFZO0FBTEE7QUFKTyxHQUF2Qjs7QUFhQSxTQUFPakUsT0FBUDtBQUNELENBck1EIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGxlZnQgZnJvbSAnLi9sZWZ0LnN2ZydcbmltcG9ydCByaWdodCBmcm9tICcuL3JpZ2h0LnN2ZydcblxuY29uc3QgZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50ID0gKHsgY29sbGFwc2VkIH0pID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB7IHdpZHRoOiAyNSB9XG5cbiAgaWYgKGNvbGxhcHNlZCkgcmV0dXJuIDxpbWcgc3JjPXtyaWdodH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJyaWdodFwiIC8+XG4gIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cbn1cblxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XG4gIGNvbnN0IHN0eWxlID0ge1xuICAgIG1hcmdpbkxlZnQ6ICcwcHgnLFxuICAgIG1hcmdpblRvcDogJy01cHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJy04cHgnLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gb25DbGljaz17b25DbGlja30+XG4gICAgICAgIHtpY29ufVxuICAgICAgPC9kaXY+XG4gICAgICB7IWNvbGxhcHNlZCAmJiA8ZGl2PntoZWFkZXJ9PC9kaXY+fVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0VGFibGUgPT4ge1xuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRGb2xkYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXG5cbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGZvbGRlZDogcHJvcHMub25Gb2xkQ2hhbmdlID8gdW5kZWZpbmVkIDoge30sXG4gICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW10sXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXdQcm9wcykge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucmVzaXplZCAhPT0gbmV3UHJvcHMucmVzaXplZCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4gKHsgcmVzaXplZDogbmV3UHJvcHMucmVzaXplZCB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblJlc2l6ZWRDaGFuZ2UgPSByZXNpemVkID0+IHtcbiAgICAgIGNvbnN0IHsgb25SZXNpemVkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgICBpZiAob25SZXNpemVkQ2hhbmdlKSBvblJlc2l6ZWRDaGFuZ2UocmVzaXplZClcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHAgPT4gKHsgcmVzaXplZCB9KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVSZXNpemVkID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbHVtblxuICAgICAgaWYgKCFpZCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgcmVzaXplZCB9ID0gdGhpcy5zdGF0ZVxuICAgICAgaWYgKCFyZXNpemVkKSByZXR1cm5cblxuICAgICAgY29uc3QgcnMgPSByZXNpemVkLmZpbmQociA9PiByLmlkID09PSBpZClcbiAgICAgIGlmICghcnMpIHJldHVyblxuXG4gICAgICBjb25zdCBuZXdSZXNpemVkID0gcmVzaXplZC5maWx0ZXIociA9PiByICE9PSBycylcbiAgICAgIHRoaXMub25SZXNpemVkQ2hhbmdlKG5ld1Jlc2l6ZWQpXG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUuXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVEZvbGRhYmxlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgZ2V0Q29waWVkS2V5ID0ga2V5ID0+IHtcbiAgICAgIGNvbnN0IHsgZm9sZGFibGVPcmlnaW5hbEtleSB9ID0gdGhpcy5wcm9wc1xuICAgICAgcmV0dXJuIGAke2ZvbGRhYmxlT3JpZ2luYWxLZXl9JHtrZXl9YFxuICAgIH1cblxuICAgIGNvcHlPcmlnaW5hbHMgPSBjb2x1bW4gPT4ge1xuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcblxuICAgICAgLy8gU3RvcCBjb3B5IGlmIHRoZSBjb2x1bW4gYWxyZWFkeSBjb3BpZWRcbiAgICAgIGlmIChjb2x1bW4ub3JpZ2luYWxfSGVhZGVyKSByZXR1cm5cblxuICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxuXG4gICAgICAgIGlmIChrID09PSAnQ2VsbCcpIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdID8gY29sdW1uW2tdIDogYyA9PiBjLnZhbHVlXG4gICAgICAgIGVsc2UgY29sdW1uW2NvcGllZEtleV0gPSBjb2x1bW5ba11cbiAgICAgIH0pXG5cbiAgICAgIC8vIENvcHkgc3ViIENvbHVtbnNcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiAhY29sdW1uLm9yaWdpbmFsX0NvbHVtbnMpIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zID0gY29sdW1uLmNvbHVtbnNcblxuICAgICAgLy8gQ29weSBIZWFkZXJcbiAgICAgIGlmICghY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgY29sdW1uLm9yaWdpbmFsX0hlYWRlciA9IGNvbHVtbi5IZWFkZXJcbiAgICB9XG5cbiAgICByZXN0b3JlVG9PcmlnaW5hbCA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCB7IEZvbGRlZENvbHVtbiB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBPYmplY3Qua2V5cyhGb2xkZWRDb2x1bW4pLmZvckVhY2goayA9PiB7XG4gICAgICAgIC8vIGlnbm9yZSBoZWFkZXIgYXMgaGFuZGxpbmcgYnkgZm9sZGFibGVIZWFkZXJSZW5kZXJcbiAgICAgICAgaWYgKGsgPT09ICdIZWFkZXInKSByZXR1cm5cblxuICAgICAgICBjb25zdCBjb3BpZWRLZXkgPSB0aGlzLmdldENvcGllZEtleShrKVxuICAgICAgICBjb2x1bW5ba10gPSBjb2x1bW5bY29waWVkS2V5XVxuICAgICAgfSlcblxuICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmIGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKSBjb2x1bW4uY29sdW1ucyA9IGNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zXG4gICAgfVxuXG4gICAgZ2V0U3RhdGUgPSAoKSA9PiAodGhpcy5wcm9wcy5vbkZvbGRDaGFuZ2UgPyB0aGlzLnByb3BzLmZvbGRlZCA6IHRoaXMuc3RhdGUuZm9sZGVkKVxuXG4gICAgaXNGb2xkZWQgPSBjb2wgPT4ge1xuICAgICAgY29uc3QgZm9sZGVkID0gdGhpcy5nZXRTdGF0ZSgpXG4gICAgICByZXR1cm4gZm9sZGVkW2NvbC5pZF0gPT09IHRydWVcbiAgICB9XG5cbiAgICBmb2xkaW5nSGFuZGxlciA9IGNvbCA9PiB7XG4gICAgICBpZiAoIWNvbCB8fCAhY29sLmlkKSByZXR1cm5cblxuICAgICAgY29uc3QgeyBvbkZvbGRDaGFuZ2UgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyBpZCB9ID0gY29sXG5cbiAgICAgIGNvbnN0IG5ld0ZvbGQgPSBPYmplY3QuYXNzaWduKHt9LCBmb2xkZWQpXG4gICAgICBuZXdGb2xkW2lkXSA9ICFuZXdGb2xkW2lkXVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIFJlc2l6ZWQgaWYgaGF2ZVxuICAgICAgdGhpcy5yZW1vdmVSZXNpemVkKGNvbClcblxuICAgICAgaWYgKG9uRm9sZENoYW5nZSkgb25Gb2xkQ2hhbmdlKG5ld0ZvbGQpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2aW91cyA9PiAoeyBmb2xkZWQ6IG5ld0ZvbGQgfSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9sZGFibGVIZWFkZXJSZW5kZXIgPSBjZWxsID0+IHtcbiAgICAgIGNvbnN0IHsgRm9sZEJ1dHRvbkNvbXBvbmVudCwgRm9sZEljb25Db21wb25lbnQgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBjZWxsXG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcbiAgICAgIGNvbnN0IGljb24gPSBSZWFjdC5jcmVhdGVFbGVtZW50KEZvbGRJY29uQ29tcG9uZW50LCB7IGNvbGxhcHNlZCB9KVxuICAgICAgY29uc3Qgb25DbGljayA9ICgpID0+IHRoaXMuZm9sZGluZ0hhbmRsZXIoY29sdW1uKVxuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkQnV0dG9uQ29tcG9uZW50LCB7XG4gICAgICAgIGhlYWRlcjogY29sdW1uLm9yaWdpbmFsX0hlYWRlcixcbiAgICAgICAgY29sbGFwc2VkLFxuICAgICAgICBpY29uLFxuICAgICAgICBvbkNsaWNrLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1uID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlZCA9IHRoaXMuaXNGb2xkZWQoY29sdW1uKVxuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcblxuICAgICAgLy8gSGFuZGxlIENvbHVtbiBIZWFkZXJcbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgICBpZiAoY29sbGFwc2VkKSB7XG4gICAgICAgICAgY29sdW1uLmNvbHVtbnMgPSBbRm9sZGVkQ29sdW1uXVxuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IEZvbGRlZENvbHVtbi53aWR0aFxuICAgICAgICAgIGNvbHVtbi5zdHlsZSA9IEZvbGRlZENvbHVtbi5zdHlsZVxuICAgICAgICB9IGVsc2UgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pXG4gICAgICB9XG4gICAgICAvLyBIYW5kbGUgTm9ybWFsIENvbHVtbi5cbiAgICAgIGVsc2UgaWYgKGNvbGxhcHNlZCkgY29sdW1uID0gT2JqZWN0LmFzc2lnbihjb2x1bW4sIEZvbGRlZENvbHVtbilcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnJlc3RvcmVUb09yaWdpbmFsKGNvbHVtbilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUZvbGRhYmxlRm9yQ29sdW1ucyA9IGNvbHVtbnMgPT5cbiAgICAgIGNvbHVtbnMubWFwKChjb2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICghY29sLmZvbGRhYmxlKSByZXR1cm4gY29sXG5cbiAgICAgICAgLy8gSWYgY29sIGRvbid0IGhhdmUgaWQgdGhlbiBnZW5lcmF0ZSBpZCBiYXNlZCBvbiBpbmRleFxuICAgICAgICBpZiAoIWNvbC5pZCkgY29sLmlkID0gYGNvbF8ke2luZGV4fWBcblxuICAgICAgICB0aGlzLmNvcHlPcmlnaW5hbHMoY29sKVxuICAgICAgICAvLyBSZXBsYWNlIGN1cnJlbnQgaGVhZGVyIHdpdGggaW50ZXJuYWwgaGVhZGVyIHJlbmRlci5cbiAgICAgICAgY29sLkhlYWRlciA9IGMgPT4gdGhpcy5mb2xkYWJsZUhlYWRlclJlbmRlcihjKVxuICAgICAgICAvLyBhcHBseSBmb2xkYWJsZVxuICAgICAgICB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW4oY29sKVxuXG4gICAgICAgIC8vIHJldHVybiB0aGUgbmV3IGNvbHVtbiBvdXRcbiAgICAgICAgcmV0dXJuIGNvbFxuICAgICAgfSlcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1uczogb3JpZ2luYWxDb2xzLFxuICAgICAgICBGb2xkQnV0dG9uQ29tcG9uZW50LFxuICAgICAgICBGb2xkSWNvbkNvbXBvbmVudCxcbiAgICAgICAgRm9sZGVkQ29sdW1uLFxuICAgICAgICAuLi5yZXN0XG4gICAgICB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMoWy4uLm9yaWdpbmFsQ29sc10pXG5cbiAgICAgIGNvbnN0IGV4dHJhID0ge1xuICAgICAgICBjb2x1bW5zLFxuICAgICAgICBvblJlc2l6ZWRDaGFuZ2U6IHRoaXMub25SZXNpemVkQ2hhbmdlLFxuICAgICAgICByZXNpemVkOiB0aGlzLnN0YXRlLnJlc2l6ZWQsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiA8UmVhY3RUYWJsZSB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVEZvbGRhYmxlVGFibGUnXG4gIHdyYXBwZXIuZGVmYXVsdFByb3BzID0ge1xuICAgIEZvbGRJY29uQ29tcG9uZW50OiBkZWZhdWx0Rm9sZEljb25Db21wb25lbnQsXG4gICAgRm9sZEJ1dHRvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQsXG4gICAgZm9sZGFibGVPcmlnaW5hbEtleTogJ29yaWdpbmFsXycsXG4gICAgRm9sZGVkQ29sdW1uOiB7XG4gICAgICBDZWxsOiBjID0+ICcnLFxuICAgICAgd2lkdGg6IDMwLFxuICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gd3JhcHBlclxufVxuIl19