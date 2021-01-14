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
  AdvancedExpandTableHOC for ReactTable

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

    _createClass(AdvancedExpandTable, null, [{
      key: 'getDerivedStateFromProps',

      // after initial render if we get new
      // data, columns, page changes, etc.
      // we reset expanded state.
      value: function getDerivedStateFromProps() {
        return {
          expanded: {}
        };
      }
    }]);

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

    _createClass(AdvancedExpandTable, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJzdWJDb21wb25lbnRXaXRoVG9nZ2xlIiwiU3ViQ29tcG9uZW50IiwiZXhwYW5kRnVuY3MiLCJwcm9wcyIsImNvbHVtbnNXaXRoVG9nZ2xlIiwiY29sdW1ucyIsIm1hcCIsImNvbHVtbiIsImdldFByb3BzIiwiYWR2YW5jZWRFeHBhbmRUYWJsZUhPQyIsImV4cGFuZGVkIiwic3RhdGUiLCJ0b2dnbGVSb3dTdWJDb21wb25lbnQiLCJiaW5kIiwic2hvd1Jvd1N1YkNvbXBvbmVudCIsImhpZGVSb3dTdWJDb21wb25lbnQiLCJnZXRUZFByb3BzIiwiZmlyZU9uRXhwYW5kZWRDaGFuZ2UiLCJyb3dJbmZvIiwiZSIsIm9uRXhwYW5kZWRDaGFuZ2UiLCJyb3dJbmZvT3JOZXN0aW5nUGF0aCIsImV4cGFuZFR5cGUiLCJuZXN0aW5nUGF0aCIsInNldFN0YXRlIiwiaXNFeHBhbmRlZCIsInByZXZTdGF0ZSIsIm5ld0V4cGFuZGVkIiwicmVzb2x2ZU5ld1RhYmxlU3RhdGUiLCJ0YWJsZVN0YXRlIiwiZXhwYW5kZXIiLCJvbkNsaWNrIiwid3JhcHBlZEluc3RhbmNlIiwiY29uc29sZSIsIndhcm4iLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJyZXN0Iiwid3JhcHBlZENvbHVtbnMiLCJXcmFwcGVkU3ViQ29tcG9uZW50IiwiQWR2YW5jZWRFeHBhbmRUYWJsZSIsIlRkQ29tcG9uZW50IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25lT2ZUeXBlIiwiZnVuYyIsImVsZW1lbnQiLCJkZWZhdWx0UHJvcHMiLCJEaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JPLElBQU1BLDBE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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXHJcbmltcG9ydCBzZXQgZnJvbSAnbG9kYXNoLnNldCdcclxuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0J1xyXG5cclxuLypcclxuICBBZHZhbmNlZEV4cGFuZFRhYmxlSE9DIGZvciBSZWFjdFRhYmxlXHJcblxyXG4gIEhPQyB3aGljaCBhbGxvd3MgYW55IENlbGwgaW4gdGhlIHJvdyB0byB0b2dnbGUgdGhlIHJvdydzXHJcbiAgU3ViQ29tcG9uZW50LiBBbHNvIGFsbG93cyB0aGUgU3ViQ29tcG9uZW50IHRvIHRvZ2dsZSBpdHNlbGYuXHJcblxyXG4gIEV4cGFuZCBmdW5jdGlvbnMgYXZhaWxhYmxlIHRvIGFueSBTdWJDb21wb25lbnQgb3IgQ29sdW1uIENlbGw6XHJcbiAgICB0b2dnbGVSb3dTdWJDb21wb25lbnRcclxuICAgIHNob3dSb3dTdWJDb21wb25lbnRcclxuICAgIGhpZGVSb3dTdWJDb21wb25lbnRcclxuXHJcbiAgRWFjaCBDb2x1bW4gUmVuZGVyZXIgKEUuZy4gQ2VsbCApIGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXHJcbiAgQW5kIEVhY2ggU3ViQ29tcG9uZW50IGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXHJcblxyXG4gIEV4cGFuZCBmdW5jdGlvbnMgdGFrZXMgdGhlIGByb3dJbmZvYCBnaXZlbiB0byBlYWNoXHJcbiAgQ29sdW1uIFJlbmRlcmVyIGFuZCBTdWJDb21wb25lbnQgYWxyZWFkeSBieSBSZWFjdFRhYmxlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IHN1YkNvbXBvbmVudFdpdGhUb2dnbGUgPSAoU3ViQ29tcG9uZW50LCBleHBhbmRGdW5jcykgPT4gcHJvcHMgPT4gKFxyXG4gIDxTdWJDb21wb25lbnQgey4uLnByb3BzfSB7Li4uZXhwYW5kRnVuY3N9IC8+XHJcbilcclxuXHJcbi8vIGVhY2ggY2VsbCBpbiB0aGUgY29sdW1uIGdldHMgcGFzc2VkIHRoZSBmdW5jdGlvbiB0byB0b2dnbGUgYSBzdWIgY29tcG9uZW50XHJcbmV4cG9ydCBjb25zdCBjb2x1bW5zV2l0aFRvZ2dsZSA9IChjb2x1bW5zLCBleHBhbmRGdW5jcykgPT5cclxuICBjb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xyXG4gICAgaWYgKGNvbHVtbi5jb2x1bW5zKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uY29sdW1uLFxyXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnNXaXRoVG9nZ2xlKGNvbHVtbi5jb2x1bW5zLCBleHBhbmRGdW5jcyksXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLmNvbHVtbixcclxuICAgICAgZ2V0UHJvcHMgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi5leHBhbmRGdW5jcyxcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbmV4cG9ydCBjb25zdCBhZHZhbmNlZEV4cGFuZFRhYmxlSE9DID0gVGFibGVDb21wb25lbnQgPT5cclxuICBjbGFzcyBBZHZhbmNlZEV4cGFuZFRhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIC8vIGFmdGVyIGluaXRpYWwgcmVuZGVyIGlmIHdlIGdldCBuZXdcclxuICAgIC8vIGRhdGEsIGNvbHVtbnMsIHBhZ2UgY2hhbmdlcywgZXRjLlxyXG4gICAgLy8gd2UgcmVzZXQgZXhwYW5kZWQgc3RhdGUuXHJcbiAgICBzdGF0aWMgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBleHBhbmRlZDoge30sXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcclxuICAgICAgc3VwZXIocHJvcHMpXHJcbiAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50ID0gdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQgPSB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQgPSB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLmdldFRkUHJvcHMgPSB0aGlzLmdldFRkUHJvcHMuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlID0gdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZS5iaW5kKHRoaXMpXHJcbiAgICAgIHRoaXMuZXhwYW5kRnVuY3MgPSB7XHJcbiAgICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50OiB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudCxcclxuICAgICAgICBzaG93Um93U3ViQ29tcG9uZW50OiB0aGlzLnNob3dSb3dTdWJDb21wb25lbnQsXHJcbiAgICAgICAgaGlkZVJvd1N1YkNvbXBvbmVudDogdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50LFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgICAgY29sdW1uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXHJcbiAgICAgIFN1YkNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmZ1bmMsIFByb3BUeXBlcy5lbGVtZW50XSlcclxuICAgICAgICAuaXNSZXF1aXJlZCxcclxuICAgICAgb25FeHBhbmRlZENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2U6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBEaXNwbGF5TmFtZSA9ICdBZHZhbmNlZEV4cGFuZFRhYmxlJztcclxuXHJcbiAgICAvLyBzaW5jZSB3ZSBwYXNzIHRoZSBleHBhbmQgZnVuY3Rpb25zIHRvIGVhY2ggQ2VsbCxcclxuICAgIC8vIHdlIG5lZWQgdG8gZmlsdGVyIGl0IG91dCBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhblxyXG4gICAgLy8gYWN0dWFsIERPTSBhdHRyaWJ1dGUuIFNlZSBnZXRQcm9wcyBpbiBjb2x1bW5zV2l0aFRvZ2dsZSBhYm92ZS5cclxuICAgIHN0YXRpYyBUZENvbXBvbmVudCAoe1xyXG4gICAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQsXHJcbiAgICAgIHNob3dSb3dTdWJDb21wb25lbnQsXHJcbiAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQsXHJcbiAgICAgIC4uLnJlc3RcclxuICAgIH0pIHtcclxuICAgICAgcmV0dXJuIDxUYWJsZUNvbXBvbmVudC5kZWZhdWx0UHJvcHMuVGRDb21wb25lbnQgey4uLnJlc3R9IC8+XHJcbiAgICB9XHJcblxyXG4gICAgZmlyZU9uRXhwYW5kZWRDaGFuZ2UgKHJvd0luZm8sIGUpIHtcclxuICAgICAgLy8gZmlyZSBjYWxsYmFjayBvbmNlIHN0YXRlIGhhcyBjaGFuZ2VkLlxyXG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGFuZGVkQ2hhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm8sIGUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlTmV3VGFibGVTdGF0ZSAocm93SW5mb09yTmVzdGluZ1BhdGgsIGUsIGV4cGFuZFR5cGUpIHtcclxuICAgICAgLy8gZGVyaXZlIG5lc3RpbmdQYXRoIGlmIG9ubHkgcm93SW5mbyBpcyBwYXNzZWRcclxuICAgICAgbGV0IG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGhcclxuXHJcbiAgICAgIGlmIChyb3dJbmZvT3JOZXN0aW5nUGF0aC5uZXN0aW5nUGF0aCkge1xyXG4gICAgICAgIG5lc3RpbmdQYXRoID0gcm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGhcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZShcclxuICAgICAgICBwcmV2U3RhdGUgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaXNFeHBhbmRlZCA9IGdldChwcmV2U3RhdGUuZXhwYW5kZWQsIG5lc3RpbmdQYXRoKVxyXG4gICAgICAgICAgLy8gc2luY2Ugd2UgZG8gbm90IHN1cHBvcnQgbmVzdGVkIHJvd3MsIGEgc2hhbGxvdyBjbG9uZSBpcyBva2F5LlxyXG4gICAgICAgICAgY29uc3QgbmV3RXhwYW5kZWQgPSB7IC4uLnByZXZTdGF0ZS5leHBhbmRlZCB9XHJcblxyXG4gICAgICAgICAgc3dpdGNoIChleHBhbmRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIHt9KVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGUnOlxyXG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgLy8gdG9nZ2xlXHJcbiAgICAgICAgICAgICAgc2V0KG5ld0V4cGFuZGVkLCBuZXN0aW5nUGF0aCwgaXNFeHBhbmRlZCA/IGZhbHNlIDoge30pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5wcmV2U3RhdGUsXHJcbiAgICAgICAgICAgIGV4cGFuZGVkOiBuZXdFeHBhbmRlZCxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgICgpID0+IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2Uocm93SW5mb09yTmVzdGluZ1BhdGgsIGUpXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnc2hvdycpXHJcbiAgICB9XHJcblxyXG4gICAgaGlkZVJvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xyXG4gICAgICB0aGlzLnJlc29sdmVOZXdUYWJsZVN0YXRlKHJvd0luZm8sIGUsICdoaWRlJylcclxuICAgIH1cclxuXHJcbiAgICBnZXRUZFByb3BzICh0YWJsZVN0YXRlLCByb3dJbmZvLCBjb2x1bW4pIHtcclxuICAgICAgY29uc3QgeyBleHBhbmRlciB9ID0gY29sdW1uXHJcblxyXG4gICAgICBpZiAoIWV4cGFuZGVyKSB7XHJcbiAgICAgICAgLy8gbm8gb3ZlcnJpZGVzXHJcbiAgICAgICAgcmV0dXJuIHt9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gb25seSBvdmVycmlkZSBvbkNsaWNrIGZvciBjb2x1bW4gVGRcclxuICAgICAgICBvbkNsaWNrOiBlID0+IHtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50KHJvd0luZm8sIGUpXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIHsgY29uc29sZS53YXJuKCdBZHZhbmNlZEV4cGFuZFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpIH1cclxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UoKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlciAoKSB7XHJcbiAgICAgIGNvbnN0IHtcclxuICAgICAgICBjb2x1bW5zLCBTdWJDb21wb25lbnQsIG9uRXhwYW5kZWRDaGFuZ2UsIC4uLnJlc3RcclxuICAgICAgfSA9IHRoaXMucHJvcHNcclxuXHJcbiAgICAgIGNvbnN0IHdyYXBwZWRDb2x1bW5zID0gY29sdW1uc1dpdGhUb2dnbGUoY29sdW1ucywgdGhpcy5leHBhbmRGdW5jcylcclxuICAgICAgY29uc3QgV3JhcHBlZFN1YkNvbXBvbmVudCA9IHN1YkNvbXBvbmVudFdpdGhUb2dnbGUoXHJcbiAgICAgICAgU3ViQ29tcG9uZW50LFxyXG4gICAgICAgIHRoaXMuZXhwYW5kRnVuY3NcclxuICAgICAgKVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8VGFibGVDb21wb25lbnRcclxuICAgICAgICAgIHsuLi5yZXN0fVxyXG4gICAgICAgICAgY29sdW1ucz17d3JhcHBlZENvbHVtbnN9XHJcbiAgICAgICAgICBleHBhbmRlZD17dGhpcy5zdGF0ZS5leHBhbmRlZH1cclxuICAgICAgICAgIGdldFRkUHJvcHM9e3RoaXMuZ2V0VGRQcm9wc31cclxuICAgICAgICAgIFN1YkNvbXBvbmVudD17V3JhcHBlZFN1YkNvbXBvbmVudH1cclxuICAgICAgICAgIFRkQ29tcG9uZW50PXtBZHZhbmNlZEV4cGFuZFRhYmxlLlRkQ29tcG9uZW50fVxyXG4gICAgICAgIC8+XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcbiJdfQ==