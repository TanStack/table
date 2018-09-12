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
            if (rest.pivotBy && rest.pivotBy.includes(col.accessor)) {
              column = {
                accessor: col.accessor,
                width: treeTableIndent + 'px',
                show: false,
                Header: ''
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
          { className: 'rt-tr ' + rest.className, style: rest.style },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvdHJlZVRhYmxlL2luZGV4LmpzIl0sIm5hbWVzIjpbIndyYXBwZXIiLCJwcm9wcyIsImdldFdyYXBwZWRJbnN0YW5jZSIsImJpbmQiLCJUckNvbXBvbmVudCIsImdldFRyUHJvcHMiLCJjb2x1bW5zIiwidHJlZVRhYmxlSW5kZW50IiwicmVzdCIsImV4dHJhIiwibWFwIiwiY29sdW1uIiwiY29sIiwicGl2b3RCeSIsImluY2x1ZGVzIiwiYWNjZXNzb3IiLCJ3aWR0aCIsInNob3ciLCJIZWFkZXIiLCJ3cmFwcGVkSW5zdGFuY2UiLCJyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zb2xlIiwid2FybiIsInJpIiwiZ3JvdXBlZEJ5UGl2b3QiLCJjZWxsIiwiY2hpbGRyZW4iLCJsZXZlbCIsInN0eWxlIiwiZmxleCIsIm1heFdpZHRoIiwicGFkZGluZ0xlZnQiLCJib3JkZXJCb3R0b20iLCJjbGFzc05hbWUiLCJzdGF0ZSIsImNpIiwiaW5zdGFuY2UiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7K2VBRkE7O2tCQUllLHFCQUFhO0FBQUE7O0FBQzFCLE1BQU1BO0FBQUE7O0FBQ0oseUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SEFDWEEsS0FEVzs7QUFBQTs7QUFFakIsWUFBS0Msa0JBQUwsQ0FBd0JDLElBQXhCO0FBQ0EsWUFBS0MsV0FBTCxDQUFpQkQsSUFBakI7QUFDQSxZQUFLRSxVQUFMLENBQWdCRixJQUFoQjtBQUppQjtBQUtsQjs7QUFFRDs7O0FBUkk7QUFBQTtBQUFBLCtCQXdDSztBQUFBOztBQUFBLHFCQUN1QyxLQUFLRixLQUQ1QztBQUFBLFlBQ0NLLE9BREQsVUFDQ0EsT0FERDtBQUFBLFlBQ1VDLGVBRFYsVUFDVUEsZUFEVjtBQUFBLFlBQzhCQyxJQUQ5Qjs7QUFBQSxZQUVDSixXQUZELEdBRTZCLElBRjdCLENBRUNBLFdBRkQ7QUFBQSxZQUVjQyxVQUZkLEdBRTZCLElBRjdCLENBRWNBLFVBRmQ7O0FBR1AsWUFBTUksUUFBUTtBQUNaSCxtQkFBU0EsUUFBUUksR0FBUixDQUFZLGVBQU87QUFDMUIsZ0JBQUlDLFNBQVNDLEdBQWI7QUFDQSxnQkFBSUosS0FBS0ssT0FBTCxJQUFnQkwsS0FBS0ssT0FBTCxDQUFhQyxRQUFiLENBQXNCRixJQUFJRyxRQUExQixDQUFwQixFQUF5RDtBQUN2REosdUJBQVM7QUFDUEksMEJBQVVILElBQUlHLFFBRFA7QUFFUEMsdUJBQVVULGVBQVYsT0FGTztBQUdQVSxzQkFBTSxLQUhDO0FBSVBDLHdCQUFRO0FBSkQsZUFBVDtBQU1EO0FBQ0QsbUJBQU9QLE1BQVA7QUFDRCxXQVhRLENBREc7QUFhWlAsa0NBYlk7QUFjWkM7QUFkWSxTQUFkOztBQWlCQSxlQUFPLDhCQUFDLFNBQUQsZUFBZUcsSUFBZixFQUF5QkMsS0FBekIsSUFBZ0MsS0FBSztBQUFBLG1CQUFNLE9BQUtVLGVBQUwsR0FBdUJDLENBQTdCO0FBQUEsV0FBckMsSUFBUDtBQUNEO0FBN0RHOztBQUFBO0FBQUEsSUFBb0NDLGdCQUFNQyxTQUExQztBQUFBOztBQUFBLFNBU0pwQixrQkFUSSxHQVNpQixZQUFNO0FBQ3pCLFVBQUksQ0FBQyxPQUFLaUIsZUFBVixFQUEyQkksUUFBUUMsSUFBUixDQUFhLG1DQUFiO0FBQzNCLFVBQUksT0FBS0wsZUFBTCxDQUFxQmpCLGtCQUF6QixFQUE2QyxPQUFPLE9BQUtpQixlQUFMLENBQXFCakIsa0JBQXJCLEVBQVAsQ0FBN0MsS0FDSyxPQUFPLE9BQUtpQixlQUFaO0FBQ04sS0FiRzs7QUFBQSxTQWVKZixXQWZJLEdBZVUsaUJBQVM7QUFBQSxVQUNicUIsRUFEYSxHQUNHeEIsS0FESCxDQUNid0IsRUFEYTtBQUFBLFVBQ05qQixJQURNLDRCQUNHUCxLQURIOztBQUVyQixVQUFJd0IsTUFBTUEsR0FBR0MsY0FBYixFQUE2QjtBQUMzQixZQUFNQyxvQkFBWTFCLE1BQU0yQixRQUFOLENBQWVILEdBQUdJLEtBQWxCLENBQVosQ0FBTjs7QUFFQUYsYUFBSzFCLEtBQUwsQ0FBVzZCLEtBQVgsQ0FBaUJDLElBQWpCLEdBQXdCLE9BQXhCO0FBQ0FKLGFBQUsxQixLQUFMLENBQVc2QixLQUFYLENBQWlCZCxLQUFqQixHQUF5QixNQUF6QjtBQUNBVyxhQUFLMUIsS0FBTCxDQUFXNkIsS0FBWCxDQUFpQkUsUUFBakIsR0FBNEIsT0FBNUI7QUFDQUwsYUFBSzFCLEtBQUwsQ0FBVzZCLEtBQVgsQ0FBaUJHLFdBQWpCLEdBQWtDLE9BQUtoQyxLQUFMLENBQVdNLGVBQVgsR0FBNkJrQixHQUFHSSxLQUFsRTtBQUNBO0FBQ0FGLGFBQUsxQixLQUFMLENBQVc2QixLQUFYLENBQWlCSSxZQUFqQixHQUFnQyxpQ0FBaEM7O0FBRUEsZUFDRTtBQUFBO0FBQUEsWUFBSyxzQkFBb0IxQixLQUFLMkIsU0FBOUIsRUFBMkMsT0FBTzNCLEtBQUtzQixLQUF2RDtBQUNHSDtBQURILFNBREY7QUFLRDtBQUNELGFBQU8sOEJBQUMsU0FBRCxDQUFXLFlBQVgsQ0FBd0IsV0FBeEIsRUFBd0NuQixJQUF4QyxDQUFQO0FBQ0QsS0FsQ0c7O0FBQUEsU0FvQ0pILFVBcENJLEdBb0NTLFVBQUMrQixLQUFELEVBQVFYLEVBQVIsRUFBWVksRUFBWixFQUFnQkMsUUFBaEIsRUFBNkI7QUFDeEMsYUFBTyxFQUFFYixNQUFGLEVBQVA7QUFDRCxLQXRDRztBQUFBLFdBQU47QUErREF6QixVQUFRdUMsV0FBUixHQUFzQixhQUF0QjtBQUNBdkMsVUFBUXdDLFlBQVIsR0FBdUI7QUFDckJqQyxxQkFBaUI7QUFESSxHQUF2Qjs7QUFJQSxTQUFPUCxPQUFQO0FBQ0QsQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50ID0+IHtcbiAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJUVHJlZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpXG4gICAgICB0aGlzLmdldFdyYXBwZWRJbnN0YW5jZS5iaW5kKHRoaXMpXG4gICAgICB0aGlzLlRyQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuZ2V0VHJQcm9wcy5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUgdG8gZ2V0IGF0IHRoZSBzb3J0ZWREYXRhIGZvciBzZWxlY3RBbGxcbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSBjb25zb2xlLndhcm4oJ1JUVHJlZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgVHJDb21wb25lbnQgPSBwcm9wcyA9PiB7XG4gICAgICBjb25zdCB7IHJpLCAuLi5yZXN0IH0gPSBwcm9wc1xuICAgICAgaWYgKHJpICYmIHJpLmdyb3VwZWRCeVBpdm90KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSB7IC4uLnByb3BzLmNoaWxkcmVuW3JpLmxldmVsXSB9XG5cbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5mbGV4ID0gJ3Vuc2V0J1xuICAgICAgICBjZWxsLnByb3BzLnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgICAgIGNlbGwucHJvcHMuc3R5bGUubWF4V2lkdGggPSAndW5zZXQnXG4gICAgICAgIGNlbGwucHJvcHMuc3R5bGUucGFkZGluZ0xlZnQgPSBgJHt0aGlzLnByb3BzLnRyZWVUYWJsZUluZGVudCAqIHJpLmxldmVsfXB4YFxuICAgICAgICAvLyBjZWxsLnByb3BzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjREREJztcbiAgICAgICAgY2VsbC5wcm9wcy5zdHlsZS5ib3JkZXJCb3R0b20gPSAnMXB4IHNvbGlkIHJnYmEoMTI4LDEyOCwxMjgsMC4yKSdcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgcnQtdHIgJHtyZXN0LmNsYXNzTmFtZX1gfSBzdHlsZT17cmVzdC5zdHlsZX0+XG4gICAgICAgICAgICB7Y2VsbH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgcmV0dXJuIDxDb21wb25lbnQuZGVmYXVsdFByb3BzLlRyQ29tcG9uZW50IHsuLi5yZXN0fSAvPlxuICAgIH1cblxuICAgIGdldFRyUHJvcHMgPSAoc3RhdGUsIHJpLCBjaSwgaW5zdGFuY2UpID0+IHtcbiAgICAgIHJldHVybiB7IHJpIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7IGNvbHVtbnMsIHRyZWVUYWJsZUluZGVudCwgLi4ucmVzdCB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgeyBUckNvbXBvbmVudCwgZ2V0VHJQcm9wcyB9ID0gdGhpc1xuICAgICAgY29uc3QgZXh0cmEgPSB7XG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMubWFwKGNvbCA9PiB7XG4gICAgICAgICAgbGV0IGNvbHVtbiA9IGNvbFxuICAgICAgICAgIGlmIChyZXN0LnBpdm90QnkgJiYgcmVzdC5waXZvdEJ5LmluY2x1ZGVzKGNvbC5hY2Nlc3NvcikpIHtcbiAgICAgICAgICAgIGNvbHVtbiA9IHtcbiAgICAgICAgICAgICAgYWNjZXNzb3I6IGNvbC5hY2Nlc3NvcixcbiAgICAgICAgICAgICAgd2lkdGg6IGAke3RyZWVUYWJsZUluZGVudH1weGAsXG4gICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgICBIZWFkZXI6ICcnLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY29sdW1uXG4gICAgICAgIH0pLFxuICAgICAgICBUckNvbXBvbmVudCxcbiAgICAgICAgZ2V0VHJQcm9wcyxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxuICAgIH1cbiAgfVxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JUVHJlZVRhYmxlJ1xuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgICB0cmVlVGFibGVJbmRlbnQ6IDEwLFxuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXJcbn1cbiJdfQ==