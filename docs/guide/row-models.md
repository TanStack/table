---
title: Row Models
---

## Row Models Guide

If you take a look at the most basic example of TanStack Table, you'll see a code snippet like this:

```ts
import {
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //row model
  })
}
```

What is this `getCoreRowModel` function? And why do you have to import it from TanStack Table only to just pass it back to itself?

Well the answer is that TanStack Table is a modular library. Not all code for every single feature is included in the createTable functions/hooks by default. You only need to import and include the code that you will need. 