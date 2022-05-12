![React Table Header](https://github.com/tanstack/react-table/raw/alpha/media/repo-dark.png)

# React Table v8 (alpha)

> This is an **alpha** version of React Table v8. It is not ready for production use, but it is ready to be taste-tested!

> [Looking for version 7? Click here!](https://github.com/tanstack/react-table/tree/v7)

Hooks for building **lightweight, fast and extendable datagrids** for React, Vue, Solid and TS/JS

<a href="https://twitter.com/intent/tweet?button_hashtag=TanStack" target="\_parent">
  <img alt="#TanStack" src="https://img.shields.io/twitter/url?color=%2308a0e9&label=%23TanStack&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Fbutton_hashtag%3DTanStack" />
</a><a href="https://github.com/tanstack/react-table/actions?table=workflow%3A%22react-table+tests%22">
<img src="https://github.com/tanstack/react-table/workflows/react-table%20tests/badge.svg" />
</a><a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/@tanstack/react-table.svg" />
</a><a href="https://bundlephobia.com/result?p=@tanstack/react-table@latest" target="\_parent">
  <img alt="" src="https://badgen.net/bundlephobia/minzip/@tanstack/react-table@latest" />
</a><a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a><a href="https://github.com/tanstack/react-table/discussions">
  <img alt="Join the discussion on Github" src="https://img.shields.io/badge/Github%20Discussions%20%26%20Support-Chat%20now!-blue" />
</a><a href="https://github.com/tanstack/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tanstack/react-table.svg?style=social&label=Star" />
</a><a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

Enjoy this library? Try them all! [React Query](https://github.com/tannerlinsley/react-query), [React Form](https://github.com/tannerlinsley/react-form), [React Charts](https://github.com/tannerlinsley/react-charts)

## Visit [/docs](https://github.com/tanstack/react-table/tree/alpha/docs) for docs, guides, API and more!

## Quick Features

- Agnostic core (JS/TS)
- 1st-class framework bindings for React, Vue, Solid
- ~14kb or less (with tree-shaking)
- 100% TypeScript (but not required)
- Headless (100% customizable, Bring-your-own-UI)
- Auto out of the box, opt-in controllable state
- Filters (column and global)
- Sorting (multi-column, multi-directional)
- Grouping & Aggregation
- Pivoting (coming soon!)
- Row Selection
- Row Expansion
- Column Visibility/Ordering/Pinning/Resizing
- Table Splitting
- Animatable
- Virtualizable
- Server-side/external data model support

## Notable Changes

- Full rewrite to TypeScript
- Removal of plugin system to favor more inversion of control
- Vastly larger and improved API
- Better controlled state management
- Better support for server-side operations
- Complete (but optional) data pipeline control
- Agnostic Core
- Framework Adapters

## Migration

There are a fair amount of breaking changes (they're worth it, trust us!):

- Turns out that TypeScript makes your code **a lot** better/safer, but also usually requires breaking changes to architecture.
- Plugin system has been removed so plugins must be rewritten to wrap/compose the new `useTable` hook. Contact us if you need help!
- Column configuration options have changed, but only slightly.
- Table options are mostly the same, with some larger changes around optional state management/control and data pipeline control
- The `tableInstance` while similar in spirit to v7 has been reconfigured to be much faster.

## Todo (in order of priority)

- [x] Rewrite Core
  - [x] Core
  - [x] Columns
  - [x] Headers
  - [x] Visibility
  - [x] Pinning
  - [x] Filters
  - [x] Sorting
  - [x] Grouping
  - [x] Expanding
  - [x] Column Sizing
  - [x] Pagination
  - [x] Row Selection
- [ ] Migrate [Examples](https://github.com/tanstack/react-table/tree/alpha/examples)
  - [x] column-visibility
  - [x] column-ordering
  - [x] column-pinning
  - [x] basic
  - [x] filters
  - [x] sorting
  - [x] pagination
  - [x] pagination-controlled
  - [x] column-sizing
  - [x] row-selection
  - [x] expanding
  - [x] grouping-and-aggregation
  - [x] editable-data
  - [ ] kitchen-sink
  - [ ] row-dnd
  - [ ] streaming-rows
  - [ ] sub-components
  - [ ] virtualized-rows
  - [ ] absolute-layout
  - [ ] block-layout
  - [ ] animated-framer-motion
  - [ ] bootstrap
  - [ ] bootstrap-ui-components
  - [ ] data-driven-classes-and-styles
  - [ ] full-width-resizable-table
  - [ ] full-width-table
  - [ ] material-ui-components
  - [ ] material-UI-enhanced-table
- [ ] [Documentation](https://github.com/tanstack/react-table/tree/alpha/docs/)
  - [x] Core
  - [ ] Columns
  - [ ] Headers
  - [ ] Rows
  - [ ] Cells
  - [ ] Column Visibility
  - [x] Column Pinning
  - [x] Filters
  - [ ] Sorting
  - [ ] Grouping
  - [ ] Expanding
  - [ ] Column Resizing
  - [ ] Pagination
  - [x] Row Selection

## Installation

```bash
npm install @tanstack/react-table@alpha
# or
yarn add @tanstack/react-table@alpha
```

## How to help?

- Try out the already-migrated examples
- Try it out in your own projects.
- Introspect the types! Even without the docs finished, the library ships with 100% typescript to help you explore its capabilities.
- [Read the contribution guidelines](https://github.com/tanstack/react-table/tree/alpha/CONTRIBUTING.md)
- Write some docs! Start with the [API docs](https://github.com/tanstack/react-table/tree/alpha/docs/docs/api-reference) and try adding some information about one or more of the features. The types do a decent job of showing what's supported and the capabilities of the library.
- Try your hand at migrating an example to v8! The todo list for the examples is above!
- **Using a plugin?** Try rewriting your plugin (v8 doesn't have a plugin system any more) as a wrapping hook/function that uses `useTable` internally. The new API is much more powerful and easier to compose. If you find something you can't figure out, let us know and we'll add it to the API.

### [Become a Sponsor](https://github.com/sponsors/tannerlinsley/)

<!-- USE THE FORCE, LUKE -->
