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

exports.default = function (Component) {
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
    selectType: 'check',
    SelectInputComponent: defaultSelectInputComponent,
    SelectAllInputComponent: defaultSelectInputComponent
  };

  return wrapper;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50IiwicHJvcHMiLCJzZWxlY3RUeXBlIiwiY2hlY2tlZCIsInNoaWZ0S2V5IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm9uQ2xpY2siLCJpZCIsInJvdyIsIndyYXBwZXIiLCJoYXNPd25Qcm9wZXJ0eSIsImtleUZpZWxkIiwidG9nZ2xlU2VsZWN0aW9uIiwiaXNTZWxlY3RlZCIsImlucHV0UHJvcHMiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJTZWxlY3RJbnB1dENvbXBvbmVudCIsInRvZ2dsZUFsbCIsInNlbGVjdEFsbCIsIlNlbGVjdEFsbElucHV0Q29tcG9uZW50Iiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJvcmlnaW5hbENvbHMiLCJjb2x1bW5zIiwic2VsZWN0V2lkdGgiLCJyZXN0Iiwic2VsZWN0IiwiYWNjZXNzb3IiLCJIZWFkZXIiLCJoZWFkU2VsZWN0b3IiLCJiaW5kIiwiQ2VsbCIsInJvd1NlbGVjdG9yIiwiY2kiLCJvcmlnaW5hbCIsIndpZHRoIiwiZmlsdGVyYWJsZSIsInNvcnRhYmxlIiwicmVzaXphYmxlIiwic3R5bGUiLCJ0ZXh0QWxpZ24iLCJleHRyYSIsInIiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSIsImRlZmF1bHRQcm9wcyIsImxvZyIsImtleSIsInNoaWZ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OytlQUZBOztBQUlBLElBQU1BLDhCQUE4QixTQUE5QkEsMkJBQThCLFFBQVM7QUFDM0MsU0FDRTtBQUNFLFVBQU1DLE1BQU1DLFVBQU4sSUFBb0IsVUFENUI7QUFFRSxhQUFTRCxNQUFNRSxPQUZqQjtBQUdFLGFBQVMsb0JBQUs7QUFBQSxVQUNKQyxRQURJLEdBQ1NDLENBRFQsQ0FDSkQsUUFESTs7QUFFWkMsUUFBRUMsZUFBRjtBQUNBTCxZQUFNTSxPQUFOLENBQWNOLE1BQU1PLEVBQXBCLEVBQXdCSixRQUF4QixFQUFrQ0gsTUFBTVEsR0FBeEM7QUFDRCxLQVBIO0FBUUUsY0FBVSxvQkFBTSxDQUFFO0FBUnBCLElBREY7QUFZRCxDQWJEOztrQkFlZSxxQkFBYTtBQUMxQixNQUFNQztBQUFBOztBQUNKLDJCQUFZVCxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMkhBQ1hBLEtBRFc7QUFFbEI7O0FBSEc7QUFBQTtBQUFBLGtDQUtRUSxHQUxSLEVBS2E7QUFDZixZQUFJLENBQUNBLEdBQUQsSUFBUSxDQUFDQSxJQUFJRSxjQUFKLENBQW1CLEtBQUtWLEtBQUwsQ0FBV1csUUFBOUIsQ0FBYixFQUFzRCxPQUFPLElBQVA7QUFEdkMscUJBRW1DLEtBQUtYLEtBRnhDO0FBQUEsWUFFUFksZUFGTyxVQUVQQSxlQUZPO0FBQUEsWUFFVVgsVUFGVixVQUVVQSxVQUZWO0FBQUEsWUFFc0JVLFFBRnRCLFVBRXNCQSxRQUZ0Qjs7QUFHZixZQUFNVCxVQUFVLEtBQUtGLEtBQUwsQ0FBV2EsVUFBWCxDQUFzQkwsSUFBSSxLQUFLUixLQUFMLENBQVdXLFFBQWYsQ0FBdEIsQ0FBaEI7QUFDQSxZQUFNRyxhQUFhO0FBQ2pCWiwwQkFEaUI7QUFFakJJLG1CQUFTTSxlQUZRO0FBR2pCWCxnQ0FIaUI7QUFJakJNLGNBQUlDLElBQUlHLFFBQUosQ0FKYTtBQUtqQkg7QUFMaUIsU0FBbkI7QUFPQSxlQUFPTyxnQkFBTUMsYUFBTixDQUFvQixLQUFLaEIsS0FBTCxDQUFXaUIsb0JBQS9CLEVBQXFESCxVQUFyRCxDQUFQO0FBQ0Q7QUFqQkc7QUFBQTtBQUFBLG1DQW1CU04sR0FuQlQsRUFtQmM7QUFBQSxZQUNSUCxVQURRLEdBQ08sS0FBS0QsS0FEWixDQUNSQyxVQURROztBQUVoQixZQUFJQSxlQUFlLE9BQW5CLEVBQTRCLE9BQU8sSUFBUDs7QUFGWixzQkFJbUQsS0FBS0QsS0FKeEQ7QUFBQSxZQUlSa0IsU0FKUSxXQUlSQSxTQUpRO0FBQUEsWUFJY2hCLE9BSmQsV0FJR2lCLFNBSkg7QUFBQSxZQUl1QkMsdUJBSnZCLFdBSXVCQSx1QkFKdkI7O0FBS2hCLFlBQU1OLGFBQWE7QUFDakJaLDBCQURpQjtBQUVqQkksbUJBQVNZLFNBRlE7QUFHakJqQjtBQUhpQixTQUFuQjs7QUFNQSxlQUFPYyxnQkFBTUMsYUFBTixDQUFvQkksdUJBQXBCLEVBQTZDTixVQUE3QyxDQUFQO0FBQ0Q7O0FBRUQ7O0FBakNJO0FBQUE7QUFBQSwyQ0FrQ2lCO0FBQ25CLFlBQUksQ0FBQyxLQUFLTyxlQUFWLEVBQTJCQyxRQUFRQyxJQUFSLENBQWEscUNBQWI7QUFDM0IsWUFBSSxLQUFLRixlQUFMLENBQXFCRyxrQkFBekIsRUFBNkMsT0FBTyxLQUFLSCxlQUFMLENBQXFCRyxrQkFBckIsRUFBUCxDQUE3QyxLQUNLLE9BQU8sS0FBS0gsZUFBWjtBQUNOO0FBdENHO0FBQUE7QUFBQSwrQkF3Q0s7QUFBQTs7QUFBQSxzQkFhSCxLQUFLckIsS0FiRjtBQUFBLFlBRUl5QixZQUZKLFdBRUxDLE9BRks7QUFBQSxZQUdMYixVQUhLLFdBR0xBLFVBSEs7QUFBQSxZQUlMRCxlQUpLLFdBSUxBLGVBSks7QUFBQSxZQUtMTSxTQUxLLFdBS0xBLFNBTEs7QUFBQSxZQU1MUCxRQU5LLFdBTUxBLFFBTks7QUFBQSxZQU9MUSxTQVBLLFdBT0xBLFNBUEs7QUFBQSxZQVFMbEIsVUFSSyxXQVFMQSxVQVJLO0FBQUEsWUFTTDBCLFdBVEssV0FTTEEsV0FUSztBQUFBLFlBVUxQLHVCQVZLLFdBVUxBLHVCQVZLO0FBQUEsWUFXTEgsb0JBWEssV0FXTEEsb0JBWEs7QUFBQSxZQVlGVyxJQVpFOztBQWNQLFlBQU1DLFNBQVM7QUFDYnRCLGNBQUksV0FEUztBQUVidUIsb0JBQVU7QUFBQSxtQkFBTSxHQUFOO0FBQUEsV0FGRyxFQUVRO0FBQ3JCQyxrQkFBUSxLQUFLQyxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUhLO0FBSWJDLGdCQUFNLGtCQUFNO0FBQ1YsbUJBQU8sT0FBS0MsV0FBTCxDQUFpQkYsSUFBakIsU0FBNEJHLEdBQUdDLFFBQS9CLENBQVA7QUFDRCxXQU5ZO0FBT2JDLGlCQUFPWCxlQUFlLEVBUFQ7QUFRYlksc0JBQVksS0FSQztBQVNiQyxvQkFBVSxLQVRHO0FBVWJDLHFCQUFXLEtBVkU7QUFXYkMsaUJBQU8sRUFBRUMsV0FBVyxRQUFiO0FBWE0sU0FBZjtBQWFBLFlBQU1qQixXQUFXRyxNQUFYLDRCQUFzQkosWUFBdEIsRUFBTjtBQUNBLFlBQU1tQixRQUFRO0FBQ1psQjtBQURZLFNBQWQ7QUFHQSxlQUFPLDhCQUFDLFNBQUQsZUFBZUUsSUFBZixFQUF5QmdCLEtBQXpCLElBQWdDLEtBQUs7QUFBQSxtQkFBTSxPQUFLdkIsZUFBTCxHQUF1QndCLENBQTdCO0FBQUEsV0FBckMsSUFBUDtBQUNEO0FBeEVHOztBQUFBO0FBQUEsSUFBc0M5QixnQkFBTStCLFNBQTVDLENBQU47O0FBMkVBckMsVUFBUXNDLFdBQVIsR0FBc0IsZUFBdEI7QUFDQXRDLFVBQVF1QyxZQUFSLEdBQXVCO0FBQ3JCckMsY0FBVSxLQURXO0FBRXJCRSxnQkFBWSx5QkFBTztBQUNqQlMsY0FBUTJCLEdBQVIsQ0FBWSxpQ0FBWixFQUErQyxFQUFFQyxRQUFGLEVBQS9DO0FBQ0QsS0FKb0I7QUFLckIvQixlQUFXLEtBTFU7QUFNckJQLHFCQUFpQix5QkFBQ3NDLEdBQUQsRUFBTUMsS0FBTixFQUFhM0MsR0FBYixFQUFxQjtBQUNwQ2MsY0FBUTJCLEdBQVIsQ0FBWSxzQ0FBWixFQUFvRCxFQUFFQyxRQUFGLEVBQU9DLFlBQVAsRUFBYzNDLFFBQWQsRUFBcEQ7QUFDRCxLQVJvQjtBQVNyQlUsZUFBVyxxQkFBTTtBQUNmSSxjQUFRMkIsR0FBUixDQUFZLGdDQUFaO0FBQ0QsS0FYb0I7QUFZckJoRCxnQkFBWSxPQVpTO0FBYXJCZ0IsMEJBQXNCbEIsMkJBYkQ7QUFjckJxQiw2QkFBeUJyQjtBQWRKLEdBQXZCOztBQWlCQSxTQUFPVSxPQUFQO0FBQ0QsQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuY29uc3QgZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50ID0gcHJvcHMgPT4ge1xuICByZXR1cm4gKFxuICAgIDxpbnB1dFxuICAgICAgdHlwZT17cHJvcHMuc2VsZWN0VHlwZSB8fCAnY2hlY2tib3gnfVxuICAgICAgY2hlY2tlZD17cHJvcHMuY2hlY2tlZH1cbiAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICBjb25zdCB7IHNoaWZ0S2V5IH0gPSBlXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgcHJvcHMub25DbGljayhwcm9wcy5pZCwgc2hpZnRLZXksIHByb3BzLnJvdylcbiAgICAgIH19XG4gICAgICBvbkNoYW5nZT17KCkgPT4ge319XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQgPT4ge1xuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRTZWxlY3RUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKVxuICAgIH1cblxuICAgIHJvd1NlbGVjdG9yKHJvdykge1xuICAgICAgaWYgKCFyb3cgfHwgIXJvdy5oYXNPd25Qcm9wZXJ0eSh0aGlzLnByb3BzLmtleUZpZWxkKSkgcmV0dXJuIG51bGxcbiAgICAgIGNvbnN0IHsgdG9nZ2xlU2VsZWN0aW9uLCBzZWxlY3RUeXBlLCBrZXlGaWVsZCB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3QgY2hlY2tlZCA9IHRoaXMucHJvcHMuaXNTZWxlY3RlZChyb3dbdGhpcy5wcm9wcy5rZXlGaWVsZF0pXG4gICAgICBjb25zdCBpbnB1dFByb3BzID0ge1xuICAgICAgICBjaGVja2VkLFxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVTZWxlY3Rpb24sXG4gICAgICAgIHNlbGVjdFR5cGUsXG4gICAgICAgIGlkOiByb3dba2V5RmllbGRdLFxuICAgICAgICByb3csXG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLnByb3BzLlNlbGVjdElucHV0Q29tcG9uZW50LCBpbnB1dFByb3BzKVxuICAgIH1cblxuICAgIGhlYWRTZWxlY3Rvcihyb3cpIHtcbiAgICAgIGNvbnN0IHsgc2VsZWN0VHlwZSB9ID0gdGhpcy5wcm9wc1xuICAgICAgaWYgKHNlbGVjdFR5cGUgPT09ICdyYWRpbycpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IHsgdG9nZ2xlQWxsLCBzZWxlY3RBbGw6IGNoZWNrZWQsIFNlbGVjdEFsbElucHV0Q29tcG9uZW50IH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCBpbnB1dFByb3BzID0ge1xuICAgICAgICBjaGVja2VkLFxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVBbGwsXG4gICAgICAgIHNlbGVjdFR5cGUsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdEFsbElucHV0Q29tcG9uZW50LCBpbnB1dFByb3BzKVxuICAgIH1cblxuICAgIC8vIHRoaXMgaXMgc28gd2UgY2FuIGV4cG9zZSB0aGUgdW5kZXJseWluZyBSZWFjdFRhYmxlIHRvIGdldCBhdCB0aGUgc29ydGVkRGF0YSBmb3Igc2VsZWN0QWxsXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlKCkge1xuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgY29uc29sZS53YXJuKCdSVFNlbGVjdFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zOiBvcmlnaW5hbENvbHMsXG4gICAgICAgIGlzU2VsZWN0ZWQsXG4gICAgICAgIHRvZ2dsZVNlbGVjdGlvbixcbiAgICAgICAgdG9nZ2xlQWxsLFxuICAgICAgICBrZXlGaWVsZCxcbiAgICAgICAgc2VsZWN0QWxsLFxuICAgICAgICBzZWxlY3RUeXBlLFxuICAgICAgICBzZWxlY3RXaWR0aCxcbiAgICAgICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsXG4gICAgICAgIFNlbGVjdElucHV0Q29tcG9uZW50LFxuICAgICAgICAuLi5yZXN0XG4gICAgICB9ID0gdGhpcy5wcm9wc1xuICAgICAgY29uc3Qgc2VsZWN0ID0ge1xuICAgICAgICBpZDogJ19zZWxlY3RvcicsXG4gICAgICAgIGFjY2Vzc29yOiAoKSA9PiAneCcsIC8vIHRoaXMgdmFsdWUgaXMgbm90IGltcG9ydGFudFxuICAgICAgICBIZWFkZXI6IHRoaXMuaGVhZFNlbGVjdG9yLmJpbmQodGhpcyksXG4gICAgICAgIENlbGw6IGNpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yb3dTZWxlY3Rvci5iaW5kKHRoaXMpKGNpLm9yaWdpbmFsKVxuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogc2VsZWN0V2lkdGggfHwgMzAsXG4gICAgICAgIGZpbHRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgIHN0eWxlOiB7IHRleHRBbGlnbjogJ2NlbnRlcicgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbHVtbnMgPSBbc2VsZWN0LCAuLi5vcmlnaW5hbENvbHNdXG4gICAgICBjb25zdCBleHRyYSA9IHtcbiAgICAgICAgY29sdW1ucyxcbiAgICAgIH1cbiAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5yZXN0fSB7Li4uZXh0cmF9IHJlZj17ciA9PiAodGhpcy53cmFwcGVkSW5zdGFuY2UgPSByKX0gLz5cbiAgICB9XG4gIH1cblxuICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gJ1JUU2VsZWN0VGFibGUnXG4gIHdyYXBwZXIuZGVmYXVsdFByb3BzID0ge1xuICAgIGtleUZpZWxkOiAnX2lkJyxcbiAgICBpc1NlbGVjdGVkOiBrZXkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ05vIGlzU2VsZWN0ZWQgaGFuZGxlciBwcm92aWRlZDonLCB7IGtleSB9KVxuICAgIH0sXG4gICAgc2VsZWN0QWxsOiBmYWxzZSxcbiAgICB0b2dnbGVTZWxlY3Rpb246IChrZXksIHNoaWZ0LCByb3cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdObyB0b2dnbGVTZWxlY3Rpb24gaGFuZGxlciBwcm92aWRlZDonLCB7IGtleSwgc2hpZnQsIHJvdyB9KVxuICAgIH0sXG4gICAgdG9nZ2xlQWxsOiAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gdG9nZ2xlQWxsIGhhbmRsZXIgcHJvdmlkZWQuJylcbiAgICB9LFxuICAgIHNlbGVjdFR5cGU6ICdjaGVjaycsXG4gICAgU2VsZWN0SW5wdXRDb21wb25lbnQ6IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCxcbiAgICBTZWxlY3RBbGxJbnB1dENvbXBvbmVudDogZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50LFxuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXJcbn1cbiJdfQ==