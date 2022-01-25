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

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var React = require('react');
var theme = require('./theme.js');
var useMediaQuery = require('./useMediaQuery.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _excluded = ["style"];
var isServer = typeof window === 'undefined';
function styled(type, newStyles, queries) {
  if (queries === void 0) {
    queries = {};
  }

  return /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
    var style = _ref.style,
        rest = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(_ref, _excluded);

    var theme$1 = theme.useTheme();
    var mediaStyles = Object.entries(queries).reduce(function (current, _ref2) {
      var key = _ref2[0],
          value = _ref2[1];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useMediaQuery["default"](key) ? _rollupPluginBabelHelpers["extends"]({}, current, typeof value === 'function' ? value(rest, theme$1) : value) : current;
    }, {});
    return /*#__PURE__*/React__default["default"].createElement(type, _rollupPluginBabelHelpers["extends"]({}, rest, {
      style: _rollupPluginBabelHelpers["extends"]({}, typeof newStyles === 'function' ? newStyles(rest, theme$1) : newStyles, style, mediaStyles),
      ref: ref
    }));
  });
}
function useIsMounted() {
  var mountedRef = React__default["default"].useRef(false);
  var isMounted = React__default["default"].useCallback(function () {
    return mountedRef.current;
  }, []);
  React__default["default"][isServer ? 'useEffect' : 'useLayoutEffect'](function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);
  return isMounted;
}

exports.isServer = isServer;
exports.styled = styled;
exports.useIsMounted = useIsMounted;
//# sourceMappingURL=utils.js.map
