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
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testRegex: ['/src/.*\.test\.(t|j)sx?'],
  testPathIgnorePatterns: ['<rootDir>/types/'],
  moduleNameMapper: {
    'react-table': '<rootDir>/src/index.ts',
  },
}
