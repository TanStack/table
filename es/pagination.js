var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import classnames from 'classnames';

var defaultButton = function defaultButton(props) {
  return React.createElement(
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


      return React.createElement(
        'div',
        { className: classnames(className, '-pagination'), style: this.props.style },
        React.createElement(
          'div',
          { className: '-previous' },
          React.createElement(
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
        React.createElement(
          'div',
          { className: '-center' },
          React.createElement(
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
        React.createElement(
          'div',
          { className: '-next' },
          React.createElement(
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
}(Component);

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
    return React.createElement(
      'div',
      { className: '-pageJump' },
      React.createElement('input', {
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
    return React.createElement(
      'span',
      { className: '-currentPage' },
      page + 1
    );
  },
  renderTotalPagesCount: function renderTotalPagesCount(pages) {
    return React.createElement(
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
    return React.createElement(
      'span',
      { className: 'select-wrap -pageSizeOptions' },
      React.createElement(
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
            React.createElement(
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
export default ReactTablePagination;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiY2xhc3NuYW1lcyIsImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwicHJldlByb3BzIiwicHJldlN0YXRlIiwic2V0U3RhdGUiLCJwYWdlcyIsIk51bWJlciIsImlzTmFOIiwiTWF0aCIsIm1pbiIsIm1heCIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uS2V5UHJlc3MiLCJ3aGljaCIsImtleUNvZGUiLCJvbkJsdXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidmFsIiwidGFyZ2V0IiwiaW5wdXRUeXBlIiwicGFnZUp1bXBUZXh0Iiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwib25QYWdlU2l6ZUNoYW5nZSIsImNsYXNzTmFtZSIsIlByZXZpb3VzQ29tcG9uZW50IiwiTmV4dENvbXBvbmVudCIsInJlbmRlclBhZ2VKdW1wIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJyZW5kZXJUb3RhbFBhZ2VzQ291bnQiLCJyZW5kZXJQYWdlU2l6ZU9wdGlvbnMiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwiZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzIiwib2ZUZXh0Iiwicm93c1NlbGVjdG9yVGV4dCIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJkZWZhdWx0UHJvcHMiLCJtYXAiLCJvcHRpb24iLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFVBQVAsTUFBdUIs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Q0FBU0gsS0FBaEIsQ0FBakIsQ0FBTDtBQUFBLFdBRlo7QUFHRSxpQkFBT1E7QUFIVDtBQUtHRCx3QkFBZ0JzQixHQUFoQixDQUFvQixVQUFDQyxNQUFELEVBQVNDLENBQVQ7QUFBQTtBQUNuQjtBQUNBO0FBQUE7QUFBQSxnQkFBUSxLQUFLQSxDQUFiLEVBQWdCLE9BQU9ELE1BQXZCO0FBQ01BLG9CQUROLFNBQ2dCSjtBQURoQjtBQUZtQjtBQUFBLFNBQXBCO0FBTEg7QUFERixLQVBxQjtBQUFBO0FBbkJILEM7ZUFESGpELG9CIiwiZmlsZSI6InBhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kaWQtdXBkYXRlLXNldC1zdGF0ZSAqL1xyXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXHJcblxyXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxyXG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHsuLi5wcm9wc30gY2xhc3NOYW1lPVwiLWJ0blwiPlxyXG4gICAge3Byb3BzLmNoaWxkcmVufVxyXG4gIDwvYnV0dG9uPlxyXG4pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIFByZXZpb3VzQ29tcG9uZW50OiBkZWZhdWx0QnV0dG9uLFxyXG4gICAgTmV4dENvbXBvbmVudDogZGVmYXVsdEJ1dHRvbixcclxuICAgIHJlbmRlclBhZ2VKdW1wOiAoe1xyXG4gICAgICBvbkNoYW5nZSwgdmFsdWUsIG9uQmx1ciwgb25LZXlQcmVzcywgaW5wdXRUeXBlLCBwYWdlSnVtcFRleHQsXHJcbiAgICB9KSA9PiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLXBhZ2VKdW1wXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICBhcmlhLWxhYmVsPXtwYWdlSnVtcFRleHR9XHJcbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XHJcbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XHJcbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICBvbkJsdXI9e29uQmx1cn1cclxuICAgICAgICAgIG9uS2V5UHJlc3M9e29uS2V5UHJlc3N9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApLFxyXG4gICAgcmVuZGVyQ3VycmVudFBhZ2U6IHBhZ2UgPT4gPHNwYW4gY2xhc3NOYW1lPVwiLWN1cnJlbnRQYWdlXCI+e3BhZ2UgKyAxfTwvc3Bhbj4sXHJcbiAgICByZW5kZXJUb3RhbFBhZ2VzQ291bnQ6IHBhZ2VzID0+IDxzcGFuIGNsYXNzTmFtZT1cIi10b3RhbFBhZ2VzXCI+e3BhZ2VzIHx8IDF9PC9zcGFuPixcclxuICAgIHJlbmRlclBhZ2VTaXplT3B0aW9uczogKHtcclxuICAgICAgcGFnZVNpemUsXHJcbiAgICAgIHBhZ2VTaXplT3B0aW9ucyxcclxuICAgICAgcm93c1NlbGVjdG9yVGV4dCxcclxuICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcclxuICAgICAgcm93c1RleHQsXHJcbiAgICB9KSA9PiAoXHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlbGVjdC13cmFwIC1wYWdlU2l6ZU9wdGlvbnNcIj5cclxuICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICBhcmlhLWxhYmVsPXtyb3dzU2VsZWN0b3JUZXh0fVxyXG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25QYWdlU2l6ZUNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX1cclxuICAgICAgICAgIHZhbHVlPXtwYWdlU2l6ZX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7cGFnZVNpemVPcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiAoXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtvcHRpb259PlxyXG4gICAgICAgICAgICAgIHtgJHtvcHRpb259ICR7cm93c1RleHR9YH1cclxuICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgPC9zcGFuPlxyXG4gICAgKSxcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcblxyXG4gICAgdGhpcy5nZXRTYWZlUGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcylcclxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XHJcbiAgICBpZiAocHJldlByb3BzLnBhZ2UgIT09IHRoaXMucHJvcHMucGFnZSB8fCBwcmV2U3RhdGUucGFnZSAhPT0gdGhpcy5zdGF0ZS5wYWdlKSB7XHJcbiAgICAgIC8vIHRoaXMgaXMgcHJvYmFibHkgc2FmZSBiZWNhdXNlIHdlIG9ubHkgdXBkYXRlIHdoZW4gb2xkL25ldyBwcm9wcy9zdGF0ZS5wYWdlIGFyZSBkaWZmZXJlbnRcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRpZC11cGRhdGUtc2V0LXN0YXRlXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhZ2U6IHRoaXMucHJvcHMucGFnZSxcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIC8qIHdoZW4gdGhlIGxhc3QgcGFnZSBmcm9tIG5ldyBwcm9wcyBpcyBzbWFsbGVyXHJcbiAgICAgdGhhbiB0aGUgY3VycmVudCBwYWdlIGluIHRoZSBwYWdlIGJveCxcclxuICAgICB0aGUgY3VycmVudCBwYWdlIG5lZWRzIHRvIGJlIHRoZSBsYXN0IHBhZ2UuICovXHJcbiAgICBpZiAodGhpcy5wcm9wcy5wYWdlcyAhPT0gcHJldlByb3BzLnBhZ2VzICYmIHRoaXMucHJvcHMucGFnZXMgPD0gdGhpcy5zdGF0ZS5wYWdlKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhZ2U6IHRoaXMucHJvcHMucGFnZXMgLSAxLFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcclxuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFnZSkpIHtcclxuICAgICAgcGFnZSA9IHRoaXMucHJvcHMucGFnZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcclxuICB9XHJcblxyXG4gIGNoYW5nZVBhZ2UgKHBhZ2UpIHtcclxuICAgIHBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpXHJcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZSB9KVxyXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gcGFnZSkge1xyXG4gICAgICB0aGlzLnByb3BzLm9uUGFnZUNoYW5nZShwYWdlKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXBwbHlQYWdlIChlKSB7XHJcbiAgICBpZiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnN0YXRlLnBhZ2VcclxuICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlID09PSAnJyA/IHRoaXMucHJvcHMucGFnZSA6IHBhZ2UpXHJcbiAgfVxyXG5cclxuICBnZXRQYWdlSnVtcFByb3BlcnRpZXMgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb25LZXlQcmVzczogZSA9PiB7XHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDEzIHx8IGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uQmx1cjogdGhpcy5hcHBseVBhZ2UsXHJcbiAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJycgOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLFxyXG4gICAgICBvbkNoYW5nZTogZSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICBjb25zdCBwYWdlID0gdmFsIC0gMVxyXG4gICAgICAgIGlmICh2YWwgPT09ICcnKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogdGhpcy5nZXRTYWZlUGFnZShwYWdlKSB9KVxyXG4gICAgICB9LFxyXG4gICAgICBpbnB1dFR5cGU6IHRoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAndGV4dCcgOiAnbnVtYmVyJyxcclxuICAgICAgcGFnZUp1bXBUZXh0OiB0aGlzLnByb3BzLnBhZ2VKdW1wVGV4dCxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIC8vIENvbXB1dGVkXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICAvLyBQcm9wc1xyXG4gICAgICBwYWdlLFxyXG4gICAgICBzaG93UGFnZVNpemVPcHRpb25zLFxyXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgIHBhZ2VTaXplLFxyXG4gICAgICBzaG93UGFnZUp1bXAsXHJcbiAgICAgIGNhblByZXZpb3VzLFxyXG4gICAgICBjYW5OZXh0LFxyXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIFByZXZpb3VzQ29tcG9uZW50LFxyXG4gICAgICBOZXh0Q29tcG9uZW50LFxyXG4gICAgICByZW5kZXJQYWdlSnVtcCxcclxuICAgICAgcmVuZGVyQ3VycmVudFBhZ2UsXHJcbiAgICAgIHJlbmRlclRvdGFsUGFnZXNDb3VudCxcclxuICAgICAgcmVuZGVyUGFnZVNpemVPcHRpb25zLFxyXG4gICAgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyhjbGFzc05hbWUsICctcGFnaW5hdGlvbicpfSBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cclxuICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzIHx8IHRoaXMuc3RhdGUucGFnZSA8IDF9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cclxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItY2VudGVyXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMucGFnZVRleHR9eycgJ31cclxuICAgICAgICAgICAge3Nob3dQYWdlSnVtcCA/IHJlbmRlclBhZ2VKdW1wKHRoaXMuZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzKCkpIDogcmVuZGVyQ3VycmVudFBhZ2UocGFnZSl9eycgJ31cclxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSB7cmVuZGVyVG90YWxQYWdlc0NvdW50KHBhZ2VzKX1cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmXHJcbiAgICAgICAgICByZW5kZXJQYWdlU2l6ZU9wdGlvbnMoe1xyXG4gICAgICAgICAgICBwYWdlU2l6ZSxcclxuICAgICAgICAgICAgcm93c1NlbGVjdG9yVGV4dDogdGhpcy5wcm9wcy5yb3dzU2VsZWN0b3JUZXh0LFxyXG4gICAgICAgICAgICBwYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXHJcbiAgICAgICAgICAgIHJvd3NUZXh0OiB0aGlzLnByb3BzLnJvd3NUZXh0LFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItbmV4dFwiPlxyXG4gICAgICAgICAgPE5leHRDb21wb25lbnRcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghY2FuTmV4dCkgcmV0dXJuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhbk5leHQgfHwgdGhpcy5zdGF0ZS5wYWdlID49IHRoaXMucHJvcHMucGFnZXMgLSAxfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cclxuICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==