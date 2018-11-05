var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export default (function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.setStateWithData(this.getDataModel(this.getResolvedState(), true));
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.fireFetchData();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps, nextState) {
        var oldState = this.getResolvedState();
        var newState = this.getResolvedState(nextProps, nextState);

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
      key: 'setStateWithData',
      value: function setStateWithData(newState, cb) {
        var _this2 = this;

        var oldState = this.getResolvedState();
        var newResolvedState = this.getResolvedState({}, newState);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOlsic2V0U3RhdGVXaXRoRGF0YSIsImdldERhdGFNb2RlbCIsImdldFJlc29sdmVkU3RhdGUiLCJmaXJlRmV0Y2hEYXRhIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwib2xkU3RhdGUiLCJuZXdTdGF0ZSIsImRlZmF1bHRhYmxlT3B0aW9ucyIsImZvckVhY2giLCJkZWZhdWx0TmFtZSIsIngiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc2V0dGFibGVPcHRpb25zIiwiYmFzZU5hbWUiLCJyZXBsYWNlIiwib3B0aW9uTmFtZSIsImRhdGEiLCJjb2x1bW5zIiwicGl2b3RCeSIsInNvcnRlZCIsImZpbHRlcmVkIiwiY2IiLCJuZXdSZXNvbHZlZFN0YXRlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwiZnJvemVuIiwia2V5cyIsIk9iamVjdCIsImV4cGFuZGVkIiwiaSIsImxlbmd0aCIsInNob3dGaWx0ZXJzIiwicmVzb2x2ZWREYXRhIiwicHJvcHMiLCJjb2xsYXBzZU9uU29ydGluZ0NoYW5nZSIsInNvcnRlZERhdGEiLCJjb2xsYXBzZU9uRGF0YUNoYW5nZSIsImFzc2lnbiIsImdldFNvcnRlZERhdGEiLCJwYWdlIiwicGFnZXMiLCJtYW51YWwiLCJNYXRoIiwiY2VpbCIsInBhZ2VTaXplIiwibWF4Iiwic2V0U3RhdGUiLCJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLGdCQUFlO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJDQUVXO0FBQ3BCLGFBQUtBLGdCQUFMLENBQXNCLEtBQUtDLFlBQUwsQ0FBa0IsS0FBS0MsZ0JBQUwsRUFBbEIsRUFBMkMsSUFBM0MsQ0FBdEI7QUFDRDtBQUpVO0FBQUE7QUFBQSwwQ0FNVTtBQUNuQixhQUFLQyxhQUFMO0FBQ0Q7QUFSVTtBQUFBO0FBQUEsZ0RBVWdCQyxTQVZo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QUFLRyxHQUFMLENBQ3hFdEIsaUJBQWlCZ0IsSUFBakIsSUFBeUJoQixpQkFBaUJpQixLQUExQyxHQUNJakIsaUJBQWlCaUIsS0FBakIsR0FBeUIsQ0FEN0IsR0FFSWpCLGlCQUFpQmdCLElBSG1ELEVBSXhFLENBSndFLENBQTFFO0FBTUQ7O0FBRUQsZUFBTyxLQUFLTyxRQUFMLENBQWN2QixnQkFBZCxFQUFnQyxZQUFNO0FBQzNDLGNBQUlELEVBQUosRUFBUTtBQUNOQTtBQUNEO0FBQ0QsY0FDRXBCLFNBQVNxQyxJQUFULEtBQWtCaEIsaUJBQWlCZ0IsSUFBbkMsSUFDQXJDLFNBQVMwQyxRQUFULEtBQXNCckIsaUJBQWlCcUIsUUFEdkMsSUFFQTFDLFNBQVNrQixNQUFULEtBQW9CRyxpQkFBaUJILE1BRnJDLElBR0FsQixTQUFTbUIsUUFBVCxLQUFzQkUsaUJBQWlCRixRQUp6QyxFQUtFO0FBQ0EsbUJBQUt0QixhQUFMO0FBQ0Q7QUFDRixTQVpNLENBQVA7QUFhRDtBQTlIVTs7QUFBQTtBQUFBLElBQ0NnRCxJQUREO0FBQUEsQ0FBZiIsImZpbGUiOiJsaWZlY3ljbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBCYXNlID0+XHJcbiAgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGVXaXRoRGF0YSh0aGlzLmdldERhdGFNb2RlbCh0aGlzLmdldFJlc29sdmVkU3RhdGUoKSwgdHJ1ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQgKCkge1xyXG4gICAgICB0aGlzLmZpcmVGZXRjaERhdGEoKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpXHJcblxyXG4gICAgICAvLyBEbyBhIGRlZXAgY29tcGFyZSBvZiBuZXcgYW5kIG9sZCBgZGVmYXVsdE9wdGlvbmAgYW5kXHJcbiAgICAgIC8vIGlmIHRoZXkgYXJlIGRpZmZlcmVudCByZXNldCBgb3B0aW9uID0gZGVmYXVsdE9wdGlvbmBcclxuICAgICAgY29uc3QgZGVmYXVsdGFibGVPcHRpb25zID0gWydzb3J0ZWQnLCAnZmlsdGVyZWQnLCAncmVzaXplZCcsICdleHBhbmRlZCddXHJcbiAgICAgIGRlZmF1bHRhYmxlT3B0aW9ucy5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gYGRlZmF1bHQke3guY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB4LnNsaWNlKDEpfWBcclxuICAgICAgICBpZiAoSlNPTi5zdHJpbmdpZnkob2xkU3RhdGVbZGVmYXVsdE5hbWVdKSAhPT0gSlNPTi5zdHJpbmdpZnkobmV3U3RhdGVbZGVmYXVsdE5hbWVdKSkge1xyXG4gICAgICAgICAgbmV3U3RhdGVbeF0gPSBuZXdTdGF0ZVtkZWZhdWx0TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBJZiB0aGV5IGNoYW5nZSB0aGVzZSB0YWJsZSBvcHRpb25zLCB3ZSBuZWVkIHRvIHJlc2V0IGRlZmF1bHRzXHJcbiAgICAgIC8vIG9yIGVsc2Ugd2UgY291bGQgZ2V0IGludG8gYSBzdGF0ZSB3aGVyZSB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgVUlcclxuICAgICAgLy8gYW5kIHRoZW4gZGlzYWJsZWQgdGhlIGFiaWxpdHkgdG8gY2hhbmdlIGl0IGJhY2suXHJcbiAgICAgIC8vIGUuZy4gSWYgYGZpbHRlcmFibGVgIGhhcyBjaGFuZ2VkLCBzZXQgYGZpbHRlcmVkID0gZGVmYXVsdEZpbHRlcmVkYFxyXG4gICAgICBjb25zdCByZXNldHRhYmxlT3B0aW9ucyA9IFsnc29ydGFibGUnLCAnZmlsdGVyYWJsZScsICdyZXNpemFibGUnXVxyXG4gICAgICByZXNldHRhYmxlT3B0aW9ucy5mb3JFYWNoKHggPT4ge1xyXG4gICAgICAgIGlmIChvbGRTdGF0ZVt4XSAhPT0gbmV3U3RhdGVbeF0pIHtcclxuICAgICAgICAgIGNvbnN0IGJhc2VOYW1lID0geC5yZXBsYWNlKCdhYmxlJywgJycpXHJcbiAgICAgICAgICBjb25zdCBvcHRpb25OYW1lID0gYCR7YmFzZU5hbWV9ZWRgXHJcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IGBkZWZhdWx0JHtvcHRpb25OYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgb3B0aW9uTmFtZS5zbGljZSgxKX1gXHJcbiAgICAgICAgICBuZXdTdGF0ZVtvcHRpb25OYW1lXSA9IG5ld1N0YXRlW2RlZmF1bHROYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIC8vIFByb3BzIHRoYXQgdHJpZ2dlciBhIGRhdGEgdXBkYXRlXHJcbiAgICAgIGlmIChcclxuICAgICAgICBvbGRTdGF0ZS5kYXRhICE9PSBuZXdTdGF0ZS5kYXRhIHx8XHJcbiAgICAgICAgb2xkU3RhdGUuY29sdW1ucyAhPT0gbmV3U3RhdGUuY29sdW1ucyB8fFxyXG4gICAgICAgIG9sZFN0YXRlLnBpdm90QnkgIT09IG5ld1N0YXRlLnBpdm90QnkgfHxcclxuICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1N0YXRlLnNvcnRlZCB8fFxyXG4gICAgICAgIG9sZFN0YXRlLmZpbHRlcmVkICE9PSBuZXdTdGF0ZS5maWx0ZXJlZFxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlV2l0aERhdGEodGhpcy5nZXREYXRhTW9kZWwobmV3U3RhdGUsIG9sZFN0YXRlLmRhdGEgIT09IG5ld1N0YXRlLmRhdGEpKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhdGVXaXRoRGF0YSAobmV3U3RhdGUsIGNiKSB7XHJcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcclxuICAgICAgY29uc3QgbmV3UmVzb2x2ZWRTdGF0ZSA9IHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSh7fSwgbmV3U3RhdGUpXHJcbiAgICAgIGNvbnN0IHsgZnJlZXplV2hlbkV4cGFuZGVkIH0gPSBuZXdSZXNvbHZlZFN0YXRlXHJcblxyXG4gICAgICAvLyBEZWZhdWx0IHRvIHVuZnJvemVuIHN0YXRlXHJcbiAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gZmFsc2VcclxuXHJcbiAgICAgIC8vIElmIGZyZWV6ZVdoZW5FeHBhbmRlZCBpcyBzZXQsIGNoZWNrIGZvciBmcm96ZW4gY29uZGl0aW9uc1xyXG4gICAgICBpZiAoZnJlZXplV2hlbkV4cGFuZGVkKSB7XHJcbiAgICAgICAgLy8gaWYgYW55IHJvd3MgYXJlIGV4cGFuZGVkLCBmcmVlemUgdGhlIGV4aXN0aW5nIGRhdGEgYW5kIHNvcnRpbmdcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobmV3UmVzb2x2ZWRTdGF0ZS5leHBhbmRlZClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgIGlmIChuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkW2tleXNbaV1dKSB7XHJcbiAgICAgICAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZnJvemVuID0gdHJ1ZVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGRhdGEgaXNuJ3QgZnJvemVuIGFuZCBlaXRoZXIgdGhlIGRhdGEgb3JcclxuICAgICAgLy8gc29ydGluZyBtb2RlbCBoYXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBkYXRhXHJcbiAgICAgIGlmIChcclxuICAgICAgICAob2xkU3RhdGUuZnJvemVuICYmICFuZXdSZXNvbHZlZFN0YXRlLmZyb3plbikgfHxcclxuICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XHJcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQgfHxcclxuICAgICAgICBvbGRTdGF0ZS5zaG93RmlsdGVycyAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5zaG93RmlsdGVycyB8fFxyXG4gICAgICAgICghbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gJiYgb2xkU3RhdGUucmVzb2x2ZWREYXRhICE9PSBuZXdSZXNvbHZlZFN0YXRlLnJlc29sdmVkRGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gSGFuZGxlIGNvbGxhcHNlT25zb3J0ZWRDaGFuZ2UgJiBjb2xsYXBzZU9uRGF0YUNoYW5nZVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkICYmIHRoaXMucHJvcHMuY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UpIHx8XHJcbiAgICAgICAgICBvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZCB8fFxyXG4gICAgICAgICAgb2xkU3RhdGUuc2hvd0ZpbHRlcnMgIT09IG5ld1Jlc29sdmVkU3RhdGUuc2hvd0ZpbHRlcnMgfHxcclxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWREYXRhICYmXHJcbiAgICAgICAgICAgICFuZXdSZXNvbHZlZFN0YXRlLmZyb3plbiAmJlxyXG4gICAgICAgICAgICBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhICYmXHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29sbGFwc2VPbkRhdGFDaGFuZ2UpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkID0ge31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24obmV3UmVzb2x2ZWRTdGF0ZSwgdGhpcy5nZXRTb3J0ZWREYXRhKG5ld1Jlc29sdmVkU3RhdGUpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTZXQgcGFnZSB0byAwIGlmIGZpbHRlcnMgY2hhbmdlXHJcbiAgICAgIGlmIChvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZCkge1xyXG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA9IDBcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2FsY3VsYXRlIHBhZ2VTaXplIGFsbCB0aGUgdGltZVxyXG4gICAgICBpZiAobmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhKSB7XHJcbiAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlcyA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsXHJcbiAgICAgICAgICA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZXNcclxuICAgICAgICAgIDogTWF0aC5jZWlsKG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkRGF0YS5sZW5ndGggLyBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplKVxyXG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlIDogTWF0aC5tYXgoXHJcbiAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPj0gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlc1xyXG4gICAgICAgICAgICA/IG5ld1Jlc29sdmVkU3RhdGUucGFnZXMgLSAxXHJcbiAgICAgICAgICAgIDogbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlLFxyXG4gICAgICAgICAgMFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUobmV3UmVzb2x2ZWRTdGF0ZSwgKCkgPT4ge1xyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgY2IoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBvbGRTdGF0ZS5wYWdlICE9PSBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgfHxcclxuICAgICAgICAgIG9sZFN0YXRlLnBhZ2VTaXplICE9PSBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VTaXplIHx8XHJcbiAgICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XHJcbiAgICAgICAgICBvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgdGhpcy5maXJlRmV0Y2hEYXRhKClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG4iXX0=