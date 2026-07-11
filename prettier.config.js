// @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-ember-template-tag'],
  overrides: [
    { files: '*.svelte', options: { parser: 'svelte' } },
    {
      files: ['examples/angular/**/*.html'],
      options: {
        printWidth: 100,
        parser: 'angular',
      },
    },
  ],
}

export default config
