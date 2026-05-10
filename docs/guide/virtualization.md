---
title: Virtualization Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

<!-- ::start:framework -->

# React

- [Virtualized Columns](../framework/react/examples/virtualized-columns)
- [Virtualized Rows](../framework/react/examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../framework/react/examples/virtualized-infinite-scrolling)

# Solid

- [Virtualized Columns](../framework/solid/examples/virtualized-columns)
- [Virtualized Rows](../framework/solid/examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../framework/solid/examples/virtualized-infinite-scrolling)

# Svelte

- [Virtualized Columns](../framework/svelte/examples/virtualized-columns)
- [Virtualized Rows](../framework/svelte/examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../framework/svelte/examples/virtualized-infinite-scrolling)

# Vue

- [Virtualized Columns](../framework/vue/examples/virtualized-columns)
- [Virtualized Rows](../framework/vue/examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../framework/vue/examples/virtualized-infinite-scrolling)

# Lit

- [Virtualized Columns](../framework/lit/examples/virtualized-columns)
- [Virtualized Rows](../framework/lit/examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../framework/lit/examples/virtualized-infinite-scrolling)

<!-- ::end:framework -->

Also see the [TanStack Virtual table example](https://tanstack.com/virtual/latest/docs/framework/react/examples/table).

## Virtualization Guide

The TanStack Table packages do not come with any virtualization APIs or features built-in, but TanStack Table can easily work with other virtualization libraries like [react-window](https://www.npmjs.com/package/react-window) or TanStack's own [TanStack Virtual](https://tanstack.com/virtual/v3). This guide will show some strategies for using TanStack Table with TanStack Virtual.
