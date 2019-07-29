const commonConfig = require('./jest.common')

module.exports = {
  ...commonConfig,

  displayName: 'unit',

  coverageDirectory: '../../coverage',

  testMatch: ['<rootDir>/src/**/tests/**/*.js'],

  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
}
