# Concepts

## React Table is a "headless" UI library

React Table is a headless utility, which means out of the box, it doesn't render or supply any actual UI elements. You are in charge of utilizing the state and callbacks of the hooks provided by this library to render your own table markup. [Read this article to understand why React Table is built this way](https://medium.com/merrickchristensen/headless-user-interface-components-565b0c0f2e18). If you don't want to, then here's a quick rundown anyway:

- Separation of Concerns - Not that superficial kind you read about all the time. The real kind. React Table as a library honestly has no business being in charge of your UI. The look, feel, and overall experience of your table is what makes your app or product great. The less React Table gets in the way of that, the better!
- Maintenance - By removing the massive (and seemingly endless) API surface area required to support every UI use-case, React Table can remain small, easy-to-use and simple to update/maintain.
- Extensibility - UI presents countless edge cases for a library simply because it's a creative medium, and one where every developer does things differently. By not dictating UI concerns, React Table empowers the developer to design and extend the UI based on their unique use-case.

## The React Table instance

At the heart of every React Table is the `useTable` hook and the table `instance` object that it returns. This `instance` object contains everything you'll ever need to build a table and interact with its state. This includes, but is not limited to:

- Columns
- Materialized Data
- Sorting
- Filtering
- Grouping
- Pagination
- Expanded State
- Any functionality provided by custom plugin hooks, too!

## Rendering your own UI

As of React Table v7, **you the developer** are responsible for rendering your own UI, but don't let that intimidate you! Table UIs are fun and React Table makes it so easy to wire up your own table UI. The easiest way to learn how to build your own table UI is to [see some existing React Table examples](./examples.md)!

---

After reading about React Table's concepts, you should:

- [Check Out Some Examples](./examples.md)
- [Study the API](./api.md)
