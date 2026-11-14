import { buildMacros } from '@embroider/macros/babel'

const macros = buildMacros({
  configure(config) {
    if (process.env.EMBER_ENV === 'test') {
      config.enableRuntimeMode()
    }
  },
})

export default {
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
          import: import.meta.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: import.meta.dirname,
      },
    ],
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
}
