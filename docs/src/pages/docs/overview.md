---
id: overview
title: Overview
---

React Table is a collection of hooks for **building powerful tables and datagrid experiences**. These hooks are lightweight, composable, and ultra-extensible, but **do not render any markup or styles for you**. This effectively means that React Table is a "headless" UI library

## What is a "headless" UI library?

React Table is a headless utility, which means out of the box, it doesn't render or supply any actual UI elements. You are in charge of utilizing the state and callbacks of the hooks provided by this library to render your own table markup. [Read this article to understand why React Table is built this way](https://www.merrickchristensen.com/articles/headless-user-interface-components/). If you don't want to, then here's a quick explanation of why headless UI is important:

- Separation of Concerns - Not that superficial kind you read about all the time. The real kind. React Table as a library honestly has no business being in charge of your UI. The look, feel, and overall experience of your table is what makes your app or product great. The less React Table gets in the way of that, the better!
- Maintenance - By removing the massive (and seemingly endless) API surface area required to support every UI use-case, React Table can remain small, easy-to-use and simple to update/maintain.
- Extensibility - UI presents countless edge cases for a library simply because it's a creative medium, and one where every developer does things differently. By not dictating UI concerns, React Table empowers the developer to design and extend the UI based on their unique use-case.

## A Table Utility, not a Table Component

By acting as an ultra-smart table _utility_, React Table opens up the possibility for your tables to integrate into any existing theme, UI library or existing table markup. This also means that if you don't have an existing table component or table styles, React Table will help you learn to build the table markup and styles required to display great tables.
