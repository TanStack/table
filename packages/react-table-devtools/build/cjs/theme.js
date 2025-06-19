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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _excluded = ["theme"];
var defaultTheme = {
  background: '#0b1521',
  backgroundAlt: '#132337',
  foreground: 'white',
  gray: '#3f4e60',
  grayAlt: '#222e3e',
  inputBackgroundColor: '#fff',
  inputTextColor: '#000',
  success: '#00ab52',
  danger: '#ff0085',
  active: '#006bff',
  warning: '#ffb200'
};
var ThemeContext = /*#__PURE__*/React__default["default"].createContext(defaultTheme);
function ThemeProvider(_ref) {
  var theme = _ref.theme,
      rest = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(_ref, _excluded);

  return /*#__PURE__*/React__default["default"].createElement(ThemeContext.Provider, _rollupPluginBabelHelpers["extends"]({
    value: theme
  }, rest));
}
function useTheme() {
  return React__default["default"].useContext(ThemeContext);
}

exports.ThemeProvider = ThemeProvider;
exports.defaultTheme = defaultTheme;
exports.useTheme = useTheme;
//# sourceMappingURL=theme.js.map
