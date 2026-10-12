// @ts-check

import { readdirSync } from 'node:fs'
import path from 'node:path'
import rootConfig from '../../eslint.config.js'

const featuresDir = path.join(import.meta.dirname, 'src/features')
const features = readdirSync(featuresDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

// Type-only `.types` files may be imported from anywhere
const featureTypes = path.join(featuresDir, '**/*.types.ts')

// Modules a feature imports from another feature it depends on. Anything else
// goes through `src/core/featureStubs.ts`, so a table only bundles the
// features it registers.
/** @type {Record<string, Array<string>>} */
const featureDependencies = {
  'column-faceting': ['column-filtering/filterRowsUtils'],
  'column-grouping': [
    'column-ordering/columnOrderingFeature.utils',
    'row-aggregation/rowAggregationFeature.utils',
  ],
  'column-resizing': ['column-sizing/columnSizingFeature.utils'],
  'global-filtering': ['column-filtering/filterFns'],
}

// The shared config sets no import resolver, and `no-restricted-paths` skips
// imports it cannot resolve, so resolve extensionless TypeScript imports here
const importPlugin = rootConfig.find(
  (/** @type {any} */ entry) => entry.plugins?.import,
)?.plugins.import

const message =
  'Call another feature through src/core/featureStubs.ts so tables that do not register it do not bundle it.'

/** @type {any} */
const config = [
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },
  {
    files: ['src/**/*.ts'],
    settings: {
      'import-x/resolver-next': [
        importPlugin.createNodeResolver({ extensions: ['.ts'] }),
      ],
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          basePath: import.meta.dirname,
          zones: [
            {
              target: 'src/core',
              from: 'src/features/**',
              except: [featureTypes],
              message,
            },
            ...features.map((feature) => ({
              target: `src/features/${feature}`,
              from: `src/features/!(${feature})/**`,
              except: [
                featureTypes,
                // Exceptions to a glob zone must be globs too
                ...(featureDependencies[feature] ?? []).map((module) =>
                  path.join(featuresDir, `${module}.*`),
                ),
              ],
              message,
            })),
          ],
        },
      ],
    },
  },
]

export default config
