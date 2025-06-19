const path = require('path')

const lintProject = require('./configs/tests/jest.lint')
const unitProject = require('./configs/tests/jest.unit')

module.exports = {
  ...require('./configs/tests/jest.common'),

  projects: [lintProject, unitProject],

  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
  ],
}
