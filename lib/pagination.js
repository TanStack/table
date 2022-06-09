'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable react/no-did-update-set-state */


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

    var _this = _possibleConstructorReturn(this, (ReactTablePagination.__proto__ || Object.getPrototypeOf(ReactTablePagination)).call(this, props));

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.page !== this.props.page || prevState.page !== this.state.page) {
        // this is probably safe because we only update when old/new props/state.page are different
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          page: this.props.page
        });
      }
      /* when the last page from new props is smaller
       than the current page in the page box,
       the current page needs to be the last page. */
      if (this.props.pages !== prevProps.pages && this.props.pages <= this.state.page) {
        this.setState({
          page: this.props.pages - 1
        });
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
    key: 'getPageJumpProperties',
    value: function getPageJumpProperties() {
      var _this2 = this;

      return {
        onKeyPress: function onKeyPress(e) {
          if (e.which === 13 || e.keyCode === 13) {
            _this2.applyPage();
          }
        },
        onBlur: this.applyPage,
        value: this.state.page === '' ? '' : this.state.page + 1,
        onChange: function onChange(e) {
          var val = e.target.value;
          var page = val - 1;
          if (val === '') {
            return _this2.setState({ page: val });
          }
          _this2.setState({ page: _this2.getSafePage(page) });
        },
        inputType: this.state.page === '' ? 'text' : 'number',
        pageJumpText: this.props.pageJumpText
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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
          PreviousComponent = _props.PreviousComponent,
          NextComponent = _props.NextComponent,
          renderPageJump = _props.renderPageJump,
          renderCurrentPage = _props.renderCurrentPage,
          renderTotalPagesCount = _props.renderTotalPagesCount,
          renderPageSizeOptions = _props.renderPageSizeOptions;


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
                _this3.changePage(page - 1);
              },
              disabled: !canPrevious || this.state.page < 1
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
            showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page),
            ' ',
            this.props.ofText,
            ' ',
            renderTotalPagesCount(pages)
          ),
          showPageSizeOptions && renderPageSizeOptions({
            pageSize: pageSize,
            rowsSelectorText: this.props.rowsSelectorText,
            pageSizeOptions: pageSizeOptions,
            onPageSizeChange: onPageSizeChange,
            rowsText: this.props.rowsText
          })
        ),
        _react2.default.createElement(
          'div',
          { className: '-next' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: function onClick() {
                if (!canNext) return;
                _this3.changePage(page + 1);
              },
              disabled: !canNext || this.state.page >= this.props.pages - 1
            },
            this.props.nextText
          )
        )
      );
    }
  }]);

  return ReactTablePagination;
}(_react.Component);

