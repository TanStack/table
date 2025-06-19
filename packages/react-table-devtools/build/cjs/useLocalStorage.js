/**
 * react-table-devtools
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

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var getItem = function getItem(key) {
  try {
    var itemValue = localStorage.getItem(key);

    if (typeof itemValue === 'string') {
      return JSON.parse(itemValue);
    }

    return undefined;
  } catch (_unused) {
    return undefined;
  }
};

function useLocalStorage(key, defaultValue) {
  var _React$useState = React__default["default"].useState(),
      value = _React$useState[0],
      setValue = _React$useState[1];

  React__default["default"].useEffect(function () {
    var initialValue = getItem(key);

    if (typeof initialValue === 'undefined' || initialValue === null) {
      setValue(typeof defaultValue === 'function' ? defaultValue() : defaultValue);
    } else {
      setValue(initialValue);
    }
  }, [defaultValue, key]);
  var setter = React__default["default"].useCallback(function (updater) {
    setValue(function (old) {
      var newVal = updater;

      if (typeof updater == 'function') {
        newVal = updater(old);
      }

      try {
        localStorage.setItem(key, JSON.stringify(newVal));
      } catch (_unused2) {}

      return newVal;
    });
  }, [key]);
  return [value, setter];
}

exports["default"] = useLocalStorage;
//# sourceMappingURL=useLocalStorage.js.map
