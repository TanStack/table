var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import set from 'lodash.set';
import get from 'lodash.get';

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

export var subComponentWithToggle = function subComponentWithToggle(SubComponent, expandFuncs) {
  return function (props) {
    return React.createElement(SubComponent, _extends({}, props, expandFuncs));
  };
};

// each cell in the column gets passed the function to toggle a sub component
export var columnsWithToggle = function columnsWithToggle(columns, expandFuncs) {
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
          var isExpanded = get(prevState.expanded, nestingPath);
          // since we do not support nested rows, a shallow clone is okay.
          var newExpanded = _extends({}, prevState.expanded);

          switch (expandType) {
            case 'show':
              set(newExpanded, nestingPath, {});
              break;
            case 'hide':
              set(newExpanded, nestingPath, false);
              break;
            default:
              // toggle
              set(newExpanded, nestingPath, isExpanded ? false : {});
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

        return React.createElement(TableComponent, _extends({}, rest, {
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

        return React.createElement(TableComponent.defaultProps.TdComponent, rest);
      }
    }]);

    return AdvancedExpandTable;
  }(Component), _class.propTypes = {
    columns: PropTypes.array.isRequired,
    SubComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    onExpandedChange: PropTypes.func
  }, _class.defaultProps = {
    onExpandedChange: null
  }, _class.DisplayName = 'AdvancedExpandTable', _temp;
};
export { advancedExpandTableHOC };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInNldCIsImdldCIsInN1YkNvbXBvbmVudFdpdGhUb2dnbGUiLCJTdWJDb21wb25lbnQiLCJleHBhbmRGdW5jcyIsInByb3BzIiwiY29sdW1uc1dpdGhUb2dnbGUiLCJjb2x1bW5zIiwibWFwIiwiY29sdW1uIiwiZ2V0UHJvcHMiLCJhZHZhbmNlZEV4cGFuZFRhYmxlSE9DIiwiZXhwYW5kZWQiLCJzdGF0ZSIsInRvZ2dsZVJvd1N1YkNvbXBvbmVudCIsImJpbmQiLCJzaG93Um93U3ViQ29tcG9uZW50IiwiaGlkZVJvd1N1YkNvbXBvbmVudCIsImdldFRkUHJvcHMiLCJmaXJlT25FeHBhbmRlZENoYW5nZSIsInJvd0luZm8iLCJlIiwib25FeHBhbmRlZENoYW5nZSIsInJvd0luZm9Pck5lc3RpbmdQYXRoIiwiZXhwYW5kVHlwZSIsIm5lc3RpbmdQYXRoIiwic2V0U3RhdGUiLCJpc0V4cGFuZGVkIiwicHJldlN0YXRlIiwibmV3RXhwYW5kZWQiLCJyZXNvbHZlTmV3VGFibGVTdGF0ZSIsInRhYmxlU3RhdGUiLCJleHBhbmRlciIsIm9uQ2xpY2siLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldFdyYXBwZWRJbnN0YW5jZSIsInJlc3QiLCJ3cmFwcGVkQ29sdW1ucyIsIldyYXBwZWRTdWJDb21wb25lbnQiLCJBZHZhbmNlZEV4cGFuZFRhYmxlIiwiVGRDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJmdW5jIiwiZWxlbWVudCIsImRlZmF1bHRQcm9wcyIsIkRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAs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a0J2QixVQUFVZ0Q7QUFKWCxHQTVCZSxTQW1DM0JFLFlBbkMyQixHQW1DWjtBQUNwQjNCLHNCQUFrQjtBQURFLEdBbkNZLFNBdUMzQjRCLFdBdkMyQixHQXVDYixxQkF2Q2E7QUFBQSxDQUEvQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBzZXQgZnJvbSAnbG9kYXNoLnNldCdcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCdcblxuLypcbiAgQWR2YW5jZWRFeHBhbmRUYWJsZUhPQyBmb3IgUmVhY3RUYWJsZVxuXG4gIEhPQyB3aGljaCBhbGxvd3MgYW55IENlbGwgaW4gdGhlIHJvdyB0byB0b2dnbGUgdGhlIHJvdydzXG4gIFN1YkNvbXBvbmVudC4gQWxzbyBhbGxvd3MgdGhlIFN1YkNvbXBvbmVudCB0byB0b2dnbGUgaXRzZWxmLlxuXG4gIEV4cGFuZCBmdW5jdGlvbnMgYXZhaWxhYmxlIHRvIGFueSBTdWJDb21wb25lbnQgb3IgQ29sdW1uIENlbGw6XG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50XG4gICAgc2hvd1Jvd1N1YkNvbXBvbmVudFxuICAgIGhpZGVSb3dTdWJDb21wb25lbnRcblxuICBFYWNoIENvbHVtbiBSZW5kZXJlciAoRS5nLiBDZWxsICkgZ2V0cyB0aGUgZXhwYW5kIGZ1bmN0aW9ucyBpbiBpdHMgcHJvcHNcbiAgQW5kIEVhY2ggU3ViQ29tcG9uZW50IGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXG5cbiAgRXhwYW5kIGZ1bmN0aW9ucyB0YWtlcyB0aGUgYHJvd0luZm9gIGdpdmVuIHRvIGVhY2hcbiAgQ29sdW1uIFJlbmRlcmVyIGFuZCBTdWJDb21wb25lbnQgYWxyZWFkeSBieSBSZWFjdFRhYmxlLlxuKi9cblxuZXhwb3J0IGNvbnN0IHN1YkNvbXBvbmVudFdpdGhUb2dnbGUgPSAoU3ViQ29tcG9uZW50LCBleHBhbmRGdW5jcykgPT4gcHJvcHMgPT4gKFxuICA8U3ViQ29tcG9uZW50IHsuLi5wcm9wc30gey4uLmV4cGFuZEZ1bmNzfSAvPlxuKVxuXG4vLyBlYWNoIGNlbGwgaW4gdGhlIGNvbHVtbiBnZXRzIHBhc3NlZCB0aGUgZnVuY3Rpb24gdG8gdG9nZ2xlIGEgc3ViIGNvbXBvbmVudFxuZXhwb3J0IGNvbnN0IGNvbHVtbnNXaXRoVG9nZ2xlID0gKGNvbHVtbnMsIGV4cGFuZEZ1bmNzKSA9PlxuICBjb2x1bW5zLm1hcChjb2x1bW4gPT4ge1xuICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uY29sdW1uLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zV2l0aFRvZ2dsZShjb2x1bW4uY29sdW1ucywgZXhwYW5kRnVuY3MpLFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgLi4uY29sdW1uLFxuICAgICAgZ2V0UHJvcHMgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmV4cGFuZEZ1bmNzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSlcblxuZXhwb3J0IGNvbnN0IGFkdmFuY2VkRXhwYW5kVGFibGVIT0MgPSBUYWJsZUNvbXBvbmVudCA9PlxuICBjbGFzcyBBZHZhbmNlZEV4cGFuZFRhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvLyBhZnRlciBpbml0aWFsIHJlbmRlciBpZiB3ZSBnZXQgbmV3XG4gICAgLy8gZGF0YSwgY29sdW1ucywgcGFnZSBjaGFuZ2VzLCBldGMuXG4gICAgLy8gd2UgcmVzZXQgZXhwYW5kZWQgc3RhdGUuXG4gICAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBleHBhbmRlZDoge30sXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGV4cGFuZGVkOiB7fSxcbiAgICAgIH1cbiAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50ID0gdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zaG93Um93U3ViQ29tcG9uZW50ID0gdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudCA9IHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmdldFRkUHJvcHMgPSB0aGlzLmdldFRkUHJvcHMuYmluZCh0aGlzKVxuICAgICAgdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZSA9IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2UuYmluZCh0aGlzKVxuICAgICAgdGhpcy5leHBhbmRGdW5jcyA9IHtcbiAgICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50OiB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgICAgc2hvd1Jvd1N1YkNvbXBvbmVudDogdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LFxuICAgICAgICBoaWRlUm93U3ViQ29tcG9uZW50OiB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQsXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGNvbHVtbnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgICAgU3ViQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZnVuYywgUHJvcFR5cGVzLmVsZW1lbnRdKVxuICAgICAgICAuaXNSZXF1aXJlZCxcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgb25FeHBhbmRlZENoYW5nZTogbnVsbCxcbiAgICB9O1xuXG4gICAgc3RhdGljIERpc3BsYXlOYW1lID0gJ0FkdmFuY2VkRXhwYW5kVGFibGUnO1xuXG4gICAgLy8gc2luY2Ugd2UgcGFzcyB0aGUgZXhwYW5kIGZ1bmN0aW9ucyB0byBlYWNoIENlbGwsXG4gICAgLy8gd2UgbmVlZCB0byBmaWx0ZXIgaXQgb3V0IGZyb20gYmVpbmcgcGFzc2VkIGFzIGFuXG4gICAgLy8gYWN0dWFsIERPTSBhdHRyaWJ1dGUuIFNlZSBnZXRQcm9wcyBpbiBjb2x1bW5zV2l0aFRvZ2dsZSBhYm92ZS5cbiAgICBzdGF0aWMgVGRDb21wb25lbnQgKHtcbiAgICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgIHNob3dSb3dTdWJDb21wb25lbnQsXG4gICAgICBoaWRlUm93U3ViQ29tcG9uZW50LFxuICAgICAgLi4ucmVzdFxuICAgIH0pIHtcbiAgICAgIHJldHVybiA8VGFibGVDb21wb25lbnQuZGVmYXVsdFByb3BzLlRkQ29tcG9uZW50IHsuLi5yZXN0fSAvPlxuICAgIH1cblxuICAgIGZpcmVPbkV4cGFuZGVkQ2hhbmdlIChyb3dJbmZvLCBlKSB7XG4gICAgICAvLyBmaXJlIGNhbGxiYWNrIG9uY2Ugc3RhdGUgaGFzIGNoYW5nZWQuXG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGFuZGVkQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25FeHBhbmRlZENoYW5nZShyb3dJbmZvLCBlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlc29sdmVOZXdUYWJsZVN0YXRlIChyb3dJbmZvT3JOZXN0aW5nUGF0aCwgZSwgZXhwYW5kVHlwZSkge1xuICAgICAgLy8gZGVyaXZlIG5lc3RpbmdQYXRoIGlmIG9ubHkgcm93SW5mbyBpcyBwYXNzZWRcbiAgICAgIGxldCBuZXN0aW5nUGF0aCA9IHJvd0luZm9Pck5lc3RpbmdQYXRoXG5cbiAgICAgIGlmIChyb3dJbmZvT3JOZXN0aW5nUGF0aC5uZXN0aW5nUGF0aCkge1xuICAgICAgICBuZXN0aW5nUGF0aCA9IHJvd0luZm9Pck5lc3RpbmdQYXRoLm5lc3RpbmdQYXRoXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgIHByZXZTdGF0ZSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNFeHBhbmRlZCA9IGdldChwcmV2U3RhdGUuZXhwYW5kZWQsIG5lc3RpbmdQYXRoKVxuICAgICAgICAgIC8vIHNpbmNlIHdlIGRvIG5vdCBzdXBwb3J0IG5lc3RlZCByb3dzLCBhIHNoYWxsb3cgY2xvbmUgaXMgb2theS5cbiAgICAgICAgICBjb25zdCBuZXdFeHBhbmRlZCA9IHsgLi4ucHJldlN0YXRlLmV4cGFuZGVkIH1cblxuICAgICAgICAgIHN3aXRjaCAoZXhwYW5kVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc2hvdyc6XG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIHt9KVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnaGlkZSc6XG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIGZhbHNlKVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgLy8gdG9nZ2xlXG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIGlzRXhwYW5kZWQgPyBmYWxzZSA6IHt9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucHJldlN0YXRlLFxuICAgICAgICAgICAgZXhwYW5kZWQ6IG5ld0V4cGFuZGVkLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4gdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZShyb3dJbmZvT3JOZXN0aW5nUGF0aCwgZSlcbiAgICAgIClcbiAgICB9XG5cbiAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSlcbiAgICB9XG5cbiAgICBzaG93Um93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XG4gICAgICB0aGlzLnJlc29sdmVOZXdUYWJsZVN0YXRlKHJvd0luZm8sIGUsICdzaG93JylcbiAgICB9XG5cbiAgICBoaWRlUm93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XG4gICAgICB0aGlzLnJlc29sdmVOZXdUYWJsZVN0YXRlKHJvd0luZm8sIGUsICdoaWRlJylcbiAgICB9XG5cbiAgICBnZXRUZFByb3BzICh0YWJsZVN0YXRlLCByb3dJbmZvLCBjb2x1bW4pIHtcbiAgICAgIGNvbnN0IHsgZXhwYW5kZXIgfSA9IGNvbHVtblxuXG4gICAgICBpZiAoIWV4cGFuZGVyKSB7XG4gICAgICAgIC8vIG5vIG92ZXJyaWRlc1xuICAgICAgICByZXR1cm4ge31cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gb25seSBvdmVycmlkZSBvbkNsaWNrIGZvciBjb2x1bW4gVGRcbiAgICAgICAgb25DbGljazogZSA9PiB7XG4gICAgICAgICAgdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQocm93SW5mbywgZSlcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UgKCkge1xuICAgICAgaWYgKCF0aGlzLndyYXBwZWRJbnN0YW5jZSkgeyBjb25zb2xlLndhcm4oJ0FkdmFuY2VkRXhwYW5kVGFibGUgLSBObyB3cmFwcGVkIGluc3RhbmNlJykgfVxuICAgICAgaWYgKHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHVtbnMsIFN1YkNvbXBvbmVudCwgb25FeHBhbmRlZENoYW5nZSwgLi4ucmVzdFxuICAgICAgfSA9IHRoaXMucHJvcHNcblxuICAgICAgY29uc3Qgd3JhcHBlZENvbHVtbnMgPSBjb2x1bW5zV2l0aFRvZ2dsZShjb2x1bW5zLCB0aGlzLmV4cGFuZEZ1bmNzKVxuICAgICAgY29uc3QgV3JhcHBlZFN1YkNvbXBvbmVudCA9IHN1YkNvbXBvbmVudFdpdGhUb2dnbGUoXG4gICAgICAgIFN1YkNvbXBvbmVudCxcbiAgICAgICAgdGhpcy5leHBhbmRGdW5jc1xuICAgICAgKVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGFibGVDb21wb25lbnRcbiAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgICBjb2x1bW5zPXt3cmFwcGVkQ29sdW1uc31cbiAgICAgICAgICBleHBhbmRlZD17dGhpcy5zdGF0ZS5leHBhbmRlZH1cbiAgICAgICAgICBnZXRUZFByb3BzPXt0aGlzLmdldFRkUHJvcHN9XG4gICAgICAgICAgU3ViQ29tcG9uZW50PXtXcmFwcGVkU3ViQ29tcG9uZW50fVxuICAgICAgICAgIFRkQ29tcG9uZW50PXtBZHZhbmNlZEV4cGFuZFRhYmxlLlRkQ29tcG9uZW50fVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgfVxuIl19