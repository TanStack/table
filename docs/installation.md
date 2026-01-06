---
title: Installation
---

Before we dig in to the API, let's get you set up!

Install your table adapter as a dependency using your favorite npm package manager.

_Only install ONE of the following packages:_

## React Table

```bash
npm install @tanstack/react-table
```

The `@tanstack/react-table` package works with React 16.8, React 17, React 18, and React 19.

> NOTE: Even though the react adapter works with React 19, it may not work with the new React Compiler that's coming out along-side React 19. This may be fixed in future TanStack Table updates.

## Vue Table

```bash
npm install @tanstack/vue-table
```

The `@tanstack/vue-table` package works with Vue 3.

## Solid Table

```bash
npm install @tanstack/solid-table
```

The `@tanstack/solid-table` package works with Solid-JS 1

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

The `@tanstack/svelte-table` package works with Svelte 3 and Svelte 4.

> NOTE: There is not a built-in Svelte 5 adapter yet, but you can still use TanStack Table with Svelte 5 by installing the `@tanstack/table-core` package and using a custom adapter from the community. See this [PR](https://github.com/TanStack/table/pull/5403) for inspiration.

## Angular Table

```bash
npm install @tanstack/angular-table
```

The `@tanstack/angular-table` package works with Angular 17. The Angular adapter uses a new Angular Signal implementation.

## Lit Table

```bash
npm install @tanstack/lit-table
```

The `@tanstack/lit-table` package works with Lit 3.

## Table Core (no framework)

```bash
npm install @tanstack/table-core
```

Don't see your favorite framework (or favorite version of your framework) listed? You can always just use the `@tanstack/table-core` package and build your own adapter in your own codebase. Usually, only a thin wrapper is needed to manage state and rendering for your specific framework. Browse the [source code](https://github.com/TanStack/table/tree/main/packages) of all of the other adapters to see how they work.
