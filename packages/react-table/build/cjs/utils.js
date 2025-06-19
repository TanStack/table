/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}
function makeStateUpdater(key, instance) {
  return function (updater) {
    instance.setState(function (old) {
      var _extends2;

      return _rollupPluginBabelHelpers["extends"]({}, old, (_extends2 = {}, _extends2[key] = functionalUpdate(updater, old[key]), _extends2));
    });
  };
} // SSR has issues with useLayoutEffect still, so use useEffect during SSR

typeof document !== 'undefined' ? React__default["default"].useLayoutEffect : React__default["default"].useEffect;
function isFunction(d) {
  return d instanceof Function;
}
function flattenBy(arr, getChildren) {
  var flat = [];

  var recurse = function recurse(subArr) {
    subArr.forEach(function (item) {
      flat.push(item);
      var children = getChildren(item);

      if (children != null && children.length) {
        recurse(children);
      }
    });
  };

  recurse(arr);
  return flat;
}
// @ts-ignore // Just rely on the type, not the implementation
var propGetter = function propGetter(initial, getter) {
  if (isFunction(getter)) {
    return getter(initial);
  }

  return _rollupPluginBabelHelpers["extends"]({}, initial, getter != null ? getter : {});
};
function memo(getDeps, fn, key, debug) {
  var deps = [];
  var result;
  return function () {
    var newDeps = getDeps();
    var newSerializedDeps = newDeps;
    var oldSerializedDeps = deps;
    var depsChanged = newSerializedDeps.length !== oldSerializedDeps.length || newSerializedDeps.some(function (dep, index) {
      return oldSerializedDeps[index] !== dep;
    });

    if (depsChanged) {
      if (debug) {
        console.info(key, _rollupPluginBabelHelpers["extends"]({
          length: oldSerializedDeps.length + " -> " + newSerializedDeps.length
        }, newSerializedDeps.map(function (_, index) {
          if (oldSerializedDeps[index] !== newSerializedDeps[index]) {
            return [index, oldSerializedDeps[index], newSerializedDeps[index]];
          }

          return false;
        }).filter(Boolean).reduce(function (accu, curr) {
          var _extends3;

          return _rollupPluginBabelHelpers["extends"]({}, accu, (_extends3 = {}, _extends3[curr[0]] = curr.slice(1), _extends3));
        }, {}), {
          parent: parent
        }));
      }

      result = fn.apply(void 0, newDeps);
      deps = newSerializedDeps;
    }

    return result;
  };
} // Copied from: https://github.com/jonschlinkert/is-plain-object

function flexRender(Comp, props) {
  return !Comp ? null : isReactComponent(Comp) ? /*#__PURE__*/React__default["default"].createElement(Comp, props) : Comp;
}

function isReactComponent(component) {
  return isClassComponent(component) || typeof component === 'function' || isExoticComponent(component);
}

function isClassComponent(component) {
  return typeof component === 'function' && function () {
    var proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  }();
}

function isExoticComponent(component) {
  return typeof component === 'object' && typeof component.$$typeof === 'symbol' && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description);
} // export function hashString(str: string, seed = 0): string {
//   let h1 = 0xdeadbeef ^ seed,
//     h2 = 0x41c6ce57 ^ seed
//   for (let i = 0, ch; i < str.length; i++) {
//     ch = str.charCodeAt(i)
//     h1 = Math.imul(h1 ^ ch, 2654435761)
//     h2 = Math.imul(h2 ^ ch, 1597334677)
//   }
//   h1 =
//     Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
//     Math.imul(h2 ^ (h2 >>> 13), 3266489909)
//   h2 =
//     Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
//     Math.imul(h1 ^ (h1 >>> 13), 3266489909)
//   return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString()
// }

exports.flattenBy = flattenBy;
exports.flexRender = flexRender;
exports.functionalUpdate = functionalUpdate;
exports.isFunction = isFunction;
exports.makeStateUpdater = makeStateUpdater;
exports.memo = memo;
exports.propGetter = propGetter;
//# sourceMappingURL=utils.js.map
