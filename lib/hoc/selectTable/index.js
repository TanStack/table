'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable */

var defaultSelectInputComponent = function defaultSelectInputComponent(props) {
  return _react2.default.createElement('input', {
    type: props.selectType || 'checkbox',
    checked: props.checked,
    onClick: function onClick(e) {
      var shiftKey = e.shiftKey;

      e.stopPropagation();
      props.onClick(props.id, shiftKey, props.row);
    },
    onChange: function onChange() {}
  });
};

exports.default = function (Component, options) {
  var wrapper = function (_React$Component) {
    _inherits(RTSelectTable, _React$Component);

    function RTSelectTable(props) {
      _classCallCheck(this, RTSelectTable);

      return _possibleConstructorReturn(this, (RTSelectTable.__proto__ || Object.getPrototypeOf(RTSelectTable)).call(this, props));
    }

    _createClass(RTSelectTable, [{
      key: 'rowSelector',
      value: function rowSelector(row) {
        if (!row || !row.hasOwnProperty(this.props.keyField)) return null;
        var _props = this.props,
            toggleSelection = _props.toggleSelection,
            selectType = _props.selectType,
            keyField = _props.keyField;

        var checked = this.props.isSelected(row[this.props.keyField]);
        var inputProps = {
          checked: checked,
          onClick: toggleSelection,
          selectType: selectType,
          id: row[keyField],
          row: row
        };
        return _react2.default.createElement(this.props.SelectInputComponent, inputProps);
      }
    }, {
      key: 'headSelector',
      value: function headSelector(row) {
        var selectType = this.props.selectType;

        if (selectType === 'radio') return null;

        var _props2 = this.props,
            toggleAll = _props2.toggleAll,
            checked = _props2.selectAll,
            SelectAllInputComponent = _props2.SelectAllInputComponent;

        var inputProps = {
          checked: checked,
          onClick: toggleAll,
          selectType: selectType
        };

        return _react2.default.createElement(SelectAllInputComponent, inputProps);
      }

      // this is so we can expose the underlying ReactTable to get at the sortedData for selectAll

    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        if (!this.wrappedInstance) console.warn('RTSelectTable - No wrapped instance');
        if (this.wrappedInstance.getWrappedInstance) return this.wrappedInstance.getWrappedInstance();else return this.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props3 = this.props,
            originalCols = _props3.columns,
            isSelected = _props3.isSelected,
            toggleSelection = _props3.toggleSelection,
            toggleAll = _props3.toggleAll,
            keyField = _props3.keyField,
            selectAll = _props3.selectAll,
            selectType = _props3.selectType,
            selectWidth = _props3.selectWidth,
            SelectAllInputComponent = _props3.SelectAllInputComponent,
            SelectInputComponent = _props3.SelectInputComponent,
            rest = _objectWithoutProperties(_props3, ['columns', 'isSelected', 'toggleSelection', 'toggleAll', 'keyField', 'selectAll', 'selectType', 'selectWidth', 'SelectAllInputComponent', 'SelectInputComponent']);

        var _options$floatingLeft = options.floatingLeft,
            floatingLeft = _options$floatingLeft === undefined ? false : _options$floatingLeft;

        var select = {
          id: '_selector',
          accessor: function accessor() {
            return 'x';
          }, // this value is not important
          Header: this.headSelector.bind(this),
          Cell: function Cell(ci) {
            return _this2.rowSelector.bind(_this2)(ci.original);
          },
          width: selectWidth || 30,
          filterable: false,
          sortable: false,
          resizable: false,
          style: { textAlign: 'center' }
        };

        var columns = floatingLeft ? [].concat(_toConsumableArray(originalCols), [select]) : [select].concat(_toConsumableArray(originalCols));
        var extra = {
          columns: columns
        };
        return _react2.default.createElement(Component, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTSelectTable;
  }(_react2.default.Component);

  wrapper.displayName = 'RTSelectTable';
  wrapper.defaultProps = {
    keyField: '_id',
    isSelected: function isSelected(key) {
      console.log('No isSelected handler provided:', { key: key });
    },
    selectAll: false,
    toggleSelection: function toggleSelection(key, shift, row) {
      console.log('No toggleSelection handler provided:', { key: key, shift: shift, row: row });
    },
    toggleAll: function toggleAll() {
      console.log('No toggleAll handler provided.');
    },
    selectType: 'checkbox',
    SelectInputComponent: defaultSelectInputComponent,
    SelectAllInputComponent: defaultSelectInputComponent
  };

  return wrapper;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50IiwicHJvcHMiLCJzZWxlY3RUeXBlIiwiY2hlY2tlZCIsInNoaWZ0S2V5IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm9uQ2xpY2siLCJpZCIsInJvdyIsIkNvbXBvbmVudCIsIm9wdGlvbnMiLCJ3cmFwcGVyIiwiaGFzT3duUHJvcGVydHkiLCJrZXlGaWVsZCIsInRvZ2dsZVNlbGVjdGlvbiIsImlzU2VsZWN0ZWQiLCJpbnB1dFByb3BzIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiU2VsZWN0SW5wdXRDb21wb25lbnQiLCJ0b2dnbGVBbGwiLCJzZWxlY3RBbGwiLCJTZWxlY3RBbGxJbnB1dENvbXBvbmVudCIsIndyYXBwZWRJbnN0YW5jZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwib3JpZ2luYWxDb2xzIiwiY29sdW1ucyIsInNlbGVjdFdpZHRoIiwicmVzdCIsImZsb2F0aW5nTGVmdCIsInNlbGVjdCIsImFjY2Vzc29yIiwiSGVhZGVyIiwiaGVhZFNlbGVjdG9yIiwiYmluZCIsIkNlbGwiLCJyb3dTZWxlY3RvciIsImNpIiwib3JpZ2luYWwiLCJ3aWR0aCIsImZpbHRlcmFibGUiLCJzb3J0YWJsZSIsInJlc2l6YWJsZSIsInN0eWxlIiwidGV4dEFsaWduIiwiZXh0cmEiLCJyIiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJsb2ciLCJrZXkiLCJzaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7OzsrZUFGQTs7QUFJQSxJQUFNQSw4QkFBOEIsU0FBOUJBLDJCQUE4QixRQUFTO0FBQzNDLFNBQ0U7QUFDRSxVQUFNQyxNQUFNQyxVQUFOLElBQW9CLFVBRDVCO0FBRUUsYUFBU0QsTUFBTUUsT0FGakI7QUFHRSxhQUFTLG9CQUFLO0FBQUEsVUFDSkMs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QixHQUFSLENBQVksZ0NBQVo7QUFDRCxLQVhvQjtBQVlyQmxELGdCQUFZLFVBWlM7QUFhckJrQiwwQkFBc0JwQiwyQkFiRDtBQWNyQnVCLDZCQUF5QnZCO0FBZEosR0FBdkI7O0FBaUJBLFNBQU9ZLE9BQVA7QUFDRCxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmNvbnN0IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCA9IHByb3BzID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9e3Byb3BzLnNlbGVjdFR5cGUgfHwgJ2NoZWNrYm94J31cclxuICAgICAgY2hlY2tlZD17cHJvcHMuY2hlY2tlZH1cclxuICAgICAgb25DbGljaz17ZSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBzaGlmdEtleSB9ID0gZVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBwcm9wcy5vbkNsaWNrKHByb3BzLmlkLCBzaGlmdEtleSwgcHJvcHMucm93KVxyXG4gICAgICB9fVxyXG4gICAgICBvbkNoYW5nZT17KCkgPT4ge319XHJcbiAgICAvPlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKENvbXBvbmVudCwgb3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBjbGFzcyBSVFNlbGVjdFRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgfVxyXG5cclxuICAgIHJvd1NlbGVjdG9yKHJvdykge1xyXG4gICAgICBpZiAoIXJvdyB8fCAhcm93Lmhhc093blByb3BlcnR5KHRoaXMucHJvcHMua2V5RmllbGQpKSByZXR1cm4gbnVsbFxyXG4gICAgICBjb25zdCB7IHRvZ2dsZVNlbGVjdGlvbiwgc2VsZWN0VHlwZSwga2V5RmllbGQgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3QgY2hlY2tlZCA9IHRoaXMucHJvcHMuaXNTZWxlY3RlZChyb3dbdGhpcy5wcm9wcy5rZXlGaWVsZF0pXHJcbiAgICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XHJcbiAgICAgICAgY2hlY2tlZCxcclxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVTZWxlY3Rpb24sXHJcbiAgICAgICAgc2VsZWN0VHlwZSxcclxuICAgICAgICBpZDogcm93W2tleUZpZWxkXSxcclxuICAgICAgICByb3csXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5TZWxlY3RJbnB1dENvbXBvbmVudCwgaW5wdXRQcm9wcylcclxuICAgIH1cclxuXHJcbiAgICBoZWFkU2VsZWN0b3Iocm93KSB7XHJcbiAgICAgIGNvbnN0IHsgc2VsZWN0VHlwZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSA9PT0gJ3JhZGlvJykgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IHsgdG9nZ2xlQWxsLCBzZWxlY3RBbGw6IGNoZWNrZWQsIFNlbGVjdEFsbElucHV0Q29tcG9uZW50IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XHJcbiAgICAgICAgY2hlY2tlZCxcclxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVBbGwsXHJcbiAgICAgICAgc2VsZWN0VHlwZSxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsIGlucHV0UHJvcHMpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUgdG8gZ2V0IGF0IHRoZSBzb3J0ZWREYXRhIGZvciBzZWxlY3RBbGxcclxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSgpIHtcclxuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVFNlbGVjdFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXHJcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxyXG4gICAgICBlbHNlIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgY29uc3Qge1xyXG4gICAgICAgIGNvbHVtbnM6IG9yaWdpbmFsQ29scyxcclxuICAgICAgICBpc1NlbGVjdGVkLFxyXG4gICAgICAgIHRvZ2dsZVNlbGVjdGlvbixcclxuICAgICAgICB0b2dnbGVBbGwsXHJcbiAgICAgICAga2V5RmllbGQsXHJcbiAgICAgICAgc2VsZWN0QWxsLFxyXG4gICAgICAgIHNlbGVjdFR5cGUsXHJcbiAgICAgICAgc2VsZWN0V2lkdGgsXHJcbiAgICAgICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsXHJcbiAgICAgICAgU2VsZWN0SW5wdXRDb21wb25lbnQsXHJcbiAgICAgICAgLi4ucmVzdFxyXG4gICAgICB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBjb25zdCB7IGZsb2F0aW5nTGVmdCA9IGZhbHNlIH0gPSBvcHRpb25zXHJcbiAgICAgIGNvbnN0IHNlbGVjdCA9IHtcclxuICAgICAgICBpZDogJ19zZWxlY3RvcicsXHJcbiAgICAgICAgYWNjZXNzb3I6ICgpID0+ICd4JywgLy8gdGhpcyB2YWx1ZSBpcyBub3QgaW1wb3J0YW50XHJcbiAgICAgICAgSGVhZGVyOiB0aGlzLmhlYWRTZWxlY3Rvci5iaW5kKHRoaXMpLFxyXG4gICAgICAgIENlbGw6IGNpID0+IHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnJvd1NlbGVjdG9yLmJpbmQodGhpcykoY2kub3JpZ2luYWwpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3aWR0aDogc2VsZWN0V2lkdGggfHwgMzAsXHJcbiAgICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICAgICAgc3R5bGU6IHsgdGV4dEFsaWduOiAnY2VudGVyJyB9LFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjb2x1bW5zID0gZmxvYXRpbmdMZWZ0ID8gWy4uLm9yaWdpbmFsQ29scywgc2VsZWN0XSA6IFtzZWxlY3QsIC4uLm9yaWdpbmFsQ29sc11cclxuICAgICAgY29uc3QgZXh0cmEgPSB7XHJcbiAgICAgICAgY29sdW1ucyxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gPENvbXBvbmVudCB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JUU2VsZWN0VGFibGUnXHJcbiAgd3JhcHBlci5kZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBrZXlGaWVsZDogJ19pZCcsXHJcbiAgICBpc1NlbGVjdGVkOiBrZXkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnTm8gaXNTZWxlY3RlZCBoYW5kbGVyIHByb3ZpZGVkOicsIHsga2V5IH0pXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0QWxsOiBmYWxzZSxcclxuICAgIHRvZ2dsZVNlbGVjdGlvbjogKGtleSwgc2hpZnQsIHJvdykgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnTm8gdG9nZ2xlU2VsZWN0aW9uIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXksIHNoaWZ0LCByb3cgfSlcclxuICAgIH0sXHJcbiAgICB0b2dnbGVBbGw6ICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ05vIHRvZ2dsZUFsbCBoYW5kbGVyIHByb3ZpZGVkLicpXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0VHlwZTogJ2NoZWNrYm94JyxcclxuICAgIFNlbGVjdElucHV0Q29tcG9uZW50OiBkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQsXHJcbiAgICBTZWxlY3RBbGxJbnB1dENvbXBvbmVudDogZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50LFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHdyYXBwZXJcclxufVxyXG4iXX0=