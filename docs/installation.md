---
name: Installation
route: /installation
---

# Installation

Install React Table as a dependency using `npm` or `yarn`

```bash
# NPM
$ npm install react-table

# Yarn
$ yarn add react-table
```

React Table uses [Scarf](https://www.npmjs.com/package/@scarf/scarf) to collect
anonymized installation analytics. These anlytics help support the maintainers
of this library. However, if you'd like to opt out, you can do so by setting the
environment variable `SCARF_ANALYTICS=false` before you install, or by setting
`scarfSettings.enabled = false` in your project's `package.json`

To import React Table:

```js
import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
  ...
} from 'react-table'
```

Once you've installed React Table, continue to [Concepts](./concepts.md) to read more about how to utilize its API
