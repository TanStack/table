'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

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

function splitProps(obj) {
  if (!obj) {
    return {
      className: '',
      style: {},
      rest: {}
    };
  }

  var className = obj.className,
      style = obj.style,
      rest = _objectWithoutProperties(obj, ['className', 'style']);

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

function normalizeComponent(Comp) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Comp;

  return typeof Comp === 'function' ? Object.getPrototypeOf(Comp).isReactComponent ? _react2.default.createElement(Comp, params) : Comp(params) : fallback;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJnZXQiLCJzZXQiLCJ0YWtlUmlnaHQiLCJsYXN0Iiwib3JkZXJCeSIsInJhbmdlIiwicmVtb3ZlIiwiY2xvbmUiLCJnZXRGaXJzdERlZmluZWQiLCJzdW0iLCJtYWtlVGVtcGxhdGVDb21wb25lbnQiLCJncm91cEJ5IiwiaXNBcnJheSIsInNwbGl0UHJvcHMiLCJjb21wYWN0T2JqZWN0IiwiaXNTb3J0aW5nRGVzYyIsIm5vcm1hbGl6ZUNvbXBvbmVudCIsImFzUHgiLCJvYmoiLCJwYXRoIiwiZGVmIiwicGF0aE9iaiIsIm1ha2VQYXRoQXJyYXkiLCJ2YWwiLCJyZWR1Y2UiLCJjdXJyZW50IiwicGF0aFBhcnQiLCJlIiwidmFsdWUiLCJrZXlzIiwia2V5UGFydCIsImN1cnNvciIsInNoaWZ0IiwibGVuZ3RoIiwiYXJyIiwibiIsInN0YXJ0Iiwic2xpY2UiLCJpIiwicHVzaCIsImZ1bmNzIiwiZGlycyIsImluZGV4S2V5Iiwic29ydCIsInJvd0EiLCJyb3dCIiwiY29tcCIsImRlc2MiLCJzb3J0SW50IiwiYSIsImIiLCJmaWx0ZXIiLCJvIiwiciIsInNwbGljZSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsInRvU3RyaW5nIiwiY29tcENsYXNzIiwiZGlzcGxheU5hbWUiLCJFcnJvciIsImNtcCIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwicmVzdCIsInhzIiwicnYiLCJ4IiwicmVzS2V5IiwiTnVtYmVyIiwiaXNOYU4iLCJBcnJheSIsImZsYXR0ZW5EZWVwIiwiam9pbiIsInJlcGxhY2UiLCJzcGxpdCIsIm5ld0FyciIsInN0eWxlIiwibmV3T2JqIiwiT2JqZWN0IiwibWFwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwidW5kZWZpbmVkIiwiZCIsImFzYyIsIkNvbXAiLCJwYXJhbXMiLCJmYWxsYmFjayIsImdldFByb3RvdHlwZU9mIiwiaXNSZWFjdENvbXBvbmVudCJd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T0FBT0EsSUFBUCxLQUFnQixVQUFoQixHQUNMUixPQUFPVyxjQUFQLENBQXNCSCxJQUF0QixFQUE0QkksZ0JBQTVCLEdBQ0UsOEJBQUMsSUFBRCxFQUFVSCxNQUFWLENBREYsR0FHRUQsS0FBS0MsTUFBTCxDQUpHLEdBT0xDLFFBUEY7QUFTRCIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG4vL1xuZXhwb3J0IGRlZmF1bHQge1xuICBnZXQsXG4gIHNldCxcbiAgdGFrZVJpZ2h0LFxuICBsYXN0LFxuICBvcmRlckJ5LFxuICByYW5nZSxcbiAgcmVtb3ZlLFxuICBjbG9uZSxcbiAgZ2V0Rmlyc3REZWZpbmVkLFxuICBzdW0sXG4gIG1ha2VUZW1wbGF0ZUNvbXBvbmVudCxcbiAgZ3JvdXBCeSxcbiAgaXNBcnJheSxcbiAgc3BsaXRQcm9wcyxcbiAgY29tcGFjdE9iamVjdCxcbiAgaXNTb3J0aW5nRGVzYyxcbiAgbm9ybWFsaXplQ29tcG9uZW50LFxuICBhc1B4LFxufVxuXG5mdW5jdGlvbiBnZXQgKG9iaiwgcGF0aCwgZGVmKSB7XG4gIGlmICghcGF0aCkge1xuICAgIHJldHVybiBvYmpcbiAgfVxuICBjb25zdCBwYXRoT2JqID0gbWFrZVBhdGhBcnJheShwYXRoKVxuICBsZXQgdmFsXG4gIHRyeSB7XG4gICAgdmFsID0gcGF0aE9iai5yZWR1Y2UoKGN1cnJlbnQsIHBhdGhQYXJ0KSA9PiBjdXJyZW50W3BhdGhQYXJ0XSwgb2JqKVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gY29udGludWUgcmVnYXJkbGVzcyBvZiBlcnJvclxuICB9XG4gIHJldHVybiB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyA/IHZhbCA6IGRlZlxufVxuXG5mdW5jdGlvbiBzZXQgKG9iaiA9IHt9LCBwYXRoLCB2YWx1ZSkge1xuICBjb25zdCBrZXlzID0gbWFrZVBhdGhBcnJheShwYXRoKVxuICBsZXQga2V5UGFydFxuICBsZXQgY3Vyc29yID0gb2JqXG4gIHdoaWxlICgoa2V5UGFydCA9IGtleXMuc2hpZnQoKSkgJiYga2V5cy5sZW5ndGgpIHtcbiAgICBpZiAoIWN1cnNvcltrZXlQYXJ0XSkge1xuICAgICAgY3Vyc29yW2tleVBhcnRdID0ge31cbiAgICB9XG4gICAgY3Vyc29yID0gY3Vyc29yW2tleVBhcnRdXG4gIH1cbiAgY3Vyc29yW2tleVBhcnRdID0gdmFsdWVcbiAgcmV0dXJuIG9ialxufVxuXG5mdW5jdGlvbiB0YWtlUmlnaHQgKGFyciwgbikge1xuICBjb25zdCBzdGFydCA9IG4gPiBhcnIubGVuZ3RoID8gMCA6IGFyci5sZW5ndGggLSBuXG4gIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQpXG59XG5cbmZ1bmN0aW9uIGxhc3QgKGFycikge1xuICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXVxufVxuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICBjb25zdCBhcnIgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgIGFyci5wdXNoKG4pXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBvcmRlckJ5IChhcnIsIGZ1bmNzLCBkaXJzLCBpbmRleEtleSkge1xuICByZXR1cm4gYXJyLnNvcnQoKHJvd0EsIHJvd0IpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZ1bmNzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjb21wID0gZnVuY3NbaV1cbiAgICAgIGNvbnN0IGRlc2MgPSBkaXJzW2ldID09PSBmYWxzZSB8fCBkaXJzW2ldID09PSAnZGVzYydcbiAgICAgIGNvbnN0IHNvcnRJbnQgPSBjb21wKHJvd0EsIHJvd0IpXG4gICAgICBpZiAoc29ydEludCkge1xuICAgICAgICByZXR1cm4gZGVzYyA/IC1zb3J0SW50IDogc29ydEludFxuICAgICAgfVxuICAgIH1cbiAgICAvLyBVc2UgdGhlIHJvdyBpbmRleCBmb3IgdGllIGJyZWFrZXJzXG4gICAgcmV0dXJuIGRpcnNbMF0gPyByb3dBW2luZGV4S2V5XSAtIHJvd0JbaW5kZXhLZXldIDogcm93QltpbmRleEtleV0gLSByb3dBW2luZGV4S2V5XVxuICB9KVxufVxuXG5mdW5jdGlvbiByZW1vdmUgKGEsIGIpIHtcbiAgcmV0dXJuIGEuZmlsdGVyKChvLCBpKSA9PiB7XG4gICAgY29uc3QgciA9IGIobylcbiAgICBpZiAocikge1xuICAgICAgYS5zcGxpY2UoaSwgMSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5mdW5jdGlvbiBjbG9uZSAoYSkge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoYSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9KVxuICAgIClcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBhXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Rmlyc3REZWZpbmVkICguLi5hcmdzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmICh0eXBlb2YgYXJnc1tpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBhcmdzW2ldXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN1bSAoYXJyKSB7XG4gIHJldHVybiBhcnIucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMClcbn1cblxuZnVuY3Rpb24gbWFrZVRlbXBsYXRlQ29tcG9uZW50IChjb21wQ2xhc3MsIGRpc3BsYXlOYW1lKSB7XG4gIGlmICghZGlzcGxheU5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRpc3BsYXlOYW1lIGZvdW5kIGZvciB0ZW1wbGF0ZSBjb21wb25lbnQ6JywgY29tcENsYXNzKVxuICB9XG4gIGNvbnN0IGNtcCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNvbXBDbGFzcywgY2xhc3NOYW1lKX0gey4uLnJlc3R9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApXG4gIGNtcC5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lXG4gIHJldHVybiBjbXBcbn1cblxuZnVuY3Rpb24gZ3JvdXBCeSAoeHMsIGtleSkge1xuICByZXR1cm4geHMucmVkdWNlKChydiwgeCwgaSkgPT4ge1xuICAgIGNvbnN0IHJlc0tleSA9IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicgPyBrZXkoeCwgaSkgOiB4W2tleV1cbiAgICBydltyZXNLZXldID0gaXNBcnJheShydltyZXNLZXldKSA/IHJ2W3Jlc0tleV0gOiBbXVxuICAgIHJ2W3Jlc0tleV0ucHVzaCh4KVxuICAgIHJldHVybiBydlxuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gYXNQeCAodmFsdWUpIHtcbiAgdmFsdWUgPSBOdW1iZXIodmFsdWUpXG4gIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpID8gbnVsbCA6IGAke3ZhbHVlfXB4YFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChhKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGEpXG59XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gTm9uLWV4cG9ydGVkIEhlbHBlcnNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5mdW5jdGlvbiBtYWtlUGF0aEFycmF5IChvYmopIHtcbiAgcmV0dXJuIGZsYXR0ZW5EZWVwKG9iailcbiAgICAuam9pbignLicpXG4gICAgLnJlcGxhY2UoL1xcWy9nLCAnLicpXG4gICAgLnJlcGxhY2UoL1xcXS9nLCAnJylcbiAgICAuc3BsaXQoJy4nKVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuRGVlcCAoYXJyLCBuZXdBcnIgPSBbXSkge1xuICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgIG5ld0Fyci5wdXNoKGFycilcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZmxhdHRlbkRlZXAoYXJyW2ldLCBuZXdBcnIpXG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdBcnJcbn1cblxuZnVuY3Rpb24gc3BsaXRQcm9wcyAob2JqKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzTmFtZTogJycsXG4gICAgICBzdHlsZToge30sXG4gICAgICByZXN0OiB7fSxcbiAgICB9XG4gIH1cbiAgY29uc3QgeyBjbGFzc05hbWUsIHN0eWxlLCAuLi5yZXN0IH0gPSBvYmpcbiAgcmV0dXJuIHtcbiAgICBjbGFzc05hbWUsXG4gICAgc3R5bGUsXG4gICAgcmVzdDogcmVzdCB8fCB7fSxcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wYWN0T2JqZWN0IChvYmopIHtcbiAgY29uc3QgbmV3T2JqID0ge31cbiAgaWYgKG9iaikge1xuICAgIE9iamVjdC5rZXlzKG9iaikubWFwKGtleSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkgJiZcbiAgICAgICAgb2JqW2tleV0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB0eXBlb2Ygb2JqW2tleV0gIT09ICd1bmRlZmluZWQnXG4gICAgICApIHtcbiAgICAgICAgbmV3T2JqW2tleV0gPSBvYmpba2V5XVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICB9XG4gIHJldHVybiBuZXdPYmpcbn1cblxuZnVuY3Rpb24gaXNTb3J0aW5nRGVzYyAoZCkge1xuICByZXR1cm4gISEoZC5zb3J0ID09PSAnZGVzYycgfHwgZC5kZXNjID09PSB0cnVlIHx8IGQuYXNjID09PSBmYWxzZSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tcG9uZW50IChDb21wLCBwYXJhbXMgPSB7fSwgZmFsbGJhY2sgPSBDb21wKSB7XG4gIHJldHVybiB0eXBlb2YgQ29tcCA9PT0gJ2Z1bmN0aW9uJyA/IChcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ29tcCkuaXNSZWFjdENvbXBvbmVudCA/IChcbiAgICAgIDxDb21wIHsuLi5wYXJhbXN9IC8+XG4gICAgKSA6IChcbiAgICAgIENvbXAocGFyYW1zKVxuICAgIClcbiAgKSA6IChcbiAgICBmYWxsYmFja1xuICApXG59XG4iXX0=