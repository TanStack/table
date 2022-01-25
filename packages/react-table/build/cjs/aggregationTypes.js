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

var aggregationTypes = {
  sum: sum,
  min: min,
  max: max,
  extent: extent,
  mean: mean,
  median: median,
  unique: unique,
  uniqueCount: uniqueCount,
  count: count
};

function sum(_leafValues, childValues) {
  // It's faster to just add the aggregations together instead of
  // process leaf nodes individually
  return childValues.reduce(function (sum, next) {
    return sum + (typeof next === 'number' ? next : 0);
  }, 0);
}

function min(_leafValues, childValues) {
  var min;

  for (var _iterator = _rollupPluginBabelHelpers.createForOfIteratorHelperLoose(childValues), _step; !(_step = _iterator()).done;) {
    var value = _step.value;

    if (value != null && (min > value || min === undefined && value >= value)) {
      min = value;
    }
  }

  return min;
}

function max(_leafValues, childValues) {
  var max;

  for (var _iterator2 = _rollupPluginBabelHelpers.createForOfIteratorHelperLoose(childValues), _step2; !(_step2 = _iterator2()).done;) {
    var value = _step2.value;

    if (value != null && (max < value || max === undefined && value >= value)) {
      max = value;
    }
  }

  return max;
}

function extent(_leafValues, childValues) {
  var min;
  var max;

  for (var _iterator3 = _rollupPluginBabelHelpers.createForOfIteratorHelperLoose(childValues), _step3; !(_step3 = _iterator3()).done;) {
    var value = _step3.value;

    if (value != null) {
      if (min === undefined) {
        if (value >= value) min = max = value;
      } else {
        if (min > value) min = value;
        if (max < value) max = value;
      }
    }
  }

  return [min, max];
}

function mean(leafValues) {
  var count = 0;
  var sum = 0;

  for (var _iterator4 = _rollupPluginBabelHelpers.createForOfIteratorHelperLoose(leafValues), _step4; !(_step4 = _iterator4()).done;) {
    var value = _step4.value;

    if (value != null && (value = +value) >= value) {
      ++count, sum += value;
    }
  }

  if (count) return sum / count;
  return;
}

function median(values) {
  if (!values.length) {
    return;
  }

  var min = 0;
  var max = 0;
  values.forEach(function (value) {
    if (typeof value === 'number') {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  });
  return (min + max) / 2;
}

function unique(values) {
  return Array.from(new Set(values).values());
}

function uniqueCount(values) {
  return new Set(values).size;
}

function count(values) {
  return values.length;
}

exports.aggregationTypes = aggregationTypes;
//# sourceMappingURL=aggregationTypes.js.map
