# React Table

Hooks for building **lightweight, fast and extendable datagrids** for React

<a href="https://travis-ci.org/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-table.svg?branch=master" />
</a>
<a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-table.svg" />
</a>
<a href="https://spectrum.chat/react-table">
  <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a>
<a href="https://github.com/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-table.svg?style=social&label=Star" />
</a>
<a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

<br />
<br />

## ⚠️ Version 7
This documentation is for Version 7, which is under active development and currently in an alpha state.

## Version 6
- [Documentation](https://github.com/tannerlinsley/react-table/tree/v6)
- [HOC Documentation](https://github.com/tannerlinsley/react-table/tree/v6#hoc-extensions)
- [Examples](https://github.com/tannerlinsley/react-table/tree/master/archives/v6-examples)

## Features

- Lightweight
- Headless (Fully customizable)
- Client-side & Server-side pagination
- Multi-sort
- Filters
- Pivoting & Aggregation
- Fully controllable
- Extensible
- <a href="https://medium.com/@tannerlinsley/why-i-wrote-react-table-and-the-problems-it-has-solved-for-nozzle-others-445c4e93d4a8#.axza4ixba" target="\_parent">"Why I wrote React Table and the problems it has solved for Nozzle.io"</a> by Tanner Linsley

## Versions

- This documentation is for version 7 of react-table.
- [View the Changelog](https://github.com/tannerlinsley/react-table/blob/master/CHANGELOG.md)
- Previous versions:
  - [6.x.x Readme](https://github.com/tannerlinsley/react-table/tree/v6/)
  - [5.x.x Readme](https://github.com/tannerlinsley/react-table/blob/ad7d31cd3978eb45da7c6194dbab93c1e9a8594d/README.md)

## Sponsors

**React Table v7** is mostly planned and I (@tannerlinsley) am looking for Patreon support to make it a reality. It will require a decent time commitment on my part to not only implement it, but also help people migrate and continue to maintain it. If you would like to contribute to my Patreon goal for v7 and beyond, [visit my Patreon and help me out!](https://patreon.com/tannerlinsley).

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/platinum.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/sponsor-retool.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://nozzle.io" target="_blank">
          <img width="300" src="https://nozzle.io/img/logo-blue.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/gold-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://patreon.com/tannerlinsley" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://tryretool.com/?utm_source=sponsor&utm_campaign=react_table" target="_blank">
          <img src="https://raw.githubusercontent.com/tannerlinsley/files/master/images/patreon/silver-placeholder.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Table of Contents

- [Installation](#installation)
- [Example](#example)
- [Contributing](#contributing)

## Installation

1.  Install React Table as a dependency

```bash
# Yarn
$ yarn add react-table

# NPM
$ npm install react-table
```

2.  Import the `react-table` module

```javascript
import { useReactTable } from "react-table";
```

## Examples

[React Table v7 Sandbox](https://codesandbox.io/s/m5lxzzpz69)

# Documentation

Documentation for v7 is coming soon. If you're looking for the [v6 documentation, click here](https://github.com/tannerlinsley/react-table/tree/v6)

## Contributing

To suggest a feature, create an issue if it does not already exist.
If you would like to help develop a suggested feature follow these steps:

- Fork this repo
- Install dependencies with `$ yarn`
- Auto-build files as you edit with `$ yarn run watch`
- Implement your changes to files in the `src/` directory
- Run the <a href="https://github.com/tannerlinsley/react-story">React Story</a> locally with `$ yarn run docs`
- View changes as you edit `docs/src`
- Submit PR for review

#### Package Utilities

- `$ yarn run watch` Watches files and builds via babel
- `$ yarn run docs` Runs the storybook server
- `$ yarn run test` Runs the test suite
