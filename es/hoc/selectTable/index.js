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
    'aria-label': (props.checked ? 'Un-select' : 'Select') + ' row with id:' + props.id,
    checked: props.checked,
    id: props.id,
    onClick: function onClick(e) {
      var shiftKey = e.shiftKey;

      e.stopPropagation();
      props.onClick(props.id, shiftKey, props.row);
    },
    onChange: function onChange() {}
  });
};

export default (function (Component, options) {
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
          row: row,
          id: 'select-' + row[keyField]
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
          selectType: selectType,
          id: 'select-all'
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

        var columns = options !== undefined && options.floatingLeft === true ? [].concat(_toConsumableArray(originalCols), [select]) : [select].concat(_toConsumableArray(originalCols));
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
    selectType: 'checkbox',
    SelectInputComponent: defaultSelectInputComponent,
    SelectAllInputComponent: defaultSelectInputComponent
  };

  return wrapper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiUmVhY3QiLCJkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQiLCJwcm9wcyIsInNlbGVjdFR5cGUiLCJjaGVja2VkIiwiaWQiLCJzaGlmdEtleSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJvbkNsaWNrIiwicm93IiwiQ29tcG9uZW50Iiwib3B0aW9ucyIsIndyYXBwZXIiLCJoYXNPd25Qcm9wZXJ0eSIsImtleUZpZWxkIiwidG9nZ2xlU2VsZWN0aW9uIiwiaXNTZWxlY3RlZCIsImlucHV0UHJvcHMiLCJjcmVhdGVFbGVtZW50IiwiU2VsZWN0SW5wdXRDb21wb25lbnQiLCJ0b2dnbGVBbGwiLCJzZWxlY3RBbGwiLCJTZWxlY3RBbGxJbnB1dENvbXBvbmVudCIsIndyYXBwZWRJbnN0YW5jZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwib3JpZ2luYWxDb2xzIiwiY29sdW1ucyIsInNlbGVjdFdpZHRoIiwicmVzdCIsInNlbGVjdCIsImFjY2Vzc29yIiwiSGVhZGVyIiwiaGVhZFNlbGVjdG9yIiwiYmluZCIsIkNlbGwiLCJyb3dTZWxlY3RvciIsImNpIiwib3JpZ2luYWwiLCJ3aWR0aCIsImZpbHRlcmFibGUiLCJzb3J0YWJsZSIsInJlc2l6YWJsZSIsInN0eWxlIiwidGV4dEFsaWduIiwidW5kZWZpbmVkIiwiZmxvYXRpbmdMZWZ0IiwiZXh0cmEiLCJyIiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJsb2ciLCJrZXkiLCJzaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCOztBQUVBLElBQU1DLDhCQUE4QixTQUE5QkEsMkJBQThCLFFBQVM7QUFDM0MsU0FDRTtBQUNFLFVBQU1DLE1BQU1DLFVBQU4sSUFBb0IsVUFENUI7QUFFRSxtQkFBZUQsTUFBTUUsT0FBTixH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RUFBYTdDLEdBQWIsRUFBcUI7QUFDcENlLGNBQVE0QixHQUFSLENBQVksc0NBQVosRUFBb0QsRUFBRUMsUUFBRixFQUFPQyxZQUFQLEVBQWM3QyxRQUFkLEVBQXBEO0FBQ0QsS0FSb0I7QUFTckJXLGVBQVcscUJBQU07QUFDZkksY0FBUTRCLEdBQVIsQ0FBWSxnQ0FBWjtBQUNELEtBWG9CO0FBWXJCbEQsZ0JBQVksVUFaUztBQWFyQmlCLDBCQUFzQm5CLDJCQWJEO0FBY3JCc0IsNkJBQXlCdEI7QUFkSixHQUF2Qjs7QUFpQkEsU0FBT1ksT0FBUDtBQUNELENBakdEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmNvbnN0IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCA9IHByb3BzID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGlucHV0XHJcbiAgICAgIHR5cGU9e3Byb3BzLnNlbGVjdFR5cGUgfHwgJ2NoZWNrYm94J31cclxuICAgICAgYXJpYS1sYWJlbD17YCR7cHJvcHMuY2hlY2tlZCA/ICdVbi1zZWxlY3QnOidTZWxlY3QnfSByb3cgd2l0aCBpZDoke3Byb3BzLmlkfWAgfVxyXG4gICAgICBjaGVja2VkPXtwcm9wcy5jaGVja2VkfVxyXG4gICAgICBpZD17cHJvcHMuaWR9XHJcbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgc2hpZnRLZXkgfSA9IGVcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgcHJvcHMub25DbGljayhwcm9wcy5pZCwgc2hpZnRLZXksIHByb3BzLnJvdylcclxuICAgICAgfX1cclxuICAgICAgb25DaGFuZ2U9eygpID0+IHt9fVxyXG4gICAgLz5cclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChDb21wb25lbnQsIG9wdGlvbnMpID0+IHtcclxuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRTZWxlY3RUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICBzdXBlcihwcm9wcylcclxuICAgIH1cclxuXHJcbiAgICByb3dTZWxlY3Rvcihyb3cpIHtcclxuICAgICAgaWYgKCFyb3cgfHwgIXJvdy5oYXNPd25Qcm9wZXJ0eSh0aGlzLnByb3BzLmtleUZpZWxkKSkgcmV0dXJuIG51bGxcclxuICAgICAgY29uc3QgeyB0b2dnbGVTZWxlY3Rpb24sIHNlbGVjdFR5cGUsIGtleUZpZWxkIH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSB0aGlzLnByb3BzLmlzU2VsZWN0ZWQocm93W3RoaXMucHJvcHMua2V5RmllbGRdKVxyXG4gICAgICBjb25zdCBpbnB1dFByb3BzID0ge1xyXG4gICAgICAgIGNoZWNrZWQsXHJcbiAgICAgICAgb25DbGljazogdG9nZ2xlU2VsZWN0aW9uLFxyXG4gICAgICAgIHNlbGVjdFR5cGUsXHJcbiAgICAgICAgcm93LFxyXG4gICAgICAgIGlkOiBgc2VsZWN0LSR7cm93W2tleUZpZWxkXX1gXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy5TZWxlY3RJbnB1dENvbXBvbmVudCwgaW5wdXRQcm9wcylcclxuICAgIH1cclxuXHJcbiAgICBoZWFkU2VsZWN0b3Iocm93KSB7XHJcbiAgICAgIGNvbnN0IHsgc2VsZWN0VHlwZSB9ID0gdGhpcy5wcm9wc1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSA9PT0gJ3JhZGlvJykgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IHsgdG9nZ2xlQWxsLCBzZWxlY3RBbGw6IGNoZWNrZWQsIFNlbGVjdEFsbElucHV0Q29tcG9uZW50IH0gPSB0aGlzLnByb3BzXHJcbiAgICAgIGNvbnN0IGlucHV0UHJvcHMgPSB7XHJcbiAgICAgICAgY2hlY2tlZCxcclxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVBbGwsXHJcbiAgICAgICAgc2VsZWN0VHlwZSxcclxuICAgICAgICBpZDogJ3NlbGVjdC1hbGwnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdEFsbElucHV0Q29tcG9uZW50LCBpbnB1dFByb3BzKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMgaXMgc28gd2UgY2FuIGV4cG9zZSB0aGUgdW5kZXJseWluZyBSZWFjdFRhYmxlIHRvIGdldCBhdCB0aGUgc29ydGVkRGF0YSBmb3Igc2VsZWN0QWxsXHJcbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UoKSB7XHJcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRTZWxlY3RUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKVxyXG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcclxuICAgICAgZWxzZSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zOiBvcmlnaW5hbENvbHMsXHJcbiAgICAgICAgaXNTZWxlY3RlZCxcclxuICAgICAgICB0b2dnbGVTZWxlY3Rpb24sXHJcbiAgICAgICAgdG9nZ2xlQWxsLFxyXG4gICAgICAgIGtleUZpZWxkLFxyXG4gICAgICAgIHNlbGVjdEFsbCxcclxuICAgICAgICBzZWxlY3RUeXBlLFxyXG4gICAgICAgIHNlbGVjdFdpZHRoLFxyXG4gICAgICAgIFNlbGVjdEFsbElucHV0Q29tcG9uZW50LFxyXG4gICAgICAgIFNlbGVjdElucHV0Q29tcG9uZW50LFxyXG4gICAgICAgIC4uLnJlc3RcclxuICAgICAgfSA9IHRoaXMucHJvcHNcclxuICAgICAgY29uc3Qgc2VsZWN0ID0ge1xyXG4gICAgICAgIGlkOiAnX3NlbGVjdG9yJyxcclxuICAgICAgICBhY2Nlc3NvcjogKCkgPT4gJ3gnLCAvLyB0aGlzIHZhbHVlIGlzIG5vdCBpbXBvcnRhbnRcclxuICAgICAgICBIZWFkZXI6IHRoaXMuaGVhZFNlbGVjdG9yLmJpbmQodGhpcyksXHJcbiAgICAgICAgQ2VsbDogY2kgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucm93U2VsZWN0b3IuYmluZCh0aGlzKShjaS5vcmlnaW5hbClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdpZHRoOiBzZWxlY3RXaWR0aCB8fCAzMCxcclxuICAgICAgICBmaWx0ZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcclxuICAgICAgICBzdHlsZTogeyB0ZXh0QWxpZ246ICdjZW50ZXInIH0sXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGNvbHVtbnMgPSAob3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZmxvYXRpbmdMZWZ0ID09PSB0cnVlKSA/IFsuLi5vcmlnaW5hbENvbHMsIHNlbGVjdF0gOiBbc2VsZWN0LCAuLi5vcmlnaW5hbENvbHNdXHJcbiAgICAgIGNvbnN0IGV4dHJhID0ge1xyXG4gICAgICAgIGNvbHVtbnMsXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVFNlbGVjdFRhYmxlJ1xyXG4gIHdyYXBwZXIuZGVmYXVsdFByb3BzID0ge1xyXG4gICAga2V5RmllbGQ6ICdfaWQnLFxyXG4gICAgaXNTZWxlY3RlZDoga2V5ID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ05vIGlzU2VsZWN0ZWQgaGFuZGxlciBwcm92aWRlZDonLCB7IGtleSB9KVxyXG4gICAgfSxcclxuICAgIHNlbGVjdEFsbDogZmFsc2UsXHJcbiAgICB0b2dnbGVTZWxlY3Rpb246IChrZXksIHNoaWZ0LCByb3cpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ05vIHRvZ2dsZVNlbGVjdGlvbiBoYW5kbGVyIHByb3ZpZGVkOicsIHsga2V5LCBzaGlmdCwgcm93IH0pXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlQWxsOiAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyB0b2dnbGVBbGwgaGFuZGxlciBwcm92aWRlZC4nKVxyXG4gICAgfSxcclxuICAgIHNlbGVjdFR5cGU6ICdjaGVja2JveCcsXHJcbiAgICBTZWxlY3RJbnB1dENvbXBvbmVudDogZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50LFxyXG4gICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQ6IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCxcclxuICB9XHJcblxyXG4gIHJldHVybiB3cmFwcGVyXHJcbn1cclxuIl19