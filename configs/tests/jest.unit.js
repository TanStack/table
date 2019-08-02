const commonConfig = require('./jest.common')

module.exports = {
  ...commonConfig,
  displayName: 'unit',
  coverageDirectory: '../../coverage',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  setupFilesAfterEnv: ['./configs/tests/setup.common.js'],
}
