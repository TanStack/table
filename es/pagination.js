var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
                _this2.changePage(page - 1);
              },
              disabled: !canPrevious
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
            showPageJump ? React.createElement(
              'div',
              { className: '-pageJump' },
              React.createElement('input', {
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
            ) : React.createElement(
              'span',
              { className: '-currentPage' },
              page + 1
            ),
            ' ',
            this.props.ofText,
            ' ',
            React.createElement(
              'span',
              { className: '-totalPages' },
              pages || 1
            )
          ),
          showPageSizeOptions && React.createElement(
            'span',
            { className: 'select-wrap -pageSizeOptions' },
            React.createElement(
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
                  React.createElement(
                    'option',
                    { key: i, value: option },
                    option + ' ' + _this2.props.rowsText
                  )
                );
              })
            )
          )
        ),
        React.createElement(
          'div',
          { className: '-next' },
          React.createElement(
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
}(Component);

export default ReactTablePagination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiY2xhc3NuYW1lcyIsImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dQYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZU9wdGlvbnMiLCJwYWdlU2l6ZSIsInNob3dQYWdlSnVtcCIsImNhblByZXZpb3VzIiwiY2FuTmV4dCIsIm9uUGFnZVNpemVDaGFuZ2UiLCJjbGFzc05hbWUiLCJQcmV2aW91c0NvbXBvbmVudCIsIk5leHRDb21wb25lbnQiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwicGFnZUp1bXBUZXh0IiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJ3aGljaCIsImtleUNvZGUiLCJvZlRleHQiLCJyb3dzU2VsZWN0b3JUZXh0IiwibWFwIiwib3B0aW9uIiwiaSIsInJvd3NUZXh0IiwibmV4dFRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFVBQVAsTUFBdUIsWUFBdkI7O0FBRUEsSUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1BQUssUUFBYixJQUEwQkMsS0FBMUIsSUFBaUMsV0FBVSxNQUEzQztBQUNHQSxVQUFNQztBQURULEdBRG9CO0FBQUEsQ0FBdEI7O0lBTXFCQyxvQjs7O0FBQ25CLGdDQUFhRixLQUFiLEVBQW9CO0FBQUE7O0FBQUE7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QUFBLHlCQUFLZCxpQkFBaUJmLE9BQU9PLEVBQUVpQixNQUFGLENBQVNDLEtBQWhCLENBQWpCLENBQUw7QUFBQSxpQkFGWjtBQUdFLHVCQUFPZCxRQUhUO0FBSUdELDhCQUFnQm9CLEdBQWhCLENBQW9CLFVBQUNDLE1BQUQsRUFBU0MsQ0FBVDtBQUFBO0FBQ25CO0FBQ0E7QUFBQTtBQUFBLHNCQUFRLEtBQUtBLENBQWIsRUFBZ0IsT0FBT0QsTUFBdkI7QUFDTUEsMEJBRE4sU0FDZ0IsT0FBSzFDLEtBQUwsQ0FBVzRDO0FBRDNCO0FBRm1CO0FBQUEsZUFBcEI7QUFKSDtBQURGO0FBL0JKLFNBWkY7QUEwREU7QUFBQTtBQUFBLFlBQUssV0FBVSxPQUFmO0FBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsdUJBQVMsbUJBQU07QUFDYixvQkFBSSxDQUFDbkIsT0FBTCxFQUFjO0FBQ2QsdUJBQUtwQixVQUFMLENBQWdCRyxPQUFPLENBQXZCO0FBQ0QsZUFKSDtBQUtFLHdCQUFVLENBQUNpQjtBQUxiO0FBT0csaUJBQUt6QixLQUFMLENBQVc2QztBQVBkO0FBREY7QUExREYsT0FERjtBQXdFRDs7OztFQXBJK0NoRCxTOztlQUE3Qkssb0IiLCJmaWxlIjoicGFnaW5hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcclxuXHJcbmNvbnN0IGRlZmF1bHRCdXR0b24gPSBwcm9wcyA9PiAoXHJcbiAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgey4uLnByb3BzfSBjbGFzc05hbWU9XCItYnRuXCI+XHJcbiAgICB7cHJvcHMuY2hpbGRyZW59XHJcbiAgPC9idXR0b24+XHJcbilcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0VGFibGVQYWdpbmF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcclxuICAgIHN1cGVyKClcclxuXHJcbiAgICB0aGlzLmdldFNhZmVQYWdlID0gdGhpcy5nZXRTYWZlUGFnZS5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5hcHBseVBhZ2UgPSB0aGlzLmFwcGx5UGFnZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgcGFnZTogcHJvcHMucGFnZSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xyXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gbmV4dFByb3BzLnBhZ2UpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IG5leHRQcm9wcy5wYWdlIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTYWZlUGFnZSAocGFnZSkge1xyXG4gICAgaWYgKE51bWJlci5pc05hTihwYWdlKSkge1xyXG4gICAgICBwYWdlID0gdGhpcy5wcm9wcy5wYWdlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgocGFnZSwgMCksIHRoaXMucHJvcHMucGFnZXMgLSAxKVxyXG4gIH1cclxuXHJcbiAgY2hhbmdlUGFnZSAocGFnZSkge1xyXG4gICAgcGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UocGFnZSlcclxuICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlIH0pXHJcbiAgICBpZiAodGhpcy5wcm9wcy5wYWdlICE9PSBwYWdlKSB7XHJcbiAgICAgIHRoaXMucHJvcHMub25QYWdlQ2hhbmdlKHBhZ2UpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhcHBseVBhZ2UgKGUpIHtcclxuICAgIGlmIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcGFnZSA9IHRoaXMuc3RhdGUucGFnZVxyXG4gICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgPT09ICcnID8gdGhpcy5wcm9wcy5wYWdlIDogcGFnZSlcclxuICB9XHJcblxyXG4gIHJlbmRlciAoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIC8vIENvbXB1dGVkXHJcbiAgICAgIHBhZ2VzLFxyXG4gICAgICAvLyBQcm9wc1xyXG4gICAgICBwYWdlLFxyXG4gICAgICBzaG93UGFnZVNpemVPcHRpb25zLFxyXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXHJcbiAgICAgIHBhZ2VTaXplLFxyXG4gICAgICBzaG93UGFnZUp1bXAsXHJcbiAgICAgIGNhblByZXZpb3VzLFxyXG4gICAgICBjYW5OZXh0LFxyXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIFByZXZpb3VzQ29tcG9uZW50ID0gZGVmYXVsdEJ1dHRvbixcclxuICAgICAgTmV4dENvbXBvbmVudCA9IGRlZmF1bHRCdXR0b24sXHJcbiAgICB9ID0gdGhpcy5wcm9wc1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1wcmV2aW91c1wiPlxyXG4gICAgICAgICAgPFByZXZpb3VzQ29tcG9uZW50XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIWNhblByZXZpb3VzKSByZXR1cm5cclxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSAtIDEpXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuUHJldmlvdXN9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cclxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItY2VudGVyXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cclxuICAgICAgICAgICAge3RoaXMucHJvcHMucGFnZVRleHR9eycgJ31cclxuICAgICAgICAgICAge3Nob3dQYWdlSnVtcCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1wYWdlSnVtcFwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3RoaXMucHJvcHMucGFnZUp1bXBUZXh0fVxyXG4gICAgICAgICAgICAgICAgICB0eXBlPXt0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJ3RleHQnIDogJ251bWJlcid9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB2YWwgLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgcGFnZTogdmFsIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpIH0pXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJycgOiB0aGlzLnN0YXRlLnBhZ2UgKyAxfVxyXG4gICAgICAgICAgICAgICAgICBvbkJsdXI9e3RoaXMuYXBwbHlQYWdlfVxyXG4gICAgICAgICAgICAgICAgICBvbktleVByZXNzPXtlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMgfHwgZS5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhZ2UoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiLWN1cnJlbnRQYWdlXCI+e3BhZ2UgKyAxfTwvc3Bhbj5cclxuICAgICAgICAgICAgKX17JyAnfVxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5vZlRleHR9IDxzcGFuIGNsYXNzTmFtZT1cIi10b3RhbFBhZ2VzXCI+e3BhZ2VzIHx8IDF9PC9zcGFuPlxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAge3Nob3dQYWdlU2l6ZU9wdGlvbnMgJiYgKFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzZWxlY3Qtd3JhcCAtcGFnZVNpemVPcHRpb25zXCI+XHJcbiAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17dGhpcy5wcm9wcy5yb3dzU2VsZWN0b3JUZXh0fVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25QYWdlU2l6ZUNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX1cclxuICAgICAgICAgICAgICAgIHZhbHVlPXtwYWdlU2l6ZX0+XHJcbiAgICAgICAgICAgICAgICB7cGFnZVNpemVPcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l9IHZhbHVlPXtvcHRpb259PlxyXG4gICAgICAgICAgICAgICAgICAgIHtgJHtvcHRpb259ICR7dGhpcy5wcm9wcy5yb3dzVGV4dH1gfVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLW5leHRcIj5cclxuICAgICAgICAgIDxOZXh0Q29tcG9uZW50XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIWNhbk5leHQpIHJldHVyblxyXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlICsgMSlcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5OZXh0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cclxuICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiJdfQ==