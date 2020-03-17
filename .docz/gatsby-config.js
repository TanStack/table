const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'React Table Documentation',
    description: 'Documentation for the react-table library built in Docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [
          'Getting Started',
          'Installation',
          'Concepts',
          'Quick Start',
          {
            name: 'Examples',
            menu: ['Simple', 'Complex', 'Controlled', 'UI/Rendering'],
          },
          { name: 'API', menu: ['Overview', 'useTable'] },
          'FAQ',
          'Contributing',
          'Code of Conduct',
          'Typescript',
          'Changelog',
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: ['docs/README.md', 'examples/**/*.md'],
        typescript: false,
        ts: false,
        propsParser: false,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/jasonclark/Source/react-table/.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'React Table Documentation',
        description: 'Documentation for the react-table library built in Docz',
        host: 'localhost',
        port: 3002,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/jasonclark/Source/react-table',
          templates:
            '/Users/jasonclark/Source/react-table/node_modules/docz-core/dist/templates',
          docz: '/Users/jasonclark/Source/react-table/.docz',
          cache: '/Users/jasonclark/Source/react-table/.docz/.cache',
          app: '/Users/jasonclark/Source/react-table/.docz/app',
          appPackageJson: '/Users/jasonclark/Source/react-table/package.json',
          gatsbyConfig: '/Users/jasonclark/Source/react-table/gatsby-config.js',
          gatsbyBrowser:
            '/Users/jasonclark/Source/react-table/gatsby-browser.js',
          gatsbyNode: '/Users/jasonclark/Source/react-table/gatsby-node.js',
          gatsbySSR: '/Users/jasonclark/Source/react-table/gatsby-ssr.js',
          importsJs:
            '/Users/jasonclark/Source/react-table/.docz/app/imports.js',
          rootJs: '/Users/jasonclark/Source/react-table/.docz/app/root.jsx',
          indexJs: '/Users/jasonclark/Source/react-table/.docz/app/index.jsx',
          indexHtml:
            '/Users/jasonclark/Source/react-table/.docz/app/index.html',
          db: '/Users/jasonclark/Source/react-table/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
