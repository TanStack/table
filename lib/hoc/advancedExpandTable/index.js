'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.advancedExpandTableHOC = exports.columnsWithToggle = exports.subComponentWithToggle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  AvancedExpandTableHOC for ReactTable

  HOC which allows any Cell in the row to toggle the row's
  SubComponent. Also allows the SubComponent to toggle itself.

  Expand functions available to any SubComponent or Column Cell:
    toggleRowSubComponent
    showRowSubComponent
    hideRowSubComponent

  Each Column Renderer (E.g. Cell ) gets the expand functions in its props
  And Each SubComponent gets the expand functions in its props

  Expand functions takes the `rowInfo` given to each
  Column Renderer and SubComponent already by ReactTable.
*/

var subComponentWithToggle = exports.subComponentWithToggle = function subComponentWithToggle(SubComponent, expandFuncs) {
  return function (props) {
    return _react2.default.createElement(SubComponent, _extends({}, props, expandFuncs));
  };
};

// each cell in the column gets passed the function to toggle a sub component
var columnsWithToggle = exports.columnsWithToggle = function columnsWithToggle(columns, expandFuncs) {
  return columns.map(function (column) {
    if (column.columns) {
      return _extends({}, column, {
        columns: columnsWithToggle(column.columns, expandFuncs)
      });
    }
    return _extends({}, column, {
      getProps: function getProps() {
        return _extends({}, expandFuncs);
      }
    });
  });
};