ReactTablePagination.defaultProps = {
  PreviousComponent: defaultButton,
  NextComponent: defaultButton,
  renderPageJump: function renderPageJump(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value,
        onBlur = _ref.onBlur,
        onKeyPress = _ref.onKeyPress,
        inputType = _ref.inputType,
        pageJumpText = _ref.pageJumpText;
    return _react2.default.createElement(
      'div',
      { className: '-pageJump' },
      _react2.default.createElement('input', {
        'aria-label': pageJumpText,
        type: inputType,
        onChange: onChange,
        value: value,
        onBlur: onBlur,
        onKeyPress: onKeyPress
      })
    );
  },
  renderCurrentPage: function renderCurrentPage(page) {
    return _react2.default.createElement(
      'span',
      { className: '-currentPage' },
      page + 1
    );
  },
  renderTotalPagesCount: function renderTotalPagesCount(pages) {
    return _react2.default.createElement(
      'span',
      { className: '-totalPages' },
      pages || 1
    );
  },
  renderPageSizeOptions: function renderPageSizeOptions(_ref2) {
    var pageSize = _ref2.pageSize,
        pageSizeOptions = _ref2.pageSizeOptions,
        rowsSelectorText = _ref2.rowsSelectorText,
        onPageSizeChange = _ref2.onPageSizeChange,
        rowsText = _ref2.rowsText;
    return _react2.default.createElement(
      'span',
      { className: 'select-wrap -pageSizeOptions' },
      _react2.default.createElement(
        'select',
        {
          'aria-label': rowsSelectorText,
          onChange: function onChange(e) {
            return onPageSizeChange(Number(e.target.value));
          },
          value: pageSize
        },
        pageSizeOptions.map(function (option, i) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            _react2.default.createElement(
              'option',
              { key: i, value: option },
              option + ' ' + rowsText
            )
          );
        })
      )
    );
  }
};
exports.default = ReactTablePagination;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwic2V0U3RhdGUiLCJwYWdlcyIsIk51bWJlciIsImlzTmFOIiwiTWF0aCIsIm1pbiIsIm1heCIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uS2V5UHJlc3MiLCJ3aGljaCIsImtleUNvZGUiLCJvbkJsdXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidmFsIiwidGFyZ2V0IiwiaW5wdXRUeXBlIiwicGFnZUp1bXBUZXh0Iiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwib25QYWdlU2l6ZUNoYW5nZSIsImNsYXNzTmFtZSIsIlByZXZpb3VzQ29tcG9uZW50IiwiTmV4dENvbXBvbmVudCIsInJlbmRlclBhZ2VKdW1wIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJyZW5kZXJUb3RhbFBhZ2VzQ291bnQiLCJyZW5kZXJQYWdlU2l6ZU9wdGlvbnMiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwiZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzIiwib2ZUZXh0Iiwicm93c1NlbGVjdG9yVGV4dCIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJtYXAiLCJvcHRpb24iLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrUUFBQTs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1B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QWhCLENBQW9CLFVBQUNDLE1BQUQsRUFBU0MsQ0FBVDtBQUFBO0FBQ25CO0FBQ0E7QUFBQTtBQUFBLGdCQUFRLEtBQUtBLENBQWIsRUFBZ0IsT0FBT0QsTUFBdkI7QUFDTUEsb0JBRE4sU0FDZ0JMO0FBRGhCO0FBRm1CO0FBQUEsU0FBcEI7QUFMSDtBQURGLEtBUHFCO0FBQUE7QUFuQkgsQztrQkFESGpELG9CIiwiZmlsZSI6InBhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kaWQtdXBkYXRlLXNldC1zdGF0ZSAqL1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcblxuY29uc3QgZGVmYXVsdEJ1dHRvbiA9IHByb3BzID0+IChcbiAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgey4uLnByb3BzfSBjbGFzc05hbWU9XCItYnRuXCI+XG4gICAge3Byb3BzLmNoaWxkcmVufVxuICA8L2J1dHRvbj5cbilcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhY3RUYWJsZVBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIFByZXZpb3VzQ29tcG9uZW50OiBkZWZhdWx0QnV0dG9uLFxuICAgIE5leHRDb21wb25lbnQ6IGRlZmF1bHRCdXR0b24sXG4gICAgcmVuZGVyUGFnZUp1bXA6ICh7XG4gICAgICBvbkNoYW5nZSwgdmFsdWUsIG9uQmx1ciwgb25LZXlQcmVzcywgaW5wdXRUeXBlLCBwYWdlSnVtcFRleHQsXG4gICAgfSkgPT4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCItcGFnZUp1bXBcIj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgYXJpYS1sYWJlbD17cGFnZUp1bXBUZXh0fVxuICAgICAgICAgIHR5cGU9e2lucHV0VHlwZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgIG9uQmx1cj17b25CbHVyfVxuICAgICAgICAgIG9uS2V5UHJlc3M9e29uS2V5UHJlc3N9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApLFxuICAgIHJlbmRlckN1cnJlbnRQYWdlOiBwYWdlID0+IDxzcGFuIGNsYXNzTmFtZT1cIi1jdXJyZW50UGFnZVwiPntwYWdlICsgMX08L3NwYW4+LFxuICAgIHJlbmRlclRvdGFsUGFnZXNDb3VudDogcGFnZXMgPT4gPHNwYW4gY2xhc3NOYW1lPVwiLXRvdGFsUGFnZXNcIj57cGFnZXMgfHwgMX08L3NwYW4+LFxuICAgIHJlbmRlclBhZ2VTaXplT3B0aW9uczogKHtcbiAgICAgIHBhZ2VTaXplLFxuICAgICAgcGFnZVNpemVPcHRpb25zLFxuICAgICAgcm93c1NlbGVjdG9yVGV4dCxcbiAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXG4gICAgICByb3dzVGV4dCxcbiAgICB9KSA9PiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJzZWxlY3Qtd3JhcCAtcGFnZVNpemVPcHRpb25zXCI+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICBhcmlhLWxhYmVsPXtyb3dzU2VsZWN0b3JUZXh0fVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uUGFnZVNpemVDaGFuZ2UoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgdmFsdWU9e3BhZ2VTaXplfVxuICAgICAgICA+XG4gICAgICAgICAge3BhZ2VTaXplT3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4gKFxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWFycmF5LWluZGV4LWtleVxuICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtvcHRpb259PlxuICAgICAgICAgICAgICB7YCR7b3B0aW9ufSAke3Jvd3NUZXh0fWB9XG4gICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L3NwYW4+XG4gICAgKSxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5nZXRTYWZlUGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuY2hhbmdlUGFnZSA9IHRoaXMuY2hhbmdlUGFnZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5hcHBseVBhZ2UgPSB0aGlzLmFwcGx5UGFnZS5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcGFnZTogcHJvcHMucGFnZSxcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKHByZXZQcm9wcy5wYWdlICE9PSB0aGlzLnByb3BzLnBhZ2UgfHwgcHJldlN0YXRlLnBhZ2UgIT09IHRoaXMuc3RhdGUucGFnZSkge1xuICAgICAgLy8gdGhpcyBpcyBwcm9iYWJseSBzYWZlIGJlY2F1c2Ugd2Ugb25seSB1cGRhdGUgd2hlbiBvbGQvbmV3IHByb3BzL3N0YXRlLnBhZ2UgYXJlIGRpZmZlcmVudFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRpZC11cGRhdGUtc2V0LXN0YXRlXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcGFnZTogdGhpcy5wcm9wcy5wYWdlLFxuICAgICAgfSlcbiAgICB9XG4gICAgLyogd2hlbiB0aGUgbGFzdCBwYWdlIGZyb20gbmV3IHByb3BzIGlzIHNtYWxsZXJcbiAgICAgdGhhbiB0aGUgY3VycmVudCBwYWdlIGluIHRoZSBwYWdlIGJveCxcbiAgICAgdGhlIGN1cnJlbnQgcGFnZSBuZWVkcyB0byBiZSB0aGUgbGFzdCBwYWdlLiAqL1xuICAgIGlmICh0aGlzLnByb3BzLnBhZ2VzICE9PSBwcmV2UHJvcHMucGFnZXMgJiYgdGhpcy5wcm9wcy5wYWdlcyA8PSB0aGlzLnN0YXRlLnBhZ2UpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBwYWdlOiB0aGlzLnByb3BzLnBhZ2VzIC0gMSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHBhZ2UpKSB7XG4gICAgICBwYWdlID0gdGhpcy5wcm9wcy5wYWdlXG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChwYWdlLCAwKSwgdGhpcy5wcm9wcy5wYWdlcyAtIDEpXG4gIH1cblxuICBjaGFuZ2VQYWdlIChwYWdlKSB7XG4gICAgcGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UocGFnZSlcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZSB9KVxuICAgIGlmICh0aGlzLnByb3BzLnBhZ2UgIT09IHBhZ2UpIHtcbiAgICAgIHRoaXMucHJvcHMub25QYWdlQ2hhbmdlKHBhZ2UpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlQYWdlIChlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgICBjb25zdCBwYWdlID0gdGhpcy5zdGF0ZS5wYWdlXG4gICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgPT09ICcnID8gdGhpcy5wcm9wcy5wYWdlIDogcGFnZSlcbiAgfVxuXG4gIGdldFBhZ2VKdW1wUHJvcGVydGllcyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9uS2V5UHJlc3M6IGUgPT4ge1xuICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMgfHwgZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uQmx1cjogdGhpcy5hcHBseVBhZ2UsXG4gICAgICB2YWx1ZTogdGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICcnIDogdGhpcy5zdGF0ZS5wYWdlICsgMSxcbiAgICAgIG9uQ2hhbmdlOiBlID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcbiAgICAgICAgY29uc3QgcGFnZSA9IHZhbCAtIDFcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpIH0pXG4gICAgICB9LFxuICAgICAgaW5wdXRUeXBlOiB0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJ3RleHQnIDogJ251bWJlcicsXG4gICAgICBwYWdlSnVtcFRleHQ6IHRoaXMucHJvcHMucGFnZUp1bXBUZXh0LFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qge1xuICAgICAgLy8gQ29tcHV0ZWRcbiAgICAgIHBhZ2VzLFxuICAgICAgLy8gUHJvcHNcbiAgICAgIHBhZ2UsXG4gICAgICBzaG93UGFnZVNpemVPcHRpb25zLFxuICAgICAgcGFnZVNpemVPcHRpb25zLFxuICAgICAgcGFnZVNpemUsXG4gICAgICBzaG93UGFnZUp1bXAsXG4gICAgICBjYW5QcmV2aW91cyxcbiAgICAgIGNhbk5leHQsXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgUHJldmlvdXNDb21wb25lbnQsXG4gICAgICBOZXh0Q29tcG9uZW50LFxuICAgICAgcmVuZGVyUGFnZUp1bXAsXG4gICAgICByZW5kZXJDdXJyZW50UGFnZSxcbiAgICAgIHJlbmRlclRvdGFsUGFnZXNDb3VudCxcbiAgICAgIHJlbmRlclBhZ2VTaXplT3B0aW9ucyxcbiAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cbiAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlIC0gMSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzIHx8IHRoaXMuc3RhdGUucGFnZSA8IDF9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1jZW50ZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnBhZ2VUZXh0fXsnICd9XG4gICAgICAgICAgICB7c2hvd1BhZ2VKdW1wID8gcmVuZGVyUGFnZUp1bXAodGhpcy5nZXRQYWdlSnVtcFByb3BlcnRpZXMoKSkgOiByZW5kZXJDdXJyZW50UGFnZShwYWdlKX17JyAnfVxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSB7cmVuZGVyVG90YWxQYWdlc0NvdW50KHBhZ2VzKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge3Nob3dQYWdlU2l6ZU9wdGlvbnMgJiZcbiAgICAgICAgICByZW5kZXJQYWdlU2l6ZU9wdGlvbnMoe1xuICAgICAgICAgICAgcGFnZVNpemUsXG4gICAgICAgICAgICByb3dzU2VsZWN0b3JUZXh0OiB0aGlzLnByb3BzLnJvd3NTZWxlY3RvclRleHQsXG4gICAgICAgICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICAgICAgICBvblBhZ2VTaXplQ2hhbmdlLFxuICAgICAgICAgICAgcm93c1RleHQ6IHRoaXMucHJvcHMucm93c1RleHQsXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1uZXh0XCI+XG4gICAgICAgICAgPE5leHRDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5OZXh0KSByZXR1cm5cbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dCB8fCB0aGlzLnN0YXRlLnBhZ2UgPj0gdGhpcy5wcm9wcy5wYWdlcyAtIDF9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubmV4dFRleHR9XG4gICAgICAgICAgPC9OZXh0Q29tcG9uZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19