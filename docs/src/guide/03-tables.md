---
name: Tables
id: tables
---

## API

[Table API](../api/table.md)

## Creating a new table

Creating a table starts with calling your adapter's exported `createTable` function:

```tsx
import { createTable } from '@tanstack/react-table'

const table = createTable()
```

`table` objects themselves are not the stateful instances you will be interacting with regularly, but they are required and used to accomplish a few things, especially if you've chosen to take advantage of its TypeScript features.

## Setting your table's `RowType`

If you are using TypeScript (recommended), you should set the `RowType` of your table to ensure typesafety in your column defs and assist with autocomplete where applicable:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable().setRowType<Person>()
```
