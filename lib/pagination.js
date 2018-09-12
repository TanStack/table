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

//
// import _ from './utils'

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
      this.setState({ page: nextProps.page });
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
              { onChange: function onChange(e) {
                  return onPageSizeChange(Number(e.target.value));
                }, value: pageSize },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZSIsInNob3dQYWdlSnVtcCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjbGFzc05hbWUiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJ3aGljaCIsImtleUNvZGUiLCJvZlRleHQiLCJtYXAiLCJvcHRpb24iLCJpIiwicm93c1RleHQiLCJuZXh0VGV4dCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7O0FBRUEsSUFBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1BQUssUUFBYixJQUEwQkMsS0FBMUIsSUFBaUMsV0FBVSxNQUEzQztBQUNHQSxVQUFNQztBQURULEdBRG9CO0FBQUEsQ0FBdEI7O0lBTXFCQyxvQjs7O0FBQ25CLGdDQUFhRixLQUFiLEVBQW9CO0FBQUE7O0FBQUE7O0FBR2xCLFVBQUtHLFdBQUwsR0FBbUIsTUFBS0EsV0FBTCxDQUFpQkMsSUFBakIsT0FBbkI7QUFDQSxVQUFLQyxVQUFMLEdBQWtCLE1BQUtBLFVBQUwsQ0FB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QUwsQ0FBVzBDO0FBRDNCO0FBRm1CO0FBQUEsZUFBcEI7QUFESDtBQURGO0FBOUJKLFNBWkY7QUFzREU7QUFBQTtBQUFBLFlBQUssV0FBVSxPQUFmO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsdUJBQVMsbUJBQU07QUFDYixvQkFBSSxDQUFDakIsT0FBTCxFQUFjO0FBQ2QsdUJBQUtwQixVQUFMLENBQWdCRyxPQUFPLENBQXZCO0FBQ0QsZUFKSDtBQUtFLHdCQUFVLENBQUNpQjtBQUxiO0FBT0csaUJBQUt6QixLQUFMLENBQVcyQztBQVBkO0FBREY7QUF0REYsT0FERjtBQW9FRDs7OztFQTlIK0NDLGdCOztrQkFBN0IxQyxvQiIsImZpbGUiOiJwYWdpbmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbi8vXG4vLyBpbXBvcnQgXyBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB7Li4ucHJvcHN9IGNsYXNzTmFtZT1cIi1idG5cIj5cbiAgICB7cHJvcHMuY2hpbGRyZW59XG4gIDwvYnV0dG9uPlxuKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuZ2V0U2FmZVBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlLmJpbmQodGhpcylcbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IG5leHRQcm9wcy5wYWdlIH0pXG4gIH1cblxuICBnZXRTYWZlUGFnZSAocGFnZSkge1xuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFnZSkpIHtcbiAgICAgIHBhZ2UgPSB0aGlzLnByb3BzLnBhZ2VcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcbiAgfVxuXG4gIGNoYW5nZVBhZ2UgKHBhZ2UpIHtcbiAgICBwYWdlID0gdGhpcy5nZXRTYWZlUGFnZShwYWdlKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlIH0pXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gcGFnZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblBhZ2VDaGFuZ2UocGFnZSlcbiAgICB9XG4gIH1cblxuICBhcHBseVBhZ2UgKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnN0YXRlLnBhZ2VcbiAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSA9PT0gJycgPyB0aGlzLnByb3BzLnBhZ2UgOiBwYWdlKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICAvLyBDb21wdXRlZFxuICAgICAgcGFnZXMsXG4gICAgICAvLyBQcm9wc1xuICAgICAgcGFnZSxcbiAgICAgIHNob3dQYWdlU2l6ZU9wdGlvbnMsXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICBwYWdlU2l6ZSxcbiAgICAgIHNob3dQYWdlSnVtcCxcbiAgICAgIGNhblByZXZpb3VzLFxuICAgICAgY2FuTmV4dCxcbiAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBQcmV2aW91c0NvbXBvbmVudCA9IGRlZmF1bHRCdXR0b24sXG4gICAgICBOZXh0Q29tcG9uZW50ID0gZGVmYXVsdEJ1dHRvbixcbiAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cbiAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlIC0gMSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cbiAgICAgICAgICA8L1ByZXZpb3VzQ29tcG9uZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItY2VudGVyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiLXBhZ2VJbmZvXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5wYWdlVGV4dH17JyAnfVxuICAgICAgICAgICAge3Nob3dQYWdlSnVtcCA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcGFnZUp1bXBcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9e3RoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAndGV4dCcgOiAnbnVtYmVyJ31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZSA9IHZhbCAtIDFcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpIH0pXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAnJyA6IHRoaXMuc3RhdGUucGFnZSArIDF9XG4gICAgICAgICAgICAgICAgICBvbkJsdXI9e3RoaXMuYXBwbHlQYWdlfVxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09PSAxMyB8fCBlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhZ2UoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiLWN1cnJlbnRQYWdlXCI+e3BhZ2UgKyAxfTwvc3Bhbj5cbiAgICAgICAgICAgICl9eycgJ31cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm9mVGV4dH0gPHNwYW4gY2xhc3NOYW1lPVwiLXRvdGFsUGFnZXNcIj57cGFnZXMgfHwgMX08L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmIChcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlbGVjdC13cmFwIC1wYWdlU2l6ZU9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgPHNlbGVjdCBvbkNoYW5nZT17ZSA9PiBvblBhZ2VTaXplQ2hhbmdlKE51bWJlcihlLnRhcmdldC52YWx1ZSkpfSB2YWx1ZT17cGFnZVNpemV9PlxuICAgICAgICAgICAgICAgIHtwYWdlU2l6ZU9wdGlvbnMubWFwKChvcHRpb24sIGkpID0+IChcbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpfSB2YWx1ZT17b3B0aW9ufT5cbiAgICAgICAgICAgICAgICAgICAge2Ake29wdGlvbn0gJHt0aGlzLnByb3BzLnJvd3NUZXh0fWB9XG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLW5leHRcIj5cbiAgICAgICAgICA8TmV4dENvbXBvbmVudFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWNhbk5leHQpIHJldHVyblxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSArIDEpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5OZXh0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm5leHRUZXh0fVxuICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==