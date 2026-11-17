/**
 * This babel.config is not used for publishing.
 * It's only for the local editing experience
 * (and linting)
 */
const { buildMacros } = require('@embroider/macros/babel')

const macros = buildMacros()

module.exports = {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...macros.templateMacros],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
}
