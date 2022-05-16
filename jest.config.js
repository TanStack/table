const path = require('path')
const { lstatSync, readdirSync } = require('fs')

// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages')

const packages = readdirSync(basePath).filter(name => {
  return lstatSync(path.join(basePath, name)).isDirectory()
})

const { namespace } = require('./package.json')

const moduleNameMapper = {
  ...packages.reduce(
    (acc, name) => ({
      ...acc,
      [`${namespace}/${name}(.*)$`]: `<rootDir>/packages/./${name}/src/$1`,
    }),
    {}
  ),
}

module.exports = {
  projects: [
    {
      displayName: 'table-core',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/packages/table-core/**/*.test.[jt]s?(x)'],
      setupFilesAfterEnv: [
        '<rootDir>/packages/table-core/__tests__/jest.setup.js',
      ],
      snapshotFormat: {
        printBasicPrototype: false,
      },
      moduleNameMapper,
    },
    {
      displayName: 'react-table',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/packages/react-table/**/*.test.[jt]s?(x)'],
      setupFilesAfterEnv: [
        '<rootDir>/packages/react-table/__tests__/jest.setup.js',
      ],
      snapshotFormat: {
        printBasicPrototype: false,
      },
      moduleNameMapper,
    },
    {
      displayName: 'react-table-devtools',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/packages/react-table-devtools/**/*.test.[jt]s?(x)',
      ],
      setupFilesAfterEnv: [
        '<rootDir>/packages/react-table-devtools/__tests__/jest.setup.js',
      ],
      snapshotFormat: {
        printBasicPrototype: false,
      },
      moduleNameMapper,
    },
    {
      displayName: 'match-sorter-utils',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/packages/match-sorter-utils/**/*.test.[jt]s?(x)'],
      setupFilesAfterEnv: [
        '<rootDir>/packages/match-sorter-utils/__tests__/jest.setup.js',
      ],
      snapshotFormat: {
        printBasicPrototype: false,
      },
      moduleNameMapper,
    },
  ],
}
