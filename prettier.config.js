// @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-svelte'],
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
