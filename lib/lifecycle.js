'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Base) {
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
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOlsicHJvcHMiLCJkZWZhdWx0U3RhdGUiLCJwYWdlIiwiZGVmYXVsdFBhZ2UiLCJwYWdlU2l6ZSIsImRlZmF1bHRQYWdlU2l6ZSIsInNvcnRlZCIsImRlZmF1bHRTb3J0ZWQiLCJleHBhbmRlZCIsImRlZmF1bHRFeHBhbmRlZCIsImZpbHRlcmVkIiwiZGVmYXVsdEZpbHRlcmVkIiwicmVzaXplZCIsImRlZmF1bHRSZXNpemVkIiwiY3VycmVudGx5UmVzaXppbmciLCJza2lwTmV4dFNvcnQiLCJyZXNvbHZlZFN0YXRlIiwiZ2V0UmVzb2x2ZWRTdGF0ZSIsImRhdGFNb2RlbCIsImdldERhdGFNb2RlbCIsInN0YXRlIiwiY2FsY3VsYXRlTmV3UmVzb2x2ZWRTdGF0ZSIsImZpcmVGZXRjaERhdGEiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJvbGRTdGF0ZSIsIm5ld1N0YXRlIiwiZGVmYXVsdGFibGVPcHRpb25zIiwiZm9yRWFjaCIsImRlZmF1bHROYW1lIiwieCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJKU09OIiwic3RyaW5naWZ5IiwicmVzZXR0YWJsZU9wdGlvbnMiLCJiYXNlTmFtZSIsInJlcGxhY2UiLCJvcHRpb25OYW1lIiwiZGF0YSIsImNvbHVtbnMiLCJwaXZvdEJ5Iiwic2V0U3RhdGVXaXRoRGF0YSIsIm5ld1Jlc29sdmVkU3RhdGUiLCJmcmVlemVXaGVuRXhwYW5kZWQiLCJmcm96ZW4iLCJrZXlzIiwiT2JqZWN0IiwiaSIsImxlbmd0aCIsInNob3dGaWx0ZXJzIiwicmVzb2x2ZWREYXRhIiwiY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UiLCJzb3J0ZWREYXRhIiwiY29sbGFwc2VPbkRhdGFDaGFuZ2UiLCJhc3NpZ24iLCJnZXRTb3J0ZWREYXRhIiwicGFnZXMiLCJtYW51YWwiLCJNYXRoIiwiY2VpbCIsIm1heCIsImNiIiwic2V0U3RhdGUiLCJCYXNlIl0sIm1hcHBpbmdzIjoi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QUFMLENBQWNwQixnQkFBZCxFQUFnQyxZQUFNO0FBQzNDLGNBQUltQixFQUFKLEVBQVE7QUFDTkE7QUFDRDtBQUNELGNBQ0V0QyxTQUFTdkIsSUFBVCxLQUFrQjBDLGlCQUFpQjFDLElBQW5DLElBQ0F1QixTQUFTckIsUUFBVCxLQUFzQndDLGlCQUFpQnhDLFFBRHZDLElBRUFxQixTQUFTbkIsTUFBVCxLQUFvQnNDLGlCQUFpQnRDLE1BRnJDLElBR0FtQixTQUFTZixRQUFULEtBQXNCa0MsaUJBQWlCbEMsUUFKekMsRUFLRTtBQUNBLG1CQUFLWSxhQUFMO0FBQ0Q7QUFDRixTQVpNLENBQVA7QUFhRDtBQXBKVTs7QUFBQTtBQUFBLElBQ0MyQyxJQUREO0FBQUEsQyIsImZpbGUiOiJsaWZlY3ljbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBCYXNlID0+XG4gIGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcblxuICAgICAgY29uc3QgZGVmYXVsdFN0YXRlID0ge1xuICAgICAgICBwYWdlOiBwcm9wcy5kZWZhdWx0UGFnZSxcbiAgICAgICAgcGFnZVNpemU6IHByb3BzLmRlZmF1bHRQYWdlU2l6ZSxcbiAgICAgICAgc29ydGVkOiBwcm9wcy5kZWZhdWx0U29ydGVkLFxuICAgICAgICBleHBhbmRlZDogcHJvcHMuZGVmYXVsdEV4cGFuZGVkLFxuICAgICAgICBmaWx0ZXJlZDogcHJvcHMuZGVmYXVsdEZpbHRlcmVkLFxuICAgICAgICByZXNpemVkOiBwcm9wcy5kZWZhdWx0UmVzaXplZCxcbiAgICAgICAgY3VycmVudGx5UmVzaXppbmc6IGZhbHNlLFxuICAgICAgICBza2lwTmV4dFNvcnQ6IGZhbHNlLFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZShwcm9wcywgZGVmYXVsdFN0YXRlKVxuICAgICAgY29uc3QgZGF0YU1vZGVsID0gdGhpcy5nZXREYXRhTW9kZWwocmVzb2x2ZWRTdGF0ZSwgdHJ1ZSlcblxuICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuY2FsY3VsYXRlTmV3UmVzb2x2ZWRTdGF0ZShkYXRhTW9kZWwpXG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgICAgdGhpcy5maXJlRmV0Y2hEYXRhKClcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSlcbiAgICAgIGNvbnN0IG5ld1N0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpXG5cbiAgICAgIC8vIERvIGEgZGVlcCBjb21wYXJlIG9mIG5ldyBhbmQgb2xkIGBkZWZhdWx0T3B0aW9uYCBhbmRcbiAgICAgIC8vIGlmIHRoZXkgYXJlIGRpZmZlcmVudCByZXNldCBgb3B0aW9uID0gZGVmYXVsdE9wdGlvbmBcbiAgICAgIGNvbnN0IGRlZmF1bHRhYmxlT3B0aW9ucyA9IFsnc29ydGVkJywgJ2ZpbHRlcmVkJywgJ3Jlc2l6ZWQnLCAnZXhwYW5kZWQnXVxuICAgICAgZGVmYXVsdGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gYGRlZmF1bHQke3guY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB4LnNsaWNlKDEpfWBcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KG9sZFN0YXRlW2RlZmF1bHROYW1lXSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlW2RlZmF1bHROYW1lXSkpIHtcbiAgICAgICAgICBuZXdTdGF0ZVt4XSA9IG5ld1N0YXRlW2RlZmF1bHROYW1lXVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBJZiB0aGV5IGNoYW5nZSB0aGVzZSB0YWJsZSBvcHRpb25zLCB3ZSBuZWVkIHRvIHJlc2V0IGRlZmF1bHRzXG4gICAgICAvLyBvciBlbHNlIHdlIGNvdWxkIGdldCBpbnRvIGEgc3RhdGUgd2hlcmUgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIFVJXG4gICAgICAvLyBhbmQgdGhlbiBkaXNhYmxlZCB0aGUgYWJpbGl0eSB0byBjaGFuZ2UgaXQgYmFjay5cbiAgICAgIC8vIGUuZy4gSWYgYGZpbHRlcmFibGVgIGhhcyBjaGFuZ2VkLCBzZXQgYGZpbHRlcmVkID0gZGVmYXVsdEZpbHRlcmVkYFxuICAgICAgY29uc3QgcmVzZXR0YWJsZU9wdGlvbnMgPSBbJ3NvcnRhYmxlJywgJ2ZpbHRlcmFibGUnLCAncmVzaXphYmxlJ11cbiAgICAgIHJlc2V0dGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGlmIChvbGRTdGF0ZVt4XSAhPT0gbmV3U3RhdGVbeF0pIHtcbiAgICAgICAgICBjb25zdCBiYXNlTmFtZSA9IHgucmVwbGFjZSgnYWJsZScsICcnKVxuICAgICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBgJHtiYXNlTmFtZX1lZGBcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IGBkZWZhdWx0JHtvcHRpb25OYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgb3B0aW9uTmFtZS5zbGljZSgxKX1gXG4gICAgICAgICAgbmV3U3RhdGVbb3B0aW9uTmFtZV0gPSBuZXdTdGF0ZVtkZWZhdWx0TmFtZV1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gUHJvcHMgdGhhdCB0cmlnZ2VyIGEgZGF0YSB1cGRhdGVcbiAgICAgIGlmIChcbiAgICAgICAgb2xkU3RhdGUuZGF0YSAhPT0gbmV3U3RhdGUuZGF0YSB8fFxuICAgICAgICBvbGRTdGF0ZS5jb2x1bW5zICE9PSBuZXdTdGF0ZS5jb2x1bW5zIHx8XG4gICAgICAgIG9sZFN0YXRlLnBpdm90QnkgIT09IG5ld1N0YXRlLnBpdm90QnkgfHxcbiAgICAgICAgb2xkU3RhdGUuc29ydGVkICE9PSBuZXdTdGF0ZS5zb3J0ZWQgfHxcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1N0YXRlLmZpbHRlcmVkXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHRoaXMuZ2V0RGF0YU1vZGVsKG5ld1N0YXRlLCBvbGRTdGF0ZS5kYXRhICE9PSBuZXdTdGF0ZS5kYXRhKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxjdWxhdGVOZXdSZXNvbHZlZFN0YXRlIChkYXRhTW9kZWwpIHtcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcbiAgICAgIGNvbnN0IG5ld1Jlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoe30sIGRhdGFNb2RlbClcbiAgICAgIGNvbnN0IHsgZnJlZXplV2hlbkV4cGFuZGVkIH0gPSBuZXdSZXNvbHZlZFN0YXRlXG5cbiAgICAgIC8vIERlZmF1bHQgdG8gdW5mcm96ZW4gc3RhdGVcbiAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gZmFsc2VcblxuICAgICAgLy8gSWYgZnJlZXplV2hlbkV4cGFuZGVkIGlzIHNldCwgY2hlY2sgZm9yIGZyb3plbiBjb25kaXRpb25zXG4gICAgICBpZiAoZnJlZXplV2hlbkV4cGFuZGVkKSB7XG4gICAgICAgIC8vIGlmIGFueSByb3dzIGFyZSBleHBhbmRlZCwgZnJlZXplIHRoZSBleGlzdGluZyBkYXRhIGFuZCBzb3J0aW5nXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5leHBhbmRlZFtrZXlzW2ldXSkge1xuICAgICAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gPSB0cnVlXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgZGF0YSBpc24ndCBmcm96ZW4gYW5kIGVpdGhlciB0aGUgZGF0YSBvclxuICAgICAgLy8gc29ydGluZyBtb2RlbCBoYXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBkYXRhXG4gICAgICBpZiAoXG4gICAgICAgIChvbGRTdGF0ZS5mcm96ZW4gJiYgIW5ld1Jlc29sdmVkU3RhdGUuZnJvemVuKSB8fFxuICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XG4gICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkIHx8XG4gICAgICAgIG9sZFN0YXRlLnNob3dGaWx0ZXJzICE9PSBuZXdSZXNvbHZlZFN0YXRlLnNob3dGaWx0ZXJzIHx8XG4gICAgICAgICghbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gJiYgb2xkU3RhdGUucmVzb2x2ZWREYXRhICE9PSBuZXdSZXNvbHZlZFN0YXRlLnJlc29sdmVkRGF0YSlcbiAgICAgICkge1xuICAgICAgICAvLyBIYW5kbGUgY29sbGFwc2VPbnNvcnRlZENoYW5nZSAmIGNvbGxhcHNlT25EYXRhQ2hhbmdlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAob2xkU3RhdGUuc29ydGVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLnNvcnRlZCAmJiB0aGlzLnByb3BzLmNvbGxhcHNlT25Tb3J0aW5nQ2hhbmdlKSB8fFxuICAgICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkIHx8XG4gICAgICAgICAgb2xkU3RhdGUuc2hvd0ZpbHRlcnMgIT09IG5ld1Jlc29sdmVkU3RhdGUuc2hvd0ZpbHRlcnMgfHxcbiAgICAgICAgICAob2xkU3RhdGUuc29ydGVkRGF0YSAmJlxuICAgICAgICAgICAgIW5ld1Jlc29sdmVkU3RhdGUuZnJvemVuICYmXG4gICAgICAgICAgICBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhICYmXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbGxhcHNlT25EYXRhQ2hhbmdlKVxuICAgICAgICApIHtcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24obmV3UmVzb2x2ZWRTdGF0ZSwgdGhpcy5nZXRTb3J0ZWREYXRhKG5ld1Jlc29sdmVkU3RhdGUpKVxuICAgICAgfVxuXG4gICAgICAvLyBTZXQgcGFnZSB0byAwIGlmIGZpbHRlcnMgY2hhbmdlXG4gICAgICBpZiAob2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQpIHtcbiAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlID0gMFxuICAgICAgfVxuXG4gICAgICAvLyBDYWxjdWxhdGUgcGFnZVNpemUgYWxsIHRoZSB0aW1lXG4gICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhKSB7XG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZXMgPSBuZXdSZXNvbHZlZFN0YXRlLm1hbnVhbFxuICAgICAgICAgID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlc1xuICAgICAgICAgIDogTWF0aC5jZWlsKG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkRGF0YS5sZW5ndGggLyBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplKVxuICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPSBuZXdSZXNvbHZlZFN0YXRlLm1hbnVhbCA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZSA6IE1hdGgubWF4KFxuICAgICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA+PSBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VzXG4gICAgICAgICAgICA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZXMgLSAxXG4gICAgICAgICAgICA6IG5ld1Jlc29sdmVkU3RhdGUucGFnZSxcbiAgICAgICAgICAwXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld1Jlc29sdmVkU3RhdGVcbiAgICB9XG5cbiAgICBzZXRTdGF0ZVdpdGhEYXRhIChkYXRhTW9kZWwsIGNiKSB7XG4gICAgICBjb25zdCBvbGRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpXG4gICAgICBjb25zdCBuZXdSZXNvbHZlZFN0YXRlID0gdGhpcy5jYWxjdWxhdGVOZXdSZXNvbHZlZFN0YXRlKGRhdGFNb2RlbClcblxuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUobmV3UmVzb2x2ZWRTdGF0ZSwgKCkgPT4ge1xuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjYigpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2UgIT09IG5ld1Jlc29sdmVkU3RhdGUucGFnZSB8fFxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2VTaXplICE9PSBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplIHx8XG4gICAgICAgICAgb2xkU3RhdGUuc29ydGVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLnNvcnRlZCB8fFxuICAgICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdSZXNvbHZlZFN0YXRlLmZpbHRlcmVkXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZmlyZUZldGNoRGF0YSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG4iXX0=