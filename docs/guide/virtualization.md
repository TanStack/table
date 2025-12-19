---
title: Virtualization Guide
---

## Examples

Want to skip to the implementation? Check out these examples:

- [virtualized-columns](https://github.com/TanStack/table/tree/main/examples/react/virtualized-columns)
- [virtualized-rows (dynamic row height)](https://github.com/TanStack/table/tree/main/examples/react/virtualized-rows)
- [virtualized-rows (fixed row height)](https://github.com/TanStack/table/tree/main/examples/react/virtualized-rows)
- [virtualized-infinite-scrolling](https://github.com/TanStack/table/tree/main/examples/react/virtualized-infinite-scrolling)

## Virtualization Guide

The TanStack Table packages do not come with any virtualization APIs or features built-in, but TanStack Table can easily work with other virtualization libraries like [react-window](https://www.npmjs.com/package/react-window) or TanStack's own [TanStack Virtual](https://tanstack.com/virtual/v3). This guide will show some strategies for using TanStack Table with TanStack Virtual.
