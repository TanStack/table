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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInNldCIsImdldCIsInN1YkNvbXBvbmVudFdpdGhUb2dnbGUiLCJTdWJDb21wb25lbnQiLCJleHBhbmRGdW5jcyIsInByb3BzIiwiY29sdW1uc1dpdGhUb2dnbGUiLCJjb2x1bW5zIiwibWFwIiwiY29sdW1uIiwiZ2V0UHJvcHMiLCJhZHZhbmNlZEV4cGFuZFRhYmxlSE9DIiwiZXhwYW5kZWQiLCJzdGF0ZSIsInRvZ2dsZVJvd1N1YkNvbXBvbmVudCIsImJpbmQiLCJzaG93Um93U3ViQ29tcG9uZW50IiwiaGlkZVJvd1N1YkNvbXBvbmVudCIsImdldFRkUHJvcHMiLCJmaXJlT25FeHBhbmRlZENoYW5nZSIsInJvd0luZm8iLCJlIiwib25FeHBhbmRlZENoYW5nZSIsInJvd0luZm9Pck5lc3RpbmdQYXRoIiwiZXhwYW5kVHlwZSIsIm5lc3RpbmdQYXRoIiwic2V0U3RhdGUiLCJpc0V4cGFuZGVkIiwicHJldlN0YXRlIiwibmV3RXhwYW5kZWQiLCJyZXNvbHZlTmV3VGFibGVTdGF0ZSIsInRhYmxlU3RhdGUiLCJleHBhbmRlciIsIm9uQ2xpY2siLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldFdyYXBwZWRJbnN0YW5jZSIsInJlc3QiLCJ3cmFwcGVkQ29sdW1ucyIsIldyYXBwZWRTdWJDb21wb25lbnQiLCJBZHZhbmNlZEV4cGFuZFRhYmxlIiwiVGRDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJmdW5jIiwiZWxlbWVudCIsImRlZmF1bHRQcm9wcyIsIkRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAs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a0J2QixVQUFVZ0Q7QUFKWCxHQTVCZSxTQW1DM0JFLFlBbkMyQixHQW1DWjtBQUNwQjNCLHNCQUFrQjtBQURFLEdBbkNZLFNBdUMzQjRCLFdBdkMyQixHQXVDYixxQkF2Q2E7QUFBQSxDQUEvQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xyXG5pbXBvcnQgc2V0IGZyb20gJ2xvZGFzaC5zZXQnXHJcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCdcclxuXHJcbi8qXHJcbiAgQWR2YW5jZWRFeHBhbmRUYWJsZUhPQyBmb3IgUmVhY3RUYWJsZVxyXG5cclxuICBIT0Mgd2hpY2ggYWxsb3dzIGFueSBDZWxsIGluIHRoZSByb3cgdG8gdG9nZ2xlIHRoZSByb3cnc1xyXG4gIFN1YkNvbXBvbmVudC4gQWxzbyBhbGxvd3MgdGhlIFN1YkNvbXBvbmVudCB0byB0b2dnbGUgaXRzZWxmLlxyXG5cclxuICBFeHBhbmQgZnVuY3Rpb25zIGF2YWlsYWJsZSB0byBhbnkgU3ViQ29tcG9uZW50IG9yIENvbHVtbiBDZWxsOlxyXG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50XHJcbiAgICBzaG93Um93U3ViQ29tcG9uZW50XHJcbiAgICBoaWRlUm93U3ViQ29tcG9uZW50XHJcblxyXG4gIEVhY2ggQ29sdW1uIFJlbmRlcmVyIChFLmcuIENlbGwgKSBnZXRzIHRoZSBleHBhbmQgZnVuY3Rpb25zIGluIGl0cyBwcm9wc1xyXG4gIEFuZCBFYWNoIFN1YkNvbXBvbmVudCBnZXRzIHRoZSBleHBhbmQgZnVuY3Rpb25zIGluIGl0cyBwcm9wc1xyXG5cclxuICBFeHBhbmQgZnVuY3Rpb25zIHRha2VzIHRoZSBgcm93SW5mb2AgZ2l2ZW4gdG8gZWFjaFxyXG4gIENvbHVtbiBSZW5kZXJlciBhbmQgU3ViQ29tcG9uZW50IGFscmVhZHkgYnkgUmVhY3RUYWJsZS5cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBzdWJDb21wb25lbnRXaXRoVG9nZ2xlID0gKFN1YkNvbXBvbmVudCwgZXhwYW5kRnVuY3MpID0+IHByb3BzID0+IChcclxuICA8U3ViQ29tcG9uZW50IHsuLi5wcm9wc30gey4uLmV4cGFuZEZ1bmNzfSAvPlxyXG4pXHJcblxyXG4vLyBlYWNoIGNlbGwgaW4gdGhlIGNvbHVtbiBnZXRzIHBhc3NlZCB0aGUgZnVuY3Rpb24gdG8gdG9nZ2xlIGEgc3ViIGNvbXBvbmVudFxyXG5leHBvcnQgY29uc3QgY29sdW1uc1dpdGhUb2dnbGUgPSAoY29sdW1ucywgZXhwYW5kRnVuY3MpID0+XHJcbiAgY29sdW1ucy5tYXAoY29sdW1uID0+IHtcclxuICAgIGlmIChjb2x1bW4uY29sdW1ucykge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLmNvbHVtbixcclxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zV2l0aFRvZ2dsZShjb2x1bW4uY29sdW1ucywgZXhwYW5kRnVuY3MpLFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5jb2x1bW4sXHJcbiAgICAgIGdldFByb3BzICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4uZXhwYW5kRnVuY3MsXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG5leHBvcnQgY29uc3QgYWR2YW5jZWRFeHBhbmRUYWJsZUhPQyA9IFRhYmxlQ29tcG9uZW50ID0+XHJcbiAgY2xhc3MgQWR2YW5jZWRFeHBhbmRUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICAvLyBhZnRlciBpbml0aWFsIHJlbmRlciBpZiB3ZSBnZXQgbmV3XHJcbiAgICAvLyBkYXRhLCBjb2x1bW5zLCBwYWdlIGNoYW5nZXMsIGV0Yy5cclxuICAgIC8vIHdlIHJlc2V0IGV4cGFuZGVkIHN0YXRlLlxyXG4gICAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZXhwYW5kZWQ6IHt9LFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICAgIHN1cGVyKHByb3BzKVxyXG4gICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgIGV4cGFuZGVkOiB7fSxcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudCA9IHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcclxuICAgICAgdGhpcy5zaG93Um93U3ViQ29tcG9uZW50ID0gdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcclxuICAgICAgdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50ID0gdGhpcy5oaWRlUm93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcclxuICAgICAgdGhpcy5nZXRUZFByb3BzID0gdGhpcy5nZXRUZFByb3BzLmJpbmQodGhpcylcclxuICAgICAgdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZSA9IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2UuYmluZCh0aGlzKVxyXG4gICAgICB0aGlzLmV4cGFuZEZ1bmNzID0ge1xyXG4gICAgICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudDogdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQsXHJcbiAgICAgICAgc2hvd1Jvd1N1YkNvbXBvbmVudDogdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LFxyXG4gICAgICAgIGhpZGVSb3dTdWJDb21wb25lbnQ6IHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudCxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgIGNvbHVtbnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxyXG4gICAgICBTdWJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5mdW5jLCBQcm9wVHlwZXMuZWxlbWVudF0pXHJcbiAgICAgICAgLmlzUmVxdWlyZWQsXHJcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlOiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgRGlzcGxheU5hbWUgPSAnQWR2YW5jZWRFeHBhbmRUYWJsZSc7XHJcblxyXG4gICAgLy8gc2luY2Ugd2UgcGFzcyB0aGUgZXhwYW5kIGZ1bmN0aW9ucyB0byBlYWNoIENlbGwsXHJcbiAgICAvLyB3ZSBuZWVkIHRvIGZpbHRlciBpdCBvdXQgZnJvbSBiZWluZyBwYXNzZWQgYXMgYW5cclxuICAgIC8vIGFjdHVhbCBET00gYXR0cmlidXRlLiBTZWUgZ2V0UHJvcHMgaW4gY29sdW1uc1dpdGhUb2dnbGUgYWJvdmUuXHJcbiAgICBzdGF0aWMgVGRDb21wb25lbnQgKHtcclxuICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50LFxyXG4gICAgICBzaG93Um93U3ViQ29tcG9uZW50LFxyXG4gICAgICBoaWRlUm93U3ViQ29tcG9uZW50LFxyXG4gICAgICAuLi5yZXN0XHJcbiAgICB9KSB7XHJcbiAgICAgIHJldHVybiA8VGFibGVDb21wb25lbnQuZGVmYXVsdFByb3BzLlRkQ29tcG9uZW50IHsuLi5yZXN0fSAvPlxyXG4gICAgfVxyXG5cclxuICAgIGZpcmVPbkV4cGFuZGVkQ2hhbmdlIChyb3dJbmZvLCBlKSB7XHJcbiAgICAgIC8vIGZpcmUgY2FsbGJhY2sgb25jZSBzdGF0ZSBoYXMgY2hhbmdlZC5cclxuICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBhbmRlZENoYW5nZSkge1xyXG4gICAgICAgIHRoaXMucHJvcHMub25FeHBhbmRlZENoYW5nZShyb3dJbmZvLCBlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZU5ld1RhYmxlU3RhdGUgKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlLCBleHBhbmRUeXBlKSB7XHJcbiAgICAgIC8vIGRlcml2ZSBuZXN0aW5nUGF0aCBpZiBvbmx5IHJvd0luZm8gaXMgcGFzc2VkXHJcbiAgICAgIGxldCBuZXN0aW5nUGF0aCA9IHJvd0luZm9Pck5lc3RpbmdQYXRoXHJcblxyXG4gICAgICBpZiAocm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGgpIHtcclxuICAgICAgICBuZXN0aW5nUGF0aCA9IHJvd0luZm9Pck5lc3RpbmdQYXRoLm5lc3RpbmdQYXRoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoXHJcbiAgICAgICAgcHJldlN0YXRlID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSBnZXQocHJldlN0YXRlLmV4cGFuZGVkLCBuZXN0aW5nUGF0aClcclxuICAgICAgICAgIC8vIHNpbmNlIHdlIGRvIG5vdCBzdXBwb3J0IG5lc3RlZCByb3dzLCBhIHNoYWxsb3cgY2xvbmUgaXMgb2theS5cclxuICAgICAgICAgIGNvbnN0IG5ld0V4cGFuZGVkID0geyAuLi5wcmV2U3RhdGUuZXhwYW5kZWQgfVxyXG5cclxuICAgICAgICAgIHN3aXRjaCAoZXhwYW5kVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdzaG93JzpcclxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCB7fSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdoaWRlJzpcclxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCBmYWxzZSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIC8vIHRvZ2dsZVxyXG4gICAgICAgICAgICAgIHNldChuZXdFeHBhbmRlZCwgbmVzdGluZ1BhdGgsIGlzRXhwYW5kZWQgPyBmYWxzZSA6IHt9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4ucHJldlN0YXRlLFxyXG4gICAgICAgICAgICBleHBhbmRlZDogbmV3RXhwYW5kZWQsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoKSA9PiB0aGlzLmZpcmVPbkV4cGFuZGVkQ2hhbmdlKHJvd0luZm9Pck5lc3RpbmdQYXRoLCBlKVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSlcclxuICAgIH1cclxuXHJcbiAgICBzaG93Um93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XHJcbiAgICAgIHRoaXMucmVzb2x2ZU5ld1RhYmxlU3RhdGUocm93SW5mbywgZSwgJ3Nob3cnKVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGVSb3dTdWJDb21wb25lbnQgKHJvd0luZm8sIGUpIHtcclxuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnaGlkZScpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGRQcm9wcyAodGFibGVTdGF0ZSwgcm93SW5mbywgY29sdW1uKSB7XHJcbiAgICAgIGNvbnN0IHsgZXhwYW5kZXIgfSA9IGNvbHVtblxyXG5cclxuICAgICAgaWYgKCFleHBhbmRlcikge1xyXG4gICAgICAgIC8vIG5vIG92ZXJyaWRlc1xyXG4gICAgICAgIHJldHVybiB7fVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIG9ubHkgb3ZlcnJpZGUgb25DbGljayBmb3IgY29sdW1uIFRkXHJcbiAgICAgICAgb25DbGljazogZSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudChyb3dJbmZvLCBlKVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRXcmFwcGVkSW5zdGFuY2UgKCkge1xyXG4gICAgICBpZiAoIXRoaXMud3JhcHBlZEluc3RhbmNlKSB7IGNvbnNvbGUud2FybignQWR2YW5jZWRFeHBhbmRUYWJsZSAtIE5vIHdyYXBwZWQgaW5zdGFuY2UnKSB9XHJcbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIgKCkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgY29sdW1ucywgU3ViQ29tcG9uZW50LCBvbkV4cGFuZGVkQ2hhbmdlLCAuLi5yZXN0XHJcbiAgICAgIH0gPSB0aGlzLnByb3BzXHJcblxyXG4gICAgICBjb25zdCB3cmFwcGVkQ29sdW1ucyA9IGNvbHVtbnNXaXRoVG9nZ2xlKGNvbHVtbnMsIHRoaXMuZXhwYW5kRnVuY3MpXHJcbiAgICAgIGNvbnN0IFdyYXBwZWRTdWJDb21wb25lbnQgPSBzdWJDb21wb25lbnRXaXRoVG9nZ2xlKFxyXG4gICAgICAgIFN1YkNvbXBvbmVudCxcclxuICAgICAgICB0aGlzLmV4cGFuZEZ1bmNzXHJcbiAgICAgIClcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XHJcbiAgICAgICAgICB7Li4ucmVzdH1cclxuICAgICAgICAgIGNvbHVtbnM9e3dyYXBwZWRDb2x1bW5zfVxyXG4gICAgICAgICAgZXhwYW5kZWQ9e3RoaXMuc3RhdGUuZXhwYW5kZWR9XHJcbiAgICAgICAgICBnZXRUZFByb3BzPXt0aGlzLmdldFRkUHJvcHN9XHJcbiAgICAgICAgICBTdWJDb21wb25lbnQ9e1dyYXBwZWRTdWJDb21wb25lbnR9XHJcbiAgICAgICAgICBUZENvbXBvbmVudD17QWR2YW5jZWRFeHBhbmRUYWJsZS5UZENvbXBvbmVudH1cclxuICAgICAgICAvPlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=