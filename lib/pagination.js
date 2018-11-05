'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultButton = function defaultButton(props) {
  return _react2.default.createElement(
    'button',
    _extends({ type: 'button' }, props, { className: '-btn' }),
    props.children
  );
};

var ReactTablePagination = function (_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    _classCallCheck(this, ReactTablePagination);

    var _this = _possibleConstructorReturn(this, (ReactTablePagination.__proto__ || Object.getPrototypeOf(ReactTablePagination)).call(this));

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.page !== nextProps.page) {
        this.setState({ page: nextProps.page });
      }
    }
  }, {
    key: 'getSafePage',
    value: function getSafePage(page) {
      if (Number.isNaN(page)) {
        page = this.props.page;
      }
      return Math.min(Math.max(page, 0), this.props.pages - 1);
    }
  }, {
    key: 'changePage',
    value: function changePage(page) {
      page = this.getSafePage(page);
      this.setState({ page: page });
      if (this.props.page !== page) {
        this.props.onPageChange(page);
      }
    }
  }, {
    key: 'applyPage',
    value: function applyPage(e) {
      if (e) {
        e.preventDefault();
      }
      var page = this.state.page;
      this.changePage(page === '' ? this.props.page : page);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          pages = _props.pages,
          page = _props.page,
          showPageSizeOptions = _props.showPageSizeOptions,
          pageSizeOptions = _props.pageSizeOptions,
          pageSize = _props.pageSize,
          showPageJump = _props.showPageJump,
          canPrevious = _props.canPrevious,
          canNext = _props.canNext,
          onPageSizeChange = _props.onPageSizeChange,
          className = _props.className,
          _props$PreviousCompon = _props.PreviousComponent,
          PreviousComponent = _props$PreviousCompon === undefined ? defaultButton : _props$PreviousCompon,
          _props$NextComponent = _props.NextComponent,
          NextComponent = _props$NextComponent === undefined ? defaultButton : _props$NextComponent;


      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(className, '-pagination'), style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: '-previous' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: function onClick() {
                if (!canPrevious) return;
                _this2.changePage(page - 1);
              },
              disabled: !canPrevious
            },
            this.props.previousText
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-center' },
          _react2.default.createElement(
            'span',
            { className: '-pageInfo' },
            this.props.pageText,
            ' ',
            showPageJump ? _react2.default.createElement(
              'div',
              { className: '-pageJump' },
              _react2.default.createElement('input', {
                'aria-label': this.props.pageJumpText,
                type: this.state.page === '' ? 'text' : 'number',
                onChange: function onChange(e) {
                  var val = e.target.value;
                  var page = val - 1;
                  if (val === '') {
                    return _this2.setState({ page: val });
                  }
                  _this2.setState({ page: _this2.getSafePage(page) });
                },
                value: this.state.page === '' ? '' : this.state.page + 1,
                onBlur: this.applyPage,
                onKeyPress: function onKeyPress(e) {
                  if (e.which === 13 || e.keyCode === 13) {
                    _this2.applyPage();
                  }
                }
              })
            ) : _react2.default.createElement(
              'span',
              { className: '-currentPage' },
              page + 1
            ),
            ' ',
            this.props.ofText,
            ' ',
            _react2.default.createElement(
              'span',
              { className: '-totalPages' },
              pages || 1
            )
          ),
          showPageSizeOptions && _react2.default.createElement(
            'span',
            { className: 'select-wrap -pageSizeOptions' },
            _react2.default.createElement(
              'select',
              {
                'aria-label': this.props.rowsSelectorText,
                onChange: function onChange(e) {
                  return onPageSizeChange(Number(e.target.value));
                },
                value: pageSize },
              pageSizeOptions.map(function (option, i) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  _react2.default.createElement(
                    'option',
                    { key: i, value: option },
                    option + ' ' + _this2.props.rowsText
                  )
                );
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-next' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: function onClick() {
                if (!canNext) return;
                _this2.changePage(page + 1);
              },
              disabled: !canNext
            },
            this.props.nextText
          )
        )
      );
    }
  }]);

  return ReactTablePagination;
}(_react.Component);

exports.default = ReactTablePagination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZSIsInNob3dQYWdlSnVtcCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjbGFzc05hbWUiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwicGFnZUp1bXBUZXh0IiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJ3aGljaCIsImtleUNvZGUiLCJvZlRleHQiLCJyb3dzU2VsZWN0b3JUZXh0IiwibWFwIiwib3B0aW9uIiwiaSIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsU0FDcEI7QUFBQTtBQUFBLGVBQVEsTUFBSyxRQUFiLElBQTBCQyxLQUExQixJQUFpQyxXQUFVLE1BQTNDO0FBQ0dBLFVBQU1DO0FBRFQsR0FEb0I7QUFBQSxDQUF0Qjs7SUFNcUJDLG9COzs7QUFDbkIsZ0NBQWFGLEtBQWIsRUFBb0I7QUFBQTs7QUFBQTs7QUFHbEIsVUFBS0csV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCQyxJQUFqQixPQUFuQjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsTUFBS0EsVUFBTCxDQUFnQkQsSUFBaEIsT0FBbEI7QUFDQSxVQUFLRSxTQUFMLEdBQWlCLE1BQUtBLFNBQUwsQ0FBZUYsSUFBZixPQUFqQjs7QUFFQSxVQUFLRyxLQUFMLEdBQWE7QUFDWEMsWUFBTVIsTUFBTVE7QUFERCxLQUFiO0FBUGtCO0FBVW5COzs7OzhDQUUwQkMsUyxFQUFXO0FBQ3BDLFVBQUksS0FBS1QsS0FBTCxDQUFXUSxJQUFYLEtBQW9CQyxVQUFVRCxJQUFsQyxFQUF3QztBQUN0QyxhQUFLRSxRQUFMLENBQWMsRUFBRUYsTUFBTUMsVUFBVUQsSUFBbEIsRUFBZDtBQUNEO0FBQ0Y7OztnQ0FFWUEsSSxFQUFNO0FBQ2pCLFVBQUlHLE9BQU9DLEtBQVAsQ0FBYUosSUFBYixDQUFKLEVBQXdCO0FBQ3RCQSxlQUFPLEtBQUtSLEtBQUwsQ0FBV1EsSUFBbEI7QUFDRDtBQUNELGFBQU9LLEtBQUtDLEdBQUwsQ0FBU0QsS0FBS0UsR0FBTCxDQUFTUCxJQUFULEVBQWUsQ0FBZixDQUFULEVBQTRCLEtBQUtSLEtBQUwsQ0FBV2dCLEtBQVgsR0FBbUIsQ0FBL0MsQ0FBUDtBQUNEOzs7K0JBRVdSLEksRUFBTTtBQUNoQkEsYUFBTyxLQUFLTCxXQUFMLENBQWlCSyxJQUFqQixDQUFQO0FBQ0EsV0FBS0UsUUFBTCxDQUFjLEVBQUVGLFVBQUYsRUFBZDtBQUNBLFVBQUksS0FBS1IsS0FBTCxDQUFXUSxJQUFYLEtBQW9CQSxJQUF4QixFQUE4QjtBQUM1QixhQUFLUixLQUFMLENBQVdpQixZQUFYLENBQXdCVCxJQUF4QjtBQUNEO0FBQ0Y7Ozs4QkFFVVUsQyxFQUFHO0FBQ1osVUFBSUEsQ0FBSixFQUFPO0FBQ0xBLFVBQUVDLGNBQUY7QUFDRDtBQUNELFVBQU1YLE9BQU8sS0FBS0QsS0FBTCxDQUFXQyxJQUF4QjtBQUNBLFdBQUtILFVBQUwsQ0FBZ0JHLFNBQVMsRUFBVCxHQUFjLEtBQUtSLEtBQUwsQ0FBV1EsSUFBekIsR0FBZ0NBLElBQWhEO0FBQ0Q7Ozs2QkFFUztBQUFBOztBQUFBLG1CQWdCSixLQUFLUixLQWhCRDtBQUFBLFVBR05nQixLQUhNLFVBR05BLEtBSE07QUFBQSxVQUtOUixJQUxNLFVBS05BLElBTE07QUFBQSxVQU1OWSxtQkFOTSxVQU1OQSxtQkFOTTtBQUFBLFVBT05DLGVBUE0sVUFPTkEsZUFQTTtBQUFBLFVBUU5DLFFBUk0sVUFRTkEsUUFSTTtBQUFBLFVBU05DLFlBVE0sVUFTTkEsWUFUTTtBQUFBLFVBVU5DLFdBVk0sVUFVTkEsV0FWTTtBQUFBLFVBV05DLE9BWE0sVUFXTkEsT0FYTTtBQUFBLFVBWU5DLGdCQVpNLFVBWU5BLGdCQVpNO0FBQUEsVUFhTkMsU0FiTSxVQWFOQSxTQWJNO0FBQUEseUNBY05DLGlCQWRNO0FBQUEsVUFjTkEsaUJBZE0seUNBY2M3QixhQWRkO0FBQUEsd0NBZU44QixhQWZNO0FBQUEsVUFlTkEsYUFmTSx3Q0FlVTlCLGFBZlY7OztBQWtCUixhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVcsMEJBQVc0QixTQUFYLEVBQXNCLGFBQXRCLENBQWhCLEVBQXNELE9BQU8sS0FBSzNCLEtBQUwsQ0FBVzhCLEtBQXhFO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQ0U7QUFBQyw2QkFBRDtBQUFBO0FBQ0UsdUJBQVMsbUJBQU07QUFDYixvQkFBSSxDQUFDTixXQUFMLEVBQWtCO0FBQ2xCLHVCQUFLbkIsVUFBTCxDQUFnQkcsT0FBTyxDQUF2QjtBQUNELGVBSkg7QUFLRSx3QkFBVSxDQUFDZ0I7QUFMYjtBQU9HLGlCQUFLeEIsS0FBTCxDQUFXK0I7QUFQZDtBQURGLFNBREY7QUFZRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFNBQWY7QUFDRTtBQUFBO0FBQUEsY0FBTSxXQUFVLFdBQWhCO0FBQ0csaUJBQUsvQixLQUFMLENBQVdnQyxRQURkO0FBQ3dCLGVBRHhCO0FBRUdULDJCQUNDO0FBQUE7QUFBQSxnQkFBSyxXQUFVLFdBQWY7QUFDRTtBQUNFLDhCQUFZLEtBQUt2QixLQUFMLENBQVdpQyxZQUR6QjtBQUVFLHNCQUFNLEtBQUsxQixLQUFMLENBQVdDLElBQVgsS0FBb0IsRUFBcEIsR0FBeUIsTUFBekIsR0FBa0MsUUFGMUM7QUFHRSwwQkFBVSxxQkFBSztBQUNiLHNCQUFNMEIsTUFBTWhCLEVBQUVpQixNQUFGLENBQVNDLEtBQXJCO0FBQ0Esc0JBQU01QixPQUFPMEIsTUFBTSxDQUFuQjtBQUNBLHNCQUFJQSxRQUFRLEVBQVosRUFBZ0I7QUFDZCwyQkFBTyxPQUFLeEIsUUFBTCxDQUFjLEVBQUVGLE1BQU0wQixHQUFSLEVBQWQsQ0FBUDtBQUNEO0FBQ0QseUJBQUt4QixRQUFMLENBQWMsRUFBRUYsTUFBTSxPQUFLTCxXQUFMLENBQWlCSyxJQUFqQixDQUFSLEVBQWQ7QUFDRCxpQkFWSDtBQVdFLHVCQUFPLEtBQUtELEtBQUwsQ0FBV0MsSUFBWCxLQUFvQixFQUFwQixHQUF5QixFQUF6QixHQUE4QixLQUFLRCxLQUFMLENBQVdDLElBQVgsR0FBa0IsQ0FYekQ7QUFZRSx3QkFBUSxLQUFLRixTQVpmO0FBYUUsNEJBQVksdUJBQUs7QUFDZixzQkFBSVksRUFBRW1CLEtBQUYsS0FBWSxFQUFaLElBQWtCbkIsRUFBRW9CLE9BQUYsS0FBYyxFQUFwQyxFQUF3QztBQUN0QywyQkFBS2hDLFNBQUw7QUFDRDtBQUNGO0FBakJIO0FBREYsYUFERCxHQXVCQztBQUFBO0FBQUEsZ0JBQU0sV0FBVSxjQUFoQjtBQUFnQ0UscUJBQU87QUFBdkMsYUF6Qko7QUEwQkssZUExQkw7QUEyQkcsaUJBQUtSLEtBQUwsQ0FBV3VDLE1BM0JkO0FBQUE7QUEyQnNCO0FBQUE7QUFBQSxnQkFBTSxXQUFVLGFBQWhCO0FBQStCdkIsdUJBQVM7QUFBeEM7QUEzQnRCLFdBREY7QUE4QkdJLGlDQUNDO0FBQUE7QUFBQSxjQUFNLFdBQVUsOEJBQWhCO0FBQ0U7QUFBQTtBQUFBO0FBQ0UsOEJBQVksS0FBS3BCLEtBQUwsQ0FBV3dDLGdCQUR6QjtBQUVFLDBCQUFVO0FBQUEseUJBQUtkLGlCQUFpQmYsT0FBT08sRUFBRWlCLE1BQUYsQ0FBU0MsS0FBaEIsQ0FBakIsQ0FBTDtBQUFBLGlCQUZaO0FBR0UsdUJBQU9kLFFBSFQ7QUFJR0QsOEJBQWdCb0IsR0FBaEIsQ0FBb0IsVUFBQ0MsTUFBRCxFQUFTQyxDQUFUO0FBQUE7QUFDbkI7QUFDQTtBQUFBO0FBQUEsc0JBQVEsS0FBS0EsQ0FBYixFQUFnQixPQUFPRCxNQUF2QjtBQUNNQSwwQkFETixTQUNnQixPQUFLMUMsS0FBTCxDQUFXNEM7QUFEM0I7QUFGbUI7QUFBQSxlQUFwQjtBQUpIO0FBREY7QUEvQkosU0FaRjtBQTBERTtBQUFBO0FBQUEsWUFBSyxXQUFVLE9BQWY7QUFDRTtBQUFDLHlCQUFEO0FBQUE7QUFDRSx1QkFBUyxtQkFBTTtBQUNiLG9CQUFJLENBQUNuQixPQUFMLEVBQWM7QUFDZCx1QkFBS3BCLFVBQUwsQ0FBZ0JHLE9BQU8sQ0FBdkI7QUFDRCxlQUpIO0FBS0Usd0JBQVUsQ0FBQ2lCO0FBTGI7QUFPRyxpQkFBS3pCLEtBQUwsQ0FBVzZDO0FBUGQ7QUFERjtBQTFERixPQURGO0FBd0VEOzs7O0VBcEkrQ0MsZ0I7O2tCQUE3QjVDLG9CIiwiZmlsZSI6InBhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXHJcblxyXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxyXG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHsuLi5wcm9wc30gY2xhc3NOYW1lPVwiLWJ0blwiPlxyXG4gICAge3Byb3BzLmNoaWxkcmVufVxyXG4gIDwvYnV0dG9uPlxyXG4pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICBzdXBlcigpXHJcblxyXG4gICAgdGhpcy5nZXRTYWZlUGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcylcclxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcclxuICAgIGlmICh0aGlzLnByb3BzLnBhZ2UgIT09IG5leHRQcm9wcy5wYWdlKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiBuZXh0UHJvcHMucGFnZSB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcclxuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFnZSkpIHtcclxuICAgICAgcGFnZSA9IHRoaXMucHJvcHMucGFnZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcclxuICB9XHJcblxyXG4gIGNoYW5nZVBhZ2UgKHBhZ2UpIHtcclxuICAgIHBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZSB9KVxyXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gcGFnZSkge1xyXG4gICAgICB0aGlzLnByb3BzLm9uUGFnZUNoYW5nZShwYWdlKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXBwbHlQYWdlIChlKSB7XHJcbiAgICBpZiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnN0YXRlLnBhZ2VcclxuICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlID09PSAnJyA/IHRoaXMucHJvcHMucGFnZSA6IHBhZ2UpXHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICAvLyBDb21wdXRlZFxyXG4gICAgICBwYWdlcyxcclxuICAgICAgLy8gUHJvcHNcclxuICAgICAgcGFnZSxcclxuICAgICAgc2hvd1BhZ2VTaXplT3B0aW9ucyxcclxuICAgICAgcGFnZVNpemVPcHRpb25zLFxyXG4gICAgICBwYWdlU2l6ZSxcclxuICAgICAgc2hvd1BhZ2VKdW1wLFxyXG4gICAgICBjYW5QcmV2aW91cyxcclxuICAgICAgY2FuTmV4dCxcclxuICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBQcmV2aW91c0NvbXBvbmVudCA9IGRlZmF1bHRCdXR0b24sXHJcbiAgICAgIE5leHRDb21wb25lbnQgPSBkZWZhdWx0QnV0dG9uLFxyXG4gICAgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc05hbWUsICctcGFnaW5hdGlvbicpfSBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cclxuICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5wcmV2aW91c1RleHR9XHJcbiAgICAgICAgICA8L1ByZXZpb3VzQ29tcG9uZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiLXBhZ2VJbmZvXCI+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnBhZ2VUZXh0fXsnICd9XHJcbiAgICAgICAgICAgIHtzaG93UGFnZUp1bXAgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcGFnZUp1bXBcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0aGlzLnByb3BzLnBhZ2VKdW1wVGV4dH1cclxuICAgICAgICAgICAgICAgICAgdHlwZT17dGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICd0ZXh0JyA6ICdudW1iZXInfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWdlID0gdmFsIC0gMVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogdGhpcy5nZXRTYWZlUGFnZShwYWdlKSB9KVxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICcnIDogdGhpcy5zdGF0ZS5wYWdlICsgMX1cclxuICAgICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLmFwcGx5UGFnZX1cclxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT09IDEzIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIi1jdXJyZW50UGFnZVwiPntwYWdlICsgMX08L3NwYW4+XHJcbiAgICAgICAgICAgICl9eycgJ31cclxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSA8c3BhbiBjbGFzc05hbWU9XCItdG90YWxQYWdlc1wiPntwYWdlcyB8fCAxfTwvc3Bhbj5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmIChcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2VsZWN0LXdyYXAgLXBhZ2VTaXplT3B0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3RoaXMucHJvcHMucm93c1NlbGVjdG9yVGV4dH1cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uUGFnZVNpemVDaGFuZ2UoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17cGFnZVNpemV9PlxyXG4gICAgICAgICAgICAgICAge3BhZ2VTaXplT3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3Qvbm8tYXJyYXktaW5kZXgta2V5XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpfSB2YWx1ZT17b3B0aW9ufT5cclxuICAgICAgICAgICAgICAgICAgICB7YCR7b3B0aW9ufSAke3RoaXMucHJvcHMucm93c1RleHR9YH1cclxuICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1uZXh0XCI+XHJcbiAgICAgICAgICA8TmV4dENvbXBvbmVudFxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjYW5OZXh0KSByZXR1cm5cclxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSArIDEpXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMubmV4dFRleHR9XHJcbiAgICAgICAgICA8L05leHRDb21wb25lbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iXX0=