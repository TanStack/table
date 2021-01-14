'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactIs = require('react-is');

var ReactIs = _interopRequireWildcard(_reactIs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

//
exports.default = {
  get: get,
  set: set,
  takeRight: takeRight,
  last: last,
  orderBy: orderBy,
  range: range,
  remove: remove,
  clone: clone,
  getFirstDefined: getFirstDefined,
  sum: sum,
  makeTemplateComponent: makeTemplateComponent,
  groupBy: groupBy,
  isArray: isArray,
  splitProps: splitProps,
  compactObject: compactObject,
  isSortingDesc: isSortingDesc,
  normalizeComponent: normalizeComponent,
  asPx: asPx
};


function get(obj, path, def) {
  if (!path) {
    return obj;
  }
  var pathObj = makePathArray(path);
  var val = void 0;
  try {
    val = pathObj.reduce(function (current, pathPart) {
      return current[pathPart];
    }, obj);
  } catch (e) {
    // continue regardless of error
  }
  return typeof val !== 'undefined' ? val : def;
}

function set() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var path = arguments[1];
  var value = arguments[2];

  var keys = makePathArray(path);
  var keyPart = void 0;
  var cursor = obj;
  while ((keyPart = keys.shift()) && keys.length) {
    if (!cursor[keyPart]) {
      cursor[keyPart] = {};
    }
    cursor = cursor[keyPart];
  }
  cursor[keyPart] = value;
  return obj;
}

function takeRight(arr, n) {
  var start = n > arr.length ? 0 : arr.length - n;
  return arr.slice(start);
}

function last(arr) {
  return arr[arr.length - 1];
}

function range(n) {
  var arr = [];
  for (var i = 0; i < n; i += 1) {
    arr.push(n);
  }
  return arr;
}

function orderBy(arr, funcs, dirs, indexKey) {
  return arr.sort(function (rowA, rowB) {
    for (var i = 0; i < funcs.length; i += 1) {
      var comp = funcs[i];
      var desc = dirs[i] === false || dirs[i] === 'desc';
      var sortInt = comp(rowA, rowB);
      if (sortInt) {
        return desc ? -sortInt : sortInt;
      }
    }
    // Use the row index for tie breakers
    return dirs[0] ? rowA[indexKey] - rowB[indexKey] : rowB[indexKey] - rowA[indexKey];
  });
}

function remove(a, b) {
  return a.filter(function (o, i) {
    var r = b(o);
    if (r) {
      a.splice(i, 1);
      return true;
    }
    return false;
  });
}

function clone(a) {
  try {
    return JSON.parse(JSON.stringify(a, function (key, value) {
      if (typeof value === 'function') {
        return value.toString();
      }
      return value;
    }));
  } catch (e) {
    return a;
  }
}

function getFirstDefined() {
  for (var i = 0; i < arguments.length; i += 1) {
    if (typeof (arguments.length <= i ? undefined : arguments[i]) !== 'undefined') {
      return arguments.length <= i ? undefined : arguments[i];
    }
  }
}

function sum(arr) {
  return arr.reduce(function (a, b) {
    return a + b;
  }, 0);
}

function makeTemplateComponent(compClass, displayName) {
  if (!displayName) {
    throw new Error('No displayName found for template component:', compClass);
  }
  var cmp = function cmp(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['children', 'className']);

    return _react2.default.createElement(
      'div',
      _extends({ className: (0, _classnames2.default)(compClass, className) }, rest),
      children
    );
  };
  cmp.displayName = displayName;
  return cmp;
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x, i) {
    var resKey = typeof key === 'function' ? key(x, i) : x[key];
    rv[resKey] = isArray(rv[resKey]) ? rv[resKey] : [];
    rv[resKey].push(x);
    return rv;
  }, {});
}

function asPx(value) {
  value = Number(value);
  return Number.isNaN(value) ? null : value + 'px';
}

function isArray(a) {
  return Array.isArray(a);
}

// ########################################################################
// Non-exported Helpers
// ########################################################################

function makePathArray(obj) {
  return flattenDeep(obj).join('.').replace(/\[/g, '.').replace(/\]/g, '').split('.');
}

function flattenDeep(arr) {
  var newArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!isArray(arr)) {
    newArr.push(arr);
  } else {
    for (var i = 0; i < arr.length; i += 1) {
      flattenDeep(arr[i], newArr);
    }
  }
  return newArr;
}

