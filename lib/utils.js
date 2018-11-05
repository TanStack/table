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

function normalizeComponent(Comp) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Comp;

  return typeof Comp === 'function' ? _react2.default.createElement(Comp, params) : fallback;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJnZXQiLCJzZXQiLCJ0YWtlUmlnaHQiLCJsYXN0Iiwib3JkZXJCeSIsInJhbmdlIiwicmVtb3ZlIiwiY2xvbmUiLCJnZXRGaXJzdERlZmluZWQiLCJzdW0iLCJtYWtlVGVtcGxhdGVDb21wb25lbnQiLCJncm91cEJ5IiwiaXNBcnJheSIsInNwbGl0UHJvcHMiLCJjb21wYWN0T2JqZWN0IiwiaXNTb3J0aW5nRGVzYyIsIm5vcm1hbGl6ZUNvbXBvbmVudCIsImFzUHgiLCJvYmoiLCJwYXRoIiwiZGVmIiwicGF0aE9iaiIsIm1ha2VQYXRoQXJyYXkiLCJ2YWwiLCJyZWR1Y2UiLCJjdXJyZW50IiwicGF0aFBhcnQiLCJlIiwidmFsdWUiLCJrZXlzIiwia2V5UGFydCIsImN1cnNvciIsInNoaWZ0IiwibGVuZ3RoIiwiYXJyIiwibiIsInN0YXJ0Iiwic2xpY2UiLCJpIiwicHVzaCIsImZ1bmNzIiwiZGlycyIsImluZGV4S2V5Iiwic29ydCIsInJvd0EiLCJyb3dCIiwiY29tcCIsImRlc2MiLCJzb3J0SW50IiwiYSIsImIiLCJmaWx0ZXIiLCJvIiwiciIsInNwbGljZSIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImtleSIsInRvU3RyaW5nIiwiY29tcENsYXNzIiwiZGlzcGxheU5hbWUiLCJFcnJvciIsImNtcCIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwicmVzdCIsInhzIiwicnYiLCJ4IiwicmVzS2V5IiwiTnVtYmVyIiwiaXNOYU4iLCJBcnJheSIsImZsYXR0ZW5EZWVwIiwiam9pbiIsInJlcGxhY2UiLCJzcGxpdCIsIm5ld0FyciIsInN0eWxlIiwibmV3T2JqIiwiT2JqZWN0IiwibWFwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwidW5kZWZpbmVkIiwiZCIsImFzYyIsIkNvbXAiLCJwYXJhbXMiLCJmYWxsYmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7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U0FBTztBQUNMRCx3QkFESztBQUVMYyxnQkFGSztBQUdMYixVQUFNQSxRQUFRO0FBSFQsR0FBUDtBQUtEOztBQUVELFNBQVNwRCxhQUFULENBQXdCSSxHQUF4QixFQUE2QjtBQUMzQixNQUFNOEQsU0FBUyxFQUFmO0FBQ0EsTUFBSTlELEdBQUosRUFBUztBQUNQK0QsV0FBT3BELElBQVAsQ0FBWVgsR0FBWixFQUFpQmdFLEdBQWpCLENBQXFCLGVBQU87QUFDMUIsVUFDRUQsT0FBT0UsU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElBQWhDLENBQXFDbkUsR0FBckMsRUFBMEN3QyxHQUExQyxLQUNBeEMsSUFBSXdDLEdBQUosTUFBYTRCLFNBRGIsSUFFQSxPQUFPcEUsSUFBSXdDLEdBQUosQ0FBUCxLQUFvQixXQUh0QixFQUlFO0FBQ0FzQixlQUFPdEIsR0FBUCxJQUFjeEMsSUFBSXdDLEdBQUosQ0FBZDtBQUNEO0FBQ0QsYUFBTyxJQUFQO0FBQ0QsS0FURDtBQVVEO0FBQ0QsU0FBT3NCLE1BQVA7QUFDRDs7QUFFRCxTQUFTakUsYUFBVCxDQUF3QndFLENBQXhCLEVBQTJCO0FBQ3pCLFNBQU8sQ0FBQyxFQUFFQSxFQUFFNUMsSUFBRixLQUFXLE1BQVgsSUFBcUI0QyxFQUFFeEMsSUFBRixLQUFXLElBQWhDLElBQXdDd0MsRUFBRUMsR0FBRixLQUFVLEtBQXBELENBQVI7QUFDRDs7QUFFRCxTQUFTeEUsa0JBQVQsQ0FBNkJ5RSxJQUE3QixFQUFpRTtBQUFBLE1BQTlCQyxNQUE4Qix1RUFBckIsRUFBcUI7QUFBQSxNQUFqQkMsUUFBaUIsdUVBQU5GLElBQU07O0FBQy9ELFNBQU8sT0FBT0EsSUFBUCxLQUFnQixVQUFoQixHQUNMLDhCQUFDLElBQUQsRUFBVUMsTUFBVixDQURLLEdBR0xDLFFBSEY7QUFLRCIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcclxuLy9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGdldCxcclxuICBzZXQsXHJcbiAgdGFrZVJpZ2h0LFxyXG4gIGxhc3QsXHJcbiAgb3JkZXJCeSxcclxuICByYW5nZSxcclxuICByZW1vdmUsXHJcbiAgY2xvbmUsXHJcbiAgZ2V0Rmlyc3REZWZpbmVkLFxyXG4gIHN1bSxcclxuICBtYWtlVGVtcGxhdGVDb21wb25lbnQsXHJcbiAgZ3JvdXBCeSxcclxuICBpc0FycmF5LFxyXG4gIHNwbGl0UHJvcHMsXHJcbiAgY29tcGFjdE9iamVjdCxcclxuICBpc1NvcnRpbmdEZXNjLFxyXG4gIG5vcm1hbGl6ZUNvbXBvbmVudCxcclxuICBhc1B4LFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXQgKG9iaiwgcGF0aCwgZGVmKSB7XHJcbiAgaWYgKCFwYXRoKSB7XHJcbiAgICByZXR1cm4gb2JqXHJcbiAgfVxyXG4gIGNvbnN0IHBhdGhPYmogPSBtYWtlUGF0aEFycmF5KHBhdGgpXHJcbiAgbGV0IHZhbFxyXG4gIHRyeSB7XHJcbiAgICB2YWwgPSBwYXRoT2JqLnJlZHVjZSgoY3VycmVudCwgcGF0aFBhcnQpID0+IGN1cnJlbnRbcGF0aFBhcnRdLCBvYmopXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gY29udGludWUgcmVnYXJkbGVzcyBvZiBlcnJvclxyXG4gIH1cclxuICByZXR1cm4gdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgPyB2YWwgOiBkZWZcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0IChvYmogPSB7fSwgcGF0aCwgdmFsdWUpIHtcclxuICBjb25zdCBrZXlzID0gbWFrZVBhdGhBcnJheShwYXRoKVxyXG4gIGxldCBrZXlQYXJ0XHJcbiAgbGV0IGN1cnNvciA9IG9ialxyXG4gIHdoaWxlICgoa2V5UGFydCA9IGtleXMuc2hpZnQoKSkgJiYga2V5cy5sZW5ndGgpIHtcclxuICAgIGlmICghY3Vyc29yW2tleVBhcnRdKSB7XHJcbiAgICAgIGN1cnNvcltrZXlQYXJ0XSA9IHt9XHJcbiAgICB9XHJcbiAgICBjdXJzb3IgPSBjdXJzb3Jba2V5UGFydF1cclxuICB9XHJcbiAgY3Vyc29yW2tleVBhcnRdID0gdmFsdWVcclxuICByZXR1cm4gb2JqXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRha2VSaWdodCAoYXJyLCBuKSB7XHJcbiAgY29uc3Qgc3RhcnQgPSBuID4gYXJyLmxlbmd0aCA/IDAgOiBhcnIubGVuZ3RoIC0gblxyXG4gIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhc3QgKGFycikge1xyXG4gIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmdlIChuKSB7XHJcbiAgY29uc3QgYXJyID0gW11cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xyXG4gICAgYXJyLnB1c2gobilcclxuICB9XHJcbiAgcmV0dXJuIGFyclxyXG59XHJcblxyXG5mdW5jdGlvbiBvcmRlckJ5IChhcnIsIGZ1bmNzLCBkaXJzLCBpbmRleEtleSkge1xyXG4gIHJldHVybiBhcnIuc29ydCgocm93QSwgcm93QikgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmdW5jcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBjb21wID0gZnVuY3NbaV1cclxuICAgICAgY29uc3QgZGVzYyA9IGRpcnNbaV0gPT09IGZhbHNlIHx8IGRpcnNbaV0gPT09ICdkZXNjJ1xyXG4gICAgICBjb25zdCBzb3J0SW50ID0gY29tcChyb3dBLCByb3dCKVxyXG4gICAgICBpZiAoc29ydEludCkge1xyXG4gICAgICAgIHJldHVybiBkZXNjID8gLXNvcnRJbnQgOiBzb3J0SW50XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFVzZSB0aGUgcm93IGluZGV4IGZvciB0aWUgYnJlYWtlcnNcclxuICAgIHJldHVybiBkaXJzWzBdID8gcm93QVtpbmRleEtleV0gLSByb3dCW2luZGV4S2V5XSA6IHJvd0JbaW5kZXhLZXldIC0gcm93QVtpbmRleEtleV1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmUgKGEsIGIpIHtcclxuICByZXR1cm4gYS5maWx0ZXIoKG8sIGkpID0+IHtcclxuICAgIGNvbnN0IHIgPSBiKG8pXHJcbiAgICBpZiAocikge1xyXG4gICAgICBhLnNwbGljZShpLCAxKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvbmUgKGEpIHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KGEsIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICAgIH0pXHJcbiAgICApXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIGFcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpcnN0RGVmaW5lZCAoLi4uYXJncykge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKHR5cGVvZiBhcmdzW2ldICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gYXJnc1tpXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3VtIChhcnIpIHtcclxuICByZXR1cm4gYXJyLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VUZW1wbGF0ZUNvbXBvbmVudCAoY29tcENsYXNzLCBkaXNwbGF5TmFtZSkge1xyXG4gIGlmICghZGlzcGxheU5hbWUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm8gZGlzcGxheU5hbWUgZm91bmQgZm9yIHRlbXBsYXRlIGNvbXBvbmVudDonLCBjb21wQ2xhc3MpXHJcbiAgfVxyXG4gIGNvbnN0IGNtcCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIC4uLnJlc3QgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY29tcENsYXNzLCBjbGFzc05hbWUpfSB7Li4ucmVzdH0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvZGl2PlxyXG4gIClcclxuICBjbXAuZGlzcGxheU5hbWUgPSBkaXNwbGF5TmFtZVxyXG4gIHJldHVybiBjbXBcclxufVxyXG5cclxuZnVuY3Rpb24gZ3JvdXBCeSAoeHMsIGtleSkge1xyXG4gIHJldHVybiB4cy5yZWR1Y2UoKHJ2LCB4LCBpKSA9PiB7XHJcbiAgICBjb25zdCByZXNLZXkgPSB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8ga2V5KHgsIGkpIDogeFtrZXldXHJcbiAgICBydltyZXNLZXldID0gaXNBcnJheShydltyZXNLZXldKSA/IHJ2W3Jlc0tleV0gOiBbXVxyXG4gICAgcnZbcmVzS2V5XS5wdXNoKHgpXHJcbiAgICByZXR1cm4gcnZcclxuICB9LCB7fSlcclxufVxyXG5cclxuZnVuY3Rpb24gYXNQeCAodmFsdWUpIHtcclxuICB2YWx1ZSA9IE51bWJlcih2YWx1ZSlcclxuICByZXR1cm4gTnVtYmVyLmlzTmFOKHZhbHVlKSA/IG51bGwgOiBgJHt2YWx1ZX1weGBcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheSAoYSkge1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGEpXHJcbn1cclxuXHJcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG4vLyBOb24tZXhwb3J0ZWQgSGVscGVyc1xyXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuXHJcbmZ1bmN0aW9uIG1ha2VQYXRoQXJyYXkgKG9iaikge1xyXG4gIHJldHVybiBmbGF0dGVuRGVlcChvYmopXHJcbiAgICAuam9pbignLicpXHJcbiAgICAucmVwbGFjZSgvXFxbL2csICcuJylcclxuICAgIC5yZXBsYWNlKC9cXF0vZywgJycpXHJcbiAgICAuc3BsaXQoJy4nKVxyXG59XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuRGVlcCAoYXJyLCBuZXdBcnIgPSBbXSkge1xyXG4gIGlmICghaXNBcnJheShhcnIpKSB7XHJcbiAgICBuZXdBcnIucHVzaChhcnIpXHJcbiAgfSBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZsYXR0ZW5EZWVwKGFycltpXSwgbmV3QXJyKVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbmV3QXJyXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNwbGl0UHJvcHMgKHsgY2xhc3NOYW1lLCBzdHlsZSwgLi4ucmVzdCB9KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGNsYXNzTmFtZSxcclxuICAgIHN0eWxlLFxyXG4gICAgcmVzdDogcmVzdCB8fCB7fSxcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBhY3RPYmplY3QgKG9iaikge1xyXG4gIGNvbnN0IG5ld09iaiA9IHt9XHJcbiAgaWYgKG9iaikge1xyXG4gICAgT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkgJiZcclxuICAgICAgICBvYmpba2V5XSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgdHlwZW9mIG9ialtrZXldICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICApIHtcclxuICAgICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0pXHJcbiAgfVxyXG4gIHJldHVybiBuZXdPYmpcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTb3J0aW5nRGVzYyAoZCkge1xyXG4gIHJldHVybiAhIShkLnNvcnQgPT09ICdkZXNjJyB8fCBkLmRlc2MgPT09IHRydWUgfHwgZC5hc2MgPT09IGZhbHNlKVxyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVDb21wb25lbnQgKENvbXAsIHBhcmFtcyA9IHt9LCBmYWxsYmFjayA9IENvbXApIHtcclxuICByZXR1cm4gdHlwZW9mIENvbXAgPT09ICdmdW5jdGlvbicgPyAoXHJcbiAgICA8Q29tcCB7Li4ucGFyYW1zfSAvPlxyXG4gICkgOiAoXHJcbiAgICBmYWxsYmFja1xyXG4gIClcclxufVxyXG4iXX0=