---
title: Installation
---

Before we dig in to the API, let's get you set up!

Install your table adapter as a dependency using your favorite npm package manager

## Qwik Table

```bash
npm install @tanstack/qwik-table
```

## React Table

```bash
npm install @tanstack/react-table
```

## Solid Table

```bash
npm install @tanstack/solid-table
```

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

## Vue Table

```bash
npm install @tanstack/vue-table
```

## Table Core (no framework)

```bash
npm install @tanstack/table-core
```

Don't see your favorite framework (or favorite version of your framework) listed? You can always just use the `@tanstack/table-core` package and build your own adapter in your own codebase. Usually, only a thin wrapper is needed to manage state and rendering for your specific framework. Browse the [source code](https://github.com/TanStack/table/tree/main/packages) of all of the other adapters to see how they work.