const path = require('path');

module.exports = {
  moduleDirectories: [
    'node_modules',
    /*
     * make 'test/utils' available in tests, e.g.
     *
     * const {myModule} = require('utils/my-test-helper')
     */
    __dirname,
  ],

  rootDir: path.resolve(__dirname, '../..'),

  roots: ['<rootDir>/src', __dirname],
};
