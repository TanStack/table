const path = require('path')

module.exports = {
  moduleDirectories: [
    'node_modules',
    /*
     * __dirname makes 'test/utils' available in tests, e.g.
     *
     * const {myModule} = require('utils/my-test-helper')
     */
    __dirname,
  ],
  rootDir: path.resolve(__dirname, '../../'),
  roots: ['<rootDir>/src', __dirname],
  transformIgnorePatterns: ['node_modules'],
  collectCoverageFrom: ['src/**/*.js', '!**/*.test.js'],
}