function splitProps(_ref2) {
  var className = _ref2.className,
      style = _ref2.style,
      rest = _objectWithoutProperties(_ref2, ['className', 'style']);

  return {
    className: className,
    style: style,
    rest: rest || {}
  };
}

function compactObject(obj) {
  var newObj = {};
  if (obj) {
    Object.keys(obj).map(function (key) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined && typeof obj[key] !== 'undefined') {
        newObj[key] = obj[key];
      }
      return true;
    });
  }
  return newObj;
}

function isSortingDesc(d) {
  return !!(d.sort === 'desc' || d.desc === true || d.asc === false);
}

function normalizeComponent(Comp, props) {
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Comp;

  if (ReactIs.isElement(Comp) || typeof Comp === 'string') {
    return Comp;
  } else if (ReactIs.isValidElementType(Comp)) {
    return _react2.default.createElement(Comp, props);
  }

  return fallback;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJSZWFjdElzIiwiZ2V0Iiwic2V0IiwidGFrZVJpZ2h0IiwibGFzdCIsIm9yZGVyQnkiLCJyYW5nZSIsInJlbW92ZSIsImNsb25lIiwiZ2V0Rmlyc3REZWZpbmVkIiwic3VtIiwibWFrZVRlbXBsYXRlQ29tcG9uZW50IiwiZ3JvdXBCeSIsImlzQXJyYXkiLCJzcGxpdFByb3BzIiwiY29tcGFjdE9iamVjdCIsImlzU29ydGluZ0Rlc2MiLCJub3JtYWxpemVDb21wb25lbnQiLCJhc1B4Iiwib2JqIiwicGF0aCIsImRlZiIsInBhdGhPYmoiLCJtYWtlUGF0aEFycmF5IiwidmFsIiwicmVkdWNlIiwiY3VycmVudCIsInBhdGhQYXJ0IiwiZSIsInZhbHVlIiwia2V5cyIsImtleVBhcnQiLCJjdXJzb3IiLCJzaGlmdCIsImxlbmd0aCIsImFyciIsIm4iLCJzdGFydCIsInNsaWNlIiwiaSIsInB1c2giLCJmdW5jcyIsImRpcnMiLCJpbmRleEtleSIsInNvcnQiLCJyb3dBIiwicm93QiIsImNvbXAiLCJkZXNjIiwic29ydEludCIsImEiLCJiIiwiZmlsdGVyIiwibyIsInIiLCJzcGxpY2UiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJrZXkiLCJ0b1N0cmluZyIsImNvbXBDbGFzcyIsImRpc3BsYXlOYW1lIiwiRXJyb3IiLCJjbXAiLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInJlc3QiLCJ4cyIsInJ2IiwieCIsInJlc0tleSIsIk51bWJlciIsImlzTmFOIiwiQXJyYXkiLCJmbGF0dGVuRGVlcCIsImpvaW4iLCJyZXBsYWNlIiwic3BsaXQiLCJuZXdBcnIiLCJzdHlsZSIsIm5ld09iaiIsIk9iamVjdCIsIm1hcCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsInVuZGVmaW5lZCIsImQiLCJhc2MiLCJDb21wIiwicHJvcHMiLCJmYWxsYmFjayIsImlzRWxlbWVudCIsImlzVmFsaWRFbGVtZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLE87Ozs7Ozs7O0FBRVo7a0JBQ2U7QUFDYkMsVUFEYTtBQUViQyxVQUZhO0FBR2JDLHNCQUhhO0FBSWJDLFlBSmE7QUFLYkMsa0JBTGE7QUFNYkMsY0FOYTtBQU9iQyxnQkFQYTtBQVFiQyxjQVJhO0FBU2JDLGtDQVRhO0FBVWJDLFVBVmE7QUFXYkMsOENBWGE7QUFZYkMsa0JBWmE7QUFhYkMsa0JBYmE7QUFjYkMsd0JBZGE7QUFlYkMsOEJBZmE7QUFnQmJDLDhCQWhCYTtBQWlCYkMsd0NBakJhO0FBa0JiQztBQWxCYSxDOzs7QUFxQmYsU0FBU2pCLEdBQVQsQ0FBY2tCLEdBQWQsRUFBbUJDLElBQW5CLEVBQXlCQyxHQUF6QixFQUE4QjtBQUM1QixNQUFJLENBQUNELElBQUwsRUFBVztBQUNULFdBQU9ELEdBQVA7QUFDRDtBQUNELE1BQU1HLFVBQVVDLGNBQWNILElBQWQsQ0FBaEI7QUFDQSxNQUFJSSxZQUFKO0FBQ0EsTUFBSTtBQUNGQSxVQUFNRixRQUFRRyxNQUFSLENBQWUsVUFBQ0MsT0FBRCxFQUFVQyxRQUFWO0FBQUEsYUFBdUJELFFBQVFDLFFBQVIsQ0FBdkI7QUFBQSxLQUFmLEVBQXlEUixHQUF6RCxDQUFOO0FBQ0QsR0FGRCxDQUVFLE9BQU9TLENBQVAsRUFBVTtBQUNWO0FBQ0Q7QUFDRCxTQUFPLE9BQU9KLEdBQVAsS0FBZSxXQUFmLEdBQTZCQSxHQUE3QixHQUFtQ0gsR0FBMUM7QUFDRDs7QUFFRCxTQUFTbkIsR0FBVCxHQUFxQztBQUFBLE1BQXZCaUIsR0FBdUIsdUVBQWpCLEVBQWlCO0FBQUEsTUFBYkMsSUFBYTtBQUFBLE1BQVBTLEtBQU87O0FBQ25DLE1BQU1DLE9BQU9QLGNBQWNILElBQWQsQ0FBYjtBQUNBLE1BQUlXLGdCQUFKO0FBQ0EsTUFBSUMsU0FBU2IsR0FBYjtBQUNBLFNBQU8sQ0FBQ1ksVUFBVUQsS0FBS0csS0FBTCxFQUFYLEtBQTRCSCxLQUFLSSxNQUF4QyxFQUFnRDtBQUM5QyxRQUFJLENBQUNGLE9BQU9ELE9BQVAsQ0FBTCxFQUFzQjtBQUNwQkMsYUFBT0QsT0FBUCxJQUFrQixFQUFsQjtBQUNEO0FBQ0RDLGFBQVNBLE9BQU9ELE9BQVAsQ0FBVDtBQUNEO0FBQ0RDLFNBQU9ELE9BQVAsSUFBa0JGLEtBQWxCO0FBQ0EsU0FBT1YsR0FBUDtBQUNEOztBQUVELFNBQVNoQixTQUFULENBQW9CZ0MsR0FBcEIsRUFBeUJDLENBQXpCLEVBQTRCO0FBQzFCLE1BQU1DLFFBQVFELElBQUlELElBQUlELE1BQVIsR0FBaUIsQ0FBakIsR0FBcUJDLElBQUlELE1BQUosR0FBYUUsQ0FBaEQ7QUFDQSxTQUFPRCxJQUFJRyxLQUFKLENBQVVELEtBQVYsQ0FBUDtBQUNEOztBQUVELFNBQVNqQyxJQUFULENBQWUrQixHQUFmLEVBQW9CO0FBQ2xCLFNBQU9BLElBQUlBLElBQUlELE1BQUosR0FBYSxDQUFqQixDQUFQO0FBQ0Q7O0FBRUQsU0FBUzVCLEtBQVQsQ0FBZ0I4QixDQUFoQixFQUFtQjtBQUNqQixNQUFNRCxNQUFNLEVBQVo7QUFDQSxPQUFLLElBQUlJLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsQ0FBcEIsRUFBdUJHLEtBQUssQ0FBNUIsRUFBK0I7QUFDN0JKLFFBQUlLLElBQUosQ0FBU0osQ0FBVDtBQUNEO0FBQ0QsU0FBT0QsR0FBUDtBQUNEOztBQUVELFNBQVM5QixPQUFULENBQWtCOEIsR0FBbEIsRUFBdUJNLEtBQXZCLEVBQThCQyxJQUE5QixFQUFvQ0MsUUFBcEMsRUFBOEM7QUFDNUMsU0FBT1IsSUFBSVMsSUFBSixDQUFTLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUM5QixTQUFLLElBQUlQLElBQUksQ0FBYixFQUFnQkEsSUFBSUUsTUFBTVAsTUFBMUIsRUFBa0NLLEtBQUssQ0FBdkMsRUFBMEM7QUFDeEMsVUFBTVEsT0FBT04sTUFBTUYsQ0FBTixDQUFiO0FBQ0EsVUFBTVMsT0FBT04sS0FBS0gsQ0FBTCxNQUFZLEtBQVosSUFBcUJHLEtBQUtILENBQUwsTUFBWSxNQUE5QztBQUNBLFVBQU1VLFVBQVVGLEtBQUtGLElBQUwsRUFBV0MsSUFBWCxDQUFoQjtBQUNBLFVBQUlHLE9BQUosRUFBYTtBQUNYLGVBQU9ELE9BQU8sQ0FBQ0MsT0FBUixHQUFrQkEsT0FBekI7QUFDRDtBQUNGO0FBQ0Q7QUFDQSxXQUFPUCxLQUFLLENBQUwsSUFBVUcsS0FBS0YsUUFBTCxJQUFpQkcsS0FBS0gsUUFBTCxDQUEzQixHQUE0Q0csS0FBS0gsUUFBTCxJQUFpQkUsS0FBS0YsUUFBTCxDQUFwRTtBQUNELEdBWE0sQ0FBUDtBQVlEOztBQUVELFNBQVNwQyxNQUFULENBQWlCMkMsQ0FBakIsRUFBb0JDLENBQXBCLEVBQXVCO0FBQ3JCLFNBQU9ELEVBQUVFLE1BQUYsQ0FBUyxVQUFDQyxDQUFELEVBQUlkLENBQUosRUFBVTtBQUN4QixRQUFNZSxJQUFJSCxFQUFFRSxDQUFGLENBQVY7QUFDQSxRQUFJQyxDQUFKLEVBQU87QUFDTEosUUFBRUssTUFBRixDQUFTaEIsQ0FBVCxFQUFZLENBQVo7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNELFdBQU8sS0FBUDtBQUNELEdBUE0sQ0FBUDtBQVFEOztBQUVELFNBQVMvQixLQUFULENBQWdCMEMsQ0FBaEIsRUFBbUI7QUFDakIsTUFBSTtBQUNGLFdBQU9NLEtBQUtDLEtBQUwsQ0FDTEQsS0FBS0UsU0FBTCxDQUFlUixDQUFmLEVBQWtCLFVBQUNTLEdBQUQsRUFBTTlCLEtBQU4sRUFBZ0I7QUFDaEMsVUFBSSxPQUFPQSxLQUFQLEtBQWlCLFVBQXJCLEVBQWlDO0FBQy9CLGVBQU9BLE1BQU0rQixRQUFOLEVBQVA7QUFDRDtBQUNELGFBQU8vQixLQUFQO0FBQ0QsS0FMRCxDQURLLENBQVA7QUFRRCxHQVRELENBU0UsT0FBT0QsQ0FBUCxFQUFVO0FBQ1YsV0FBT3NCLENBQVA7QUFDRDtBQUNGOztBQUVELFNBQVN6QyxlQUFULEdBQW1DO0FBQ2pDLE9BQUssSUFBSThCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxVQUFLTCxNQUF6QixFQUFpQ0ssS0FBSyxDQUF0QyxFQUF5QztBQUN2QyxRQUFJLDRCQUFZQSxDQUFaLHlCQUFZQSxDQUFaLE9BQW1CLFdBQXZCLEVBQW9DO0FBQ2xDLGlDQUFZQSxDQUFaLHlCQUFZQSxDQUFaO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQVM3QixHQUFULENBQWN5QixHQUFkLEVBQW1CO0FBQ2pCLFNBQU9BLElBQUlWLE1BQUosQ0FBVyxVQUFDeUIsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUQsSUFBSUMsQ0FBZDtBQUFBLEdBQVgsRUFBNEIsQ0FBNUIsQ0FBUDtBQUNEOztBQUVELFNBQVN4QyxxQkFBVCxDQUFnQ2tELFNBQWhDLEVBQTJDQyxXQUEzQyxFQUF3RDtBQUN0RCxNQUFJLENBQUNBLFdBQUwsRUFBa0I7QUFDaEIsVUFBTSxJQUFJQyxLQUFKLENBQVUsOENBQVYsRUFBMERGLFNBQTFELENBQU47QUFDRDtBQUNELE1BQU1HLE1BQU0sU0FBTkEsR0FBTTtBQUFBLFFBQUdDLFFBQUgsUUFBR0EsUUFBSDtBQUFBLFFBQWFDLFNBQWIsUUFBYUEsU0FBYjtBQUFBLFFBQTJCQyxJQUEzQjs7QUFBQSxXQUNWO0FBQUE7QUFBQSxpQkFBSyxXQUFXLDBCQUFXTixTQUFYLEVBQXNCSyxTQUF0QixDQUFoQixJQUFzREMsSUFBdEQ7QUFDR0Y7QUFESCxLQURVO0FBQUEsR0FBWjtBQUtBRCxNQUFJRixXQUFKLEdBQWtCQSxXQUFsQjtBQUNBLFNBQU9FLEdBQVA7QUFDRDs7QUFFRCxTQUFTcEQsT0FBVCxDQUFrQndELEVBQWxCLEVBQXNCVCxHQUF0QixFQUEyQjtBQUN6QixTQUFPUyxHQUFHM0MsTUFBSCxDQUFVLFVBQUM0QyxFQUFELEVBQUtDLENBQUwsRUFBUS9CLENBQVIsRUFBYztBQUM3QixRQUFNZ0MsU0FBUyxPQUFPWixHQUFQLEtBQWUsVUFBZixHQUE0QkEsSUFBSVcsQ0FBSixFQUFPL0IsQ0FBUCxDQUE1QixHQUF3QytCLEVBQUVYLEdBQUYsQ0FBdkQ7QUFDQVUsT0FBR0UsTUFBSCxJQUFhMUQsUUFBUXdELEdBQUdFLE1BQUgsQ0FBUixJQUFzQkYsR0FBR0UsTUFBSCxDQUF0QixHQUFtQyxFQUFoRDtBQUNBRixPQUFHRSxNQUFILEVBQVcvQixJQUFYLENBQWdCOEIsQ0FBaEI7QUFDQSxXQUFPRCxFQUFQO0FBQ0QsR0FMTSxFQUtKLEVBTEksQ0FBUDtBQU1EOztBQUVELFNBQVNuRCxJQUFULENBQWVXLEtBQWYsRUFBc0I7QUFDcEJBLFVBQVEyQyxPQUFPM0MsS0FBUCxDQUFSO0FBQ0EsU0FBTzJDLE9BQU9DLEtBQVAsQ0FBYTVDLEtBQWIsSUFBc0IsSUFBdEIsR0FBZ0NBLEtBQWhDLE9BQVA7QUFDRDs7QUFFRCxTQUFTaEIsT0FBVCxDQUFrQnFDLENBQWxCLEVBQXFCO0FBQ25CLFNBQU93QixNQUFNN0QsT0FBTixDQUFjcUMsQ0FBZCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBLFNBQVMzQixhQUFULENBQXdCSixHQUF4QixFQUE2QjtBQUMzQixTQUFPd0QsWUFBWXhELEdBQVosRUFDSnlELElBREksQ0FDQyxHQURELEVBRUpDLE9BRkksQ0FFSSxLQUZKLEVBRVcsR0FGWCxFQUdKQSxPQUhJLENBR0ksS0FISixFQUdXLEVBSFgsRUFJSkMsS0FKSSxDQUlFLEdBSkYsQ0FBUDtBQUtEOztBQUVELFNBQVNILFdBQVQsQ0FBc0J4QyxHQUF0QixFQUF3QztBQUFBLE1BQWI0QyxNQUFhLHVFQUFKLEVBQUk7O0FBQ3RDLE1BQUksQ0FBQ2xFLFFBQVFzQixHQUFSLENBQUwsRUFBbUI7QUFDakI0QyxXQUFPdkMsSUFBUCxDQUFZTCxHQUFaO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsU0FBSyxJQUFJSSxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLElBQUlELE1BQXhCLEVBQWdDSyxLQUFLLENBQXJDLEVBQXdDO0FBQ3RDb0Msa0JBQVl4QyxJQUFJSSxDQUFKLENBQVosRUFBb0J3QyxNQUFwQjtBQUNEO0FBQ0Y7QUFDRCxTQUFPQSxNQUFQO0FBQ0Q7O0FBRUQsU0FBU2pFLFVBQVQsUUFBb0Q7QUFBQSxNQUE3Qm9ELFNBQTZCLFNBQTdCQSxTQUE2QjtBQUFBLE1BQWxCYyxLQUFrQixTQUFsQkEsS0FBa0I7QUFBQSxNQUFSYixJQUFROztBQUNsRCxTQUFPO0FBQ0xELHdCQURLO0FBRUxjLGdCQUZLO0FBR0xiLFVBQU1BLFFBQVE7QUFIVCxHQUFQO0FBS0Q7O0FBRUQsU0FBU3BELGFBQVQsQ0FBd0JJLEdBQXhCLEVBQTZCO0FBQzNCLE1BQU04RCxTQUFTLEVBQWY7QUFDQSxNQUFJOUQsR0FBSixFQUFTO0FBQ1ArRCxXQUFPcEQsSUFBUCxDQUFZWCxHQUFaLEVBQWlCZ0UsR0FBakIsQ0FBcUIsZUFBTztBQUMxQixVQUNFRCxPQUFPRSxTQUFQLENBQWlCQyxjQUFqQixDQUFnQ0MsSUFBaEMsQ0FBcUNuRSxHQUFyQyxFQUEwQ3dDLEdBQTFDLEtBQ0F4QyxJQUFJd0MsR0FBSixNQUFhNEIsU0FEYixJQUVBLE9BQU9wRSxJQUFJd0MsR0FBSixDQUFQLEtBQW9CLFdBSHRCLEVBSUU7QUFDQXNCLGVBQU90QixHQUFQLElBQWN4QyxJQUFJd0MsR0FBSixDQUFkO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRCxLQVREO0FBVUQ7QUFDRCxTQUFPc0IsTUFBUDtBQUNEOztBQUVELFNBQVNqRSxhQUFULENBQXdCd0UsQ0FBeEIsRUFBMkI7QUFDekIsU0FBTyxDQUFDLEVBQUVBLEVBQUU1QyxJQUFGLEtBQVcsTUFBWCxJQUFxQjRDLEVBQUV4QyxJQUFGLEtBQVcsSUFBaEMsSUFBd0N3QyxFQUFFQyxHQUFGLEtBQVUsS0FBcEQsQ0FBUjtBQUNEOztBQUVELFNBQVN4RSxrQkFBVCxDQUE2QnlFLElBQTdCLEVBQW1DQyxLQUFuQyxFQUEyRDtBQUFBLE1BQWpCQyxRQUFpQix1RUFBTkYsSUFBTTs7QUFDekQsTUFBSTFGLFFBQVE2RixTQUFSLENBQWtCSCxJQUFsQixLQUEyQixPQUFPQSxJQUFQLEtBQWdCLFFBQS9DLEVBQXlEO0FBQ3ZELFdBQU9BLElBQVA7QUFDRCxHQUZELE1BRU8sSUFBSTFGLFFBQVE4RixrQkFBUixDQUEyQkosSUFBM0IsQ0FBSixFQUFzQztBQUMzQyxXQUFPLDhCQUFDLElBQUQsRUFBVUMsS0FBVixDQUFQO0FBQ0Q7O0FBRUQsU0FBT0MsUUFBUDtBQUNEIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xyXG5pbXBvcnQgKiBhcyBSZWFjdElzIGZyb20gJ3JlYWN0LWlzJ1xyXG5cclxuLy9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGdldCxcclxuICBzZXQsXHJcbiAgdGFrZVJpZ2h0LFxyXG4gIGxhc3QsXHJcbiAgb3JkZXJCeSxcclxuICByYW5nZSxcclxuICByZW1vdmUsXHJcbiAgY2xvbmUsXHJcbiAgZ2V0Rmlyc3REZWZpbmVkLFxyXG4gIHN1bSxcclxuICBtYWtlVGVtcGxhdGVDb21wb25lbnQsXHJcbiAgZ3JvdXBCeSxcclxuICBpc0FycmF5LFxyXG4gIHNwbGl0UHJvcHMsXHJcbiAgY29tcGFjdE9iamVjdCxcclxuICBpc1NvcnRpbmdEZXNjLFxyXG4gIG5vcm1hbGl6ZUNvbXBvbmVudCxcclxuICBhc1B4LFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXQgKG9iaiwgcGF0aCwgZGVmKSB7XHJcbiAgaWYgKCFwYXRoKSB7XHJcbiAgICByZXR1cm4gb2JqXHJcbiAgfVxyXG4gIGNvbnN0IHBhdGhPYmogPSBtYWtlUGF0aEFycmF5KHBhdGgpXHJcbiAgbGV0IHZhbFxyXG4gIHRyeSB7XHJcbiAgICB2YWwgPSBwYXRoT2JqLnJlZHVjZSgoY3VycmVudCwgcGF0aFBhcnQpID0+IGN1cnJlbnRbcGF0aFBhcnRdLCBvYmopXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gY29udGludWUgcmVnYXJkbGVzcyBvZiBlcnJvclxyXG4gIH1cclxuICByZXR1cm4gdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgPyB2YWwgOiBkZWZcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0IChvYmogPSB7fSwgcGF0aCwgdmFsdWUpIHtcclxuICBjb25zdCBrZXlzID0gbWFrZVBhdGhBcnJheShwYXRoKVxyXG4gIGxldCBrZXlQYXJ0XHJcbiAgbGV0IGN1cnNvciA9IG9ialxyXG4gIHdoaWxlICgoa2V5UGFydCA9IGtleXMuc2hpZnQoKSkgJiYga2V5cy5sZW5ndGgpIHtcclxuICAgIGlmICghY3Vyc29yW2tleVBhcnRdKSB7XHJcbiAgICAgIGN1cnNvcltrZXlQYXJ0XSA9IHt9XHJcbiAgICB9XHJcbiAgICBjdXJzb3IgPSBjdXJzb3Jba2V5UGFydF1cclxuICB9XHJcbiAgY3Vyc29yW2tleVBhcnRdID0gdmFsdWVcclxuICByZXR1cm4gb2JqXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRha2VSaWdodCAoYXJyLCBuKSB7XHJcbiAgY29uc3Qgc3RhcnQgPSBuID4gYXJyLmxlbmd0aCA/IDAgOiBhcnIubGVuZ3RoIC0gblxyXG4gIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhc3QgKGFycikge1xyXG4gIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmdlIChuKSB7XHJcbiAgY29uc3QgYXJyID0gW11cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xyXG4gICAgYXJyLnB1c2gobilcclxuICB9XHJcbiAgcmV0dXJuIGFyclxyXG59XHJcblxyXG5mdW5jdGlvbiBvcmRlckJ5IChhcnIsIGZ1bmNzLCBkaXJzLCBpbmRleEtleSkge1xyXG4gIHJldHVybiBhcnIuc29ydCgocm93QSwgcm93QikgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmdW5jcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBjb21wID0gZnVuY3NbaV1cclxuICAgICAgY29uc3QgZGVzYyA9IGRpcnNbaV0gPT09IGZhbHNlIHx8IGRpcnNbaV0gPT09ICdkZXNjJ1xyXG4gICAgICBjb25zdCBzb3J0SW50ID0gY29tcChyb3dBLCByb3dCKVxyXG4gICAgICBpZiAoc29ydEludCkge1xyXG4gICAgICAgIHJldHVybiBkZXNjID8gLXNvcnRJbnQgOiBzb3J0SW50XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFVzZSB0aGUgcm93IGluZGV4IGZvciB0aWUgYnJlYWtlcnNcclxuICAgIHJldHVybiBkaXJzWzBdID8gcm93QVtpbmRleEtleV0gLSByb3dCW2luZGV4S2V5XSA6IHJvd0JbaW5kZXhLZXldIC0gcm93QVtpbmRleEtleV1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmUgKGEsIGIpIHtcclxuICByZXR1cm4gYS5maWx0ZXIoKG8sIGkpID0+IHtcclxuICAgIGNvbnN0IHIgPSBiKG8pXHJcbiAgICBpZiAocikge1xyXG4gICAgICBhLnNwbGljZShpLCAxKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvbmUgKGEpIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KGEsIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICAgIH0pXHJcbiAgICApXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIGFcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpcnN0RGVmaW5lZCAoLi4uYXJncykge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKHR5cGVvZiBhcmdzW2ldICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gYXJnc1tpXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3VtIChhcnIpIHtcclxuICByZXR1cm4gYXJyLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VUZW1wbGF0ZUNvbXBvbmVudCAoY29tcENsYXNzLCBkaXNwbGF5TmFtZSkge1xyXG4gIGlmICghZGlzcGxheU5hbWUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm8gZGlzcGxheU5hbWUgZm91bmQgZm9yIHRlbXBsYXRlIGNvbXBvbmVudDonLCBjb21wQ2xhc3MpXHJcbiAgfVxyXG4gIGNvbnN0IGNtcCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29tcENsYXNzLCBjbGFzc05hbWUpfSB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gIClcclxuICBjbXAuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZVxyXG4gIHJldHVybiBjbXBcclxufVxyXG5cclxuZnVuY3Rpb24gZ3JvdXBCeSAoeHMsIGtleSkge1xyXG4gIHJldHVybiB4cy5yZWR1Y2UoKHJ2LCB4LCBpKSA9PiB7XHJcbiAgICBjb25zdCByZXNLZXkgPSB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8ga2V5KHgsIGkpIDogeFtrZXldXHJcbiAgICBydltyZXNLZXldID0gaXNBcnJheShydltyZXNLZXldKSA/IHJ2W3Jlc0tleV0gOiBbXVxyXG4gICAgcnZbcmVzS2V5XS5wdXNoKHgpXHJcbiAgICByZXR1cm4gcnZcclxuICB9LCB7fSlcclxufVxyXG5cclxuZnVuY3Rpb24gYXNQeCAodmFsdWUpIHtcclxuICB2YWx1ZSA9IE51bWJlcih2YWx1ZSlcclxuICByZXR1cm4gTnVtYmVyLmlzTmFOKHZhbHVlKSA/IG51bGwgOiBgJHt2YWx1ZX1weGBcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheSAoYSkge1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGEpXHJcbn1cclxuXHJcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG4vLyBOb24tZXhwb3J0ZWQgSGVscGVyc1xyXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbmZ1bmN0aW9uIG1ha2VQYXRoQXJyYXkgKG9iaikge1xyXG4gIHJldHVybiBmbGF0dGVuRGVlcChvYmopXHJcbiAgICAuam9pbignLicpXHJcbiAgICAucmVwbGFjZSgvXFxbL2csICcuJylcclxuICAgIC5yZXBsYWNlKC9cXF0vZywgJycpXHJcbiAgICAuc3BsaXQoJy4nKVxyXG59XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuRGVlcCAoYXJyLCBuZXdBcnIgPSBbXSkge1xyXG4gIGlmICghaXNBcnJheShhcnIpKSB7XHJcbiAgICBuZXdBcnIucHVzaChhcnIpXHJcbiAgfSBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZsYXR0ZW5EZWVwKGFycltpXSwgbmV3QXJyKVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbmV3QXJyXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0UHJvcHMgKHsgY2xhc3NOYW1lLCBzdHlsZSwgLi4ucmVzdCB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGNsYXNzTmFtZSxcclxuICAgIHN0eWxlLFxyXG4gICAgcmVzdDogcmVzdCB8fCB7fSxcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBhY3RPYmplY3QgKG9iaikge1xyXG4gIGNvbnN0IG5ld09iaiA9IHt9XHJcbiAgaWYgKG9iaikge1xyXG4gICAgT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkgJiZcclxuICAgICAgICBvYmpba2V5XSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgdHlwZW9mIG9ialtrZXldICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICApIHtcclxuICAgICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0pXHJcbiAgfVxyXG4gIHJldHVybiBuZXdPYmpcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTb3J0aW5nRGVzYyAoZCkge1xyXG4gIHJldHVybiAhIShkLnNvcnQgPT09ICdkZXNjJyB8fCBkLmRlc2MgPT09IHRydWUgfHwgZC5hc2MgPT09IGZhbHNlKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVDb21wb25lbnQgKENvbXAsIHByb3BzLCBmYWxsYmFjayA9IENvbXApIHtcclxuICBpZiAoUmVhY3RJcy5pc0VsZW1lbnQoQ29tcCkgfHwgdHlwZW9mIENvbXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gQ29tcFxyXG4gIH0gZWxzZSBpZiAoUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUoQ29tcCkpIHtcclxuICAgIHJldHVybiA8Q29tcCB7Li4ucHJvcHN9IC8+XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsbGJhY2tcclxufVxyXG5cclxuIl19