---
title: Installation
---

Before we dig in to the API, let's get you set up!

Install your table adapter as a dependency using your preferred package manager:

<!-- ::start:tabs variant="package-managers" -->

react: @tanstack/react-table@beta
preact: @tanstack/preact-table@beta
vue: @tanstack/vue-table@beta
solid: @tanstack/solid-table@beta
svelte: @tanstack/svelte-table@beta
angular: @tanstack/angular-table@beta
ember: @tanstack/ember-table@beta
lit: @tanstack/lit-table@beta
alpine: @tanstack/alpine-table@beta

<!-- ::end:tabs -->

> [!IMPORTANT]
> TanStack Table v9 is currently in beta, so the `@beta` dist-tag is required. If you omit it, your package manager will install the `latest` tag, which is still v8, and none of the v9 APIs documented here will exist.

<!-- ::start:framework -->

# React

The `@tanstack/react-table` package works with React 18 or newer.

# Preact

The `@tanstack/preact-table` package works with Preact 10 or newer.

# Vue

The `@tanstack/vue-table` package works with Vue 3.2 or newer.

# Solid

The `@tanstack/solid-table` package works with Solid 1.3 or newer.

# Svelte

The `@tanstack/svelte-table` package works with Svelte 5 (it is built on runes). For Svelte 3/4 support, use TanStack Table v8.

# Angular

The `@tanstack/angular-table` package works with Angular 19 or newer. The Angular adapter is built on Angular Signals.

# Ember

The `@tanstack/ember-table` package is a v2 addon that works with Ember 5.8 or newer (Embroider or ember-auto-import v2). It is built on Glimmer's tracking system and supports `.gts`/`.gjs` template tag components and Glint.

# Lit

The `@tanstack/lit-table` package works with Lit 3 (3.1.3 or newer) and also requires `@lit/context` as a peer dependency.

# Alpine

The `@tanstack/alpine-table` package works with Alpine 3.

<!-- ::end:framework -->

Don't see your favorite framework (or favorite version of your framework) listed? You can always just use the `@tanstack/table-core` package and build your own adapter in your own codebase. Usually, only a thin wrapper is needed to manage state and rendering for your specific framework. Browse the [source code](https://github.com/TanStack/table/tree/beta/packages) of all of the other adapters to see how they work.
