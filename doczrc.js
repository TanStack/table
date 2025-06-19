export default {
  title: 'React Table Documentation',
  description: 'Documentation for the react-table library built in Docz',
  ignore: ['docs/README.md', 'examples/**/*.md'],
  propsParser: false,
  port: 3002,
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
}
