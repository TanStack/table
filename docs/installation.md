---
name: Installation
route: /installation
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [name: Installation
  route: /installation](#name-installation%0Aroute-installation)
- [Installation](#installation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
} from '@tanstack/react-table'
```

Once you've installed React Table, continue to [Concepts](./concepts) to read more about how to utilize its API
