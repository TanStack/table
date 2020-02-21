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
          row: row,
          id: 'select-' + row[keyField]
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
          selectType: selectType,
          id: 'select-all'
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

        var columns = options !== undefined && options.floatingLeft === true ? [].concat(_toConsumableArray(originalCols), [select]) : [select].concat(_toConsumableArray(originalCols));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2Mvc2VsZWN0VGFibGUvaW5kZXguanMiXSwibmFtZXMiOlsiZGVmYXVsdFNlbGVjdElucHV0Q29tcG9uZW50IiwicHJvcHMiLCJzZWxlY3RUeXBlIiwiY2hlY2tlZCIsImlkIiwic2hpZnRLZXkiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwib25DbGljayIsInJvdyIsIkNvbXBvbmVudCIsIm9wdGlvbnMiLCJ3cmFwcGVyIiwiaGFzT3duUHJvcGVydHkiLCJrZXlGaWVsZCIsInRvZ2dsZVNlbGVjdGlvbiIsImlzU2VsZWN0ZWQiLCJpbnB1dFByb3BzIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiU2VsZWN0SW5wdXRDb21wb25lbnQiLCJ0b2dnbGVBbGwiLCJzZWxlY3RBbGwiLCJTZWxlY3RBbGxJbnB1dENvbXBvbmVudCIsIndyYXBwZWRJbnN0YW5jZSIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0V3JhcHBlZEluc3RhbmNlIiwib3JpZ2luYWxDb2xzIiwiY29sdW1ucyIsInNlbGVjdFdpZHRoIiwicmVzdCIsInNlbGVjdCIsImFjY2Vzc29yIiwiSGVhZGVyIiwiaGVhZFNlbGVjdG9yIiwiYmluZCIsIkNlbGwiLCJyb3dTZWxlY3RvciIsImNpIiwib3JpZ2luYWwiLCJ3aWR0aCIsImZpbHRlcmFibGUiLCJzb3J0YWJsZSIsInJlc2l6YWJsZSIsInN0eWxlIiwidGV4dEFsaWduIiwidW5kZWZpbmVkIiwiZmxvYXRpbmdMZWZ0IiwiZXh0cmEiLCJyIiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJsb2ciLCJrZXkiLCJzaGlmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7OzsrZUFGQTs7QUFJQSxJQUFNQSw4QkFBOEIsU0FBOUJBLDJCQUE4QixRQUFTO0FBQzNDLFNBQ0U7QUFDRSxVQUFNQyxNQUFNQyxVQUFOLElBQW9CLFVBRDVCO0FBRUUsbUJBQWVELE1BQU1FLE9BQU4sR0FBZ0IsV0FBaEIsR0FB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NEIsR0FBUixDQUFZLHNDQUFaLEVBQW9ELEVBQUVDLFFBQUYsRUFBT0MsWUFBUCxFQUFjOUMsUUFBZCxFQUFwRDtBQUNELEtBUm9CO0FBU3JCWSxlQUFXLHFCQUFNO0FBQ2ZJLGNBQVE0QixHQUFSLENBQVksZ0NBQVo7QUFDRCxLQVhvQjtBQVlyQm5ELGdCQUFZLFVBWlM7QUFhckJrQiwwQkFBc0JwQiwyQkFiRDtBQWNyQnVCLDZCQUF5QnZCO0FBZEosR0FBdkI7O0FBaUJBLFNBQU9ZLE9BQVA7QUFDRCxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQgPSBwcm9wcyA9PiB7XG4gIHJldHVybiAoXG4gICAgPGlucHV0XG4gICAgICB0eXBlPXtwcm9wcy5zZWxlY3RUeXBlIHx8ICdjaGVja2JveCd9XG4gICAgICBhcmlhLWxhYmVsPXtgJHtwcm9wcy5jaGVja2VkID8gJ1VuLXNlbGVjdCc6J1NlbGVjdCd9IHJvdyB3aXRoIGlkOiR7cHJvcHMuaWR9YCB9XG4gICAgICBjaGVja2VkPXtwcm9wcy5jaGVja2VkfVxuICAgICAgaWQ9e3Byb3BzLmlkfVxuICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgIGNvbnN0IHsgc2hpZnRLZXkgfSA9IGVcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBwcm9wcy5vbkNsaWNrKHByb3BzLmlkLCBzaGlmdEtleSwgcHJvcHMucm93KVxuICAgICAgfX1cbiAgICAgIG9uQ2hhbmdlPXsoKSA9PiB7fX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IChDb21wb25lbnQsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qgd3JhcHBlciA9IGNsYXNzIFJUU2VsZWN0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcbiAgICB9XG5cbiAgICByb3dTZWxlY3Rvcihyb3cpIHtcbiAgICAgIGlmICghcm93IHx8ICFyb3cuaGFzT3duUHJvcGVydHkodGhpcy5wcm9wcy5rZXlGaWVsZCkpIHJldHVybiBudWxsXG4gICAgICBjb25zdCB7IHRvZ2dsZVNlbGVjdGlvbiwgc2VsZWN0VHlwZSwga2V5RmllbGQgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSB0aGlzLnByb3BzLmlzU2VsZWN0ZWQocm93W3RoaXMucHJvcHMua2V5RmllbGRdKVxuICAgICAgY29uc3QgaW5wdXRQcm9wcyA9IHtcbiAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgb25DbGljazogdG9nZ2xlU2VsZWN0aW9uLFxuICAgICAgICBzZWxlY3RUeXBlLFxuICAgICAgICByb3csXG4gICAgICAgIGlkOiBgc2VsZWN0LSR7cm93W2tleUZpZWxkXX1gXG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLnByb3BzLlNlbGVjdElucHV0Q29tcG9uZW50LCBpbnB1dFByb3BzKVxuICAgIH1cblxuICAgIGhlYWRTZWxlY3Rvcihyb3cpIHtcbiAgICAgIGNvbnN0IHsgc2VsZWN0VHlwZSB9ID0gdGhpcy5wcm9wc1xuICAgICAgaWYgKHNlbGVjdFR5cGUgPT09ICdyYWRpbycpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IHsgdG9nZ2xlQWxsLCBzZWxlY3RBbGw6IGNoZWNrZWQsIFNlbGVjdEFsbElucHV0Q29tcG9uZW50IH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCBpbnB1dFByb3BzID0ge1xuICAgICAgICBjaGVja2VkLFxuICAgICAgICBvbkNsaWNrOiB0b2dnbGVBbGwsXG4gICAgICAgIHNlbGVjdFR5cGUsXG4gICAgICAgIGlkOiAnc2VsZWN0LWFsbCdcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0QWxsSW5wdXRDb21wb25lbnQsIGlucHV0UHJvcHMpXG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyBzbyB3ZSBjYW4gZXhwb3NlIHRoZSB1bmRlcmx5aW5nIFJlYWN0VGFibGUgdG8gZ2V0IGF0IHRoZSBzb3J0ZWREYXRhIGZvciBzZWxlY3RBbGxcbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UoKSB7XG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSBjb25zb2xlLndhcm4oJ1JUU2VsZWN0VGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJylcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgZWxzZSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHVtbnM6IG9yaWdpbmFsQ29scyxcbiAgICAgICAgaXNTZWxlY3RlZCxcbiAgICAgICAgdG9nZ2xlU2VsZWN0aW9uLFxuICAgICAgICB0b2dnbGVBbGwsXG4gICAgICAgIGtleUZpZWxkLFxuICAgICAgICBzZWxlY3RBbGwsXG4gICAgICAgIHNlbGVjdFR5cGUsXG4gICAgICAgIHNlbGVjdFdpZHRoLFxuICAgICAgICBTZWxlY3RBbGxJbnB1dENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0SW5wdXRDb21wb25lbnQsXG4gICAgICAgIC4uLnJlc3RcbiAgICAgIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCBzZWxlY3QgPSB7XG4gICAgICAgIGlkOiAnX3NlbGVjdG9yJyxcbiAgICAgICAgYWNjZXNzb3I6ICgpID0+ICd4JywgLy8gdGhpcyB2YWx1ZSBpcyBub3QgaW1wb3J0YW50XG4gICAgICAgIEhlYWRlcjogdGhpcy5oZWFkU2VsZWN0b3IuYmluZCh0aGlzKSxcbiAgICAgICAgQ2VsbDogY2kgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJvd1NlbGVjdG9yLmJpbmQodGhpcykoY2kub3JpZ2luYWwpXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiBzZWxlY3RXaWR0aCB8fCAzMCxcbiAgICAgICAgZmlsdGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgc3R5bGU6IHsgdGV4dEFsaWduOiAnY2VudGVyJyB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb2x1bW5zID0gKG9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmZsb2F0aW5nTGVmdCA9PT0gdHJ1ZSkgPyBbLi4ub3JpZ2luYWxDb2xzLCBzZWxlY3RdIDogW3NlbGVjdCwgLi4ub3JpZ2luYWxDb2xzXVxuICAgICAgY29uc3QgZXh0cmEgPSB7XG4gICAgICAgIGNvbHVtbnMsXG4gICAgICB9XG4gICAgICByZXR1cm4gPENvbXBvbmVudCB7Li4ucmVzdH0gey4uLmV4dHJhfSByZWY9e3IgPT4gKHRoaXMud3JhcHBlZEluc3RhbmNlID0gcil9IC8+XG4gICAgfVxuICB9XG5cbiAgd3JhcHBlci5kaXNwbGF5TmFtZSA9ICdSVFNlbGVjdFRhYmxlJ1xuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBrZXlGaWVsZDogJ19pZCcsXG4gICAgaXNTZWxlY3RlZDoga2V5ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdObyBpc1NlbGVjdGVkIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXkgfSlcbiAgICB9LFxuICAgIHNlbGVjdEFsbDogZmFsc2UsXG4gICAgdG9nZ2xlU2VsZWN0aW9uOiAoa2V5LCBzaGlmdCwgcm93KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gdG9nZ2xlU2VsZWN0aW9uIGhhbmRsZXIgcHJvdmlkZWQ6JywgeyBrZXksIHNoaWZ0LCByb3cgfSlcbiAgICB9LFxuICAgIHRvZ2dsZUFsbDogKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ05vIHRvZ2dsZUFsbCBoYW5kbGVyIHByb3ZpZGVkLicpXG4gICAgfSxcbiAgICBzZWxlY3RUeXBlOiAnY2hlY2tib3gnLFxuICAgIFNlbGVjdElucHV0Q29tcG9uZW50OiBkZWZhdWx0U2VsZWN0SW5wdXRDb21wb25lbnQsXG4gICAgU2VsZWN0QWxsSW5wdXRDb21wb25lbnQ6IGRlZmF1bHRTZWxlY3RJbnB1dENvbXBvbmVudCxcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVyXG59XG4iXX0=