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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactTableDevtools = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var React__namespace = /*#__PURE__*/_interopNamespace(React);

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

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

  var _excluded$3 = ["theme"];
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
        rest = _objectWithoutPropertiesLoose(_ref, _excluded$3);

    return /*#__PURE__*/React__default["default"].createElement(ThemeContext.Provider, _extends({
      value: theme
    }, rest));
  }
  function useTheme() {
    return React__default["default"].useContext(ThemeContext);
  }

  function useMediaQuery(query) {
    // Keep track of the preference in state, start with the current match
    var _React$useState = React__default["default"].useState(function () {
      if (typeof window !== 'undefined') {
        return window.matchMedia && window.matchMedia(query).matches;
      }
    }),
        isMatch = _React$useState[0],
        setIsMatch = _React$useState[1]; // Watch for changes


    React__default["default"].useEffect(function () {
      if (typeof window !== 'undefined') {
        if (!window.matchMedia) {
          return;
        } // Create a matcher


        var matcher = window.matchMedia(query); // Create our handler

        var onChange = function onChange(_ref) {
          var matches = _ref.matches;
          return setIsMatch(matches);
        }; // Listen for changes


        matcher.addListener(onChange);
        return function () {
          // Stop listening for changes
          matcher.removeListener(onChange);
        };
      }
    }, [isMatch, query, setIsMatch]);
    return isMatch;
  }

  var _excluded$2 = ["style"];
  var isServer = typeof window === 'undefined';
  function styled(type, newStyles, queries) {
    if (queries === void 0) {
      queries = {};
    }

    return /*#__PURE__*/React__default["default"].forwardRef(function (_ref, ref) {
      var style = _ref.style,
          rest = _objectWithoutPropertiesLoose(_ref, _excluded$2);

      var theme = useTheme();
      var mediaStyles = Object.entries(queries).reduce(function (current, _ref2) {
        var key = _ref2[0],
            value = _ref2[1];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMediaQuery(key) ? _extends({}, current, typeof value === 'function' ? value(rest, theme) : value) : current;
      }, {});
      return /*#__PURE__*/React__default["default"].createElement(type, _extends({}, rest, {
        style: _extends({}, typeof newStyles === 'function' ? newStyles(rest, theme) : newStyles, style, mediaStyles),
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

  var Panel = styled('div', function (_props, theme) {
    return {
      fontSize: 'clamp(12px, 1.5vw, 14px)',
      fontFamily: "sans-serif",
      display: 'flex',
      backgroundColor: theme.background,
      color: theme.foreground
    };
  }, {
    '(max-width: 700px)': {
      flexDirection: 'column'
    },
    '(max-width: 600px)': {
      fontSize: '.9em' // flexDirection: 'column',

    }
  });
  styled('div', function () {
    return {
      flex: '1 1 500px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      height: '100%'
    };
  }, {
    '(max-width: 700px)': function maxWidth700px(_props, theme) {
      return {
        borderTop: "2px solid " + theme.gray
      };
    }
  });
  var Button = styled('button', function (props, theme) {
    return {
      appearance: 'none',
      fontSize: '.9em',
      fontWeight: 'bold',
      background: theme.gray,
      border: '0',
      borderRadius: '.3em',
      color: 'white',
      padding: '.5em',
      opacity: props.disabled ? '.5' : undefined,
      cursor: 'pointer'
    };
  }); // export const QueryKeys = styled('span', {
  //   display: 'inline-block',
  //   fontSize: '0.9em',
  // })
  // export const QueryKey = styled('span', {
  //   display: 'inline-flex',
  //   alignItems: 'center',
  //   padding: '.2em .4em',
  //   fontWeight: 'bold',
  //   textShadow: '0 0 10px black',
  //   borderRadius: '.2em',
  // })

  styled('code', {
    fontSize: '.9em'
  });
  styled('input', function (_props, theme) {
    return {
      backgroundColor: theme.inputBackgroundColor,
      border: 0,
      borderRadius: '.2em',
      color: theme.inputTextColor,
      fontSize: '.9em',
      lineHeight: "1.3",
      padding: '.3em .4em'
    };
  });
  styled('select', function (_props, theme) {
    return {
      display: "inline-block",
      fontSize: ".9em",
      fontFamily: "sans-serif",
      fontWeight: 'normal',
      lineHeight: "1.3",
      padding: ".3em 1.5em .3em .5em",
      height: 'auto',
      border: 0,
      borderRadius: ".2em",
      appearance: "none",
      WebkitAppearance: 'none',
      backgroundColor: theme.inputBackgroundColor,
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23444444'><polygon points='0,25 100,25 50,75'/></svg>\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right .55em center",
      backgroundSize: ".65em auto, 100%",
      color: theme.inputTextColor
    };
  }, {
    '(max-width: 500px)': {
      display: 'none'
    }
  });

  var _excluded$1 = ["expanded", "style"],
      _excluded2$1 = ["value", "defaultExpanded", "renderer", "pageSize", "depth"];
  var Entry = styled('div', {
    fontFamily: 'Menlo, monospace',
    fontSize: '0.7rem',
    lineHeight: '1.7',
    outline: 'none',
    wordBreak: 'break-word'
  });
  var Label = styled('span', {
    cursor: 'pointer',
    color: 'white'
  });
  var Value = styled('span', function (props, theme) {
    return {
      color: theme.danger
    };
  });
  var SubEntries = styled('div', {
    marginLeft: '.1rem',
    paddingLeft: '1rem',
    borderLeft: '2px solid rgba(0,0,0,.15)'
  });
  var Info = styled('span', {
    color: 'grey',
    fontSize: '.7rem'
  });
  var Expander = function Expander(_ref) {
    var expanded = _ref.expanded,
        _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style;
        _objectWithoutPropertiesLoose(_ref, _excluded$1);

    return /*#__PURE__*/React__default["default"].createElement("span", {
      style: _extends({
        display: 'inline-block',
        transition: 'all .1s ease',
        transform: "rotate(" + (expanded ? 90 : 0) + "deg) " + (style.transform || '')
      }, style)
    }, "\u25B6");
  };

  var DefaultRenderer = function DefaultRenderer(_ref2) {
    var handleEntry = _ref2.handleEntry,
        label = _ref2.label,
        value = _ref2.value,
        subEntries = _ref2.subEntries,
        subEntryPages = _ref2.subEntryPages,
        type = _ref2.type,
        expanded = _ref2.expanded,
        toggle = _ref2.toggle,
        pageSize = _ref2.pageSize,
        renderer = _ref2.renderer;

    var _React$useState = React__default["default"].useState(undefined),
        valueSnapshot = _React$useState[0],
        setValueSnapshot = _React$useState[1];

    var _React$useState2 = React__default["default"].useState([]),
        expandedPages = _React$useState2[0],
        setExpandedPages = _React$useState2[1];

    var refreshValueSnapshot = function refreshValueSnapshot() {
      setValueSnapshot(value());
    };

    return /*#__PURE__*/React__default["default"].createElement(Entry, {
      key: label
    }, subEntryPages != null && subEntryPages.length ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Label, {
      onClick: function onClick() {
        return toggle();
      }
    }, /*#__PURE__*/React__default["default"].createElement(Expander, {
      expanded: expanded
    }), " ", label, ' ', /*#__PURE__*/React__default["default"].createElement(Info, null, String(type).toLowerCase() === 'iterable' ? '(Iterable) ' : '', subEntries.length, " ", subEntries.length > 1 ? "items" : "item")), expanded ? subEntryPages.length === 1 ? /*#__PURE__*/React__default["default"].createElement(SubEntries, null, subEntries.map(function (entry) {
      return handleEntry(entry);
    })) : /*#__PURE__*/React__default["default"].createElement(SubEntries, null, subEntryPages.map(function (entries, index) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        key: index
      }, /*#__PURE__*/React__default["default"].createElement(Entry, null, /*#__PURE__*/React__default["default"].createElement(Label, {
        onClick: function onClick() {
          return setExpandedPages(function (old) {
            return old.includes(index) ? old.filter(function (d) {
              return d !== index;
            }) : [].concat(old, [index]);
          });
        }
      }, /*#__PURE__*/React__default["default"].createElement(Expander, {
        expanded: expanded
      }), " [", index * pageSize, " ...", ' ', index * pageSize + pageSize - 1, "]"), expandedPages.includes(index) ? /*#__PURE__*/React__default["default"].createElement(SubEntries, null, entries.map(function (entry) {
        return handleEntry(entry);
      })) : null));
    })) : null) : type === 'function' ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Explorer, {
      renderer: renderer,
      label: /*#__PURE__*/React__default["default"].createElement("button", {
        onClick: refreshValueSnapshot
      }, /*#__PURE__*/React__default["default"].createElement(Label, null, label), " \uD83D\uDD04", ' '),
      value: valueSnapshot,
      defaultExpanded: {}
    })) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Label, null, label, ":"), ' ', /*#__PURE__*/React__default["default"].createElement(Value, null, JSON.stringify(value, Object.getOwnPropertyNames(Object(value))))));
  };

  function Explorer(_ref3) {
    var value = _ref3.value,
        defaultExpanded = _ref3.defaultExpanded,
        _ref3$renderer = _ref3.renderer,
        renderer = _ref3$renderer === void 0 ? DefaultRenderer : _ref3$renderer,
        _ref3$pageSize = _ref3.pageSize,
        pageSize = _ref3$pageSize === void 0 ? 100 : _ref3$pageSize,
        _ref3$depth = _ref3.depth,
        depth = _ref3$depth === void 0 ? 0 : _ref3$depth,
        rest = _objectWithoutPropertiesLoose(_ref3, _excluded2$1);

    var _React$useState3 = React__default["default"].useState(defaultExpanded),
        expanded = _React$useState3[0],
        setExpanded = _React$useState3[1];

    var toggle = function toggle(set) {
      setExpanded(function (old) {
        return typeof set !== 'undefined' ? set : !old;
      });
    };

    var path = [];
    var type = typeof value;
    var subEntries;
    var subEntryPages = [];

    var makeProperty = function makeProperty(sub) {
      var _ref4;

      var newPath = path.concat(sub.label);
      var subDefaultExpanded = defaultExpanded === true ? (_ref4 = {}, _ref4[sub.label] = true, _ref4) : defaultExpanded == null ? void 0 : defaultExpanded[sub.label];
      return _extends({}, sub, {
        subPath: sub,
        path: newPath,
        depth: depth + 1,
        defaultExpanded: subDefaultExpanded
      });
    };

    if (Array.isArray(value)) {
      type = 'array';
      subEntries = value.map(function (d, i) {
        return makeProperty({
          label: i,
          value: d
        });
      });
    } else if (value !== null && typeof value === 'object' && typeof value[Symbol.iterator] === 'function') {
      type = 'Iterable';
      subEntries = Array.from(value, function (val, i) {
        return makeProperty({
          label: i,
          value: val
        });
      });
    } else if (typeof value === 'function') {
      type = 'function';
    } else if (typeof value === 'object' && value !== null) {
      type = 'object'; // eslint-disable-next-line no-shadow

      subEntries = Object.entries(value).map(function (_ref5) {
        var label = _ref5[0],
            value = _ref5[1];
        return makeProperty({
          label: label,
          value: value
        });
      });
    }

    if (subEntries) {
      var i = 0;

      while (i < subEntries.length) {
        subEntryPages.push(subEntries.slice(i, i + pageSize));
        i = i + pageSize;
      }
    }

    return renderer(_extends({
      handleEntry: function handleEntry(entry) {
        return /*#__PURE__*/React__default["default"].createElement(Explorer, _extends({
          key: entry.label,
          renderer: renderer
        }, rest, entry));
      },
      type: type,
      subEntries: subEntries,
      subEntryPages: subEntryPages,
      depth: depth,
      value: value,
      path: path,
      expanded: expanded,
      toggle: toggle,
      pageSize: pageSize
    }, rest));
  }

  function Logo(props) {
    return /*#__PURE__*/React__namespace.createElement("svg", _extends({
      width: "40px",
      height: "40px",
      viewBox: "0 0 190 190",
      version: "1.1"
    }, props), /*#__PURE__*/React__namespace.createElement("g", {
      stroke: "none",
      strokeWidth: "1",
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React__namespace.createElement("g", {
      id: "og-white",
      transform: "translate(-28.000000, -21.000000)"
    }, /*#__PURE__*/React__namespace.createElement("g", {
      id: "Group-2",
      transform: "translate(28.000000, 31.000000)"
    }, /*#__PURE__*/React__namespace.createElement("g", {
      id: "Group",
      transform: "translate(0.000000, 10.000000)"
    }, /*#__PURE__*/React__namespace.createElement("path", {
      d: "M39.7239712,51.3436237 C36.631224,36.362877 35.9675112,24.8727722 37.9666331,16.5293551 C39.1555965,11.5671678 41.3293088,7.51908462 44.6346064,4.59846305 C48.1241394,1.51504777 52.5360327,0.00201216606 57.493257,0.00201216606 C65.6712013,0.00201216606 74.2682602,3.72732143 83.4557246,10.8044264 C87.2031203,13.6910458 91.0924366,17.170411 95.1316515,21.2444746 C95.4531404,20.8310265 95.8165416,20.4410453 96.2214301,20.0806152 C107.64098,9.91497158 117.255245,3.59892716 125.478408,1.16365068 C130.367899,-0.284364005 134.958526,-0.422317978 139.138936,0.983031021 C143.551631,2.46646844 147.06766,5.53294888 149.548314,9.82810912 C153.642288,16.9166735 154.721918,26.2310983 153.195595,37.7320243 C152.573451,42.4199112 151.50985,47.5263831 150.007094,53.0593153 C150.574045,53.1277086 151.142416,53.2532808 151.705041,53.4395297 C166.193932,58.2358678 176.453582,63.3937462 182.665021,69.2882839 C186.360669,72.7953831 188.773972,76.6998434 189.646365,81.0218204 C190.567176,85.5836746 189.669313,90.1593316 187.191548,94.4512967 C183.105211,101.529614 175.591643,107.11221 164.887587,111.534031 C160.589552,113.309539 155.726579,114.917559 150.293259,116.363748 C150.541176,116.92292 150.733521,117.516759 150.862138,118.139758 C153.954886,133.120505 154.618598,144.61061 152.619477,152.954027 C151.430513,157.916214 149.256801,161.964297 145.951503,164.884919 C142.46197,167.968334 138.050077,169.48137 133.092853,169.48137 C124.914908,169.48137 116.31785,165.756061 107.130385,158.678956 C103.343104,155.761613 99.4108655,152.238839 95.3254337,148.108619 C94.9050753,148.765474 94.3889681,149.376011 93.7785699,149.919385 C82.3590198,160.085028 72.744755,166.401073 64.5215915,168.836349 C59.6321009,170.284364 55.0414736,170.422318 50.8610636,169.016969 C46.4483686,167.533532 42.9323404,164.467051 40.4516862,160.171891 C36.3577116,153.083327 35.2780823,143.768902 36.8044053,132.267976 C37.449038,127.410634 38.56762,122.103898 40.1575891,116.339009 C39.5361041,116.276104 38.9120754,116.144816 38.2949591,115.940529 C23.8060684,111.144191 13.5464184,105.986312 7.33497892,100.091775 C3.63933121,96.5846754 1.22602752,92.6802151 0.353635235,88.3582381 C-0.567176333,83.7963839 0.330686581,79.2207269 2.80845236,74.9287618 C6.89478863,67.8504443 14.4083565,62.2678481 25.1124133,57.8460273 C29.5385143,56.0176154 34.5637208,54.366822 40.1939394,52.8874674 C39.9933393,52.3969171 39.8349374,51.8811235 39.7239712,51.3436237 Z",
      id: "Path",
      fill: "#002C4B",
      fillRule: "nonzero",
      transform: "translate(95.000000, 85.000000) scale(-1, 1) translate(-95.000000, -85.000000) "
    }), /*#__PURE__*/React__namespace.createElement("path", {
      d: "M91.735,110 L91.735,116 L80.6322051,116 C78.8411286,116 77.1868614,115.041975 76.2954489,113.488483 L74.294,110 L91.735,110 Z M116.181,110 L114.180256,113.488483 C113.288844,115.041975 111.634576,116 109.8435,116 L98.735,116 L98.735,110 L116.181,110 Z M91.735,96 L91.735,103 L70.277,103 L66.26,96 L91.735,96 Z M124.215,96 L120.198,103 L98.735,103 L98.735,96 L124.215,96 Z M91.735,82 L91.735,89 L62.244,89 L61.6632438,87.9884826 C60.7789187,86.4473417 60.7789187,84.5526583 61.6632438,83.0115174 L62.243,82 L91.735,82 Z M128.232,82 L128.812461,83.0115174 C129.696786,84.5526583 129.696786,86.4473417 128.812461,87.9884826 L128.231,89 L98.735,89 L98.735,82 L128.232,82 Z M91.735,68 L91.735,75 L66.26,75 L70.277,68 L91.735,68 Z M120.198,68 L124.215,75 L98.735,75 L98.735,68 L120.198,68 Z M91.735,55 L91.735,61 L74.293,61 L76.2954489,57.5115174 C77.1868614,55.958025 78.8411286,55 80.6322051,55 L91.735,55 Z M109.8435,55 C111.634576,55 113.288844,55.958025 114.180256,57.5115174 L116.182,61 L98.735,61 L98.735,55 L109.8435,55 Z",
      id: "Polygon-2",
      fill: "#FFD94C"
    }), /*#__PURE__*/React__namespace.createElement("path", {
      d: "M54.8601729,98.3577578 C56.1715224,97.6082856 57.8360246,98.0746014 58.5779424,99.3993034 L58.5779424,99.3993034 L59.0525843,100.24352 C62.8563392,106.982993 66.8190116,113.380176 70.9406016,119.435068 C75.8078808,126.585427 81.28184,133.82411 87.3624792,141.151115 C88.3168778,142.30114 88.1849437,144.011176 87.065686,144.997937 L87.065686,144.997937 L86.4542085,145.534625 C66.3465389,163.103314 53.2778188,166.612552 47.2480482,156.062341 C41.3500652,145.742717 43.4844915,126.982888 53.6513274,99.7828526 C53.876818,99.1795821 54.3045861,98.675291 54.8601729,98.3577578 Z M140.534177,119.041504 C141.986131,118.785177 143.375496,119.742138 143.65963,121.194242 L143.65963,121.194242 L143.812815,121.986376 C148.782365,147.995459 145.283348,161 133.315764,161 C121.609745,161 106.708724,149.909007 88.6127018,127.727022 C88.2113495,127.235047 87.9945723,126.617371 88,125.981509 C88.013158,124.480686 89.2357854,123.274651 90.730918,123.287756 L90.730918,123.287756 L91.6846544,123.294531 C99.3056979,123.335994 106.714387,123.071591 113.910723,122.501323 C122.409039,121.82788 131.283523,120.674607 140.534177,119.041504 Z M147.408726,63.8119663 C147.932139,62.4026903 149.508386,61.6634537 150.954581,62.149012 L150.954581,62.149012 L151.742552,62.4154854 C177.583763,71.217922 187.402356,80.8916805 181.198332,91.4367609 C175.129904,101.751366 157.484347,109.260339 128.26166,113.963678 C127.613529,114.067994 126.948643,113.945969 126.382735,113.618843 C125.047025,112.846729 124.602046,111.158214 125.388848,109.847438 L125.388848,109.847438 L125.889328,109.0105 C129.877183,102.31633 133.481358,95.6542621 136.701854,89.0242957 C140.50501,81.1948179 144.073967,72.7907081 147.408726,63.8119663 Z M61.7383398,56.0363218 C62.3864708,55.9320063 63.0513565,56.0540315 63.6172646,56.3811573 C64.9529754,57.153271 65.3979538,58.8417862 64.6111517,60.1525615 L64.6111517,60.1525615 L64.1106718,60.9895001 C60.1228168,67.6836699 56.5186416,74.3457379 53.2981462,80.9757043 C49.49499,88.8051821 45.9260328,97.2092919 42.5912744,106.188034 C42.0678608,107.59731 40.4916142,108.336546 39.045419,107.850988 L39.045419,107.850988 L38.2574475,107.584515 C12.4162372,98.782078 2.59764398,89.1083195 8.80166786,78.5632391 C14.8700957,68.2486335 32.515653,60.7396611 61.7383398,56.0363218 Z M103.545792,24.4653746 C123.653461,6.89668641 136.722181,3.38744778 142.751952,13.9376587 C148.649935,24.2572826 146.515508,43.0171122 136.348673,70.2171474 C136.123182,70.8204179 135.695414,71.324709 135.139827,71.6422422 C133.828478,72.3917144 132.163975,71.9253986 131.422058,70.6006966 L131.422058,70.6006966 L130.947416,69.7564798 C127.143661,63.0170065 123.180988,56.6198239 119.059398,50.564932 C114.192119,43.4145727 108.71816,36.1758903 102.637521,28.8488847 C101.683122,27.6988602 101.815056,25.9888243 102.934314,25.0020629 L102.934314,25.0020629 Z M57.6842361,8 C69.3902551,8 84.2912758,19.0909926 102.387298,41.2729777 C102.788651,41.7649527 103.005428,42.3826288 103,43.0184911 C102.986842,44.5193144 101.764215,45.7253489 100.269082,45.7122445 L100.269082,45.7122445 L99.3153456,45.7054689 C91.6943021,45.6640063 84.2856126,45.9284091 77.0892772,46.4986773 C68.5909612,47.17212 59.7164767,48.325393 50.4658235,49.9584962 C49.0138691,50.2148231 47.6245044,49.2578618 47.3403697,47.805758 L47.3403697,47.805758 L47.1871846,47.0136235 C42.2176347,21.0045412 45.7166519,8 57.6842361,8 Z",
      id: "Combined-Shape",
      fill: "#FF4154"
    }))))));
  }

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

    var _useLocalStorage = useLocalStorage('reactTableDevtoolsOpen', initialIsOpen),
        isOpen = _useLocalStorage[0],
        setIsOpen = _useLocalStorage[1];

    var isMounted = useIsMounted();

    var _panelProps$style = panelProps.style,
        panelStyle = _panelProps$style === void 0 ? {} : _panelProps$style,
        otherPanelProps = _objectWithoutPropertiesLoose(panelProps, _excluded);

    var _toggleButtonProps$st = toggleButtonProps.style,
        toggleButtonStyle = _toggleButtonProps$st === void 0 ? {} : _toggleButtonProps$st,
        onToggleClick = toggleButtonProps.onClick,
        otherToggleButtonProps = _objectWithoutPropertiesLoose(toggleButtonProps, _excluded2); // Do not render on the server


    if (!isMounted()) return null;
    return /*#__PURE__*/React__default["default"].createElement(Container, {
      ref: rootRef,
      className: "ReactTableDevtools"
    }, /*#__PURE__*/React__default["default"].createElement(ThemeProvider, {
      theme: defaultTheme
    }, !isOpen ? /*#__PURE__*/React__default["default"].createElement("button", _extends({
      type: "button"
    }, otherToggleButtonProps, {
      "aria-label": "Open React Table Devtools",
      onClick: function onClick(e) {
        setIsOpen(true);
        onToggleClick && onToggleClick(e);
      },
      style: _extends({
        background: 'none',
        border: 0,
        padding: 0,
        margin: '.5rem',
        display: 'inline-flex',
        fontSize: '1.5em',
        cursor: 'pointer',
        width: 'fit-content'
      }, toggleButtonStyle)
    }), /*#__PURE__*/React__default["default"].createElement(Logo, {
      "aria-hidden": true
    })) : /*#__PURE__*/React__default["default"].createElement(ReactTableDevtoolsPanel, _extends({
      ref: panelRef
    }, otherPanelProps, {
      instance: instance,
      isOpen: isOpen,
      setIsOpen: setIsOpen,
      style: _extends({
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
        panelProps = _objectWithoutPropertiesLoose(_ref2, _excluded3); // const [activeMatchId, setActiveRouteId] = useLocalStorage(
    //   'reactTableDevtoolsActiveRouteId',
    //   '',
    // )


    return /*#__PURE__*/React__default["default"].createElement(ThemeProvider, {
      theme: defaultTheme
    }, /*#__PURE__*/React__default["default"].createElement(Panel, _extends({
      ref: ref,
      className: "ReactTableDevtoolsPanel"
    }, panelProps), /*#__PURE__*/React__default["default"].createElement("style", {
      dangerouslySetInnerHTML: {
        __html: "\n            .ReactTableDevtoolsPanel * {\n              scrollbar-color: " + defaultTheme.backgroundAlt + " " + defaultTheme.gray + ";\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar, .ReactTableDevtoolsPanel scrollbar {\n              width: 1em;\n              height: 1em;\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar-track, .ReactTableDevtoolsPanel scrollbar-track {\n              background: " + defaultTheme.backgroundAlt + ";\n            }\n\n            .ReactTableDevtoolsPanel *::-webkit-scrollbar-thumb, .ReactTableDevtoolsPanel scrollbar-thumb {\n              background: " + defaultTheme.gray + ";\n              border-radius: .5em;\n              border: 3px solid " + defaultTheme.backgroundAlt + ";\n            }\n          "
      }
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        flex: '1 1 500px',
        minHeight: '40%',
        maxHeight: '100%',
        overflow: 'auto',
        borderRight: "1px solid " + defaultTheme.grayAlt,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        padding: '.5em',
        background: defaultTheme.backgroundAlt,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default["default"].createElement(Logo, {
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
    }, isOpen && setIsOpen ? /*#__PURE__*/React__default["default"].createElement(Button, {
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
    }, /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Instance",
      value: instance,
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        height: '.5rem'
      }
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "State",
      value: instance.getState(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        height: '.5rem'
      }
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Columns",
      value: instance.getAllColumns(),
      defaultExpanded: false
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        flex: '1 1 auto',
        padding: '.5em'
      }
    }, /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Core Model",
      value: instance.getCoreRowModel(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Column Filtered Rows",
      value: instance.getColumnFilteredRowModel(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Global Filtered Rows",
      value: instance.getGlobalFilteredRowModel(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Sorted Rows",
      value: instance.getSortedRowModel(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Grouped Rows",
      value: instance.getGroupedRowModel(),
      defaultExpanded: false
    }), /*#__PURE__*/React__default["default"].createElement(Explorer, {
      label: "Expanded Rows",
      value: instance.getExpandedRowModel(),
      defaultExpanded: false
    }))))));
  });

  exports.ReactTableDevtools = ReactTableDevtools;
  exports.ReactTableDevtoolsPanel = ReactTableDevtoolsPanel;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.development.js.map
