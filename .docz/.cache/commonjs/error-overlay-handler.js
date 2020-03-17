"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.errorMap = exports.reportError = exports.clearError = void 0;

var ReactRefreshErrorOverlay = _interopRequireWildcard(require("@pmmmwh/react-refresh-webpack-plugin/src/overlay"));

var ReactErrorOverlay = _interopRequireWildcard(require("react-error-overlay"));

const ErrorOverlay = {
  showCompileError: process.env.GATSBY_HOT_LOADER !== `fast-refresh` ? ReactErrorOverlay.reportBuildError : ReactRefreshErrorOverlay.showCompileError,
  clearCompileError: process.env.GATSBY_HOT_LOADER !== `fast-refresh` ? ReactErrorOverlay.dismissBuildError : ReactRefreshErrorOverlay.clearCompileError
};

if (process.env.GATSBY_HOT_LOADER !== `fast-refresh`) {
  // Report runtime errors
  ReactErrorOverlay.startReportingRuntimeErrors({
    onError: () => {},
    filename: `/commons.js`
  });
  ReactErrorOverlay.setEditorHandler(errorLocation => window.fetch(`/__open-stack-frame-in-editor?fileName=` + window.encodeURIComponent(errorLocation.fileName) + `&lineNumber=` + window.encodeURIComponent(errorLocation.lineNumber || 1)));
}

const errorMap = {};
exports.errorMap = errorMap;

function flat(arr) {
  return Array.prototype.flat ? arr.flat() : [].concat(...arr);
}

const handleErrorOverlay = () => {
  const errors = Object.values(errorMap);
  let errorStringsToDisplay = [];

  if (errors.length > 0) {
    errorStringsToDisplay = flat(errors).map(error => {
      if (typeof error === `string`) {
        return error;
      } else if (typeof error === `object`) {
        const errorStrBuilder = [error.text];

        if (error.filePath) {
          errorStrBuilder.push(`File: ${error.filePath}`);
        }

        return errorStrBuilder.join(`\n\n`);
      }

      return null;
    }).filter(Boolean);
  }

  if (errorStringsToDisplay.length > 0) {
    ErrorOverlay.showCompileError(errorStringsToDisplay.join(`\n\n`));
  } else {
    ErrorOverlay.clearCompileError();
  }
};

const clearError = errorID => {
  delete errorMap[errorID];
  handleErrorOverlay();
};

exports.clearError = clearError;

const reportError = (errorID, error) => {
  if (error) {
    errorMap[errorID] = error;
  }

  handleErrorOverlay();
};

exports.reportError = reportError;