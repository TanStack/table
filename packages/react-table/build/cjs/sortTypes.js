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

var reSplitAlphaNumeric = /([0-9]+)/gm;
var sortTypes = {
  alphanumeric: alphanumeric,
  alphanumericCaseSensitive: alphanumericCaseSensitive,
  text: text,
  textCaseSensitive: textCaseSensitive,
  datetime: datetime,
  basic: basic
};

function alphanumeric(rowA, rowB, columnId) {
  return compareAlphanumeric(toString(rowA.values[columnId]).toLowerCase(), toString(rowB.values[columnId]).toLowerCase());
}

function alphanumericCaseSensitive(rowA, rowB, columnId) {
  return compareAlphanumeric(toString(rowA.values[columnId]), toString(rowB.values[columnId]));
} // Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity


function compareAlphanumeric(aStr, bStr) {
  // Split on number groups, but keep the delimiter
  // Then remove falsey split values
  var a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
  var b = bStr.split(reSplitAlphaNumeric).filter(Boolean); // While

  while (a.length && b.length) {
    var aa = a.shift();
    var bb = b.shift();
    var an = parseInt(aa, 10);
    var bn = parseInt(bb, 10);
    var combo = [an, bn].sort(); // Both are string

    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }

      if (bb > aa) {
        return -1;
      }

      continue;
    } // One is a string, one is a number


    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    } // Both are numbers


    if (an > bn) {
      return 1;
    }

    if (bn > an) {
      return -1;
    }
  }

  return a.length - b.length;
} // The text filter is more basic (less numeric support)
// but is much faster


function text(rowA, rowB, columnId) {
  return compareBasic(toString(rowA.values[columnId]).toLowerCase(), toString(rowB.values[columnId]).toLowerCase());
} // The text filter is more basic (less numeric support)
// but is much faster


function textCaseSensitive(rowA, rowB, columnId) {
  return compareBasic(toString(rowA.values[columnId]), toString(rowB.values[columnId]));
}

function datetime(rowA, rowB, columnId) {
  return compareBasic(rowA.values[columnId].getTime(), rowB.values[columnId].getTime());
}

function basic(rowA, rowB, columnId) {
  return compareBasic(rowA.values[columnId], rowB.values[columnId]);
} // Utils


function compareBasic(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

function toString(a) {
  if (typeof a === 'number') {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return '';
    }

    return String(a);
  }

  if (typeof a === 'string') {
    return a;
  }

  return '';
}

exports.sortTypes = sortTypes;
//# sourceMappingURL=sortTypes.js.map
