var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export default (function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      var defaultState = {
        page: props.defaultPage,
        pageSize: props.defaultPageSize,
        sorted: props.defaultSorted,
        expanded: props.defaultExpanded,
        filtered: props.defaultFiltered,
        resized: props.defaultResized,
        currentlyResizing: false,
        skipNextSort: false
      };
      var resolvedState = _this.getResolvedState(props, defaultState);
      var dataModel = _this.getDataModel(resolvedState, true);

      _this.state = _this.calculateNewResolvedState(dataModel);
      return _this;
    }

    _createClass(_class, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.fireFetchData();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        var oldState = this.getResolvedState(prevProps, prevState);
        var newState = this.getResolvedState(this.props, this.state);

        // Do a deep compare of new and old `defaultOption` and
        // if they are different reset `option = defaultOption`
        var defaultableOptions = ['sorted', 'filtered', 'resized', 'expanded'];
        defaultableOptions.forEach(function (x) {
          var defaultName = 'default' + (x.charAt(0).toUpperCase() + x.slice(1));
          if (JSON.stringify(oldState[defaultName]) !== JSON.stringify(newState[defaultName])) {
            newState[x] = newState[defaultName];
          }
        });

        // If they change these table options, we need to reset defaults
        // or else we could get into a state where the user has changed the UI
        // and then disabled the ability to change it back.
        // e.g. If `filterable` has changed, set `filtered = defaultFiltered`
        var resettableOptions = ['sortable', 'filterable', 'resizable'];
        resettableOptions.forEach(function (x) {
          if (oldState[x] !== newState[x]) {
            var baseName = x.replace('able', '');
            var optionName = baseName + 'ed';
            var defaultName = 'default' + (optionName.charAt(0).toUpperCase() + optionName.slice(1));
            newState[optionName] = newState[defaultName];
          }
        });

        // Props that trigger a data update
        if (oldState.data !== newState.data || oldState.columns !== newState.columns || oldState.pivotBy !== newState.pivotBy || oldState.sorted !== newState.sorted || oldState.filtered !== newState.filtered) {
          this.setStateWithData(this.getDataModel(newState, oldState.data !== newState.data));
        }
      }
    }, {
      key: 'calculateNewResolvedState',
      value: function calculateNewResolvedState(dataModel) {
        var oldState = this.getResolvedState();
        var newResolvedState = this.getResolvedState({}, dataModel);
        var freezeWhenExpanded = newResolvedState.freezeWhenExpanded;

        // Default to unfrozen state

        newResolvedState.frozen = false;

        // If freezeWhenExpanded is set, check for frozen conditions
        if (freezeWhenExpanded) {
          // if any rows are expanded, freeze the existing data and sorting
          var keys = Object.keys(newResolvedState.expanded);
          for (var i = 0; i < keys.length; i += 1) {
            if (newResolvedState.expanded[keys[i]]) {
              newResolvedState.frozen = true;
              break;
            }
          }
        }

        // If the data isn't frozen and either the data or
        // sorting model has changed, update the data
        if (oldState.frozen && !newResolvedState.frozen || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData) {
          // Handle collapseOnsortedChange & collapseOnDataChange
          if (oldState.sorted !== newResolvedState.sorted && this.props.collapseOnSortingChange || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || oldState.sortedData && !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange) {
            newResolvedState.expanded = {};
          }

          Object.assign(newResolvedState, this.getSortedData(newResolvedState));
        }

        // Set page to 0 if filters change
        if (oldState.filtered !== newResolvedState.filtered) {
          newResolvedState.page = 0;
        }

        // Calculate pageSize all the time
        if (newResolvedState.sortedData) {
          newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.sortedData.length / newResolvedState.pageSize);
          newResolvedState.page = newResolvedState.manual ? newResolvedState.page : Math.max(newResolvedState.page >= newResolvedState.pages ? newResolvedState.pages - 1 : newResolvedState.page, 0);
        }

        return newResolvedState;
      }
    }, {
      key: 'setStateWithData',
      value: function setStateWithData(dataModel, cb) {
        var _this2 = this;

        var oldState = this.getResolvedState();
        var newResolvedState = this.calculateNewResolvedState(dataModel);

        return this.setState(newResolvedState, function () {
          if (cb) {
            cb();
          }
          if (oldState.page !== newResolvedState.page || oldState.pageSize !== newResolvedState.pageSize || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered) {
            _this2.fireFetchData();
          }
        });
      }
    }]);

    return _class;
  }(Base);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOlsicHJvcHMiLCJkZWZhdWx0U3RhdGUiLCJwYWdlIiwiZGVmYXVsdFBhZ2UiLCJwYWdlU2l6ZSIsImRlZmF1bHRQYWdlU2l6ZSIsInNvcnRlZCIsImRlZmF1bHRTb3J0ZWQiLCJleHBhbmRlZCIsImRlZmF1bHRFeHBhbmRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlcmVkIiwicmVzaXplZCIsImRlZmF1bHRSZXNpemVkIiwiY3VycmVudGx5UmVzaXppbmciLCJza2lwTmV4dFNvcnQiLCJyZXNvbHZlZFN0YXRlIiwiZ2V0UmVzb2x2ZWRTdGF0ZSIsImRhdGFNb2RlbCIsImdldERhdGFNb2RlbCIsInN0YXRlIiwiY2FsY3VsYXRlTmV3UmVzb2x2ZWRTdGF0ZSIsImZpcmVGZXRjaERhdGEiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJvbGRTdGF0ZSIsIm5ld1N0YXRlIiwiZGVmYXVsdGFibGVPcHRpb25zIiwiZm9yRWFjaCIsImRlZmF1bHROYW1lIiwieCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJKU09OIiwic3RyaW5naWZ5IiwicmVzZXR0YWJsZU9wdGlvbnMiLCJiYXNlTmFtZSIsInJlcGxhY2UiLCJvcHRpb25OYW1lIiwiZGF0YSIsImNvbHVtbnMiLCJwaXZvdEJ5Iiwic2V0U3RhdGVXaXRoRGF0YSIsIm5ld1Jlc29sdmVkU3RhdGUiLCJmcmVlemVXaGVuRXhwYW5kZWQiLCJmcm96ZW4iLCJrZXlzIiwiT2JqZWN0IiwiaSIsImxlbmd0aCIsInNob3dGaWx0ZXJzIiwicmVzb2x2ZWREYXRhIiwiY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UiLCJzb3J0ZWREYXRhIiwiY29sbGFwc2VPbkRhdGFDaGFuZ2UiLCJhc3NpZ24iLCJnZXRTb3J0ZWREYXRhIiwicGFnZXMiLCJtYW51YWwiLCJNYXRoIiwiY2VpbCIsIm1heCIsImNiIiwic2V0U3RhdGUiLCJCYXNlIl0sIm1hcHBpbmdzIjoi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QUwsQ0FBY3BCLGdCQUFkLEVBQWdDLFlBQU07QUFDM0MsY0FBSW1CLEVBQUosRUFBUTtBQUNOQTtBQUNEO0FBQ0QsY0FDRXRDLFNBQVN2QixJQUFULEtBQWtCMEMsaUJBQWlCMUMsSUFBbkMsSUFDQXVCLFNBQVNyQixRQUFULEtBQXNCd0MsaUJBQWlCeEMsUUFEdkMsSUFFQXFCLFNBQVNuQixNQUFULEtBQW9Cc0MsaUJBQWlCdEMsTUFGckMsSUFHQW1CLFNBQVNmLFFBQVQsS0FBc0JrQyxpQkFBaUJsQyxRQUp6QyxFQUtFO0FBQ0EsbUJBQUtZLGFBQUw7QUFDRDtBQUNGLFNBWk0sQ0FBUDtBQWFEO0FBcEpVOztBQUFBO0FBQUEsSUFDQzJDLElBREQ7QUFBQSxDQUFmIiwiZmlsZSI6ImxpZmVjeWNsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IEJhc2UgPT5cclxuICBjbGFzcyBleHRlbmRzIEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICAgIHN1cGVyKHByb3BzKVxyXG5cclxuICAgICAgY29uc3QgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgIHBhZ2U6IHByb3BzLmRlZmF1bHRQYWdlLFxyXG4gICAgICAgIHBhZ2VTaXplOiBwcm9wcy5kZWZhdWx0UGFnZVNpemUsXHJcbiAgICAgICAgc29ydGVkOiBwcm9wcy5kZWZhdWx0U29ydGVkLFxyXG4gICAgICAgIGV4cGFuZGVkOiBwcm9wcy5kZWZhdWx0RXhwYW5kZWQsXHJcbiAgICAgICAgZmlsdGVyZWQ6IHByb3BzLmRlZmF1bHRGaWx0ZXJlZCxcclxuICAgICAgICByZXNpemVkOiBwcm9wcy5kZWZhdWx0UmVzaXplZCxcclxuICAgICAgICBjdXJyZW50bHlSZXNpemluZzogZmFsc2UsXHJcbiAgICAgICAgc2tpcE5leHRTb3J0OiBmYWxzZSxcclxuICAgICAgfVxyXG4gICAgICBjb25zdCByZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKHByb3BzLCBkZWZhdWx0U3RhdGUpXHJcbiAgICAgIGNvbnN0IGRhdGFNb2RlbCA9IHRoaXMuZ2V0RGF0YU1vZGVsKHJlc29sdmVkU3RhdGUsIHRydWUpXHJcblxyXG4gICAgICB0aGlzLnN0YXRlID0gdGhpcy5jYWxjdWxhdGVOZXdSZXNvbHZlZFN0YXRlKGRhdGFNb2RlbClcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XHJcbiAgICAgIHRoaXMuZmlyZUZldGNoRGF0YSgpXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlIChwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xyXG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSlcclxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUodGhpcy5wcm9wcywgdGhpcy5zdGF0ZSlcclxuXHJcbiAgICAgIC8vIERvIGEgZGVlcCBjb21wYXJlIG9mIG5ldyBhbmQgb2xkIGBkZWZhdWx0T3B0aW9uYCBhbmRcclxuICAgICAgLy8gaWYgdGhleSBhcmUgZGlmZmVyZW50IHJlc2V0IGBvcHRpb24gPSBkZWZhdWx0T3B0aW9uYFxyXG4gICAgICBjb25zdCBkZWZhdWx0YWJsZU9wdGlvbnMgPSBbJ3NvcnRlZCcsICdmaWx0ZXJlZCcsICdyZXNpemVkJywgJ2V4cGFuZGVkJ11cclxuICAgICAgZGVmYXVsdGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdE5hbWUgPSBgZGVmYXVsdCR7eC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHguc2xpY2UoMSl9YFxyXG4gICAgICAgIGlmIChKU09OLnN0cmluZ2lmeShvbGRTdGF0ZVtkZWZhdWx0TmFtZV0pICE9PSBKU09OLnN0cmluZ2lmeShuZXdTdGF0ZVtkZWZhdWx0TmFtZV0pKSB7XHJcbiAgICAgICAgICBuZXdTdGF0ZVt4XSA9IG5ld1N0YXRlW2RlZmF1bHROYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIElmIHRoZXkgY2hhbmdlIHRoZXNlIHRhYmxlIG9wdGlvbnMsIHdlIG5lZWQgdG8gcmVzZXQgZGVmYXVsdHNcclxuICAgICAgLy8gb3IgZWxzZSB3ZSBjb3VsZCBnZXQgaW50byBhIHN0YXRlIHdoZXJlIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSBVSVxyXG4gICAgICAvLyBhbmQgdGhlbiBkaXNhYmxlZCB0aGUgYWJpbGl0eSB0byBjaGFuZ2UgaXQgYmFjay5cclxuICAgICAgLy8gZS5nLiBJZiBgZmlsdGVyYWJsZWAgaGFzIGNoYW5nZWQsIHNldCBgZmlsdGVyZWQgPSBkZWZhdWx0RmlsdGVyZWRgXHJcbiAgICAgIGNvbnN0IHJlc2V0dGFibGVPcHRpb25zID0gWydzb3J0YWJsZScsICdmaWx0ZXJhYmxlJywgJ3Jlc2l6YWJsZSddXHJcbiAgICAgIHJlc2V0dGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgaWYgKG9sZFN0YXRlW3hdICE9PSBuZXdTdGF0ZVt4XSkge1xyXG4gICAgICAgICAgY29uc3QgYmFzZU5hbWUgPSB4LnJlcGxhY2UoJ2FibGUnLCAnJylcclxuICAgICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBgJHtiYXNlTmFtZX1lZGBcclxuICAgICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gYGRlZmF1bHQke29wdGlvbk5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBvcHRpb25OYW1lLnNsaWNlKDEpfWBcclxuICAgICAgICAgIG5ld1N0YXRlW29wdGlvbk5hbWVdID0gbmV3U3RhdGVbZGVmYXVsdE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgLy8gUHJvcHMgdGhhdCB0cmlnZ2VyIGEgZGF0YSB1cGRhdGVcclxuICAgICAgaWYgKFxyXG4gICAgICAgIG9sZFN0YXRlLmRhdGEgIT09IG5ld1N0YXRlLmRhdGEgfHxcclxuICAgICAgICBvbGRTdGF0ZS5jb2x1bW5zICE9PSBuZXdTdGF0ZS5jb2x1bW5zIHx8XHJcbiAgICAgICAgb2xkU3RhdGUucGl2b3RCeSAhPT0gbmV3U3RhdGUucGl2b3RCeSB8fFxyXG4gICAgICAgIG9sZFN0YXRlLnNvcnRlZCAhPT0gbmV3U3RhdGUuc29ydGVkIHx8XHJcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1N0YXRlLmZpbHRlcmVkXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh0aGlzLmdldERhdGFNb2RlbChuZXdTdGF0ZSwgb2xkU3RhdGUuZGF0YSAhPT0gbmV3U3RhdGUuZGF0YSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVOZXdSZXNvbHZlZFN0YXRlIChkYXRhTW9kZWwpIHtcclxuICAgICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxyXG4gICAgICBjb25zdCBuZXdSZXNvbHZlZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKHt9LCBkYXRhTW9kZWwpXHJcbiAgICAgIGNvbnN0IHsgZnJlZXplV2hlbkV4cGFuZGVkIH0gPSBuZXdSZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgICAvLyBEZWZhdWx0IHRvIHVuZnJvemVuIHN0YXRlXHJcbiAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gZmFsc2VcclxuXHJcbiAgICAgIC8vIElmIGZyZWV6ZVdoZW5FeHBhbmRlZCBpcyBzZXQsIGNoZWNrIGZvciBmcm96ZW4gY29uZGl0aW9uc1xyXG4gICAgICBpZiAoZnJlZXplV2hlbkV4cGFuZGVkKSB7XHJcbiAgICAgICAgLy8gaWYgYW55IHJvd3MgYXJlIGV4cGFuZGVkLCBmcmVlemUgdGhlIGV4aXN0aW5nIGRhdGEgYW5kIHNvcnRpbmdcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobmV3UmVzb2x2ZWRTdGF0ZS5leHBhbmRlZClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGlmIChuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkW2tleXNbaV1dKSB7XHJcbiAgICAgICAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gdHJ1ZVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGRhdGEgaXNuJ3QgZnJvemVuIGFuZCBlaXRoZXIgdGhlIGRhdGEgb3JcclxuICAgICAgLy8gc29ydGluZyBtb2RlbCBoYXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBkYXRhXHJcbiAgICAgIGlmIChcclxuICAgICAgICAob2xkU3RhdGUuZnJvemVuICYmICFuZXdSZXNvbHZlZFN0YXRlLmZyb3plbikgfHxcclxuICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XHJcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQgfHxcclxuICAgICAgICBvbGRTdGF0ZS5zaG93RmlsdGVycyAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5zaG93RmlsdGVycyB8fFxyXG4gICAgICAgICghbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gJiYgb2xkU3RhdGUucmVzb2x2ZWREYXRhICE9PSBuZXdSZXNvbHZlZFN0YXRlLnJlc29sdmVkRGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gSGFuZGxlIGNvbGxhcHNlT25zb3J0ZWRDaGFuZ2UgJiBjb2xsYXBzZU9uRGF0YUNoYW5nZVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkICYmIHRoaXMucHJvcHMuY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UpIHx8XHJcbiAgICAgICAgICBvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZCB8fFxyXG4gICAgICAgICAgb2xkU3RhdGUuc2hvd0ZpbHRlcnMgIT09IG5ld1Jlc29sdmVkU3RhdGUuc2hvd0ZpbHRlcnMgfHxcclxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWREYXRhICYmXHJcbiAgICAgICAgICAgICFuZXdSZXNvbHZlZFN0YXRlLmZyb3plbiAmJlxyXG4gICAgICAgICAgICBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhICYmXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29sbGFwc2VPbkRhdGFDaGFuZ2UpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkID0ge31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24obmV3UmVzb2x2ZWRTdGF0ZSwgdGhpcy5nZXRTb3J0ZWREYXRhKG5ld1Jlc29sdmVkU3RhdGUpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTZXQgcGFnZSB0byAwIGlmIGZpbHRlcnMgY2hhbmdlXHJcbiAgICAgIGlmIChvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZCkge1xyXG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA9IDBcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2FsY3VsYXRlIHBhZ2VTaXplIGFsbCB0aGUgdGltZVxyXG4gICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhKSB7XHJcbiAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlcyA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsXHJcbiAgICAgICAgICA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZXNcclxuICAgICAgICAgIDogTWF0aC5jZWlsKG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkRGF0YS5sZW5ndGggLyBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplKVxyXG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlIDogTWF0aC5tYXgoXHJcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPj0gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlc1xyXG4gICAgICAgICAgICA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZXMgLSAxXHJcbiAgICAgICAgICAgIDogbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlLFxyXG4gICAgICAgICAgMFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG5ld1Jlc29sdmVkU3RhdGVcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGF0ZVdpdGhEYXRhIChkYXRhTW9kZWwsIGNiKSB7XHJcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgICAgY29uc3QgbmV3UmVzb2x2ZWRTdGF0ZSA9IHRoaXMuY2FsY3VsYXRlTmV3UmVzb2x2ZWRTdGF0ZShkYXRhTW9kZWwpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZShuZXdSZXNvbHZlZFN0YXRlLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICBjYigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2UgIT09IG5ld1Jlc29sdmVkU3RhdGUucGFnZSB8fFxyXG4gICAgICAgICAgb2xkU3RhdGUucGFnZVNpemUgIT09IG5ld1Jlc29sdmVkU3RhdGUucGFnZVNpemUgfHxcclxuICAgICAgICAgIG9sZFN0YXRlLnNvcnRlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWQgfHxcclxuICAgICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICB0aGlzLmZpcmVGZXRjaERhdGEoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbiJdfQ==