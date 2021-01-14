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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwic2V0U3RhdGUiLCJwYWdlcyIsIk51bWJlciIsImlzTmFOIiwiTWF0aCIsIm1pbiIsIm1heCIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uS2V5UHJlc3MiLCJ3aGljaCIsImtleUNvZGUiLCJvbkJsdXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidmFsIiwidGFyZ2V0IiwiaW5wdXRUeXBlIiwicGFnZUp1bXBUZXh0Iiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwib25QYWdlU2l6ZUNoYW5nZSIsImNsYXNzTmFtZSIsIlByZXZpb3VzQ29tcG9uZW50IiwiTmV4dENvbXBvbmVudCIsInJlbmRlclBhZ2VKdW1wIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJyZW5kZXJUb3RhbFBhZ2VzQ291bnQiLCJyZW5kZXJQYWdlU2l6ZU9wdGlvbnMiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwiZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzIiwib2ZUZXh0Iiwicm93c1NlbGVjdG9yVGV4dCIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJtYXAiLCJvcHRpb24iLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrUUFBQTs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1B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QWhCLENBQW9CLFVBQUNDLE1BQUQsRUFBU0MsQ0FBVDtBQUFBO0FBQ25CO0FBQ0E7QUFBQTtBQUFBLGdCQUFRLEtBQUtBLENBQWIsRUFBZ0IsT0FBT0QsTUFBdkI7QUFDTUEsb0JBRE4sU0FDZ0JMO0FBRGhCO0FBRm1CO0FBQUEsU0FBcEI7QUFMSDtBQURGLEtBUHFCO0FBQUE7QUFuQkgsQztrQkFESGpELG9CIiwiZmlsZSI6InBhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kaWQtdXBkYXRlLXNldC1zdGF0ZSAqL1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXHJcblxyXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxyXG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHsuLi5wcm9wc30gY2xhc3NOYW1lPVwiLWJ0blwiPlxyXG4gICAge3Byb3BzLmNoaWxkcmVufVxyXG4gIDwvYnV0dG9uPlxyXG4pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIFByZXZpb3VzQ29tcG9uZW50OiBkZWZhdWx0QnV0dG9uLFxyXG4gICAgTmV4dENvbXBvbmVudDogZGVmYXVsdEJ1dHRvbixcclxuICAgIHJlbmRlclBhZ2VKdW1wOiAoe1xyXG4gICAgICBvbkNoYW5nZSwgdmFsdWUsIG9uQmx1ciwgb25LZXlQcmVzcywgaW5wdXRUeXBlLCBwYWdlSnVtcFRleHQsXHJcbiAgICB9KSA9PiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLXBhZ2VKdW1wXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICBhcmlhLWxhYmVsPXtwYWdlSnVtcFRleHR9XHJcbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XHJcbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICBvbkJsdXI9e29uQmx1cn1cclxuICAgICAgICAgIG9uS2V5UHJlc3M9e29uS2V5UHJlc3N9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApLFxyXG4gICAgcmVuZGVyQ3VycmVudFBhZ2U6IHBhZ2UgPT4gPHNwYW4gY2xhc3NOYW1lPVwiLWN1cnJlbnRQYWdlXCI+e3BhZ2UgKyAxfTwvc3Bhbj4sXHJcbiAgICByZW5kZXJUb3RhbFBhZ2VzQ291bnQ6IHBhZ2VzID0+IDxzcGFuIGNsYXNzTmFtZT1cIi10b3RhbFBhZ2VzXCI+e3BhZ2VzIHx8IDF9PC9zcGFuPixcclxuICAgIHJlbmRlclBhZ2VTaXplT3B0aW9uczogKHtcclxuICAgICAgcGFnZVNpemUsXHJcbiAgICAgIHBhZ2VTaXplT3B0aW9ucyxcclxuICAgICAgcm93c1NlbGVjdG9yVGV4dCxcclxuICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcclxuICAgICAgcm93c1RleHQsXHJcbiAgICB9KSA9PiAoXHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlbGVjdC13cmFwIC1wYWdlU2l6ZU9wdGlvbnNcIj5cclxuICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICBhcmlhLWxhYmVsPXtyb3dzU2VsZWN0b3JUZXh0fVxyXG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25QYWdlU2l6ZUNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX1cclxuICAgICAgICAgIHZhbHVlPXtwYWdlU2l6ZX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7cGFnZVNpemVPcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiAoXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtvcHRpb259PlxyXG4gICAgICAgICAgICAgIHtgJHtvcHRpb259ICR7cm93c1RleHR9YH1cclxuICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKSxcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcblxyXG4gICAgdGhpcy5nZXRTYWZlUGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcylcclxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XHJcbiAgICBpZiAocHJldlByb3BzLnBhZ2UgIT09IHRoaXMucHJvcHMucGFnZSB8fCBwcmV2U3RhdGUucGFnZSAhPT0gdGhpcy5zdGF0ZS5wYWdlKSB7XHJcbiAgICAgIC8vIHRoaXMgaXMgcHJvYmFibHkgc2FmZSBiZWNhdXNlIHdlIG9ubHkgdXBkYXRlIHdoZW4gb2xkL25ldyBwcm9wcy9zdGF0ZS5wYWdlIGFyZSBkaWZmZXJlbnRcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRpZC11cGRhdGUtc2V0LXN0YXRlXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhZ2U6IHRoaXMucHJvcHMucGFnZSxcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIC8qIHdoZW4gdGhlIGxhc3QgcGFnZSBmcm9tIG5ldyBwcm9wcyBpcyBzbWFsbGVyXHJcbiAgICAgdGhhbiB0aGUgY3VycmVudCBwYWdlIGluIHRoZSBwYWdlIGJveCxcclxuICAgICB0aGUgY3VycmVudCBwYWdlIG5lZWRzIHRvIGJlIHRoZSBsYXN0IHBhZ2UuICovXHJcbiAgICBpZiAodGhpcy5wcm9wcy5wYWdlcyAhPT0gcHJldlByb3BzLnBhZ2VzICYmIHRoaXMucHJvcHMucGFnZXMgPD0gdGhpcy5zdGF0ZS5wYWdlKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhZ2U6IHRoaXMucHJvcHMucGFnZXMgLSAxLFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcclxuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFnZSkpIHtcclxuICAgICAgcGFnZSA9IHRoaXMucHJvcHMucGFnZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcclxuICB9XHJcblxyXG4gIGNoYW5nZVBhZ2UgKHBhZ2UpIHtcclxuICAgIHBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZSB9KVxyXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gcGFnZSkge1xyXG4gICAgICB0aGlzLnByb3BzLm9uUGFnZUNoYW5nZShwYWdlKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXBwbHlQYWdlIChlKSB7XHJcbiAgICBpZiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnN0YXRlLnBhZ2VcclxuICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlID09PSAnJyA/IHRoaXMucHJvcHMucGFnZSA6IHBhZ2UpXHJcbiAgfVxyXG5cclxuICBnZXRQYWdlSnVtcFByb3BlcnRpZXMgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb25LZXlQcmVzczogZSA9PiB7XHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDEzIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uQmx1cjogdGhpcy5hcHBseVBhZ2UsXHJcbiAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJycgOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLFxyXG4gICAgICBvbkNoYW5nZTogZSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICBjb25zdCBwYWdlID0gdmFsIC0gMVxyXG4gICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogdGhpcy5nZXRTYWZlUGFnZShwYWdlKSB9KVxyXG4gICAgICB9LFxyXG4gICAgICBpbnB1dFR5cGU6IHRoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAndGV4dCcgOiAnbnVtYmVyJyxcclxuICAgICAgcGFnZUp1bXBUZXh0OiB0aGlzLnByb3BzLnBhZ2VKdW1wVGV4dCxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIC8vIENvbXB1dGVkXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICAvLyBQcm9wc1xyXG4gICAgICBwYWdlLFxyXG4gICAgICBzaG93UGFnZVNpemVPcHRpb25zLFxyXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgIHBhZ2VTaXplLFxyXG4gICAgICBzaG93UGFnZUp1bXAsXHJcbiAgICAgIGNhblByZXZpb3VzLFxyXG4gICAgICBjYW5OZXh0LFxyXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIFByZXZpb3VzQ29tcG9uZW50LFxyXG4gICAgICBOZXh0Q29tcG9uZW50LFxyXG4gICAgICByZW5kZXJQYWdlSnVtcCxcclxuICAgICAgcmVuZGVyQ3VycmVudFBhZ2UsXHJcbiAgICAgIHJlbmRlclRvdGFsUGFnZXNDb3VudCxcclxuICAgICAgcmVuZGVyUGFnZVNpemVPcHRpb25zLFxyXG4gICAgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc05hbWUsICctcGFnaW5hdGlvbicpfSBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cclxuICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzIHx8IHRoaXMuc3RhdGUucGFnZSA8IDF9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cclxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItY2VudGVyXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMucGFnZVRleHR9eycgJ31cclxuICAgICAgICAgICAge3Nob3dQYWdlSnVtcCA/IHJlbmRlclBhZ2VKdW1wKHRoaXMuZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzKCkpIDogcmVuZGVyQ3VycmVudFBhZ2UocGFnZSl9eycgJ31cclxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSB7cmVuZGVyVG90YWxQYWdlc0NvdW50KHBhZ2VzKX1cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmXHJcbiAgICAgICAgICByZW5kZXJQYWdlU2l6ZU9wdGlvbnMoe1xyXG4gICAgICAgICAgICBwYWdlU2l6ZSxcclxuICAgICAgICAgICAgcm93c1NlbGVjdG9yVGV4dDogdGhpcy5wcm9wcy5yb3dzU2VsZWN0b3JUZXh0LFxyXG4gICAgICAgICAgICBwYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXHJcbiAgICAgICAgICAgIHJvd3NUZXh0OiB0aGlzLnByb3BzLnJvd3NUZXh0LFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItbmV4dFwiPlxyXG4gICAgICAgICAgPE5leHRDb21wb25lbnRcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghY2FuTmV4dCkgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhbk5leHQgfHwgdGhpcy5zdGF0ZS5wYWdlID49IHRoaXMucHJvcHMucGFnZXMgLSAxfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cclxuICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==