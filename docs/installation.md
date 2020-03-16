# Installation

Install React Table as a dependency using `npm` or `yarn`. If you'd like to
support the maintainers of React Table, please consider enabling installation
analytics with [Scarf](https://www.npmjs.com/package/@scarf/scarf) by setting
the environment variable `SCARF_ANALYTICS=true` before you install. Analytics
are turned off by default.

```bash
# If you'd like to support react-table by sending installation analytics:
$ export SCARF_ANALYTICS=true

# NPM
$ npm install react-table

# Yarn
$ yarn add react-table
```

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
