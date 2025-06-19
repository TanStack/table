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

var filterTypes = {
  includesString: includesString,
  includesStringSensitive: includesStringSensitive,
  equalsString: equalsString,
  equalsStringSensitive: equalsStringSensitive,
  arrIncludes: arrIncludes,
  arrIncludesAll: arrIncludesAll,
  equals: equals,
  weakEquals: weakEquals,
  betweenNumberRange: betweenNumberRange
};

function includesString(rows, columnIds, filterValue) {
  var search = String(filterValue).toLowerCase();
  rows = rows.filter(function (row) {
    return columnIds.some(function (id) {
      return String(row.values[id]).toLowerCase().includes(search);
    });
  });
  return rows;
}

includesString.autoRemove = function (val) {
  return testFalsey(val);
};

function includesStringSensitive(rows, columnIds, filterValue) {
  var search = String(filterValue);
  rows = rows.filter(function (row) {
    return columnIds.some(function (id) {
      return String(row.values[id]).includes(search);
    });
  });
  return rows;
}

includesStringSensitive.autoRemove = function (val) {
  return testFalsey(val);
};

function equalsString(rows, columnIds, filterValue) {
  var search = String(filterValue).toLowerCase();
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue !== undefined ? String(rowValue).toLowerCase() === search : true;
    });
  });
}

equalsString.autoRemove = function (val) {
  return testFalsey(val);
};

function equalsStringSensitive(rows, columnIds, filterValue) {
  var search = String(filterValue);
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue !== undefined ? String(rowValue) === search : true;
    });
  });
}

equalsStringSensitive.autoRemove = function (val) {
  return testFalsey(val);
};

function arrIncludes(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue.includes(filterValue);
    });
  });
}

arrIncludes.autoRemove = function (val) {
  return testFalsey(val) || !(val != null && val.length);
};

function arrIncludesAll(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue && rowValue.length && filterValue.every(function (val) {
        return rowValue.includes(val);
      });
    });
  });
}

arrIncludesAll.autoRemove = function (val) {
  return testFalsey(val) || !(val != null && val.length);
};

function equals(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue === filterValue;
    });
  });
}

equals.autoRemove = function (val) {
  return testFalsey(val);
};

function weakEquals(rows, columnIds, filterValue) {
  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id]; // eslint-disable-next-line eqeqeq

      return rowValue == filterValue;
    });
  });
}

weakEquals.autoRemove = function (val) {
  return testFalsey(val);
};

function betweenNumberRange(rows, columnIds, filterValue) {
  var _ref = filterValue || [],
      unsafeMin = _ref[0],
      unsafeMax = _ref[1];

  var parsedMin = typeof unsafeMin !== 'number' ? parseFloat(unsafeMin) : unsafeMin;
  var parsedMax = typeof unsafeMax !== 'number' ? parseFloat(unsafeMax) : unsafeMax;
  var min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  var max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;

  if (min > max) {
    var temp = min;
    min = max;
    max = temp;
  }

  return rows.filter(function (row) {
    return columnIds.some(function (id) {
      var rowValue = row.values[id];
      return rowValue >= min && rowValue <= max;
    });
  });
}

betweenNumberRange.autoRemove = function (val) {
  return testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
}; // Utils


function testFalsey(val) {
  return val === undefined || val === null || val === '';
}

exports.filterTypes = filterTypes;
//# sourceMappingURL=filterTypes.js.map
