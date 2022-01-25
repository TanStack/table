![React Table Header](https://github.com/tannerlinsley/react-table/raw/alpha/media/repo-dark.png)

Hooks for building **lightweight, fast and extendable datagrids** for React

<a href="https://twitter.com/intent/tweet?button_hashtag=TanStack" target="\_parent">
  <img alt="#TanStack" src="https://img.shields.io/twitter/url?color=%2308a0e9&label=%23TanStack&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Fbutton_hashtag%3DTanStack" />
</a><a href="https://github.com/tannerlinsley/react-table/actions?table=workflow%3A%22react-table+tests%22">
<img src="https://github.com/tannerlinsley/react-table/workflows/react-table%20tests/badge.svg" />
</a><a href="https://npmjs.com/package/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/react-table.svg" />
</a><a href="https://bundlephobia.com/result?p=react-table@latest" target="\_parent">
  <img alt="" src="https://badgen.net/bundlephobia/minzip/react-table@latest" />
</a><a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a><a href="https://github.com/tannerlinsley/react-table/discussions">
  <img alt="Join the discussion on Github" src="https://img.shields.io/badge/Github%20Discussions%20%26%20Support-Chat%20now!-blue" />
</a><a href="https://github.com/tannerlinsley/react-table" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-table.svg?style=social&label=Star" />
</a><a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

Enjoy this library? Try them all! [React Query](https://github.com/tannerlinsley/react-query), [React Form](https://github.com/tannerlinsley/react-form), [React Charts](https://github.com/tannerlinsley/react-charts)

## Visit [react-table-v8.tanstack.com](https://react-table-v8.tanstack.com) for docs, guides, API and more!

## Quick Features

- Lightweight (5kb - 14kb+ depending on features used and tree-shaking)
- Headless (100% customizable, Bring-your-own-UI)
- Auto out of the box, fully controllable API
- Sorting (Multi and Stable)
- Filters
- Pivoting & Aggregation
- Row Selection
- Row Expansion
- Column Ordering
- Animatable
- Virtualizable
- Resizable
- Server-side/controlled data/state
- Extensible via hook-based plugin system

### [Become a Sponsor](https://github.com/sponsors/tannerlinsley/)

# React Table v8 (alpha)

> [Looking for version 7? Click here!](https://github.com/tanstack/react-table/tree/v7)

This is an **alpha** version of React Table v8. It is not ready for production use, but it is ready to be taste-tested!

## Notable Changes

- Full rewrite to TypeScript
- Removal of plugin system
- Much more inversion of control
- More stable and feature complete API
- Better controlled state management
- Better support for server-side operations

## Migration

Currently migration will involve rewrites to:

- Any table logic and API surrounding the `useTable` hook
- Any custom plugins must be rewritten to wrap/compose the new `useTable` hook
- Table markup API must be rewritten to use the new API. Don't worry, this is not as big of a deal as it sounds :)

## Todo (in order of priority)

- [ ] Rewrite Core
  - [x] Core
  - [x] Columns
  - [x] Headers
  - [x] Visibility
  - [x] Pinning
  - [x] Filters
  - [x] Sorting
  - [x] Grouping
  - [x] Expanding
  - [ ] Column Resizing
  - [ ] Pagination
  - [ ] Row Selection
- [ ] Migrate [Examples](https://github.com/tanstack/react-table/tree/alpha/examples)
  - [x] column-visibility
  - [x] column-ordering
  - [x] column-pinning
  - [x] basic
  - [x] filters
  - [x] sorting
  - [ ] grouping-and-aggregation
  - [ ] pagination
  - [ ] column-resizing
  - [ ] editable-data
  - [ ] pagination-controlled
  - [ ] kitchen-sink
  - [ ] kitchen-sink-controlled
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
- [ ] [Documentation](https://react-table-v8.tanstack.com/)
  - [ ] API
    - [ ] Core
    - [ ] Columns
    - [ ] Headers
    - [ ] Visibility
    - [ ] Pinning
    - [ ] Filters
    - [ ] Sorting
    - [ ] Grouping
    - [ ] Expanding
    - [ ] Column Resizing
    - [ ] Pagination
    - [ ] Row Selection
  - [ ] Guides
    - [ ] Core
    - [ ] Columns
    - [ ] Headers
    - [ ] Visibility
    - [ ] Pinning
    - [ ] Filters
    - [ ] Sorting
    - [ ] Grouping
    - [ ] Expanding
    - [ ] Column Resizing
    - [ ] Pagination
    - [ ] Row Selection

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
- [Read the contribution guidelines](https://gitub.com/tanstack/react-table/tree/alpha/CONTRIBUTING.md)
- Write some docs! Start with the [API docs](https://react-table-v8.tanstack.com/docs/api-reference) and try adding some information about one or more of the features. The types do a decent job of showing what's supported and the capabilities of the library.
- Try your hand at migrating an example to v8! The todo list for the examples is above!
- **Using a plugin?** Try rewriting your plugin (v8 doesn't have a plugin system any more) as a wrapping hook/function that uses `useTable` internally. The new API is much more powerful and easier to compose. If you find something you can't figure out, let us know and we'll add it to the API.

<!-- Force 2 -->
