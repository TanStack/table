![React Table Header](https://github.com/tannerlinsley/react-table/raw/master/media/repo-dark.png)

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

## Visit [react-table.tanstack.com](https://react-table.tanstack.com) for docs, guides, API and more!

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

## Previous Versions

### Version 6

v6 is a great library and while it is still available to install and use, I am no longer offering any long-term support for it. If you intend to keep using v6, I recommend maintaining your own fork of the library and keeping it up to date for your version of React.

#### Where are the docs for the older v6 version?

Please [visit the v6 branch](https://github.com/tannerlinsley/react-table/tree/v6)

#### I want to migrate from v6 to v7. How do I do that?

The differences between the 2 versions are incredibly massive. Unfortunately, I cannot write a one-to-one upgrade guide for any of v6's API, simply because much of it is irrelevant with v7's headless approach. The best approach for migrating to v7 is to learn its API by reading the documentation and then following some of the examples to begin building your own table component.

In case you would need to have both v6 and v7 in one app during the migration process (large codebase, complex use cases), you can either (1) fork and maintain your own local version of React Table v6 or (2) install the [`react-table-6` alias package](https://www.npmjs.com/package/react-table-6) for use alongside the `react-table` package.
