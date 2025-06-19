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
var useLocalStorage = require('./useLocalStorage.js');
var utils = require('./utils.js');
var styledComponents = require('./styledComponents.js');
var theme = require('./theme.js');
var Explorer = require('./Explorer.js');
var Logo = require('./Logo.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var _excluded = ["style"],
    _excluded2 = ["style", "onClick"],
    _excluded3 = ["instance", "isOpen", "setIsOpen"];
function ReactTableDevtools(_ref) {
  var initialIsOpen = _ref.initialIsOpen,
      instance = _ref.instance,
      _ref$panelProps = _ref.panelProps,
      panelProps = _ref$panelProps === void 0 ? {} : _ref$panelProps,
      _ref$toggleButtonProp = _ref.toggleButtonProps,
      toggleButtonProps = _ref$toggleButtonProp === void 0 ? {} : _ref$toggleButtonProp,
      _ref$containerElement = _ref.containerElement,
      Container = _ref$containerElement === void 0 ? 'footer' : _ref$containerElement;
  var rootRef = React__default["default"].useRef(null);
  var panelRef = React__default["default"].useRef(null);

  var _useLocalStorage = useLocalStorage["default"]('reactTableDevtoolsOpen', initialIsOpen),
      isOpen = _useLocalStorage[0],
      setIsOpen = _useLocalStorage[1];

  var isMounted = utils.useIsMounted();

  var _panelProps$style = panelProps.style,
      panelStyle = _panelProps$style === void 0 ? {} : _panelProps$style,
      otherPanelProps = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(panelProps, _excluded);

  var _toggleButtonProps$st = toggleButtonProps.style,
      toggleButtonStyle = _toggleButtonProps$st === void 0 ? {} : _toggleButtonProps$st,
      onToggleClick = toggleButtonProps.onClick,
      otherToggleButtonProps = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(toggleButtonProps, _excluded2); // Do not render on the server


  if (!isMounted()) return null;
  return /*#__PURE__*/React__default["default"].createElement(Container, {
    ref: rootRef,
    className: "ReactTableDevtools"
  }, /*#__PURE__*/React__default["default"].createElement(theme.ThemeProvider, {
    theme: theme.defaultTheme
  }, !isOpen ? /*#__PURE__*/React__default["default"].createElement("button", _rollupPluginBabelHelpers["extends"]({
    type: "button"
  }, otherToggleButtonProps, {
    "aria-label": "Open React Table Devtools",
    onClick: function onClick(e) {
      setIsOpen(true);
      onToggleClick && onToggleClick(e);
    },
    style: _rollupPluginBabelHelpers["extends"]({
      background: 'none',
      border: 0,
      padding: 0,
      margin: '.5rem',
      display: 'inline-flex',
      fontSize: '1.5em',
      cursor: 'pointer',
      width: 'fit-content'
    }, toggleButtonStyle)
  }), /*#__PURE__*/React__default["default"].createElement(Logo["default"], {
    "aria-hidden": true
  })) : /*#__PURE__*/React__default["default"].createElement(ReactTableDevtoolsPanel, _rollupPluginBabelHelpers["extends"]({
    ref: panelRef
  }, otherPanelProps, {
    instance: instance,
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    style: _rollupPluginBabelHelpers["extends"]({
      maxHeight: '80vh',
      width: '100%'
    }, panelStyle)
  }))));
}
var ReactTableDevtoolsPanel = /*#__PURE__*/React__default["default"].forwardRef(function ReactTableDevtoolsPanel(props, ref) {
  var _ref2 = props,
      instance = _ref2.instance,
      _ref2$isOpen = _ref2.isOpen,
      isOpen = _ref2$isOpen === void 0 ? true : _ref2$isOpen,
      setIsOpen = _ref2.setIsOpen,
      panelProps = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(_ref2, _excluded3); // const [activeMatchId, setActiveRouteId] = useLocalStorage(
  //   'reactTableDevtoolsActiveRouteId',
  //   '',
  // )


  return /*#__PURE__*/React__default["default"].createElement(theme.ThemeProvider, {
    theme: theme.defaultTheme
  }, /*#__PURE__*/React__default["default"].createElement(styledComponents.Panel, _rollupPluginBabelHelpers["extends"]({
    ref: ref,
    className: "ReactTableDevtoolsPanel"
  }, panelProps), /*#__PURE__*/React__default["default"].createElement("style", {
    dangerouslySetInnerHTML: {
      __html: "\n            .ReactTableDevtoolsPanel * {\n              scrollbar-color: " + theme.defaultTheme.backgroundAlt + " " + theme.defaultTheme.gray + ";\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar, .ReactTableDevtoolsPanel scrollbar {\n              width: 1em;\n              height: 1em;\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar-track, .ReactTableDevtoolsPanel scrollbar-track {\n              background: " + theme.defaultTheme.backgroundAlt + ";\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar-thumb, .ReactTableDevtoolsPanel scrollbar-thumb {\n              background: " + theme.defaultTheme.gray + ";\n              border-radius: .5em;\n              border: 3px solid " + theme.defaultTheme.backgroundAlt + ";\n            }\n          "
    }
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      flex: '1 1 500px',
      minHeight: '40%',
      maxHeight: '100%',
      overflow: 'auto',
      borderRight: "1px solid " + theme.defaultTheme.grayAlt,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      padding: '.5em',
      background: theme.defaultTheme.backgroundAlt,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Logo["default"], {
    "aria-hidden": true,
    style: {
      marginRight: '.5em'
    },
    onClick: function onClick() {
      return setIsOpen(false);
    }
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      marginRight: 'auto',
      fontSize: 'clamp(.8rem, 2vw, 1.3rem)',
      fontWeight: 'bold'
    }
  }, "React Table", ' ', /*#__PURE__*/React__default["default"].createElement("span", {
    style: {
      fontWeight: 100
    }
  }, "Devtools")), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, isOpen && setIsOpen ? /*#__PURE__*/React__default["default"].createElement(styledComponents.Button, {
    type: "button",
    "aria-label": "Close React Table Devtools",
    onClick: function onClick() {
      setIsOpen(false);
    }
  }, "Close") : null)), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'auto',
      flex: '1'
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      flex: '1 1 auto',
      padding: '.5em'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Instance",
    value: instance,
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: '.5rem'
    }
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "State",
    value: instance.getState(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      height: '.5rem'
    }
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Columns",
    value: instance.getAllColumns(),
    defaultExpanded: false
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    style: {
      flex: '1 1 auto',
      padding: '.5em'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Core Model",
    value: instance.getCoreRowModel(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Column Filtered Rows",
    value: instance.getColumnFilteredRowModel(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Global Filtered Rows",
    value: instance.getGlobalFilteredRowModel(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Sorted Rows",
    value: instance.getSortedRowModel(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Grouped Rows",
    value: instance.getGroupedRowModel(),
    defaultExpanded: false
  }), /*#__PURE__*/React__default["default"].createElement(Explorer["default"], {
    label: "Expanded Rows",
    value: instance.getExpandedRowModel(),
    defaultExpanded: false
  }))))));
});

exports.ReactTableDevtools = ReactTableDevtools;
exports.ReactTableDevtoolsPanel = ReactTableDevtoolsPanel;
//# sourceMappingURL=index.js.map
