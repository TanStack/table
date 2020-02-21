'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */

exports.default = function (Component) {
  var _class, _temp, _initialiseProps;

  var wrapper = (_temp = _class = function (_React$Component) {
    _inherits(RTTreeTable, _React$Component);

    function RTTreeTable(props) {
      _classCallCheck(this, RTTreeTable);

      var _this = _possibleConstructorReturn(this, (RTTreeTable.__proto__ || Object.getPrototypeOf(RTTreeTable)).call(this, props));

      _initialiseProps.call(_this);

      _this.getWrappedInstance.bind(_this);
      _this.TrComponent.bind(_this);
      _this.getTrProps.bind(_this);
      return _this;
    }

    // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll


    _createClass(RTTreeTable, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            columns = _props.columns,
            treeTableIndent = _props.treeTableIndent,
            rest = _objectWithoutProperties(_props, ['columns', 'treeTableIndent']);

        var TrComponent = this.TrComponent,
            getTrProps = this.getTrProps;

        var extra = {
          columns: columns.map(function (col) {
            var column = col;
            if (rest.pivotBy && (rest.pivotBy.includes(col.accessor) || rest.pivotBy.includes(col.id))) {
              column = {
                id: col.id,
                accessor: col.accessor,
                width: treeTableIndent + 'px',
                show: false,
                Header: '',
                Expander: col.Expander,
                PivotValue: col.PivotValue,
                Pivot: col.Pivot
              };
            }
            return column;
          }),
          TrComponent: TrComponent,
          getTrProps: getTrProps
        };

        return _react2.default.createElement(Component, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTTreeTable;
  }(_react2.default.Component), _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.getWrappedInstance = function () {
      if (!_this3.wrappedInstance) console.warn('RTTreeTable - No wrapped instance');
      if (_this3.wrappedInstance.getWrappedInstance) return _this3.wrappedInstance.getWrappedInstance();else return _this3.wrappedInstance;
    };

    this.TrComponent = function (props) {
      var ri = props.ri,
          rest = _objectWithoutProperties(props, ['ri']);

      if (ri && ri.groupedByPivot) {
        var cell = _extends({}, props.children[ri.level]);

        cell.props.style.flex = 'unset';
        cell.props.style.width = '100%';
        cell.props.style.maxWidth = 'unset';
        cell.props.style.paddingLeft = _this3.props.treeTableIndent * ri.level + 'px';
        // cell.props.style.backgroundColor = '#DDD';
        cell.props.style.borderBottom = '1px solid rgba(128,128,128,0.2)';

        return _react2.default.createElement(
          'div',
          { className: 'rt-tr ' + rest.className, role: 'row', style: rest.style },
          cell
        );
      }
      return _react2.default.createElement(Component.defaultProps.TrComponent, rest);
    };

    this.getTrProps = function (state, ri, ci, instance) {
      return { ri: ri };
    };
  }, _temp);
  wrapper.displayName = 'RTTreeTable';
  wrapper.defaultProps = {
    treeTableIndent: 10
  };

  return wrapper;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvdHJlZVRhYmxlL2luZGV4LmpzIl0sIm5hbWVzIjpbIndyYXBwZXIiLCJwcm9wcyIsImdldFdyYXBwZWRJbnN0YW5jZSIsImJpbmQiLCJUckNvbXBvbmVudCIsImdldFRyUHJvcHMiLCJjb2x1bW5zIiwidHJlZVRhYmxlSW5kZW50IiwicmVzdCIsImV4dHJhIiwibWFwIiwiY29sdW1uIiwiY29sIiwicGl2b3RCeSIsImluY2x1ZGVzIiwiYWNjZXNzb3IiLCJpZCIsIndpZHRoIiwic2hvdyIsIkhlYWRlciIsIkV4cGFuZGVyIiwiUGl2b3RWYWx1ZSIsIlBpdm90Iiwid3JhcHBlZEluc3RhbmNlIiwiciIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc29sZSIsIndhcm4iLCJyaSIsImdyb3VwZWRCeVBpdm90IiwiY2VsbCIsImNoaWxkcmVuIiwibGV2ZWwiLCJzdHlsZSIsImZsZXgiLCJtYXhXaWR0aCIsInBhZGRpbmdMZWZ0IiwiYm9yZGVyQm90dG9tIiwiY2xhc3NOYW1lIiwic3RhdGUiLCJjaSIsImluc3RhbmNlIiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7OytlQUZBOztrQkFJZSxxQkFBYTtBQUFBOztBQUMxQixNQUFNQTtBQUFBOztBQUNKLHlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNEhBQ1hBLEtBRFc7O0FBQUE7O0FBRWpCLFlBQUtDLGtCQUFMLENBQXdCQyxJQUF4QjtBQUNBLFlBQUtDLFdBQUwsQ0FBaUJELElBQWpCO0FBQ0EsWUFBS0UsVUFBTCxDQUFnQkYsSUFBaEI7QUFKaUI7QUFLbEI7O0FBRUQ7OztBQVJJO0FBQUE7QUFBQSwrQkF3Q0s7QUFBQTs7QUFBQSxxQkFDdUMsS0FBS0YsS0FENUM7QUFBQSxZQUNDSyxPQURELFVBQ0NBLE9BREQ7QUFBQSxZQUNVQyxlQURWLFVBQ1VBLGVBRFY7QUFBQSxZQUM4QkMsSUFEOUI7O0FBQUEsWUFFQ0osV0FGRCxHQUU2QixJQUY3QixDQUVDQSxXQUZEO0FBQUEsWUFFY0MsVUFGZCxHQUU2QixJQUY3QixDQUVjQSxVQUZkOztBQUdQLFlBQU1JLFFBQVE7QUFDWkgsbUJBQVNBLFFBQVFJLEdBQVIsQ0FBWSxlQUFPO0FBQzFCLGdCQUFJQyxTQUFTQyxHQUFiO0FBQ0EsZ0JBQUlKLEtBQUtLLE9BQUwsS0FBaUJMLEtBQUtLLE9BQUwsQ0FBYUMsUUFBYixDQUFzQkYsSUFBSUcsUUFBMUIsS0FBdUNQLEtBQUtLLE9BQUwsQ0FBYUMsUUFBYixDQUFzQkYsSUFBSUksRUFBMUIsQ0FBeEQsQ0FBSixFQUE0RjtBQUMxRkwsdUJBQVM7QUFDUEssb0JBQUlKLElBQUlJLEVBREQ7QUFFUEQsMEJBQVVILElBQUlHLFFBRlA7QUFHUEUsdUJBQVVWLGVBQVYsT0FITztBQUlQVyxzQkFBTSxLQUpDO0FBS1BDLHdCQUFRLEVBTEQ7QUFNUEMsMEJBQVVSLElBQUlRLFFBTlA7QUFPUEMsNEJBQVlULElBQUlTLFVBUFQ7QUFRUEMsdUJBQU9WLElBQUlVO0FBUkosZUFBVDtBQVVEO0FBQ0QsbUJBQU9YLE1BQVA7QUFDRCxXQWZRLENBREc7QUFpQlpQLGtDQWpCWTtBQWtCWkM7QUFsQlksU0FBZDs7QUFxQkEsZUFBTyw4QkFBQyxTQUFELGVBQWVHLElBQWYsRUFBeUJDLEtBQXpCLElBQWdDLEtBQUs7QUFBQSxtQkFBTSxPQUFLYyxlQUFMLEdBQXVCQyxDQUE3QjtBQUFBLFdBQXJDLElBQVA7QUFDRDtBQWpFRzs7QUFBQTtBQUFBLElBQW9DQyxnQkFBTUMsU0FBMUM7QUFBQTs7QUFBQSxTQVNKeEIsa0JBVEksR0FTaUIsWUFBTTtBQUN6QixVQUFJLENBQUMsT0FBS3FCLGVBQVYsRUFBMkJJLFFBQVFDLElBQVIsQ0FBYSxtQ0FBYjtBQUMzQixVQUFJLE9BQUtMLGVBQUwsQ0FBcUJyQixrQkFBekIsRUFBNkMsT0FBTyxPQUFLcUIsZUFBTCxDQUFxQnJCLGtCQUFyQixFQUFQLENBQTdDLEtBQ0ssT0FBTyxPQUFLcUIsZUFBWjtBQUNOLEtBYkc7O0FBQUEsU0FlSm5CLFdBZkksR0FlVSxpQkFBUztBQUFBLFVBQ2J5QixFQURhLEdBQ0c1QixLQURILENBQ2I0QixFQURhO0FBQUEsVUFDTnJCLElBRE0sNEJBQ0dQLEtBREg7O0FBRXJCLFVBQUk0QixNQUFNQSxHQUFHQyxjQUFiLEVBQTZCO0FBQzNCLFlBQU1DLG9CQUFZOUIsTUFBTStCLFFBQU4sQ0FBZUgsR0FBR0ksS0FBbEIsQ0FBWixDQUFOOztBQUVBRixhQUFLOUIsS0FBTCxDQUFXaUMsS0FBWCxDQUFpQkMsSUFBakIsR0FBd0IsT0FBeEI7QUFDQUosYUFBSzlCLEtBQUwsQ0FBV2lDLEtBQVgsQ0FBaUJqQixLQUFqQixHQUF5QixNQUF6QjtBQUNBYyxhQUFLOUIsS0FBTCxDQUFXaUMsS0FBWCxDQUFpQkUsUUFBakIsR0FBNEIsT0FBNUI7QUFDQUwsYUFBSzlCLEtBQUwsQ0FBV2lDLEtBQVgsQ0FBaUJHLFdBQWpCLEdBQWtDLE9BQUtwQyxLQUFMLENBQVdNLGVBQVgsR0FBNkJzQixHQUFHSSxLQUFsRTtBQUNBO0FBQ0FGLGFBQUs5QixLQUFMLENBQVdpQyxLQUFYLENBQWlCSSxZQUFqQixHQUFnQyxpQ0FBaEM7O0FBRUEsZUFDRTtBQUFBO0FBQUEsWUFBSyxzQkFBb0I5QixLQUFLK0IsU0FBOUIsRUFBMkMsTUFBSyxLQUFoRCxFQUFzRCxPQUFPL0IsS0FBSzBCLEtBQWxFO0FBQ0dIO0FBREgsU0FERjtBQUtEO0FBQ0QsYUFBTyw4QkFBQyxTQUFELENBQVcsWUFBWCxDQUF3QixXQUF4QixFQUF3Q3ZCLElBQXhDLENBQVA7QUFDRCxLQWxDRzs7QUFBQSxTQW9DSkgsVUFwQ0ksR0FvQ1MsVUFBQ21DLEtBQUQsRUFBUVgsRUFBUixFQUFZWSxFQUFaLEVBQWdCQyxRQUFoQixFQUE2QjtBQUN4QyxhQUFPLEVBQUViLE1BQUYsRUFBUDtBQUNELEtBdENHO0FBQUEsV0FBTjtBQW1FQTdCLFVBQVEyQyxXQUFSLEdBQXNCLGFBQXRCO0FBQ0EzQyxVQUFRNEMsWUFBUixHQUF1QjtBQUNyQnJDLHFCQUFpQjtBQURJLEdBQXZCOztBQUlBLFNBQU9QLE9BQVA7QUFDRCxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQgPT4ge1xuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRUcmVlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcbiAgICAgIHRoaXMuZ2V0V3JhcHBlZEluc3RhbmNlLmJpbmQodGhpcylcbiAgICAgIHRoaXMuVHJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5nZXRUclByb3BzLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZSB0byBnZXQgYXQgdGhlIHNvcnRlZERhdGEgZm9yIHNlbGVjdEFsbFxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRUcmVlVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgZWxzZSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICB9XG5cbiAgICBUckNvbXBvbmVudCA9IHByb3BzID0+IHtcbiAgICAgIGNvbnN0IHsgcmksIC4uLnJlc3QgfSA9IHByb3BzXG4gICAgICBpZiAocmkgJiYgcmkuZ3JvdXBlZEJ5UGl2b3QpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IHsgLi4ucHJvcHMuY2hpbGRyZW5bcmkubGV2ZWxdIH1cblxuICAgICAgICBjZWxsLnByb3BzLnN0eWxlLmZsZXggPSAndW5zZXQnXG4gICAgICAgIGNlbGwucHJvcHMuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5tYXhXaWR0aCA9ICd1bnNldCdcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5wYWRkaW5nTGVmdCA9IGAke3RoaXMucHJvcHMudHJlZVRhYmxlSW5kZW50ICogcmkubGV2ZWx9cHhgXG4gICAgICAgIC8vIGNlbGwucHJvcHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNEREQnO1xuICAgICAgICBjZWxsLnByb3BzLnN0eWxlLmJvcmRlckJvdHRvbSA9ICcxcHggc29saWQgcmdiYSgxMjgsMTI4LDEyOCwwLjIpJ1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BydC10ciAke3Jlc3QuY2xhc3NOYW1lfWB9IHJvbGU9XCJyb3dcIiBzdHlsZT17cmVzdC5zdHlsZX0+XG4gICAgICAgICAgICB7Y2VsbH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIDxDb21wb25lbnQuZGVmYXVsdFByb3BzLlRyQ29tcG9uZW50IHsuLi5yZXN0fSAvPlxuICAgIH1cblxuICAgIGdldFRyUHJvcHMgPSAoc3RhdGUsIHJpLCBjaSwgaW5zdGFuY2UpID0+IHtcbiAgICAgIHJldHVybiB7IHJpIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGNvbHVtbnMsIHRyZWVUYWJsZUluZGVudCwgLi4ucmVzdCB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgeyBUckNvbXBvbmVudCwgZ2V0VHJQcm9wcyB9ID0gdGhpc1xuICAgICAgY29uc3QgZXh0cmEgPSB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMubWFwKGNvbCA9PiB7XG4gICAgICAgICAgbGV0IGNvbHVtbiA9IGNvbFxuICAgICAgICAgIGlmIChyZXN0LnBpdm90QnkgJiYgKHJlc3QucGl2b3RCeS5pbmNsdWRlcyhjb2wuYWNjZXNzb3IpIHx8IHJlc3QucGl2b3RCeS5pbmNsdWRlcyhjb2wuaWQpKSkge1xuICAgICAgICAgICAgY29sdW1uID0ge1xuICAgICAgICAgICAgICBpZDogY29sLmlkLFxuICAgICAgICAgICAgICBhY2Nlc3NvcjogY29sLmFjY2Vzc29yLFxuICAgICAgICAgICAgICB3aWR0aDogYCR7dHJlZVRhYmxlSW5kZW50fXB4YCxcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgIEhlYWRlcjogJycsXG4gICAgICAgICAgICAgIEV4cGFuZGVyOiBjb2wuRXhwYW5kZXIsXG4gICAgICAgICAgICAgIFBpdm90VmFsdWU6IGNvbC5QaXZvdFZhbHVlLFxuICAgICAgICAgICAgICBQaXZvdDogY29sLlBpdm90LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29sdW1uXG4gICAgICAgIH0pLFxuICAgICAgICBUckNvbXBvbmVudCxcbiAgICAgICAgZ2V0VHJQcm9wcyxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxuICAgIH1cbiAgfVxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JUVHJlZVRhYmxlJ1xuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgICB0cmVlVGFibGVJbmRlbnQ6IDEwLFxuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXJcbn1cbiJdfQ==