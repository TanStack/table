const commonConfig = require('./jest.common');

module.exports = {
  ...commonConfig,

  displayName: 'unit',

  coverageDirectory: '../../coverage',

  testMatch: ['<rootDir>/tests/**/*.js'],

  transform: {
    // '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
};