var advancedExpandTableHOC = function advancedExpandTableHOC(TableComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(AdvancedExpandTable, _Component);

    function AdvancedExpandTable(props) {
      _classCallCheck(this, AdvancedExpandTable);

      var _this = _possibleConstructorReturn(this, (AdvancedExpandTable.__proto__ || Object.getPrototypeOf(AdvancedExpandTable)).call(this, props));

      _this.state = {
        expanded: {}
      };
      _this.toggleRowSubComponent = _this.toggleRowSubComponent.bind(_this);
      _this.showRowSubComponent = _this.showRowSubComponent.bind(_this);
      _this.hideRowSubComponent = _this.hideRowSubComponent.bind(_this);
      _this.getTdProps = _this.getTdProps.bind(_this);
      _this.fireOnExpandedChange = _this.fireOnExpandedChange.bind(_this);
      _this.expandFuncs = {
        toggleRowSubComponent: _this.toggleRowSubComponent,
        showRowSubComponent: _this.showRowSubComponent,
        hideRowSubComponent: _this.hideRowSubComponent
      };
      return _this;
    }

    // after initial render if we get new
    // data, columns, page changes, etc.
    // we reset expanded state.


    _createClass(AdvancedExpandTable, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        this.setState({
          expanded: {}
        });
      }
    }, {
      key: 'fireOnExpandedChange',
      value: function fireOnExpandedChange(rowInfo, e) {
        // fire callback once state has changed.
        if (this.props.onExpandedChange) {
          this.props.onExpandedChange(rowInfo, e);
        }
      }
    }, {
      key: 'resolveNewTableState',
      value: function resolveNewTableState(rowInfoOrNestingPath, e, expandType) {
        var _this2 = this;

        // derive nestingPath if only rowInfo is passed
        var nestingPath = rowInfoOrNestingPath;

        if (rowInfoOrNestingPath.nestingPath) {
          nestingPath = rowInfoOrNestingPath.nestingPath;
        }

        this.setState(function (prevState) {
          var isExpanded = (0, _lodash4.default)(prevState.expanded, nestingPath);
          // since we do not support nested rows, a shallow clone is okay.
          var newExpanded = _extends({}, prevState.expanded);

          switch (expandType) {
            case 'show':
              (0, _lodash2.default)(newExpanded, nestingPath, {});
              break;
            case 'hide':
              (0, _lodash2.default)(newExpanded, nestingPath, false);
              break;
            default:
              // toggle
              (0, _lodash2.default)(newExpanded, nestingPath, isExpanded ? false : {});
          }
          return _extends({}, prevState, {
            expanded: newExpanded
          });
        }, function () {
          return _this2.fireOnExpandedChange(rowInfoOrNestingPath, e);
        });
      }
    }, {
      key: 'toggleRowSubComponent',
      value: function toggleRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e);
      }
    }, {
      key: 'showRowSubComponent',
      value: function showRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'show');
      }
    }, {
      key: 'hideRowSubComponent',
      value: function hideRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'hide');
      }
    }, {
      key: 'getTdProps',
      value: function getTdProps(tableState, rowInfo, column) {
        var _this3 = this;

        var expander = column.expander;


        if (!expander) {
          // no overrides
          return {};
        }

        return {
          // only override onClick for column Td
          onClick: function onClick(e) {
            _this3.toggleRowSubComponent(rowInfo, e);
          }
        };
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        if (!this.wrappedInstance) {
          console.warn('AdvancedExpandTable - No wrapped instance');
        }
        if (this.wrappedInstance.getWrappedInstance) {
          return this.wrappedInstance.getWrappedInstance();
        }
        return this.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            columns = _props.columns,
            SubComponent = _props.SubComponent,
            onExpandedChange = _props.onExpandedChange,
            rest = _objectWithoutProperties(_props, ['columns', 'SubComponent', 'onExpandedChange']);

        var wrappedColumns = columnsWithToggle(columns, this.expandFuncs);
        var WrappedSubComponent = subComponentWithToggle(SubComponent, this.expandFuncs);

        return _react2.default.createElement(TableComponent, _extends({}, rest, {
          columns: wrappedColumns,
          expanded: this.state.expanded,
          getTdProps: this.getTdProps,
          SubComponent: WrappedSubComponent,
          TdComponent: AdvancedExpandTable.TdComponent
        }));
      }
    }], [{
      key: 'TdComponent',


      // since we pass the expand functions to each Cell,
      // we need to filter it out from being passed as an
      // actual DOM attribute. See getProps in columnsWithToggle above.
      value: function TdComponent(_ref) {
        var toggleRowSubComponent = _ref.toggleRowSubComponent,
            showRowSubComponent = _ref.showRowSubComponent,
            hideRowSubComponent = _ref.hideRowSubComponent,
            rest = _objectWithoutProperties(_ref, ['toggleRowSubComponent', 'showRowSubComponent', 'hideRowSubComponent']);

        return _react2.default.createElement(TableComponent.defaultProps.TdComponent, rest);
      }
    }]);

    return AdvancedExpandTable;
  }(_react.Component), _class.propTypes = {
    columns: _propTypes2.default.array.isRequired,
    SubComponent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]).isRequired,
    onExpandedChange: _propTypes2.default.func
  }, _class.defaultProps = {
    onExpandedChange: null
  }, _class.DisplayName = 'AdvancedExpandTable', _temp;
};
exports.advancedExpandTableHOC = advancedExpandTableHOC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJzdWJDb21wb25lbnRXaXRoVG9nZ2xlIiwiU3ViQ29tcG9uZW50IiwiZXhwYW5kRnVuY3MiLCJwcm9wcyIsImNvbHVtbnNXaXRoVG9nZ2xlIiwiY29sdW1ucyIsIm1hcCIsImNvbHVtbiIsImdldFByb3BzIiwiYWR2YW5jZWRFeHBhbmRUYWJsZUhPQyIsInN0YXRlIiwiZXhwYW5kZWQiLCJ0b2dnbGVSb3dTdWJDb21wb25lbnQiLCJiaW5kIiwic2hvd1Jvd1N1YkNvbXBvbmVudCIsImhpZGVSb3dTdWJDb21wb25lbnQiLCJnZXRUZFByb3BzIiwiZmlyZU9uRXhwYW5kZWRDaGFuZ2UiLCJzZXRTdGF0ZSIsInJvd0luZm8iLCJlIiwib25FeHBhbmRlZENoYW5nZSIsInJvd0luZm9Pck5lc3RpbmdQYXRoIiwiZXhwYW5kVHlwZSIsIm5lc3RpbmdQYXRoIiwiaXNFeHBhbmRlZCIsInByZXZTdGF0ZSIsIm5ld0V4cGFuZGVkIiwicmVzb2x2ZU5ld1RhYmxlU3RhdGUiLCJ0YWJsZVN0YXRlIiwiZXhwYW5kZXIiLCJvbkNsaWNrIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJyZXN0Iiwid3JhcHBlZENvbHVtbnMiLCJXcmFwcGVkU3ViQ29tcG9uZW50IiwiQWR2YW5jZWRFeHBhbmRUYWJsZSIsIlRkQ29tcG9uZW50IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25lT2ZUeXBlIiwiZnVuYyIsImVsZW1lbnQiLCJkZWZhdWx0UHJvcHMiLCJEaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JPLElBQU1BLDBE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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgc2V0IGZyb20gJ2xvZGFzaC5zZXQnXG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnXG5cbi8qXG4gIEF2YW5jZWRFeHBhbmRUYWJsZUhPQyBmb3IgUmVhY3RUYWJsZVxuXG4gIEhPQyB3aGljaCBhbGxvd3MgYW55IENlbGwgaW4gdGhlIHJvdyB0byB0b2dnbGUgdGhlIHJvdydzXG4gIFN1YkNvbXBvbmVudC4gQWxzbyBhbGxvd3MgdGhlIFN1YkNvbXBvbmVudCB0byB0b2dnbGUgaXRzZWxmLlxuXG4gIEV4cGFuZCBmdW5jdGlvbnMgYXZhaWxhYmxlIHRvIGFueSBTdWJDb21wb25lbnQgb3IgQ29sdW1uIENlbGw6XG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50XG4gICAgc2hvd1Jvd1N1YkNvbXBvbmVudFxuICAgIGhpZGVSb3dTdWJDb21wb25lbnRcblxuICBFYWNoIENvbHVtbiBSZW5kZXJlciAoRS5nLiBDZWxsICkgZ2V0cyB0aGUgZXhwYW5kIGZ1bmN0aW9ucyBpbiBpdHMgcHJvcHNcbiAgQW5kIEVhY2ggU3ViQ29tcG9uZW50IGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXG5cbiAgRXhwYW5kIGZ1bmN0aW9ucyB0YWtlcyB0aGUgYHJvd0luZm9gIGdpdmVuIHRvIGVhY2hcbiAgQ29sdW1uIFJlbmRlcmVyIGFuZCBTdWJDb21wb25lbnQgYWxyZWFkeSBieSBSZWFjdFRhYmxlLlxuKi9cblxuZXhwb3J0IGNvbnN0IHN1YkNvbXBvbmVudFdpdGhUb2dnbGUgPSAoU3ViQ29tcG9uZW50LCBleHBhbmRGdW5jcykgPT4gcHJvcHMgPT4gKFxuICA8U3ViQ29tcG9uZW50IHsuLi5wcm9wc30gey4uLmV4cGFuZEZ1bmNzfSAvPlxuKVxuXG4vLyBlYWNoIGNlbGwgaW4gdGhlIGNvbHVtbiBnZXRzIHBhc3NlZCB0aGUgZnVuY3Rpb24gdG8gdG9nZ2xlIGEgc3ViIGNvbXBvbmVudFxuZXhwb3J0IGNvbnN0IGNvbHVtbnNXaXRoVG9nZ2xlID0gKGNvbHVtbnMsIGV4cGFuZEZ1bmNzKSA9PlxuICBjb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xuICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zV2l0aFRvZ2dsZShjb2x1bW4uY29sdW1ucywgZXhwYW5kRnVuY3MpLFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgLi4uY29sdW1uLFxuICAgICAgZ2V0UHJvcHMgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmV4cGFuZEZ1bmNzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSlcblxuZXhwb3J0IGNvbnN0IGFkdmFuY2VkRXhwYW5kVGFibGVIT0MgPSBUYWJsZUNvbXBvbmVudCA9PlxuICBjbGFzcyBBZHZhbmNlZEV4cGFuZFRhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxuICAgICAgfVxuICAgICAgdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQgPSB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQgPSB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50ID0gdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuZ2V0VGRQcm9wcyA9IHRoaXMuZ2V0VGRQcm9wcy5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlID0gdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZS5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmV4cGFuZEZ1bmNzID0ge1xuICAgICAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQ6IHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50LFxuICAgICAgICBzaG93Um93U3ViQ29tcG9uZW50OiB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQsXG4gICAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQ6IHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhZnRlciBpbml0aWFsIHJlbmRlciBpZiB3ZSBnZXQgbmV3XG4gICAgLy8gZGF0YSwgY29sdW1ucywgcGFnZSBjaGFuZ2VzLCBldGMuXG4gICAgLy8gd2UgcmVzZXQgZXhwYW5kZWQgc3RhdGUuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgY29sdW1uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgICBTdWJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5mdW5jLCBQcm9wVHlwZXMuZWxlbWVudF0pXG4gICAgICAgIC5pc1JlcXVpcmVkLFxuICAgICAgb25FeHBhbmRlZENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlOiBudWxsLFxuICAgIH07XG5cbiAgICBzdGF0aWMgRGlzcGxheU5hbWUgPSAnQWR2YW5jZWRFeHBhbmRUYWJsZSc7XG5cbiAgICAvLyBzaW5jZSB3ZSBwYXNzIHRoZSBleHBhbmQgZnVuY3Rpb25zIHRvIGVhY2ggQ2VsbCxcbiAgICAvLyB3ZSBuZWVkIHRvIGZpbHRlciBpdCBvdXQgZnJvbSBiZWluZyBwYXNzZWQgYXMgYW5cbiAgICAvLyBhY3R1YWwgRE9NIGF0dHJpYnV0ZS4gU2VlIGdldFByb3BzIGluIGNvbHVtbnNXaXRoVG9nZ2xlIGFib3ZlLlxuICAgIHN0YXRpYyBUZENvbXBvbmVudCAoe1xuICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50LFxuICAgICAgc2hvd1Jvd1N1YkNvbXBvbmVudCxcbiAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQsXG4gICAgICAuLi5yZXN0XG4gICAgfSkge1xuICAgICAgcmV0dXJuIDxUYWJsZUNvbXBvbmVudC5kZWZhdWx0UHJvcHMuVGRDb21wb25lbnQgey4uLnJlc3R9IC8+XG4gICAgfVxuXG4gICAgZmlyZU9uRXhwYW5kZWRDaGFuZ2UgKHJvd0luZm8sIGUpIHtcbiAgICAgIC8vIGZpcmUgY2FsbGJhY2sgb25jZSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXhwYW5kZWRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm8sIGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzb2x2ZU5ld1RhYmxlU3RhdGUgKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlLCBleHBhbmRUeXBlKSB7XG4gICAgICAvLyBkZXJpdmUgbmVzdGluZ1BhdGggaWYgb25seSByb3dJbmZvIGlzIHBhc3NlZFxuICAgICAgbGV0IG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGhcblxuICAgICAgaWYgKHJvd0luZm9Pck5lc3RpbmdQYXRoLm5lc3RpbmdQYXRoKSB7XG4gICAgICAgIG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGhcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgICAgcHJldlN0YXRlID0+IHtcbiAgICAgICAgICBjb25zdCBpc0V4cGFuZGVkID0gZ2V0KHByZXZTdGF0ZS5leHBhbmRlZCwgbmVzdGluZ1BhdGgpXG4gICAgICAgICAgLy8gc2luY2Ugd2UgZG8gbm90IHN1cHBvcnQgbmVzdGVkIHJvd3MsIGEgc2hhbGxvdyBjbG9uZSBpcyBva2F5LlxuICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0geyAuLi5wcmV2U3RhdGUuZXhwYW5kZWQgfVxuXG4gICAgICAgICAgc3dpdGNoIChleHBhbmRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzaG93JzpcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwge30pXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdoaWRlJzpcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwgZmFsc2UpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAvLyB0b2dnbGVcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwgaXNFeHBhbmRlZCA/IGZhbHNlIDoge30pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgICBleHBhbmRlZDogbmV3RXhwYW5kZWQsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlKVxuICAgICAgKVxuICAgIH1cblxuICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlKVxuICAgIH1cblxuICAgIHNob3dSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSwgJ3Nob3cnKVxuICAgIH1cblxuICAgIGhpZGVSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSwgJ2hpZGUnKVxuICAgIH1cblxuICAgIGdldFRkUHJvcHMgKHRhYmxlU3RhdGUsIHJvd0luZm8sIGNvbHVtbikge1xuICAgICAgY29uc3QgeyBleHBhbmRlciB9ID0gY29sdW1uXG5cbiAgICAgIGlmICghZXhwYW5kZXIpIHtcbiAgICAgICAgLy8gbm8gb3ZlcnJpZGVzXG4gICAgICAgIHJldHVybiB7fVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBvbmx5IG92ZXJyaWRlIG9uQ2xpY2sgZm9yIGNvbHVtbiBUZFxuICAgICAgICBvbkNsaWNrOiBlID0+IHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudChyb3dJbmZvLCBlKVxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSAoKSB7XG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSB7IGNvbnNvbGUud2FybignQWR2YW5jZWRFeHBhbmRUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKSB9XG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlXG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29sdW1ucywgU3ViQ29tcG9uZW50LCBvbkV4cGFuZGVkQ2hhbmdlLCAuLi5yZXN0XG4gICAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgICBjb25zdCB3cmFwcGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoVG9nZ2xlKGNvbHVtbnMsIHRoaXMuZXhwYW5kRnVuY3MpXG4gICAgICBjb25zdCBXcmFwcGVkU3ViQ29tcG9uZW50ID0gc3ViQ29tcG9uZW50V2l0aFRvZ2dsZShcbiAgICAgICAgU3ViQ29tcG9uZW50LFxuICAgICAgICB0aGlzLmV4cGFuZEZ1bmNzXG4gICAgICApXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUYWJsZUNvbXBvbmVudFxuICAgICAgICAgIHsuLi5yZXN0fVxuICAgICAgICAgIGNvbHVtbnM9e3dyYXBwZWRDb2x1bW5zfVxuICAgICAgICAgIGV4cGFuZGVkPXt0aGlzLnN0YXRlLmV4cGFuZGVkfVxuICAgICAgICAgIGdldFRkUHJvcHM9e3RoaXMuZ2V0VGRQcm9wc31cbiAgICAgICAgICBTdWJDb21wb25lbnQ9e1dyYXBwZWRTdWJDb21wb25lbnR9XG4gICAgICAgICAgVGRDb21wb25lbnQ9e0FkdmFuY2VkRXhwYW5kVGFibGUuVGRDb21wb25lbnR9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICB9XG4iXX0=