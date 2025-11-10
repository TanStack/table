---
title: Overview
---

TanStack Table's core is **framework agnostic**, which means its API is the same regardless of the framework you're using. Adapters are provided to make working with the table core easier depending on your framework. See the Adapters menu for available adapters.

## Typescript

While TanStack Table is written in [TypeScript](https://www.typescriptlang.org/), using TypeScript in your application is optional (but recommended as it comes with outstanding benefits to both you and your codebase)

## Headless

As it was mentioned extensively in the [Intro](../introduction.md) section, TanStack Table is **headless**. This means that it doesn't render any DOM elements, and instead relies on you, the UI/UX developer to provide the table's markup and styles. This is a great way to build a table that can be used in any UI framework, including React, Vue, Solid, Svelte, Qwik, and even JS-to-native platforms like React Native!

## Core Objects and Types

The table core uses the following abstractions, commonly exposed by adapters:

- Column Defs
  - Objects used to configure a column and its data model, display templates, and more
- Table
  - The core table object containing both state and API
- Table Data
  - The core data array you provide the table
- Columns
  - Each column mirrors its respective column def and also provides column-specific APIs
- Rows
  - Each row mirrors its respective row data and provides row-specific APIs
- Header Groups
  - Header groups are computed slices of nested header levels, each containing a group of headers
- Headers
  - Each header is either directly associated with or derived from its column def and provides header-specific APIs
- Cells
  - Each cell mirrors its respective row-column intersection and provides cell-specific APIs

There are even more structures that pertain to specific features like filtering, sorting, grouping, etc, which you can find in the [features](../guide/features.md) section.
