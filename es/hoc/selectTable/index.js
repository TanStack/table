var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

import React from 'react';

var defaultSelectInputComponent = function defaultSelectInputComponent(props) {
  return React.createElement('input', {
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

export default (function (Component) {
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
        return React.createElement(this.props.SelectInputComponent, inputProps);
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

        return React.createElement(SelectAllInputComponent, inputProps);
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
        var columns = [select].concat(_toConsumableArray(originalCols));
        var extra = {
          columns: columns
        };
        return React.createElement(Component, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTSelectTable;
  }(React.Component);

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
    selectType: 'check',
    SelectInputComponent: defaultSelectInputComponent,
    SelectAllInputComponent: defaultSelectInputComponent
  };

  return wrapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiUmVhY3QiLCJkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQiLCJwcm9wcyIsInNlbGVjdFR5cGUiLCJjaGVja2VkIiwic2hpZnRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25DbGljayIsImlkIiwicm93Iiwid3JhcHBlciIsImhhc093blByb3BlcnR5Iiwia2V5RmllbGQiLCJ0b2dnbGVTZWxlY3Rpb24iLCJpc1NlbGVjdGVkIiwiaW5wdXRQcm9wcyIsImNyZWF0ZUVsZW1lbnQiLCJTZWxlY3RJbnB1dENvbXBvbmVudCIsInRvZ2dsZUFsbCIsInNlbGVjdEFsbCIsIlNlbGVjdEFsbElucHV0Q29tcG9uZW50Iiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJvcmlnaW5hbENvbHMiLCJjb2x1bW5zIiwic2VsZWN0V2lkdGgiLCJyZXN0Iiwic2VsZWN0IiwiYWNjZXNzb3IiLCJIZWFkZXIiLCJoZWFkU2VsZWN0b3IiLCJiaW5kIiwiQ2VsbCIsInJvd1NlbGVjdG9yIiwiY2kiLCJvcmlnaW5hbCIsIndpZHRoIiwiZmlsdGVyYWJsZSIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJleHRyYSIsInIiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyIsImxvZyIsImtleSIsInNoaWZ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7O0FBRUEsSUFBTUMsOEJBQThCLFNBQTlCQSwyQkFBOEIsUUFBUztBQUMzQyxTQUNFO0FBQ0UsVUFBTUMsTUFBTUMsVUFBTixJQUFvQixVQUQ1QjtBQUVFLGFBQVNELE1BQU1FLE9BRmpCO0FBR0UsYUFBUyxvQkFBSztBQUFBLFVBQ0pDLFFBREksR0FDU0Ms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aWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmNvbnN0IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCA9IHByb3BzID0+IHtcbiAgcmV0dXJuIChcbiAgICA8aW5wdXRcbiAgICAgIHR5cGU9e3Byb3BzLnNlbGVjdFR5cGUgfHwgJ2NoZWNrYm94J31cbiAgICAgIGNoZWNrZWQ9e3Byb3BzLmNoZWNrZWR9XG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgY29uc3QgeyBzaGlmdEtleSB9ID0gZVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIHByb3BzLm9uQ2xpY2socHJvcHMuaWQsIHNoaWZ0S2V5LCBwcm9wcy5yb3cpXG4gICAgICB9fVxuICAgICAgb25DaGFuZ2U9eygpID0+IHt9fVxuICAgIC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50ID0+IHtcbiAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJUU2VsZWN0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcbiAgICB9XG5cbiAgICByb3dTZWxlY3Rvcihyb3cpIHtcbiAgICAgIGlmICghcm93IHx8ICFyb3cuaGFzT3duUHJvcGVydHkodGhpcy5wcm9wcy5rZXlGaWVsZCkpIHJldHVybiBudWxsXG4gICAgICBjb25zdCB7IHRvZ2dsZVNlbGVjdGlvbiwgc2VsZWN0VHlwZSwga2V5RmllbGQgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSB0aGlzLnByb3BzLmlzU2VsZWN0ZWQocm93W3RoaXMucHJvcHMua2V5RmllbGRdKVxuICAgICAgY29uc3QgaW5wdXRQcm9wcyA9IHtcbiAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgb25DbGljazogdG9nZ2xlU2VsZWN0aW9uLFxuICAgICAgICBzZWxlY3RUeXBlLFxuICAgICAgICBpZDogcm93W2tleUZpZWxkXSxcbiAgICAgICAgcm93LFxuICAgICAgfVxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5TZWxlY3RJbnB1dENvbXBvbmVudCwgaW5wdXRQcm9wcylcbiAgICB9XG5cbiAgICBoZWFkU2VsZWN0b3Iocm93KSB7XG4gICAgICBjb25zdCB7IHNlbGVjdFR5cGUgfSA9IHRoaXMucHJvcHNcbiAgICAgIGlmIChzZWxlY3RUeXBlID09PSAncmFkaW8nKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCB7IHRvZ2dsZUFsbCwgc2VsZWN0QWxsOiBjaGVja2VkLCBTZWxlY3RBbGxJbnB1dENvbXBvbmVudCB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgaW5wdXRQcm9wcyA9IHtcbiAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgb25DbGljazogdG9nZ2xlQWxsLFxuICAgICAgICBzZWxlY3RUeXBlLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3RBbGxJbnB1dENvbXBvbmVudCwgaW5wdXRQcm9wcylcbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIHNvIHdlIGNhbiBleHBvc2UgdGhlIHVuZGVybHlpbmcgUmVhY3RUYWJsZSB0byBnZXQgYXQgdGhlIHNvcnRlZERhdGEgZm9yIHNlbGVjdEFsbFxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSgpIHtcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRTZWxlY3RUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKVxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXG4gICAgICBlbHNlIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1uczogb3JpZ2luYWxDb2xzLFxuICAgICAgICBpc1NlbGVjdGVkLFxuICAgICAgICB0b2dnbGVTZWxlY3Rpb24sXG4gICAgICAgIHRvZ2dsZUFsbCxcbiAgICAgICAga2V5RmllbGQsXG4gICAgICAgIHNlbGVjdEFsbCxcbiAgICAgICAgc2VsZWN0VHlwZSxcbiAgICAgICAgc2VsZWN0V2lkdGgsXG4gICAgICAgIFNlbGVjdEFsbElucHV0Q29tcG9uZW50LFxuICAgICAgICBTZWxlY3RJbnB1dENvbXBvbmVudCxcbiAgICAgICAgLi4ucmVzdFxuICAgICAgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IHNlbGVjdCA9IHtcbiAgICAgICAgaWQ6ICdfc2VsZWN0b3InLFxuICAgICAgICBhY2Nlc3NvcjogKCkgPT4gJ3gnLCAvLyB0aGlzIHZhbHVlIGlzIG5vdCBpbXBvcnRhbnRcbiAgICAgICAgSGVhZGVyOiB0aGlzLmhlYWRTZWxlY3Rvci5iaW5kKHRoaXMpLFxuICAgICAgICBDZWxsOiBjaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucm93U2VsZWN0b3IuYmluZCh0aGlzKShjaS5vcmlnaW5hbClcbiAgICAgICAgfSxcbiAgICAgICAgd2lkdGg6IHNlbGVjdFdpZHRoIHx8IDMwLFxuICAgICAgICBmaWx0ZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgICBzdHlsZTogeyB0ZXh0QWxpZ246ICdjZW50ZXInIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBjb2x1bW5zID0gW3NlbGVjdCwgLi4ub3JpZ2luYWxDb2xzXVxuICAgICAgY29uc3QgZXh0cmEgPSB7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICB9XG4gICAgICByZXR1cm4gPENvbXBvbmVudCB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVFNlbGVjdFRhYmxlJ1xuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBrZXlGaWVsZDogJ19pZCcsXG4gICAgaXNTZWxlY3RlZDoga2V5ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdObyBpc1NlbGVjdGVkIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXkgfSlcbiAgICB9LFxuICAgIHNlbGVjdEFsbDogZmFsc2UsXG4gICAgdG9nZ2xlU2VsZWN0aW9uOiAoa2V5LCBzaGlmdCwgcm93KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gdG9nZ2xlU2VsZWN0aW9uIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXksIHNoaWZ0LCByb3cgfSlcbiAgICB9LFxuICAgIHRvZ2dsZUFsbDogKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ05vIHRvZ2dsZUFsbCBoYW5kbGVyIHByb3ZpZGVkLicpXG4gICAgfSxcbiAgICBzZWxlY3RUeXBlOiAnY2hlY2snLFxuICAgIFNlbGVjdElucHV0Q29tcG9uZW50OiBkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQsXG4gICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQ6IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCxcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVyXG59XG4iXX0=